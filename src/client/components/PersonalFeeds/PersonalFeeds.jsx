import React, { Component, Fragment } from 'react'
import T from 'prop-types'

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
    renderFeeds = () => {
        const {
            feeds: { feeds },
        } = this.props

        return <Feeds data={feeds} />
    }

    render() {
        const { muiTheme, user } = this.props

        return (
            <Fragment>
                <div
                    className={styles.headerContent}
                    style={{ backgroundColor: muiTheme.palette.primary1Color }}
                >
                    <List>
                        <ListItem
                            leftAvatar={<Avatar src={user.profile_img} />}
                            primaryText={
                                <div style={style.nameColor}>{user.name}</div>
                            }
                        />
                    </List>
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
}

import muiThemeable from 'material-ui/styles/muiThemeable'
import { connect } from 'react-redux'

const mapStateToProps = ({ user, feeds: { personal_feeds } }) => ({
    user,
    feeds: personal_feeds,
})

export default muiThemeable()(connect(mapStateToProps)(PersonalFeeds))
