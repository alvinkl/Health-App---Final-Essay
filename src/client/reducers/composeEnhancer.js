/*
    This file is required when debugging redux code with Chrome ReduxDevTools
*/

import { compose } from 'redux'

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose

export default composeEnhancers
