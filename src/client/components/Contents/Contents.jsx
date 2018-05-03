import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import ContentHeader from './ContentHeader'
import SuggestFood from './SuggestFood/SuggestFoodMenu'
import Feeds from './Feeds'

import { fetchUserData } from '@actions/user'
import { fetchFeed } from '@actions/feeds'
// import styles from './contents.css'

class Contents extends Component {
    state = {
        page: 1,
    }

    static initialAction = store => {
        return store.dispatch(fetchUserData())
    }

    componentDidMount() {
        const { user, fetchUserData, fetchFeed } = this.props
        const { page } = this.state

        if (!user.googleID) fetchUserData()

        fetchFeed(page)
    }

    render() {
        const { feeds } = this.props

        return (
            <Fragment>
                <ContentHeader />
                <SuggestFood />
                <Feeds data={feeds} />
            </Fragment>
        )
    }
}

Contents.propTypes = {
    // from redux
    user: T.object.isRequired,
    feeds: T.array.isRequired,
    fetchUserData: T.func.isRequired,
    fetchFeed: T.func.isRequired,
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { connect } from 'react-redux'

const mapStateToProps = ({ user, feeds: { feeds } }) => ({
    user,
    feeds,
})

const mapDispatchToProps = dispatch => ({
    fetchUserData: event => dispatch(fetchUserData(event)),
    fetchFeed: event => dispatch(fetchFeed(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contents)
