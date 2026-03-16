const CACHE = 'gresiknews-v2';
const OFFLINE_PAGE = 'https://www.gresiknews.id/';

const ASSETS = [
  'https://www.gresiknews.id/',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/gh/jettheme/js@0.5.5/main.js',
  'https://jurnalisindependen369-rgb.github.io/gresiknews-pwa/icon-192.png',
  'https://jurnalisindependen369-rgb.github.io/gresiknews-pwa/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(e.request.url.indexOf('http') !== 0) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        if(res && res.status === 200 && res.type === 'basic'){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || caches.match(OFFLINE_PAGE));
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', e => {
  const d
