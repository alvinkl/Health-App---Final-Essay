import React from 'react'

import Route from 'react-router/Route'
import { AnimatedSwitch } from 'react-router-transition'

import styles from './routes.css'

const renderRoutes = (routes, extraProps = {}, switchProps = {}) =>
    routes ? (
        <AnimatedSwitch
            className={styles.switchWrapper}
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            {...switchProps}
        >
            {routes.map((route, i) => (
                <Route
                    key={route.key || i}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={props => (
                        <ProtectedRoute
                            route={route}
                            protect={!!route.protected}
                            p={{ ...props, ...extraProps, route }}
                        />
                    )}
                />
            ))}
        </AnimatedSwitch>
    ) : null

import { isEmpty } from 'lodash'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import T from 'prop-types'

let ProtectedRoute = ({ protect, route, p, user }) =>
    protect && isEmpty(user) ? (
        <Redirect to="/landing" push />
    ) : (
        <route.component {...p} />
    )

ProtectedRoute.propTypes = {
    protect: T.bool.isRequired,
    route: T.object.isRequired,
    p: T.object.isRequired,
    user: T.object,
}

const mapStateToProps = ({ user }) => ({ user: user.user })
ProtectedRoute = connect(mapStateToProps)(ProtectedRoute)

export default renderRoutes
