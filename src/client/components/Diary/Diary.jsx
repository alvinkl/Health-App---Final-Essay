import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import cn from 'classnames'
import { isEmpty } from 'lodash'

import to from '@helper/asyncAwait'
import { getFood } from '@urls'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

import ContentDiary from './ContentDiary'
import AddToDiary from './AddToDiary'
import NutritionDetail from './NutritionDetail'

import styles from './diary.css'

import { fetchDiary } from '@actions/diary'

const style = {
    nutrition_detail_dialog: {
        position: 'absolute',
        width: '90%',
        top: 0,
        left: '5%',
    },
    textCenter: {
        textAlign: 'center',
    },
    textLeft: {
        textAlign: 'left',
    },
}

class Diary extends Component {
    constructor(props) {
        super(props)

        this.timer = undefined
        this.today = new Date()
    }

    state = {
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
        this.setState({
            open_nutrition_detail: false,
            nutrition_detail_data: {},
        })
    }

    handleRemoveDiary = () => {
        const { removeDiary } = this.props
        const { nutrition_detail_data } = this.state
        const { meal_type, _id: diary_id } = nutrition_detail_data

        removeDiary({ meal_type, diary_id })
        this.handleClose()
    }

    handleChangeDate = (_, date) => this.props.fetchDiary({ startDate: date })

    renderNutritionDetailDialog = () => {
        const { open_nutrition_detail, nutrition_detail_data } = this.state

        const actions = [
            <FlatButton
                key="remove-btn"
                label="Remove"
                onClick={this.handleRemoveDiary}
                secondary
            />,
            <FlatButton
                key="close-btn"
                label="Close"
                onClick={this.handleClose}
                primary
            />,
        ]

        return (
            <Dialog
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

    renderDatePick = () => {
        return (
            <div className={styles.headerInput}>
                <DatePicker
                    className={styles.dateField}
                    hintText="Today's Diary"
                    autoOk
                    maxDate={this.today}
                    onChange={this.handleChangeDate}
                />
            </div>
        )
    }

    renderSearchFood = () => {
        const { error_nutrition } = this.state
        return (
            <TextField
                className={styles.searchField}
                id="food-search"
                hintText="What have you eat?"
                errorText={error_nutrition ? 'Food not found!' : ''}
                style={style.textCenter}
                onChange={this.handleChangeSearch}
            />
        )
    }

    renderFoodContent = () => {
        const { show_add_to_diary } = this.state

        if (show_add_to_diary) return null

        const { diary } = this.props

        const content = Object.keys(diary).map(k => (
            <ContentDiary
                key={k}
                title={k}
                content={diary[k]}
                handleOpen={this.handleOpen}
            />
        ))

        return (
            <div className={styles.content}>
                <Paper zDepth={2}>
                    <Subheader style={style.textLeft}>Food Diary</Subheader>
                    {this.renderSearchFood()}
                    {content}
                </Paper>
            </div>
        )
    }

    renderWorkoutContent = () => {
        const { show_add_to_diary } = this.state

        if (show_add_to_diary) return null

        const { diary } = this.props

        const content = Object.keys(diary).map(k => (
            <ContentDiary
                key={k}
                title={k}
                content={diary[k]}
                handleOpen={this.handleOpen}
            />
        ))

        return (
            <div className={cn(styles.content, styles.workoutContent)}>
                <Paper zDepth={2}>
                    <Subheader style={style.textLeft}>Workout Diary</Subheader>
                    {this.renderSearchFood()}
                    {content}
                </Paper>
            </div>
        )
    }

    renderAddDiary = () => {
        const { show_add_to_diary, food_nutrition } = this.state

        if (!show_add_to_diary) return null

        return (
            <AddToDiary
                key="addtodiary"
                {...{
                    food_nutrition,
                    removeFoodFromList: this.removeFoodFromList,
                    addFoodToDiary: this.addFoodToDiary,
                }}
            />
        )
    }

    render() {
        return (
            <div>
                {this.renderDatePick()}

                {this.renderFoodContent()}
                {this.renderWorkoutContent()}

                {this.renderAddDiary()}

                {this.renderNutritionDetailDialog()}
            </div>
        )
    }
}

Diary.propTypes = {
    diary: T.object.isRequired,

    fetchDiary: T.func.isRequired,
    addToDiary: T.func.isRequired,
    removeDiary: T.func.isRequired,
    showLoader: T.func.isRequired,
    hideLoader: T.func.isRequired,
    showSnackbar: T.func.isRequired,
}

import { connect } from 'react-redux'
import { showLoader, hideLoader, showSnackbar } from '@actions/common'
import { addToDiary, removeDiary } from '@actions/diary'

const mapStateToProps = ({ diary }) => ({
    diary: diary.today_diary,
})

const mapDispatchToProps = dispatch => ({
    fetchDiary: event => dispatch(fetchDiary(event)),
    addToDiary: event => dispatch(addToDiary(event)),
    removeDiary: event => dispatch(removeDiary(event)),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    showSnackbar: event => dispatch(showSnackbar(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Diary)
