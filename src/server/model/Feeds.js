import m from 'mongoose'

const locationSchema = m.Schema(
    {
        lat: {
            type: Number,
            required: true,
        },
        lon: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            default: '',
        },
    },
    { _id: 0 }
)

const feedSchema = m.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        required: true,
        default: [],
    },

    location: locationSchema,

    user_id: {
        type: String,
        required: true,
        index: true,
    },

    create_time: {
        type: Date,
        default: Date.now,
        index: true,
    },
})

export default m.model('feeds', feedSchema)
