import moment from 'moment'
import eq from '@helper/checkObjectStructure'
import { MEAL_TYPE, CUISINE_TYPE } from '@constant'

const getFoodType = {
    query: '',
}

export const validateSanitizeGetFood = param => {
    if (!eq(param, getFoodType)) return ['Invalid parameter!']

    const { query } = param

    if (!(typeof query === 'string') || !query) {
        return ['Invalid query']
    }

    return [
        false,
        {
            query,
        },
    ]
}

const addFoodToDiaryType = {
    name: '',
    unit: '',
    quantity: 0,
    total_weight: 0,
    nutrients: {
        calories: 0,
        satureated_fat: 0,
        total_fat: 0,
        cholesterol: 0,
        sodium: 0,
        carbohydrate: 0,
        dietary_fiber: 0,
        sugar: 0,
        protein: 0,
        potassium: 0,
    },
    meal_type: 0,
}

export const validateSanitizeAddFoodToDiary = param => {
    const checkGeneralStructure = eq(param, addFoodToDiaryType)
    if (!checkGeneralStructure) return ['Parameter is invalid']

    const nutrients = JSON.parse(param.nutrients)
    const checkNutrientStructure = eq(nutrients, addFoodToDiaryType.nutrients)
    if (!checkNutrientStructure) return ['Nutrient Parameter is invalid']

    const { name, unit, quantity, total_weight, meal_type } = param

    const {
        calories,
        satureated_fat,
        total_fat,
        cholesterol,
        sodium,
        carbohydrate,
        dietary_fiber,
        sugar,
        protein,
        potassium,
    } = nutrients

    if (!name) return ['Food Name must not empty']
    if (!parseInt(quantity) || parseInt(quantity) <= 0)
        return ['Quantity must greater than 0']
    if (!parseInt(total_weight) || parseInt(total_weight) <= 0)
        return ['Total weight must greater than 0']
    if (
        meal_type != MEAL_TYPE.BREAKFAST &&
        meal_type != MEAL_TYPE.LUNCH &&
        meal_type != MEAL_TYPE.DINNER &&
        meal_type != MEAL_TYPE.SNACK
    )
        return ['Invalid meal type']

    return [
        false,
        {
            name,
            unit,
            quantity,
            total_weight,
            nutrients,
            meal_type,
        },
    ]
}

export const validateGetDiaryFood = param => {
    let sanitized = {
        startDate: null,
        endDate: null,
    }
    const { startDate, endDate } = param

    const date_format = 'YYYY-MM-DD'
    const mDate = moment(startDate, date_format, true)
    if (!mDate.isValid())
        return ['Start date format is invalid, must be YYYY-MM-DD']

    sanitized.startDate = new Date(startDate)

    if (endDate) {
        const endmDate = moment(endDate, date_format, true)
        if (!endmDate.isValid())
            return ['End date format is invalid, must be YYYY-MM-DD']

        sanitized.endDate = new Date(endDate)
    }

    return [false, sanitized]
}

const removeFoodFromDiaryType = {
    diary_id: '',
}

export const validateRemoveFoodFromDiary = param => {
    if (!eq(param, removeFoodFromDiaryType)) return ['Parameter is invalid!']

    const { diary_id } = param
    if (!diary_id) return ['diary_id is invalid!']

    return [false, diary_id]
}

const suggestQueryType = {
    cuisine: '',
    keywords: '',
}

export const validateSanitizeQueryType = query => {
    if (!eq(query, suggestQueryType)) return ['Query is invalid']

    const { cuisine, keywords } = query

    let c = parseInt(cuisine) || 0

    if (c <= 0) return ['Cuisine is invalid']
    if (c === CUISINE_TYPE.INDONESIAN) c = 'indonesian'
    else if (c === CUISINE_TYPE.CHINESE) c = 'chinese'
    else if (c === CUISINE_TYPE.WESTERN) c = 'western'
    else return ['Cuisine type is invalid']

    if (!keywords.length) return ['Keywords is invalid']

    const kw = keywords.split(',')

    return [false, { cuisine: c, keywords: kw }]
}

const locationQueryType = {
    lon: 0,
    lat: 0,
}

export const validateSanitizeSuggestFood = location => {
    if (!eq(location, locationQueryType)) return ['Query is invalid']

    const { long, lat } = location

    return [
        false,
        {
            location: {
                long,
                lat,
            },
        },
    ]
}

// Suggest food with menu
const nearbyRestaurantType = {
    lon: 0,
    lat: 0,
    cuisine: 0,
}

export const validateSanitizeLatLong = query => {
    if (!eq(query, nearbyRestaurantType)) return ['Location is invalid']

    return [
        false,
        {
            location: {
                lon: parseFloat(query.lon),
                lat: parseFloat(query.lat),
            },
            cuisine: query.cuisine,
        },
    ]
}

const restaurantIdsType = {
    restaurant_ids: '',
}

export const validateSanitizeRestaurantIds = query => {
    if (!eq(query, restaurantIdsType)) return ['restaurant_ids is required']

    const { restaurant_ids } = query
    if (!restaurant_ids.length) return ['restaurant_ids is invalid']

    let r_ids = []

    try {
        r_ids = restaurant_ids.split(',').map(id => parseInt(id))
    } catch (err) {
        return ['restaurant_ids is invalid']
    }

    return [false, r_ids]
}
