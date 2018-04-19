import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import passport from 'passport'
import path from 'path'
import helmet from 'helmet'

import routes from './routes'
import { cookieKey, mongoURI } from './config/keys'

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
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Secure HTTP Headers
app.use(helmet())

// Parse POST request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Cookie Session
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [cookieKey],
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
app.listen(PORT)
