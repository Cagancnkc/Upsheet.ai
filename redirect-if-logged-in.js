(function () {
  try {
    var raw = localStorage.getItem('sb-ogizbfzoywylljvnidak-auth-token');
    if (!raw) return;
    var session = JSON.parse(raw);
    var exp = session && session.expires_at;
    if (!exp || (exp * 1000) <= Date.now()) return;

    function updateNav() {
      // index.html: .nav-cta içindeki butonları gizle, "Dashboard'a Dön" ekle
      var navCta = document.querySelector('.nav-cta');
      if (navCta) {
        var btns = navCta.querySelectorAll('a.btn');
        btns.forEach(function(b) { b.style.display = 'none'; });
        var dash = document.createElement('a');
        dash.href = '/app';
        dash.className = 'btn btn-dark';
        dash.textContent = 'Dashboard\'a Dön →';
        navCta.appendChild(dash);
      }

      // Diğer sayfalar: .lp-nav-cta href ve metni güncelle
      var lpCta = document.querySelector('.lp-nav-cta');
      if (lpCta) {
        lpCta.href = '/app';
        lpCta.textContent = '→ Dashboard\'a Dön';
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateNav);
    } else {
      updateNav();
    }
  } catch (e) {}
})();
