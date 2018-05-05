import {
    FETCH_USER_DATA,
    UPDATE_NEW_USER_STATUS,
    SUBMIT_DIET_PLAN,
    FAIL_SUBMIT_DIET_PLAN,
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
                new: false,
                diet_plan: {
                    ...state.diet_plan,
                    ...action.diet_plan,
                    success: true,
                },
            }
        case FAIL_SUBMIT_DIET_PLAN:
            return {
                ...state,
                diet_plan: {
                    ...state.diet_plan,
                    success: false,
                },
            }
        default:
            return state
    }
}
