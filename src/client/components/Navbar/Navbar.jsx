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
const addIcon = <FontIcon className="material-icons">add</FontIcon>
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
        selectedIndex: getRouteIndex(
            this.context.router.route.location.pathname
        ),
    }

    componentWillReceiveProps(nextProps) {
        const {
            location: { pathname },
        } = this.props
        const {
            location: { pathname: nextPath },
        } = nextProps

        if (nextPath !== pathname)
            this.setState({ selectedIndex: getRouteIndex(nextPath) })
    }

    select = index => {
        this.setState({ selectedIndex: index })

        let link = '/'
        if (index === 0) link = '/'
        else if (index === 1) link = '/diary'
        else if (index === 2) link = '/add-feed'
        else if (index === 3) link = '/report'
        else if (index === 4) link = '/myfeed'

        return this.context.router.history.push(link)
    }

    render() {
        const { navbar } = this.props

        return (
            navbar && (
                <Paper zDepth={1} style={paperStyle}>
                    <BottomNavigation selectedIndex={this.state.selectedIndex}>
                        <BottomNavigationItem
                            icon={homeIcon}
                            onClick={this.select.bind(null, 0)}
                        />
                        <BottomNavigationItem
                            icon={diaryIcon}
                            onClick={this.select.bind(null, 1)}
                        />
                        <BottomNavigationItem
                            icon={addIcon}
                            onClick={this.select.bind(null, 2)}
                        />
                        <BottomNavigationItem
                            icon={reportIcon}
                            onClick={this.select.bind(null, 3)}
                        />
                        <BottomNavigationItem
                            icon={personIcon}
                            onClick={this.select.bind(null, 4)}
                        />
                    </BottomNavigation>
                </Paper>
            )
        )
    }
}

Navbar.propTypes = {
    navbar: T.bool.isRequired,
    location: T.object.isRequired,
}

import { connect } from 'react-redux'
import { withRouter } from 'react-router'

const mapStateToProps = ({ common: { navbar } }) => ({
    navbar,
})

export default withRouter(connect(mapStateToProps)(Navbar))
