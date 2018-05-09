import {
    INSERT_WORKOUT,
    FAIL_INSERT_WORKOUT,
    WORKOUT_INSERTED,
    FETCH_WORKOUT_INFO,
    FAIL_FETCH_WORKOUT_INFO,
    WORKOUT_INFO_FETCHED,
} from '@actions/workout'

export const initial_state = {
    workout_log: [],
    workout_info: [],

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
                workout_log: [action.workout, ...state.workout_log],
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
        default:
            return state
    }
}
