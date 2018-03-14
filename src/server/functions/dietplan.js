import to from '@helper/asyncAwait'
import User from '@model/User'

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
