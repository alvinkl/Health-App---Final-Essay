import { FETCH_USER_DATA } from '@actions/user'

export const initialState = {
    user: {
        user_id: 0,
        user_name: '',
        profile_img: '',

        dietary_plan: {
            target_calories: '',
            current_calories: '',
            target_weight: '',
            current_weight: '',
        },
    },
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_DATA:
            return {
                ...state,
                user: action.user,
            }
        default:
            return state
    }
}
