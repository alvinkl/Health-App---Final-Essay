import { FETCH_USER_DATA, UPDATE_NEW_USER_STATUS } from '@actions/user'

export const initialState = {
    googleID: 0,
    name: '',
    profile_img: '',
    gender: '',
    email: '',
    new: false,

    diet_plan: {
        target_calories: '',
        current_calories: '',
        target_weight: '',
        current_weight: '',
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
        default:
            return state
    }
}
