import {
    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    SHOW_HEADER,
    HIDE_HEADER,
    SHOW_LOADER,
    HIDE_LOADER,
    SHOW_SNACKBAR,
    HIDE_SNACKBAR,
} from '../actions/common'

export const initial_state = {
    header: false,
    navbar: false,
    enableSidebar: false,
    sidebar: false,

    loading: false,

    snackbar: {
        show: false,
        message: '',
    },

    isSSR: false,
    userAgent: '',
}

export default function common(state = initial_state, action) {
    switch (action.type) {
        case OPEN_SIDEBAR:
            return {
                ...state,
                sidebar: true,
            }
        case CLOSE_SIDEBAR:
            return {
                ...state,
                sidebar: false,
            }
        case SHOW_HEADER:
            return {
                ...state,
                header: true,
                navbar: true,
                enableSidebar: true,
            }
        case HIDE_HEADER:
            return {
                ...state,
                header: false,
                navbar: false,
                enableSidebar: false,
            }
        case SHOW_LOADER:
            return {
                ...state,
                loading: true,
            }
        case HIDE_LOADER:
            return {
                ...state,
                loading: false,
            }
        case SHOW_SNACKBAR:
            return {
                ...state,
                snackbar: {
                    show: true,
                    message: action.message,
                },
            }
        case HIDE_SNACKBAR:
            return {
                ...state,
                snackbar: {
                    show: false,
                    message: '',
                },
            }
        default:
            return state
    }
}
