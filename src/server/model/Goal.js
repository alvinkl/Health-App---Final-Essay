import m from 'mongoose'

const weightSchema = new m.Schema({
    value: {
        type: Number,
        required: true,
    },
    tp: {
        type: Number,
        required: true,
    },
})

const heightSchema = new m.Schema({
    value: {
        type: Number,
        required: true,
    },
    tp: {
        type: Number,
        required: true,
    },
})

const goalSchema = new m.Schema({
    googleID: {
        type: String,
        index: true,
        required: true,
    },

    goal: {
        type: Number,
        required: true,
    },

    gender: {
        type: Number,
        required: true,
    },

    current_weight: weightSchema,

    current_height: heightSchema,

    activity: {
        type: Number,
        required: true,
    },

    create_time: {
        type: Date,
        index: true,
        default: Date.now,
    },

    update_time: {
        type: Date,
    },
})

export default m.model('goal', goalSchema)