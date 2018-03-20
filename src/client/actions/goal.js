export const SUBMIT_GOAL = 'SUBMIT_GOAL'

export const submitGoal = goal => dispatch => {
    console.log(goal)

    dispatch({
        type: SUBMIT_GOAL,
        goal,
    })
}
