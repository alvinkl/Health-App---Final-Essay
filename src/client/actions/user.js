export const FETCH_USER_DATA = 'FETCH_USER_DATA'

export const fetchUserData = () => async (dispatch, getState) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
    const data = await res.json()
    console.log(data)

    dispatch({ type: FETCH_USER_DATA, user: data })
}
