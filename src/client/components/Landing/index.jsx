import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { Link } from 'react-router-dom'

import Login from './Login'

import styles from './landing.css'

export class Landing extends Component {
    static contextTypes = {
        router: T.object.isRequired,
    }

    handleClickGettingStarted = () => {
        return this.context.router.history.push('/getting-started')
    }

    render() {
        return (
            <Fragment>
                <Login />
                <div className={styles.termsAndCondition}>
                    <p>Terms and Condition</p>
                </div>
            </Fragment>
        )
    }
}

export default Landing
