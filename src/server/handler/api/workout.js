import { responseError, responseJSON } from '@handler/response'
import to from '@helper/asyncAwait'

import * as funcs from '@functions/workout'
import * as v from '@validation/workout'

export const handleGetWorkoutInfo = async (req, res) => {
    const { googleID } = req.user

    const { workouts } = req.query

    const [err, data] = await to(funcs.getWorkoutInfo(googleID, workouts))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleInsertWorkout = async (req, res) => {
    const { googleID } = req.user

    const [err, param] = v.validateInsertWorkoutG(req.body)
    if (err) return responseError(res, 400, err)

    const [errGet, dt] = await to(
        funcs.getWorkoutInfo(googleID, param.workouts)
    )
    if (errGet) return responseError(res, errGet.code, errGet.message)

    const [errInsert, data] = await to(
        funcs.insertWorkout(googleID, dt.exercises, param.date_time)
    )
    if (errInsert) return responseError(res, errInsert.code, errInsert.message)

    return responseJSON(res, data)
}
