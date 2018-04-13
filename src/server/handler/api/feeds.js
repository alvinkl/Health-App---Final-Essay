import { responseError, responseJSON } from '@handler/response'
import to from '@helper/asyncAwait'

import { getFeeds, insertNewFeed, getLocationName } from '@functions/feeds'

export const handleGetFeeds = async (req, res) => {
    const [err, data] = await to(getFeeds())

    return responseJSON(res, data)
}

export const handleAddFeed = async (req, res) => {
    const { googleID } = req.user

    const [err, data] = await to(insertNewFeed(googleID, req.body))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}

export const handleGetLocationName = async (req, res) => {
    const { lat, lon } = req.query

    const [err, data] = await to(getLocationName(lat, lon))
    if (err) return responseError(res, err.code, err.message)

    return responseJSON(res, data)
}
