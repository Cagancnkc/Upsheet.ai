'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

let _sb = null;
function getSb() {
  if (!_sb) _sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return _sb;
}

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });
  const { data: { user }, error } = await getSb().auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });
  req.user = user;
  next();
}

// ── Davet bilgisi (public — giriş yapmadan görülebilir) ─────────────────────
router.get('/invite-info', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token gerekli' });

  const sb = getSb();
  const { data: inv, error } = await sb
    .from('team_invitations')
    .select('id, email, status, expires_at, team_id, invited_by, teams(name)')
    .eq('token', token)
    .single();

  if (error || !inv) return res.status(404).json({ error: 'Davet bulunamadı' });
  if (inv.status !== 'pending') return res.status(410).json({ error: 'Bu davet artık geçerli değil' });
  if (new Date(inv.expires_at) < new Date()) return res.status(410).json({ error: 'Davet süresi dolmuş' });

  const { data: inviterData } = await sb.auth.admin.getUserById(inv.invited_by);
  const inviterName = inviterData?.user?.user_metadata?.first_name ||
    inviterData?.user?.email?.split('@')[0] || 'Takım yöneticisi';

  res.json({
    teamName: inv.teams?.name || 'Takım',
    inviterName,
    email: inv.email,
    expiresAt: inv.expires_at
  });
});

// ── Takım oluştur ────────────────────────────────────────────────────────────
router.post('/create', requireAuth, async (req, res) => {
  const sb = getSb();
  const userId = req.user.id;

  const { data: usage } = await sb.from('user_usage').select('plan, team_id').eq('user_id', userId).single();
  if (!usage || usage.plan !== 'business') {
    return res.status(403).json({ error: 'Takım oluşturmak için İş planı gerekli' });
  }
  if (usage.team_id) return res.status(400).json({ error: 'Zaten bir takımın var' });

  const { data: authUser } = await sb.auth.admin.getUserById(userId);
  const teamName = req.body.name ||
    ((authUser?.user?.user_metadata?.first_name || authUser?.user?.email?.split('@')[0] || 'Takım') + ' Takımı');

  const { data: team, error: tErr } = await sb.from('teams')
    .insert({ name: teamName, owner_id: userId, max_seats: 5 })
    .select().single();

  if (tErr) return res.status(500).json({ error: 'Takım oluşturulamadı' });

  await Promise.all([
    sb.from('team_members').insert({ team_id: team.id, user_id: userId, role: 'owner' }),
    sb.from('user_usage').update({ team_id: team.id, team_role: 'owner' }).eq('user_id', userId)
  ]);

  res.json({ team });
});

// ── Davet gönder ─────────────────────────────────────────────────────────────
router.post('/invite', requireAuth, async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Geçerli e-posta gerekli' });

  const sb = getSb();
  const userId = req.user.id;

  const { data: team, error: tErr } = await sb.from('teams')
    .select('id, name, max_seats')
    .eq('owner_id', userId)
    .single();

  if (tErr || !team) return res.status(403).json({ error: 'Takım sahibi değilsin' });

  const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
    sb.from('team_members').select('*', { count: 'exact', head: true }).eq('team_id', team.id).eq('status', 'active'),
    sb.from('team_invitations').select('*', { count: 'exact', head: true }).eq('team_id', team.id).eq('status', 'pending')
  ]);

  if ((memberCount || 0) + (pendingCount || 0) >= team.max_seats) {
    return res.status(429).json({ error: `Takım kapasitesi dolu (${team.max_seats} koltuk)` });
  }

  const { data: existingInv } = await sb.from('team_invitations')
    .select('status').eq('team_id', team.id).eq('email', email.toLowerCase()).single();

  if (existingInv?.status === 'pending') {
    return res.status(400).json({ error: 'Bu e-postaya zaten bekleyen bir davet var' });
  }

  const { data: inv, error: invErr } = await sb.from('team_invitations')
    .upsert({
      team_id: team.id,
      invited_by: userId,
      email: email.toLowerCase(),
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }, { onConflict: 'team_id,email' })
    .select().single();

  if (invErr) return res.status(500).json({ error: 'Davet oluşturulamadı' });

  const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
  const inviteLink = `${baseUrl}/join.html?token=${inv.token}`;

  const { data: inviterData } = await sb.auth.admin.getUserById(userId);
  const inviterName = inviterData?.user?.user_metadata?.first_name ||
    inviterData?.user?.email?.split('@')[0] || 'Takım yöneticisi';

  if (process.env.LOOPS_API_KEY) {
    fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'team_invitation_sent',
        email: email.toLowerCase(),
        teamName: team.name,
        inviterName,
        inviteLink
      })
    }).catch(e => console.error('[loops] team invite failed:', e.message));
  }

  res.json({ ok: true, inviteLink });
});

