'use strict';
// ── Mini Otomasyon Durum Paneli (app.html) ──────────────────────────────────

const ACTION_LABELS = {
  slack: 'Slack', teams: 'Teams', gmail: 'E-posta',
  webhook: 'Webhook', make: 'Make', notion: 'Notion',
  airtable: 'Airtable', notification: 'Bildirim', update_cells: 'Hücre Güncelle'
};

function relTime(ts) {
  if (!ts) return null;
  const diff = Date.now() - parseInt(ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} sa önce`;
  return `${Math.floor(hr / 24)} gün önce`;
}

function lastFiredTs(ruleId) {
  return localStorage.getItem(`auto_throttle_${ruleId}`);
}

function renderAutoPanel(rules) {
  const badge   = document.getElementById('autoBarBadge');
  const summary = document.getElementById('autoBarSummary');
  const body    = document.getElementById('autoBarBody');
  if (!badge || !summary || !body) return;

  const active = rules.filter(r => r.enabled);

  badge.textContent = active.length;
  badge.style.display = active.length ? '' : 'none';

  if (!rules.length) {
    summary.textContent = 'Henüz kural yok';
  } else {
    let latestTs = null, latestName = '';
    rules.forEach(r => {
      const ts = lastFiredTs(r.id);
      if (ts && (!latestTs || parseInt(ts) > parseInt(latestTs))) {
        latestTs = ts; latestName = r.name;
      }
    });
    summary.textContent = latestTs
      ? `${active.length} aktif · Son: "${latestName}" ${relTime(latestTs)}`
      : `${active.length} aktif / ${rules.length} toplam · Henüz tetiklenmedi`;
  }

  if (!rules.length) {
    body.innerHTML = `
      <div class="auto-bar-empty">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Henüz otomasyon kuralı yok.
        <a href="automations.html">İlk kuralı oluştur →</a>
      </div>`;
    return;
  }

  body.innerHTML = rules.map(rule => {
    const ts = lastFiredTs(rule.id);
    const actions = Array.isArray(rule.action_config)
      ? rule.action_config : (rule.action_config ? [rule.action_config] : []);
    const chips = actions.slice(0, 3)
      .map(a => `<span class="auto-rule-chip">${ACTION_LABELS[a.type] || a.type}</span>`)
      .join('');
    const ago = relTime(ts);

    return `
      <div class="auto-rule-card">
        <div class="auto-rule-card-top">
          <span class="auto-rule-name" title="${rule.name}">${rule.name}</span>
          <label class="auto-pill-toggle" title="${rule.enabled ? 'Devre dışı bırak' : 'Etkinleştir'}">
            <input type="checkbox" class="auto-rule-toggle" data-id="${rule.id}" ${rule.enabled ? 'checked' : ''}>
            <span class="auto-pill-track"></span>
          </label>
        </div>
        ${chips ? `<div class="auto-rule-chips">${chips}</div>` : ''}
        <div class="auto-rule-last">
          <span class="auto-rule-last-dot ${ago ? '' : 'never'}"></span>
          ${ago || 'Hiç tetiklenmedi'}
        </div>
      </div>`;
  }).join('');

  body.querySelectorAll('.auto-rule-toggle').forEach(cb => {
    cb.addEventListener('change', async () => {
      const id = cb.dataset.id;
      cb.disabled = true;
      try {
        await window.Automations.update(id, { enabled: cb.checked });
      } catch {
        cb.checked = !cb.checked;
      } finally {
        cb.disabled = false;
      }
    });
  });
}

async function initAutoPanel() {
  const bar    = document.getElementById('autoStatusBar');
  const header = document.getElementById('autoBarHeader');
  if (!bar || !header || typeof window.Automations === 'undefined') return;

  header.addEventListener('click', () => {
    bar.classList.toggle('expanded');
    bar.classList.toggle('collapsed');
  });

  try {
    renderAutoPanel(await window.Automations.load());
  } catch {
    const s = document.getElementById('autoBarSummary');
    if (s) s.textContent = 'Yüklenemedi';
  }

  window.addEventListener('automations:evaluated', async () => {
    try { renderAutoPanel(await window.Automations.load()); } catch { /* silent */ }
  });

  let _panelLoadedAt = Date.now().toString();
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) return;
    const lastUpdate = localStorage.getItem('automations_updated');
    if (lastUpdate && lastUpdate > _panelLoadedAt) {
      _panelLoadedAt = Date.now().toString();
      try { renderAutoPanel(await window.Automations.load()); } catch { /* silent */ }
    }
  });
}

document.addEventListener('DOMContentLoaded', initAutoPanel);
