import { responseError, responseJSON } from '../response'
import { updateDietPlan, insertUpdateGoal } from '@functions/dietplan'

import to from '@helper/asyncAwait'

import {
    validateSanitizeUpdatePlan,
    validateSanitizeInsertUpdateGoal,
} from '@validation/dietplan'

export const handleUpdateDietPlan = async (req, res) => {
    const { googleID } = req.user

    const [errParam, param] = validateSanitizeUpdatePlan(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, user] = await to(updateDietPlan(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, user)
}

export const handleInsertUpdateGoal = async (req, res) => {
    // update user status
    if (req.session.passport.user.new) req.session.passport.user.new = false

    const { googleID } = req.user

    const [errParam, param] = validateSanitizeInsertUpdateGoal(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, goal] = await to(insertUpdateGoal(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, goal)
}
