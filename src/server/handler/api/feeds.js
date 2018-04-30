import to from '@helper/asyncAwait'

import { responseError, responseJSON } from '@handler/response'
import {
    validateAddFeed,
    validateDeleteFeed,
    validateToggleLike,
} from '@validation/feeds'

import {
    getGeneralFeeds,
    getOneFeed,
    deleteFeed,
    insertNewFeed,
    getLocationName,
    toggleLike,
} from '@functions/feeds'

export const handleGetFeeds = async (req, res) => {
    const { googleID } = req.user

    const [err, data] = await to(getGeneralFeeds(googleID))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleAddFeed = async (req, res) => {
    const { googleID } = req.user
    const [errParam, param] = validateAddFeed(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, data] = await to(insertNewFeed(googleID, param))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleDeleteFeed = async (req, res) => {
    const { googleID } = req.user

    const [errParam, post_id] = validateDeleteFeed(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [errFeed, feed] = await to(getOneFeed(googleID, post_id))
    if (errFeed) return responseError(res, errFeed.code, errFeed.message)

    if (!feed) return responseError(res, 400, 'Feed not found!')

    const [errDelete] = await to(deleteFeed(post_id))
    if (errDelete) return responseError(res, errDelete.code, errDelete.message)

    return responseJSON(res)
}

export const handleToggleLike = async (req, res) => {
    const { googleID } = req.user
    const [errParam, post_id] = validateToggleLike(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [err, data] = await to(toggleLike(googleID, post_id))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleGetLocationName = async (req, res) => {
    const { lat, lon } = req.query

    const [err, data] = await to(getLocationName(lat, lon))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}
