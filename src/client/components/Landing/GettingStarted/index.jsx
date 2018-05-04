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
        showLoader: T.func.isRequired,
        hideLoader: T.func.isRequired,
        updateNewUserStatus: T.func.isRequired,
    }

    static defaultPropTypes = {
        success: false,
    }

    componentWillReceiveProps(nextProps) {
        const { success, hideLoader, updateNewUserStatus } = nextProps
        const { success: prevSuccess } = this.props
        if (prevSuccess !== success && success) {
            updateNewUserStatus()
            hideLoader()
            this.setState({ step_index: 7, finished: true })
        }
    }

    handleFinishGoal = () => {
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
        const { submitDietPlan, showLoader } = this.props

        showLoader()
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
        if (current_index === 6) {
            this.handleFinishGoal()
        } else {
            this.setState({
                step_index: current_index + 1,
            })
        }
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

    handleChangeWeight = e =>
        this.setState({
            current_weight: {
                value: parseFloat(e.target.value) || 0,
                tp: WEIGHT_TYPE.KG,
            },
            step_index: this.state.step_index + 1,
        })

    handleChangeTargetWeight = e =>
        this.setState({
            target_weight: {
                value: parseFloat(e.target.value) || 0,
                tp: WEIGHT_TYPE.KG,
            },
            step_index: this.state.step_index + 1,
        })

    handleChangeHeight = e =>
        this.setState({
            current_height: {
                value: parseInt(e.target.value) || 0,
                tp: HEIGHT_TYPE.CM,
            },
            step_index: this.state.step_index + 1,
        })

    handleChangeActivity = e =>
        this.setState({
            activity: parseInt(e.target.value),
            step_index: this.state.step_index + 1,
        })

    handleChangeDateBirth = (e, value) =>
        this.setState({
            birth_date: value,
            step_index: this.state.step_index + 1,
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
                    <TextField
                        name="weight"
                        className={styles.inputWeight}
                        type="number"
                        value={this.state.current_weight.value}
                        inputStyle={{ textAlign: 'center', color: 'white' }}
                        onChange={this.handleChangeWeight}
                    />
                )
            case 3:
                return (
                    <TextField
                        name="target-weight"
                        className={styles.inputWeight}
                        type="number"
                        value={this.state.target_weight.value}
                        inputStyle={{ textAlign: 'center', color: 'white' }}
                        onChange={this.handleChangeTargetWeight}
                    />
                )
            case 4:
                return (
                    <TextField
                        name="height"
                        className={styles.inputHeight}
                        type="number"
                        value={this.state.current_height.value}
                        inputStyle={{ textAlign: 'center', color: 'white' }}
                        onChange={this.handleChangeHeight}
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
                    {/* {this.renderFormContent(step_index)} */}
                    <InputWeight />
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
import { showLoader, hideLoader } from '@actions/common'
import { updateNewUserStatus, submitDietPlan } from '@actions/user'

const mapStateToProps = ({ user: { diet_plan } }) => ({
    success: diet_plan.success,
})

const mapDispatchToProps = dispatch => ({
    submitDietPlan: event => dispatch(submitDietPlan(event)),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    updateNewUserStatus: () => dispatch(updateNewUserStatus()),
})

export default connect(mapStateToProps, mapDispatchToProps)(GettingStarted)
