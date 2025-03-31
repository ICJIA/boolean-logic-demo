// Disabled service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker - DISABLED VERSION');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated - DISABLED VERSION');
  
  // Delete all caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercept all fetch requests and respond with network-only
self.addEventListener('fetch', (event) => {
  console.log('Service Worker - Fetch bypassed (DISABLED)');
  // Don't do anything - let network handle it
});