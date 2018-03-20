import { insertUpdateGoal } from '@urls'
import to from '@helper/asyncAwait'

export const SUBMIT_GOAL = 'SUBMIT_GOAL'
export const FAIL_SUBMIT_GOAL = 'FAIL_SUBMIT_GOAL'

export const submitGoal = goal => async dispatch => {
    console.log(goal)

    const [err] = await to(
        fetch(insertUpdateGoal, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(goal),
        })
    )

    if (err) {
        return dispatch({ type: FAIL_SUBMIT_GOAL })
    }

    return dispatch({
        type: SUBMIT_GOAL,
        goal,
    })
}
