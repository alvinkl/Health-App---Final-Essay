import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'
import { TransitionGroup } from 'react-transition-group'

import to from '@helper/asyncAwait'
import { getFood } from '@urls'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import ContentDiary from './ContentDiary'
import AddToDiary from './AddToDiary'
import Dialog from 'material-ui/Dialog'
import NutritionDetail from './NutritionDetail'

import { Fade } from '@components/Transitions'

import styles from './diary.css'

import { fetchDiary } from '@actions/diary'

const style = {
    nutrition_detail_dialog: {
        position: 'absolute',
        width: '90%',
        top: 0,
        left: '5%',
    },
}

class Diary extends Component {
    constructor(props) {
        super(props)

        this.timer = undefined
    }

    state = {
        diary: {},
        food_nutrition: [],
        open_nutrition_detail: false,
        nutrition_detail_data: {},

        show_add_to_diary: false,

        loading: false,
        error_nutrition: false,
    }

    static initialAction = store => {
        // store.dispatch(fetchDiary())
    }

    componentDidMount() {
        const { fetchDiary } = this.props
        const { loading } = this.state

        if (!loading) fetchDiary()
    }

    componentWillReceiveProps(nextProps) {
        const { diary } = nextProps
        if (!isEmpty(diary)) this.setState({ diary })
    }

    fetchFoodNutrition = async food_name => {
        const { showLoader, hideLoader } = this.props
        showLoader()

        const body = JSON.stringify({
            query: food_name,
        })

        const [err, res] = await to(
            fetch(getFood, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body,
                credentials: 'same-origin',
            })
        )
        if (err)
            return this.setState(
                { show_add_to_diary: false, error_nutrition: true },
                hideLoader
            )

        const food_nutrition = await res.json()

        this.setState({ show_add_to_diary: true, food_nutrition }, hideLoader)
    }

    addFoodToDiary = async (index, meal_type) => {
        const { addToDiary, showSnackbar } = this.props
        const { food_nutrition } = this.state

        const {
            name,
            quantity,
            nutrients,
            total_weight,
            unit,
        } = food_nutrition[index]
        const param = {
            name,
            unit,
            quantity,
            nutrition: nutrients,
            total_weight,
            meal_type,
        }

        const [err] = await to(addToDiary(param))
        if (err)
            return showSnackbar('Failed to add to diary! Please try again!')

        food_nutrition.splice(index, 1)
        const show_add_to_diary = !isEmpty(food_nutrition)
        return this.setState({ food_nutrition, show_add_to_diary }, () => {
            showSnackbar('Food added to diary!')
            if (!show_add_to_diary) this.props.fetchDiary()
        })
    }

    removeFoodFromList = index => {
        const food_nutrition = [
            ...this.state.food_nutrition.slice(0, index),
            ...this.state.food_nutrition.slice(index + 1),
        ]

        this.setState({
            food_nutrition,
            show_add_to_diary: !isEmpty(food_nutrition),
        })
    }

    handleChangeSearch = e => {
        clearTimeout(this.timer)

        const search = e.target.value
        if (!search) return this.setState({ show_add_to_diary: false })

        this.timer = setTimeout(() => {
            this.fetchFoodNutrition(search)
        }, 1500)
    }

    handleOpen = nutrition_detail_data => {
        this.setState({ open_nutrition_detail: true, nutrition_detail_data })
    }

    handleClose = () => {
        this.setState({ open_nutrition_detail: false })
    }

    renderBreakfast = () => {
        const { breakfast } = this.state.diary

        return (
            <ContentDiary
                title="Breakfast"
                content={breakfast}
                handleOpen={this.handleOpen}
            />
        )
    }

    renderLunch = () => {
        const { lunch } = this.state.diary

        return (
            <ContentDiary
                title="Lunch"
                content={lunch}
                handleOpen={this.handleOpen}
            />
        )
    }

    renderDinner = () => {
        const { dinner } = this.state.diary

        return (
            <ContentDiary
                title="Dinner"
                content={dinner}
                handleOpen={this.handleOpen}
            />
        )
    }

    renderSnack = () => {
        const { snack } = this.state.diary

        return (
            <ContentDiary
                title="Snack"
                content={snack}
                handleOpen={this.handleOpen}
            />
        )
    }

    renderNutritionDetailDialog = () => {
        const { open_nutrition_detail, nutrition_detail_data } = this.state

        const actions = (
            <FlatButton label="Close" onClick={this.handleClose} primary />
        )

        return (
            <Dialog
                title="Dialog With Actions"
                modal={false}
                open={open_nutrition_detail}
                onRequestClose={this.handleClose}
                contentStyle={style.nutrition_detail_dialog}
                autoScrollBodyContent
                actions={actions}
            >
                <NutritionDetail data={nutrition_detail_data} expand />
            </Dialog>
        )
    }

    render() {
        const {
            show_add_to_diary,
            food_nutrition,
            error_nutrition,
        } = this.state

        return (
            <div>
                <div className={styles.headerInput}>
                    <TextField
                        className={styles.searchField}
                        id="food-search"
                        hintText="What have you eat?"
                        errorText={error_nutrition ? 'Food not found!' : ''}
                        onChange={this.handleChangeSearch}
                    />
                </div>

                {!show_add_to_diary && (
                    <div className={styles.content}>
                        {this.renderBreakfast()}
                        {this.renderLunch()}
                        {this.renderDinner()}
                        {this.renderSnack()}
                    </div>
                )}

                {show_add_to_diary && (
                    <AddToDiary
                        key="addtodiary"
                        {...{
                            food_nutrition,
                            removeFoodFromList: this.removeFoodFromList,
                            addFoodToDiary: this.addFoodToDiary,
                        }}
                    />
                )}
                {this.renderNutritionDetailDialog()}
            </div>
        )
    }
}

Diary.propTypes = {
    diary: T.object.isRequired,

    fetchDiary: T.func.isRequired,
    addToDiary: T.func.isRequired,
    showLoader: T.func.isRequired,
    hideLoader: T.func.isRequired,
    showSnackbar: T.func.isRequired,
}

import { connect } from 'react-redux'
import { showLoader, hideLoader, showSnackbar } from '@actions/common'
import { addToDiary } from '@actions/diary'

const mapStateToProps = ({ diary }) => ({
    diary: diary.today_diary,
})

const mapDispatchToProps = dispatch => ({
    fetchDiary: () => dispatch(fetchDiary()),
    addToDiary: event => dispatch(addToDiary(event)),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    showSnackbar: event => dispatch(showSnackbar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Diary)
