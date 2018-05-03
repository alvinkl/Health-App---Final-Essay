import React, { Component, Fragment } from 'react'
import cn from 'classnames'
import T from 'prop-types'
import { Helmet } from 'react-helmet'
// import { renderRoutes } from 'react-router-config'
import renderRoutes from '@client/routes/renderRoutes'
import { isEmpty } from 'lodash'
import Loadable from 'react-loadable'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { cyan100, cyan500, cyan700 } from 'material-ui/styles/colors'

import generateAsyncComponent from '@client/routes/generateAsyncComponent'
// import Header from '@components/Header'
// import Navbar from '@components/Navbar'
// import Sidebar from '@components/Sidebar'
import Snackbar from '@components/Snackbar'
// import CameraModule from '@components/CameraModule'
import Loader from './Loader'

import { isRouteWithHeader } from '@helper/getRouteIndex'

import styles from './master.css'

const loadingComponent = props => {
    if (props.pastDelay) return null

    return null
}

class Master extends Component {
    state = {
        Header: null,
        Navbar: null,
        Sidebar: null,
        CameraModule: null,
    }

    componentDidMount() {
        const {
            showOnlineTheme,
            showOfflineTheme,
            user_loggedin,
            setOffline,
            setOnline,
        } = this.props

        if (user_loggedin) this.renderLoggedinComponent()

        window.addEventListener('online', setOnline)
        window.addEventListener('offline', setOffline)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user_loggedin) this.renderLoggedinComponent()
    }

    renderLoggedinComponent = async () => {
        const { Header, Navbar, Sidebar, CameraModule } = this.state
        if (!Header && !Navbar && !Sidebar && !CameraModule) {
            const impH = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "Header" */ '@components/Header'),
                loading: loadingComponent,
                modules: ['@components/Header'],
                webpack: () => [require.resolveWeak('@components/Header')],
                pastDelay: 500,
            })
            const impNB = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "Navbar" */ '@components/Navbar'),
                loading: loadingComponent,
                modules: ['@components/Navbar'],
                webpack: () => [require.resolveWeak('@components/Navbar')],
                pastDelay: 500,
            })
            const impSB = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "Sidebar" */ '@components/Sidebar'),
                loading: loadingComponent,
                modules: ['@components/Sidebar'],
                webpack: () => [require.resolveWeak('@components/Sidebar')],
                pastDelay: 500,
            })
            const impCM = Loadable({
                loader: () =>
                    import(/* webpackChunkName: "Camera Module" */ '@components/CameraModule'),
                loading: loadingComponent,
                modules: ['@components/CameraModule'],
                webpack: () => [
                    require.resolveWeak('@components/CameraModule'),
                ],
                pastDelay: 500,
            })

            this.setState({
                Header: impH,
                Navbar: impNB,
                Sidebar: impSB,
                CameraModule: impCM,
            })
        }
    }

    render() {
        const {
            route,
            isSSR,
            userAgent,
            showHeader,
            hideHeader,
            loading,
            theme_color,
            is_online,
        } = this.props
        const { Header, Navbar, Sidebar, CameraModule } = this.state
        const { router } = this.context

        const noHeaderPage = !isRouteWithHeader(router.route.location.pathname)

        noHeaderPage ? hideHeader() : showHeader()

        let muiT = {
            avatar: {
                borderColor: null,
            },
        }
        if (isSSR) muiT = { ...muiT, userAgent }

        return (
            <Fragment>
                <Helmet defaultTitle="PWA Health App">
                    <link
                        rel="shortcut icon"
                        href="/build/favicon.ico"
                        type="image/x-icon"
                    />
                    <link
                        rel="icon"
                        href="/static/favicon.ico"
                        type="image/x-icon"
                    />

                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                        rel="stylesheet"
                    />

                    <link
                        href="/static/build/style/style.css"
                        rel="stylesheet"
                    />

                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                    />

                    <meta httpEquiv="X-UA-Compatible" content="ie-edge" />

                    <link rel="manifest" href="/static/manifest.json" />

                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="mobile-web-app-capable" content="yes" />

                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="black"
                    />
                    <meta name="apple-mobile-web-app-title" content="PWAGram" />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-57x57.png"
                        sizes="57x57"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-60x60.png"
                        sizes="60x60"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-72x72.png"
                        sizes="72x72"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-76x76.png"
                        sizes="76x76"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-114x114.png"
                        sizes="114x114"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-120x120.png"
                        sizes="120x120"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-144x144.png"
                        sizes="144x144"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-152x152.png"
                        sizes="152x152"
                    />
                    <link
                        rel="apple-touch-icon"
                        href="/static/images/icons/apple-icon-180x180.png"
                        sizes="180x180"
                    />

                    <meta
                        name="msapplication-TileImage"
                        content="static/images/icons/app-icon-144x144.png"
                    />
                    <meta name="msapplication-TileColor" content="#fff" />
                    <meta name="theme-color" content="#3f51b5" />
                </Helmet>
                <MuiThemeProvider muiTheme={getMuiTheme(theme_color, muiT)}>
                    {!is_online && (
                        <div className={styles.offlineBar}>You're Offline</div>
                    )}
                    {!!Header && <Header />}
                    <main
                        className={cn(styles.main, {
                            [styles.maxTop]: noHeaderPage,
                            [styles.offline]: !is_online,
                        })}
                    >
                        {renderRoutes(route.routes)}
                    </main>
                    {!!Navbar && <Navbar />}

                    {!!Sidebar && <Sidebar />}

                    <Snackbar />

                    {!!CameraModule && <CameraModule />}

                    {loading && Loader}
                </MuiThemeProvider>
            </Fragment>
        )
    }
}

Master.propTypes = {
    route: T.object.isRequired,
    isSSR: T.bool.isRequired,
    is_online: T.bool.isRequired,
    userAgent: T.string.isRequired,
    loading: T.bool.isRequired,
    user_loggedin: T.bool.isRequired,
    theme_color: T.object.isRequired,

    showHeader: T.func.isRequired,
    hideHeader: T.func.isRequired,
    showOnlineTheme: T.func.isRequired,
    showOfflineTheme: T.func.isRequired,
    setOffline: T.func.isRequired,
    setOnline: T.func.isRequired,
}

Master.contextTypes = {
    router: T.object,
}

import { connect } from 'react-redux'
import {
    showHeader,
    hideHeader,
    showOnlineTheme,
    showOfflineTheme,
    setOnline,
    setOffline,
} from '@actions/common'

const mapStateToProps = ({
    common: { isSSR, userAgent, loading, theme_color, is_online },
    user,
}) => ({
    isSSR,
    userAgent,
    loading,
    user_loggedin: !isEmpty(user),
    theme_color,
    is_online,
})

const mapDispatchToProps = dispatch => ({
    showHeader: () => dispatch(showHeader()),
    hideHeader: () => dispatch(hideHeader()),
    showOnlineTheme: () => dispatch(showOnlineTheme()),
    showOfflineTheme: () => dispatch(showOfflineTheme()),
    setOffline: () => dispatch(setOffline()),
    setOnline: () => dispatch(setOnline()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Master)
