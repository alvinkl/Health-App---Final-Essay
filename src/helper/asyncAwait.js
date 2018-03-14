export default function to(promise) {
    return promise
        .then(res => {
            if ('ok' in res) {
                if (!res.ok) return Promise.reject(res.statusText)
            }

            return [null, res]
        })
        .catch(err => [err])
}
