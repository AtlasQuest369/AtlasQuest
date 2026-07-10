// Bump ce numéro à chaque release notable : l'ancien cache est purgé à
// l'activation et la nouvelle version arrive dès la réouverture (QA-RELEASE §5).
const CACHE_NAME = 'ineskids-v20';
const ASSETS = [
  './',
  './index.html',
  './worldmap.js',
  './manifest.json',
  './privacy.html',
  './terms.html',
  './fonts/fredoka.woff2',
  './fonts/cairo.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isAppCode = event.request.mode === 'navigate'
    || url.pathname === '/' || url.pathname.endsWith('/')
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('.js');

  // Network-first for the app shell (HTML + JS): updates appear immediately
  // when online, with offline fallback to the cached copy.
  if (sameOrigin && isAppCode) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // Cache-first for other static assets (icons, images…) — fast & offline.
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        if (response && response.status === 200 && sameOrigin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached)
    )
  );
});
