import m from 'mongoose'

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

export default m.model('foodsuggest', foodSuggestSchema)
