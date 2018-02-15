import React from 'react'
import { AppBar } from 'material-ui'

const handleClick = () => console.log('hey hey')

const Header = props => (
    <AppBar
        title="Health App"
        onLeftIconButtonClick={handleClick}
        onTitleClick={handleClick}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
)

export default Header
