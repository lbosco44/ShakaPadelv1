const CACHE_NAME = 'shaka-padel-v3'

// On install: skip waiting so new SW activates immediately
self.addEventListener('install', () => self.skipWaiting())

// On activate: delete ALL old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Network-first strategy: always try network, fall back to cache only for navigation
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  // For JS/CSS assets: network only (they have unique hashes, never cache stale)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(fetch(event.request))
    return
  }

  // For navigation requests: network first, cache as fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone))
          return response
        })
        .catch(() => caches.match('/index.html'))
    )
  }
})
