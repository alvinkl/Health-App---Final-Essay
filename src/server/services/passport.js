import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import to from '@helper/asyncAwait'

import { GoogleClientID, GoogleClientSecret } from '../config/keys'

import User from '@model/User'

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
            const { id, displayName, emails, photos, gender } = profile
            const { value: email } = emails[0]
            const { value: photo } = photos[0]

            const [err, existingUser] = await to(User.findOne({ googleID: id }))
            if (err) return done(err)

            if (existingUser) return done(null, existingUser)

            const newUser = new User({
                googleID: id,
                name: displayName,
                profile_img: photo,
                email,
                gender,
            })

            const [err2] = await to(newUser.save())
            if (err2) return done(err)

            return done(null, newUser)
        }
    )
)
