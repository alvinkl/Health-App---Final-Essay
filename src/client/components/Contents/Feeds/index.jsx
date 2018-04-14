import React, { Component } from 'react'
import T from 'prop-types'

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

const Feeds = ({ loading, error, feeds, toggleLike }) => {
    return feeds.map((d, i) => {
        let label

        if (d.status === LIKE) {
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
                />
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
                        primary={!d.status}
                        secondary={!!d.status}
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

    toggleLike: T.func.isRequired,
}

import { connect } from 'react-redux'
import { toggleLike } from '@actions/feeds'

const mapStateToProps = ({ feeds }) => ({ ...feeds })
const mapDispatchToProps = dispatch => ({
    toggleLike: event => dispatch(toggleLike(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
