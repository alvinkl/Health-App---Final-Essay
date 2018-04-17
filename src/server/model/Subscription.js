import m from 'mongoose'

const subscriptionSchema = m.Schema({
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
