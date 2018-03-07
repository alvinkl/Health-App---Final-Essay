export default function to(promise) {
    return promise
        .then(res => {
            if (!res.ok) return Promise.reject(res.statusText)
            return [null, res]
        })
        .catch(err => [err])
}
