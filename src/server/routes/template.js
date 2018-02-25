import React from 'react'
import { Helmet } from 'react-helmet'

import App from '@client/App'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { Provider } from 'react-redux'

import configureStore from '@client/store'

import routes from '@client/routes'

export default function(app) {
    app.get('*', (req, res) => {
        const staticContext = {}

        const store = configureStore()

        // console.log('REDUCER', appReducer)
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={staticContext}>
                    <App isSSR={true} userAgent={req.headers['user-agent']} />
                </StaticRouter>
            </Provider>
        )

        const preloadedState = store.getState()

        const helmet = Helmet.renderStatic()

        res.render('layout', {
            markup,
            helmet,
            preloadedState: JSON.stringify(preloadedState).replace(
                /</g,
                '\\u003c'
            ),
        })
    })
}
