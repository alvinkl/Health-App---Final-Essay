import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import { MEAL_TYPE } from '@constant'

import {
    Card,
    CardActions,
    CardHeader,
    CardTitle,
    CardText,
} from 'material-ui/Card'
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'
import Popover from 'material-ui/Popover/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'

import styles from './diary.css'

class AddToDiary extends Component {
    state = {
        addingToDiaryIndex: -1,
    }

    handleClickAddDiary = (index, event) =>
        this.setState({
            addingToDiaryIndex: index,
            anchorEl: event.currentTarget,
        })

    handleAddDiary = (index, event, value) => {
        const { addFoodToDiary } = this.props

        this.setState({ addingToDiaryIndex: -1 })
        addFoodToDiary(index, value)
    }

    closePopover = () => this.setState({ addingToDiaryIndex: -1 })

    renderFoodCards = () => {
        const { food_nutrition, removeFoodFromList } = this.props
        const { addingToDiaryIndex, anchorEl } = this.state

        return food_nutrition.map(
            (
                {
                    name,
                    quantity,
                    total_weight,
                    unit,
                    nutrients,
                    alternative_measure,
                    photo: { thumbnail, highres },
                },
                i
            ) => (
                <Card className={styles.foodCard} key={name + i}>
                    <CardHeader
                        title={name}
                        subtitle={quantity + ' ' + unit}
                        avatar={thumbnail}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />

                    <CardTitle subtitle="Nutritions" expandable={true} />
                    <CardText expandable={true}>
                        <Table selectable={false}>
                            <TableBody
                                deselectOnClickaway={false}
                                displayRowCheckbox={false}
                            >
                                {Object.keys(nutrients).map((nutrient, i) => (
                                    <TableRow key={i}>
                                        <TableRowColumn>
                                            {nutrient}
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            {nutrients[nutrient] || 0}
                                        </TableRowColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardText>
                    <CardActions>
                        <Fragment>
                            <FlatButton
                                onClick={this.handleClickAddDiary.bind(this, i)}
                                label="Add to Diary"
                            />
                            <Popover
                                open={addingToDiaryIndex === i}
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
                                <Menu
                                    onChange={this.handleAddDiary.bind(null, i)}
                                >
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
                            <FlatButton
                                secondary
                                label="Remove"
                                onClick={removeFoodFromList.bind(null, i)}
                            />
                        </Fragment>
                    </CardActions>
                </Card>
            )
        )
    }

    render() {
        return (
            <div className={styles.addDiaryContainer}>
                {this.renderFoodCards()}
            </div>
        )
    }
}

AddToDiary.propTypes = {
    food_nutrition: T.array.isRequired,
    removeFoodFromList: T.func.isRequired,
    addFoodToDiary: T.func.isRequired,
}

export default AddToDiary
