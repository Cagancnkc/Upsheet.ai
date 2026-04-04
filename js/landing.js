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
  weekly: {
    pro:     { amount: 124.75, label: '₺124,75', period: '/hf' },
    biz:     { amount: 274.75, label: '₺274,75', period: '/hf' },
    bizBase: 274.75
  },
  monthly: {
    pro:     { amount: 499,    label: '₺499',    period: '/ay' },
    biz:     { amount: 1099,   label: '₺1.099',  period: '/ay' },
    bizBase: 1099
  },
  yearly: {
    pro:     { amount: 2990,   label: '₺2.990',  period: '/yıl' },
    biz:     { amount: 6990,   label: '₺6.990',  period: '/yıl' },
    bizBase: 6990,
    proMonthly:  249.17,
    bizMonthly:  582.50
  }
};

const BIZ_BASE = { weekly: 274.75, monthly: 1099, yearly: 6990 };
const PER_USER_TRY = 80;
let currentPeriod = 'monthly';
let currentUsers = 5;

function setPeriod(period) {
  currentPeriod = period;

  document.querySelectorAll('.lp-period-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.period === period);
  });

  var p = PRICES[period];

  var proNumEl    = document.getElementById('price-pro');
  var proPeriodEl = document.getElementById('period-pro');
  var proOrigEl   = document.getElementById('orig-pro');
  var proNoteEl   = document.getElementById('note-pro');
  var freeGiftEl  = document.getElementById('yearly-gift-pro');
  var freeGiftBiz = document.getElementById('yearly-gift-biz');

  if (proNumEl) {
    if (period === 'yearly')       proNumEl.textContent = '2.990';
    else if (period === 'monthly') proNumEl.textContent = '499';
    else                           proNumEl.textContent = '124,75';
  }
  if (proPeriodEl) proPeriodEl.textContent = p.pro.period;

  if (proNoteEl) {
    if (period === 'yearly') {
      proNoteEl.textContent = '≈ ₺249/ay · 2 ay ücretsiz';
    } else if (period === 'monthly') {
      proNoteEl.textContent = 'Aylık faturalandırılır';
    } else {
      proNoteEl.textContent = 'Haftalık faturalandırılır';
    }
    proNoteEl.style.display = 'block';
  }

  if (proOrigEl) {
    if (period === 'yearly') {
      proOrigEl.textContent = 'Aylık ₺499 yerine';
      proOrigEl.style.display = 'block';
    } else {
      proOrigEl.style.display = 'none';
    }
  }

  if (freeGiftEl)  freeGiftEl.style.display  = period === 'yearly' ? 'flex' : 'none';
  if (freeGiftBiz) freeGiftBiz.style.display = period === 'yearly' ? 'flex' : 'none';

  updateBizPrice(currentUsers);
}

function updateBizPrice(users) {
  users = parseInt(users);
  currentUsers = users;

  var base = BIZ_BASE[currentPeriod] || BIZ_BASE.monthly;
  var extraUsers = Math.max(0, users - 5);
  var price = base + (extraUsers * PER_USER_TRY);

  var discountRate = 0;
  var discountLabel = '';
  if (users >= 30)      { discountRate = 0.20; discountLabel = '%20'; }
  else if (users >= 20) { discountRate = 0.15; discountLabel = '%15'; }
  else if (users >= 10) { discountRate = 0.10; discountLabel = '%10'; }

  if (discountRate > 0) price = price * (1 - discountRate);

  var bizPriceEl   = document.getElementById('price-biz');
  var bizPeriodEl  = document.getElementById('period-biz');
  var bizOrigEl    = document.getElementById('orig-biz');
  var bizNoteEl    = document.getElementById('note-biz');
  var badgeEl      = document.getElementById('userCountBadge');
  var discountEl   = document.getElementById('userDiscount');
  var discountText = document.getElementById('discountText');
  var fillEl       = document.getElementById('userBarFill');
  var sliderEl     = document.getElementById('userSlider');
  var minusBtn     = document.getElementById('userMinus');
  var plusBtn      = document.getElementById('userPlus');

  if (bizPriceEl) {
    var formatted = price % 1 === 0
      ? price.toLocaleString('tr-TR')
      : price.toFixed(2).replace('.', ',');
    bizPriceEl.textContent = formatted;
  }
  if (bizPeriodEl) bizPeriodEl.textContent = PRICES[currentPeriod]?.biz?.period || '/ay';
  if (badgeEl)     badgeEl.textContent     = users + ' kullanıcı';
  if (sliderEl)    sliderEl.value          = users;

  if (bizNoteEl) {
    if (currentPeriod === 'yearly') {
      bizNoteEl.textContent = '≈ ₺' + Math.round(price / 12).toLocaleString('tr-TR') + '/ay · 2 ay ücretsiz';
      bizNoteEl.style.display = 'block';
    } else if (currentPeriod === 'monthly') {
      bizNoteEl.textContent = 'Aylık faturalandırılır';
      bizNoteEl.style.display = 'block';
    } else {
      bizNoteEl.textContent = 'Haftalık faturalandırılır';
      bizNoteEl.style.display = 'block';
    }
  }

  if (bizOrigEl) {
    if (currentPeriod === 'yearly') {
      bizOrigEl.textContent = 'Aylık ₺1.099 yerine';
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

// ── DEMO ANİMASYONU ──────────────────────────────────────────────────
function activateStep(num) {
  for (var i = 1; i <= 3; i++) {
    var s = document.getElementById('step' + i);
    var f = document.getElementById('frame' + i);
    if (s) s.classList.toggle('active', i === num);
    if (f) f.classList.toggle('active', i === num);
  }
  if (num === 2) startTypingAnim();
}

function startTypingAnim() {
  var text = "B sütununun toplamını C1'e yaz";
  var el = document.getElementById('typingText');
  var ai = document.getElementById('aiBubble');
  if (!el) return;
  el.textContent = '';
  if (ai) ai.classList.add('hidden');
  var i = 0;
  var interval = setInterval(function() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
      setTimeout(function() {
        if (ai) ai.classList.remove('hidden');
      }, 600);
    }
  }, 60);
}

var demoInterval;
function startDemoLoop() {
  var current = 1;
  demoInterval = setInterval(function() {
    current = current >= 3 ? 1 : current + 1;
    activateStep(current);
  }, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
  initFlowingText();
  setPeriod('monthly');
  updateBizPrice(5);

  var demoSection = document.querySelector('.lp-demo-section');
  if (demoSection) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        startDemoLoop();
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(demoSection);
  }
});
