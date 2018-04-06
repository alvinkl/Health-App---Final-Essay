import React, { Component } from 'react'
import T from 'prop-types'

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

const dt = Array.apply(null, { length: 5 }).map((_, id) => ({
    post_id: id,
    title: 'Yummy Veggie',
    subtitle: 'Easy to make Yummy Veggie',
    image:
        'https://drop.ndtv.com/albums/COOKS/corngallery/creolespicedcornthumb_640x480.jpg',
    likes: 50,

    user: {
        username: 'alvinkl',
        tags: ['healthy', 'veggie'],
        avatar:
            'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
    },
}))

const Feeds = props => {
    return dt.map((d, i) => (
        <Card
            key={d.post_id}
            className={styles.feedCards}
            expanded
            initiallyExpanded
        >
            <CardHeader
                title={d.user.username}
                subtitle={d.user.tags.join(', ')}
                avatar={d.user.avatar}
                showExpandableButton={false}
            />
            <CardMedia
                expandable={true}
                overlay={<CardTitle title={d.title} subtitle={d.subtitle} />}
            >
                <img src={d.image} alt="" />
            </CardMedia>
            <CardActions className={styles.buttonsAlignRight}>
                <FlatButton label="Like" />
            </CardActions>
        </Card>
    ))
}

Feeds.propTypes = {}

export default Feeds
