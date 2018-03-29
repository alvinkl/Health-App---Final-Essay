import { getFoodDiary, addFoodToDiary } from '@urls'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

export const FETCH_DIARY = 'FETCH_DIARY'
export const FAIL_FETCH_DIARY = 'FAIL_FETCH_DIARY'
export const ADD_NEW_DIARY = 'ADD_NEW_DIARY'
export const SUCCESS_ADD_DIARY = 'SUCCESS_ADD_DIARY'
export const FAILED_ADD_DIARY = 'FAILED_ADD_DIARY'

const parseDate = (date = Date) => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    const dt = date.getDate()

    return year + '-' + month + '-' + dt
}

export const fetchTodayDiary = (startDate, endDate) => async dispatch => {
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
            type: FETCH_DIARY,
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
