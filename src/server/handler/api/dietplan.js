import { responseError, responseJSON } from '../response'
import { updateDietPlan } from '@functions/dietplan'

import to from '@helper/asyncAwait'

import { validateSanitizeUpdatePlan } from '@validation/dietplan'

export const handleUpdateDietPlan = async (req, res) => {
    const { googleID } = req.user

    const [errParam, param] = validateSanitizeUpdatePlan(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, user] = await to(updateDietPlan(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, user)
}
