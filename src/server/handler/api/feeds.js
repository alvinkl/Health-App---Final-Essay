import to from '@helper/asyncAwait'

import { responseError, responseJSON } from '@handler/response'
import {
    validateAddFeed,
    validateDeleteFeed,
    validateToggleLike,
    validateAddComment,
} from '@validation/feeds'

import {
    getGeneralFeeds,
    getOneFeed,
    deleteFeed,
    insertNewFeed,
    getLocationName,
    toggleLike,
    addComment,
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

    const [errFeed] = await to(getOneFeed(post_id, googleID))
    if (errFeed) return responseError(res, errFeed.code, errFeed.message)

    const [errDelete, success] = await to(deleteFeed(post_id))
    if (errDelete) return responseError(res, errDelete.code, errDelete.message)

    return responseJSON(res, success)
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

export const handleAddComment = async (req, res) => {
    const { googleID } = req.user

    const [errParam, param] = validateAddComment(req.body)
    if (errParam) return responseError(res, 400, errParam)

    const [errGetFeed, feed] = await to(getOneFeed(param.post_id))
    if (errGetFeed)
        return responseError(res, errGetFeed.code, errGetFeed.message)

    const comment = {
        googleID,
        content: param.content,
    }
    const [errAddComment, newFeed] = await to(addComment(feed, comment))
    if (errAddComment)
        return responseError(res, errAddComment.code, errAddComment.message)

    return responseJSON(res, newFeed)
}
