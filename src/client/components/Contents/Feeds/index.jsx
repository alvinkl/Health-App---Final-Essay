import React, { Component } from 'react'
import T from 'prop-types'
import cn from 'classnames'
import { Link } from 'react-router-dom'

import { LIKE, UNLIKE } from '@constant'

import styles from './feeds.css'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText,
    CardActions,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import Badge from 'material-ui/Badge'

import AvatarStacks from './Avatar'

const style = {
    likes: {
        padding: '10px 16px',
    },
}

const DeleteIcon = (
    <FontIcon className="material-icons" color="grey">
        delete
    </FontIcon>
)

const linkSpecificFeed = (router, post_id) =>
    router.history.push('/feed/' + post_id)

const Feeds = (
    {
        loading,
        is_online,
        error,
        feeds,
        user,
        toggleLike,
        deleteFeed,
        deleteSyncFeed,
    },
    { router }
) => {
    return feeds.map((d, i) => {
        if (d.waiting_for_sync) {
            return (
                <Card
                    key={d.id}
                    id={d.id}
                    className={cn(styles.feedCards, styles.waitingSync)}
                    expanded
                    initiallyExpanded
                >
                    <CardHeader
                        title={user.name}
                        subtitle="This Feed has not been posted yet!"
                        avatar={user.avatar}
                        showExpandableButton={false}
                    >
                        {d.own_feed && (
                            <FlatButton
                                className={styles.deleteButton}
                                icon={DeleteIcon}
                                onClick={deleteSyncFeed.bind(null, d.post_id)}
                            />
                        )}
                    </CardHeader>
                    <CardMedia
                        expandable={true}
                        overlay={
                            <CardTitle title={d.title} subtitle={d.subtitle} />
                        }
                    >
                        <img src={d.image} alt="" />
                    </CardMedia>
                </Card>
            )
        }

        let label

        if (d.like_status === LIKE) {
            if (d.total_likes - 1 > 0)
                label = 'You and ' + d.total_likes + ' people like this!'
            else label = 'You liked this post!'
        } else {
            if (d.total_likes > 0)
                label = d.total_likes + ' people liked this, ' + 'Like'
        }

        return (
            <Card
                key={d.post_id}
                className={styles.feedCards}
                expanded
                initiallyExpanded
            >
                <CardHeader
                    title={d.user.username}
                    subtitle={d.create_time}
                    avatar={d.user.avatar}
                    showExpandableButton={false}
                    closeIcon
                >
                    {d.own_feed && (
                        <FlatButton
                            className={styles.deleteButton}
                            disabled={!is_online}
                            icon={DeleteIcon}
                            onClick={deleteFeed.bind(null, d.post_id)}
                        />
                    )}
                </CardHeader>
                <CardMedia
                    expandable={true}
                    overlay={
                        <CardTitle title={d.title} subtitle={d.subtitle} />
                    }
                >
                    <img src={d.image} alt="" />
                </CardMedia>
                <CardActions className={cn(styles.likesButton)}>
                    <IconButton
                        onClick={toggleLike.bind(null, d.post_id)}
                        disabled={!is_online}
                    >
                        <FontIcon
                            className="material-icons"
                            color={d.like_status ? 'red' : 'grey'}
                        >
                            thumb_up
                        </FontIcon>
                    </IconButton>
                    <Badge
                        className={styles.badgeComments}
                        badgeContent={d.comments.length}
                    >
                        <IconButton
                            onClick={linkSpecificFeed.bind(
                                null,
                                router,
                                d.post_id
                            )}
                        >
                            <FontIcon className="material-icons" color="grey">
                                comment
                            </FontIcon>
                        </IconButton>
                    </Badge>
                </CardActions>
                {!!label && <CardText style={style.likes}>{label}</CardText>}
            </Card>
        )
    })
}

Feeds.propTypes = {
    loading: T.bool.isRequired,
    is_online: T.bool.isRequired,
    error: T.bool.isRequired,
    feeds: T.array.isRequired,
    user: T.object.isRequired,

    toggleLike: T.func.isRequired,
    deleteFeed: T.func.isRequired,
    deleteSyncFeed: T.func.isRequired,
}

Feeds.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import { toggleLike, deleteFeed, deleteSyncFeed } from '@actions/feeds'

const mapStateToProps = ({ feeds, user, common: { is_online } }) => ({
    ...feeds,
    user: { name: user.name, avatar: user.profile_img },
    is_online,
})
const mapDispatchToProps = dispatch => ({
    toggleLike: event => dispatch(toggleLike(event)),
    deleteFeed: event => dispatch(deleteFeed(event)),
    deleteSyncFeed: event => dispatch(deleteSyncFeed(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
