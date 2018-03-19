import { responseTemplate } from './response'

import { renderTemplateHome, renderTemplateLanding } from '@functions/template'

export const renderTemplate = async (req, res) => {
    let data = {}

    if (req.user) data = await renderTemplateHome(req)
    else data = await renderTemplateLanding(req)

    return responseTemplate(res, 'layout', data)
}
