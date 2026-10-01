// Vijayaraghavan K Portfolio - Progressive Web App Service Worker
const CACHE_NAME = "vijay-portfolio-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/apple-touch-icon.png",
  "/resume.pdf"
];

// Install Event: pre-cache critical shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Cache addAll warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: intelligent caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET and cross-origin requests (except Google Fonts)
  if (request.method !== "GET") return;

  // Don't intercept API routes (live weather, chat, telemetry)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // HTML Navigation: Network-first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/");
          if (fallback) return fallback;
          return new Response("Offline - Please reconnect to view live portfolio", {
            headers: { "Content-Type": "text/plain" },
            status: 503,
          });
        })
    );
    return;
  }

  // Static Assets (_next/static, fonts, icons, images): Cache-first with background revalidation
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|woff|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((network) => {
          if (network.status === 200) {
            const clone = network.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return network;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
