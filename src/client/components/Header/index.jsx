import React from 'react'
import { AppBar } from 'material-ui'

const handleClick = () => console.log('hey hey')

const style = {
    appbar: {
        boxShadow:
            '0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
    },
}

export const Header = ({ openSidebar }) => (
    <AppBar
        title="Health App"
        onLeftIconButtonClick={openSidebar}
        onTitleClick={handleClick}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
)

import { connect } from 'react-redux'
import { openSidebar } from '@actions/common'

const mapDispatchToProps = dispatch => ({
    openSidebar: event => dispatch(openSidebar(event)),
})

export default connect(null, mapDispatchToProps)(Header)
