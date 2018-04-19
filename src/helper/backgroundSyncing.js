import { writeData } from './indexedDB-utilities'

export const backgroundSync = async (storeName, data) => {
    if ('serviceWorker' in window.navigator && 'SyncManager' in window) {
        const swReg = await window.navigator.serviceWorker.ready

        await writeData(storeName, data)
        await swReg.sync.register('sync-new-feeds')

        return Promise.resolve({
            message: 'Feeds will be added soon when you are online!',
        })
    }

    return Promise.reject('SyncManager is not supported in this device!')
}
