import React, { Component } from 'react'
import T from 'prop-types'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/arrow-back'

import Paper from 'material-ui/Paper'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import Divider from 'material-ui/Divider'

import { List, ListItem } from 'material-ui/List'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { GridList, GridTile } from 'material-ui/GridList'

import styles from './workout.css'

const style = {
    paper: {
        height: '100%',
        width: '90%%',
        margin: '20px auto',
        textAlign: 'center',
    },
    inputText: {
        textAlign: 'center',
    },
    dateTimeTile: {
        padding: 10,
    },
}

const generateUnique = () => Date.parse(new Date())

class Workout extends Component {
    constructor() {
        super()

        this.today = new Date()
    }

    state = {
        workout: [{ value: '', key: generateUnique() }],
        date: new Date(),
    }

    handleSubmit = () => {
        const { insertWorkout } = this.props

        const { workout, date } = this.state
        const date_time = Date.parse(date)
        const workouts = workout.map(w => w.value)

        insertWorkout({ workouts, date_time }, this.handleBackButton)
    }

    handleBackButton = () => this.context.router.history.push('/')

    handleChangeDate = (_, date) => this.setState({ date })

    handleChangeTime = (_, date) => {
        const { date: old_date } = this.state

        const hour = date.getHours()
        const minutes = date.getMinutes()

        const new_date = new Date(old_date)
        new_date.setHours(hour, minutes)

        this.setState({ date: new_date })
    }

    handleAddWorkoutClick = () =>
        this.setState({
            workout: [
                ...this.state.workout,
                { value: '', key: generateUnique() },
            ],
        })

    handleRemoveWorkoutClick = index =>
        this.setState({
            workout: [
                ...this.state.workout.slice(0, index),
                ...this.state.workout.slice(index + 1),
            ],
        })

    handleChangeWorkout = (index, e) => {
        const { workout } = this.state

        const { value } = e.target

        this.setState({
            workout: [
                ...workout.slice(0, index),
                { ...workout[index], value },
                ...workout.slice(index + 1),
            ],
        })
    }

    renderInputWorkoutList = () => {
        const { workout } = this.state

        return (
            <List>
                {workout.map(({ value, key }, i) => (
                    <ListItem
                        key={key}
                        value={value}
                        primaryText={
                            <TextField
                                hintText="Workout Name"
                                onChange={this.handleChangeWorkout.bind(
                                    null,
                                    i
                                )}
                            />
                        }
                        rightIcon={
                            workout.length > 1 && (
                                <DeleteIcon
                                    onClick={this.handleRemoveWorkoutClick.bind(
                                        null,
                                        i
                                    )}
                                />
                            )
                        }
                    />
                ))}
                <ListItem>
                    <RaisedButton
                        fullWidth
                        secondary
                        label="Add more workout"
                        onClick={this.handleAddWorkoutClick}
                    />
                </ListItem>
            </List>
        )
    }

    renderForm = () => {
        const { date } = this.state

        return (
            <div className={styles.workoutFormWrapper}>
                <Paper zDepth={3} style={style.paper}>
                    <GridList cellHeight={50} padding={10} cols={4}>
                        <GridTile />
                        <GridTile>
                            <DatePicker
                                hintText="date"
                                value={date}
                                maxDate={this.today}
                                onChange={this.handleChangeDate}
                                textFieldStyle={style.inputText}
                                autoOk
                            />
                        </GridTile>
                        <GridTile>
                            <TimePicker
                                hintText="time"
                                value={date}
                                textFieldStyle={style.inputText}
                                onChange={this.handleChangeTime}
                                autoOk
                            />
                        </GridTile>
                        <GridTile />
                    </GridList>
                    <Divider />
                    {this.renderInputWorkoutList()}
                </Paper>
            </div>
        )
    }

    render() {
        const { date, workout } = this.state
        const disable_button =
            !date || workout.reduce((p, c) => p || !c.value, false)

        return (
            <div>
                <AppBar
                    title="Add Workout"
                    iconElementLeft={
                        <IconButton onClick={this.handleBackButton}>
                            <NavigationClose />
                        </IconButton>
                    }
                />

                {this.renderForm()}

                <RaisedButton
                    className={styles.submitButton}
                    primary
                    fullWidth
                    label="Submit"
                    onClick={this.handleSubmit}
                    disabled={disable_button}
                />
            </div>
        )
    }
}

Workout.propTypes = {
    fetchWorkoutInfo: T.func.isRequired,
    insertWorkout: T.func.isRequired,
}

Workout.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import { fetchWorkoutInfo, insertWorkout } from '@actions/workout'

// const mapStateToProps = ({ workout }) => ({
//     ...workout,
// })

const mapDispatchToProps = dispatch => ({
    fetchWorkoutInfo: (event, cb) => dispatch(fetchWorkoutInfo(event, cb)),
    insertWorkout: (event, cb) => dispatch(insertWorkout(event, cb)),
})

export default connect(null, mapDispatchToProps)(Workout)
