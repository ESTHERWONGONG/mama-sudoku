const CACHE='mama-sudoku-v3';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mama-sudoku-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin||event.request.mode!=='navigate')return;
 const cached=caches.match('./index.html');
 const fresh=fetch(event.request).then(async response=>{if(response.ok&&response.type==='basic'){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}return response;});
 event.waitUntil(fresh.then(()=>{}).catch(()=>{}));
 event.respondWith(cached.then(saved=>{const network=fresh.then(response=>response.ok?response:(saved||response)).catch(()=>{if(saved)return saved;throw new Error('Offline without a cached game');});return saved?Promise.race([network,new Promise(resolve=>setTimeout(()=>resolve(saved),1200))]):network;}));
});
