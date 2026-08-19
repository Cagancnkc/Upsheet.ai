(function () {
  var SUPABASE_URL = 'https://ogizbfzoywylljvnidak.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naXpiZnpveXd5bGxqdm5pZGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzUxMjcsImV4cCI6MjA4ODY1MTEyN30.Vxu4ffDrG1nHR02vEbMeFKFHqUNYfVA9vBMyQmZj41k';

  function runCheck() {
    var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    sb.auth.getSession().then(function (result) {
      if (result.data && result.data.session) {
        window.location.replace('/app');
      }
    });
  }

  if (window.supabase) {
    runCheck();
  } else {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = runCheck;
    document.head.appendChild(s);
  }
})();
