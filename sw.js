'use strict';

function initializeWorker() {
  const cacheName = 'programming-task-app-v1';
  const appFiles = [
      './',
      './index.html',
      'CSS/styles.css',
      'manifest.webmanifest',
      './app.js',
      './monitor.png',
      'Images/task-logo-small.png',
      'Images/task-logo-medium.png',
      'Images/task-logo-large.png',
      'Audio/beep.wav'
  ];

  self.addEventListener('install', (event) => {
      async function cacheFiles() {
          const cache = await caches.open(cacheName);
          await cache.addAll(appFiles);
      }
      event.waitUntil(cacheFiles().catch((error) => {
          console.error(`Service Worker cache error: ${error}`);
      }));
  });

  self.addEventListener('fetch', (event) => {
      let request = event.request;
      //Remove range header from audio file to avoid cache issue
      /*
      if (request.headers.has('range')) {
        const newHeaders = new Headers(request.headers);
        newHeaders.delete('range');
        request = new Request(
          request.url, { 
          body: request.body,
          method: request.method,
          mode: request.mode,
          headers: newHeaders
        });
      }
      */
      async function getFiles() {
          const cacheResponse = await caches.match(request);
          console.log(`Service Worker fetching resources from cache: ${request.url}`);
          if (cacheResponse) { 
            return cacheResponse; 
          }
          const networkResponse = await fetch(request);
          const cache = await caches.open(cacheName);
          console.log(`Service Worker caching new resource from the network: ${request.url}`);
          cache.put(request, networkResponse.clone()).catch((error) => {
            console.error(error);
          });
          return networkResponse;
      }
      event.respondWith(getFiles().catch((error) => {
        console.error(`Network or fetch error: ${error}`);
      }));
  });
}

initializeWorker();
