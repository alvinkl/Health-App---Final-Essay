const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))

const seed_dir = path.resolve(__dirname, '..', 'seed')

const cuisine = args['c']
const foods = args['n'] ? args['n'].split(',') : ['']

const scrapeData = (cuisine, food, count = 1) => {
    if (count > 10) return

    const search_food = food || cuisine

    const uri =
        'http://www.myfitnesspal.com/food/search?page=' +
        count +
        '&search=' +
        search_food

    console.log(uri)
    rp({
        uri,
        headers: {
            Cookie:
                'tracker=id%3D%3E%7Cuser_id%3D%3E%7Csource%3D%3Ehttps%3A%2F%2Fwww.google.co.id%2F%7Csource_domain%3D%3Ehttps%3A%2F%2Fwww.google.co.id%2F%7Ckeywords%3D%3E%7Cclicked_at%3D%3E2017-12-08+11%3A27%3A17+%2B0000%7Clanding_page%3D%3Ehttp%3A%2F%2Fwww.myfitnesspal.com%2F%7Csearch_engine%3D%3E%7Clp_category%3D%3E%7Clp_subcategory%3D%3E%7Ccp%3D%3E%7Ccr%3D%3E%7Cs1%3D%3E%7Cs2%3D%3E%7Ckw%3D%3E%7Cmt%3D%3E; premium_logged_out_homepage=2a71f41616b05581bd487200606c312e; premium_upsell_comparison=2a71f41616b05581bd487200606c312e; fbm_186796388009496=base_domain=.myfitnesspal.com; p=iIDvZBIllmuSuYJWXLrTW0xF; known_user=63974498; __stripe_mid=6169e497-2193-44c0-a4e0-023c447b2d81; _dy_c_exps=; _dyid=-315251701820262619; _dy_geo=ID.AS.ID_04.ID_04_Jakarta; _dy_df_geo=Indonesia..Jakarta; mobile_seo_test_guid=ee517559-ba6e-b435-6807-a21a16b9bcde; _dy_csc_ses=t; _session_id=BAh7CEkiD3Nlc3Npb25faWQGOgZFVEkiJTZmODY3ZmE1OGVhYzA2MDczNWUxZWNkNTE2ZmM4ZTc1BjsAVEkiEGV4cGlyeV90aW1lBjsARlU6IEFjdGl2ZVN1cHBvcnQ6OlRpbWVXaXRoWm9uZVsISXU6CVRpbWUN6IodwJBLDM0JOg1uYW5vX251bWkB9ToNbmFub19kZW5pBjoNc3VibWljcm8iByRQOgl6b25lSSIIVVRDBjsARkkiH1BhY2lmaWMgVGltZSAoVVMgJiBDYW5hZGEpBjsAVEl1OwcN4YodwJBLDM0JOwhpAfU7CWkGOwoiByRQOwtJIghVVEMGOwBGSSIQX2NzcmZfdG9rZW4GOwBGSSIxUjkvOGNjRGd5cVFLQzMzclFsSmwxdS9nRk52MzY0YjRWSXE2b096WjJsND0GOwBG--3baf0bdb043781702d17212c6e98e24f08dae926; _dy_ses_load_seq=681%3A1521787883239; _dy_soct=94589.128722.1521787709*47418.60107.1521787883; fbsr_186796388009496=jUPkBgFjct_IO8w5WHeU8ZQJVRuGw3IIsHXBSdK5xAc.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUNCZm5FeXI5UjNMNlU0WnVZdmpTb0J6YmNCblpQSWhqNGRaMjBIMVA0amN4aG90Z3RhSTZjQUoxWnVNeXQzYUtoaFc5dy1jek9IM3dWNGlHbXpuNVB2ZDFYLWdsRTk5b2FYTTVST29BTTdsVG1VX050NHJTeGtCYU1FY2dnT19EWEVRdEdvaVhIcTBBSm0xMXU2UmYxeWNZc25FVU9qZWR0d0VRMVVGMW1tSXBYM2dPUlRfY0JnSlJBdFZBajNMc29HUkxUUXFVcjFZaXI5bzBsendPczNFQUYzdDJ2bkppTjQtNHpWT3pHOXROcEMtMmlkUzEza2F1NTVfZ0lpamxmYXRQZTA5RklpalFZdjZwY3BwbFFZMkJwdXN0TG9QaUNxOU9fWkdKLUxDamJnNHFYY0Q4SXgxcWcwME1hQzV0dklFaEZBX0VHOUVPNEhDQkl1REJQaSIsImlzc3VlZF9hdCI6MTUyMTc4Nzg4MywidXNlcl9pZCI6IjE3MjUxODA5MjAifQ; _dycst=dk.m.c.ss.frv5.tos.fb.; _dy_toffset=-2; _dyus_8766792=130%7C0%7C0%7C0%7C0%7C0.0.1512732456590.1521787884908.9055428.0%7C81%7C12%7C2%7C1171%7C38%7C0%7C0%7C0%7C0%7C0%7C0%7C38%7C0%7C0%7C0%7C0%7C1%7C38%7C1%7C0%7C0%7C0%7C0',
        },
        transform: body => cheerio.load(body),
    }).then($ => {
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
                            [res[1].replace(':', '')]: /\d*/.exec(res[2])[0],
                        }
                    )
                })
            } catch (err) {
                return console.log(err)
            }
        }

        fs.writeFile(
            path.resolve(
                seed_dir,
                cuisine + '-' + food + '-' + count + '.json'
            ),
            JSON.stringify(result, null, 4),
            err => {
                if (err) return console.log('Failed to write file', err)

                console.log(
                    'Write file ' +
                        cuisine +
                        '-' +
                        food +
                        '-' +
                        count +
                        ' success'
                )
                return scrapeData(cuisine, food, ++count)
            }
        )
    })
}

foods.map(food => scrapeData(cuisine, food))
