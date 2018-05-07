// dietplan
export const insertUpdateGoal = '/api/insertUpdateGoal'
export const updatePlan = '/api/updatePlan'

// food
export const getFood = '/api/food'
export const getFoodDiary = '/api/diary/get'
export const addFoodToDiary = '/api/diary/add'
export const removeFoodFromDiary = '/api/diary/remove'

// Diary Report
export const getDiaryReport = '/api/diary-report/get'

// Suggest Food
export const getSuggestion = '/api/food/suggest'
export const getRestaurantSuggestion = '/api/food/suggestRestaurant'
// export const getFoodByKeywords = '/api/food/getFood'

// Suggest Food with Menu
export const getNearbyRestaurant = '/api/food/getNearbyRestaurant'
export const getMenusFromRestaurant = '/api/food/getMenusFromRestaurant'
export const getRestaurantMapLocation = '/api/food/getRestaurantMapLocation'

// feeds
export const getFeeds = '/api/feeds/get'
export const addFeed = '/api/feeds/add'
export const deleteFeed = '/api/feeds/delete'
export const getLocationName = '/api/feeds/getLocationName'
export const toggleLike = '/api/feeds/toggleLike'
export const getUserLike = '/api/feeds/getUserLike'
export const addComment = '/api/feeds/addComment'

// auth
export const authGoogle = '/auth/google'
export const authLogout = '/auth/logout'
export const getUser = '/auth/current_user'

// post image
export const postImage =
    'https://us-central1-final-essay-dev.cloudfunctions.net/storeImage'
