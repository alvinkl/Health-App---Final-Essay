import React from 'react'
import { Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'

import convertCustomRouteConfig from './convertCustomRouteConfig'
import generateAsyncComponent from './generateAsyncComponent'

import Master from '@components/Master'
import Loader from '@components/Loader'
import Offline from '@components/Offline'

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

const DynamicLoadingComponent = props => {
    if (props.error || props.timedOut) return Offline

    if (props.pastDelay) return Loader

    return null
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
                component: Loadable({
                    loader: () =>
                        import(/* webpackChunkName: "Contents" */ '@components/Contents'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Contents'],
                    webpack: () => [
                        require.resolveWeak('@components/Contents'),
                    ],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'specificFeed',
                path: '/feed/:post_id',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/* webpackChunkName: "Specific_Feed" */ '@components/Contents/Feeds/SpecificFeed'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Contents/Feeds/SpecificFeed'],
                    webpack: () => [
                        require.resolveWeak(
                            '@components/Contents/Feeds/SpecificFeed'
                        ),
                    ],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'personalFeed',
                path: '/myfeed',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/* webpackChunkName: "Personal_Feeds" */ '@components/PersonalFeeds'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/PersonalFeeds'],
                    webpack: () => [
                        require.resolveWeak('@components/PersonalFeeds'),
                    ],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'personalFeedOthers',
                path: '/user/:user_id',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/* webpackChunkName: "Personal_Feeds" */ '@components/PersonalFeeds'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/PersonalFeeds'],
                    webpack: () => [
                        require.resolveWeak('@components/PersonalFeeds'),
                    ],
                    loading: DynamicLoadingComponent,
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
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Diary'],
                    webpack: () => [require.resolveWeak('@components/Diary')],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'report',
                path: '/report',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Report */ '@components/Report'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Report'],
                    webpack: () => [require.resolveWeak('@components/Report')],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'addFeed',
                path: '/add-feed',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: AddFeed */ '@components/AddFeed'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/AddFeed'],
                    webpack: () => [require.resolveWeak('@components/AddFeed')],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'addWorkout',
                path: '/add-workout',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Workout */ '@components/Workout'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Workout'],
                    webpack: () => [require.resolveWeak('@components/Workout')],
                    loading: DynamicLoadingComponent,
                }),
            },

            // Landing page
            {
                name: 'landing',
                path: '/landing',
                exact: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: Landing */ '@components/Landing'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Landing'],
                    webpack: () => [require.resolveWeak('@components/Landing')],
                    loading: DynamicLoadingComponent,
                }),
            },
            {
                name: 'getting-started',
                path: '/getting-started',
                exact: true,
                protected: true,
                component: Loadable({
                    loader: () =>
                        import(/*  webpackChunkName: GettingStarted */ '@components/Landing/GettingStarted'),
                    pastDelay: 1000,
                    timeout: 100000,
                    modules: ['@components/Landing/GettingStarted'],
                    webpack: () => [
                        require.resolveWeak(
                            '@components/Landing/GettingStarted'
                        ),
                    ],
                    loading: DynamicLoadingComponent,
                }),
            },
        ],
    },
]

export default route
