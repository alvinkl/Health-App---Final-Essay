console.log(process.env.NODE_ENV)
// if (process.env.NODE_ENV === 'development') {
module.exports = require('./keys-development').default
// } else {
//     module.exports = {
//         cookieKey: process.env.COOKIE_KEY,
//         mongoURI: process.env.MONGO_URI,
//         GoogleClientID: process.env.GOOGLE_CLIENT_ID,
//         GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         NutritionXAppID: process.env.NUTRITIONX_APP_ID,
//         NutritionXAppKeys: process.env.NUTRITIONX_APP_KEYS,
//         GoogleAPIKey: process.env.GOOGLE_API_KEY,
//         GoogleGeocodingAPIKey: process.env.GOOGLE_GEOCODING_API_KEY,
//         ZomatoAPIKey: process.env.ZOMATO_API_KEY,
//         VapidPrivateKeys: process.env.VAPID_PRIVATE_KEYS,
//         VapidPublicKeys: process.env.VAPID_PUBLIC_KEYS,
//         credentials: {
//             email: process.env.CREDENTIALS_EMAIL,
//         },
//     }
// }
