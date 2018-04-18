let db = null

export const dbPromise = (idb =>
    idb
        ? idb.open('feeds-store', 1, db => {
              if (!db.objectStoreNames.contains('feeds'))
                  db.createObjectStore('feeds', { keyPath: 'id' })

              if (!db.objectStoreNames.contains('sync-feeds'))
                  db.createObjectStore('sync-feeds', { keyPath: 'id' })
          })
        : null)(window.idb)

export const writeData = async (st, data) => {
    db = db || (await dbPromise)

    const tx = db.transaction(st, 'readwrite')
    const store = tx.objectStore(st)

    store.put(data)

    return tx.complete
}

export const readAllData = async (st, data) => {
    db = db || (await dbPromise)

    const tx = db.transaction(st, 'readonly')
    const store = tx.objectStore(st)

    return store.getAll()
}

export const clearAllData = async st => {
    db = db || (await dbPromise)

    const tx = db.transaction(st, 'readwrite')
    const store = tx.objectStore(st)

    store.clear()
    return tx.complete
}

export const deleteItemFromData = async (st, id) => {
    db = db || (await dbPromise)

    const tx = db.transaction(st, 'readwrite')
    const store = tx.objectStore(st)

    store.delete(id)
    return tx.complete
}
