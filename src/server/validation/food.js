import moment from 'moment'
import eq from '@helper/checkObjectStructure'
import { MEAL_TYPE } from '@types/food'

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
    food_name: '',
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

    const { food_name, quantity, total_weight, meal_type } = param

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

    if (!food_name) return ['Food Name must not empty']
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
            food_name,
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
