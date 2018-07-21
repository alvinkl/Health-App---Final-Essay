import webpush from 'web-push'

import to from '@helper/asyncAwait'
import { mustAuthenticate } from '@routes/middleware'
import { responseError, responseJSON } from '@handler/response'
import { VapidPrivateKeys, VapidPublicKeys, credentials } from '@config/keys'

// set webpush vapid keys
webpush.setVapidDetails(credentials.email, VapidPublicKeys, VapidPrivateKeys)

export const sendPushNotification = async (
    { title, content, url, image },
    user_id = ''
) => {
    const data = await Subscription.find()

    if (user_id) {
        const index = data.findIndex(d => d.user_id === user_id)
        if (index === -1) return

        const { endpoint, auth, p256dh } = data[index]
        return webpush.sendNotification(
            {
                endpoint,
                keys: {
                    auth,
                    p256dh,
                },
            },
            JSON.stringify({
                title,
                content,
                url,
                image,
            })
        )
    }

    return data.map(({ endpoint, auth, p256dh }) => {
        webpush.sendNotification(
            {
                endpoint,
                keys: {
                    auth,
                    p256dh,
                },
            },
            JSON.stringify({
                title,
                content,
                url,
                image,
            })
        )
    })
}

// set webpush routes
import Subscription from '@model/Subscription'

export default function(r) {
    r.post('/notification/subscribe', mustAuthenticate, async (req, res) => {
        const { googleID } = req.user
        const {
            endpoint,
            keys: { auth, p256dh },
        } = req.body

        const subscription = new Subscription({
            user_id: googleID,
            endpoint,
            auth,
            p256dh,
        })

        const [err, data] = await to(subscription.save())
        if (err) return responseError(res, 500, err)

        return responseJSON(res, { data })
    })
}
