// React
import React from 'react'
import { Helmet } from 'react-helmet'

// React Router
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { matchRoutes } from 'react-router-config'
import renderRoutes from '@client/routes/renderRoutes'
import routes from '@client/routes'

// Redux
import { Provider } from 'react-redux'
import configureStore from '@client/store'
import appReducer from '@client/reducers'
import { initial_state as common_state } from '@client/reducers/common'

export const renderTemplateHome = req => {
    const { googleID, name, profile_img, email, gender } = req.user

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

    const render = setupTemplate(
        { userAgent: req.headers['user-agent'], url: req.url },
        { user }
    )

    return render
}

export const renderTemplateLanding = req => {
    const user = {}

    const render = setupTemplate(
        { userAgent: req.headers['user-agent'], url: req.url },
        { user }
    )

    return render
}

const setupTemplate = ({ userAgent, url }, initial_state, static_contex) => {
    const common = {
        ...common_state,
        isSSR: true,
        userAgent,
    }

    /* REDUX init state */
    const store = configureStore(appReducer, { ...initial_state, common })
    /* END OF REDUX init state */

    /* Start of Setting up React Router and initial actions */
    const client_routes = matchRoutes(routes, url)
    const initial_actions = client_routes.map(({ route }) => {
        let { initialAction } = route.component
        return initialAction instanceof Function
            ? initialAction(store)
            : Promise.resolve(null)
    })

    /* End of Setting up React Router and initial actions */

    return Promise.all(initial_actions).then(() => {
        const static_context = {}

        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter location={url} context={static_context}>
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