// ── Üyeler ve bekleyen davetler ──────────────────────────────────────────────
router.get('/members', requireAuth, async (req, res) => {
  const sb = getSb();
  const userId = req.user.id;

  const { data: usage } = await sb.from('user_usage').select('team_id, team_role').eq('user_id', userId).single();
  if (!usage?.team_id) return res.status(404).json({ error: 'Bir takımın yok' });

  const { data: team } = await sb.from('teams').select('id, name, max_seats, owner_id').eq('id', usage.team_id).single();
  const { data: members } = await sb.from('team_members').select('id, user_id, role, status, joined_at').eq('team_id', usage.team_id);
  const { data: invitations } = await sb.from('team_invitations')
    .select('id, email, status, expires_at, created_at')
    .eq('team_id', usage.team_id)
    .eq('status', 'pending');

  const enriched = await Promise.all((members || []).map(async (m) => {
    const { data: u } = await sb.auth.admin.getUserById(m.user_id);
    return {
      ...m,
      email: u?.user?.email || '',
      name: u?.user?.user_metadata?.first_name || u?.user?.email?.split('@')[0] || ''
    };
  }));

  res.json({
    team,
    members: enriched,
    invitations: invitations || [],
    myRole: usage.team_role,
    usedSeats: (members?.length || 0) + (invitations?.length || 0)
  });
});

// ── Daveti kabul et ──────────────────────────────────────────────────────────
router.post('/accept-invite', requireAuth, async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token gerekli' });

  const sb = getSb();
  const userId = req.user.id;

  const { data: inv } = await sb.from('team_invitations')
    .select('id, team_id, email, status, expires_at')
    .eq('token', token)
    .single();

  if (!inv) return res.status(404).json({ error: 'Davet bulunamadı' });
  if (inv.status !== 'pending') return res.status(410).json({ error: 'Bu davet artık geçerli değil' });
  if (new Date(inv.expires_at) < new Date()) return res.status(410).json({ error: 'Davet süresi dolmuş' });

  const { data: existingMember } = await sb.from('team_members')
    .select('id').eq('team_id', inv.team_id).eq('user_id', userId).single();
  if (existingMember) return res.status(400).json({ error: 'Zaten bu takımın üyesin' });

  const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
    sb.from('team_members').select('*', { count: 'exact', head: true }).eq('team_id', inv.team_id).eq('status', 'active'),
    sb.from('team_invitations').select('*', { count: 'exact', head: true }).eq('team_id', inv.team_id).eq('status', 'pending')
  ]);

  const { data: team } = await sb.from('teams').select('max_seats').eq('id', inv.team_id).single();
  if ((memberCount || 0) >= (team?.max_seats || 5)) {
    return res.status(429).json({ error: 'Takım kapasitesi dolu' });
  }

  await Promise.all([
    sb.from('team_members').insert({ team_id: inv.team_id, user_id: userId, role: 'member' }),
    sb.from('team_invitations').update({ status: 'accepted' }).eq('id', inv.id),
    sb.from('user_usage').update({ team_id: inv.team_id, team_role: 'member' }).eq('user_id', userId)
  ]);

  res.json({ ok: true });
});

// ── Üye çıkar (owner only) ────────────────────────────────────────────────────
router.post('/remove-member', requireAuth, async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: 'memberId gerekli' });

  const sb = getSb();
  const userId = req.user.id;

  const { data: team } = await sb.from('teams').select('id').eq('owner_id', userId).single();
  if (!team) return res.status(403).json({ error: 'Takım sahibi değilsin' });

  const { data: member } = await sb.from('team_members').select('user_id, role').eq('id', memberId).eq('team_id', team.id).single();
  if (!member) return res.status(404).json({ error: 'Üye bulunamadı' });
  if (member.role === 'owner') return res.status(400).json({ error: 'Takım sahibi çıkarılamaz' });

  await Promise.all([
    sb.from('team_members').delete().eq('id', memberId),
    sb.from('user_usage').update({ team_id: null, team_role: null }).eq('user_id', member.user_id)
  ]);

  res.json({ ok: true });
});

// ── Daveti iptal et (owner only) ──────────────────────────────────────────────
router.post('/cancel-invite', requireAuth, async (req, res) => {
  const { invitationId } = req.body;
  if (!invitationId) return res.status(400).json({ error: 'invitationId gerekli' });

  const sb = getSb();
  const userId = req.user.id;

  const { data: team } = await sb.from('teams').select('id').eq('owner_id', userId).single();
  if (!team) return res.status(403).json({ error: 'Takım sahibi değilsin' });

  await sb.from('team_invitations')
    .update({ status: 'cancelled' })
    .eq('id', invitationId)
    .eq('team_id', team.id);

  res.json({ ok: true });
});

module.exports = router;
