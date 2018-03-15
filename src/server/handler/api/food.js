import { responseError, responseJSON } from '@handler/response'
import {
    validateSanitizeGetFood,
    validateSanitizeAddFoodToDiary,
} from '@validation/food'
import { getFoodData, addFoodToDiary } from '@functions/food'

import Diary from '@model/Diary'

import to from '@helper/asyncAwait'

// Food API
export const handleGetFood = async (req, res) => {
    const [paramErr, param] = validateSanitizeGetFood(req.body)
    if (paramErr) return responseError(res, 400, paramErr)

    const [err, data] = await to(getFoodData(param.query))
    if (err) return responseError(res, 500, err)

    return responseJSON(res, data)
}

// Food Diary
export const handleGetDiaryFood = async (req, res) => {
    const { googleID } = req.user

    return responseJSON(res, req.query)
}

export const handleAddFoodToDiary = async (req, res) => {
    const { googleID } = req.user

    const [err, param] = validateSanitizeAddFoodToDiary(req.body)
    if (err) return responseError(res, 400, err)

    const [errInsert, newDiary] = await to(addFoodToDiary(googleID, param))
    if (errInsert) return responseError(res, errInsert.code, errInsert.message)

    return responseJSON(res, newDiary)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
