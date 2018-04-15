import { responseTemplate } from './response'

import { renderTemplateHome, renderTemplateLanding } from '@functions/template'
import { getUserData } from '@functions/auth'

import to from '@helper/asyncAwait'

const unprotected_routes = ['landing', 'getting-started']

export const renderTemplate = async (req, res) => {
    const user_agent = req.headers['user-agent']
    const { url } = req

    let data = {}

    if (req.user) {
        const { googleID, new: n } = req.user
        const [, user] = await to(getUserData(googleID))

        if (req.user.new) {
            if (!~req.url.indexOf('getting-started'))
                return res.redirect('/getting-started')

            data = await renderTemplateHome(
                { ...user, new: !!n },
                user_agent,
                url
            )
        } else {
            if (!~req.url.indexOf('landing')) {
                data = await renderTemplateHome(
                    { ...user, new: !!n },
                    user_agent,
                    url
                )
            } else return res.redirect('/')
        }
    } else {
        if (!~req.url.indexOf('landing')) return res.redirect('/landing')

        data = await renderTemplateHome({}, user_agent, url)
    }

    return responseTemplate(res, 'layout', data)
}
