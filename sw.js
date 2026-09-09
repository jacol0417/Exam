// sw.js (請直接獨立存成這個檔案，放在根目錄)
const CACHE_NAME = 'quiz-app-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

// 1. 當 App 安裝時，把所有網頁靜態檔案塞進手機本機快取
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('正在快取網頁靜態資源...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. 當啟用時，清除舊版本的快取檔案
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('清除舊的 PWA 快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 進階 sw.js 攔截寫法：邊看邊存
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse; // 有快取就直接用

      // 沒快取，去網絡下載，並在下載成功後偷偷存一份到快取裡
      return fetch(event.request).then(networkResponse => {
        // 確保只快取自己專案的圖片或檔案
        if (event.request.url.startsWith(self.location.origin) || event.request.url.includes('images/')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone()); // 備份進手機
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});