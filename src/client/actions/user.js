import {
    getUser,
    insertUpdateGoal,
    authLogout,
    updateTargetCalories,
    updateWeight,
} from '@urls'
import to from '@helper/asyncAwait'
import { showLoader, hideLoader, showSnackbar } from '@actions/common'

export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const ERROR_FETCH_USER_DATA = 'ERROR_FETCH_USER_DATA'
export const UPDATE_NEW_USER_STATUS = 'UPDATE_NEW_USER_STATUS'

export const SUBMIT_DIET_PLAN = 'SUBMIT_DIET_PLAN'
export const FAIL_SUBMIT_DIET_PLAN = 'FAIL_SUBMIT_DIET_PLAN'

export const UPDATE_TARGET_CALORIES = 'UPDATE_TARGET_CALORIES'
export const FAILED_UPDATE_TARGET_CALORIES = 'FAILED_UPDATE_TARGET_CALORIES'
export const TARGET_CALORIES_UPDATED = 'TARGET_CALORIES_UPDATED'

export const UPDATE_WEIGHT = 'UPDATE_TARGET_WEIGHT'
export const FAILED_UPDATE_WEIGHT = 'FAILED_UPDATE_TARGET_WEIGHT'
export const TARGET_WEIGHT_UPDATED = 'TARGET_WEIGHT_UPDATED'
export const CURRENT_WEIGHT_UPDATED = 'CURRENT_WEIGHT_UPDATED'

export const LOGOUT = 'LOGOUT'

export const fetchUserData = () => async dispatch => {
    const [err, res] = await to(
        fetch(getUser, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) {
        return dispatch({ type: ERROR_FETCH_USER_DATA })
    }

    const data = await res.json()

    dispatch({ type: FETCH_USER_DATA, user: data })
}

export const updateNewUserStatus = () => ({
    type: UPDATE_NEW_USER_STATUS,
})

export const submitDietPlan = dietplan => async dispatch => {
    dispatch(showLoader())
    const [err, res] = await to(
        fetch(insertUpdateGoal, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(dietplan),
        })
    )

    if (err) {
        return dispatch({ type: FAIL_SUBMIT_DIET_PLAN })
    }

    const dp = await res.json()

    dispatch(hideLoader())
    return dispatch({
        type: SUBMIT_DIET_PLAN,
        diet_plan: dp,
    })
}

export const updateReduxDietplan = diet_plan => ({
    type: SUBMIT_DIET_PLAN,
    diet_plan,
})

export const logoutUser = () => async dispatch => {
    dispatch({ type: LOGOUT })
    await fetch(authLogout, {
        method: 'GET',
        credentials: 'same-origin',
    })
}

export const updateUserWeight = ({ value, type }) => async (
    dispatch,
    getState
) => {
    const {
        diet_plan: { current_weight, target_weight },
    } = getState().user

    let param = { current_weight, target_weight }
    const current = ~type.indexOf('current')

    if (current)
        param = {
            ...param,
            current_weight: {
                ...current_weight,
                value,
            },
        }
    else
        param = {
            ...param,
            target_weight: {
                ...target_weight,
                value,
            },
        }

    const [err, res] = await to(
        fetch(updateWeight, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(param),
        })
    )

    if (err) {
        dispatch(showSnackbar('Failed to update weight, ', err))
        return dispatch({
            type: FAILED_UPDATE_WEIGHT,
        })
    }

    dispatch(showSnackbar('Weight updated!'))
    return dispatch({
        type: current ? CURRENT_WEIGHT_UPDATED : TARGET_WEIGHT_UPDATED,
        value,
    })
}

export const updateUserTargetCalories = target_calories => async dispatch => {
    dispatch({ type: UPDATE_TARGET_CALORIES })

    const [err, res] = await to(
        fetch(updateTargetCalories, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ target_calories }),
        })
    )
    if (err) {
        dispatch(showSnackbar('Failed to update, ', err))
        return dispatch({
            type: FAILED_UPDATE_TARGET_CALORIES,
        })
    }

    dispatch(showSnackbar('Target Calories updated!'))
    return dispatch({ type: TARGET_CALORIES_UPDATED, target_calories })
}
