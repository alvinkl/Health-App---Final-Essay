import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import { fetchDiaryReport } from '@actions/diary'

import { cyan100, cyan500, cyan700 } from 'material-ui/styles/colors'

import Charts from './Charts'

import styles from './report.css'

const style = {
    mainColor: {
        backgroundColor: cyan500,
    },
}

class Report extends Component {
    // static initialAction = store => {
    //     return store.dispatch(fetchDiaryReport())
    // }

    componentDidMount() {
        const { fetchDiaryReport } = this.props
        fetchDiaryReport()
    }

    render() {
        return (
            <Fragment>
                <div className={styles.headerContent} style={style.mainColor}>
                    ..
                </div>
                <Charts />
            </Fragment>
        )
    }
}

Report.propTypes = {
    fetchDiaryReport: T.func.isRequired,
}

import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
    fetchDiaryReport: event => dispatch(fetchDiaryReport(event)),
})

export default connect(null, mapDispatchToProps)(Report)
