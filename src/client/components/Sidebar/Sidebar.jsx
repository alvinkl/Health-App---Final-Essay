import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import moment from 'moment'

import { ACTIVITY, GOAL } from '@constant'
import to from '@helper/asyncAwait'
import convertToUint from '@helper/convertToUint'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import { GridList, GridTile } from 'material-ui/GridList'

import styles from './sidebar.css'
import SidebarHeader from './SidebarHeader'

const style = {
    info: {
        color: 'grey',
    },
}

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

    handleLogout = () => {
        const { logoutUser } = this.props

        logoutUser()
        this.context.router.history.push('/landing')
    }

    handleRequestChange = (open = false) => {
        const { openSidebar, closeSidebar } = this.props

        open ? openSidebar() : closeSidebar()
    }

    renderUserGoal = () => {
        const {
            activity,
            birth_date,
            current_height: { value: current_height },
            goal,
        } = this.props.diet_plan

        let activity_label = ''
        if (activity === ACTIVITY.LOW_ACTIVE) activity_label = 'Low Active'
        else if (activity === ACTIVITY.ACTIVE) activity_label = 'Active'
        else if (activity === ACTIVITY.VERY_ACTIVE)
            activity_label = 'Very Active'

        let goal_label = ''
        if (goal === GOAL.WEIGHT_LOSS) goal_label = 'Weight Loss'
        else if (goal === GOAL.MAINTAIN_WEIGHT) goal_label = 'Maintain Weight'
        else if (goal === GOAL.WEIGHT_GAIN) goal_label = 'Weight Gain'

        const render = [
            <MenuItem key="activity-menu">
                <GridList col={2} cellHeight={50}>
                    <GridTile style={style.info}>Activity</GridTile>
                    <GridTile>{activity_label}</GridTile>
                </GridList>
            </MenuItem>,
            <MenuItem key="birthdate-menu">
                <GridList col={2} cellHeight={50}>
                    <GridTile style={style.info}>Birth Date</GridTile>
                    <GridTile>
                        {moment(birth_date)
                            .format('DD MMM YYYY')
                            .toString()}
                    </GridTile>
                </GridList>
            </MenuItem>,
            <MenuItem key="currentheight-menu">
                <GridList col={2} cellHeight={50}>
                    <GridTile style={style.info}>Height</GridTile>
                    <GridTile>{current_height} CM</GridTile>
                </GridList>
            </MenuItem>,
            <MenuItem key="goal-menu">
                <GridList col={2} cellHeight={50}>
                    <GridTile style={style.info}>Goal</GridTile>
                    <GridTile>{goal_label}</GridTile>
                </GridList>
            </MenuItem>,
        ]

        return render
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
                    {this.renderUserGoal()}
                    {!subscribed && (
                        <MenuItem onClick={this.handleClose}>
                            <FlatButton
                                label="Enable Notification"
                                fullWidth
                                secondary
                                onClick={this.handleEnableNotification}
                            />
                        </MenuItem>
                    )}

                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Drawer>
            )
        )
    }
}

Sidebar.propTypes = {
    // from redux
    sidebar: T.bool.isRequired,
    enableSidebar: T.bool.isRequired,
    diet_plan: T.object.isRequired,

    openSidebar: T.func.isRequired,
    closeSidebar: T.func.isRequired,
    logoutUser: T.func.isRequired,
}

Sidebar.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import { openSidebar, closeSidebar } from '@actions/common'
import { logoutUser } from '@actions/user'

const mapStateToProps = ({
    common: { sidebar, enableSidebar },
    user: { diet_plan },
}) => ({
    sidebar,
    enableSidebar,
    diet_plan,
})

const mapDispatchToProps = dispatch => ({
    openSidebar: () => dispatch(openSidebar()),
    closeSidebar: () => dispatch(closeSidebar()),
    logoutUser: () => dispatch(logoutUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
