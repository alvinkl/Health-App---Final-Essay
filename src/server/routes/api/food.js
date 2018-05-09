import * as h from '@server/handler/api/food'

import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

export default function(r) {
    // Food API
    r.post(url.getFood, mustAuthenticate, h.handleGetFood)

    // Suggest Food
    r.get(url.getSuggestion, mustAuthenticate, h.handleSuggestFood)
    r.get(
        url.getRestaurantSuggestion,
        mustAuthenticate,
        h.handleSuggestRestaurant
    )

    // Sugget Food with Menu
    r.get(
        url.getNearbyRestaurant,
        mustAuthenticate,
        h.handleGetNearbyRestaurant
    )
    r.get(
        url.getMenusFromRestaurant,
        mustAuthenticate,
        h.handleGetMenusFromRestaurant
    )

    // r.get(url.getFoodByKeywords, mustAuthenticate, h.handleSuggestFood)

    // Food Diary
    r.get(url.getFoodDiary, mustAuthenticate, h.handleGetDiaryFood)
    r.get(url.getTodayCalories, mustAuthenticate, h.handleGetDailyCalories)
    r.post(url.addFoodToDiary, mustAuthenticate, h.handleAddFoodToDiary)
    r.post(
        url.removeFoodFromDiary,
        mustAuthenticate,
        h.handleRemoveFoodFromDiary
    )

    // Food Report
    r.get(url.getDiaryReport, mustAuthenticate, h.handleGetDiaryReport)

    r.get(
        url.getRestaurantMapLocation,
        mustAuthenticate,
        h.handleGetRestaurantMapLocation
    )
}
