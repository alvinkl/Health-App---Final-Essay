import {
    getFoodDiary,
    addFoodToDiary,
    getDiaryReport,
    removeFoodFromDiary,
    getTodayCalories,
} from '@urls'
import { MEAL_TYPE } from '@constant'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import parseDate from '@helper/parseDate'
import { readData, readAllData, writeData } from '@helper/indexedDB-utilities'

import { showSnackbar } from './common'

export const FAIL_FETCH_DIARY = 'FAIL_FETCH_DIARY'
export const FETCHED_DIARY = 'FETCHED_DIARY'
export const FETCHED_DIARY_IDB = 'FETCHED_DIARY_IDB'
export const FETCHED_DIARY_REPORT = 'FETCHED_DIARY_REPORT'

export const FETCHING_DAILY_CALORIES = 'FETCHING_DAILY_CALORIES'
export const DAILY_CALORIES_FETCHED = 'DAILY_CALORIES_FETCHED'
export const FAIL_FETCH_DAILY_CALORIES = 'FAIL_FETCH_DAILY_CALORIES'

export const ADD_NEW_DIARY = 'ADD_NEW_DIARY'
export const SUCCESS_ADD_DIARY = 'SUCCESS_ADD_DIARY'
export const FAILED_ADD_DIARY = 'FAILED_ADD_DIARY'

export const REMOVING_DIARY = 'REMOVING_DIARY'
export const FAILED_REMOVING_DIARY = 'FAILED_REMOVING_DIARY'
export const DIARY_REMOVED = 'DIARY_REMOVED'

export const fetchDiary = (
    { startDate, endDate } = { startDate: null, endDate: null }
) => async dispatch => {
    const today = new Date()

    const sd = parseDate(startDate || today)

    const query = qs({
        startDate: sd,
        endDate: sd,
    })

    // Fetch from IDB
    const idb_diary = (await readData('diary', query)) || {}
    dispatch({ type: FETCHED_DIARY_IDB, diary: idb_diary.data })

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

    writeData('diary', {
        id: query,
        data: diary,
    })

    return Promise.resolve(
        dispatch({
            diary,
            type: FETCHED_DIARY,
        })
    )
}

export const fetchDailyCalories = () => async dispatch => {
    dispatch({ type: FETCHING_DAILY_CALORIES })

    const [err, res] = await to(
        fetch(getTodayCalories, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAIL_FETCH_DAILY_CALORIES })

    const data = await res.json()
    const { total_calories } = data

    return dispatch({
        type: DAILY_CALORIES_FETCHED,
        total_calories,
    })
}

export const addToDiary = ({
    name,
    unit,
    total_weight,
    quantity,
    nutrition,
    meal_type,
}) => async dispatch => {
    const post_data = {
        name,
        unit,
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

    dispatch(fetchDailyCalories())

    dispatch({ type: SUCCESS_ADD_DIARY })
    return Promise.resolve(data)
}

export const removeDiary = ({ diary_id, meal_type }) => async dispatch => {
    dispatch({ type: REMOVING_DIARY })

    const post_data = { diary_id }
    const [err] = await to(
        fetch(removeFoodFromDiary, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(post_data),
        })
    )
    if (err) {
        dispatch(showSnackbar(err))
        return dispatch({ type: FAILED_REMOVING_DIARY })
    }

    dispatch(showSnackbar('Diary removed!'))

    // transform MEAL_TYPE value into its string value
    const entr = Object.entries(MEAL_TYPE)
    let [type] = entr.filter(t => t[1] === meal_type)[0] || ['']
    type = type.toLowerCase()

    return dispatch({ type: DIARY_REMOVED, diary_id, meal_type: type })
}

export const fetchDiaryReport = timestamp => async dispatch => {
    const query = qs({ timestamp: timestamp || Date.parse(new Date()) })

    const [err, data] = await to(
        fetch(getDiaryReport + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return Promise.reject(dispatch({ type: FAIL_FETCH_DIARY }))

    const report = await data.json()

    const today_total_calories = Object.keys(report[0]).reduce(
        (p, c) => p + report[0][c],
        0
    )

    return Promise.resolve(
        dispatch({
            report,
            today_total_calories,
            type: FETCHED_DIARY_REPORT,
        })
    )
}
