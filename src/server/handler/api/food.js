import { responseError, responseJSON } from '@handler/response'
import {
    validateSanitizeGetFood,
    validateSanitizeAddFoodToDiary,
    validateGetDiaryFood,
    validateSanitizeQueryType,
    validateSanitizeSuggestFood,
} from '@validation/food'
import {
    getFoodData,
    addFoodToDiary,
    getDiaryFood,
    getDiaryReport,
    getRestaurantsNearLocation,
    getRestaurantsNearLocationKW,
    getFoodsByKeywords,
    extractKeywords,
} from '@functions/food'

import to from '@helper/asyncAwait'
import { getNearbyRestaurantCuisine } from '../../functions/food'

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

    const [paramErr, date] = validateGetDiaryFood(req.query)
    if (paramErr) return responseError(res, 400, paramErr)

    const [err, diary] = await to(getDiaryFood(googleID, date))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, diary)
}

export const handleGetDiaryReport = async (req, res) => {
    const { googleID } = req.user

    const [err, diary] = await to(getDiaryReport(googleID))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, diary)
}

export const handleAddFoodToDiary = async (req, res) => {
    const { googleID } = req.user

    const [err, param] = validateSanitizeAddFoodToDiary(req.body)
    if (err) return responseError(res, 400, err)

    const [errInsert, newDiary] = await to(addFoodToDiary(googleID, param))
    if (errInsert) return responseError(res, errInsert.code, errInsert.message)

    return responseJSON(res, newDiary)
}

export const handleSuggestFood = async (req, res) => {
    const [err, location] = validateSanitizeSuggestFood(req.query)
    if (err) return responseError(res, 400, err)

    const [errRes, restaurants] = await to(getNearbyRestaurantCuisine(location))
    if (errRes) return responseError(res, errRes.code, errRes.message)

    /*
        for now just display 3 cuisine not based on location
        then iterate to find the food menu base on location
    */

    const keywords = extractKeywords(restaurants)

    const [errFood, foods] = await to(getFoodsByKeywords(keywords))
    if (errFood) return responseError(res, errFood.code, errFood.message)

    return responseJSON(res, foods)
}

export const handleSuggestRestaurant = async (req, res) => {
    const [err, param] = validateSanitizeQueryType(req.query)
    if (err) return responseError(res, 400, err)

    const [errRes, restaurants] = await to(
        getNearbyRestaurantCuisine(param.cuisine, param.keywords)
    )
    if (errRes) return responseError(res, errRes.code, errRes.message)

    return responseJSON(res, restaurants)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
