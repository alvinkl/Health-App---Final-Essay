import React, { Component } from 'react'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const style = {
    drawer: {
        width: '80vw !important',
    },
}

class Sidebar extends Component {
    handleClose = () => {}

    render() {
        return (
            <Drawer
                docked={false}
                open={false}
                style={style.drawer}
                // onRequestChange={open => this.setState({ open })}
            >
                <MenuItem onClick={this.handleClose}>Menu Item 1</MenuItem>
                <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
            </Drawer>
        )
    }
}

export default Sidebar
