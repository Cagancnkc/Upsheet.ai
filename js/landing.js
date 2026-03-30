// ── AKAN YAZI EFEKTİ (scroll-triggered) ──────────────────────────

function initFlowingText() {
  var section = document.querySelector('.lp-flowing-text');
  var words = document.querySelectorAll('.flow-word');
  if (!section || !words.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateWords(words);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(section);
}

function animateWords(words) {
  var delay = 0;
  words.forEach(function(word) {
    setTimeout(function() {
      word.classList.remove('dim');
      word.classList.add('active');
    }, delay);
    delay += 60;
  });
}

// ── FİYAT TABLOSU ────────────────────────────────────────────────────
const PRICES = {
  weekly:  { pro: 4.99,  biz: 12.99, period: '/wk', bizBase: 12.99 },
  monthly: { pro: 14.99, biz: 39.99, period: '/mo', bizBase: 39.99 },
  yearly:  {
    pro: 9.99, biz: 24.99, period: '/mo', bizBase: 24.99,
    proOrig: 14.99, bizOrig: 39.99,
    proNote: 'billed ₺119.88/yr', bizNote: 'billed ₺299.88/yr'
  }
};

const BIZ_BASE = { weekly: 12.99, monthly: 39.99, yearly: 24.99 };
const PER_USER_USD = 2.5;
let currentPeriod = 'monthly';
let currentUsers = 5;

function setPeriod(period) {
  currentPeriod = period;

  document.querySelectorAll('.lp-period-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.period === period);
  });

  var p = PRICES[period];

  var proEl = document.getElementById('price-pro');
  var proPeriodEl = document.getElementById('period-pro');
  var proOrigEl = document.getElementById('orig-pro');

  if (proEl) proEl.textContent = p.pro.toFixed(2);
  if (proPeriodEl) proPeriodEl.textContent = p.period;
  if (proOrigEl) {
    if (period === 'yearly' && p.proOrig) {
      proOrigEl.textContent = '₺' + p.proOrig + '/mo';
      proOrigEl.style.display = 'block';
    } else {
      proOrigEl.style.display = 'none';
    }
  }

  var proNoteEl = document.getElementById('pro-yearly-note');
  if (proNoteEl) {
    proNoteEl.textContent = period === 'yearly' ? (p.proNote || '') : '';
    proNoteEl.style.display = period === 'yearly' ? 'block' : 'none';
  }

  updateBizPrice(currentUsers);
}

function updateBizPrice(users) {
  users = parseInt(users);
  currentUsers = users;

  var base = BIZ_BASE[currentPeriod] || BIZ_BASE.monthly;
  var extraUsers = Math.max(0, users - 5);
  var price = base + (extraUsers * PER_USER_USD);

  var discountRate = 0;
  var discountLabel = '';
  if (users >= 30)      { discountRate = 0.20; discountLabel = '20%'; }
  else if (users >= 20) { discountRate = 0.15; discountLabel = '15%'; }
  else if (users >= 10) { discountRate = 0.10; discountLabel = '10%'; }

  if (discountRate > 0) price = price * (1 - discountRate);

  var bizPriceEl   = document.getElementById('price-biz');
  var bizPeriodEl  = document.getElementById('period-biz');
  var bizOrigEl    = document.getElementById('orig-biz');
  var badgeEl      = document.getElementById('userCountBadge');
  var discountEl   = document.getElementById('userDiscount');
  var discountText = document.getElementById('discountText');
  var fillEl       = document.getElementById('userBarFill');
  var sliderEl     = document.getElementById('userSlider');
  var minusBtn     = document.getElementById('userMinus');
  var plusBtn      = document.getElementById('userPlus');

  if (bizPriceEl)  bizPriceEl.textContent  = price.toFixed(2);
  if (bizPeriodEl) bizPeriodEl.textContent = PRICES[currentPeriod]?.period || '/mo';
  if (badgeEl)     badgeEl.textContent     = users + ' users';
  if (sliderEl)    sliderEl.value          = users;

  if (bizOrigEl) {
    var p = PRICES[currentPeriod];
    if (currentPeriod === 'yearly' && p?.bizOrig) {
      bizOrigEl.textContent = '₺' + (p.bizOrig + extraUsers * PER_USER_USD).toFixed(2) + '/mo';
      bizOrigEl.style.display = 'block';
    } else {
      bizOrigEl.style.display = 'none';
    }
  }

  if (discountEl && discountText) {
    if (discountRate > 0) {
      discountText.textContent = discountLabel;
      discountEl.style.display = 'block';
    } else {
      discountEl.style.display = 'none';
    }
  }

  if (fillEl && sliderEl) {
    var min = parseInt(sliderEl.min);
    var max = parseInt(sliderEl.max);
    var pct = ((users - min) / (max - min)) * 100;
    fillEl.style.width = pct + '%';
  }

  if (minusBtn) minusBtn.disabled = users <= 5;
  if (plusBtn)  plusBtn.disabled  = users >= 50;
}

function changeUsers(delta) {
  var slider = document.getElementById('userSlider');
  if (!slider) return;
  var newVal = Math.min(50, Math.max(5, currentUsers + delta * 5));
  slider.value = newVal;
  updateBizPrice(newVal);
}

document.addEventListener('DOMContentLoaded', function() {
  initFlowingText();
  setPeriod('monthly');
  updateBizPrice(5);
});
