'use strict';

// ── Stripe Payment Links ─────────────────────────
const STRIPE_LINKS = {
  pro: {
    weekly:  'https://buy.stripe.com/test_00w8wOce7aCX5GQgOybMQ03',
    monthly: 'https://buy.stripe.com/test_bJe14m5PJ4ez1qAaqabMQ07',
    yearly:  'https://buy.stripe.com/test_00w5kC5PJ3av6KU41MbMQ01'
  },
  business: {
    weekly:  'https://buy.stripe.com/test_fZu4gy0vpcL5fhq2XIbMQ02',
    monthly: 'https://buy.stripe.com/test_9B6aEW1zt8uP3yIaqabMQ06',
    yearly:  'https://buy.stripe.com/test_eVq5kC7XR8uP2uE0PAbMQ00'
  }
};

// ── Plan bilgileri ───────────────────────────────
const PLAN_INFO = {
  pro: {
    weekly:  { price: '₺124,75', period: 'haftalık', name: 'Pro Haftalık' },
    monthly: { price: '₺499',    period: 'aylık',    name: 'Pro Aylık' },
    yearly:  { price: '₺2.990',  period: 'yıllık',   name: 'Pro Yıllık' }
  },
  business: {
    weekly:  { price: '₺274,75', period: 'haftalık', name: 'İş Haftalık' },
    monthly: { price: '₺1.099',  period: 'aylık',    name: 'İş Aylık' },
    yearly:  { price: '₺6.990',  period: 'yıllık',   name: 'İş Yıllık' }
  }
};

// ── Kullanıcı bilgisi ────────────────────────────
function getCurrentUser() {
  try {
    const key = Object.keys(localStorage)
      .find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return null;
    const data = JSON.parse(localStorage.getItem(key));
    return {
      id: data?.user?.id || null,
      email: data?.user?.email || null
    };
  } catch { return null; }
}

// ── Ana checkout fonksiyonu ──────────────────────
function startCheckout(plan, period) {
  const safePeriod = period || 'monthly';
  const link = STRIPE_LINKS[plan]?.[safePeriod];
  const info = PLAN_INFO[plan]?.[safePeriod];

  if (!link) {
    showCheckoutError('Bu plan şu an mevcut değil.');
    return;
  }

  const user = getCurrentUser();

  if (!user) {
    localStorage.setItem('pending_checkout', JSON.stringify({
      plan, period: safePeriod, link,
      timestamp: Date.now()
    }));
    window.location.href = 'auth.html?redirect=checkout&plan=' +
      plan + '&period=' + safePeriod;
    return;
  }

  showCheckoutModal(plan, safePeriod, info, link, user);
}

