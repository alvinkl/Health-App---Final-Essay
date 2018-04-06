import { FETCH_FEEDS, FAILED_FETCH_FEEDS, FETCHED_FEEDS } from '@actions/feeds'

export const initial_state = {
    loading: false,
    error: false,
    feeds: [],
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case FETCH_FEEDS:
            return {
                ...state,
                loading: true,
                error: false,
            }

        case FAILED_FETCH_FEEDS:
            return {
                ...state,
                loading: false,
                error: true,
            }

        case FETCHED_FEEDS:
            return {
                ...state,
                loading: false,
                error: false,
                feeds: action.feeds,
            }

        default:
            return state
    }
}
