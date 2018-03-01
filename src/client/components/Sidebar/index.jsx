import React, { Component } from 'react'
import T from 'prop-types'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const style = {
    drawer: {
        width: '80vw !important',
    },
}

class Sidebar extends Component {
    static propTypes = {
        // from redux
        sidebar: T.bool.isRequired,
        openSidebar: T.func.isRequired,
        closeSidebar: T.func.isRequired,
    }

    handleRequestChange = (open: false, reason: '') => {
        const { openSidebar, closeSidebar } = this.props

        open ? openSidebar() : closeSidebar()
    }

    render() {
        const { sidebar } = this.props

        return (
            <Drawer
                docked={false}
                open={sidebar}
                style={style.drawer}
                onRequestChange={this.handleRequestChange}
            >
                <MenuItem onClick={this.handleClose}>Menu Item 1</MenuItem>
                <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
            </Drawer>
        )
    }
}

import { connect } from 'react-redux'
import { openSidebar, closeSidebar } from '@actions/common'

const mapStateToProps = state => ({
    sidebar: state.common.sidebar,
})

const mapDispatchToProps = dispatch => ({
    openSidebar: () => dispatch(openSidebar()),
    closeSidebar: () => dispatch(closeSidebar()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
