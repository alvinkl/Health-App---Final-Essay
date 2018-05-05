import {
    FETCHED_DIARY,
    FETCHED_DIARY_REPORT,
    FETCHED_DIARY_IDB,
} from '@actions/diary'

export const initial_state = {
    today_diary: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    },

    report: {},
    today_total_calories: '0',
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case FETCHED_DIARY:
        case FETCHED_DIARY_IDB:
            return {
                ...state,
                today_diary: action.diary || state.today_diary,
            }

        case FETCHED_DIARY_REPORT:
            return {
                ...state,
                report: action.report,
                today_total_calories: action.today_total_calories,
            }

        default:
            return state
    }
}
