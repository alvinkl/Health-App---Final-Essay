import React from 'react'

import styles from './offline.css'

import { connect } from 'react-redux'

const mapStateToProps = ({ common: { is_online } }) => ({ is_online })

const Offline = connect(mapStateToProps)(({ is_online }) => (
    <div className={styles.offlineWrapper}>
        {is_online && <h1>Failed to retrieve, swipe up to try again!</h1>}
        {!is_online && <h1>You are offline!</h1>}
    </div>
))

export default <Offline />
