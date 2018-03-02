import Contents from '@components/Contents'
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
]

export default route
