import webpush from 'web-push'

import to from '@helper/asyncAwait'
import { mustAuthenticate } from '@routes/middleware'
import { responseError, responseJSON } from '@handler/response'
import { VapidPrivateKeys, VapidPublicKeys, credentials } from '@config/keys'

// set webpush vapid keys
webpush.setVapidDetails(credentials.email, VapidPublicKeys, VapidPrivateKeys)

// set webpush routes
import Subscription from '@model/Subscription'

export default function(r) {
    r.post('/notification/subscribe', mustAuthenticate, async (req, res) => {
        const { endpoint, keys: { auth, p256dh } } = req.body

        const subscription = new Subscription({
            endpoint,
            auth,
            p256dh,
        })

        const [err, data] = await to(subscription.save())
        if (err) return responseError(res, 500, err)

        return responseJSON(res, { data })
    })
}

export const sendPushNotification = (
    { endpoint, auth, p256dh },
    { title, content, openURL }
) => {
    const pushConfig = {
        endpoint,
        keys: {
            auth,
            p256dh,
        },
    }

    const notificationContent = {
        title,
        content,
        openURL,
    }

    return webpush.sendNotification(pushConfig, notificationContent)
}
