import m from 'mongoose'

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
        type: Number,
        required: true,
        default: 0,
    },

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
