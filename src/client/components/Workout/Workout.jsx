import React, { Component, Fragment } from 'react'

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

import styles from './workout.css'

const style = {
    paper: {
        height: '100%',
        width: '90%%',
        margin: '0 auto',
        textAlign: 'center',
    },
}

const generateUnique = () => Date.parse(new Date())

class Workout extends Component {
    state = {
        workout: [{ value: '', key: generateUnique() }],
    }

    handleBackButton = () => this.context.router.history.push('/')

    handleAddWorkoutClick = () =>
        this.setState({
            workout: [
                ...this.state.workout,
                { value: '', key: generateUnique() },
            ],
        })

    handleRemoveWorkoutClick = index => {
        console.log(index)
        this.setState({
            workout: [
                ...this.state.workout.slice(0, index),
                ...this.state.workout.slice(index + 1),
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
                        primaryText={<TextField hintText="Workout Name" />}
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
        return (
            <div className={styles.workouFormtWrapper}>
                <DatePicker hintText="date" />
                <TimePicker hintText="time" />
                <Divider />
                {this.renderInputWorkoutList()}
            </div>
        )
    }

    render() {
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
                <Paper zDepth={3} style={style.paper}>
                    {this.renderForm()}
                </Paper>
            </div>
        )
    }
}

export default Workout
