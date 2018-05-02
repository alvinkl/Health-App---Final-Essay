import { isEmpty } from 'lodash'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import { backgroundSync } from '@helper/backgroundSyncing'
import {
    getFeeds,
    getPersonalFeeds as getPersonalFeedsURL,
    addFeed,
    toggleLike as toggleLikeURL,
    postImage,
    deleteFeed as deleteFeedURL,
    addComment as addCommentURL,
} from '@urls'
import { LIKE, UNLIKE } from '@constant'
import {
    readAllData,
    writeData,
    clearAllData,
    deleteItemFromData,
} from '@helper/indexedDB-utilities'

import { showSnackbar } from './common'

export const FETCH_FEEDS = 'FETCH_FEEDS'
export const FETCH_PERSONAL_FEEDS = 'FETCH_PERSONAL_FEEDS'
export const FAILED_FETCH_FEEDS = 'FAILED_FETCH_FEEDS'
export const FAILED_FETCH_PERSONAL_FEEDS = 'FAILED_FETCH_PERSONAL_FEEDS'
export const FAILED_FETCH_SINGLE_FEED = 'FAILED_FETCH_SINGLE_FEED'
export const FETCHED_FEEDS = 'FETCHED_FEEDS'
export const FETCHED_PERSONAL_FEEDS = 'FETCHED_PERSONAL_FEEDS'
export const FETCHED_SINGLE_FEED = 'FETCHED_SINGLE_FEED'
export const FETCHED_FEEDS_IDB = 'FETCHED_FEEDS_IDB'
export const ADD_FEED = 'ADD_FEED'
export const FAILED_ADD_FEED = 'FAILED_ADD_FEED'
export const DELETE_FEED = 'DELETE_FEED'
export const DELETE_SYNC_FEED = 'DELETE_SYNC_FEED'
export const FAILED_DELETE_FEED = 'FAILED_DELETE_FEED'
export const FAILED_DELETE_SYNC_FEED = 'FAILED_DELETE_SYNC_FEED'
export const ADD_FEED_SYNCED = 'ADD_FEED_SYNCED'
export const FEED_ADDED = 'FEED_ADDED'
export const FEED_DELETED = 'FEED_DELETED'
export const FEED_SYNC_DELETED = 'FEED_SYNC_DELETED'
export const TOGGLE_LIKE_FEED = 'TOGGLE_LIKE_FEED'
export const FAILED_TOGGLE_LIKE_FEED = 'FAILED_TOGGLE_LIKE_FEED'
export const FEED_LIKED = 'FEED_LIKED'
export const FEED_UNLIKED = 'FEED_UNLIKED'
export const GETTING_FEED_FROM_STORE = 'GETTING_FEED_FROM_STORE'
export const RECEIVED_FEED_FROM_STORE = 'RECEIVED_FEED_FROM_STORE'
export const REMOVE_CURRENT_FEED = 'REMOVE_CURRENT_FEED'
export const ADD_COMMENT = 'ADD_COMMENT'
export const FAILED_ADD_COMMENT = 'FAILED_ADD_COMMENT'
export const COMMENT_ADDED = 'COMMENT_ADDED'

