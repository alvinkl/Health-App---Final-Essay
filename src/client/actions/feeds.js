import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import { getFeeds, addFeed, toggleLike as toggleLikeURL } from '@urls'
import { LIKE, UNLIKE } from '@constant'

export const FETCH_FEEDS = 'FETCH_FEEDS'
export const FAILED_FETCH_FEEDS = 'FAILED_FETCH_FEEDS'
export const FETCHED_FEEDS = 'FETCHED_FEEDS'
export const ADD_FEED = 'ADD_FEED'
export const FAILED_ADD_FEED = 'FAILED_ADD_FEED'
export const FEED_ADDED = 'FEED_ADDED'
export const TOGGLE_LIKE_FEED = 'TOGGLE_LIKE_FEED'
export const FAILED_TOGGLE_LIKE_FEED = 'FAILED_TOGGLE_LIKE_FEED'
export const FEED_LIKED = 'FEED_LIKED'
export const FEED_UNLIKED = 'FEED_UNLIKED'

export const fetchFeed = (page = 1) => async dispatch => {
    dispatch({ type: FETCH_FEEDS })

    const query = qs({
        page,
    })

    const [err, res] = await to(
        fetch(getFeeds + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )

    if (err) return dispatch({ type: FAILED_FETCH_FEEDS })

    const feeds = await res.json()

    return dispatch({
        type: FETCHED_FEEDS,
        feeds,
    })
}

export const addFeedData = ({
    title,
    subtitle,
    image,
    location,
    address,
}) => async dispatch => {
    dispatch({ type: ADD_FEED })

    const url = addFeed
    const post_data = {
        title,
        subtitle,
        image,
        location: JSON.stringify(location),
        address,
    }

    const [err, res] = await to(
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(post_data),
        })
    )
    if (err) return dispatch({ type: FAILED_ADD_FEED })

    const feed = await res.json()

    return dispatch({ type: FEED_ADDED, feed })
}

export const toggleLike = post_id => async dispatch => {
    dispatch({ type: TOGGLE_LIKE_FEED })

    const url = toggleLikeURL
    const data = {
        post_id,
    }

    const [err, res] = await to(
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(data),
        })
    )
    if (err) return dispatch({ type: FAILED_TOGGLE_LIKE_FEED })

    const { total_likes, status } = await res.json()
    if (status === LIKE)
        return dispatch({
            type: FEED_LIKED,
            post_id,
            total_likes,
        })
    else if (status === UNLIKE)
        return dispatch({
            type: FEED_UNLIKED,
            post_id,
            total_likes,
        })
}
