import { responseError, responseJSON } from '@handler/response'
import to from '@helper/asyncAwait'

import * as funcs from '@functions/workout'
import * as v from '@validation/workout'

export const handleGetWorkoutInfo = async (req, res) => {
    const { googleID } = req.user

    const [err, data] = await to(funcs.getWorkoutInfo(googleID))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleInsertWorkout = async (req, res) => {
    const { googleID } = req.user

    const [err, param] = v.validateInsertWorkout(req.body)
    if (err) return responseError(res, 400, err)

    const [errInsert, data] = await to(funcs.insertWorkout(googleID, param))
    if (errInsert) return responseError(res, errInsert.code, errInsert.message)

    return responseJSON(res, data)
}
