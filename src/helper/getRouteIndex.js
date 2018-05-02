const routeIndexWithHeader = [0, 1, 2, 3]

const getRouteIndex = router => {
    const {
        route: {
            location: { pathname },
        },
    } = router

    if (pathname.match(/\/$/)) return 0
    if (pathname.match(/\/diary/)) return 1
    if (pathname.match(/\/report/)) return 2
    if (pathname.match(/\/myfeed/)) return 3
    if (pathname.match(/\/feed/)) return 4
    if (pathname.match(/\/user/)) return 5

    return -1
}

export const isRouteWithHeader = router =>
    !!~routeIndexWithHeader.indexOf(getRouteIndex(router))

export default getRouteIndex
