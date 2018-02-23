import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'

hydrate(
    <AppContainer>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept('./App', () =>
        render(
            <AppContainer>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AppContainer>,
            document.getElementById('root')
        )
    )
}
