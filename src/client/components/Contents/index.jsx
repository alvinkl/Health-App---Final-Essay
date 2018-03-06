import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import ContentHeader from './ContentHeader'

import { fetchUserData } from '@actions/user'
// import styles from './contents.css'

class Contents extends Component {
    static propTypes = {
        // from redux
        user: T.object.isRequired,
        fetchUserData: T.func.isRequired,
    }

    static initialAction = store => {
        console.log('INITIAL ACTION CALLED')
        return store.dispatch(fetchUserData())
    }

    componentDidMount() {
        const { user, fetchUserData } = this.props

        console.log('CONTENTS', user)
        if (isEmpty(user)) fetchUserData()
    }

    render() {
        const { user } = this.props

        return (
            <Fragment>
                <ContentHeader user={user} />
            </Fragment>
        )
    }
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    user: state.user,
})

const mapDispatchToProps = dispatch => ({
    fetchUserData: event => dispatch(fetchUserData(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contents)
