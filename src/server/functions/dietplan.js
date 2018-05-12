import moment from 'moment'

import { ACTIVITY, GOAL, GENDER } from '@constant'
import to from '@helper/asyncAwait'

import User from '@model/User'
import Goal from '@model/Goal'

export const updateDietPlan = async (googleID, dietPlan) => {
    const [err, user] = await to(User.findOne({ googleID }))
    if (err) return Promise.reject({ code: 400, message: 'User not found!' })

    user.diet_plan = dietPlan
    const [errUpdate] = await to(user.save())
    if (errUpdate)
        return Promise.reject({
            code: 500,
            message: 'Fail to update data!',
        })

    return Promise.resolve(user)
}

export const insertUpdateGoal = async (googleID, goalData) => {
    const query = {
        ...goalData,
        googleID,
        $setOnInsert: {
            create_time: new Date(),
        },
        update_time: new Date(),
    }

    await User.findOneAndUpdate({ googleID }, { new: false })

    const [err, data] = await to(
        Goal.findOneAndUpdate({ googleID }, query, { upsert: true, new: true })
    )
    if (err) return Promise.reject({ code: 500, message: err })

    return Promise.resolve(data)
}

// base on this link https://www.webmd.com/diet/guide/calories-chart
// might need to change to real mathematical formula
export const getRecommendationCalories = async params => {
    const {
        birth_date,
        activity,
        current_height: { value: height },
        target_weight: { value: t_weight },
        current_weight: { value: c_weight },
        gender,
        goal,
    } = params

    const age = moment().diff(birth_date, 'years', false)

    let calories_recommended = 0
    let rec_low = 0
    let rec_high = 0

    if (gender === GENDER.MALE) {
        if (activity === ACTIVITY.LOW_ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low = 2400
                rec_high = 2600
                calories_recommended = 2400
            } else if (age >= 31 && age <= 50) {
                rec_low = 2200
                rec_high = 2400
                calories_recommended = 2200
            } else if (age >= 51) {
                rec_low = 2000
                rec_high = 2200
                calories_recommended = 2100
            }
        } else if (activity === ACTIVITY.ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low = 2600
                rec_high = 2800
                calories_recommended = 2600
            } else if (age >= 31 && age <= 50) {
                rec_low = 2400
                rec_high = 2600
                calories_recommended = 2400
            } else if (age >= 51) {
                rec_low = 2200
                rec_high = 2400
                calories_recommended = 2300
            }
        } else if (activity === ACTIVITY.VERY_ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low = 3000
                rec_high = 3000
                calories_recommended = 3000
            } else if (age >= 31 && age <= 50) {
                rec_low = 2800
                rec_high = 3000
                calories_recommended = 2800
            } else if (age >= 51) {
                rec_low = 2400
                rec_high = 2800
                calories_recommended = 2400
            }
        }
    } else if (gender === GENDER.FEMALE) {
        if (activity === ACTIVITY.LOW_ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low += 1800
                rec_high += 2000
                calories_recommended += 1800
            } else if (age >= 31 && age <= 50) {
                rec_low += 1800
                rec_high += 1800
                calories_recommended += 1800
            } else if (age >= 51) {
                rec_low += 1600
                rec_high += 1600
                calories_recommended += 1600
            }
        } else if (activity === ACTIVITY.ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low += 2000
                rec_high += 2200
                calories_recommended += 2000
            } else if (age >= 31 && age <= 50) {
                rec_low += 2000
                rec_high += 2000
                calories_recommended += 2000
            } else if (age >= 51) {
                rec_low += 1800
                rec_high += 1800
                calories_recommended += 1800
            }
        } else if (activity === ACTIVITY.VERY_ACTIVE) {
            if (age >= 19 && age <= 30) {
                rec_low += 2400
                rec_high += 2400
                calories_recommended += 2400
            } else if (age >= 31 && age <= 50) {
                rec_low += 2200
                rec_high += 2200
                calories_recommended += 2200
            } else if (age >= 51) {
                rec_low += 2000
                rec_high += 2200
                calories_recommended += 2000
            }
        }
    }

    if (goal === GOAL.WEIGHT_LOSS) calories_recommended -= 500
    else if (goal === GOAL.WEIGHT_GAIN) calories_recommended += 500

    return Promise.resolve({ rec_low, rec_high, calories_recommended })
}

export const updateTargetCalories = async (googleID, target_calories) => {
    const [err, result] = await to(
        Goal.findOneAndUpdate(
            { googleID },
            {
                $set: {
                    target_calories,
                },
            }
        )
    )
    if (err) return Promise.reject({ code: 500, message: err })

    if (!result) return Promise.reject({ code: 400, message: 'Fail to update' })

    console.log('Update Calories', result)

    return Promise.resolve({ success: 1 })
}

export const updateWeight = async (googleID, weight = {}) => {
    const {
        current: { value: current_value, tp: current_tp },
        target: { value: target_value, tp: target_tp },
    } = weight

    const [err, result] = await to(
        Goal.findOneAndUpdate(
            { googleID },
            {
                $set: {
                    current_weight: {
                        value: current_value,
                        tp: current_tp,
                    },
                    target_weight: {
                        value: target_value,
                        tp: target_tp,
                    },
                },
            }
        )
    )
    if (err) return Promise.reject({ code: 500, message: err })

    if (!result)
        return Promise.reject({ code: 400, message: 'Failed to update weight' })

    console.log('Update Weight', result)

    return Promise.resolve({ success: 1 })
}
