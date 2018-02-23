import React from 'react'
import { Helmet } from 'react-helmet'

import App from '@client/App'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import routes from '@client/routes'

export default function(app) {
    app.get('*', (req, res) => {
        const staticContext = {}

        const markup = renderToString(
            <StaticRouter location={req.url} context={staticContext}>
                <App isSSR={true} userAgent={req.headers['user-agent']} />
            </StaticRouter>
        )

        const helmet = Helmet.renderStatic()

        res.render('layout', {
            markup,
            helmet,
        })
    })
}
