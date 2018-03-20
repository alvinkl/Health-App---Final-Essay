import React, { Component } from 'react'
import T from 'prop-types'
import moment from 'moment'

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import TextField from 'material-ui/TextField'
import InputMask from 'react-input-mask'

import DatePicker from 'material-ui/DatePicker'

import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import FlatButton from 'material-ui/FlatButton'

import styles from './gettingStarted.css'

import { GOAL, GENDER, WEIGHT_TYPE, HEIGHT_TYPE, ACTIVITY } from '@constant'

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

const maxDate = (() => {
    const now = new Date()
    now.setFullYear(now.getFullYear() - 1)
    now.setHours(0, 0, 0, 0)

    return now
})()

const checkedIcon = <div className={styles.selectedRadio} />
const uncheckedIcon = <div />

const formatDate = date => moment(date).format('DD MMMM YYYY')

export class GettingStarted extends Component {
    state = {
        step_index: 0,
        finished: false,

        // form
        goal: 0,
        gender: 0,
        weight: {
            value: 0,
            tp: WEIGHT_TYPE.KG,
        },
        height: {
            value: 0,
            tp: HEIGHT_TYPE.CM,
        },
        activity: 0,
        dateBirth: null,
    }

    static propTypes = {
        submitGoal: T.func.isRequired,
    }

    handleFinishGoal = () => {
        const { goal, gender, weight, height, activity, dateBirth } = this.state
        const { submitGoal } = this.props

        submitGoal({ goal, gender, weight, height, activity, dateBirth })
    }

    handlePrevClick = (current_index = 0) =>
        this.setState({ step_index: current_index - 1, finished: false })

    handleNextClick = (current_index = 0) => {
        if (current_index === 5) {
            this.handleFinishGoal()
        } else {
            this.setState({
                step_index: current_index + 1,
                finished: current_index + 1 === 5,
            })
        }
    }

    handleChangeGoal = e => this.setState({ goal: parseInt(e.target.value) })

    handleChangeGender = e =>
        this.setState({ gender: parseInt(e.target.value) })

    handleChangeWeight = e =>
        this.setState({
            weight: {
                value: parseFloat(e.target.value) || 0,
                tp: WEIGHT_TYPE.KG,
            },
        })

    handleChangeHeight = e =>
        this.setState({
            height: {
                value: parseInt(e.target.value) || 0,
                tp: HEIGHT_TYPE.CM,
            },
        })

    handleChangeActivity = e =>
        this.setState({ activity: parseInt(e.target.value) })

    handleChangeDateBirth = (e, value) =>
        this.setState({ dateBirth: value.toISOString() })

    renderFormContent = index => {
        /* Quiestions would be
            - Goal
            - Gender
            - Date of Birth
            - Activity
            - Current Weigth
            - Current Height
        */

        switch (index) {
            case 0:
                return (
                    <RadioButtonGroup
                        name="goal"
                        onChange={this.handleChangeGoal}
                        valueSelected={this.state.goal}
                    >
                        <RadioButton
                            className={styles.radio}
                            value={GOAL.WEIGHT_LOSS}
                            label="Weight Loss"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value={GOAL.MAINTAIN_WEIGHT}
                            label="Maintain My Current Weight"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value={GOAL.WEIGHT_GAIN}
                            label="Weight Gain"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                    </RadioButtonGroup>
                )
            case 1:
                return (
                    <RadioButtonGroup
                        name="gender"
                        onChange={this.handleChangeGender}
                        valueSelected={this.state.gender}
                    >
                        <RadioButton
                            className={styles.radio}
                            value={GENDER.MALE}
                            label="Male"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value={GENDER.FEMALE}
                            label="Female"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                    </RadioButtonGroup>
                )
            case 2:
                return (
                    <TextField
                        name="weight"
                        className={styles.inputWeight}
                        type="text"
                        value={this.state.weight}
                        inputStyle={{ textAlign: 'center', color: 'white' }}
                        onChange={this.handleChangeWeight}
                    >
                        <InputMask
                            mask="999.99 \kg"
                            maskChar=" "
                            alwaysShowMask
                        />
                    </TextField>
                )
            case 3:
                return (
                    <TextField
                        name="height"
                        className={styles.inputHeight}
                        type="text"
                        value={this.state.height}
                        inputStyle={{ textAlign: 'center', color: 'white' }}
                        onChange={this.handleChangeHeight}
                    >
                        <InputMask mask="999 \cm" maskChar=" " alwaysShowMask />
                    </TextField>
                )
            case 4:
                return (
                    <RadioButtonGroup
                        name="activity"
                        onChange={this.handleChangeActivity}
                        valueSelected={this.state.activity}
                    >
                        <RadioButton
                            className={styles.radio}
                            value={ACTIVITY.LOW_ACTIVE}
                            label="Low Active"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value={ACTIVITY.ACTIVE}
                            label="Active"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value={ACTIVITY.VERY_ACTIVE}
                            label="Very Active"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                    </RadioButtonGroup>
                )
            case 5:
                return (
                    <DatePicker
                        hintText="Date of Birth"
                        openToYearSelection
                        autoOk
                        formatDate={formatDate}
                        maxDate={maxDate}
                        textFieldStyle={style.dateBirthFieldStyle}
                        onChange={this.handleChangeDateBirth}
                    />
                )

            default:
                return
        }
    }

    render() {
        const { step_index } = this.state
        return (
            <div className={styles.gettingStarted}>
                <Stepper activeStep={step_index}>
                    <Step>
                        <StepLabel />
                    </Step>
                    <Step>
                        <StepLabel />
                    </Step>
                    <Step>
                        <StepLabel />
                    </Step>
                    <Step>
                        <StepLabel />
                    </Step>
                    <Step>
                        <StepLabel />
                    </Step>
                    <Step>
                        <StepLabel />
                    </Step>
                </Stepper>
                <form className={styles.form}>
                    {this.renderFormContent(step_index)}
                </form>

                {step_index > 0 && (
                    <FlatButton
                        className={styles.prevButton}
                        label="Back"
                        onClick={this.handlePrevClick.bind(null, step_index)}
                    />
                )}

                <FlatButton
                    className={styles.nextButton}
                    label="Next"
                    onClick={this.handleNextClick.bind(null, step_index)}
                />
            </div>
        )
    }
}

import { connect } from 'react-redux'
import { submitGoal } from '@actions/goal'

const mapDispatchToProps = dispatch => ({
    submitGoal: event => dispatch(submitGoal(event)),
})

export default connect(null, mapDispatchToProps)(GettingStarted)
