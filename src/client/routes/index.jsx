import React from 'react'
import { Redirect } from 'react-router-dom'

import Master from '@components/Master'

import Contents from '@components/Contents'
import Diary from '@components/Diary'
import Report from '@components/Report'
import Landing from '@components/Landing'
import GettingStarted from '@components/Landing/GettingStarted'

const RedirectToHome = () => <Redirect to="/" />

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
                name: 'redirect-home',
                path: '/home',
                exact: true,
                component: RedirectToHome,
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
