// ── SUPABASE ─────────────────────────────────────────────────────
const { createClient } = supabase;
const sb = createClient(
  'https://ogizbfzoywylljvnidak.supabase.co',
  'sb_publishable_WauaqVsDx_vgHsilyJl0gg_1DvfSIzC'
);

async function googleLogin() {
  await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/app.html' }
  });
}

async function pricingCta(plan) {
  const { data } = await sb.auth.getSession();
  if (data.session) {
    location.href = 'app.html';
  } else {
    googleLogin();
  }
}

// Session check → navbar'ı güncelle
sb.auth.getSession().then(({ data }) => {
  if (data.session) {
    const actionsDiv = document.querySelector('.nav-actions');
    if (actionsDiv) {
      const name = (data.session.user.user_metadata && data.session.user.user_metadata.full_name)
        ? data.session.user.user_metadata.full_name
        : data.session.user.email.split('@')[0];
      actionsDiv.innerHTML = `
        <span style="font-size:13px;color:var(--text-muted);font-weight:500;">👋 ${name}</span>
        <a href="app.html" class="btn btn-primary btn-sm">Uygulamaya Git →</a>
      `;
    }
  }
});
// ─────────────────────────────────────────────────────────────────

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── TYPING ANIMATION ──
const messages = [
  'B sütunundaki toplamı hesapla',
  'Tabloyu en yüksekten sırala',
  'Aylık satış grafiği oluştur',
  'Boş satırları temizle'
];
const typeTextEl = document.getElementById('typeText');
const hlCells = document.querySelectorAll('.hl-cell');
let msgIdx = 0, charIdx = 0, typing = true, highlighted = false;

function typeLoop() {
  const msg = messages[msgIdx];
  if (typing) {
    if (charIdx < msg.length) {
      typeTextEl.textContent = msg.slice(0, charIdx + 1);
      charIdx++;
      const jitter = Math.floor(Math.random() * 30);
      setTimeout(typeLoop, 55 + jitter);
    } else {
      // Message complete — highlight cells
      hlCells.forEach(c => c.classList.add('hi'));
      highlighted = true;
      setTimeout(() => {
        typing = false;
        eraseLoop();
      }, 1800);
    }
  }
}

function eraseLoop() {
  const msg = messages[msgIdx];
  if (charIdx > 0) {
    charIdx--;
    typeTextEl.textContent = msg.slice(0, charIdx);
    setTimeout(eraseLoop, 25);
  } else {
    // Remove highlight
    hlCells.forEach(c => c.classList.remove('hi'));
    msgIdx = (msgIdx + 1) % messages.length;
    typing = true;
    setTimeout(typeLoop, 400);
  }
}

// Start typing after a short delay
setTimeout(typeLoop, 1200);

// ── FEATURE TABS ──
const featureItems = document.querySelectorAll('.feature-item');
const fpPanels = document.querySelectorAll('.fp-panel');
const fpBarTitle = document.getElementById('fpBarTitle');

featureItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetPanel = item.dataset.panel;
    const title = item.querySelector('.fi-title').textContent;

    featureItems.forEach(i => i.classList.remove('active'));
    fpPanels.forEach(p => p.classList.remove('active'));

    item.classList.add('active');
    const panel = document.getElementById(targetPanel);
    if (panel) panel.classList.add('active');
    fpBarTitle.textContent = title;
  });
});

// ── PRICING (3-WAY TOGGLE) ──
(function initPricing() {
  const toggle = document.getElementById('pt3Toggle');
  if (!toggle) return;

  const BASE = { starter: 199, pro: 399, max: 799 };
  const PLAN_KEYS = ['starter', 'pro', 'max'];
  const PLAN_LABELS = { starter: 'Starter', pro: 'Pro', max: 'Max' };

  let selectedInterval = 'monthly';
  let selectedPlan = 'pro';

  function getPrice(plan, interval) {
    const m = BASE[plan];
    if (interval === 'weekly')  return Math.round(m / 4);
    if (interval === 'monthly') return m;
    return Math.round(m * 12 * 0.8);
  }

  function getPeriod(interval) {
    if (interval === 'weekly')  return '/hafta';
    if (interval === 'monthly') return '/ay';
    return '/yıl';
  }

  function animateAmount(el, newVal) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'opacity .18s ease, transform .18s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      setTimeout(() => { el.style.transition = ''; }, 200);
    }, 120);
  }

  function render(animatePrices) {
    // Toggle buttons highlight
    toggle.querySelectorAll('.pt3-btn').forEach(b =>
      b.classList.toggle('pt3-active', b.dataset.interval === selectedInterval)
    );

    // Plan cards: update all prices + period simultaneously
    document.querySelectorAll('.ps-card').forEach((card, i) => {
      const plan = PLAN_KEYS[i];
      if (!plan) return;
      const price = getPrice(plan, selectedInterval);
      const period = getPeriod(selectedInterval);
      const amountEl = card.querySelector('.ps-amount');
      const periodEl  = card.querySelector('.ps-period');
      if (amountEl) {
        if (animatePrices) animateAmount(amountEl, price);
        else amountEl.textContent = price;
      }
      if (periodEl) periodEl.textContent = period;
      card.classList.toggle('ps-selected', plan === selectedPlan);
    });

    // Yearly discount note
    const note = document.getElementById('pricingDiscountNote');
    if (note) note.style.display = selectedInterval === 'yearly' ? 'block' : 'none';

    // Feature table: highlight rows matching selected plan tier
    document.querySelectorAll('.pft-row').forEach(row =>
      row.classList.toggle('pft-row-hl', row.dataset.included === selectedPlan)
    );

    // CTA label
    const ctaBtn = document.getElementById('pricingCtaBtn');
    if (ctaBtn) ctaBtn.textContent = PLAN_LABELS[selectedPlan] + ' ile Başla →';
  }

  // Toggle changes interval → all card prices update
  toggle.querySelectorAll('.pt3-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedInterval = btn.dataset.interval;
      render(true);
    });
  });

  // Card click changes selected plan tier
  document.querySelectorAll('.ps-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      selectedPlan = PLAN_KEYS[i] || selectedPlan;
      render(false);
    });
  });

  render(false);
}());


