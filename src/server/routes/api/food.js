import { handleGetFood } from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'

export default function(r) {
    r.get('/api/food', mustAuthenticate, handleGetFood)
}
