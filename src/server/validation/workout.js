import eq from '@helper/checkObjectStructure'

const insertWorkoutType = {
    user_input: '',
    duration: 0,
    calories_burned: 0,
    photo: {},
    name: '',
    description: '',
    benefits: '',
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
