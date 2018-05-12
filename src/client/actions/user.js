import { getUser, insertUpdateGoal, authLogout } from '@urls'
import to from '@helper/asyncAwait'
import { showLoader, hideLoader } from '@actions/common'

export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const ERROR_FETCH_USER_DATA = 'ERROR_FETCH_USER_DATA'
export const UPDATE_NEW_USER_STATUS = 'UPDATE_NEW_USER_STATUS'

export const SUBMIT_DIET_PLAN = 'SUBMIT_DIET_PLAN'
export const FAIL_SUBMIT_DIET_PLAN = 'FAIL_SUBMIT_DIET_PLAN'

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

export const updateUserWeight = () => async dispatch => {
    console.log('Update Weight')
}

export const updateUserTargetCalories = () => async dispatch => {
    console.log('Update User Target Calories')
}
