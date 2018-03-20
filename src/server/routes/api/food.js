import {
    handleGetFood,
    handleAddFoodToDiary,
    handleGetDiaryFood,
} from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

export default function(r) {
    // Food API
    r.post(url.getFood, mustAuthenticate, handleGetFood)

    // Food Diary
    r.get(url.getFoodDiary, mustAuthenticate, handleGetDiaryFood)
    r.post(url.addFoodToDiary, mustAuthenticate, handleAddFoodToDiary)
}
