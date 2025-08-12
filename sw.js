const CACHE_NAME = 'ttrpg-card-printer-cache-v1';
const urlsToCache = [
  './', // Cache the current HTML file
  './icon-lookup.json',
  // If you have other assets (like icons) served relative to this HTML file, list them here:
  // './icon-192x192.png',
  // './icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.error('Service Worker cache addAll failed:', error))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If the request is for a different origin (e.g., a CDN),
  // let the browser handle it normally.
  if (url.origin !== self.location.origin) {
    return;
  }

  // For same-origin requests, use the cache-first strategy.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