// ── COUNTER ANIMATION ──
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration, suffix, isDecimal) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    let value;
    if (isDecimal) {
      value = (eased * target).toFixed(1);
    } else {
      value = Math.round(eased * target);
      if (target >= 1000) value = value.toLocaleString('tr-TR');
    }
    if (suffix === '%') {
      el.textContent = '%' + value;
    } else {
      el.textContent = value + suffix;
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const count = el.dataset.count;
      const countDecimal = el.dataset.countDecimal;
      const suffix = el.dataset.suffix || '';

      if (countDecimal) {
        animateCounter(el, parseFloat(countDecimal), 2000, suffix, true);
      } else if (count) {
        animateCounter(el, parseInt(count), 2000, suffix, false);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count],[data-count-decimal]').forEach(el => {
  counterObserver.observe(el);
});

// ── FLOATING AI ASSISTANT ──
(function initFAI() {
  const bubble  = document.getElementById('faiBubble');
  const panel   = document.getElementById('faiPanel');
  const botIcon = document.getElementById('faiBotIcon');
  const xIcon   = document.getElementById('faiCloseIcon');
  const closeBtn= document.getElementById('faiCloseBtn');
  const input   = document.getElementById('faiInput');
  const sendBtn = document.getElementById('faiSendBtn');
  const counter = document.getElementById('faiCharCount');
  const MAX = 2000;
  if (!bubble) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    panel.style.display = '';
    bubble.classList.add('fai-open');
    botIcon.style.display = 'none';
    xIcon.style.display   = '';
    setTimeout(() => input.focus(), 80);
  }

  function close() {
    isOpen = false;
    panel.style.display = 'none';
    bubble.classList.remove('fai-open');
    botIcon.style.display = '';
    xIcon.style.display   = 'none';
  }

  bubble.addEventListener('click', () => isOpen ? close() : open());
  closeBtn.addEventListener('click', close);

  input.addEventListener('input', () => {
    if (input.value.length > MAX) input.value = input.value.slice(0, MAX);
    counter.textContent = input.value.length;
  });

  function send() {
    if (!input.value.trim()) return;
    input.value = '';
    counter.textContent = '0';
    input.focus();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  document.addEventListener('mousedown', e => {
    if (isOpen && !panel.contains(e.target) && !bubble.contains(e.target)) close();
  });
}());

// ── POLL ─────────────────────────────────────────
function selectPoll(btn) {
  document.querySelectorAll('.poll-option').forEach(function(b) {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
  var extra = document.getElementById('pollExtra');
  if (extra) {
    extra.style.display = 'flex';
    extra.style.animation = 'none';
    void extra.offsetWidth;
    extra.style.animation = '';
  }
}

function submitPoll() {
  var extra = document.getElementById('pollExtra');
  var thanks = document.getElementById('pollThanks');
  if (extra) extra.style.display = 'none';
  if (thanks) {
    thanks.style.display = 'block';
    thanks.style.animation = 'none';
    void thanks.offsetWidth;
    thanks.style.animation = '';
  }
}

// ── PRICING TOGGLE ────────────────────────────────────────────
const prices = {
  weekly: {
    pro:  { amount: '$4.99',  period: '/hafta', saving: '' },
    biz:  { amount: '$12.99', period: '/hafta', saving: '' }
  },
  monthly: {
    pro:  { amount: '$14.99', period: '/ay', saving: '' },
    biz:  { amount: '$39.99', period: '/ay', saving: '' }
  },
  yearly: {
    pro:  { amount: '$8.25',  period: '/ay', saving: 'Yıllık $99 — $81 tasarruf (%45)' },
    biz:  { amount: '$24.99', period: '/ay', saving: 'Yıllık $299 — $181 tasarruf (%38)' }
  }
};

let currentPeriod = 'monthly';

function setPeriod(period) {
  currentPeriod = period;

  // Toggle butonları güncelle
  document.querySelectorAll('.ptog-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.ptog-btn').classList.add('active');

  // Fiyatları güncelle
  const p = prices[period];

  document.getElementById('proPrice').textContent = p.pro.amount;
  document.getElementById('proPeriod').textContent = p.pro.period;
  document.getElementById('bizPrice').textContent = p.biz.amount;
  document.getElementById('bizPeriod').textContent = p.biz.period;

  // Tasarruf mesajı
  const proSaving = document.getElementById('proSaving');
  const bizSaving = document.getElementById('bizSaving');

  if (p.pro.saving) {
    proSaving.textContent = p.pro.saving;
    proSaving.style.display = 'block';
  } else {
    proSaving.style.display = 'none';
  }

  if (p.biz.saving) {
    bizSaving.textContent = p.biz.saving;
    bizSaving.style.display = 'block';
  } else {
    bizSaving.style.display = 'none';
  }
}
