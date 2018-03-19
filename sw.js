var STATIC_VERSION = 'Static-v1.0'
var DYNAMIC_VERSION = 'Dynamic-v1.0'

var STATIC_CACHE = [
    '/static/favicon.ico',
    '/static/manifest.json',
    '/',
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

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker...')

    event.waitUntil(
        caches.open(STATIC_VERSION).then(function(cache) {
            console.log('[Service Worker] Precaching App Shell')
            STATIC_CACHE.map(c => cache.add(c))
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
        event.respondWith(caches.match(event.request))
    } else {
        event.respondWith(
            caches.match(event.request).then(function(res) {
                if (res) return res
                return fetch(event.request).then(function(res) {
                    return caches.open(DYNAMIC_VERSION).then(function(cache) {
                        cache.put(event.request.url, res.clone())
                        return res
                    })
                })
            })
        )
    }
})

/*           CACHING STRATEGY        */
var cachingStrategy = function(event) {}

var fetchAndCache = function(event) {
    return fetch(event.request).then(function(res) {
        console.log('[Service Worker] Caching Dynamic Content')
        return caches.open(DYNAMIC_VERSION).then(function(cache) {
            cache.put(event.request.url, res.clone())
            return res
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