// ── Checkout onay modal ──────────────────────────
function showCheckoutModal(plan, period, info, link, user) {
  const existing = document.getElementById('checkoutModal');
  if (existing) existing.remove();

  const planEmoji = plan === 'pro' ? '⭐' : '🏢';
  const periodText = { weekly: 'haftalık', monthly: 'aylık', yearly: 'yıllık' }[period] || period;

  const yearlyNote = period === 'yearly'
    ? `<div style="background:#D1FAE5;color:#065F46;border-radius:8px;
                   padding:10px 14px;font-size:13px;font-weight:500;
                   margin-bottom:16px">
         🎁 2 ay ücretsiz — Yıllık ödemede büyük tasarruf!
       </div>`
    : '';

  const modal = document.createElement('div');
  modal.id = 'checkoutModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.6);
    display:flex;align-items:center;justify-content:center;
    backdrop-filter:blur(6px);padding:20px;
  `;

  modal.innerHTML = `
    <div style="
      background:white;border-radius:20px;
      padding:36px;max-width:420px;width:100%;
      box-shadow:0 24px 80px rgba(0,0,0,0.25);
      position:relative;
    ">
      <button onclick="document.getElementById('checkoutModal').remove()"
              style="position:absolute;top:16px;right:16px;
                     background:#F3F4F6;border:none;
                     width:32px;height:32px;border-radius:50%;
                     cursor:pointer;font-size:16px;
                     display:flex;align-items:center;justify-content:center"
              onmouseover="this.style.background='#E5E7EB'"
              onmouseout="this.style.background='#F3F4F6'">✕</button>

      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:44px;margin-bottom:12px">${planEmoji}</div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">
          ${info?.name || plan + ' ' + period}
        </div>
        <div style="font-size:32px;font-weight:800;color:#4F46E5">
          ${info?.price}
          <span style="font-size:15px;color:#9CA3AF;font-weight:500">/${periodText}</span>
        </div>
      </div>

      ${yearlyNote}

      <div style="background:#F9FAFB;border-radius:12px;padding:14px 16px;margin-bottom:20px">
        <div style="font-size:12px;color:#9CA3AF;margin-bottom:3px">Hesap</div>
        <div style="font-size:14px;font-weight:600;color:#374151">${user?.email || 'Oturum açık'}</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;font-size:13px;color:#6B7280">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:#10B981">✓</span> İstediğin zaman iptal edebilirsin
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:#10B981">✓</span> 14 gün para iade garantisi
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:#10B981">✓</span> 256-bit SSL ile güvenli ödeme
        </div>
      </div>

      <button onclick="proceedToCheckout('${link}','${plan}','${period}')"
              style="width:100%;padding:14px;
                     background:linear-gradient(135deg,#4F46E5,#7C3AED);
                     color:white;border:none;border-radius:12px;
                     font-size:15px;font-weight:700;cursor:pointer;
                     transition:opacity .2s"
              onmouseover="this.style.opacity='.9'"
              onmouseout="this.style.opacity='1'">
        🔒 Stripe ile Güvenli Ödeme
      </button>

      <div style="text-align:center;margin-top:12px;font-size:11px;color:#D1D5DB">
        Stripe altyapısı ile güvenli ödeme
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ── Stripe'a yönlendir ───────────────────────────
function proceedToCheckout(link, plan, period) {
  const btn = document.querySelector('#checkoutModal button:last-of-type');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Yönlendiriliyor...';
  }

  localStorage.setItem('pending_plan', JSON.stringify({
    plan, period, timestamp: Date.now()
  }));

  setTimeout(() => { window.location.href = link; }, 600);
}

// ── Hata göster ──────────────────────────────────
function showCheckoutError(msg) {
  const el = document.getElementById('checkout-error');
  if (el) {
    el.textContent = '❌ ' + msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  } else {
    alert(msg);
  }
}

// ── Auth sonrası bekleyen checkout ───────────────
function checkPendingCheckout() {
  const pending = localStorage.getItem('pending_checkout');
  if (!pending) return;

  try {
    const data = JSON.parse(pending);
    const age = Date.now() - (data.timestamp || 0);

    if (age > 30 * 60 * 1000) {
      localStorage.removeItem('pending_checkout');
      return;
    }

    const user = getCurrentUser();
    if (!user) return;

    localStorage.removeItem('pending_checkout');

    setTimeout(() => { startCheckout(data.plan, data.period); }, 800);
  } catch {
    localStorage.removeItem('pending_checkout');
  }
}

// ── Plan badge güncelle ──────────────────────────
function updatePlanBadge() {
  const plan = localStorage.getItem('subscription_plan');
  const badge = document.getElementById('current-plan-badge');
  if (!badge) return;

  if (plan === 'pro') {
    badge.textContent = '⭐ Pro';
    badge.style.background = '#EDE9FE';
    badge.style.color = '#5B21B6';
  } else if (plan === 'business') {
    badge.textContent = '🏢 İş';
    badge.style.background = '#D1FAE5';
    badge.style.color = '#065F46';
  } else {
    badge.textContent = '🆓 Ücretsiz';
    badge.style.background = '#EEF2FF';
    badge.style.color = '#4F46E5';
  }
  badge.style.display = 'inline-flex';
}

// ── Sayfa yüklenince ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updatePlanBadge();

  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    const pending = localStorage.getItem('pending_plan');
    if (pending) {
      try {
        const { plan, period } = JSON.parse(pending);
        localStorage.setItem('subscription_plan', plan);
        localStorage.setItem('subscription_period', period);
        localStorage.removeItem('pending_plan');
        updatePlanBadge();
      } catch {}
    }
  }

  checkPendingCheckout();
});
