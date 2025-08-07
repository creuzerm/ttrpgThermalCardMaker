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
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
