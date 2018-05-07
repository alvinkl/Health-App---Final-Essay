import { isEmpty } from 'lodash'

import {
    NutritionXAppID,
    NutritionXAppKeys,
    GoogleAPIKey,
    ZomatoAPIKey,
} from '@config/keys'
import { foodNutritionixAPI, googleMaps, zomatoAPI } from '@config/urls'
import * as constants from '@constant'

import { restaurantNearby, zomato } from './dummy/googlemap'

import to from '@helper/asyncAwait'
import generateFood from '@types/food'
import Diary from '@model/Diary'
import FoodSuggest from '@model/FoodSuggest'
import Restaurant from '@model/Restaurant'
import Menu from '@model/Menu'

import qs from '@helper/queryString'

const foodHeaderKeys = {
    'x-app-id': NutritionXAppID,
    'x-app-key': NutritionXAppKeys,
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

    const query = {
        user_id: googleID,
        created_time: { $gte: isoDate, $lt: isoEndOfDate },
        status: constants.DIARY_AVAILABLE,
    }
    const [err, data] = await to(Diary.find(query))
    if (err) return Promise.reject({ code: 500, message: err })

    const dt = data.reduce(
        (prev, curr) => {
            switch (curr.meal_type) {
                case constants.MEAL_TYPE.BREAKFAST:
                    return {
                        ...prev,
                        breakfast: [...prev.breakfast, curr],
                    }
                case constants.MEAL_TYPE.LUNCH:
                    return {
                        ...prev,
                        lunch: [...prev.lunch, curr],
                    }
                case constants.MEAL_TYPE.DINNER:
                    return {
                        ...prev,
                        dinner: [...prev.dinner, curr],
                    }
                case constants.MEAL_TYPE.SNACK:
                    return {
                        ...prev,
                        snack: [...prev.snack, curr],
                    }
                default:
                    return prev
            }
        },
        { breakfast: [], lunch: [], dinner: [], snack: [] }
    )

    return Promise.resolve(dt)
}

export const getSingleDiary = async (
    googleID,
    diary_id,
    checkExistence = false
) => {
    let returnType
    if (checkExistence) returnType = { _id: 1 }

    const query = {
        _id: diary_id,
        user_id: googleID,
    }

    const [err, diary] = await to(Diary.findOne(query, returnType))
    if (err) return Promise.reject({ code: 500, message: err })

    if (!diary)
        return Promise.reject({
            code: 400,
            message: 'Diary with id=' + diary_id + ' not found!',
        })

    return Promise.resolve(diary)
}

export const removeDiary = async diary_id => {
    const [err] = await to(
        Diary.findOneAndUpdate(
            { _id: diary_id },
            { $set: { status: constants.DIARY_REMOVED } }
        )
    )
    if (err) return Promise.reject({ code: 500, message: err })

    return Promise.resolve({ success: 1 })
}

