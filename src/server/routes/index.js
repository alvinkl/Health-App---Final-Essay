import auth from './auth'
import template from './template'

export default function(app) {
    auth(app)
    template(app)
}
