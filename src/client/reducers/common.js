import {
    cyan100,
    cyan500,
    cyan700,
    grey100,
    grey500,
    grey700,
} from 'material-ui/styles/colors'

import {
    OPEN_SIDEBAR,
    CLOSE_SIDEBAR,
    SHOW_HEADER,
    HIDE_HEADER,
    SHOW_LOADER,
    HIDE_LOADER,
    SHOW_SNACKBAR,
    HIDE_SNACKBAR,
    SHOW_CAMERA_MODULE,
    HIDE_CAMERA_MODULE,
    SHOW_ONLINE_THEME,
    SHOW_OFFLINE_THEME,
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

    camera_module: false,

    isSSR: false,
    userAgent: '',

    theme_color: {
        palette: {
            primary1Color: cyan500,
            primary2Color: cyan700,
            primary3Color: cyan100,
        },
    },
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
        case SHOW_CAMERA_MODULE:
            return {
                ...state,
                camera_module: true,
            }
        case HIDE_CAMERA_MODULE:
            return {
                ...state,
                camera_module: false,
            }
        case SHOW_ONLINE_THEME:
            return {
                ...state,
                theme_color: {
                    palette: {
                        primary1Color: cyan500,
                        primary2Color: cyan700,
                        primary3Color: cyan100,
                    },
                },
            }
        case SHOW_OFFLINE_THEME:
            return {
                ...state,
                theme_color: {
                    palette: {
                        primary1Color: grey500,
                        primary2Color: grey700,
                        primary3Color: grey100,
                    },
                },
            }
        default:
            return state
    }
}
