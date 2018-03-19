import React, { Component } from 'react'
import T from 'prop-types'
import { Link } from 'react-router-dom'

import RaisedButton from 'material-ui/RaisedButton'

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
            <div className={styles.loginContent}>
                <div className={styles.imgWrapper}>
                    <img src="/static/images/icons/icon-152x152.png" alt="" />
                    <h2>Health Application</h2>
                    <RaisedButton
                        className={styles.gettingStartedBtn}
                        label={'Get Started'}
                        onClick={this.handleClickGettingStarted}
                    />
                </div>
                <div className={styles.memberSignin}>
                    <h5>Already a member? </h5>
                    &nbsp;<Link to="/signin">Sign in</Link>
                </div>
                <div className={styles.termsAndCondition}>
                    <p>Terms and Condition</p>
                </div>
            </div>
        )
    }
}

export default Landing
