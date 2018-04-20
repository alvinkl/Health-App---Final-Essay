const path = require('path')
const fs = require('fs')
const m = require('mongoose')
const mongoURI = 'mongodb://localhost/healthapp'

m
    .connect(mongoURI)
    .then(() => console.log('Succeed to connect to db'))
    .catch(err => console.log('Failed to connect to db - ', err))

const nutritionSchema = m.Schema(
    {
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
    },
    { _id: false }
)

const foodSchema = m.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        serving_size: {
            type: Number,
            required: true,
        },

        unit: {
            type: String,
            required: true,
        },

        keywords: {
            type: Array,
            required: true,
            index: true,
        },

        nutritions: nutritionSchema,
    },
    { _id: false }
)

const menuSchema = m.Schema({
    restaurant_id: {
        type: Number,
        required: true,
        index: true,
    },

    menus: [foodSchema],
})

const Menu = m.model('menu', menuSchema)

const seed = path.resolve(__dirname) + '/'

let dataToInsert = []

fs.readdirSync(seed).forEach(file => {
    if (~file.indexOf('json')) {
        const filePath = seed + file

        const dt = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        const { restaurant_id, menus } = dt

        const readyInsert = {
            restaurant_id,
            menus: menus.map(({ name, serving_size, unit, nutritions }) => ({
                name,
                keywords: name.toLowerCase().split(' '),
                serving_size,
                unit,
                nutritions: {
                    calories: nutritions.calories,
                    total_fat: nutritions.fat,
                    carbohydrate: nutritions.carbohydrate,
                    protein: nutritions.protein,
                    satureated_fat: 0,
                    cholesterol: 0,
                    sodium: 0,
                    dietary_fiber: 0,
                    sugar: 0,
                    potassium: 0,
                },
            })),
        }

        dataToInsert = [...dataToInsert, readyInsert]
    }
})

Menu.insertMany(dataToInsert, (err, doc) => {
    if (err) return console.log(err)
    console.log('Successfully saved to DB - ', doc.length, ' Documents')
    return m.disconnect()
})
