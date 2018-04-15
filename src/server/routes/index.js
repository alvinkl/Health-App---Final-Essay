import auth from './auth'
import template from './template'

import foodAPI from './api/food'
import dietplanAPI from './api/dietplan'
import feedsAPI from './api/feeds'

export default app => {
    foodAPI(app)
    dietplanAPI(app)
    feedsAPI(app)

    auth(app)
    // Template receive * url
    template(app)
}
