import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

import {
    handleGetFeeds,
    handleAddFeed,
    handleToggleLike,
    handleGetLocationName,
} from '@server/handler/api/feeds'

export default function(r) {
    r.get(url.getFeeds, handleGetFeeds)

    r.get(url.getLocationName, handleGetLocationName)

    r.post(url.addFeed, mustAuthenticate, handleAddFeed)
    r.post(url.toggleLike, mustAuthenticate, handleToggleLike)
}
