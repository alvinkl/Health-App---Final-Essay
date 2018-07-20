import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

// React Loadable
import Loadable from 'react-loadable'

import { Provider } from 'react-redux'
import configureStore from './store'

import App from './App'

const preloadedState = window.__INITIAL_STATE__

delete window.__INITIAL_STATE__

const store = configureStore({}, preloadedState, [])

const scrollToElement = (element, target, duration) => {
    const scrollTo = (element, target, duration) => {
        if (duration <= 0) return

        const targetOffset = target.offsetTop - target.offsetHeight
        const difference = targetOffset - element.scrollTop
        const perTick = difference / duration * 10

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick
            if (element.scrollTop === targetOffset) return
            scrollTo(element, target, duration - 10)
        }, 10)
    }

    scrollTo(element, target, duration)
}

Loadable.preloadReady().then(() => {
    hydrate(
        <AppContainer>
            <Provider store={store}>
                <BrowserRouter
                    onUpdate={() =>
                        scrollToElement(
                            document.documentElement,
                            document.querySelector('body'),
                            600
                        )
                    }
                >
                    <App />
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        document.getElementById('root')
    )
})

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default
        render(
            <AppContainer>
                <Provider store={store}>
                    <BrowserRouter
                        onUpdate={() =>
                            scrollToElement(
                                document.documentElement,
                                document.querySelector('body'),
                                600
                            )
                        }
                    >
                        <NextApp />
                    </BrowserRouter>
                </Provider>
            </AppContainer>,
            document.getElementById('root')
        )
    })
}
