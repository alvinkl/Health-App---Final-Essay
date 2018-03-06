import passport from 'passport'

import { handleAuthCallback, handleGetCurrentUser } from '@server/handler/auth'
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

    r.get('/auth/current_user', mustAuthenticate, handleGetCurrentUser)
}
