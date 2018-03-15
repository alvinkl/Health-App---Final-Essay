// React
import React from 'react'
import { Helmet } from 'react-helmet'

// React Router
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { renderRoutes, matchRoutes } from 'react-router-config'
import routes from '@client/routes'

// Redux
import { Provider } from 'react-redux'
import configureStore from '@client/store'
import appReducer from '@client/reducers'
import { initial_state as common_state } from '@client/reducers/common'

export const renderTemplateHome = req => {
    const { googleID, name, profile_img, email, gender } = req.user

    /* REDUX init state */
    const user = {
        googleID,
        name,
        profile_img,
        gender,
        email,

        diet_plan: {
            target_calories: 2500,
            current_calories: '835 cal',
            target_weight: 70,
            current_weight: '83 kg',
        },
    }

    const common = {
        ...common_state,
        isSSR: true,
        userAgent: req.headers['user-agent'],
    }

    const store = configureStore(appReducer, { user, common })
    /* END OF REDUX init state */

    /* Start of Setting up React Router and initial actions */
    const client_routes = matchRoutes(routes, req.url)
    const initial_actions = client_routes.map(({ route }) => {
        let { initialAction } = route.component
        return initialAction instanceof Function
            ? initialAction(store)
            : Promise.resolve(null)
    })

    /* End of Setting up React Router and initial actions */

    return Promise.all(initial_actions).then(() => {
        const staticContext = {}

        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={staticContext}>
                    {renderRoutes(routes)}
                </StaticRouter>
            </Provider>
        )

        const finalState = store.getState()

        const helmet = Helmet.renderStatic()

        return {
            markup,
            helmet,
            preloadedState: JSON.stringify(finalState).replace(/</g, '\\u003c'),
        }
    })
}
