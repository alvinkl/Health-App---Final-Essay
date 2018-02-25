import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import { Provider } from 'react-redux'
import appReducer from './reducers'
import configureStore from './store'

import App from './App'

const preloadedState = window.__INITIAL_STATE__

delete window.__INITIAL_STATE__

const store = configureStore({}, preloadedState, [])

hydrate(
    <AppContainer>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </AppContainer>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default
        render(
            <AppContainer>
                <Provider store={store}>
                    <BrowserRouter>
                        <NextApp />
                    </BrowserRouter>
                </Provider>
            </AppContainer>,
            document.getElementById('root')
        )
    })
}
