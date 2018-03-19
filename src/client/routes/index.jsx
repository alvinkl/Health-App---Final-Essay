import Master from '@components/Master'

import Contents from '@components/Contents'
import Diary from '@components/Diary'
import Report from '@components/Report'
import Landing from '@components/Landing'
import GettingStarted from '@components/Landing/GettingStarted'

const route = [
    {
        component: Master,
        routes: [
            // Authenticated page
            {
                name: 'home',
                path: '/',
                exact: true,
                protected: true,
                component: Contents,
            },
            {
                name: 'diary',
                path: '/diary',
                exact: true,
                protected: true,
                component: Diary,
            },
            {
                name: 'report',
                path: '/report',
                exact: true,
                protected: true,
                component: Report,
            },

            // Landing page
            {
                name: 'landing',
                path: '/landing',
                exact: true,
                component: Landing,
            },
            {
                name: 'getting-started',
                path: '/getting-started',
                exact: true,
                component: GettingStarted,
            },
        ],
    },
]

export default route
