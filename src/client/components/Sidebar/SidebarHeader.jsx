import React from 'react'
import T from 'prop-types'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'

const style = {
    fontSize: '14px',
}

const SidebarHeader = ({ user: { user_id, user_name, profile_img } }) => {
    let $avatar = ''
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

    return (
        <AppBar title={$avatar} titleStyle={style} showMenuIconButton={false} />
    )
}

SidebarHeader.propTypes = {
    user: T.object.isRequired,
}

import { connect } from 'react-redux'

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(SidebarHeader)
