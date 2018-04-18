import to from './asyncAwait'

const dbPromise = window.idb.open('feeds-store', 1, function(db) {
    if (!db.objectStoreNames.contains('feeds'))
        db.createObjectStore('feeds', { keyPath: 'id' })

    if (!db.objectStoreNames.contains('sync-feeds'))
        db.createObjectStore('sync-feeds', { keyPath: 'id' })
})

const writeData = (st, data) => {
    const db = dbPromise

    const tx = db.transaction(st, 'readwrite')
    const store = tx.objectStore(st)

    store.put(data)

    return tx.complete
}

export const backgroundSync = async (storeName, data) => {
    if ('serviceWorker' in window.navigator && 'SyncManager' in window) {
        const swReg = await window.navigator.serviceWorker.ready

        const [err, dt] = await to(writeData(storeName, data))
        if (err) return Promise.reject('Failed to add new feed to sync')

        await swReg.sync.register('sync-new-feeds')
        return Promise.resolve(dt)
    }

    return Promise.reject('SyncManager is not supported in this device!')
}
