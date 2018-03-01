import React, { Component } from 'react'
import T from 'prop-types'
import FontIcon from 'material-ui/FontIcon'
import {
    BottomNavigation,
    BottomNavigationItem,
} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'

const homeIcon = <FontIcon className="material-icons">home</FontIcon>
const diaryIcon = <FontIcon className="material-icons">book</FontIcon>
const reportIcon = <FontIcon className="material-icons">timeline</FontIcon>

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
        selectedIndex: 0,
    }

    select = index => {
        this.setState({ selectedIndex: index })

        let link = '/'
        if (index === 0) link = '/'
        else if (index === 1) link = '/diary'
        else if (index === 2) link = '/report'

        return this.context.router.history.push(link)
    }

    render() {
        return (
            <Paper zDepth={1} style={paperStyle}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                    <BottomNavigationItem
                        label="Home"
                        icon={homeIcon}
                        onClick={() => this.select(0)}
                    />
                    <BottomNavigationItem
                        label="Diary"
                        icon={diaryIcon}
                        onClick={() => this.select(1)}
                    />
                    <BottomNavigationItem
                        label="Nearby"
                        icon={reportIcon}
                        onClick={() => this.select(2)}
                    />
                </BottomNavigation>
            </Paper>
        )
    }
}

export default Navbar
