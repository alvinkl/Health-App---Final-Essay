import React from 'react'

import Master from './components/Master'
import Header from './components/Header'
import Contents from './components/Contents'
import Navbar from './components/Navbar'

const App = props => (
    <Master isSSR={props.isSSR} userAgent={props.userAgent}>
        <Header />
        <Contents />
        <Navbar />
    </Master>
)

export default App
