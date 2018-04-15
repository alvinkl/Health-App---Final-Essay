var STATIC_VERSION = 'Static-v1.0'
var DYNAMIC_VERSION = 'Dynamic-v1.0'

var STATIC_CACHE = [
    '/static/favicon.ico',
    '/static/manifest.json',
    '/report',
    '/diary',
    '/landing',
    '/getting-started',

    '/static/build/client.build.js',
    '/static/build/client.build.js.map',
    '/static/build/style/style.css',

    'https://fonts.gstatic.com/s/materialicons/v36/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
]

/* Start of Service Worker Events */

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker...')

    event.waitUntil(
        caches.open(STATIC_VERSION).then(function(cache) {
            console.log('[Service Worker] Precaching App Shell')
            cache.addAll(STATIC_CACHE)
        })
    )
})

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker...')

    // clearing old cache
    var removeKeys = function(keylist) {
        return Promise.all(
            keylist.map(function(key) {
                if (key !== STATIC_VERSION && key !== DYNAMIC_VERSION) {
                    console.log('[Service Worker] Removing old cache, ', key)
                    return caches.delete(key)
                }
            })
        )
    }

    event.waitUntil(caches.keys().then(removeKeys))

    return self.clients.claim()
})

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetching data...')

    if (isInArray(event.request.url, STATIC_CACHE)) {
        console.log('[Service Worker] Fetch from STATIC_CACHE')
        event.respondWith(caches.match(event.request))
    } else {
        console.log('[Service Worker] Fetch Dynamic and Cache to dynamic')
        event.respondWith(cacheAndFetchStrategy(event))
    }
})

/* End of Service Worker Events */

/*           CACHING STRATEGY        */
var cacheOnlyThenNetwork = function(event) {
    return caches.match(event.request).then(function(res) {
        if (res) return res
        return fetch(event.request).then(function(res) {
            const { url } = event.request

            if (~url.indexOf('auth/google')) return res

            return caches.open(DYNAMIC_VERSION).then(function(cache) {
                cache.put(event.request.url, res.clone())
                return res
            })
        })
    })
}

var cacheAndFetchStrategy = function(event) {
    return caches.open(DYNAMIC_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(response) {
            const { url } = event.request
            if (~url.indexOf('auth/google')) return res

            var fetchPromise = fetch(event.request).then(function(
                networkResponse
            ) {
                cache.put(event.request, networkResponse.clone())
                return networkResponse
            })

            return response || fetchPromise
        })
    })
}

/*           HELPER SECTION        */
var isInArray = function(string, array) {
    var cachePath
    if (string.indexOf(self.origin) === 0) {
        // request targets domain where we serve the page from (i.e. NOT a CDN)
        cachePath = string.substring(self.origin.length) // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else cachePath = string // store the full request (for CDNs)

    return array.indexOf(cachePath) > -1
}
