import {
    FETCH_FEEDS,
    FAILED_FETCH_FEEDS,
    FETCHED_FEEDS,
    FETCHED_FEEDS_IDB,
    ADD_FEED,
    ADD_FEED_SYNCED,
    FAILED_ADD_FEED,
    FEED_ADDED,
    TOGGLE_LIKE_FEED,
    FAILED_TOGGLE_LIKE_FEED,
    FEED_LIKED,
    FEED_UNLIKED,
} from '@actions/feeds'
import { LIKE, UNLIKE } from '@constant'

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
        case FETCHED_FEEDS_IDB:
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
        case ADD_FEED_SYNCED:
            return {
                ...state,
                feeds: [
                    {
                        ...action.sync_feed,
                        post_id: action.sync_feed.id,
                        waiting_for_sync: true,
                    },
                    ...state.feeds,
                ],
            }
        case FEED_LIKED:
            return {
                ...state,
                feeds: state.feeds.reduce((p, c) => {
                    if (c.post_id === action.post_id)
                        return [
                            ...p,
                            {
                                ...c,
                                likes: action.total_likes,
                                status: LIKE,
                            },
                        ]

                    return [...p, c]
                }, []),
            }
        case FEED_UNLIKED:
            return {
                ...state,
                feeds: state.feeds.reduce((p, c) => {
                    if (c.post_id === action.post_id)
                        return [
                            ...p,
                            {
                                ...c,
                                likes: action.total_likes,
                                status: UNLIKE,
                            },
                        ]

                    return [...p, c]
                }, []),
            }
        default:
            return state
    }
}
