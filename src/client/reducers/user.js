import {
    FETCH_USER_DATA,
    UPDATE_NEW_USER_STATUS,
    SUBMIT_DIET_PLAN,
    FAIL_SUBMIT_DIET_PLAN,
    LOGOUT,
    TARGET_CALORIES_UPDATED,
    TARGET_WEIGHT_UPDATED,
    CURRENT_WEIGHT_UPDATED,
} from '@actions/user'

export const initialState = {
    googleID: '',
    name: '',
    profile_img: '',
    gender: '',
    email: '',
    new: false,

    diet_plan: {
        goal: 0,
        gender: 0,
        current_weight: {
            value: 0,
            tp: 1,
        },
        current_height: {
            value: 0,
            tp: 1,
        },
        target_weight: {
            value: 0,
            tp: 1,
        },
        target_calories: 0,
        activity: 0,
        dateBirth: null,

        success: false,
    },
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_DATA:
            return {
                ...state,
                ...action.user,
            }
        case UPDATE_NEW_USER_STATUS:
            return {
                ...state,
                new: false,
            }
        case SUBMIT_DIET_PLAN:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    ...action.diet_plan,
                    success: true,
                },
                new: false,
            }
        case FAIL_SUBMIT_DIET_PLAN:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    success: false,
                },
            }
        case LOGOUT:
            return {}
        case TARGET_CALORIES_UPDATED:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    target_calories: action.target_calories,
                },
            }
        case TARGET_WEIGHT_UPDATED:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    target_weight: {
                        ...state.target_weight,
                        value: action.value,
                    },
                },
            }
        case CURRENT_WEIGHT_UPDATED:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    current_weight: {
                        ...state.current_weight,
                        value: action.value,
                    },
                },
            }
        default:
            return state
    }
}
