import React from 'react'
import { Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'

import convertCustomRouteConfig from './convertCustomRouteConfig'
import generateAsyncComponent from './generateAsyncComponent'

import Master from '@components/Master'
import Loader from '@components/Loader'

// import Contents from '@components/Contents'
// import Diary from '@components/Diary'
// import Report from '@components/Report'
// import Landing from '@components/Landing'
// import GettingStarted from '@components/Landing/GettingStarted'

const RedirectToHome = () => <Redirect to="/" />

const errorLoading = err => {
    console.error('Dynamic page loading failed', err)
}
const loadRoute = cb => {
    return module => cb(null, module.default)
}

const loadingComponent = props => {
    return Loader
}

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
                // component: generateAsyncComponent({
                //     loader: () =>
                //         import(/* webpackChunkName: "Contents" */ '@components/Contents'),
                // }),
                component: Loadable({
                    loader: () =>
                        import(/* webpackChunkName: "Contents" */ '@components/Contents'),
                    loading: loadingComponent,
                }),
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
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Diary */ '@components/Diary'),
                    loading: loadingComponent,
                }),
            },
            {
                name: 'report',
                path: '/report',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Diary */ '@components/Report'),
                    loading: loadingComponent,
                }),
            },

            // Landing page
            {
                name: 'landing',
                path: '/landing',
                exact: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Diary */ '@components/Landing'),
                    loading: loadingComponent,
                }),
            },
            {
                name: 'getting-started',
                path: '/getting-started',
                exact: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Diary */ '@components/Landing/GettingStarted'),
                    loading: loadingComponent,
                }),
            },
        ],
    },
]

export default route
