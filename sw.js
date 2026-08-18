// ExcelAI Service Worker
const CACHE_NAME = 'excelai-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/auth.html',
  '/app',
  '/offline.html',
  '/css/style.css',
  '/css/landing.css',
  '/js/app.js',
  '/api.js'
];

// ── Install: pre-cache static assets ─────────────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ── Fetch: Cache First, Network Fallback ─────────────────────────
self.addEventListener('fetch', function(event) {
  // Skip non-GET and API calls (always network-only for AI chat)
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        // Cache successful same-origin responses
        if (response.ok && url.origin === self.location.origin) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Network failed — show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// ── Background Sync: replay queued AI messages ────────────────────
self.addEventListener('sync', function(event) {
  if (event.tag === 'ai-message-sync') {
    event.waitUntil(replaySyncQueue());
  }
});

function replaySyncQueue() {
  return openSyncDB().then(function(db) {
    return getAllPending(db).then(function(items) {
      if (!items.length) return;

      var sends = items.map(function(item) {
        return fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload)
        }).then(function(res) {
          if (res.ok) {
            return deleteRecord(db, item.id).then(function() {
              // Notify all open clients
              return self.clients.matchAll().then(function(clients) {
                clients.forEach(function(c) {
                  c.postMessage({ type: 'sync-done', id: item.id });
                });
              });
            });
          }
        });
      });

      return Promise.allSettled(sends);
    });
  });
}

// ── IndexedDB helpers (sync store) ───────────────────────────────
function openSyncDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open('excelai-sync', 1);
    req.onupgradeneeded = function(e) {
      e.target.result.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess  = function(e) { resolve(e.target.result); };
    req.onerror    = function(e) { reject(e.target.error); };
  });
}

function getAllPending(db) {
  return new Promise(function(resolve, reject) {
    var tx    = db.transaction('pending', 'readonly');
    var store = tx.objectStore('pending');
    var req   = store.getAll();
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror   = function(e) { reject(e.target.error); };
  });
}

function deleteRecord(db, id) {
  return new Promise(function(resolve, reject) {
    var tx    = db.transaction('pending', 'readwrite');
    var store = tx.objectStore('pending');
    var req   = store.delete(id);
    req.onsuccess = function() { resolve(); };
    req.onerror   = function(e) { reject(e.target.error); };
  });
}
