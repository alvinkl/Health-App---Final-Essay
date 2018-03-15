import React, { Component } from 'react'

import styles from './gettingStarted.css'

/*
    Quiestions would be
        - Date of Birth
        - Goal
        - Gender
        - Activity
        - Current Weigth
        - Current Height
*/

export class GettingStarted extends Component {
    render() {
        return <div className={styles.gettingStarted} />
    }
}

export default GettingStarted
