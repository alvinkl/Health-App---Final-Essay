import auth from './auth'
import template from './template'

import foodAPI from './api/food'
import dietplanAPI from './api/dietplan'

export default app => {
    auth(app)

    foodAPI(app)
    dietplanAPI(app)

    // Template receive * url
    template(app)
}
