/* FIRE DIRECTION LAB 웹앱 — 서비스 워커
   게임 판(FIRE_DIRECTION_LAB_v*.html) · update.json · 앱 껍데기: 먼저 네트워크, 안 되면 기기에 남긴 것.
   판 파일은 이름에 판 번호가 있어 한 번 받으면 바뀌지 않는다 — 새 판을 받으면 옛 판은 지운다. */
const CACHE='fdl-pwa-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const isGame=/FIRE_DIRECTION_LAB_v[\d.]+\.html$/.test(u.pathname);
  if(isGame){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
      if(r.ok){c.put(e.request,r.clone());c.keys().then(ks=>ks.forEach(k=>{if(/FIRE_DIRECTION_LAB_v[\d.]+\.html$/.test(k.url)&&k.url!==e.request.url)c.delete(k)}))}
      return r}))));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));
});
