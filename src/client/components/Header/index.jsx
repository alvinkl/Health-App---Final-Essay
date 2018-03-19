import React from 'react'
import T from 'prop-types'

import { AppBar } from 'material-ui'
import styles from './header.css'

const handleClick = () => console.log('hey hey')

export const Header = ({ openSidebar, header }) =>
    header && (
        <AppBar
            title="Health App"
            className={styles.noShadow}
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

const mapStateToProps = ({ common: { header } }) => ({
    header,
})

const mapDispatchToProps = dispatch => ({
    openSidebar: event => dispatch(openSidebar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
