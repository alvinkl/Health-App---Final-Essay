import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import { MEAL_TYPE } from '@constant'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardActions,
    CardText,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Popover from 'material-ui/Popover/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'

class DisplayRestaurantLocation extends Component {
    state = {
        open: false,
    }

    handleAddDiary = (_, value) => {
        const { handleAddToDiary } = this.props

        handleAddToDiary(value)
        this.setState({ open: false })
    }

    handleClickAddDiary = event =>
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        })

    closePopover = () => this.setState({ open: false })

    render() {
        const {
            restaurant: {
                restaurant_id,
                name,
                cuisines,
                lat,
                lon,
                keywords,
                address,
                url,
                thumbnail,
            },
            handleBackButton,
        } = this.props
        const { open, anchorEl } = this.state

        return (
            <Card id={restaurant_id}>
                <CardHeader
                    title={name}
                    subtitle={cuisines}
                    avatar={thumbnail}
                />
                <CardText>{address}</CardText>
                <CardActions>
                    <Fragment>
                        <FlatButton
                            primary
                            onClick={this.handleClickAddDiary}
                            label="Add to Diary"
                        />
                        <FlatButton
                            secondary
                            onClick={handleBackButton}
                            label="Back"
                        />
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onRequestClose={this.closePopover}
                            anchorOrigin={{
                                horizontal: 'middle',
                                vertical: 'center',
                            }}
                            targetOrigin={{
                                horizontal: 'middle',
                                vertical: 'center',
                            }}
                        >
                            <Menu onChange={this.handleAddDiary}>
                                <MenuItem
                                    value={MEAL_TYPE.BREAKFAST}
                                    primaryText="Breakfast"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.LUNCH}
                                    primaryText="Lunch"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.DINNER}
                                    primaryText="Dinner"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.SNACK}
                                    primaryText="Snack"
                                />
                            </Menu>
                        </Popover>
                    </Fragment>
                </CardActions>
            </Card>
        )
    }
}

DisplayRestaurantLocation.propTypes = {
    restaurant: T.object.isRequired,
    handleAddToDiary: T.func.isRequired,
    handleBackButton: T.func.isRequired,
}

export default DisplayRestaurantLocation
