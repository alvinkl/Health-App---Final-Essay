import passport from 'passport'

import {
    handleAuthCallback,
    handleGetCurrentUser,
    handleNotFoundRoute,
    handleLogout,
} from '@server/handler/auth'
import { mustAuthenticate } from './middleware'
import * as url from '@urls'

export default function(r) {
    r.get(
        url.authGoogle,
        passport.authenticate('google', { scope: ['profile', 'email'] })
    )

    r.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        handleAuthCallback
    )

    r.get(url.authLogout, mustAuthenticate, handleLogout)

    r.get(url.getUser, mustAuthenticate, handleGetCurrentUser)

    r.get('/auth*', mustAuthenticate, handleNotFoundRoute)
    r.post('/auth*', mustAuthenticate, handleNotFoundRoute)
}
