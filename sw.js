const cacheName = 'programming-task-app-v1';
const appFiles = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './monitor.png',
    './taskLogo.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app files and content');
      await cache.addAll(appFiles);
    })());
  });

  self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resources from cache: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource from the network: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });
