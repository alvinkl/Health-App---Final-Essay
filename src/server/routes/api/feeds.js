import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

import {
    handleGetFeeds,
    handleGetPersonalFeeds,
    handleAddFeed,
    handleDeleteFeed,
    handleToggleLike,
    handleGetLocationName,
    handleAddComment,
} from '@server/handler/api/feeds'

export default function(r) {
    r.get(url.getFeeds, handleGetFeeds)
    r.get(url.getPersonalFeeds, handleGetPersonalFeeds)

    r.get(url.getLocationName, handleGetLocationName)

    r.post(url.addFeed, mustAuthenticate, handleAddFeed)
    r.post(url.deleteFeed, mustAuthenticate, handleDeleteFeed)
    r.post(url.toggleLike, mustAuthenticate, handleToggleLike)
    r.post(url.addComment, mustAuthenticate, handleAddComment)
}
