import {
    FETCH_FEEDS,
    FAILED_FETCH_FEEDS,
    FETCHED_FEEDS,
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
} from '@actions/feeds'
import { LIKE, UNLIKE } from '@constant'

export const initial_state = {
    loading: false,
    error: false,
    feeds: [],

    current_feed: {},
    personal_feeds: {
        user_id: '5ab0f03454dfa62c81d6642f',
        username: 'Alvin Kristanto',
        avatar:
            'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
        feeds: [
            {
                post_id: '5ae91d7f4dfb9ebb57955904',
                title: 'test comment',
                subtitle: 'test comment',
                image:
                    'https://firebasestorage.googleapis.com/v0/b/final-essay-dev.appspot.com/o/1525226877-105695347333761287865.png?alt=media&token=766c4c51-4aae-47bb-ae4d-acb210d4bc1f',
                likes: [
                    {
                        _id: '105695347333761287865',
                        username: 'Alvin Kristanto',
                        avatar:
                            'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                    },
                ],
                total_likes: 1,
                comments: [
                    {
                        content:
                            '&lt;script src=&quot;asdasd&quot;&gt;var x = 5&lt;/script&gt;',
                        user: {
                            _id: '105695347333761287865',
                            username: 'Alvin Kristanto',
                            avatar:
                                'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                        },
                        create_time: '2018-05-02T09:07:22.601Z',
                    },
                    {
                        content: 'Nice Photo mate!',
                        user: {
                            _id: '105695347333761287865',
                            username: 'Alvin Kristanto',
                            avatar:
                                'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                        },
                        create_time: '2018-05-02T06:29:27.308Z',
                    },
                    {
                        content: 'Great photo!',
                        user: {
                            _id: '105695347333761287865',
                            username: 'Alvin Kristanto',
                            avatar:
                                'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                        },
                        create_time: '2018-05-02T06:33:30.831Z',
                    },
                    {
                        content: 'cool photo!',
                        user: {
                            _id: '105695347333761287865',
                            username: 'Alvin Kristanto',
                            avatar:
                                'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                        },
                        create_time: '2018-05-02T06:34:25.741Z',
                    },
                ],
                like_status: 1,
                own_feed: true,
                user: {
                    _id: '105695347333761287865',
                    username: 'Alvin Kristanto',
                    avatar:
                        'https://lh5.googleusercontent.com/-400_gowIAMo/AAAAAAAAAAI/AAAAAAAAHWw/4O3N-a2P8Xw/photo.jpg?sz=50',
                },
                create_time: '7 hours ago',
            },
        ],
    },

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
        default:
            return state
    }
}
