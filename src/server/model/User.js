import m from 'mongoose'

const dietPlanSchema = new m.Schema({
    target_calories: {
        type: Number,
        required: true,
        default: 2000,
    },
    target_weight: {
        type: Number,
        required: true,
    },
})

const userSchema = new m.Schema({
    googleID: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    profile_img: String,
    gender: String,

    new: {
        type: Boolean,
        required: true,
        default: false,
    },

    diet_plan: dietPlanSchema,

    create_time: {
        type: Date,
        default: Date.now,
    },
})

export default m.model('user', userSchema)
