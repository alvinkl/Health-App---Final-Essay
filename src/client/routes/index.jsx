import Contents from '@components/Contents'
import Report from '@components/Report'
import Diary from '@components/Diary'

const route = [
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
]

export default route
