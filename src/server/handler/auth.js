export const handleAuthCallback = (req, res, next) => {
    res.redirect('/')
}

export const handleGetCurrentUser = (req, res, next) => {
    res.set({
        'Content-Type': 'application/json',
    })

    res.json(req.user)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
