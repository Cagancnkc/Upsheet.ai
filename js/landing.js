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

// ── İŞ PLANI DİNAMİK FİYATLANDIRMA ──────────────────────────────────
var BIZ_BASE_TRY = 399;
var PER_USER_USD = 2.5;
var USD_TO_TRY = 32;
var currentUsers = 5;

function updateBizPrice(users) {
  currentUsers = users;
  var extraUsers = Math.max(0, users - 5);
  var perUserTRY = PER_USER_USD * USD_TO_TRY;
  var base = BIZ_BASE_TRY + extraUsers * perUserTRY;

  var discount = 0;
  var discountLabel = '';
  if (users >= 30)      { discount = 0.20; discountLabel = '%20 indirim uygulandı'; }
  else if (users >= 20) { discount = 0.15; discountLabel = '%15 indirim uygulandı'; }
  else if (users >= 10) { discount = 0.10; discountLabel = '%10 indirim uygulandı'; }

  var total = Math.round(base * (1 - discount));

  var priceEl    = document.getElementById('bizPrice');
  var discountEl = document.getElementById('userDiscount');
  var badgeEl    = document.getElementById('userCountBadge');
  var fillEl     = document.getElementById('userBarFill');
  var sliderEl   = document.getElementById('userSlider');

  if (priceEl)  priceEl.textContent  = '₺' + total;
  if (badgeEl)  badgeEl.textContent  = users + ' kullanıcı';
  if (sliderEl) sliderEl.value       = users;
  if (fillEl)   fillEl.style.width   = ((users - 5) / (50 - 5) * 100) + '%';
  if (discountEl) {
    discountEl.textContent = discountLabel;
    discountEl.style.display = discount > 0 ? 'block' : 'none';
  }
}

function changeUsers(delta) {
  var newVal = Math.min(50, Math.max(5, currentUsers + delta));
  updateBizPrice(newVal);
}

document.addEventListener('DOMContentLoaded', function() {
  initFlowingText();
  updateBizPrice(5);
});
