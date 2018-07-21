import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty, unescape } from 'lodash'
import moment from 'moment'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/arrow-back'
// Display Feed
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors'
import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText,
    CardActions,
} from 'material-ui/Card'
// Display comment
import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
// Insert comment
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

import { getFeedFromStore } from '@actions/feeds'
import { LIKE } from '@constant'

import styles from './feeds.css'

const style = {
    likes: {
        padding: '10px 16px',
    },
    removePadding: {
        padding: 0,
    },
    date: { color: lightBlack, fontSize: 12 },
}

const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400} />
    </IconButton>
)
const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Reply</MenuItem>
        <MenuItem>Forward</MenuItem>
        <MenuItem>Delete</MenuItem>
    </IconMenu>
)

class SpecificFeed extends Component {
    state = {
        comment: '',
    }

    componentDidMount() {
        const { match, getFeedFromStore } = this.props

        const {
            params: { post_id },
        } = match

        getFeedFromStore(post_id)
    }

    componentWillReceiveProps(nextProps) {
        const { loading } = nextProps
        if (loading !== this.props.loading) {
            if (loading) return this.props.showLoader()
            return this.props.hideLoader()
        }
    }

    handleSubmitComment = () => {
        const { comment } = this.state
        const {
            feed: { post_id },
            addComment,
        } = this.props

        addComment({ post_id, comment })
        this.setState({ comment: '' })
    }

    handleCommentChange = e => this.setState({ comment: e.target.value })

    handleBackButton = () => this.context.router.history.push('/')

    renderInsertComment = () => {
        const { current_user, is_online } = this.props
        const { comment } = this.state

        return (
            <Fragment>
                <Divider />
                <ListItem
                    leftAvatar={<Avatar src={current_user.avatar} />}
                    disabled
                    secondaryText={
                        <TextField
                            fullWidth
                            onChange={this.handleCommentChange}
                            disabled={!is_online}
                            value={comment}
                            hintText={
                                'Comment as ' + current_user.username + '...'
                            }
                        />
                    }
                    rightIcon={
                        <FlatButton
                            className={styles.sendButton}
                            onClick={this.handleSubmitComment}
                            disabled={!is_online}
                            label={
                                <FontIcon className="material-icons">
                                    send
                                </FontIcon>
                            }
                            primary
                        />
                    }
                    secondaryTextLines={2}
                />
            </Fragment>
        )
    }

    renderComments = () => {
        const {
            feed: { comments },
        } = this.props

        return (
            <List>
                {comments.map((d, i) => (
                    <Fragment key={i}>
                        <ListItem
                            leftAvatar={<Avatar src={d.user.avatar} />}
                            primaryText={
                                <div>
                                    {d.user.username}&nbsp;&nbsp;<span
                                        style={style.date}
                                    >
                                        {moment(d.create_time).fromNow()}
                                    </span>
                                </div>
                            }
                            secondaryText={<p>{unescape(d.content)}</p>}
                            secondaryTextLines={2}
                        />
                        <Divider inset={true} />
                    </Fragment>
                ))}
                {this.renderInsertComment()}
            </List>
        )
    }

    render() {
        const { feed, loading } = this.props

        let label
        if (feed.like_status === LIKE) {
            if (feed.total_likes - 1 > 0)
                label =
                    'You and ' +
                    (feed.total_likes - 1) +
                    ' other people liked this!'
            else label = 'You liked this post!'
        } else {
            if (feed.total_likes > 0)
                label = feed.total_likes + ' people liked this!'
        }

        return (
            <div className={styles.specificFeed}>
                <AppBar
                    title="Comments"
                    iconElementLeft={
                        <IconButton onClick={this.handleBackButton}>
                            <NavigationClose />
                        </IconButton>
                    }
                />
                {!loading &&
                    !isEmpty(feed) && (
                        <Card key={feed.post_id} expanded initiallyExpanded>
                            <CardHeader
                                title={feed.user.username}
                                subtitle={feed.create_time}
                                avatar={feed.user.avatar}
                                showExpandableButton={false}
                                closeIcon
                            />
                            <CardMedia
                                expandable={true}
                                overlay={
                                    <CardTitle
                                        title={feed.title}
                                        subtitle={feed.subtitle}
                                    />
                                }
                            >
                                <img src={feed.image} alt="" />
                            </CardMedia>
                            {!!label && (
                                <CardText style={style.likes}>{label}</CardText>
                            )}
                            <CardText style={style.removePadding}>
                                {this.renderComments()}
                            </CardText>
                        </Card>
                    )}
            </div>
        )
    }
}

SpecificFeed.propTypes = {
    loading: T.bool.isRequired,
    is_online: T.bool.isRequired,
    feed: T.object.isRequired,
    current_user: T.object.isRequired,
    match: T.object.isRequired,
    history: T.object.isRequired,

    getFeedFromStore: T.func.isRequired,
    addComment: T.func.isRequired,
    showLoader: T.func.isRequired,
    hideLoader: T.func.isRequired,
}

SpecificFeed.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import { showLoader, hideLoader } from '@actions/common'
import { addComment } from '@actions/feeds'

const mapStateToProps = ({
    feeds: { current_feed, loading },
    user: { profile_img, name },
    common: { is_online },
}) => ({
    loading,
    feed: current_feed,
    current_user: {
        avatar: profile_img,
        username: name,
    },
    is_online,
})

const mapDispatchToProps = dispatch => ({
    getFeedFromStore: event => dispatch(getFeedFromStore(event)),
    addComment: event => dispatch(addComment(event)),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SpecificFeed)
