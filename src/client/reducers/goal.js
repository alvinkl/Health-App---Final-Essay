import { SUBMIT_GOAL, FAIL_SUBMIT_GOAL } from '@actions/goal'

export const initial_state = {
    goal: 0,
    gender: 0,
    current_weight: {
        value: 0,
        tp: 1,
    },
    current_height: {
        value: 0,
        tp: 1,
    },
    activity: 0,
    dateBirth: null,

    success: false,
}

export default (state = initial_state, action) => {
    switch (action.type) {
        case SUBMIT_GOAL:
            return {
                ...state,
                ...action.goal,
                success: true,
            }
        case FAIL_SUBMIT_GOAL:
            return {
                ...state,
                success: false,
            }
        default:
            return state
    }
}
