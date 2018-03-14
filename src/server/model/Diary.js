import m from 'mongoose'

const nutrientSchema = m.Schema({
    calories: {
        type: Number,
        default: 0,
    },
    saturated_fat: {
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

const diarySchema = m.Schema({
    user_id: {
        type: String,
        required: true,
        index: true,
    },

    food_name: String,
    quantity: Number,
    total_weight: Number,
    nutrients: nutrientSchema,

    created_time: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    },
    update_time: {
        type: Date,
        default: Date.now,
    },

    meal_type: {
        type: Number,
        required: true,
    },

    status: {
        type: Number,
        default: 1,
    },
})

export default m.model('diary', diarySchema)
