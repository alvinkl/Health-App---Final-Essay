import {
    INSERT_WORKOUT,
    FAIL_INSERT_WORKOUT,
    WORKOUT_INSERTED,
    FETCH_WORKOUT_INFO,
    FAIL_FETCH_WORKOUT_INFO,
    WORKOUT_INFO_FETCHED,
    FETCH_WORKOUT_DIARY,
    FAIL_FETCH_WORKOUT_DIARY,
    WORKOUT_DIARY_FETCHED,
    FETCH_WORKOUT_REPORT,
    FAIL_FETCH_WORKOUT_REPORT,
    WORKOUT_REPORT_FETCHED,
} from '@actions/workout'

export const initial_state = {
    workout_diary: [],
    workout_info: [],
    workout_report: {},

    loading: false,
    error: false,
}

export default function(state = initial_state, action) {
    switch (action.type) {
        case INSERT_WORKOUT:
            return {
                ...state,
                loading: true,
                error: false,
            }
        case FAIL_INSERT_WORKOUT:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case WORKOUT_INSERTED:
            return {
                ...state,
                loading: false,
                error: false,
            }

        case FETCH_WORKOUT_INFO:
            return {
                ...state,
                loading: true,
                error: false,
            }
        case FAIL_FETCH_WORKOUT_INFO:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case WORKOUT_INFO_FETCHED:
            return {
                ...state,
                loading: false,
                error: false,
                workout_info: action.workout_info,
            }

        case FETCH_WORKOUT_DIARY:
            return {
                ...state,
                loading: true,
                error: false,
            }
        case FAIL_FETCH_WORKOUT_DIARY:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case WORKOUT_DIARY_FETCHED:
            return {
                ...state,
                loading: false,
                error: false,
                workout_diary: action.workout_diary,
            }
        case FETCH_WORKOUT_REPORT:
            return {
                ...state,
                loading: true,
                error: false,
            }
        case FAIL_FETCH_WORKOUT_REPORT:
            return {
                ...state,
                loading: false,
                error: true,
            }
        case WORKOUT_REPORT_FETCHED:
            return {
                ...state,
                loading: false,
                error: false,
                workout_report: action.report,
            }
        default:
            return state
    }
}
