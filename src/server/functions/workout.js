import moment from 'moment'

import { foodNutritionixAPI } from '@config/urls'
import { GENDER, WORKOUT_AVAILABLE, WORKOUT_REMOVED } from '@constant'
import { NutritionXAppID, NutritionXAppKeys } from '@config/keys'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

import Goal from '@model/Goal'
import Workout from '@model/Workout'
import { WORKOUT_DIARY_FETCHED } from '@client/actions/workout'

const nutritionxHeader = {
    'x-app-id': NutritionXAppID,
    'x-app-key': NutritionXAppKeys,
}

export const getWorkoutInfo = async (googleID = '', workouts = '') => {
    const query = [
        {
            $match: { googleID },
        },
        {
            $project: {
                _id: 0,
                height: '$current_height.value',
                current_weight: '$current_weight.value',
                gender: 1,
                birth_date: 1,
            },
        },
    ]

    const [err, [goal]] = await to(Goal.aggregate(query).limit(1))
    if (err) return Promise.reject({ code: 500, message: err })

    if (!goal)
        return Promise.reject({
            code: 400,
            message: 'User has no profile yet!',
        })

    const { gender, height, current_weight, birth_date } = goal
    let queryNutritionix = {
        query: workouts,
        height_cm: height,
        weight_kg: current_weight,
        gender: gender === GENDER.MALE ? 'male' : 'female',
        age: moment().diff(birth_date, 'years', false),
    }

    const url = foodNutritionixAPI.getExerciseNatural
    const [errFetch, res] = await to(
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...nutritionxHeader,
            },
            body: JSON.stringify(queryNutritionix),
        })
    )
    if (errFetch) {
        console.log('[Workout][NutritionxAPI] Failed to fetch, ', errFetch)
        return Promise.reject({ code: 500, message: errFetch })
    }

    const data = await res.json()

    const { exercises } = data

    const final_data = exercises.map(e => ({
        user_input: e.user_input,
        duration: e.duration_min,
        calories_burned: e.nf_calories,
        photo: {
            highres: e.photo.highres,
            thumbnail: e.photo.thumb,
        },
        name: e.name,
        description: e.description || '',
        benefits: e.benefits || '',
    }))

    return Promise.resolve({ exercises: final_data })
}

export const insertWorkout = async (
    googleID = '',
    workout = [],
    workout_time
) => {
    const insert_workout = workout.map(w => ({
        user_id: googleID,
        ...w,
        workout_time,
        status: WORKOUT_AVAILABLE,
    }))

    Workout.insertMany(insert_workout, (err, docs) => {
        if (err) {
            console.error('[Functions][insertWorkout] Failed to insert - ', err)
            return Promise.reject({ code: 500, message: err })
        }

        return console.log(
            '[Functions][insertWorkout] ',
            docs.length,
            ' workouts are inserted to DB'
        )
    })

    return Promise.resolve(insert_workout)
}

export const getWorkoutDiaries = async (googleID, date, single = false) => {
    const { startDate, endDate } = date

    startDate.setHours(0, 0, 0, 0)
    const isoStartDate = startDate.toISOString()

    // set end of the date
    const endOfDate = endDate || startDate
    endOfDate.setHours(23, 59, 59, 999)
    const isoEndOfDate = endOfDate.toISOString()

    const query = {
        user_id: googleID,
        create_time: { $gte: isoStartDate, $lt: isoEndOfDate },
        status: WORKOUT_AVAILABLE,
    }

    let data_type = {
        _id: 1,
        name: 1,
        description: 1,
        benefits: 1,
        duration: 1,
        calories_burned: 1,
        photo: 1,
        workout_time: 1,
    }

    let err
    let data

    if (single) {
        ;[err, data] = await to(
            Workout.findOne(query, data_type).sort({ workout_time: 1 })
        )
    } else {
        ;[err, data] = await to(
            Workout.find(query, data_type).sort({ workout_time: 1 })
        )
    }
    if (err) return Promise.reject({ code: 500, message: err })

    if (single) return Promise.resolve(data)

    data = data.reduce((p, c) => {
        const key = moment(c.workout_time).format('HH:mm A')
        return { ...p, [key]: [...(p[key] || []), c] }
    }, {})

    return Promise.resolve(data)
}

export const getWorkoutCalories = async (googleID, date) => {
    const dt = date || new Date()

    const startDate = dt
    startDate.setHours(0, 0, 0, 0)
    const isoStartDate = startDate.toISOString()

    // set end of the date
    const endOfDate = dt
    endOfDate.setHours(23, 59, 59, 999)
    const isoEndOfDate = endOfDate.toISOString()

    const query = {
        user_id: googleID,
        create_time: { $gte: isoStartDate, $lt: isoEndOfDate },
        status: WORKOUT_AVAILABLE,
    }

    const data_type = {
        _id: 0,
        calories_burned: 1,
    }

    const [err, data] = await to(Workout.find(query, data_type))
    if (err) return Promise.reject({ code: 500, message: err })

    const calories = data.reduce((p, c) => p + c.calories_burned, 0)

    return Promise.resolve({ calories })
}

export const deleteWorkout = async (googleID, workout_id) => {
    const [err] = await to(
        Workout.findOneAndUpdate(
            { user_id: googleID, _id: workout_id },
            { $set: { status: WORKOUT_REMOVED } }
        )
    )
    if (err) return Promise.reject({ code: 500, message: err })

    return Promise.resolve({ success: 1 })
}