export const getDiaryReport = async (googleID, timestamp) => {
    const today = new Date(timestamp || Date.now())
    today.setHours(0, 0, 0, 0)

    const last7days = new Date(today.valueOf() - 7 * constants.ONEDAY)

    const tomorrow = new Date(today.valueOf() + 1 * constants.ONEDAY)
    const yesterday = new Date(today.valueOf() - 1 * constants.ONEDAY)
    const _2daysAgo = new Date(today.valueOf() - 2 * constants.ONEDAY)
    const _3daysAgo = new Date(today.valueOf() - 3 * constants.ONEDAY)
    const _4daysAgo = new Date(today.valueOf() - 4 * constants.ONEDAY)
    const _5daysAgo = new Date(today.valueOf() - 5 * constants.ONEDAY)
    const _6daysAgo = new Date(today.valueOf() - 6 * constants.ONEDAY)
    const _7daysAgo = new Date(today.valueOf() - 7 * constants.ONEDAY)

    const query = [
        {
            $match: {
                user_id: googleID,
                created_time: {
                    $gte: last7days,
                },
            },
        },
        {
            $group: {
                _id: {
                    $cond: [
                        {
                            $and: [
                                { $lt: ['$created_time', tomorrow] },
                                { $gte: ['$created_time', today] },
                            ],
                        },
                        0,
                        {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$created_time', today] },
                                        { $gt: ['$created_time', yesterday] },
                                    ],
                                },
                                1,
                                {
                                    $cond: [
                                        {
                                            $and: [
                                                {
                                                    $lt: [
                                                        '$created_time',
                                                        yesterday,
                                                    ],
                                                },
                                                {
                                                    $gt: [
                                                        '$created_time',
                                                        _2daysAgo,
                                                    ],
                                                },
                                            ],
                                        },
                                        2,
                                        {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {
                                                            $lt: [
                                                                '$created_time',
                                                                _2daysAgo,
                                                            ],
                                                        },
                                                        {
                                                            $gt: [
                                                                '$created_time',
                                                                _3daysAgo,
                                                            ],
                                                        },
                                                    ],
                                                },
                                                3,
                                                {
                                                    $cond: [
                                                        {
                                                            $and: [
                                                                {
                                                                    $lt: [
                                                                        '$created_time',
                                                                        _3daysAgo,
                                                                    ],
                                                                },
                                                                {
                                                                    $gt: [
                                                                        '$created_time',
                                                                        _4daysAgo,
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                        4,
                                                        {
                                                            $cond: [
                                                                {
                                                                    $and: [
                                                                        {
                                                                            $lt: [
                                                                                '$created_time',
                                                                                _4daysAgo,
                                                                            ],
                                                                        },
                                                                        {
                                                                            $gt: [
                                                                                '$created_time',
                                                                                _5daysAgo,
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                                5,
                                                                {
                                                                    $cond: [
                                                                        {
                                                                            $and: [
                                                                                {
                                                                                    $lt: [
                                                                                        '$created_time',
                                                                                        _5daysAgo,
                                                                                    ],
                                                                                },
                                                                                {
                                                                                    $gt: [
                                                                                        '$created_time',
                                                                                        _6daysAgo,
                                                                                    ],
                                                                                },
                                                                            ],
                                                                        },
                                                                        6,
                                                                        {
                                                                            $cond: [
                                                                                {
                                                                                    $and: [
                                                                                        {
                                                                                            $lt: [
                                                                                                '$created_time',
                                                                                                _6daysAgo,
                                                                                            ],
                                                                                        },
                                                                                        {
                                                                                            $gt: [
                                                                                                '$created_time',
                                                                                                _7daysAgo,
                                                                                            ],
                                                                                        },
                                                                                    ],
                                                                                },
                                                                                7,
                                                                                8,
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                food: {
                    $push: {
                        food_name: '$food_name',
                        calories: '$nutrients.calories',
                        meal_type: '$meal_type',
                    },
                },
            },
        },
        {
            $project: {
                days_minus: '$_id',
                foods: '$food',
                _id: 0,
            },
        },
    ]

    const [err, data] = await to(Diary.aggregate(query))
    if (err) return Promise.reject({ code: 500, message: err })

    let final_data = data.reduce(
        (p, d) => {
            let mt = d.foods.reduce(
                (prev, curr) => {
                    let calories = parseInt(curr.calories)
                    switch (curr.meal_type) {
                        case constants.MEAL_TYPE.BREAKFAST:
                            return {
                                ...prev,
                                breakfast: prev.breakfast + calories,
                            }
                        case constants.MEAL_TYPE.LUNCH:
                            return {
                                ...prev,
                                lunch: prev.lunch + calories,
                            }
                        case constants.MEAL_TYPE.DINNER:
                            return {
                                ...prev,
                                dinner: prev.dinner + calories,
                            }
                        case constants.MEAL_TYPE.SNACK:
                            return {
                                ...prev,
                                snack: prev.snack + calories,
                            }
                        default:
                            return prev
                    }
                },
                {
                    breakfast: 0,
                    lunch: 0,
                    dinner: 0,
                    snack: 0,
                }
            )
            if (d.days_minus > 7) return p

            return {
                ...p,
                [d.days_minus]: mt,
            }
        },
        {
            0: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            1: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            2: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            3: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            4: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            5: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            6: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
            7: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0,
            },
        }
    )

    return Promise.resolve(final_data)
}

export const addFoodToDiary = async (googleID, data) => {
    const newDiary = new Diary({
        user_id: googleID,
        ...data,
        photo: {
            thumbnail: '',
        },
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

export const getNearbyRestaurantCuisine = async ({
    cuisines = '',
    keywords = '',
    lat = 0,
    lon = 0,
}) => {
    const url = zomatoAPI.getNearbyRestaurant

    // for now cuisines will be hardcoded
    const query = qs({
        ...binus,
        radius: 500,
        cuisines: cuisines || ['chinese', 'indonesian', 'western'],
        q: keywords,
    })

    // const [err, res] = await to(
    //     fetch(url + query, {
    //         'user-key': ZomatoAPIKey,
    //         Accept: 'application/json',
    //     })
    // )
    // if (err) return Promise.reject({ code: 503, message: err })

    // const data = await res.json()

    const { restaurants } = zomato

    const restaurants_data = restaurants.map(({ restaurant: r }) => ({
        id: r.id,
        name: r.name,
        cuisines: r.cuisines,
        rating: r.user_rating.aggregate_rating,
        price_range: r.price_range,
        url: r.url,
        thumbnail: r.thumb,
        menu_url: r.menu_url,
        location: r.location,
    }))

    // Transform the object into array of cuisines

    return Promise.resolve(restaurants_data)
}

export const getFoodsByKeywords = async (keywords = []) => {
    keywords = [...keywords, 'chinese']

    const query = [
        { $match: { keywords: { $in: keywords } } },
        {
            $group: {
                _id: '$cuisine',
                foods: {
                    $push: {
                        food_name: '$food_name',
                        keywords: '$keywords',
                        nutrition: '$nutrition',
                    },
                },
            },
        },
        { $project: { foods: { $slice: ['$foods', 5] } } },
    ]
    const [err, data] = await to(FoodSuggest.aggregate(query))

    if (err) Promise.reject({ code: 500, message: err })

    const result_by_cuisine = data.reduce(
        (prev, curr) => {
            let { _id: cuisine } = curr
            return {
                ...prev,
                [cuisine]: [...prev[cuisine], ...curr.foods],
            }
        },
        {
            indonesian: [],
            chinese: [],
            western: [],
        }
    )

    return Promise.resolve(result_by_cuisine)
}

export const extractKeywords = (restaurants = []) => {
    const rs = restaurants.reduce((prev, curr) => [...prev, curr.cuisines], [])

    const cs = rs.reduce((prev, curr) => {
        let n = prev[curr] || 0
        return {
            ...prev,
            [curr]: ++n,
        }
    }, {})

    const keywords = Object.keys(cs).map(r => r.toLowerCase())

    return keywords
}

// Suggest Food with Menu
export const getRestaurantNearby = async location => {
    const { lat, lon } = location
    const radius = 500 // .5km
    const count = 3

    const aggregateQuery = [
        {
            $geoNear: {
                near: {
                    coordinates: [lon, lat],
                },
                distanceField: 'distance',
                spherical: true,
                maxDistance: radius,
            },
        },
        {
            $limit: count,
        },
    ]
    const restaurants_db = await Restaurant.aggregate(aggregateQuery)
    if (!isEmpty(restaurants_db)) return restaurants_db

    const url = zomatoAPI.getNearbyRestaurant

    const query = qs({
        ...binus,
        lat,
        lon,
        count: 3,
        radius,
    })

    const headers = {
        'user-key': ZomatoAPIKey,
        Accept: 'application/json',
    }

    console.log('[Fetch] Zomato for Nearby Restaurant')
    const [err, res] = await to(fetch(url + query, { headers, method: 'GET' }))
    if (err) {
        console.error('[Failed] [Fetch] Zomato for Nearby Restaurant')
        return Promise.reject({ code: 503, message: err })
    }

    const data = await res.json()

    // const restaurant_ids = data.restaurants.map(
    //     ({ restaurant: { R } }) => R.res_id
    // )

    const restaurant_data = data.restaurants.map(({ restaurant }) => {
        const lat = parseFloat(restaurant.location.latitude)
        const lon = parseFloat(restaurant.location.longitude)

        return {
            restaurant_id: restaurant.R.res_id,
            name: restaurant.name,
            cuisines: restaurant.cuisines,
            coordinates: [lon, lat],
            lat,
            lon,
            keywords: [
                ...restaurant.cuisines.toLowerCase().split(', '),
                ...restaurant.name.toLowerCase().split(' '),
            ],
            address: restaurant.location.address,
            url: restaurant.url,
            thumbnail: restaurant.thumb,
        }
    })

    Restaurant.insertMany(restaurant_data, (err, docs) => {
        if (err)
            return console.error(
                '[Functions][getRestaurantNearby] Failed to insert to DB,',
                err.errmsg
            )
        return console.log(
            '[Functions][getRestaurantNearby] ',
            docs.length,
            ' restaurants are inserted to DB'
        )
    })

    return Promise.resolve(restaurant_data)
}

export const getMenusFromRestaurant = async restaurant_ids => {
    const query = [
        {
            $match: { restaurant_id: { $in: restaurant_ids } },
        },
        {
            $unwind: '$menus',
        },
        {
            $match: {
                'menus.nutritions.calories': {
                    $gte: 500,
                },
            },
        },
        {
            $project: {
                _id: 0,
                restaurant_id: 1,
                name: '$menus.name',
                serving_size: '$menus.serving_size',
                unit: '$menus.unit',
                nutritions: '$menus.nutritions',
            },
        },
    ]

    const [err, menus] = await to(Menu.aggregate(query))
    if (err) return Promise.reject({ code: 500, message: err })

    // const map_menus = menus.reduce(
    //     (prev, curr) => ({
    //         ...prev,
    //         [curr.restaurant_id]: (prev[curr.restaurant_id] || []).concat({
    //             name: curr.name,
    //             serving_size: curr.serving_size,
    //             unit: curr.unit,
    //             nutritions: curr.nutritions,
    //         }),
    //     }),
    //     {}
    // )

    return Promise.resolve(menus)
}

// FIX TO FETCH IMAGE!
// https://maps.googleapis.com/maps/api/staticmap?center=-6.1765936299,106.7897127941&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S&key=AIzaSyC1j9Y4f72dto_M6JEeaK-Vo4wsc0d1xt8
export const getRestaurantMapLocation = async (lat, lon) => {
    const coordinates = lat + ',' + lon
    const query = qs({
        center: coordinates,
        zoom: 20,
        size: '600x300',
        maptype: 'roadmap',
        markers: 'color:blue|' + coordinates,
        key: GoogleAPIKey,
    })

    // TODO: Return data in the form of buffer
    // const [err, map] = await to(
    //     fetch(googleMaps.getDisplayMap + query, {
    //         method: 'GET',
    //         headers: {
    //             accept:
    //                 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    //             'accept-encoding': 'gzip, deflate, br',
    //             'accept-language':
    //                 'en-US,en;q=0.9,id;q=0.8,ms;q=0.7,nb;q=0.6,ja;q=0.5',
    //         },
    //         mode: 'cors',
    //     })
    // )
    // if (err) return Promise.reject({ err: err })

    // const buffer = map.body._readableState.buffer.head.data

    // return Promise.resolve({ buffer })
    return Promise.resolve({ url: googleMaps.getDisplayMap + query })
}
