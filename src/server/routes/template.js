import React from 'react'
import { Helmet } from 'react-helmet'

import App from '@client/App'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { Provider } from 'react-redux'

import configureStore from '@client/store'
import appReducer from '@client/reducers'

import { initial_state as common_state } from '@client/reducers/common'

import routes from '@client/routes'

export default function(app) {
    app.get('*', (req, res) => {
        const staticContext = {}

        const user = {
            user_id: 123123,
            user_name: 'Sally The Fatty',
            profile_img: '',

            dietary_plan: {
                target_calories: '2000 cal',
                current_calories: '835 cal',
                target_weight: '75 kg',
                current_weight: '83 kg',
            },
        }

        const common = {
            ...common_state,
            isSSR: true,
            userAgent: req.headers['user-agent'],
        }

        const store = configureStore(appReducer, { user, common })

        // console.log('REDUCER', appReducer)
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={staticContext}>
                    <App isSSR={true} userAgent={req.headers['user-agent']} />
                </StaticRouter>
            </Provider>
        )

        const finalState = store.getState()

        const helmet = Helmet.renderStatic()

        res.render('layout', {
            markup,
            helmet,
            preloadedState: JSON.stringify(finalState).replace(/</g, '\\u003c'),
        })
    })
}
