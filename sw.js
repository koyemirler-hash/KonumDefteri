const CACHE = "konum-v3.3.0";
const BASE = "/KonumDefteri";
const STATIC = [
  BASE+"/manifest.json",
  BASE+"/icon-192.png",
  BASE+"/icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if(e.request.method!=="GET") return;
  const url = e.request.url;

  // Firebase, Google auth, googleapis → asla cache'leme
  if(url.includes("firebase")||url.includes("googleapis")||
     url.includes("gstatic")||url.includes("accounts.google")||
     url.includes("securetoken")||url.includes("identitytoolkit")){
    return; // network'e bırak
  }

  // HTML dosyaları → her zaman network'ten al (auth redirect çalışsın)
  if(url.includes(".html")||url.endsWith("/")||url===BASE||url===BASE+"/"){
    e.respondWith(
      fetch(e.request)
        .then(res=>{
          if(res&&res.status===200){
            const clone=res.clone();
            caches.open(CACHE).then(c=>c.put(e.request,clone));
          }
          return res;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  // Diğerleri → cache-first
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const net=fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone));
        }
        return res;
      }).catch(()=>cached);
      return cached||net;
    })
  );
});
