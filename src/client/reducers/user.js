import { FETCH_USER_DATA } from '@actions/user'

export const initialState = {
    user: {},
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
