const CACHE = 'markview-v1';

// ── Install: take control immediately ──────────────────────────────────────
self.addEventListener('install', () => self.skipWaiting());

// ── Activate: delete stale caches, claim clients ───────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Fetch strategy ─────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin requests; let cross-origin (CDN fonts, images) pass
  if (url.origin !== self.location.origin) return;

  // /_next/static/* — immutable content-hashed assets → cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  // HTML page navigations → network-first, fall back to cached version
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches
              .open(CACHE)
              .then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match('/');
        }),
    );
  }
});
