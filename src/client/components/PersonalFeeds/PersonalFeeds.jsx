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
            getPersonalFeeds,
            match: { path, params },
        } = this.props

        if (path === '/myfeed') getPersonalFeeds({ user_id: 0 })
        else {
            console.log(params.user_id)
            getPersonalFeeds({ user_id: params.user_id })
        }
    }

    renderHeader = () => {
        const {
            feeds: { user },
        } = this.props

        if (!isEmpty(user))
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

        return null
    }

    renderFeeds = () => {
        const {
            feeds: { feeds },
        } = this.props

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
    user: T.object.isRequired,
    feeds: T.object.isRequired,
    match: T.object.isRequired,

    getPersonalFeeds: T.func.isRequired,
}

import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'

import { getPersonalFeeds } from '@actions/feeds'

const mapStateToProps = ({ feeds: { personal_feeds } }) => ({
    feeds: personal_feeds,
})

const mapDispatchToProps = dispatch => ({
    getPersonalFeeds: event => dispatch(getPersonalFeeds(event)),
})

export default muiThemeable()(
    connect(mapStateToProps, mapDispatchToProps)(PersonalFeeds)
)
