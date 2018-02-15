import path from 'path'

import { App } from '@client/index'
import { renderToString } from 'react-dom/server'

const html = () => `
    <!DOCTYPE html>
    <head>

    </head>
    <html>
        <body>

            <react />

            <script src="build/client.build.js"></script>
        </body>
    </html>
`

export default function(app) {
    app.get('/', (req, res) => {
        const markup = renderToString(<App />)

        res.render('layout', {
            markup,
        })
    })
}
