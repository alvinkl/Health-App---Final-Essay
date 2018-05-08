import {
    FETCHED_DIARY,
    FETCHED_DIARY_REPORT,
    FETCHED_DIARY_IDB,
    REMOVING_DIARY,
    FAILED_REMOVING_DIARY,
    DIARY_REMOVED,
    DAILY_CALORIES_FETCHED,
} from '@actions/diary'

export const initial_state = {
    today_diary: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    },

    report: {},
    today_total_calories: 0,
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
        case DIARY_REMOVED: {
            const current_diary = state.today_diary[action.meal_type]
            const remove_index = current_diary.findIndex(
                d => d._id === action.diary_id
            )

            return {
                ...state,
                today_diary: {
                    ...state.today_diary,
                    [action.meal_type]: [
                        ...current_diary.slice(0, remove_index),
                        ...current_diary.slice(remove_index + 1),
                    ],
                },
            }
        }
        case DAILY_CALORIES_FETCHED:
            return {
                ...state,
                today_total_calories: action.total_calories,
            }
        default:
            return state
    }
}
