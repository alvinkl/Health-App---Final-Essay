import React, { Component, Fragment } from 'react'
import cn from 'classnames'
import T from 'prop-types'
// import { renderRoutes } from 'react-router-config'
import renderRoutes from '@client/routes/renderRoutes'
import { isEmpty } from 'lodash'
import Loadable from 'react-loadable'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import HeaderHelmet from './HeaderHelmet'
import Snackbar from '@components/Snackbar'
import Loader from '@components/Loader'

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

        this.showCustomAddHomeScreen()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user_loggedin) this.renderLoggedinComponent()
    }

    showCustomAddHomeScreen = () => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIOS = /iphone|ipad|ipod/.test(userAgent)

        const standAloneMode = window.navigator.standalone || false

        window.addEventListener('beforeinstallprompt', e => {
            if (isIOS && !standAloneMode) {
                // show custom add homescreen
            }
        })
    }

    renderLoggedinComponent = async () => {
        const { Header, Navbar, Sidebar } = this.state
        if (!Header && !Navbar && !Sidebar) {
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

            this.setState({
                Header: impH,
                Navbar: impNB,
                Sidebar: impSB,
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
            navbar,
        } = this.props
        const { Header, Navbar, Sidebar } = this.state
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
                <HeaderHelmet />
                <MuiThemeProvider muiTheme={getMuiTheme(theme_color, muiT)}>
                    {!is_online && (
                        <div className={styles.offlineBar}>You're Offline</div>
                    )}
                    {!!Header && <Header />}
                    <main
                        className={cn(styles.main, {
                            [styles.maxTop]: noHeaderPage,
                            [styles.offline]: !is_online,
                            [styles.noNavbar]: noHeaderPage,
                        })}
                    >
                        {renderRoutes(route.routes)}
                    </main>
                    {!!Navbar && <Navbar />}

                    {!!Sidebar && <Sidebar />}

                    <Snackbar />

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
    navbar: T.bool.isRequired,

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
    common: { isSSR, userAgent, loading, theme_color, is_online, navbar },
    user,
}) => ({
    isSSR,
    userAgent,
    loading,
    user_loggedin: !isEmpty(user),
    theme_color,
    is_online,
    navbar,
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
