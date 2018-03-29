import React from 'react'
import T from 'prop-types'

import { default as MaterialSnackbar } from 'material-ui/Snackbar'

const Snackbar = ({ show, message, hideSnackbar }) => {
    return (
        <MaterialSnackbar
            open={show}
            message={message}
            onRequestClose={hideSnackbar}
            autoHideDuration={4000}
        />
    )
}

Snackbar.propTypes = {
    show: T.bool.isRequired,
    message: T.string.isRequired,
    hideSnackbar: T.func.isRequired,
}

import { connect } from 'react-redux'
import { hideSnackbar } from '@actions/common'

const mapStateToProps = ({ common: { snackbar } }) => ({
    ...snackbar,
})

const mapDispatchToProps = dispatch => ({
    hideSnackbar: () => dispatch(hideSnackbar()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar)
