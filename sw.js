'use strict'

self.importScripts('/static/cdnjs/idb.min.js')
self.importScripts('/static/cdnjs/utilities.js')

var STATIC_VERSION = 'Static-v1.0'
var DYNAMIC_VERSION = 'Dynamic-v1.0'

var STATIC_CACHE = [
    '/static/cdnjs/idb.min.js',
    '/static/cdnjs/utilities.js',

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

    if (isInArray(event.request.url, STATIC_CACHE))
        event.respondWith(caches.match(event.request))
    else event.respondWith(cacheAndFetchStrategy(event))
})

self.addEventListener('push', function(event) {
    console.log('Push Notification Received', event)

    var data = {
        title: 'New Feed!',
        content: 'Someone post new feed! Take a look!',
        openUrl: '/',
    }

    console.log(event.data.text())
    if (event.data) data = JSON.parse(event.data.text())

    var options = {
        body: data.content,
        image: data.image,
        data: {
            url: data.url,
        },
        icon: 'static/images/icons/icon-96x96.png',
        badge: 'static/images/icons/icon-96x96.png',
        dir: 'rtl',
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('sync', function(event) {
    console.log('[Service Worker] Background Syncing')
    if (event.tag === 'sync-new-feeds') {
        console.log('[Service Worker] Syncing new feeds')

        var response = readAllData('sync-posts').then(function(data) {
            for (var dt of data) {
                console.log(dt)
            }
        })

        event.waitUntil(response)
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

var firebaseURL =
    'firebasestorage.googleapis.com/v0/b/final-essay-dev.appspot.com/'

var cacheAndFetchStrategy = function(event) {
    return caches.open(DYNAMIC_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(response) {
            var { url } = event.request
            if (~url.indexOf('auth/google')) return response

            var fetchPromise = fetch(event.request).then(function(
                networkResponse
            ) {
                if (~url.indexOf(firebaseURL)) {
                    // Should trim image for more than 10
                    // trimCache(DYNAMIC_VERSION, firebaseURL, 1)
                }
                cache.put(event.request, networkResponse.clone())
                return networkResponse
            })

            return response || fetchPromise
        })
    })
}
