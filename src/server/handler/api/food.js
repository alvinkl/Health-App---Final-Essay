import { responseError, responseJSON } from '@handler/response'
import { validateSanitizeGetFood } from '@validation/food'
import { getFoodData } from '@functions/food'

export const handleGetFood = async (req, res) => {
    const [paramErr, param] = validateSanitizeGetFood(req.body)
    if (paramErr) return responseError(res, 400, 'Bad Request')

    const [err, data] = await getFoodData(param.query)
    if (err) return responseError(res, 500, err)

    return responseJSON(res, data)
}

export const handleNotFoundRoute = (req, res) => {
    responseError(res, 404, 'Invalid Route')
    return
}
