import React, { Component } from 'react'
import T from 'prop-types'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import styles from './sidebar.css'
import SidebarHeader from './SidebarHeader'

class Sidebar extends Component {
    static propTypes = {
        // from redux
        sidebar: T.bool.isRequired,
        enableSidebar: T.bool.isRequired,

        openSidebar: T.func.isRequired,
        closeSidebar: T.func.isRequired,
    }

    handleRequestChange = (open = false) => {
        const { openSidebar, closeSidebar } = this.props

        open ? openSidebar() : closeSidebar()
    }

    render() {
        const { sidebar, enableSidebar } = this.props

        return (
            enableSidebar && (
                <Drawer
                    className={styles.drawer}
                    docked={false}
                    open={sidebar}
                    onRequestChange={this.handleRequestChange}
                >
                    <SidebarHeader />
                    <MenuItem onClick={this.handleClose}>Menu Item 1</MenuItem>
                    <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
                </Drawer>
            )
        )
    }
}

import { connect } from 'react-redux'
import { openSidebar, closeSidebar } from '@actions/common'

const mapStateToProps = ({ common: { sidebar, enableSidebar } }) => ({
    sidebar,
    enableSidebar,
})

const mapDispatchToProps = dispatch => ({
    openSidebar: () => dispatch(openSidebar()),
    closeSidebar: () => dispatch(closeSidebar()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
