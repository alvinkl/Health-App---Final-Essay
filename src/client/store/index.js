import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import appReducer from '../reducers'
import composeEnhancers from '../reducers/composeEnhancer'

export default function configureStore(
    reducers = {},
    preloadedState = {},
    middleware = []
) {
    return createStore(
        combineReducers({
            ...appReducer,
            ...reducers,
        }),
        preloadedState,
        composeEnhancers(applyMiddleware(thunk, ...middleware))
    )
}
