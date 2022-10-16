'use strict';

function initializeWorker() {
  const cacheName = 'programming-task-app-v1';
  const appFiles = [
      './',
      './index.html',
      'CSS/styles.css',
      './app.js',
      './monitor.png',
      'Images/task-logo-medium.png',
      'Images/task-logo-large.png'
  ];

  self.addEventListener('install', (event) => {
      try {
        event.waitUntil((async () => {
          const cache = await caches.open(cacheName);
          await cache.addAll(appFiles);
        })());
      } catch(error) {
        console.error(`Service worker installation or cache error: ${error}`);
      }
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
      try {
        const cacheResponse = await caches.match(event.request);
        console.log(`[Service Worker] Fetching resources from cache: ${event.request.url}`);
        if (cacheResponse) { 
          return cacheResponse; 
        }
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource from the network: ${event.request.url}`);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch(error) {
        console.error(`Service worker fetch error: ${error}`);
      }
    })());
  });
}

initializeWorker();
