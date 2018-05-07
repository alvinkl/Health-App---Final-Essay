import React, { Component, Fragment } from 'react'
import T from 'prop-types'
import moment from 'moment'

import qs from '@helper/queryString'
import to from '@helper/asyncAwait'
import { getRecommendedCalories } from '@urls'

import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import InputWeight from './InputWeight'
import InputHeight from './InputHeight'
import InputCalories from './InputCalories'

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
        input_calories: {
            rec_low: 0,
            rec_high: 2000,
            calories_recommended: 2000,
        },

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
        target_calories: 0,
        current_height: {
            value: 0,
            tp: HEIGHT_TYPE.CM,
        },
        activity: 0,
        birth_date: null,

        success: false,
    }

    componentWillReceiveProps = nextProps => {
        const { success } = nextProps
        this.setState({ success })
    }

    fetchRecommendedCalories = async () => {
        const {
            goal,
            gender,
            current_weight,
            target_weight,
            current_height,
            target_calories,
            activity,
            birth_date,
            step_index,
        } = this.state

        const post_data = JSON.stringify({
            goal,
            gender,
            current_weight,
            target_weight,
            target_calories,
            current_height,
            activity,
            birth_date: birth_date.toISOString(),
        })

        const [err, res] = await to(
            fetch(getRecommendedCalories, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'same-origin',
                body: post_data,
            })
        )

        const data = await res.json()

        const { rec_low, rec_high, calories_recommended } = data

        this.setState({
            input_calories: {
                rec_low,
                rec_high,
                calories_recommended,
            },

            step_index: step_index + 1,
        })
    }

    // TODO: if redis already implemented, use redis instead of calling twice
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

        const dietplan = {
            goal,
            gender,
            current_weight,
            target_weight,
            target_calories,
            current_height,
            activity,
            birth_date: birth_date.toISOString(),
        }

        submitDietPlan(dietplan)
    }

    handlePrevClick = () =>
        this.setState({
            step_index: this.state.step_index - 1,
            finished: false,
        })

    handleNext = () => {
        const { step_index: current_index } = this.state
        const { success } = this.props

        if (current_index === 6) return this.fetchRecommendedCalories()

        if (current_index === 7) this.handleFinishGoal()

        this.setState(
            {
                step_index: current_index + 1,
                finished: current_index === 8,
            },
            () => {
                const { finished, success } = this.state
                if (finished && success) this.handleContinue()
            }
        )
    }

    handleContinue = () => this.context.router.history.push('/home')

    handleChangeGoal = e =>
        this.setState(
            {
                goal: parseInt(e.target.value),
            },
            this.handleNext
        )

    handleChangeGender = e =>
        this.setState(
            {
                gender: parseInt(e.target.value),
            },
            this.handleNext
        )

    handleChangeWeight = ({ value, tp }) =>
        this.setState({
            current_weight: { value, tp },
        })

    handleChangeTargetWeight = ({ value, tp }) => {
        this.setState({
            target_weight: {
                value,
                tp,
            },
        })
    }

    handleChangeHeight = ({ value, tp }) =>
        this.setState({
            current_height: {
                value,
                tp,
            },
        })

    handleChangeActivity = e =>
        this.setState(
            {
                activity: parseInt(e.target.value),
            },
            this.handleNext
        )

    handleChangeDateBirth = (e, value) =>
        this.setState({
            birth_date: value,
        })

    handleChangeCalories = target_calories => this.setState({ target_calories })

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
                        label="Current Weight"
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
                        label="Target Weight"
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
                        className={styles.datepicker}
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
                    <InputCalories
                        key="input-calories"
                        {...this.state.input_calories}
                        onChange={this.handleChangeCalories}
                    />
                )
            case 8:
                return (
                    <Fragment>
                        <img src="/static/images/icons/icon-96x96.png" alt="" />
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
                        onClick={this.handlePrevClick}
                    />
                )}

                {!finished && (
                    <FlatButton
                        className={styles.nextButton}
                        label="Next"
                        onClick={this.handleNext}
                    />
                )}
            </div>
        )
    }
}

GettingStarted.propTypes = {
    success: T.bool,
    submitDietPlan: T.func.isRequired,
    updateNewUserStatus: T.func.isRequired,
}

GettingStarted.defaultPropTypes = {
    success: false,
}

GettingStarted.contextTypes = {
    router: T.object.isRequired,
}

import { connect } from 'react-redux'
import { updateNewUserStatus, submitDietPlan } from '@actions/user'

const mapStateToProps = ({ user: { diet_plan } }) => ({
    success: diet_plan.success,
})

const mapDispatchToProps = dispatch => ({
    submitDietPlan: event => dispatch(submitDietPlan(event)),
    updateNewUserStatus: () => dispatch(updateNewUserStatus()),
})

export default connect(mapStateToProps, mapDispatchToProps)(GettingStarted)
