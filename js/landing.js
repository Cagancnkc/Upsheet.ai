// ── AKAN YAZI EFEKTİ (scroll-triggered) ─────────────────────────

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


const BIZ_BASE = { monthly: 49, yearly: 470 };
let currentPeriod = 'monthly';

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
    if (period === 'yearly') proNumEl.textContent = '278';
    else                     proNumEl.textContent = '29';
  }
  if (proPeriodEl) proPeriodEl.textContent = p.pro.period;

  if (proNoteEl) {
    proNoteEl.textContent = period === 'yearly' ? '≈ $23/ay · %20 indirim' : 'Aylık faturalandırılır';
    proNoteEl.style.display = 'block';
  }

  if (proOrigEl) {
    if (period === 'yearly') {
      proOrigEl.textContent = 'Aylık $29 yerine';
      proOrigEl.style.display = 'block';
    } else {
      proOrigEl.style.display = 'none';
    }
  }

  if (freeGiftEl)  freeGiftEl.style.display  = period === 'yearly' ? 'flex' : 'none';
  if (freeGiftBiz) freeGiftBiz.style.display = period === 'yearly' ? 'flex' : 'none';

  updateBizPrice();
}

function updateBizPrice() {
  var base = BIZ_BASE[currentPeriod] || BIZ_BASE.monthly;

  var bizPriceEl  = document.getElementById('price-biz');
  var bizPeriodEl = document.getElementById('period-biz');
  var bizOrigEl   = document.getElementById('orig-biz');
  var bizNoteEl   = document.getElementById('note-biz');

  if (bizPriceEl) {
    bizPriceEl.textContent = base.toLocaleString('tr-TR');
  }
  if (bizPeriodEl) bizPeriodEl.textContent = PRICES[currentPeriod]?.biz?.period || '/ay';

  if (bizNoteEl) {
    if (currentPeriod === 'yearly') {
      bizNoteEl.textContent = '≈ ₺' + Math.round(base / 12).toLocaleString('tr-TR') + '/ay · 2 ay ücretsiz';
    } else {
      bizNoteEl.textContent = 'Aylık faturalandırılır';
    }
    bizNoteEl.style.display = 'block';
  }

  if (bizOrigEl) {
    if (currentPeriod === 'yearly') {
      bizOrigEl.textContent = 'Aylık $49 yerine';
      bizOrigEl.style.display = 'block';
    } else {
      bizOrigEl.style.display = 'none';
    }
  }
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
