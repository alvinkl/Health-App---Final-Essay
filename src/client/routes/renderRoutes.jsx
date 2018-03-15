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
                        <route.component
                            {...props}
                            {...extraProps}
                            route={route}
                        />
                    )}
                />
            ))}
        </AnimatedSwitch>
    ) : null

export default renderRoutes
