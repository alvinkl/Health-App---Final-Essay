import {
    NutritionXAppID,
    NutritionXAppKeys,
    GoogleAPIKey,
    ZomatoAPIKey,
} from '@config/keys'
import { foodNutritionixAPI, googleMaps, zomatoAPI } from '@config/urls'
import { MEAL_TYPE } from '@types/food'

import { restaurantNearby, zomato } from './dummy/googlemap'

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

// Google Maps
export const getRestaurantsNearLocation = async (cuisine_type = []) => {
    const url = googleMaps.getNearbyPlaces
    const query = qs({
        key: GoogleAPIKey,
        keyword: ['restaurant', 'food', ...cuisine_type].join(','),
        radius: 500,
        location: '-6.201917,106.781358',
    })

    // const [err, res] = await to(
    //     fetch(url + query, {
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //     })
    // )
    // if (err) return Promise.reject({ code: 503, message: err })

    // const { results } = await res.json()

    // const restaurants = results.map(r => ({
    //     restaurant_id: r.id,
    //     name: r.name,
    //     open_now: r.opening_hours ? r.opening_hours.open_now : false,
    //     place_id: r.place_id,
    //     rating: r.rating,
    //     types: r.types.join(','),
    //     icon: r.icon,
    //     address: r.vicimity,
    // }))

    const restaurants = restaurantNearby.map(r => ({
        ...r,
        types: r.types.join(','),
    }))

    return Promise.resolve(restaurants)
}

// location mock
const cp = {
    lat: -6.1765936299,
    lon: 106.7897127941,
    entity_id: 4055,
    entity_type: 'group',
}
const binus = {
    lat: -6.2018556,
    lon: 106.7807473,
    entity_id: 5305,
    entity_type: 'group',
}

/*
    Flow
    1. User Request to fetch what to eat
    2. Server fetch data to zomato API to see nearby restaurant's match with 3 categories
        (Chinese, Indonesian, Western)
        for general categories
    3. Query to database to get matched general keywords
        like chinese, indonesian, western
    4. User select the food they want to eat on the list that contains
        more specific keywords
    5. Server responded with matching specific keywords to re fetch from zomato
*/

export const getRestaurantsNearLocationKW = async (
    cuisines = '',
    food = []
) => {
    const url = zomatoAPI.getNearbyRestaurant
    // location using central park, location received from location endpoint
    const query = qs({
        ...binus,
        q: food.join(', '),
        radius: 500,
        cuisines,
    })

    const headers = {
        'user-key': ZomatoAPIKey,
        Accept: 'application/json',
    }

    const [err, res] = await to(fetch(url + query, { headers, method: 'GET' }))
    if (err) return Promise.reject({ code: 503, message: err })

    const data = await res.json()

    const { results_found, restaurants } = data

    const finalRes = {
        count: results_found,
        restaurants: restaurants.map(({ restaurant }) => ({
            id: restaurant.id,
            name: restaurant.name,
            url: restaurant.url,
            location: restaurant.location,
            cuisines: restaurant.cuisines,
            rating: restaurant.user_rating.aggregate_rating,
            votes: restaurant.user_rating.votes,
            photo: restaurant.photos_url,
        })),
    }

    return Promise.resolve(finalRes)
}

export const getNearbyRestaurantCuisine = async (cuisines = '') => {
    const url = zomatoAPI.getNearbyRestaurant

    // for now cuisines will be hardcoded
    const query = qs({
        ...binus,
        radius: 500,
        cuisines: ['chinese', 'indonesian', 'western'],
    })

    // const [err, res] = await to(
    //     fetch(url + query, {
    //         'user-key': ZomatoAPIKey,
    //         Accept: 'application/json',
    //     })
    // )
    // if (err) return Promise.reject({ code: 503, message: err })

    // const data = await res.json()

    const data = zomato

    const keywords = extractKeywords(data.restaurants)

    return Promise.resolve(keywords)
}

const extractKeywords = (restaurants = [], type = 0) => {
    // Transform the object into array of cuisines
    const rs = restaurants.reduce(
        (prev, curr) => [...prev, curr.restaurant.cuisines],
        []
    )

    const cuisines = rs.reduce((prev, curr) => {
        let n = prev[curr] || 0
        return {
            ...prev,
            [curr]: ++n,
        }
    }, {})

    if (type === 0) return Object.keys(cuisines)

    return cuisines
}
