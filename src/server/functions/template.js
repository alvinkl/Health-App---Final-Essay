// React
import React from 'react'
import { Helmet } from 'react-helmet'

// React Router
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { matchRoutes } from 'react-router-config'
import renderRoutes from '@client/routes/renderRoutes'
import routes from '@client/routes'

// React Loadable
import Loadable from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'

// Redux
import { Provider } from 'react-redux'
import configureStore from '@client/store'
import appReducer from '@client/reducers'
import { initial_state as common_state } from '@client/reducers/common'
import { initial_state as diary_state } from '@client/reducers/diary'
import { VapidPublicKeys } from '@config/keys'

export default async ({ user = {}, diary = {} }, userAgent, url) => {
    const render = setupTemplate(
        { userAgent, url },
        { user, diary: { ...diary_state, ...diary } }
    )

    return render
}

let stats = null

const setupTemplate = (
    { userAgent, url },
    initial_state,
    static_context = {}
) => {
    const common = {
        ...common_state,
        isSSR: true,
        userAgent,
    }

    /* REDUX init state */
    const store = configureStore(appReducer, {
        common,
        ...initial_state,
    })
    /* END OF REDUX init state */

    /* Start of Setting up React Router and initial actions */
    const client_routes = matchRoutes(routes, url)
    const initial_actions = client_routes.map(({ route }) => {
        let { load } = route.component
        return load instanceof Function ? load(store) : Promise.resolve(null)
    })

    /* End of Setting up React Router and initial actions */

    // React loadable
    let modules = []

    return Promise.all(initial_actions).then(() => {
        const markup = renderToString(
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                <Provider store={store}>
                    <StaticRouter location={url} context={static_context}>
                        {renderRoutes(routes)}
                    </StaticRouter>
                </Provider>
            </Loadable.Capture>
        )

        if (!stats) stats = require('../../server/react-loadable.json')

        let bundles = getBundles(stats, modules)

        const finalState = store.getState()

        const helmet = Helmet.renderStatic()

        return {
            markup,
            helmet,
            preloadedState: JSON.stringify(finalState).replace(/</g, '\\u003c'),
            vapidPublicKeys: JSON.stringify(VapidPublicKeys),
            preloadedBundles: bundles
                .map(
                    bundle =>
                        `<script src="/static/build/${bundle.file}"></script>`
                )
                .join('\n'),
        }
    })
}

function module_exists(name) {
    try {
        return require(name)
    } catch (e) {
        return false
    }
}
