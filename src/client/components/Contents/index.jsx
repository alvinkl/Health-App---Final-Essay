import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import ContentHeader from './ContentHeader'

// import styles from './contents.css'

class Contents extends Component {
    static propTypes = {
        // from redux
        user: T.object.isRequired,
        fetchUserData: T.func.isRequired,
    }

    static initialAction = () => {
        return this.props.fetchUserData()
    }

    componentDidMount() {
        const { user, fetchUserData } = this.props

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
import { fetchUserData } from '@actions/user'

const mapStateToProps = state => ({
    user: state.user,
})

const mapDispatchToProps = dispatch => ({
    fetchUserData: event => dispatch(fetchUserData(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contents)
