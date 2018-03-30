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

export default m.model('menu', menuSchema)
