import {
    FETCHED_SUGGEST_FOOD,
    FETCHING_SUGGEST,
    FAILED_FETCH_SUGGEST,
    FETCHED_SUGGEST_RESTAURANT,
    FETCHED_RESTAURANT_NEARBY,
    FETCHED_MENUS,
} from '@actions/suggestFood'

export const initial_state = {
    food: {},
    restaurant: [],
    loading: false,
    error: false,

    // food suggest menus
    restaurant_nearby: {},
    cuisines: [],
    menus: [],
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case FETCHING_SUGGEST:
            return {
                ...state,
                loading: true,
            }

        case FAILED_FETCH_SUGGEST:
            return {
                ...state,
                loading: false,
                error: true,
            }

        case FETCHED_SUGGEST_FOOD:
            return {
                ...state,
                food: action.food,
                loading: false,
            }

        case FETCHED_SUGGEST_RESTAURANT:
            return {
                ...state,
                restaurant: action.restaurant,
                loading: false,
            }
        case FETCHED_RESTAURANT_NEARBY:
            return {
                ...state,
                loading: false,
                error: false,
                restaurant_nearby: action.restaurant_nearby,
                cuisines: action.cuisines,
            }
        case FETCHED_MENUS:
            return {
                ...state,
                loading: false,
                error: false,
                menus: action.menus,
            }
        default:
            return state
    }
}
