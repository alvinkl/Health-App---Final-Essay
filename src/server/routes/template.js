import React from 'react'
import { Helmet } from 'react-helmet'

import App from '@client/App'
import { renderToString } from 'react-dom/server'

export default function(app) {
    app.get('*', (req, res) => {
        const markup = renderToString(
            <App isSSR={true} userAgent={req.headers['user-agent']} />
        )

        const helmet = Helmet.renderStatic()

        res.render('layout', {
            markup,
            helmet,
        })
    })
}
