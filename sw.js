const CACHE_NAME = 'first-gallery-v1';
const urlsToCache = [
  '/first-gallery/',
  '/first-gallery/index.html',
  '/first-gallery/static/js/main.chunk.js',
  '/first-gallery/static/css/main.chunk.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache).catch(() => {}))
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
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request).catch(() => caches.match('/first-gallery/')))
  );
});
