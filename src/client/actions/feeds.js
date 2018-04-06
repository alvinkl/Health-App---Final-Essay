import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import { getFeeds } from '@urls'

export const FETCH_FEEDS = 'FETCH_FEEDS'
export const FAILED_FETCH_FEEDS = 'FAILED_FETCH_FEEDS'
export const FETCHED_FEEDS = 'FETCHED_FEEDS'

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
