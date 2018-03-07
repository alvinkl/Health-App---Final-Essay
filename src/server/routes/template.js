import { renderTemplate } from '@server/handler/template'

export default function(r) {
    r.get('*', renderTemplate)
}
