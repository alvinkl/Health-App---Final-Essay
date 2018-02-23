import React, { Component } from 'react'

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: '33em',
    },
    gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
    },
}

class Contents extends Component {
    render() {
        return (
            <main style={styles.root}>
                <h1>React App</h1>
            </main>
        )
    }
}

export default Contents
