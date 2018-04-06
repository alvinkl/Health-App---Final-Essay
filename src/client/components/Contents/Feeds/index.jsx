import React, { Component } from 'react'
import T from 'prop-types'

import styles from './feeds.css'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardActions,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const Feeds = ({ loading, error, feeds }) => {
    return feeds.map((d, i) => (
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

Feeds.propTypes = {
    loading: T.bool.isRequired,
    error: T.bool.isRequired,
    feeds: T.array.isRequired,
}

import { connect } from 'react-redux'

const mapStateToProps = ({ feeds }) => ({ ...feeds })

export default connect(mapStateToProps)(Feeds)
