const CACHE_NAME = 'magic-shop-v1'

// 安装：缓存 shell 页面
self.addEventListener('install', event => {
  self.skipWaiting()
})

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// 拦截请求：缓存优先，失败则返回缓存
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      fetch(event.request)
        .then(response => {
          // 成功则更新缓存
          if (response && response.status === 200) {
            cache.put(event.request, response.clone())
          }
          return response
        })
        .catch(() => cache.match(event.request))
    )
  )
})
