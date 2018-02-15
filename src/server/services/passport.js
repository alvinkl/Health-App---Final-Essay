import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import { GoogleClientID, GoogleClientSecret } from '../config/keys'

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(
    new GoogleStrategy(
        {
            clientID: GoogleClientID,
            clientSecret: GoogleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(accessToken, refreshToken, profile)

            return done(null, profile)
        }
    )
)
