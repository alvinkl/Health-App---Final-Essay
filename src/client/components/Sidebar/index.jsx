import React, { Component } from 'react'
import T from 'prop-types'

import to from '@helper/asyncAwait'
import convertToUint from '@helper/convertToUint'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import styles from './sidebar.css'
import SidebarHeader from './SidebarHeader'

class Sidebar extends Component {
    state = {
        // Notification
        vapidPublicKeys: [],
        notificationFeature: false,
        subscribed: false,
    }

    componentDidMount() {
        const vapidPublicKeys = convertToUint(window.__VAPID_PUBLIC_KEYS__)

        let notificationFeature = 'serviceWorker' in window.navigator

        this.setState(
            { vapidPublicKeys, notificationFeature },
            this.checkNotificationSubscription
        )
    }

    checkNotificationSubscription = async () => {
        const { notificationFeature } = this.state

        if (notificationFeature) {
            const swReg = await window.navigator.serviceWorker.ready

            const subscription = await swReg.pushManager.getSubscription()

            this.setState({ subscribed: !!subscription })
        } else
            console.log(
                '[Service Worker] Push Notification Feature is not supported!'
            )
    }

    handleEnableNotification = async () => {
        const { notificationFeature, vapidPublicKeys } = this.state

        if (notificationFeature) {
            const swReg = await window.navigator.serviceWorker.ready

            const newSub = await swReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKeys,
            })

            const [err, res] = await to(
                fetch('/notification/subscribe', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(newSub),
                })
            )
            if (err) console.error(err)
            console.log(res)

            this.setState({ subscribed: true })
        }
    }

    handleRequestChange = (open = false) => {
        const { openSidebar, closeSidebar } = this.props

        open ? openSidebar() : closeSidebar()
    }

    render() {
        const { subscribed } = this.state
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
                    {!subscribed && (
                        <MenuItem onClick={this.handleClose}>
                            <RaisedButton
                                label="Enable Notification"
                                secondary
                                onClick={this.handleEnableNotification}
                            />
                        </MenuItem>
                    )}
                    <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
                </Drawer>
            )
        )
    }
}

Sidebar.propTypes = {
    // from redux
    sidebar: T.bool.isRequired,
    enableSidebar: T.bool.isRequired,

    openSidebar: T.func.isRequired,
    closeSidebar: T.func.isRequired,
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
