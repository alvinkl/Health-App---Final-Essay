import { responseError } from './response'

export const handleAuthCallback = (req, res, next) => {
    if (req.user.new) return res.redirect('/getting-started')
    return res.redirect('/')
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
