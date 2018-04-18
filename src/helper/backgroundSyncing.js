import idb from 'idb'
import to from './asyncAwait'

let dbPromise = null

const initIDB = () =>
    (dbPromise = window.idb.open('feeds-store', 1, function(db) {
        if (!db.objectStoreNames.contains('feeds'))
            db.createObjectStore('feeds', { keyPath: 'id' })

        if (!db.objectStoreNames.contains('sync-feeds'))
            db.createObjectStore('sync-feeds', { keyPath: 'id' })
    }))

const writeData = async (st, data) => {
    const db = await dbPromise

    const tx = db.transaction(st, 'readwrite')
    const store = tx.objectStore(st)

    store.put(data)

    return tx.complete
}

export const backgroundSync = async (storeName, data) => {
    if ('serviceWorker' in window.navigator && 'SyncManager' in window) {
        initIDB()
        const swReg = await window.navigator.serviceWorker.ready

        await writeData(storeName, data)
        await swReg.sync.register('sync-new-feeds')

        return Promise.resolve({
            message: 'Feeds will be added soon when you are online!',
        })
    }

    return Promise.reject('SyncManager is not supported in this device!')
}
