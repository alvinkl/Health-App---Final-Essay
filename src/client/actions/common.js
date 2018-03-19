export const OPEN_SIDEBAR = 'OPEN_SIDEBAR'
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR'
export const SHOW_HEADER = 'SHOW_HEADER'
export const HIDE_HEADER = 'HIDE_HEADER'

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
