const routeIndexWithHeader = [0, 1, 3, 4]

const getRouteIndex = pathname => {
    if (pathname.match(/\/$/)) return 0
    if (pathname.match(/\/diary/)) return 1
    if (pathname.match(/\/add-feed/)) return 2
    if (pathname.match(/\/report/)) return 3
    if (pathname.match(/\/myfeed/)) return 4
    if (pathname.match(/\/user/)) return 0
    if (pathname.match(/\/feed/)) return 5

    return -1
}

export const isRouteWithHeader = router =>
    !!~routeIndexWithHeader.indexOf(getRouteIndex(router))

export default getRouteIndex