export const fetchFeed = (page = 1) => async dispatch => {
    dispatch({ type: FETCH_FEEDS })

    const query = qs({
        page,
    })

    // offline feeds not yet posted
    const urlCreator = window.URL || window.webkitURL
    let idb_offline_feeds = await readAllData('sync-feeds')
    idb_offline_feeds = idb_offline_feeds.map(dt => ({
        post_id: dt.id,
        waiting_for_sync: true,
        image: urlCreator.createObjectURL(dt.picture.picture_blob),
        ...dt,
    }))

    // fetch from indexedDB if any
    const idb_feeds = await readAllData('feeds')
    dispatch({
        type: FETCHED_FEEDS_IDB,
        feeds: [...idb_offline_feeds, ...idb_feeds],
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

    // Update idb - add index to post_id to sort the data from IDB
    clearAllData('feeds')
    feeds.map((feed, index) =>
        writeData('feeds', {
            ...feed,
            id: index + feed.post_id,
        })
    )

    return dispatch({
        type: FETCHED_FEEDS,
        feeds: [...idb_offline_feeds, ...feeds],
    })
}

export const getFeedFromStore = post_id => async (dispatch, getState) => {
    dispatch({ type: GETTING_FEED_FROM_STORE })
    const { current_feed, feeds } = getState().feeds

    if (!isEmpty(current_feed)) dispatch({ type: REMOVE_CURRENT_FEED })

    let curr_feed = feeds.filter(f => f.post_id === post_id)

    if (!isEmpty(curr_feed))
        return dispatch({
            type: RECEIVED_FEED_FROM_STORE,
            current_feed: curr_feed[0],
        })

    // fetch single feed
    const query = qs({
        post_id,
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
    if (err) return dispatch({ type: FAILED_FETCH_SINGLE_FEED })

    const feed = await res.json()

    return dispatch({ type: FETCHED_SINGLE_FEED, current_feed: feed })
}

export const getPersonalFeeds = ({ user_id }) => async dispatch => {
    dispatch({ type: FETCH_PERSONAL_FEEDS })

    let query = ''

    // offline feeds not yet posted only show for my feed
    let idb_offline_feeds = []
    if (!user_id) {
        const urlCreator = window.URL || window.webkitURL
        idb_offline_feeds = await readAllData('sync-feeds')
        idb_offline_feeds = idb_offline_feeds.map(dt => ({
            post_id: dt.id,
            waiting_for_sync: true,
            image: urlCreator.createObjectURL(dt.picture.picture_blob),
            ...dt,
        }))
    }

    // fetch from indexedDB if any
    // const idb_feeds = await readAllData('feeds')
    // dispatch({
    //     type: FETCHED_FEEDS_IDB,
    //     feeds: [...idb_offline_feeds, ...idb_feeds],
    // })

    const [err, res] = await to(
        fetch(getPersonalFeedsURL + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAILED_FETCH_PERSONAL_FEEDS })

    const personal_feeds = await res.json()

    // Update idb - add index to post_id to sort the data from IDB
    // clearAllData('feeds')
    // feeds.map((feed, index) =>
    //     writeData('feeds', {
    //         ...feed,
    //         id: index + feed.post_id,
    //     })
    // )

    return dispatch({
        type: FETCHED_PERSONAL_FEEDS,
        personal_feeds: {
            ...personal_feeds,
            feeds: [...idb_offline_feeds, ...personal_feeds.feeds],
        },
    })
}

export const addFeedData = ({
    title,
    subtitle,
    location,
    address = '',
    picture: { picture_name, picture_blob },
    picture,
}) => async dispatch => {
    dispatch({ type: ADD_FEED })

    let postImageData = new FormData()
    postImageData.append('file', picture_blob, picture_name)

    const post_data_feed = {
        title,
        subtitle,
        location: JSON.stringify(location),
        address,
    }

    const [errImg, resImg] = await to(
        fetch(postImage, { method: 'POST', body: postImageData })
    )
    if (!errImg) {
        const { image } = await resImg.json()

        const post_data = {
            image,
            ...post_data_feed,
        }

        const [err, res] = await to(
            fetch(addFeed, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify(post_data),
            })
        )
        if (!err) {
            const feed = await res.json()

            dispatch(showSnackbar('Added New Feed!'))
            return dispatch({ type: FEED_ADDED, feed })
        }
    }
    // Fallback to background sync
    let sync_feed = {
        id: new Date().toISOString(),
        picture,
        own_feed: true,
        ...post_data_feed,
    }
    const [errSync, syncMessage] = await to(
        backgroundSync('sync-feeds', sync_feed)
    )
    if (errSync) {
        dispatch(showSnackbar(errSync))
        return dispatch({ type: FAILED_ADD_FEED })
    }

    const urlCreator = window.URL || window.webkitURL
    sync_feed = {
        ...sync_feed,
        image: urlCreator.createObjectURL(sync_feed.picture.picture_blob),
    }

    dispatch(showSnackbar(syncMessage.message))
    return dispatch({ type: ADD_FEED_SYNCED, sync_feed })
}

export const deleteFeed = post_id => async dispatch => {
    dispatch({ type: DELETE_FEED })

    const url = deleteFeedURL
    const [err] = await to(
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ post_id }),
        })
    )

    if (err) {
        dispatch(showSnackbar(err))
        return dispatch({ type: FAILED_DELETE_FEED })
    }

    dispatch(showSnackbar('Successfully delete the feed!'))
    dispatch(fetchFeed())
    return dispatch({ type: FEED_DELETED, post_id })
}

export const deleteSyncFeed = post_id => async dispatch => {
    dispatch({ type: DELETE_SYNC_FEED })

    deleteItemFromData('sync-feeds', post_id)

    dispatch(showSnackbar('Feed deleted!'))
    return dispatch({ type: FEED_SYNC_DELETED, post_id })
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

    const { total_likes, like_status } = await res.json()
    if (like_status === LIKE)
        return dispatch({
            type: FEED_LIKED,
            post_id,
            total_likes,
        })
    else if (like_status === UNLIKE)
        return dispatch({
            type: FEED_UNLIKED,
            post_id,
            total_likes,
        })
}

export const addComment = ({ post_id, comment }) => async dispatch => {
    dispatch({ type: ADD_COMMENT })

    const data = {
        post_id,
        content: comment,
    }
    const [err, res] = await to(
        fetch(addCommentURL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(data),
        })
    )

    if (err) {
        dispatch(showSnackbar(err))
        return dispatch({ type: FAILED_ADD_COMMENT })
    }

    const feed = await res.json()

    dispatch(showSnackbar('Comment Added!'))
    return dispatch({ type: COMMENT_ADDED, feed })
}
