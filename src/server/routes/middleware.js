export const mustAuthenticate = (req, res, next) => {
    if (req.user) return next()

    res.set({
        'Content-Type': 'application/json',
        'Accept-Content': 'application/json',
    })

    return res.status(403).json({
        error: 'Not Authenticated!',
    })
}
