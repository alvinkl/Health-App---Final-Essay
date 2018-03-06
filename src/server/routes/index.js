import auth from './auth'
import template from './template'

import foodAPI from './api/food'

export default app => {
    auth(app)

    foodAPI(app)

    // Template receive * url
    template(app)
}
