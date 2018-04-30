import React, { Component } from 'react'
import T from 'prop-types'
import cn from 'classnames'

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

const Feeds = ({ loading, error, feeds, user, toggleLike }) => {
    return feeds.map((d, i) => {
        if (d.waiting_for_sync) {
            return (
                <Card
                    key={d.post_id}
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
                                label="X"
                                secondary
                                onClick={toggleLike.bind(null, d.post_id)}
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
            if (d.likes - 1 > 0)
                label = 'You and ' + d.likes + ' people like this!'
            else label = 'You liked this post!'
        } else {
            if (d.likes > 0) label = d.likes + ' people liked this, ' + 'Like'
            else label = 'Like!'
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
                            label="X"
                            secondary
                            onClick={toggleLike.bind(null, d.post_id)}
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
                <CardActions className={styles.buttonsAlignRight}>
                    <FlatButton
                        label={label}
                        primary={!d.like_status}
                        secondary={!!d.like_status}
                        onClick={toggleLike.bind(null, d.post_id)}
                    />
                </CardActions>
            </Card>
        )
    })
}

Feeds.propTypes = {
    loading: T.bool.isRequired,
    error: T.bool.isRequired,
    feeds: T.array.isRequired,
    user: T.object.isRequired,

    toggleLike: T.func.isRequired,
}

import { connect } from 'react-redux'
import { toggleLike } from '@actions/feeds'

const mapStateToProps = ({ feeds, user }) => ({
    ...feeds,
    user: { name: user.name, avatar: user.profile_img },
})
const mapDispatchToProps = dispatch => ({
    toggleLike: event => dispatch(toggleLike(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
