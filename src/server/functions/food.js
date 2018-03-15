import { NutritionXAppID, NutritionXAppKeys } from '@config/keys'
import { foodNutritionixAPI } from '@config/urls'
import { MEAL_TYPE } from '@types/food'

import to from '@helper/asyncAwait'
import generateFood from '@types/food'
import Diary from '@model/Diary'

const foodHeaderKeys = {
    'x-app-id': NutritionXAppID,
    'x-app-key': NutritionXAppKeys,
}

export const getFoodData = async query => {
    const url = foodNutritionixAPI.getNatural
    const body = JSON.stringify({
        query,
        timezone: 'US/Eastern',
    })

    const [err, response] = await to(
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...foodHeaderKeys,
            },
            body,
        })
    )

    if (err) return Promise.reject(err)

    const data = await response.json()

    // foods.alt_measures.serving_weight / foods.serving_weight_grams) * full_nutrients

    const food = generateFood(data.foods)

    return Promise.resolve(food)
}

export const getDiaryFood = async (googleID, date) => {
    const { startDate, endDate } = date

    const isoDate = startDate.toISOString()

    // set end of the date
    const endOfDate = endDate || startDate
    endOfDate.setHours(23, 59, 59, 999)
    const isoEndOfDate = endOfDate.toISOString()

    const [err, data] = await to(
        Diary.find({
            user_id: googleID,
            created_time: { $gte: isoDate, $lt: isoEndOfDate },
        })
    )
    if (err) return Promise.reject({ code: 500, message: err })

    const dt = data.reduce(
        (prev, curr) => {
            switch (curr.meal_type) {
                case MEAL_TYPE.BREAKFAST:
                    return {
                        ...prev,
                        breakfast: [...prev.breakfast, curr],
                    }
                case MEAL_TYPE.LUNCH:
                    return {
                        ...prev,
                        lunch: [...prev.breakfast, curr],
                    }
                case MEAL_TYPE.DINNER:
                    return {
                        ...prev,
                        dinner: [...prev.breakfast, curr],
                    }
                case MEAL_TYPE.SNACK:
                    return {
                        ...prev,
                        snack: [...prev.breakfast, curr],
                    }
                default:
                    return prev
            }
        },
        { breakfast: [], lunch: [], dinner: [], snack: [] }
    )

    return Promise.resolve(dt)
}

export const addFoodToDiary = async (googleID, data) => {
    const newDiary = new Diary({
        user_id: googleID,
        ...data,
    })

    const [err] = await to(newDiary.save())
    if (err)
        return Promise.reject({ code: 500, message: 'Fail to insert data!' })

    return Promise.resolve(newDiary)
}
