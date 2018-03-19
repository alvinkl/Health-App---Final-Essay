const getRouteIndex = router => {
    const { route: { location: { pathname } } } = router
    switch (pathname) {
        case '/':
            return 0
        case '/diary':
            return 1
        case '/report':
            return 2
        default:
            return -1
    }
}

export default getRouteIndex
