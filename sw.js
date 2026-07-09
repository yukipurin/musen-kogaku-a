const C='rikugiA-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{
 if(e.data==='SKIP_WAITING')self.skipWaiting();
});
/* ネットワーク優先：常に最新を取りに行き、オフライン時だけキャッシュにフォールバック */
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(
   fetch(e.request).then(resp=>{
     const cp=resp.clone();
     caches.open(C).then(c=>c.put(e.request,cp));
     return resp;
   }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
 );
});
