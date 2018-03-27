import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import ContentHeader from './ContentHeader'
import SuggestFood from './SuggestFood'

import { fetchUserData } from '@actions/user'
// import styles from './contents.css'

class Contents extends Component {
    static propTypes = {
        // from redux
        user: T.object.isRequired,
        fetchUserData: T.func.isRequired,
    }

    static initialAction = store => {
        return store.dispatch(fetchUserData())
    }

    componentDidMount() {
        const { user, fetchUserData } = this.props

        if (!user.googleID) fetchUserData()
    }

    render() {
        return (
            <Fragment>
                <ContentHeader />
                <SuggestFood />
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
