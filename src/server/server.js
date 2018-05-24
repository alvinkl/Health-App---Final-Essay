import express from 'express'
import bodyParser from 'body-parser'
// import cookieSession from 'cookie-session'
import compression from 'compression'
import passport from 'passport'
import path from 'path'
import helmet from 'helmet'
import sslRedirect from 'heroku-ssl-redirect'
// import Loadable from 'react-loadable'
import session from 'express-session'

import routes from './routes'
import { cookieKey, mongoURI, redisURI } from './config/keys'

// session handling
const RedisStore = require('connect-redis')(session)
const sessionRedisOptions = {
    url: redisURI,
    logErrors: true,
}

// Database
import mongoose from 'mongoose'
const connectWithRetry = function() {
    return mongoose.connect(mongoURI, function(err) {
        if (err) {
            console.error(
                'Failed to connect to mongo on startup - retrying in 5 sec',
                err
            )
            setTimeout(connectWithRetry, 5000)
        }
    })
}
connectWithRetry()

mongoose.connect(mongoURI)

// Polyfilling
require('es6-promise').polyfill()
import 'isomorphic-fetch'

const app = express()

// Use EJS as templating Engine
app.set('views', path.join(__dirname, '../../build/views'))
app.set('view engine', 'ejs')

// Set compression
app.use(
    compression({
        filter: (req, res) => {
            // don't compress responses with this request header
            if (req.headers['x-no-compression']) return false

            // fallback to standard filter function
            return compression.filter(req, res)
        },
    })
)

// Secure HTTP Headers
app.use(helmet())

// Redirect to HTTPS heroku
app.use(sslRedirect())

// Parse POST request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Cookie Session
// app.use(
//     cookieSession({
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         keys: [cookieKey],
//     })
// )
app.use(
    session({
        store: new RedisStore(sessionRedisOptions),
        secret: cookieKey,
        resave: false,
    })
)

// Initialize Passport
import './services/passport'
app.use(passport.initialize())
app.use(passport.session())

app.use('/static', express.static(path.join(__dirname, '../../public')))

// Routes
app.get('/sw.js', (req, res) => {
    res.set({
        'Service-Worker-Allowed': '/',
        'Content-Type': 'text/javascript',
    })

    res.status(200).sendFile(path.resolve(__dirname, '../../sw.js'))
})

app.get('/.well-known/acme-challenge/:content', (req, res) =>
    res.send(
        'PREK_vBqr_gCaD8q7xSKQybQAQ9BecT-sseURL-3R-w.WK__BCdFyRmuDIUtcgDKIJ5pZKIyKbm9-W17ik5Hcco'
    )
)

routes(app)

const PORT = process.env.PORT || 8000
// Loadable.preloadAll().then(() => {
app.listen(PORT, () => {
    console.log('Server running on port:', PORT)
})
// })
