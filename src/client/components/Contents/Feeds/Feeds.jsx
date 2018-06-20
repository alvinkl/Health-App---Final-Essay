import React from 'react'
import T from 'prop-types'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import VisibilitySensor from 'react-visibility-sensor'

import { LIKE } from '@constant'

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
import Avatar from 'material-ui/Avatar'

// import AvatarStacks from './Avatar'

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
        has_next,
        lazy_loading,
        is_online,
        error,
        data,
        user,
        lazyFetchFeeds,
        toggleLike,
        deleteFeed,
        deleteSyncFeed,
        handleOpenDeleteConfirmation,
    },
    { router }
) => {
    const last_index = data.length - 1
    const lazyFetch = visible => {
        if (visible && !lazy_loading) lazyFetchFeeds()
    }
    return data.map((d, index) => {
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
                                onClick={handleOpenDeleteConfirmation.bind(
                                    null,
                                    deleteSyncFeed.bind(null, d.post_id)
                                )}
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
                label =
                    'You and ' +
                    (d.total_likes - 1) +
                    ' other people liked this!'
            else label = 'You liked this post!'
        } else {
            if (d.total_likes > 0)
                label = d.total_likes + ' people liked this, '
        }

        return (
            <VisibilitySensor
                key={d.post_id}
                onChange={lazyFetch}
                active={index === last_index && has_next && is_online}
                partialVisibility
                offset={{
                    top: 20,
                }}
            >
                <Card className={styles.feedCards} expanded initiallyExpanded>
                    <CardHeader
                        title={d.user.username}
                        subtitle={d.create_time}
                        avatar={
                            <Link
                                to={
                                    d.own_feed
                                        ? '/myfeed'
                                        : '/user/' + d.user._id
                                }
                            >
                                <Avatar src={d.user.avatar} />
                            </Link>
                        }
                        showExpandableButton={false}
                        closeIcon
                    >
                        {d.own_feed && (
                            <FlatButton
                                className={styles.deleteButton}
                                disabled={!is_online}
                                icon={DeleteIcon}
                                onClick={handleOpenDeleteConfirmation.bind(
                                    null,
                                    deleteFeed.bind(null, {
                                        post_id: d.post_id,
                                        user_id: d.user._id,
                                    })
                                )}
                            />
                        )}
                    </CardHeader>
                    <CardMedia
                        expandable={true}
                        overlay={
                            <CardTitle title={d.title} subtitle={d.subtitle} />
                        }
                        onClick={linkSpecificFeed.bind(null, router, d.post_id)}
                    >
                        <div className={styles.imageWrapper}>
                            <img
                                src={d.image}
                                alt=""
                                height={309}
                                width={400}
                            />
                        </div>
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
                        {d.comments.length > 0 ? (
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
                                    <FontIcon
                                        className="material-icons"
                                        color="grey"
                                    >
                                        comment
                                    </FontIcon>
                                </IconButton>
                            </Badge>
                        ) : (
                            <IconButton
                                onClick={linkSpecificFeed.bind(
                                    null,
                                    router,
                                    d.post_id
                                )}
                            >
                                <FontIcon
                                    className="material-icons"
                                    color="grey"
                                >
                                    comment
                                </FontIcon>
                            </IconButton>
                        )}
                    </CardActions>
                    {!!label && (
                        <CardText style={style.likes}>{label}</CardText>
                    )}
                </Card>
            </VisibilitySensor>
        )
    })
}

Feeds.propTypes = {
    loading: T.bool.isRequired,
    is_online: T.bool.isRequired,
    error: T.bool.isRequired,
    data: T.array.isRequired,
    user: T.object.isRequired,
    has_next: T.bool.isRequired,
    lazy_loading: T.bool.isRequired,

    handleOpenDeleteConfirmation: T.func.isRequired,
    lazyFetchFeeds: T.func.isRequired,
    toggleLike: T.func.isRequired,
    deleteFeed: T.func.isRequired,
    deleteSyncFeed: T.func.isRequired,
}

Feeds.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import {
    lazyFetchFeeds,
    toggleLike,
    deleteFeed,
    deleteSyncFeed,
} from '@actions/feeds'

const mapStateToProps = ({
    feeds: { loading, error, has_next, lazy_loading },
    user,
    common: { is_online },
}) => ({
    loading,
    error,
    has_next,
    lazy_loading,
    user: { name: user.name, avatar: user.profile_img },
    is_online,
})
const mapDispatchToProps = dispatch => ({
    lazyFetchFeeds: event => dispatch(lazyFetchFeeds(event)),
    toggleLike: event => dispatch(toggleLike(event)),
    deleteFeed: event => dispatch(deleteFeed(event)),
    deleteSyncFeed: event => dispatch(deleteSyncFeed(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
