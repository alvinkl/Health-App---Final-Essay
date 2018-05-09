import eq from '@helper/checkObjectStructure'

const insertWorkoutType = {
    user_input: '',
    duration: 0,
    calories_burned: 0,
    photo: {},
    name: '',
    description: '',
    benefits: '',
    date_time: 0,
}

export const validateInsertWorkout = param => {
    if (!eq(param, insertWorkoutType)) return ['Parameter is invalid!']

    const { photo, duration, calories_burned } = param
    const p = JSON.parse(photo)
    const d = parseInt(duration)
    const cb = parseFloat(calories_burned)

    return [
        false,
        {
            ...param,
            photo: p,
            duration: d,
            calories_burned: cb,
        },
    ]
}

const insertWorkoutGType = {
    workouts: '',
    date_time: 0,
}

export const validateInsertWorkoutG = param => {
    if (!eq(param, insertWorkoutGType)) return ['Parameter is invalid!']

    const { date_time, workouts } = param

    return [
        false,
        {
            workouts,
            date_time,
        },
    ]
}
