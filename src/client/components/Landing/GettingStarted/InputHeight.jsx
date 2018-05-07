import React, { Component } from 'react'
import T from 'prop-types'

import { HEIGHT_TYPE } from '@constant'

import Picker from 'rmc-picker'
import styles from './gettingStarted.css'

const style = {
    title: {
        margin: 0,
        color: 'white',
    },
    weightWrapper: { display: 'flex', padding: '5% 10%' },
}

const max_human_height = 250
const min_human_height = 100
const height_type = ['CM']

class InputHeight extends Component {
    state = {
        height_items: this.getHeightItems(),
        height_type_items: this.getHeightTypeItems(),

        height: `${max_human_height / 2 + 50}`,
        height_type: 'CM',
    }

    componentDidMount() {
        this.updateParentState()
    }

    updateParentState = () => {
        const { onChange } = this.props

        const { height, height_type } = this.state

        onChange({
            value: parseInt(height),
            tp: HEIGHT_TYPE[height_type],
        })
    }

    handleChangeHeight = height =>
        this.setState({ height }, this.updateParentState)

    onScrollChange = value => {
        console.log('onScrollChange', value)
    }

    getHeightItems() {
        let items = []

        for (let i = min_human_height; i <= max_human_height; i++) {
            items.push(
                <Picker.Item value={i + ''} key={i}>
                    {i}
                </Picker.Item>
            )
        }
        return items
    }

    getHeightTypeItems() {
        return height_type.map((w, i) => (
            <Picker.Item value={w} key={i}>
                {w}
            </Picker.Item>
        ))
    }

    render() {
        const {
            height,
            height_type,
            height_items,
            height_type_items,
        } = this.state
        return (
            <div>
                <h4 style={style.title}>Current Height</h4>
                <div style={style.weightWrapper}>
                    <div className={styles.weightPickWrapper}>
                        <Picker
                            selectedValue={height}
                            onValueChange={this.handleChangeHeight}
                            onScrollChange={this.onScrollChange}
                        >
                            {height_items}
                        </Picker>
                    </div>
                    <div className={styles.weightPickWrapper}>
                        <Picker
                            selectedValue={height_type}
                            onValueChange={console.log}
                            onScrollChange={this.onScrollChange}
                        >
                            {height_type_items}
                        </Picker>
                    </div>
                </div>
            </div>
        )
    }
}

InputHeight.propTypes = {
    onChange: T.func.isRequired,
}

export default InputHeight
