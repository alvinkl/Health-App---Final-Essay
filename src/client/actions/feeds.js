import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import { getFeeds, addFeed } from '@urls'

export const FETCH_FEEDS = 'FETCH_FEEDS'
export const FAILED_FETCH_FEEDS = 'FAILED_FETCH_FEEDS'
export const FETCHED_FEEDS = 'FETCHED_FEEDS'
export const ADD_FEED = 'ADD_FEED'
export const FAILED_ADD_FEED = 'FAILED_ADD_FEED'
export const FEED_ADDED = 'FEED_ADDED'

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
