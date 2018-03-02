import React, { Component, Fragment } from 'react'

import { cyan100, cyan500, cyan700 } from 'material-ui/styles/colors'

import Charts from './Charts'

import styles from './diary.css'

const style = {
    mainColor: {
        backgroundColor: cyan500,
    },
}

class Diary extends Component {
    render() {
        return (
            <Fragment>
                <div className={styles.headerContent} style={style.mainColor}>
                    My Header
                </div>
                <Charts />
            </Fragment>
        )
    }
}

export default Diary
