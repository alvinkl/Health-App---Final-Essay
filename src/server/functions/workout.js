import moment from 'moment'

import { foodNutritionixAPI } from '@config/urls'
import { GENDER } from '@constant'
import { NutritionXAppID, NutritionXAppKeys } from '@config/keys'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

import Goal from '@model/Goal'
import Workout from '@model/Workout'

const nutritionxHeader = {
    'x-app-id': NutritionXAppID,
    'x-app-key': NutritionXAppKeys,
}

export const getWorkoutInfo = async (googleID = '', workouts = []) => {
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
        query: 'run 10 minutes',
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

export const insertWorkout = async (googleID = '', workout = {}) => {
    const {
        user_input,
        duration,
        calories_burned,
        photo,
        name,
        description,
        benefits,
    } = workout

    const query = {
        user_id: googleID,

        user_input,
        duration,
        calories_burned,
        photo,
        name,
        description,
        benefits,

        $setOnInsert: {
            create_time: new Date(),
        },
        update_time: new Date(),
    }

    const [err, data] = await to(
        Workout.findOneAndUpdate({ user_id: googleID }, query, {
            upsert: true,
            new: true,
        })
    )
    if (err) {
        console.error('[Mongo][insertWorkout] Failed to insert - ', err)
        return Promise.reject({ code: 500, message: err })
    }

    return Promise.resolve(data)
}
