import React, { Component } from 'react'
import T from 'prop-types'

import { WEIGHT_TYPE } from '@constant'

import Picker from 'rmc-picker'
import styles from './gettingStarted.css'

const style = {
    title: {
        margin: 0,
        color: 'white',
    },
    weightWrapper: { display: 'flex', padding: '5% 10%' },
}

class InputWeight extends Component {
    state = {
        current_weight_items: this.getWeightItems(),
        current_weight_decimals_items: this.getDecimalItems(),
        weight_type_items: this.getWeightType(),

        current_weight: `${this.props.average_low_weight}`,
        current_weight_decimals: '.0',
        weight_type: 'KG',
    }

    componentDidMount() {
        console.log('Component mounted')
    }

    updateParentState = () => {
        const { onChange } = this.props

        const {
            current_weight,
            current_weight_decimals,
            weight_type,
        } = this.state

        onChange({
            value: parseFloat(current_weight + current_weight_decimals),
            tp: WEIGHT_TYPE[weight_type],
        })
    }

    handleChangeCurrentWeight = current_weight =>
        this.setState({ current_weight }, this.updateParentState)
    handleChangeCurrentWeightDecimal = decimal =>
        this.setState(
            {
                current_weight_decimals: decimal,
            },
            this.updateParentState
        )

    onScrollChange = value => {
        console.log('onScrollChange', value)
    }

    getWeightItems(start) {
        let items = []

        for (
            let i = this.props.average_low_weight;
            i <= this.props.average_high_weight;
            i++
        ) {
            items.push(
                <Picker.Item value={i + ''} key={i}>
                    {i}
                </Picker.Item>
            )
        }
        return items
    }

    getDecimalItems() {
        return this.props.decimals.map((d, i) => (
            <Picker.Item value={d} key={i}>
                {d}
            </Picker.Item>
        ))
    }

    getWeightType() {
        return this.props.weight_type.map((w, i) => (
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
            weight_type_items,
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
                            selectedValue={weight_type}
                            onValueChange={console.log}
                            onScrollChange={this.onScrollChange}
                        >
                            {weight_type_items}
                        </Picker>
                    </div>
                </div>
            </div>
        )
    }
}

InputWeight.propTypes = {
    onChange: T.func.isRequired,
    average_low_weight: T.number.isRequired,
    average_high_weight: T.number.isRequired,
    decimals: T.array.isRequired,
    weight_type: T.array.isRequired,
}

export default InputWeight
