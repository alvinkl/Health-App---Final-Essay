import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import moment from 'moment'

import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import InputWeight from './InputWeight'
import InputHeight from './InputHeight'

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
const StepL = (
    <Step>
        <StepLabel />
    </Step>
)

const formatDate = date => moment(date).format('DD MMMM YYYY')

const average_low_weight = 45
const average_high_weight = 150
const decimals = Array.apply(null, { length: 10 }).map((_, i) => '.' + i)
const weight_type = ['KG']

export class GettingStarted extends Component {
    state = {
        step_index: 0,
        finished: false,

        // form
        goal: 0,
        gender: 0,
        current_weight: {
            value: 0,
            tp: WEIGHT_TYPE.KG,
        },
        target_weight: {
            value: 0,
            tp: WEIGHT_TYPE.KG,
        },
        target_calories: 2000,
        current_height: {
            value: 0,
            tp: HEIGHT_TYPE.CM,
        },
        activity: 0,
        birth_date: null,
    }

    static contextTypes = {
        router: T.object.isRequired,
    }

    static propTypes = {
        success: T.bool,
        submitDietPlan: T.func.isRequired,
        updateNewUserStatus: T.func.isRequired,
    }

    static defaultPropTypes = {
        success: false,
    }

    handleFinishGoal = () => {
        const { submitDietPlan } = this.props
        const {
            goal,
            gender,
            current_weight,
            target_weight,
            current_height,
            target_calories,
            activity,
            birth_date,
        } = this.state

        submitDietPlan({
            goal,
            gender,
            current_weight,
            target_weight,
            target_calories,
            current_height,
            activity,
            birth_date: birth_date.toISOString(),
        })
    }

    handlePrevClick = (current_index = 0) =>
        this.setState({ step_index: current_index - 1, finished: false })

    handleNextClick = (current_index = 0) => {
        if (current_index === 6) this.handleFinishGoal()

        this.setState({
            step_index: current_index + 1,
            finished: current_index === 6,
        })
    }

    handleContinue = () => this.context.router.history.push('/home')

    handleChangeGoal = e =>
        this.setState({
            goal: parseInt(e.target.value),
            step_index: this.state.step_index + 1,
        })

    handleChangeGender = e =>
        this.setState({
            gender: parseInt(e.target.value),
            step_index: this.state.step_index + 1,
        })

    handleChangeWeight = ({ value, tp }) =>
        this.setState({
            current_weight: { value, tp },
        })

    handleChangeTargetWeight = ({ value, tp }) =>
        this.setState({
            target_weight: {
                value,
                tp,
            },
        })

    handleChangeHeight = ({ value, tp }) =>
        this.setState({
            current_height: {
                value,
                tp,
            },
        })

    handleChangeActivity = e =>
        this.setState({
            activity: parseInt(e.target.value),
            step_index: this.state.step_index + 1,
        })

    handleChangeDateBirth = (e, value) =>
        this.setState({
            birth_date: value,
        })

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
                    <InputWeight
                        key="current-weight"
                        onChange={this.handleChangeWeight}
                        {...{
                            average_high_weight,
                            average_low_weight,
                            decimals,
                            weight_type,
                            goal: this.state.goal,
                        }}
                    />
                )
            case 3: {
                let high_weight
                let low_weight

                const { goal, current_weight } = this.state
                if (goal === GOAL.WEIGHT_LOSS) {
                    high_weight = parseInt(current_weight.value - 1)
                    low_weight = average_low_weight
                } else if (goal === GOAL.WEIGHT_GAIN) {
                    low_weight = parseInt(current_weight.value + 1)
                    high_weight = average_high_weight
                } else if (goal === GOAL.MAINTAIN_WEIGHT) {
                    high_weight = parseInt(current_weight.value + 1)
                    low_weight = parseInt(current_weight.value - 1)
                }

                return (
                    <InputWeight
                        key="target-weight"
                        onChange={this.handleChangeTargetWeight}
                        {...{
                            average_high_weight: high_weight,
                            average_low_weight: low_weight,
                            decimals,
                            weight_type,
                            goal: this.state.goal,
                        }}
                    />
                )
            }
            case 4:
                return (
                    <InputHeight
                        key="height"
                        onChange={this.handleChangeTargetWeight}
                    />
                )
            case 5:
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
            case 6:
                return (
                    <DatePicker
                        hintText="Date of Birth"
                        openToYearSelection
                        autoOk
                        formatDate={formatDate}
                        maxDate={maxDate}
                        value={this.state.birth_date}
                        textFieldStyle={style.dateBirthFieldStyle}
                        onChange={this.handleChangeDateBirth}
                    />
                )
            case 7:
                return (
                    <Fragment>
                        <img src="/static/images/icons/icon-96x96.png" alt="" />
                        <h2>All Set Up</h2>
                        <RaisedButton
                            label={'Continue'}
                            onClick={this.handleContinue}
                        />
                    </Fragment>
                )
            default:
                return
        }
    }

    render() {
        const { step_index, finished } = this.state
        return (
            <div className={styles.gettingStarted}>
                {!finished && (
                    <Stepper activeStep={step_index}>
                        {StepL}
                        {StepL}
                        {StepL}
                        {StepL}
                        {StepL}
                        {StepL}
                        {StepL}
                        {StepL}
                    </Stepper>
                )}
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

                {!finished && (
                    <FlatButton
                        className={styles.nextButton}
                        label="Next"
                        onClick={this.handleNextClick.bind(null, step_index)}
                    />
                )}
            </div>
        )
    }
}

import { connect } from 'react-redux'
import { updateNewUserStatus, submitDietPlan } from '@actions/user'

// const mapStateToProps = ({ user: { diet_plan } }) => ({
//     success: diet_plan.success,
// })

const mapDispatchToProps = dispatch => ({
    submitDietPlan: event => dispatch(submitDietPlan(event)),
    updateNewUserStatus: () => dispatch(updateNewUserStatus()),
})

export default connect(null, mapDispatchToProps)(GettingStarted)
