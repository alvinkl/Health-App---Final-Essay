import { responseTemplate } from './response'

import { renderTemplateHome, renderTemplateLanding } from '@functions/template'
import { getUserData } from '@functions/auth'

import to from '@helper/asyncAwait'

export const renderTemplate = async (req, res) => {
    const user_agent = req.headers['user-agent']
    const { url } = req

    let data = {}

    if (req.user) {
        const { googleID, new: n } = req.user
        const [, user] = await to(getUserData(googleID))
        data = await renderTemplateHome({ ...user, new: !!n }, user_agent, url)
    } else data = await renderTemplateLanding({}, user_agent, url)

    return responseTemplate(res, 'layout', data)
}
