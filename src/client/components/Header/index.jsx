import React from 'react'
import cn from 'classnames'
import T from 'prop-types'

import { AppBar } from 'material-ui'
import styles from './header.css'

const handleClick = () => console.log('hey hey')

export const Header = ({ openSidebar, header, is_online }) =>
    header && (
        <AppBar
            title="Health App"
            className={cn(styles.noShadow, { [styles.offline]: !is_online })}
            onLeftIconButtonClick={openSidebar}
            onTitleClick={handleClick}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
    )

Header.propTypes = {
    header: T.bool.isRequired,
    openSidebar: T.func.isRequired,
}

import { connect } from 'react-redux'
import { openSidebar } from '@actions/common'

const mapStateToProps = ({ common: { header, is_online } }) => ({
    header,
    is_online,
})

const mapDispatchToProps = dispatch => ({
    openSidebar: event => dispatch(openSidebar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
