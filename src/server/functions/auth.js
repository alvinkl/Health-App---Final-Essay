import to from '@helper/asyncAwait'

import User from '@model/User'
import Goal from '@model/Goal'

export const getUserData = async googleID => {
    const [err, user] = await to(User.findOne({ googleID }))
    if (err) return Promise.reject({ code: 500, message: err })

    const [errGoal, diet_plan] = await to(Goal.findOne({ googleID }))
    if (errGoal) return Promise.reject({ code: 500, message: errGoal })

    const data = {
        ...user._doc,
        diet_plan: diet_plan || { success: false },
    }

    return Promise.resolve(data)
}
