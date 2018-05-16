import React, { Component } from 'react'
import T from 'prop-types'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { GridList, GridTile } from 'material-ui/GridList'

const style = {
    grid: {
        textAlign: 'center',
    },
    dialog: {
        textAlign: 'center',
    },
}

class Content extends Component {
    state = {
        value: 0,
    }

    componentDidMount() {
        const {
            dialog_data: { value },
        } = this.props

        this.setState({ value })
    }

    componentWillReceiveProps(nextProps) {
        const {
            dialog_data: { value: pastValue },
        } = this.props
        const {
            dialog_data: { value },
        } = nextProps

        if (value !== pastValue) this.setState({ value })
    }

    handleIncreaseValue = () => {
        const { increment_decrement_value } = this.props
        this.setState({
            value: parseFloat(
                (this.state.value + increment_decrement_value).toFixed(1)
            ),
        })
    }

    handleDecreaseValue = () => {
        const { increment_decrement_value } = this.props
        this.setState({
            value: parseFloat(
                (this.state.value - increment_decrement_value).toFixed(1)
            ),
        })
    }

    handleSubmit = () => {
        const { handleSubmit } = this.props
        const { value } = this.state

        handleSubmit(value)
    }

    render() {
        const {
            open_dialog,
            dialog_data: { title },
            handleCloseDialog,
        } = this.props
        const { value } = this.state

        const actions = [
            <FlatButton
                key="content-cancel"
                label="Cancel"
                secondary
                onClick={handleCloseDialog}
            />,
            <FlatButton
                key="content-submit"
                label="Submit"
                primary
                keyboardFocused={true}
                onClick={this.handleSubmit}
            />,
        ]

        return (
            <Dialog
                key="content-dialog"
                title={title}
                style={style.dialog}
                actions={actions}
                modal={false}
                open={open_dialog}
                onRequestClose={handleCloseDialog}
            >
                <GridList
                    cols={3}
                    padding={0}
                    cellHeight={30}
                    style={style.grid}
                >
                    <GridTile>
                        <FlatButton onClick={this.handleDecreaseValue}>
                            -
                        </FlatButton>
                    </GridTile>
                    <GridTile>{value}</GridTile>
                    <GridTile>
                        <FlatButton onClick={this.handleIncreaseValue}>
                            +
                        </FlatButton>
                    </GridTile>
                </GridList>
            </Dialog>
        )
    }
}

Content.propTypes = {
    open_dialog: T.bool.isRequired,
    dialog_data: T.object.isRequired,
    increment_decrement_value: T.number.isRequired,

    handleCloseDialog: T.func.isRequired,
    handleSubmit: T.func.isRequired,
}

export default Content
