import m from 'mongoose'

const photoSchema = new m.Schema(
    {
        highres: String,
        thumbnail: String,
    },
    { _id: 0 }
)

const workoutSchema = new m.Schema({
    user_id: {
        type: String,
        required: true,
        index: true,
    },

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    benefits: {
        type: String,
        default: '',
    },
    duration: {
        type: Number,
        required: true,
    },
    calories_burned: {
        type: Number,
        required: true,
    },
    photo: photoSchema,

    workout_time: {
        type: Date,
        required: true,
        index: true,
    },

    create_time: {
        type: Date,
        required: true,
        default: Date.now,
    },

    update_time: {
        type: Date,
        default: Date.now,
    },

    status: {
        type: Number,
        default: 1,
    },
})

export default m.model('workout', workoutSchema)
