import { NutritionXAppID, NutritionXAppKeys, GoogleAPIKey } from '@config/keys'
import { foodNutritionixAPI, googleMaps } from '@config/urls'
import { MEAL_TYPE } from '@types/food'

import { restaurantNearby } from './dummy/googlemap'

import to from '@helper/asyncAwait'
import generateFood from '@types/food'
import Diary from '@model/Diary'

import qs from '@helper/queryString'

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

export const getRestaurantsNearLocation = async (cuisine_type = []) => {
    const url = googleMaps.getNearbyPlaces
    const query = qs({
        key: GoogleAPIKey,
        keyword: ['restaurant', ...cuisine_type].join(','),
        radius: 500,
        location: '-6.201917,106.781358',
    })

    const [err, res] = await to(
        fetch(url + query, {
            headers: {
                'content-type': 'application/json',
            },
        })
    )
    if (err) return Promise.reject({ code: 503, message: err })

    const { results } = await res.json()

    const restaurants = results.map(r => ({
        restaurant_id: r.id,
        name: r.name,
        open_now: r.opening_hours ? r.opening_hours.open_now : false,
        place_id: r.place_id,
        rating: r.rating,
        types: r.types,
        icon: r.icon,
        address: r.vicimity,
    }))

    return Promise.resolve(restaurantNearby)
}
