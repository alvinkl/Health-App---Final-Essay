import passport from 'passport'

import {
    handleAuthCallback,
    handleGetCurrentUser,
    handleNotFoundRoute,
} from '@server/handler/auth'
import { mustAuthenticate } from './middleware'

export default function(r) {
    r.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    )

    r.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        handleAuthCallback
    )

    r.get('/auth/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

    r.get('/auth/current_user', mustAuthenticate, handleGetCurrentUser)

    r.get('/api*', mustAuthenticate, handleNotFoundRoute)
}
