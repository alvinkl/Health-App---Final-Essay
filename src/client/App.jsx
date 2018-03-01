import React from 'react'
import { Switch, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import Master from './components/Master'

import routes from './routes'

import './style.css'

const App = props => (
    <Master isSSR={props.isSSR} userAgent={props.userAgent}>
        <Switch>
            {routes.map((r, i) => <Route key={r.name + i} {...r} />)}
        </Switch>
    </Master>
)

export default App
