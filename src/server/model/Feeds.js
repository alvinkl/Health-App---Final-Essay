import m from 'mongoose'

const locationSchema = m.Schema(
    {
        lat: {
            type: Number,
            default: 0,
        },
        lon: {
            type: Number,
            default: 0,
        },
        address: {
            type: String,
            default: '',
        },
    },
    { _id: 0 }
)

const commentSchema = m.Schema({
    user_id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    create_time: {
        type: Date,
        default: Date.now,
        index: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1,
    },
})

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

    comments: {
        type: [commentSchema],
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

    status: {
        type: Number,
        required: true,
        default: 1,
    },
})

export default m.model('feeds', feedSchema)
