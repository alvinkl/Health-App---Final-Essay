import Master from '@components/Master'

import Contents from '@components/Contents'
import Diary from '@components/Diary'
import Report from '@components/Report'
import Login from '@components/Login'

const route = [
    {
        component: Master,
        routes: [
            {
                name: 'home',
                path: '/',
                exact: true,
                component: Contents,
            },
            {
                name: 'diary',
                path: '/diary',
                exact: true,
                component: Diary,
            },
            {
                name: 'report',
                path: '/report',
                exact: true,
                component: Report,
            },
        ],
    },
]

export default route
