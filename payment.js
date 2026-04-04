'use strict';

const PAYMENT_API = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://upsheet-ai.onrender.com';

// Kullanıcı bilgisini al
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

// Stripe Checkout'a yönlendir
async function startCheckout(plan, period) {
  const btn = document.querySelector(
    `[data-plan="${plan}"][data-period="${period}"], #btn-checkout-${plan}-${period}`
  );

  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Yükleniyor...';
  }

  const user = getCurrentUser();

  // Giriş yapmamışsa auth sayfasına yönlendir
  if (!user) {
    localStorage.setItem('pending_plan', JSON.stringify({ plan, period }));
    window.location.href = 'auth.html?redirect=checkout&plan=' + plan + '&period=' + period;
    return;
  }

  try {
    const res = await fetch(PAYMENT_API + '/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        period,
        userEmail: user.email,
        userId: user.id
      })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Checkout oluşturulamadı');
    }

  } catch (err) {
    console.error('Checkout error:', err);

    const errEl = document.getElementById('checkout-error');
    if (errEl) {
      errEl.textContent = '❌ ' + err.message;
      errEl.style.display = 'block';
      setTimeout(() => { errEl.style.display = 'none'; }, 5000);
    } else {
      alert('Ödeme başlatılamadı: ' + err.message);
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Hemen Başla';
    }
  }
}

// Customer Portal'a yönlendir (abonelik yönetimi)
async function openCustomerPortal() {
  const customerId = localStorage.getItem('stripe_customer_id');
  if (!customerId) {
    alert('Aktif abonelik bulunamadı.');
    return;
  }

  try {
    const res = await fetch(PAYMENT_API + '/api/stripe/customer-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId })
    });
    const data = await res.json();
    if (data.url) window.open(data.url, '_blank');
  } catch (err) {
    alert('Portal açılamadı: ' + err.message);
  }
}

// Abonelik durumunu kontrol et
async function checkSubscription(sessionId) {
  try {
    const res = await fetch(
      PAYMENT_API + '/api/stripe/subscription/' + sessionId
    );
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

// Sayfa yüklenince bekleyen plan var mı kontrol et
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (sessionId && window.location.pathname.includes('payment-success')) {
    const sub = await checkSubscription(sessionId);
    if (sub?.status === 'active') {
      localStorage.setItem('subscription_plan', sub.plan);
      localStorage.setItem('subscription_period', sub.period);
      if (sub.customerId) {
        localStorage.setItem('stripe_customer_id', sub.customerId);
      }
    }
    return;
  }

  // Auth sonrası bekleyen checkout var mı?
  const pending = localStorage.getItem('pending_plan');
  if (pending && window.location.pathname.includes('auth')) {
    const planData = JSON.parse(pending);
    console.log('Bekleyen plan:', planData);
  }

  // Mevcut plan durumunu göster
  const plan = localStorage.getItem('subscription_plan');
  const planBadge = document.getElementById('current-plan-badge');
  if (planBadge && plan) {
    planBadge.textContent = plan === 'pro' ? '⭐ Pro' : '🏢 İş';
    planBadge.style.display = 'inline-flex';
  }
});
