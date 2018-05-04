import React, { Component } from 'react'
import T from 'prop-types'

import { GOAL } from '@constant'

import Picker from 'rmc-picker'
import styles from './gettingStarted.css'

const style = {
    title: {
        margin: 0,
        color: 'white',
    },
    weightWrapper: { display: 'flex', padding: '5% 10%' },
}

const average_low_weight = 45
const average_high_weight = 150
const decimals = Array.apply(null, { length: 10 }).map((_, i) => '.' + i)
const weight_type = ['KG']

class InputWeight extends Component {
    state = {
        current_weight_items: this.getWeightItems(),
        current_weight_decimals_items: this.getDecimalItems(),

        current_weight: `${average_high_weight / 2}`,
        current_weight_decimals: '.0',
        weight_type: this.getWeightType(),
    }

    handleChangeCurrentWeight = current_weight =>
        this.setState({ current_weight })
    handleChangeCurrentWeightDecimal = decimal =>
        this.setState({
            current_weight_decimals: decimal,
        })

    onScrollChange = value => {
        console.log('onScrollChange', value)
    }

    getWeightItems(start) {
        let items = []
        const { goal } = this.props

        for (let i = average_low_weight; i <= average_high_weight; i++) {
            items.push(
                <Picker.Item value={i + ''} key={i}>
                    {i}
                </Picker.Item>
            )
        }
        return items
    }

    getDecimalItems() {
        return decimals.map((d, i) => (
            <Picker.Item value={d} key={i}>
                {d}
            </Picker.Item>
        ))
    }

    getWeightType() {
        return weight_type.map((w, i) => (
            <Picker.Item value={w} key={i}>
                {w}
            </Picker.Item>
        ))
    }

    render() {
        const {
            current_weight,
            current_weight_decimals,
            current_weight_items,
            current_weight_decimals_items,
            weight_type,
        } = this.state
        return (
            <div>
                <h4 style={style.title}>Current Weight</h4>
                <div style={style.weightWrapper}>
                    <div className={styles.weightPickWrapper}>
                        <Picker
                            selectedValue={current_weight}
                            onValueChange={this.handleChangeCurrentWeight}
                            onScrollChange={this.onScrollChange}
                        >
                            {current_weight_items}
                        </Picker>
                    </div>
                    <div className={styles.weightPickWrapper}>
                        <Picker
                            selectedValue={current_weight_decimals}
                            onValueChange={
                                this.handleChangeCurrentWeightDecimal
                            }
                            onScrollChange={this.onScrollChange}
                        >
                            {current_weight_decimals_items}
                        </Picker>
                    </div>
                    <div className={styles.weightPickWrapper}>
                        <Picker
                            selectedValue={weight_type[0]}
                            onValueChange={console.log}
                            onScrollChange={this.onScrollChange}
                        >
                            {weight_type}
                        </Picker>
                    </div>
                </div>
            </div>
        )
    }
}

InputWeight.propTypes = {
    goal: T.number.isRequired,
}

export default InputWeight
