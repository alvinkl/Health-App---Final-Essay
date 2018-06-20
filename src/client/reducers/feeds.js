import {
    FETCH_FEEDS,
    FAILED_FETCH_FEEDS,
    FETCHED_FEEDS,
    FETCHED_PERSONAL_FEEDS,
    FETCHED_SINGLE_FEED,
    FETCHED_FEEDS_IDB,
    ADD_FEED,
    ADD_FEED_SYNCED,
    FAILED_ADD_FEED,
    FEED_ADDED,
    TOGGLE_LIKE_FEED,
    FAILED_TOGGLE_LIKE_FEED,
    FEED_LIKED,
    FEED_UNLIKED,
    FEED_SYNC_DELETED,
    GETTING_FEED_FROM_STORE,
    RECEIVED_FEED_FROM_STORE,
    REMOVE_CURRENT_FEED,
    COMMENT_ADDED,
    LAZY_FETCH_FEEDS,
    LAZY_FETCHED_FEEDS,
    FAILED_LAZY_FETCH_FEEDS,
    NO_NEXT_LAZY_DATA,
} from '@actions/feeds'
import { LIKE, UNLIKE } from '@constant'

export const initial_state = {
    loading: false,
    lazy_loading: false,
    error: false,
    feeds: [],
    page: 1,
    has_next: true,

    current_feed: {},

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
                page: action.page,
            }
        case FETCHED_PERSONAL_FEEDS:
            return {
                ...state,
                loading: false,
                error: false,
                personal_feeds: action.personal_feeds,
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
                                total_likes: action.total_likes,
                                like_status: LIKE,
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
                                total_likes: action.total_likes,
                                like_status: UNLIKE,
                            },
                        ]

                    return [...p, c]
                }, []),
            }
        case FEED_SYNC_DELETED: {
            const { feeds } = state
            let index = 0

            for (let feed of feeds) {
                if (feed.post_id === action.post_id) break
                index++
            }

            if (index <= feeds.length)
                return {
                    ...state,
                    feeds: [
                        ...feeds.slice(0, index),
                        ...feeds.slice(index + 1),
                    ],
                }

            return {
                ...state,
                feeds,
            }
        }
        case GETTING_FEED_FROM_STORE:
            return {
                ...state,
                loading: true,
            }
        case RECEIVED_FEED_FROM_STORE:
            return {
                ...state,
                loading: false,
                current_feed: action.current_feed,
            }
        case REMOVE_CURRENT_FEED:
            return {
                ...state,
                loading: true,
                current_feed: {},
            }
        case FETCHED_SINGLE_FEED:
            return {
                ...state,
                loading: false,
                current_feed: action.current_feed,
            }
        case COMMENT_ADDED:
            return {
                ...state,
                loading: false,
                current_feed: action.feed,
            }
        case LAZY_FETCH_FEEDS:
            return {
                ...state,
                lazy_loading: true,
            }
        case FAILED_LAZY_FETCH_FEEDS:
            return {
                ...state,
                lazy_loading: false,
            }
        case LAZY_FETCHED_FEEDS:
            return {
                ...state,
                lazy_loading: false,
                feeds: [...state.feeds, ...action.feeds],
                page: action.page,
            }
        case NO_NEXT_LAZY_DATA:
            return {
                ...state,
                lazy_loading: false,
                has_next: false,
            }
        default:
            return state
    }
}
