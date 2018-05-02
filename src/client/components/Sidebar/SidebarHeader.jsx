import React from 'react'
import cn from 'classnames'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'

import styles from './sidebar.css'

const style = {
    fontSize: '14px',
}

const SidebarHeader = ({ user, is_online }) => {
    let $avatar = ''

    if (!isEmpty(user)) {
        const { user_id, user_name, profile_img } = user
        if (profile_img)
            $avatar = (
                <React.Fragment>
                    <Avatar size={35} src={profile_img} />
                    &nbsp;&nbsp;{user_name}
                </React.Fragment>
            )
        else
            $avatar = (
                <React.Fragment>
                    <Avatar size={35}>{user_name[0]}</Avatar>
                    &nbsp;&nbsp;{user_name}
                </React.Fragment>
            )
    }

    return (
        <AppBar
            className={cn({ [styles.offline]: !is_online })}
            title={$avatar}
            titleStyle={style}
            showMenuIconButton={false}
        />
    )
}

SidebarHeader.propTypes = {
    user: T.object.isRequired,
    is_online: T.bool.isRequired,
}

import { connect } from 'react-redux'

const mapStateToProps = ({ user, common: { is_online } }) => ({
    user,
    is_online,
})

export default connect(mapStateToProps)(SidebarHeader)
