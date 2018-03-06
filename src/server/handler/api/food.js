import { NutritionXAppID, NutritionXAppKeys } from '@config/keys'
import { foodNutritionixAPI } from '@config/urls'

import to from '@helper/asyncAwait'
import { responseError, responseJSON } from '../response'

const foodHeader = {
    'Content-Type': 'application/json',
    'x-app-id': NutritionXAppID,
    'x-app-key': NutritionXAppKeys,
}

export const handleGetFood = async (req, res, next) => {
    const { user } = req

    const url = foodNutritionixAPI.getNatural
    const [err, response] = await to(
        fetch(url, {
            method: 'POST',
            headers: foodHeader,
            body: JSON.stringify({
                query: 'for breakfast i ate 2 eggs, bacon, and french toast',
                timezone: 'US/Eastern',
            }),
        })
    )

    if (err) return responseError(res, 500, err)

    const data = await response.json()

    responseJSON(res, data)

    console.log(data)
}
