import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import { MEAL_TYPE } from '@constant'

import FlatButton from 'material-ui/FlatButton'
import Popover from 'material-ui/Popover/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'

import NutritionDetail from './NutritionDetail'

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

        return food_nutrition.map((data, i) => (
            <NutritionDetail key={name + i} data={data}>
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
                        <Menu onChange={this.handleAddDiary.bind(null, i)}>
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
            </NutritionDetail>
        ))
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
