import { responseError, responseJSON } from './response'

export const handleAuthCallback = (req, res, next) => {
    if (req.user.new) return res.redirect('/getting-started')
    return res.redirect('/')
}

export const handleGetCurrentUser = (req, res) => {
    console.log(req.user)
    return responseJSON(res, req.user)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}

export const handleLogout = (req, res) => {
    req.logout()
    return responseJSON({ success: 1 })
}
