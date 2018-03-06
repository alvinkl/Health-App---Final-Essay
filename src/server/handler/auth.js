export const handleAuthCallback = (req, res, next) => {
    res.redirect('/')
}

export const handleGetCurrentUser = (req, res, next) => {
    res.set({
        'Content-Type': 'application/json',
    })

    res.json(req.user)
}
