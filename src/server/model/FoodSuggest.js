import m from 'mongoose'

const foodSuggest = m.Schema({
    restaurant_ids: {
        type: Array,
    },

    cuisine: {
        type: String,
        required: true,
    },

    create_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

export default m.model(foodSuggest)
