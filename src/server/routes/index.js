import auth from './auth'
import template from './template'

import foodAPI from './api/food'
import dietplanAPI from './api/dietplan'
import feedsAPI from './api/feeds'
import workoutAPI from './api/workout'

import webpush from '@services/webpush'

export default app => {
    foodAPI(app)
    dietplanAPI(app)
    feedsAPI(app)
    workoutAPI(app)

    auth(app)
    webpush(app)

    // Template receive * url
    template(app)
}
