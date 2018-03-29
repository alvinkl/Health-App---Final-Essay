import { FETCH_DIARY } from '@actions/diary'

export const initial_state = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case FETCH_DIARY:
            return {
                ...state,
                ...action.diary,
            }
        default:
            return state
    }
}
