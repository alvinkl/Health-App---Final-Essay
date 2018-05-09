import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import parseDate from '@helper/parseDate'

import {
    insertWorkout as insertWorkoutURL,
    getWorkoutInfo,
    getWorkoutDiary,
} from '@urls'
import { showSnackbar } from '@actions/common'

export const FETCH_WORKOUT_INFO = 'FETCH_WORKOUT_INFO'
export const FAIL_FETCH_WORKOUT_INFO = 'FAIL_FETCH_WORKOUT_INFO'
export const WORKOUT_INFO_FETCHED = 'WORKOUT_INFO_FETCHED'

export const INSERT_WORKOUT = 'INSERT_WORKOUT'
export const FAIL_INSERT_WORKOUT = 'FAIL_INSERT_WORKOUT'
export const WORKOUT_INSERTED = 'WORKOUT_INSERTED'

export const FETCH_WORKOUT_DIARY = 'FETCH_WORKOUT_DIARY'
export const FAIL_FETCH_WORKOUT_DIARY = 'FAIL_FETCH_WORKOUT_DIARY'
export const WORKOUT_DIARY_FETCHED = 'WORKOUT_DIARY_FETCHED'

export const fetchWorkoutInfo = (
    workouts = [],
    cb = () => {}
) => async dispatch => {
    dispatch({ type: FETCH_WORKOUT_INFO })

    const query = qs({
        workouts: workouts.join(','),
    })
    const [err, res] = await to(
        fetch(getWorkoutInfo + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) {
        dispatch(showSnackbar('Fail to fetch workout!'))
        return dispatch({
            type: FAIL_FETCH_WORKOUT_INFO,
        })
    }

    const { exercises } = await res.json()
    await dispatch({
        type: WORKOUT_INFO_FETCHED,
        workout_info: exercises,
    })

    cb(exercises)
}

export const insertWorkout = (
    { workouts, date_time },
    cb = () => {}
) => async dispatch => {
    dispatch({ type: INSERT_WORKOUT })
    const w_name = workouts.join(',')

    const param = JSON.stringify({
        workouts: w_name,
        date_time,
    })

    const [err, res] = await to(
        fetch(insertWorkoutURL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: param,
        })
    )
    if (err) {
        dispatch(showSnackbar('Failed to insert workout!'))
        return dispatch({ type: FAIL_INSERT_WORKOUT })
    }

    const data = await res.json()

    dispatch(showSnackbar('Workout ' + w_name + ' saved!'))
    await dispatch({
        type: WORKOUT_INSERTED,
        workout: data,
    })

    cb()
}

export const fetchWorkoutDiary = (
    { startDate, endDate } = { startDate: null, endDate: null },
    cb = () => {}
) => async dispatch => {
    const today = new Date()

    const sd = parseDate(startDate || today)

    const query = qs({
        startDate: sd,
        endDate: sd,
    })

    const [err, res] = await to(
        fetch(getWorkoutDiary + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return Promise.reject(dispatch({ type: FAIL_FETCH_WORKOUT_DIARY }))

    const workout_diary = await res.json()

    await dispatch({ type: WORKOUT_DIARY_FETCHED, workout_diary })

    return cb()
}
