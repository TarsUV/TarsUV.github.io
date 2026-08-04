
const CACHE_NAME = "carguardian-v1";

const FILES_TO_CACHE = [
  "/app/",
  "/app/index.html",
  "/app/manifest.json",
  "/app/logo_carGuardian.png",
  "/app/logo.jpg",
  "/config/server.json"
];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cacheando archivos de CarGuardian...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Eliminando cache antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", (event) => {
  // Solo cacheamos archivos de la PWA, no las llamadas al backend
  if (event.request.url.includes("/api/") || event.request.url.includes("ngrok")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
