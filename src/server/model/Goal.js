import m from 'mongoose'

const weightSchema = new m.Schema(
    {
        value: {
            type: Number,
            required: true,
        },
        tp: {
            type: Number,
            required: true,
        },
    },
    { _id: 0 }
)

const heightSchema = new m.Schema(
    {
        value: {
            type: Number,
            required: true,
        },
        tp: {
            type: Number,
            required: true,
        },
    },
    { _id: 0 }
)

const targetWeightSchema = new m.Schema(
    {
        value: {
            type: Number,
            required: true,
        },
        tp: {
            type: Number,
            required: true,
        },
    },
    { _id: 0 }
)

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

    birth_date: {
        type: Date,
        index: true,
    },

    target_calories: {
        type: Number,
        required: true,
        default: 2000,
    },

    target_weight: targetWeightSchema,

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
