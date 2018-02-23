import React, { Component } from 'react'
import { isEmpty } from 'lodash'

import ContentHeader from './ContentHeader'

import styles from './contents.css'

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
        const { user } = this.state

        return (
            <main className={styles.root}>
                <ContentHeader {...{ user }} />
            </main>
        )
    }
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'

export default Contents
