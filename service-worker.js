const CACHE_NAME = "anni80-pwa-v3";

const FILES_TO_CACHE = [
  "/anni80-pwa/",
  "/anni80-pwa/index.html",
  "/anni80-pwa/manifest.json",
  "/anni80-pwa/icon-192.png",
  "/anni80-pwa/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", event => {

  // 🚫 Non intercettare richieste esterne
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // 🚫 Non intercettare navigazioni di pagina
  if (event.request.mode === "navigate") {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
