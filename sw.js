/* Portfolio service worker — v2
   HTML/navigations: NETWORK-FIRST (content updates show immediately), cache as offline fallback.
   Static assets (css/js/images/fonts): cache-first with background refresh for speed. */
const V = "site-v2";
const SHELL = ["/", "/browse", "/styles.css", "/netflix-styles.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  const isHTML = e.request.mode === "navigate" || u.pathname.endsWith(".html") || u.pathname.endsWith("/") ||
                 !/\.[a-z0-9]+$/i.test(u.pathname) || u.pathname.endsWith(".json") || u.pathname.endsWith(".xml");
  if (isHTML) {
    e.respondWith(
      fetch(e.request).then((r) => { caches.open(V).then((c) => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request).then((r) => { caches.open(V).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => cached);
      return cached || fresh;
    })
  );
});
