import path from 'path'

const html = () => `
    <!DOCTYPE html>
    <head>

    </head>
    <html>
        <body>
            <div id="root">
                <div class="loading"><h1>Loading</h1></div>
            </div>

            <script src="build/client.build.js"></script>
        </body>
    </html>
`

export default function(app) {
    app.get('/', (req, res) => {
        res.send(html())
    })
}
