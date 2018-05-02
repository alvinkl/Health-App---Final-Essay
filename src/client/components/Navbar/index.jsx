import React, { Component } from 'react'
import T from 'prop-types'
import FontIcon from 'material-ui/FontIcon'
import {
    BottomNavigation,
    BottomNavigationItem,
} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'

import getRouteIndex from '@helper/getRouteIndex'

const homeIcon = <FontIcon className="material-icons">home</FontIcon>
const diaryIcon = <FontIcon className="material-icons">book</FontIcon>
const reportIcon = <FontIcon className="material-icons">timeline</FontIcon>
const personIcon = <FontIcon className="material-icons">person</FontIcon>

const paperStyle = {
    width: '100vw',
    bottom: '0vh',
    position: 'fixed',
}

class Navbar extends Component {
    static contextTypes = {
        router: T.object,
    }

    state = {
        selectedIndex: getRouteIndex(this.context.router),
    }

    select = index => {
        const { user_id } = this.props

        this.setState({ selectedIndex: index })

        let link = '/'
        if (index === 0) link = '/'
        else if (index === 1) link = '/diary'
        else if (index === 2) link = '/report'
        else if (index === 3) link = '/user/' + user_id

        return this.context.router.history.push(link)
    }

    render() {
        const { navbar } = this.props

        return (
            navbar && (
                <Paper zDepth={1} style={paperStyle}>
                    <BottomNavigation selectedIndex={this.state.selectedIndex}>
                        <BottomNavigationItem
                            label="Home"
                            icon={homeIcon}
                            onClick={this.select.bind(null, 0)}
                        />
                        <BottomNavigationItem
                            label="Diary"
                            icon={diaryIcon}
                            onClick={this.select.bind(null, 1)}
                        />
                        <BottomNavigationItem
                            label="Report"
                            icon={reportIcon}
                            onClick={this.select.bind(null, 2)}
                        />
                        <BottomNavigationItem
                            label="My Feed"
                            icon={personIcon}
                            onClick={this.select.bind(null, 3)}
                        />
                    </BottomNavigation>
                </Paper>
            )
        )
    }
}

Navbar.propTypes = {
    navbar: T.bool.isRequired,
    user_id: T.string.isRequired,
}

import { connect } from 'react-redux'

const mapStateToProps = ({ common: { navbar }, user: { _id } }) => ({
    navbar,
    user_id: _id,
})

export default connect(mapStateToProps)(Navbar)
