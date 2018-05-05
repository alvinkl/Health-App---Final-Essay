import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import DatePicker from 'material-ui/DatePicker'

import Charts from './Charts'

import { fetchDiaryReport } from '@actions/diary'

import styles from './report.css'

const style = {
    dateTextStyle: {
        textAlign: 'center',
        color: 'white',
        marginTop: '20px',
    },
}

class Report extends Component {
    constructor() {
        super()

        this.today = new Date()
    }

    // static initialAction = store => {
    //     return store.dispatch(fetchDiaryReport())
    // }

    componentDidMount() {
        const { fetchDiaryReport } = this.props
        fetchDiaryReport()
    }

    handleChangeDate = (_, date) =>
        this.props.fetchDiaryReport(Date.parse(date))

    renderDatePicker = () => {
        return (
            <DatePicker
                hintText="Today's Diary"
                autoOk
                maxDate={this.today}
                textFieldStyle={style.dateTextStyle}
                onChange={this.handleChangeDate}
            />
        )
    }

    render() {
        const { muiTheme } = this.props

        return (
            <Fragment>
                <div
                    className={styles.headerContent}
                    style={{ backgroundColor: muiTheme.palette.primary1Color }}
                >
                    {this.renderDatePicker()}
                </div>
                <Charts />
            </Fragment>
        )
    }
}

Report.propTypes = {
    muiTheme: T.object.isRequired,
    fetchDiaryReport: T.func.isRequired,
}

import { connect } from 'react-redux'
import muiThemeable from 'material-ui/styles/muiThemeable'

const mapDispatchToProps = dispatch => ({
    fetchDiaryReport: event => dispatch(fetchDiaryReport(event)),
})

export default muiThemeable()(connect(null, mapDispatchToProps)(Report))
