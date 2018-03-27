import React, { Component } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import { CUISINE_TYPE } from '@constant'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import DisplayRestaurantLocation from './DisplayRestaurantLocation'

import styles from './contents.css'

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
    static propTypes = {
        suggestFood: T.shape({
            food: T.object,
            restaurant: T.array,
            loading: T.bool,
            error: T.bool,
        }).isRequired,
        fetchSuggestFood: T.func.isRequired,
        fetchSuggestRestaurant: T.func.isRequired,
        addToDiary: T.func.isRequired,
        showSnackbar: T.func.isRequired,
    }

    state = {
        step: 0,
        cuisine: '',
        food: {},
        restaurant: '',
    }

    handleSuggestFoodClick = () => {
        const { fetchSuggestFood } = this.props
        fetchSuggestFood({
            lat: -6.2018556,
            lon: 106.7807473,
        })

        this.setState({ step: 1 })
    }

    handleSelectedCuisine = e => {
        this.setState({
            cuisine: e.target.value,
            step: this.state.step + 1,
        })
    }

    handleSelectedFood = e => {
        this.setState(
            {
                food: JSON.parse(e.target.value),
                step: this.state.step + 1,
            },
            () => {
                const { fetchSuggestRestaurant } = this.props
                const { cuisine, food: { keywords } } = this.state

                const cs = CUISINE_TYPE[cuisine.toUpperCase()]
                const kw = keywords.join(',')

                fetchSuggestRestaurant({ cuisine: cs, keywords: kw })
            }
        )
    }

    handleSelectedRestaurant = e => {
        this.setState({
            restaurant: JSON.parse(e.target.value),
            step: this.state.step + 1,
        })
    }

    handleAddToDiary = () => {
        const { food: { food_name, nutrition } } = this.state
        const { addToDiary, showSnackbar } = this.props

        const data = {
            food_name,
            nutrition,
            total_weight: 1,
            quantity: 1,
            meal_type: 1,
        }

        showSnackbar('Added to diary')

        addToDiary(data)
    }

    renderStep = step => {
        const { suggestFood: { food, restaurant } } = this.props
        const { cuisine } = this.state

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
                const keys = Object.keys(food)

                return (
                    <RadioButtonGroup
                        name="cuisine"
                        onChange={this.handleSelectedCuisine}
                    >
                        {keys.map((key, i) => (
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
                const dt = food[cuisine]
                return (
                    <RadioButtonGroup
                        name="cuisine-food"
                        onChange={this.handleSelectedFood}
                    >
                        {dt.map((key, i) => (
                            <RadioButton
                                key={i}
                                className={styles.radio}
                                value={JSON.stringify(key)}
                                label={key.food_name}
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
                return (
                    <RadioButtonGroup
                        name="restaurant"
                        onChange={this.handleSelectedRestaurant}
                    >
                        {restaurant.map((r, i) => (
                            <RadioButton
                                key={i}
                                className={styles.radio}
                                value={JSON.stringify(r)}
                                label={r.name}
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
            case 4:
                return (
                    <DisplayRestaurantLocation
                        handleAddToDiary={this.handleAddToDiary}
                        restaurant={this.state.restaurant}
                    />
                )
            default:
                return
        }
    }

    render() {
        const { suggestFood: { food, loading, error } } = this.props

        const { step } = this.state

        return (
            <Paper className={styles.suggestFood} zDepth={3} id="suggest-food">
                {loading && <CircularProgress size={30} />}
                {!loading && this.renderStep(step)}
            </Paper>
        )
    }
}

import { connect } from 'react-redux'
import { fetchSuggestFood, fetchSuggestRestaurant } from '@actions/suggestFood'
import { addToDiary } from '@actions/diary'
import { showSnackbar } from '@actions/common'

const mapStateToProps = ({ suggestFood }) => ({
    suggestFood,
})

const mapDispatchToProps = dispatch => ({
    fetchSuggestFood: event => dispatch(fetchSuggestFood(event)),
    fetchSuggestRestaurant: event => dispatch(fetchSuggestRestaurant(event)),
    addToDiary: event => dispatch(addToDiary(event)),
    showSnackbar: event => dispatch(showSnackbar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SuggestFood)
