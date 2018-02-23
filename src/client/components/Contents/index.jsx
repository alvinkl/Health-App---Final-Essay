import React, { Component } from 'react'
import { isEmpty } from 'lodash'

import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import styles from './contents.css'

// const styles = {
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         justifyContent: 'space-around',
//         height: '33em',
//     },
//     gridList: {
//         width: 500,
//         height: 450,
//         overflowY: 'auto',
//     },
// }

class Contents extends Component {
    constructor() {
        super()
    }

    state = {
        user: {},
    }

    componentDidMount() {
        const { user } = this.state
        if (isEmpty(user)) this.fetchData()
    }

    fetchData = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
        const data = await res.json()
        console.log(data)
        this.setState({ user: data })
    }

    render() {
        return (
            <main className={styles.root}>
                <Paper>
                    <h1>React App</h1>
                </Paper>
            </main>
        )
    }
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'

export default Contents
