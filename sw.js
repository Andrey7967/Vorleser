const PREFIX = 'leser-app-25cf1f04-';
const APP_CACHE = PREFIX + '2c04abf0fea4';
const FILES = ["./","./assets/dm-sans-latin-400-normal-BwCSEQnW.woff","./assets/dm-sans-latin-400-normal-CW0RaeGs.woff2","./assets/dm-sans-latin-500-normal-B9HHJjqV.woff2","./assets/dm-sans-latin-500-normal-Dr3UlScf.woff","./assets/dm-sans-latin-600-normal-Aqo67rzb.woff2","./assets/dm-sans-latin-600-normal-BmdmIIQ2.woff","./assets/dm-sans-latin-700-normal-CUSSCpQX.woff","./assets/dm-sans-latin-700-normal-DvUfVpUG.woff2","./assets/index-CerNG7Mb.js","./assets/index-tQ6gzaGs.css","./assets/libre-baskerville-latin-400-italic-DvfstiAl.woff","./assets/libre-baskerville-latin-400-italic-Dx5Rrf3o.woff2","./assets/libre-baskerville-latin-400-normal-BTm3cn9P.woff","./assets/libre-baskerville-latin-400-normal-C42RasBZ.woff2","./assets/libre-baskerville-latin-700-normal-CLGq6Yj4.woff2","./assets/libre-baskerville-latin-700-normal-D1DCMXWx.woff","./assets/pdf-B75MOh95.js","./assets/pdf.worker.min-iDqQPrd3.mjs","./assets/space-grotesk-latin-400-normal-BnQMeOim.woff","./assets/space-grotesk-latin-400-normal-CJ-V5oYT.woff2","./assets/space-grotesk-latin-600-normal-BflQw4A9.woff","./assets/space-grotesk-latin-600-normal-DjKNqYRj.woff2","./assets/unifrakturmaguntia-latin-400-normal-BmHZTSVP.woff","./assets/unifrakturmaguntia-latin-400-normal-ColWi6tl.woff2","./bergamot/NOTICE.txt","./bergamot/worker/bergamot-translator-worker.js","./bergamot/worker/bergamot-translator-worker.wasm","./bergamot/worker/translator-worker.js","./favicon.svg","./icon-180.png","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest"];
const asset = path => new URL(path, self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(FILES.map(asset))));
});
// Preserve active reading sessions: the new version activates once old tabs close.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== APP_CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const app = await caches.open(APP_CACHE);
    const runtime = await caches.open('leser-bergamot-runtime-v2');
    const hit = await app.match(request) || await runtime.match(request);
    if (hit) return hit;
    try { return await fetch(request); }
    catch (error) {
      if (request.mode === 'navigate') {
        const fallback = await app.match(asset('./index.html'));
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
