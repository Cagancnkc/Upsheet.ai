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

document.addEventListener('DOMContentLoaded', initFlowingText);
