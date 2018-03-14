import { responseError, responseJSON } from '@handler/response'
import { validateSanitizeGetFood } from '@validation/food'
import { getFoodData } from '@functions/food'

import Diary from '@model/Diary'

import to from '@helper/asyncAwait'

export const handleGetFood = async (req, res) => {
    const [paramErr, param] = validateSanitizeGetFood(req.body)
    if (paramErr) return responseError(res, 400, paramErr)

    const [err, data] = await to(getFoodData(param.query))
    if (err) return responseError(res, 500, err)

    return responseJSON(res, data)
}

export const handleAddFoodToDiary = async (req, res) => {
    const { googleID } = req.user
    const { food_name, quantity, total_weight, nutrients } = req.body

    const nt = JSON.parse(nutrients)

    const newDiary = new Diary({
        user_id: googleID,
        food_name,
        quantity,
        total_weight,
        nutrients: nt,
    })

    const [err] = await to(newDiary.save())
    if (err) return responseError(res, 500, err)

    return responseJSON(res, newDiary)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
