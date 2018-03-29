import React, { Component } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import { CUISINE_TYPE } from '@constant'
import to from '@helper/asyncAwait'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import DisplayRestaurantLocation from './DisplayRestaurantLocation'

import styles from '../contents.css'

const style = {
    colorWhite: {
        color: 'white',
    },
    iconStyle: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        margin: 0,
    },
    labelStyle: {
        color: 'white',
        width: '100%',
    },
    dateBirthFieldStyle: {
        color: 'white',
        textAlign: 'center',
    },
}

const checkedIcon = <div className={styles.selectedRadio} />
const uncheckedIcon = <div />

export class SuggestFood extends Component {
    state = {
        step: 0,
        cuisine: '',
        food: {},
    }

    handleSuggestFoodClick = () => {
        const { fetchRestaurantNearby } = this.props
        fetchRestaurantNearby({
            lat: -6.2018556,
            lon: 106.7807473,
        })

        this.setState({ step: 1 })
    }

    handleSelectedCuisine = async e => {
        const {
            suggestFood: { restaurant_nearby },
            fetchMenuFromRestaurant,
        } = this.props
        const cuisine = e.target.value

        const restaurant_ids = restaurant_nearby[cuisine].map(
            r => r.restaurant_id
        )

        await fetchMenuFromRestaurant(restaurant_ids)

        return this.setState({
            cuisine,
            step: this.state.step + 1,
        })
    }

    handleSelectedFood = e => {
        const data = JSON.parse(e.target.value)

        this.setState(
            {
                food: data,
                step: this.state.step + 1,
            },
            () => {
                // const { fetchSuggestRestaurant } = this.props
                // const { cuisine, food: { keywords } } = this.state
                // const cs = CUISINE_TYPE[cuisine.toUpperCase()]
                // const kw = keywords.join(',')
                // fetchSuggestRestaurant({ cuisine: cs, keywords: kw })
            }
        )
    }

    handleAddToDiary = meal_type => {
        const {
            food: {
                name: food_name,
                nutritions: nutrition,
                serving_size: quantity,
            },
        } = this.state
        const { addToDiary, showSnackbar } = this.props

        const data = {
            food_name,
            nutrition,
            total_weight: 1,
            quantity,
            meal_type,
        }

        showSnackbar('Added to diary')

        addToDiary(data)
    }

    renderStep = step => {
        const {
            suggestFood: { cuisines, restaurant_nearby, menus },
        } = this.props

        switch (step) {
            case 0:
                return (
                    <RaisedButton
                        className={styles.buttonSuggest}
                        onClick={this.handleSuggestFoodClick}
                    >
                        Suggest Food
                    </RaisedButton>
                )
            case 1: {
                return (
                    <RadioButtonGroup
                        name="cuisine"
                        onChange={this.handleSelectedCuisine}
                    >
                        {cuisines.map((key, i) => (
                            <RadioButton
                                key={i}
                                className={styles.radio}
                                value={key}
                                label={key}
                                checkedIcon={checkedIcon}
                                uncheckedIcon={uncheckedIcon}
                                iconStyle={style.iconStyle}
                                inputStyle={style.colorWhite}
                                labelStyle={style.labelStyle}
                            />
                        ))}
                    </RadioButtonGroup>
                )
            }
            case 2: {
                // const dt = Object.keys(menus).reduce(
                //     (prev, curr) => [...prev, ...menus[curr]],
                //     []
                // )

                return (
                    <RadioButtonGroup
                        name="cuisine-food"
                        onChange={this.handleSelectedFood}
                    >
                        {menus.map((key, i) => (
                            <RadioButton
                                key={i}
                                className={styles.radio}
                                value={JSON.stringify(key)}
                                label={key.name}
                                checkedIcon={checkedIcon}
                                uncheckedIcon={uncheckedIcon}
                                iconStyle={style.iconStyle}
                                inputStyle={style.colorWhite}
                                labelStyle={style.labelStyle}
                            />
                        ))}
                    </RadioButtonGroup>
                )
            }
            case 3: {
                const { cuisine, food } = this.state
                const restaurant = restaurant_nearby[cuisine].find(
                    r => r.restaurant_id === food.restaurant_id
                )

                return (
                    <DisplayRestaurantLocation
                        handleAddToDiary={this.handleAddToDiary}
                        restaurant={restaurant}
                    />
                )
            }
            default:
                return
        }
    }

    render() {
        const { suggestFood: { food, loading, error } } = this.props

        const { step } = this.state

        return (
            <Paper className={styles.suggestFood} zDepth={3} id="suggest-food">
                {loading && (
                    <CircularProgress className={styles.loader} size={30} />
                )}
                {!loading && this.renderStep(step)}
            </Paper>
        )
    }
}

SuggestFood.propTypes = {
    suggestFood: T.shape({
        cuisines: T.array,
        restaurant_nearby: T.object,
        menus: T.array,
        loading: T.bool,
        error: T.bool,
    }).isRequired,
    fetchRestaurantNearby: T.func.isRequired,
    fetchMenuFromRestaurant: T.func.isRequired,
    addToDiary: T.func.isRequired,
    showSnackbar: T.func.isRequired,
}

import { connect } from 'react-redux'
import {
    fetchRestaurantNearby,
    fetchMenuFromRestaurant,
} from '@actions/suggestFood'
import { addToDiary } from '@actions/diary'
import { showSnackbar } from '@actions/common'

const mapStateToProps = ({ suggestFood }) => ({
    suggestFood,
})

const mapDispatchToProps = dispatch => ({
    fetchRestaurantNearby: event => dispatch(fetchRestaurantNearby(event)),
    fetchMenuFromRestaurant: event => dispatch(fetchMenuFromRestaurant(event)),
    addToDiary: event => dispatch(addToDiary(event)),
    showSnackbar: event => dispatch(showSnackbar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SuggestFood)
