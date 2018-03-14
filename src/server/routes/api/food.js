import { handleGetFood, handleAddFoodToDiary } from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'

export default function(r) {
    r.post('/api/food', mustAuthenticate, handleGetFood)

    r.post('/api/addFoodToDiary', mustAuthenticate, handleAddFoodToDiary)
}
