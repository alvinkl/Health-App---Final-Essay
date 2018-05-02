export const OPEN_SIDEBAR = 'OPEN_SIDEBAR'
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR'
export const SHOW_HEADER = 'SHOW_HEADER'
export const HIDE_HEADER = 'HIDE_HEADER'
export const SHOW_LOADER = 'SHOW_LOADER'
export const HIDE_LOADER = 'HIDE_LOADER'
export const SHOW_SNACKBAR = 'SHOW_SNACKBAR'
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR'
export const SHOW_CAMERA_MODULE = 'SHOW_CAMERA_MODULE'
export const HIDE_CAMERA_MODULE = 'HIDE_CAMERA_MODULE'
export const SHOW_ONLINE_THEME = 'SHOW_ONLINE_THEME'
export const SHOW_OFFLINE_THEME = 'SHOW_OFFLINE_THEME'
export const SET_OFFLINE = 'SET_OFFLINE'
export const SET_ONLINE = 'SET_ONLINE'

export const openSidebar = () => ({
    type: OPEN_SIDEBAR,
})

export const closeSidebar = () => ({
    type: CLOSE_SIDEBAR,
})

export const showHeader = () => ({
    type: SHOW_HEADER,
})

export const hideHeader = () => ({
    type: HIDE_HEADER,
})

export const showLoader = () => ({
    type: SHOW_LOADER,
})

export const hideLoader = () => ({
    type: HIDE_LOADER,
})

export const showSnackbar = (message = '') => ({
    type: SHOW_SNACKBAR,
    message,
})

export const hideSnackbar = () => ({
    type: HIDE_SNACKBAR,
})

export const showCameraModule = () => ({
    type: SHOW_CAMERA_MODULE,
})

export const hideCameraModule = () => ({
    type: HIDE_CAMERA_MODULE,
})

export const showOnlineTheme = () => ({
    type: SHOW_ONLINE_THEME,
})

export const showOfflineTheme = () => ({
    type: SHOW_OFFLINE_THEME,
})

export const setOffline = () => dispatch => {
    dispatch(showSnackbar("You're Offline!"))
    return dispatch({ type: SET_OFFLINE })
}

export const setOnline = () => dispatch => {
    dispatch(showSnackbar("You're coming back online!"))
    return dispatch({ type: SET_ONLINE })
}
