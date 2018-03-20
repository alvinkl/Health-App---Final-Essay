const esc = encodeURIComponent

export default params =>
    '?' +
    Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&')
