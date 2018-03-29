import { getFoodDiary, addFoodToDiary, getDiaryReport } from '@urls'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import parseDate from '@helper/parseDate'

export const FAIL_FETCH_DIARY = 'FAIL_FETCH_DIARY'
export const FETCHED_DIARY = 'FETCHED_DIARY'
export const FETCHED_DIARY_REPORT = 'FETCHED_DIARY_REPORT'

export const ADD_NEW_DIARY = 'ADD_NEW_DIARY'
export const SUCCESS_ADD_DIARY = 'SUCCESS_ADD_DIARY'
export const FAILED_ADD_DIARY = 'FAILED_ADD_DIARY'

export const fetchDiary = (startDate, endDate) => async dispatch => {
    const today = new Date()

    const query = qs({
        startDate: startDate || parseDate(today),
        endDate: endDate || parseDate(today),
    })

    const [err, data] = await to(
        fetch(getFoodDiary + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return Promise.reject(dispatch({ type: FAIL_FETCH_DIARY }))

    const diary = await data.json()

    return Promise.resolve(
        dispatch({
            diary,
            type: FETCHED_DIARY,
        })
    )
}

export const addToDiary = ({
    food_name,
    total_weight,
    quantity,
    nutrition,
    meal_type,
}) => async dispatch => {
    const post_data = {
        food_name,
        quantity,
        total_weight,
        nutrients: JSON.stringify(nutrition),
        meal_type,
    }

    const [err, data] = await to(
        fetch(addFoodToDiary, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(post_data),
        })
    )
    if (err) {
        dispatch({ type: FAILED_ADD_DIARY })
        return Promise.reject(err)
    }

    dispatch({ type: SUCCESS_ADD_DIARY })
    return Promise.resolve(data)
}

export const fetchDiaryReport = today => async dispatch => {
    const [err, data] = await to(
        fetch(getDiaryReport, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return Promise.reject(dispatch({ type: FAIL_FETCH_DIARY }))

    const report = await data.json()

    return Promise.resolve(
        dispatch({
            report,
            type: FETCHED_DIARY_REPORT,
        })
    )
}
