import React from 'react'
import { AppBar } from 'material-ui'

const handleClick = () => console.log('hey hey')

const style = {
    appbar: {
        boxShadow:
            '0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
    },
}

const Header = props => (
    <AppBar
        title="Health App"
        onLeftIconButtonClick={handleClick}
        onTitleClick={handleClick}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        style={style.appbar}
    />
)

export default Header
