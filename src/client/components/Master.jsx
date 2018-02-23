import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { cyan100, cyan500, cyan700 } from 'material-ui/styles/colors'

export default ({ children, isSSR, userAgent }) => {
    const props = arguments

    const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, { ...props })
    )

    let muiT = {
        avatar: {
            borderColor: null,
        },
    }
    if (isSSR) muiT = { ...muiT, userAgent }

    let muiTheme = getMuiTheme(
        {
            palette: {
                primary1Color: cyan500,
                primary2Color: cyan700,
                primary3Color: cyan100,
            },
        },
        muiT
    )

    return (
        <Fragment>
            <Helmet defaultTitle="PWA Health App">
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                    type="image/x-icon"
                />
                <link
                    rel="icon"
                    href="static/favicon.ico"
                    type="image/x-icon"
                />

                {/* <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                /> */}

                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                />

                <meta httpEquiv="X-UA-Compatible" content="ie-edge" />

                <link rel="manifest" href="static/manifest.json" />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black"
                />
                <meta name="apple-mobile-web-app-title" content="PWAGram" />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-57x57.png"
                    sizes="57x57"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-60x60.png"
                    sizes="60x60"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-72x72.png"
                    sizes="72x72"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-76x76.png"
                    sizes="76x76"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-114x114.png"
                    sizes="114x114"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-120x120.png"
                    sizes="120x120"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-144x144.png"
                    sizes="144x144"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-152x152.png"
                    sizes="152x152"
                />
                <link
                    rel="apple-touch-icon"
                    href="static/images/icons/apple-icon-180x180.png"
                    sizes="180x180"
                />

                <meta
                    name="msapplication-TileImage"
                    content="static/images/icons/app-icon-144x144.png"
                />
                <meta name="msapplication-TileColor" content="#fff" />
                <meta name="theme-color" content="#3f51b5" />
            </Helmet>
            <MuiThemeProvider muiTheme={muiTheme}>
                {childrenWithProps}
            </MuiThemeProvider>
        </Fragment>
    )
}
