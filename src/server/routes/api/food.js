import {
    handleGetFood,
    handleAddFoodToDiary,
    handleGetDiaryFood,
    handleSuggestFood,
    handleSuggestRestaurant,
    handleGetDiaryReport,
    handleGetNearbyRestaurant,
} from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

export default function(r) {
    // Food API
    r.post(url.getFood, mustAuthenticate, handleGetFood)

    // Suggest Food
    r.get(url.getSuggestion, mustAuthenticate, handleSuggestFood)
    r.get(
        url.getRestaurantSuggestion,
        mustAuthenticate,
        handleSuggestRestaurant
    )

    // Sugget Food with Menu
    r.get(url.getNearbyRestaurant, mustAuthenticate, handleGetNearbyRestaurant)

    // r.get(url.getFoodByKeywords, mustAuthenticate, handleSuggestFood)

    // Food Diary
    r.get(url.getFoodDiary, mustAuthenticate, handleGetDiaryFood)
    r.post(url.addFoodToDiary, mustAuthenticate, handleAddFoodToDiary)

    // Food Report
    r.get(url.getDiaryReport, mustAuthenticate, handleGetDiaryReport)
}
