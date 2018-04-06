import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

import { handleGetFeeds, handleAddFeed } from '@server/handler/api/feeds'

export default function(r) {
    r.get(url.getFeeds, handleGetFeeds)
    r.post(url.addFeed, mustAuthenticate, handleAddFeed)
}
