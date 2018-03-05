import { OPEN_SIDEBAR, CLOSE_SIDEBAR } from '../actions/common'

export const initial_state = {
    sidebar: false,
    isSSR: false,
    userAgent: null,
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

        default:
            return state
    }
}
