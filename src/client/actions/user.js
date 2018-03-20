import { getUser, insertUpdateGoal } from '@urls'
import to from '@helper/asyncAwait'

export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const ERROR_FETCH_USER_DATA = 'ERROR_FETCH_USER_DATA'
export const UPDATE_NEW_USER_STATUS = 'UPDATE_NEW_USER_STATUS'

export const SUBMIT_DIET_PLAN = 'SUBMIT_DIET_PLAN'
export const FAIL_SUBMIT_DIET_PLAN = 'FAIL_SUBMIT_DIET_PLAN'

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
    const [err, dp] = await to(
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

    return dispatch({
        type: SUBMIT_DIET_PLAN,
        dietplan: dp,
    })
}
