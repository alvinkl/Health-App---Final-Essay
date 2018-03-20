import to from '@helper/asyncAwait'

export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const ERROR_FETCH_USER_DATA = 'ERROR_FETCH_USER_DATA'

export const fetchUserData = () => async (dispatch, getState) => {
    const [err, res] = await to(
        fetch('https://jsonplaceholder.typicode.com/users/1')
    )

    if (err) {
        dispatch({ type: ERROR_FETCH_USER_DATA })
        return
    }

    const data = await res.json()

    const dummyData = {}

    dispatch({ type: FETCH_USER_DATA, user: dummyData })
}
