import {
    handleGetFood,
    handleAddFoodToDiary,
    handleGetDiaryFood,
} from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'

export default function(r) {
    // Food API
    r.post('/api/food', mustAuthenticate, handleGetFood)

    // Food Diary
    r.get('/api/getFoodDiary', mustAuthenticate, handleGetDiaryFood)
    r.post('/api/addFoodToDiary', mustAuthenticate, handleAddFoodToDiary)
}
