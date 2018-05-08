import { responseError, responseJSON } from '@handler/response'
import * as validations from '@validation/food'
import * as funcs from '@functions/food'

import to from '@helper/asyncAwait'
import { getNearbyRestaurantCuisine } from '../../functions/food'

// Food API
export const handleGetFood = async (req, res) => {
    const [paramErr, param] = validations.validateSanitizeGetFood(req.body)
    if (paramErr) return responseError(res, 400, paramErr)

    const [err, data] = await to(funcs.getFoodData(param.query))
    if (err) return responseError(res, 500, err)

    return responseJSON(res, data)
}

// Food Diary
export const handleGetDiaryFood = async (req, res) => {
    const { googleID } = req.user

    const [paramErr, date] = validations.validateGetDiaryFood(req.query)
    if (paramErr) return responseError(res, 400, paramErr)

    const [err, diary] = await to(funcs.getDiaryFood(googleID, date))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, diary)
}

export const handleGetDailyCalories = async (req, res) => {
    const { googleID } = req.user

    const [err, total_calories] = await to(funcs.getTodayCalories(googleID))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, total_calories)
}

export const handleRemoveFoodFromDiary = async (req, res) => {
    const { googleID } = req.user

    const [paramErr, diary_id] = validations.validateRemoveFoodFromDiary(
        req.body
    )
    if (paramErr) return responseError(res, 400, paramErr)

    const [errDiary] = await to(funcs.getSingleDiary(googleID, diary_id, true))
    if (errDiary) return responseError(res, errDiary.code, errDiary.message)

    const [errRemove] = await to(funcs.removeDiary(diary_id))
    if (errRemove) return responseError(res, errRemove.code, errRemove.message)

    return responseJSON(res, { success: 1 })
}

export const handleGetDiaryReport = async (req, res) => {
    const { googleID } = req.user

    const { timestamp } = req.query

    const [err, diary] = await to(
        funcs.getDiaryReport(googleID, parseInt(timestamp))
    )
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, diary)
}

export const handleAddFoodToDiary = async (req, res) => {
    const { googleID } = req.user

    const [err, param] = validations.validateSanitizeAddFoodToDiary(req.body)
    if (err) return responseError(res, 400, err)

    const [errInsert, newDiary] = await to(
        funcs.addFoodToDiary(googleID, param)
    )
    if (errInsert) return responseError(res, errInsert.code, errInsert.message)

    return responseJSON(res, newDiary)
}

export const handleSuggestFood = async (req, res) => {
    const [err, location] = validations.validateSanitizeSuggestFood(req.query)
    if (err) return responseError(res, 400, err)

    const [errRes, restaurants] = await to(getNearbyRestaurantCuisine(location))
    if (errRes) return responseError(res, errRes.code, errRes.message)

    /*
        for now just display 3 cuisine not based on location
        then iterate to find the food menu base on location
    */

    const keywords = funcs.extractKeywords(restaurants)

    const [errFood, foods] = await to(funcs.getFoodsByKeywords(keywords))
    if (errFood) return responseError(res, errFood.code, errFood.message)

    return responseJSON(res, foods)
}

export const handleSuggestRestaurant = async (req, res) => {
    const [err, param] = validations.validateSanitizeQueryType(req.query)
    if (err) return responseError(res, 400, err)

    const [errRes, restaurants] = await to(
        getNearbyRestaurantCuisine(param.cuisine, param.keywords)
    )
    if (errRes) return responseError(res, errRes.code, errRes.message)

    return responseJSON(res, restaurants)
}

// Suggest Food with Menu
export const handleGetNearbyRestaurant = async (req, res) => {
    const [err, param] = validations.validateSanitizeLatLong(req.query)
    if (err) return responseError(res, 400, err)

    const [errGetRestaurant, data] = await to(
        funcs.getRestaurantNearby(param.location)
    )
    if (errGetRestaurant)
        return responseError(
            res,
            errGetRestaurant.code,
            errGetRestaurant.message
        )

    if (!param.cuisine) return responseJSON(res, data)

    const groupBycuisine = data.reduce(
        (prev, curr) => ({
            ...prev,
            [curr.cuisines]: (prev[curr.cuisines] || []).concat(curr),
        }),
        {}
    )

    return responseJSON(res, groupBycuisine)
}

export const handleGetMenusFromRestaurant = async (req, res) => {
    const [err, restaurant_ids] = validations.validateSanitizeRestaurantIds(
        req.query
    )
    if (err) return responseError(res, 400, err)

    const [errGetMenus, menus] = await to(
        funcs.getMenusFromRestaurant(restaurant_ids)
    )
    if (errGetMenus)
        return responseError(res, errGetMenus.code, errGetMenus.message)

    return responseJSON(res, menus)
}

export const handleGetRestaurantMapLocation = async (req, res) => {
    const { lat, lon } = req.query

    const map = await funcs.getRestaurantMapLocation(lat, lon)

    res.send(map)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
