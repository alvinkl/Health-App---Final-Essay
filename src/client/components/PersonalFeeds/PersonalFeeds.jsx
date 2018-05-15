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
    state = {
        open_delete_dialog: false,
        delete_event: null,
        DeleteConfirmationComp: null,
    }

    componentDidMount() {
        const {
            fetchFeed,
            match: { path, params },
            user: { _id: user_id },
        } = this.props

        if (path === '/myfeed') fetchFeed({ user_id })
        else fetchFeed({ user_id: params.user_id })
    }

    handleOpenDeleteConfirmation = delete_event => {
        const { DeleteConfirmationComp } = this.state

        let newState = {
            open_delete_dialog: true,
            delete_event,
        }

        if (!DeleteConfirmationComp)
            newState = {
                ...newState,
                DeleteConfirmationComp: require('@components/Dialogs/DeleteConfirmation')
                    .default,
            }

        this.setState(newState)
    }
    handleCloseDeleteConfirmation = () =>
        this.setState({ open_delete_dialog: false, delete_event: null })

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

        if (!isEmpty(feeds))
            return (
                <Feeds
                    data={feeds}
                    handleOpenDeleteConfirmation={
                        this.handleOpenDeleteConfirmation
                    }
                />
            )

        return null
    }

    renderDeleteConfirmation = () => {
        const {
            DeleteConfirmationComp,
            open_delete_dialog,
            delete_event,
        } = this.state

        return (
            !!DeleteConfirmationComp && (
                <DeleteConfirmationComp
                    key="delete-confirmation-content"
                    {...{
                        open: open_delete_dialog,
                        deleteEvent: delete_event,
                        handleClose: this.handleCloseDeleteConfirmation,
                    }}
                />
            )
        )
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
                {this.renderDeleteConfirmation()}
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
