import {
    FETCH_FEEDS,
    FAILED_FETCH_FEEDS,
    FETCHED_FEEDS,
    ADD_FEED,
    FAILED_ADD_FEED,
    FEED_ADDED,
} from '@actions/feeds'

export const initial_state = {
    loading: false,
    error: false,
    feeds: [],

    new_feed: {
        loading: false,
        error: false,
    },
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
        case ADD_FEED:
            return {
                ...state,
                new_feed: {
                    ...state.new_feed,
                    loading: true,
                    error: false,
                },
            }
        case FAILED_ADD_FEED:
            return {
                ...state,
                new_feed: {
                    ...state.new_feed,
                    loading: false,
                    error: true,
                },
            }
        case FEED_ADDED:
            return {
                ...state,
                feeds: [action.feed, ...state.feeds],
            }

        default:
            return state
    }
}
