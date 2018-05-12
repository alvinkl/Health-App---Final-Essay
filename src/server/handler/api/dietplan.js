import { responseError, responseJSON } from '../response'

import to from '@helper/asyncAwait'

import * as v from '@validation/dietplan'
import * as funcs from '@functions/dietplan'

export const handleUpdateDietPlan = async (req, res) => {
    const { googleID } = req.user

    const [errParam, param] = v.validateSanitizeUpdatePlan(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, user] = await to(funcs.updateDietPlan(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, user)
}

export const handleInsertUpdateGoal = async (req, res) => {
    // update user status
    if (req.session.passport.user.new) req.session.passport.user.new = false

    const { googleID } = req.user

    const [errParam, param] = v.validateSanitizeInsertUpdateGoal(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, goal] = await to(funcs.insertUpdateGoal(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, goal)
}

export const handleGetRecommendedCalories = async (req, res) => {
    const { googleID } = req.user

    const diet_plan = req.body

    const [err, recommendation] = await to(
        funcs.getRecommendationCalories(diet_plan)
    )
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, recommendation)
}

export const handleUpdateTargetCalories = async (req, res) => {
    const { googleID } = req.user

    const [errParam, target_calories] = v.validateSanitizeTargetCalories(
        req.body
    )
    if (errParam) return responseError(res, 400, errParam)

    const [err, result] = await to(
        funcs.updateTargetCalories(googleID, target_calories)
    )
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, result)
}

export const handleUpdateWeight = async (req, res) => {
    const { googleID } = req.user

    const [errParam, weight] = v.validateSanitizeUpdateWeight(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, result] = await to(funcs.updateWeight(googleID, weight))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, result)
}
