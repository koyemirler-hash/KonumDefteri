const CACHE_VERSION = "konum-v1.0.0"; // bunu değiştirince otomatik güncellenir
const BASE = "/KonumDefteri";
const ASSETS = [
  BASE + "/",
  BASE + "/index.html",
  BASE + "/manifest.json",
  BASE + "/icon-192.png",
  BASE + "/icon-512.png",
];

// Yükle: yeni SW hemen devreye gir
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

// Aktifleş: eski cache'leri sil, hemen kontrol al
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Güncelleme kontrolü: her SW activate'te açık sekmelere haber ver
self.addEventListener("activate", () => {
  self.clients.matchAll({type:"window"}).then(clients => {
    clients.forEach(c => c.postMessage({type:"SW_UPDATED"}));
  });
});

self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = e.request.url;
  // Firebase ve Google API'lerini cache'leme
  if(url.includes("firebase") || url.includes("googleapis") || url.includes("gstatic")) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
