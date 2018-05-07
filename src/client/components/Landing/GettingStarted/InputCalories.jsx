import React, { Component } from 'react'
import T from 'prop-types'

import Picker from 'rmc-picker'
import styles from './gettingStarted.css'

const style = {
    title: {
        margin: 0,
        color: 'white',
    },
    weightWrapper: { display: 'flex', padding: '5% 10%' },
}

class InputCalories extends Component {
    state = {
        calories_items: this.getCaloriesItems(),
        selected_calories: `${this.props.calories_recommended}`,
    }

    updateParentState = () => {
        const { onChange } = this.props

        const { selected_calories } = this.state

        onChange(selected_calories)
    }

    handleChangeCalories = selected_calories =>
        this.setState({ selected_calories }, this.updateParentState)

    getCaloriesItems() {
        const { rec_low, rec_high } = this.props
        let items = []

        for (let i = rec_low; i <= rec_high; i += 50) {
            items.push(
                <Picker.Item value={i + ''} key={i}>
                    {i}
                </Picker.Item>
            )
        }
        return items
    }

    render() {
        const { calories_items, selected_calories } = this.state
        return (
            <div>
                <h4 style={style.title}>Target Calories a Day</h4>
                <div style={style.weightWrapper}>
                    <div className={styles.caloriesPickWrapper}>
                        <Picker
                            selectedValue={selected_calories}
                            onValueChange={this.handleChangeCalories}
                        >
                            {calories_items}
                        </Picker>
                    </div>
                </div>
            </div>
        )
    }
}

InputCalories.propTypes = {
    onChange: T.func.isRequired,
    rec_low: T.number.isRequired,
    rec_high: T.number.isRequired,
    calories_recommended: T.number.isRequired,
}

export default InputCalories
