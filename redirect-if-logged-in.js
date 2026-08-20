(function () {
    try {
        var raw = localStorage.getItem('sb-ogizbfzoywylljvnidak-auth-token');
        if (raw) {
            var session = JSON.parse(raw);
            var exp = session && session.expires_at;
            if (exp && (exp * 1000) > Date.now()) {
                window.location.replace('/app');
            }
        }
    } catch (e) {}
})();
