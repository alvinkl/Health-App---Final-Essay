import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import passport from 'passport'

import routes from './routes'
import { cookieKey } from './config/keys'

const app = express()

import './services/passport'

app.use(bodyParser.json())
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [cookieKey],
    })
)

app.use(passport.initialize())
app.use(passport.session())

// Routes
routes(app)

app.use(express.static('public'))

const PORT = process.env.PORT || 8000
app.listen(PORT)
