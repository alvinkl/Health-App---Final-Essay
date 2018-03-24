const path = require('path')
const fs = require('fs')
const m = require('mongoose')
const { mongoURI } = require('../src/server/config/keys')

m
    .connect(mongoURI)
    .then(() => console.log('Succeed to connect to db'))
    .catch(err => console.log('Failed to connect to db - ', err))

const nutritionSchema = m.Schema({
    calories: {
        type: Number,
        default: 0,
    },
    satureated_fat: {
        type: Number,
        default: 0,
    },
    total_fat: {
        type: Number,
        default: 0,
    },
    cholesterol: {
        type: Number,
        default: 0,
    },
    sodium: {
        type: Number,
        default: 0,
    },
    carbohydrate: {
        type: Number,
        default: 0,
    },
    dietary_fiber: {
        type: Number,
        default: 0,
    },
    sugar: {
        type: Number,
        default: 0,
    },
    protein: {
        type: Number,
        default: 0,
    },
    potassium: {
        type: Number,
        default: 0,
    },
})

const foodSuggestSchema = m.Schema({
    keywords: {
        type: Array,
        required: true,
        index: true,
    },

    cuisine: {
        type: String,
        required: true,
        index: true,
    },

    food_name: {
        type: String,
        required: true,
    },
    nutrition: nutritionSchema,

    create_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

const FoodSuggest = m.model('foodsuggest', foodSuggestSchema)

const seed = path.resolve(__dirname, '..', 'seed') + '/'

let dataToInsert = []

fs.readdirSync(seed).forEach(file => {
    const filePath = seed + file

    const cuisine = /\w+/.exec(file)[0]

    const dt = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const names = Object.keys(dt)
    const readyInsert = names.map(name => ({
        keywords: name.split(' ').map(t => t.toLowerCase()),
        cuisine,
        food_name: name,
        nutrition: {
            calories: parseInt(dt[name].Calories),
            total_fat: parseInt(dt[name].Fat),
            carbohydrate: parseInt(dt[name].Carbs),
            protein: parseInt(dt[name].Protein),
            satureated_fat: 0,
            cholesterol: 0,
            sodium: 0,
            dietary_fiber: 0,
            sugar: 0,
            potassium: 0,
        },
    }))

    dataToInsert = [...dataToInsert, ...readyInsert]
})

FoodSuggest.insertMany(dataToInsert, (err, doc) => {
    if (err) return console.log(err)
    console.log('Successfully saved to DB - ', doc.length, ' Documents')
    return m.disconnect()
})
