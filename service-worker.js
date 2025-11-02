const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/remember/index.html",
  "/remember/style.css",
  "/remember/JavaScript.js",
  "/remember/manifest.json",
  "/remember/offline.html",
  "/remember/pic/favicon.ico",
  "/remember/nav.html",
  "/remember/pic/icon-192.png",
  "/remember/pic/icon-512.png",
  "/remember/pic/icon-192-maskable.png",
  "/remember/pic/icon-512-maskable.png",
  "/remember/y_LuSongs.html"
];


// Install Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request).then(res => res || caches.match("/remember/offline.html")))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, networkResponse.clone())
          );
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
