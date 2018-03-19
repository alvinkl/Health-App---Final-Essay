import React from 'react'
import T from 'prop-types'
import { Link } from 'react-router-dom'

import RaisedButton from 'material-ui/RaisedButton'

import styles from '../landing.css'

// const linkGoogle = context => context.router.history.push('/auth/google')
const linkGoogle = context => (window.location.href = '/auth/google')

const Login = (props, context) => (
    <div className={styles.loginContent}>
        <div className={styles.imgWrapper}>
            <img src="/static/images/icons/icon-152x152.png" alt="" />
            <h2>Health Application</h2>
            <RaisedButton
                className={styles.gettingStartedBtn}
                label={'Login with Google'}
                onClick={linkGoogle.bind(this, context)}
            />
        </div>
    </div>
)

Login.contextTypes = {
    router: T.object.isRequired,
}

export default Login
