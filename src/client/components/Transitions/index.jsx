import React from 'react'
import T from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import styles from './transitions.css'

export const Fade = ({ children, ...props }) => {
    return (
        <CSSTransition {...props} timeout={1000} classNames={styles.fade}>
            {children}
        </CSSTransition>
    )
}

Fade.propTypes = {
    children: T.node.isRequired,
}
