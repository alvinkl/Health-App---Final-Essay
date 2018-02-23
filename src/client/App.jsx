import React from 'react'
import { Switch, Route } from 'react-router'

import Master from './components/Master'
import Header from './components/Header'
import Navbar from './components/Navbar'

import routes from './routes'

const App = props => (
    <Master isSSR={props.isSSR} userAgent={props.userAgent}>
        <Header />
        <Switch>
            {routes.map((r, i) => <Route key={r.name + i} {...r} />)}
        </Switch>
        <Navbar />
    </Master>
)

export default App
