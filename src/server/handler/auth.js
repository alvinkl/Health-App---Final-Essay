export const handleAuthCallback = (req, res, next) => {
    res.redirect('/')
}

export const handleGetCurrentUser = (req, res, next) => {
    res.send(req.user)
}
