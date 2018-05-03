import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import Feeds from '@components/Contents/Feeds'

import styles from './personalFeeds.css'

const style = {
    nameColor: {
        color: 'white',
    },
}

class PersonalFeeds extends Component {
    componentDidMount() {
        const {
            fetchFeed,
            match: { path, params },
            user: { _id: user_id },
        } = this.props

        if (path === '/myfeed') fetchFeed({ user_id })
        else fetchFeed({ user_id: params.user_id })
    }

    renderHeader = () => {
        const { feeds } = this.props

        if (!isEmpty(feeds)) {
            const { user } = feeds[0]
            return (
                <List>
                    <ListItem
                        leftAvatar={<Avatar src={user.avatar} />}
                        primaryText={
                            <div style={style.nameColor}>{user.username}</div>
                        }
                    />
                </List>
            )
        }

        return null
    }

    renderFeeds = () => {
        const { feeds } = this.props

        if (!isEmpty(feeds)) return <Feeds data={feeds} />

        return null
    }

    render() {
        const { muiTheme } = this.props

        return (
            <Fragment>
                <div
                    className={styles.headerContent}
                    style={{ backgroundColor: muiTheme.palette.primary1Color }}
                >
                    {this.renderHeader()}
                </div>
                <div>{this.renderFeeds()}</div>
            </Fragment>
        )
    }
}

PersonalFeeds.propTypes = {
    muiTheme: T.object.isRequired,
    feeds: T.array.isRequired,
    user: T.object.isRequired,
    match: T.object.isRequired,

    fetchFeed: T.func.isRequired,
}

import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'

import { fetchFeed } from '@actions/feeds'

const mapStateToProps = ({
    feeds: { feeds },
    user: { googleID, name, profile_img },
}) => ({
    feeds,
    user: {
        _id: googleID,
        username: name,
        avatar: profile_img,
    },
})

const mapDispatchToProps = dispatch => ({
    fetchFeed: event => dispatch(fetchFeed(event)),
})

export default muiThemeable()(
    connect(mapStateToProps, mapDispatchToProps)(PersonalFeeds)
)
