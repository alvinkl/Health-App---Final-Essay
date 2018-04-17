import m from 'mongoose'

const subscriptionSchema = m.Schema({
    user_id: {
        type: String,
        required: true,
    },

    endpoint: {
        type: String,
        required: true,
    },

    auth: {
        type: 'String',
        required: true,
    },

    p256dh: {
        type: 'String',
        required: true,
    },
})

export default m.model('subscription', subscriptionSchema)
