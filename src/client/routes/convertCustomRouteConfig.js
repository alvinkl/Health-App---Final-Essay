/**
 * credits to @gdborton https://github.com/gdborton/rrv4-ssr-and-code-splitting
 */

// This will recursively map our format of routes to the format
// that react-router-config expects

export default function convertCustomRouteConfig(routes, parentRoute) {
    return routes.map(route => {
        const pathResult =
            typeof route.path === 'function'
                ? route.path(parentRoute || '')
                : `${parentRoute}/${route.path}`
        return {
            path: pathResult.replace('//', '/'),
            component: route.component,
            exact: route.exact,
            routes: route.routes
                ? convertCustomRouteConfig(route.routes, pathResult)
                : [],
        }
    })
    return mapping
}
