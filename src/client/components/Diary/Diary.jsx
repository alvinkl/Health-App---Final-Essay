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
import WorkoutDetail from './WorkoutDetail'

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

        open_workout_detail: false,
        workout_detail_data: {},

        show_add_to_diary: false,

        loading: false,
        error_nutrition: false,

        DeleteConfirmationComp: null,
        open_delete_dialog: false,
        delete_event: null,
    }

    static initialAction = store => {
        // store.dispatch(fetchDiary())
    }

    componentDidMount() {
        const { fetchDiary, fetchWorkoutDiary } = this.props
        const { loading } = this.state

        if (!loading) {
            fetchDiary()
            fetchWorkoutDiary()
        }
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

    handleOpenWorkout = workout_detail_data =>
        this.setState({ open_workout_detail: true, workout_detail_data })

    handleClose = () => {
        this.setState({
            open_nutrition_detail: false,
            nutrition_detail_data: {},
            open_workout_detail: false,
            workout_detail_data: {},
        })
    }

    handleRemoveDiary = () => {
        this.handleOpenDeleteConfirmation(() => {
            const { removeDiary } = this.props
            const { nutrition_detail_data } = this.state
            const { meal_type, _id: diary_id } = nutrition_detail_data

            removeDiary({ meal_type, diary_id })
            this.handleClose()
        })
    }

    handleRemoveWorkout = () => {
        this.handleOpenDeleteConfirmation(() => {
            const { deleteWorkout } = this.props
            const { workout_detail_data } = this.state
            const { _id: workout_id } = workout_detail_data

            deleteWorkout(workout_id)
            this.handleClose()
        })
    }

    handleChangeDate = (_, date) => {
        const { fetchDiary, fetchWorkoutDiary } = this.props
        fetchDiary({ startDate: date })
        fetchWorkoutDiary({ startDate: date })
    }

    handleOpenDeleteConfirmation = delete_event => {
        const { DeleteConfirmationComp } = this.state

        let newState = {
            open_delete_dialog: true,
            delete_event,
        }

        if (!DeleteConfirmationComp)
            newState = {
                ...newState,
                DeleteConfirmationComp: require('@components/Dialogs/DeleteConfirmation')
                    .default,
            }

        this.setState(newState)
    }
    handleCloseDeleteConfirmation = () =>
        this.setState({ open_delete_dialog: false, delete_event: null })

    renderNutritionDetailDialog = () => {
        const { open_nutrition_detail, nutrition_detail_data } = this.state

        const actions = [
            <FlatButton
                key="remove-nutrition-btn"
                label="Remove"
                onClick={this.handleRemoveDiary}
                secondary
            />,
            <FlatButton
                key="close-nutrition-btn"
                label="Close"
                onClick={this.handleClose}
                primary
            />,
        ]

        return (
            <Dialog
                key="nutrition-dialog"
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

    renderWorkoutDetailDialog = () => {
        const { open_workout_detail, workout_detail_data } = this.state

        const actions = [
            <FlatButton
                key="remove-btn"
                label="Remove"
                onClick={this.handleRemoveWorkout}
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
                key="workout-dialog"
                modal={false}
                open={open_workout_detail}
                onRequestClose={this.handleClose}
                contentStyle={style.nutrition_detail_dialog}
                autoScrollBodyContent
                actions={actions}
            >
                <WorkoutDetail data={workout_detail_data} expand />
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
                keyLeft={['name']}
                keyRight={['nutrients', 'calories']}
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

        const {
            workout: { workout_diary },
        } = this.props

        const content = Object.keys(workout_diary).map(k => (
            <ContentDiary
                key={k}
                title={k}
                content={workout_diary[k]}
                keyLeft={['name']}
                keyRight={['calories_burned']}
                handleOpen={this.handleOpenWorkout}
            />
        ))

        return (
            <div className={cn(styles.content, styles.workoutContent)}>
                <Paper zDepth={2}>
                    <Subheader style={style.textLeft}>Workout Diary</Subheader>
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

    renderDeleteConfirmation = () => {
        const {
            DeleteConfirmationComp,
            open_delete_dialog,
            delete_event,
        } = this.state

        return (
            !!DeleteConfirmationComp && (
                <DeleteConfirmationComp
                    key="delete-confirmation-diary"
                    {...{
                        open: open_delete_dialog,
                        deleteEvent: delete_event,
                        handleClose: this.handleCloseDeleteConfirmation,
                    }}
                />
            )
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
                {this.renderWorkoutDetailDialog()}

                {this.renderDeleteConfirmation()}
            </div>
        )
    }
}

Diary.propTypes = {
    diary: T.object.isRequired,
    workout: T.object.isRequired,

    fetchDiary: T.func.isRequired,
    fetchWorkoutDiary: T.func.isRequired,
    addToDiary: T.func.isRequired,
    removeDiary: T.func.isRequired,
    showLoader: T.func.isRequired,
    hideLoader: T.func.isRequired,
    showSnackbar: T.func.isRequired,
    deleteWorkout: T.func.isRequired,
}

import { connect } from 'react-redux'
import { showLoader, hideLoader, showSnackbar } from '@actions/common'
import { addToDiary, removeDiary } from '@actions/diary'
import { fetchWorkoutDiary, deleteWorkout } from '@actions/workout'

const mapStateToProps = ({ diary, workout }) => ({
    diary: diary.today_diary,
    workout,
})

const mapDispatchToProps = dispatch => ({
    fetchDiary: event => dispatch(fetchDiary(event)),
    addToDiary: event => dispatch(addToDiary(event)),
    removeDiary: event => dispatch(removeDiary(event)),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    showSnackbar: event => dispatch(showSnackbar(event)),
    fetchWorkoutDiary: (event, cb) => dispatch(fetchWorkoutDiary(event, cb)),
    deleteWorkout: (event, cb) => dispatch(deleteWorkout(event, cb)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Diary)
