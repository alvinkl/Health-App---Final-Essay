import {
    FETCHED_SUGGEST_FOOD,
    FETCHING_SUGGEST,
    FAILED_FETCH_SUGGEST,
    FETCHED_SUGGEST_RESTAURANT,
} from '@actions/suggestFood'

export const initial_state = {
    food: {},
    restaurant: [],
    loading: false,
    error: false,
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
        default:
            return state
    }
}
