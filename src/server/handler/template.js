import { responseTemplate } from './response'

import { renderTemplateHome } from '@functions/template'

export const renderTemplate = async (req, res) => {
    console.log('REQUEST SESSION = ', req.session)

    if (req.user) {
        const data = await renderTemplateHome(req)

        return responseTemplate(res, 'layout', data)
    }

    // TODO: - render login content
    return res.json({ message: 'NOT LOGGED IN!' })
}
