import m from 'mongoose'

const restaurantSchema = m.Schema({
    restaurant_id: {
        type: Number,
        required: true,
        index: true,
    },

    name: {
        type: String,
        required: true,
    },

    cuisines: {
        type: String,
        required: true,
        index: true,
    },

    coordinates: {
        type: [Number],
        required: true,
    },

    lat: {
        type: Number,
        required: true,
        index: true,
    },
    lon: {
        type: Number,
        required: true,
        index: true,
    },

    keywords: {
        type: Array,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    url: String,

    thumbnail: String,
})

restaurantSchema.index({ coordinates: '2dsphere' })

export default m.model('restaurant', restaurantSchema)
