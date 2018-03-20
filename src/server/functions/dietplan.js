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
        $setOnInsert: {
            googleID,
            create_time: new Date(),
        },
        update_time: new Date(),
    }

    const [err, data] = await to(
        Goal.findOneAndUpdate({ googleID }, query, { upsert: true, new: true })
    )
    if (err) return Promise.reject({ code: 500, message: err })

    const {
        goal,
        activity,
        current_height,
        current_weight,
        gender,
        birth_date,
    } = data

    return Promise.resolve({
        goal,
        activity,
        current_height,
        current_weight,
        gender,
        birth_date,
    })
}
