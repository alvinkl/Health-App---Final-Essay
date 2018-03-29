import { FETCHED_DIARY, FETCHED_DIARY_REPORT } from '@actions/diary'

export const initial_state = {
    today_diary: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    },

    report: {},
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case FETCHED_DIARY:
            return {
                ...state,
                today_diary: action.diary,
            }

        case FETCHED_DIARY_REPORT:
            return {
                ...state,
                report: action.report,
            }

        default:
            return state
    }
}
