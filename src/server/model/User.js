import m from 'mongoose'

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

    create_time: {
        type: Date,
        default: Date.now,
    },
})

export default m.model('user', userSchema)
