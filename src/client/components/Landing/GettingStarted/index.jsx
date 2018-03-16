import React, { Component } from 'react'

import { Field } from 'redux-form'

import { RadioButton } from 'material-ui/RadioButton'
import { RadioButtonGroup } from 'redux-form-material-ui'

import styles from './gettingStarted.css'

/*
    Quiestions would be
        - Date of Birth
        - Goal
        - Gender
        - Activity
        - Current Weigth
        - Current Height
*/

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
}

const checkedIcon = <div className={styles.selectedRadio} />
const uncheckedIcon = <div />

export class GettingStarted extends Component {
    render() {
        return (
            <div className={styles.gettingStarted}>
                <form className={styles.form}>
                    <Field
                        component={RadioButtonGroup}
                        id="menu-goal"
                        name="goal"
                    >
                        <RadioButton
                            className={styles.radio}
                            value="weight-loss"
                            label="Weight Loss"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value="maintain-weight"
                            label="Maintain My Current Weight"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                        <RadioButton
                            className={styles.radio}
                            value="weight-gain"
                            label="Weight Gain"
                            checkedIcon={checkedIcon}
                            uncheckedIcon={uncheckedIcon}
                            iconStyle={style.iconStyle}
                            inputStyle={style.colorWhite}
                            labelStyle={style.labelStyle}
                        />
                    </Field>
                </form>
            </div>
        )
    }
}

import { reduxForm as rf } from 'redux-form'
const reduxForm = rf({
    form: 'getting-started',
})

export default reduxForm(GettingStarted)
