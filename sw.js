const STATIC_VERSION = 'Static-v1.0'
const DYNAMIC_VERSION = 'Dynamic-v1.0'

const STATIC_CACHE = [
    '/static/favicon.ico',
    '/static/manifest.json',
    '/',

    '/static/build/client.build.js',
]

self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...')

    event.waitUntil(
        caches.open(STATIC_VERSION).then(cache => {
            cache.addAll(STATIC_CACHE)
        }),
    )
})

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...')
    return self.clients.claim()
})

self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetching something...', event)
    event.respondWith(cachingStrategy(event))
})

/*           CACHING STRATEGY        */
const cachingStrategy = event => {
    console.log(
        event.request.url,
        STATIC_CACHE,
        isInArray(event.request.url, STATIC_CACHE),
    )
    if (isInArray(event.request.url, STATIC_CACHE))
        return caches.match(event.request)

    return caches.match(event.request).then(response => {
        if (response) return response

        return fetch(event.request)
    })
}

/*           HELPER SECTION        */
const isInArray = (string, array) => {
    let cachePath
    if (string.indexOf(self.origin) === 0) {
        // request targets domain where we serve the page from (i.e. NOT a CDN)
        cachePath = string.substring(self.origin.length) // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else cachePath = string // store the full request (for CDNs)

    return array.indexOf(cachePath) > -1
}
