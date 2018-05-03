import React, { Component } from 'react'
import T from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/arrow-back'
import {
    BottomNavigation,
    BottomNavigationItem,
} from 'material-ui/BottomNavigation'
import FontIcon from 'material-ui/FontIcon'
import Paper from 'material-ui/Paper'

import CameraModule from './CameraModule'
import ImagePickModule from './ImagePickModule'

const cameraIcon = <FontIcon className="material-icons">camera_alt</FontIcon>
const photoIcon = <FontIcon className="material-icons">insert_photo</FontIcon>

const paperStyle = {
    width: '100vw',
    bottom: '0vh',
    position: 'fixed',
}

class AddFeed extends Component {
    state = {
        selected_index: 0,
    }

    select = index => this.setState({ selected_index: index })

    handleBackButton = () => this.context.router.history.push('/')

    renderModule = () => {
        const { selected_index } = this.state

        if (selected_index === 0)
            return <ImagePickModule handleBackButton={this.handleBackButton} />
        if (selected_index === 1)
            return <CameraModule handleBackButton={this.handleBackButton} />

        return null
    }

    render() {
        const { selected_index } = this.state

        return (
            <div>
                <AppBar
                    title="Add Feed"
                    iconElementLeft={
                        <IconButton onClick={this.handleBackButton}>
                            <NavigationClose />
                        </IconButton>
                    }
                />

                {this.renderModule()}

                <Paper zDepth={1} style={paperStyle}>
                    <BottomNavigation selectedIndex={selected_index}>
                        <BottomNavigationItem
                            icon={photoIcon}
                            onClick={this.select.bind(null, 0)}
                        />
                        <BottomNavigationItem
                            icon={cameraIcon}
                            onClick={this.select.bind(null, 1)}
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        )
    }
}

AddFeed.contextTypes = {
    router: T.object.isRequired,
}

export default AddFeed
