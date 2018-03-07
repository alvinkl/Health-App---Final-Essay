import { handleGetFood } from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'

export default function(r) {
    r.post('/api/food', mustAuthenticate, handleGetFood)
}
