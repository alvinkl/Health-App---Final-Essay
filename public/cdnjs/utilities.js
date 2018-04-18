var firebaseURL =
    'firebasestorage.googleapis.com/v0/b/final-essay-dev.appspot.com/'

/*           HELPER SECTION        */
var isInArray = function(string, array) {
    var cachePath
    if (string.indexOf(self.origin) === 0) {
        // request targets domain where we serve the page from (i.e. NOT a CDN)
        cachePath = string.substring(self.origin.length) // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else cachePath = string // store the full request (for CDNs)

    return array.indexOf(cachePath) > -1
}

// Continue with the logic of trimming the cache
var trimCache = function(cacheName, url, totalToTrim, indexToPop) {
    caches.open(cacheName).then(cache => {
        return cache.keys().then(keys => {
            console.log(indexToPop, keys.length)
            if (!indexToPop) {
                var arr = []
                var keysURL = keys.map(function(k) {
                    return k.url
                })

                var indexKey = keysURL.findIndex(function(name) {
                    return ~name.indexOf(firebaseURL)
                })

                if (indexKey === -1) return

                while (indexKey !== -1 || arr.length === totalToTrim) {
                    console.log(keysURL.splice(indexKey, 1))
                    arr.push(indexKey)

                    indexKey = keysURL.findIndex(function(name) {
                        return ~name.indexOf(firebaseURL)
                    })
                }

                return trimCache(cacheName, url, totalToTrim, arr)
            } else if (indexToPop.length === 0) return
            else
                return cache.delete(indexToPop.splice(0, 1)).then(function() {
                    console.log(
                        '[Service Worker] Continue Trimming',
                        indexToPop
                    )
                    trimCache(cacheName, url, totalToTrim, indexToPop)
                })
        })
    })
}

// IndexedDB
var dbPromise = idb.open('feeds-store', 1, function(db) {
    if (!db.objectStoreNames.contains('feeds'))
        db.createObjectStore('feeds', { keyPath: 'id' })

    if (!db.objectStoreNames.contains('sync-feeds'))
        db.createObjectStore('sync-feeds', { keyPath: 'id' })
})

function readAllData(st) {
    return dbPromise.then(function(db) {
        var tx = db.transaction(st, 'readonly')
        var store = tx.objectStore(st)
        return store.getAll()
    })
}
