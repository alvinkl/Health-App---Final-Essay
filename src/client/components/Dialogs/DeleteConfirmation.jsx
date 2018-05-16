import React, { Component } from 'react'
import T from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const DeleteConfirmation = ({ open, handleClose, deleteEvent }) => {
    const handleDelete = () => {
        deleteEvent()
        handleClose()
    }

    const actions = [
        <FlatButton
            key="delete-cancel"
            label="Cancel"
            primary
            onClick={handleClose}
        />,
        <FlatButton
            key="delete-yes"
            label="Yes"
            secondary
            onClick={handleDelete}
        />,
    ]

    return (
        <Dialog
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={handleClose}
        >
            Are you sure you want to delete this?
        </Dialog>
    )
}

DeleteConfirmation.propTypes = {
    open: T.bool.isRequired,
    deleteEvent: T.func,
    handleClose: T.func.isRequired,
}

DeleteConfirmation.defaultProps = {
    open: false,
    handleDelete: () => {},
}

export default DeleteConfirmation
