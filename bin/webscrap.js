const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const seed_dir = path.resolve(__dirname, '..', 'seed')

const rimraf = dir_path => {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry)
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path)
            } else {
                fs.unlinkSync(entry_path)
            }
        })
        return fs.rmdirSync(dir_path)
    }
}

if (!fs.existsSync(seed_dir)) {
    fs.mkdirSync(seed_dir)
} else {
    rimraf(seed_dir)
    fs.mkdirSync(seed_dir)
}

const cuisine = ['indonesian', 'chinese', 'western']

const scrapeData = (cuisine, count = 1) => {
    let uri =
        'http://www.myfitnesspal.com/nutrition-facts-calories/' +
        cuisine +
        '/' +
        count
    return rp({
        uri,
        transform: body => cheerio.load(body),
    })
        .then($ => {
            let result = {}

            const fl = $('.food_description')

            if (!fl.length)
                return console.log(
                    'No more data to scrape from ' + cuisine + ' cuisine!'
                )

            let names = []

            for (let i = 0; i < fl.length; i++)
                names[i] = $(fl[i]).find('a')[0].children[0].data

            const nutrition_facts = $('.nutritional_info')

            if (!nutrition_facts.length)
                return console.log(
                    'No more data to scrape from ' + cuisine + ' cuisine!'
                )

            for (let i = 0; i < nutrition_facts.length; i++) {
                let nf = $(nutrition_facts[i])
                    .html()
                    .replace(/\s/g, '')
                    .split(',')

                try {
                    nf.map(facts => {
                        const res = /<label>(.+)<\/label>(.+)/.exec(facts)
                        if (!res)
                            throw 'No more data to scrape from ' +
                                cuisine +
                                ' cuisine!'
                        result[names[i]] = Object.assign(
                            {},
                            result[names[i]] || {},
                            {
                                [res[1].replace(':', '')]: /\d*/.exec(
                                    res[2]
                                )[0],
                            }
                        )
                    })
                } catch (err) {
                    return console.log(err)
                }
            }

            fs.writeFile(
                path.resolve(seed_dir, cuisine + '-' + count + '.json'),
                JSON.stringify(result, null, 4),
                err => {
                    if (err) return console.log('Failed to write file', err)

                    console.log(
                        'Write file ' + cuisine + '-' + count + ' success'
                    )
                    return scrapeData(cuisine, ++count)
                }
            )
        })
        .catch(err => console.log(err))
}

cuisine.map(c => scrapeData(c))
