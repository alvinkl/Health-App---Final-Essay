import { responseTemplate } from './response'

import funcRT from '@functions/template'
import { getUserData } from '@functions/auth'
import { getTodayCalories } from '@functions/food'

import to from '@helper/asyncAwait'

const unprotected_routes = ['landing', 'getting-started']

export const renderTemplate = async (req, res) => {
    const user_agent = req.headers['user-agent']
    const { url } = req

    let data = {}

    try {
        if (req.user) {
            const { googleID, new: n } = req.user
            const [, user] = await to(getUserData(googleID))

            if (req.user.new) {
                if (!~req.url.indexOf('getting-started'))
                    return res.redirect('/getting-started')

                data = await funcRT(
                    { user: { ...user, new: !!n } },
                    user_agent,
                    url
                )
            } else {
                const [, tc] = await to(getTodayCalories(googleID))

                if (!~req.url.indexOf('landing')) {
                    data = await funcRT(
                        {
                            user: { ...user, new: !!n },
                            diary: { today_total_calories: tc.total_calories },
                        },
                        user_agent,
                        url
                    )
                } else return res.redirect('/')
            }
        } else {
            if (!~req.url.indexOf('landing')) return res.redirect('/landing')

            data = await funcRT({}, user_agent, url)
        }
    } catch (err) {
        req.logout()

        if (!~req.url.indexOf('landing')) return res.redirect('/landing')

        data = await funcRT({}, user_agent, url)
    }

    return responseTemplate(res, 'layout', data)
}
