export const FETCH_USER_DATA = 'FETCH_USER_DATA'

export const fetchUserData = () => async (dispatch, getState) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
    const data = await res.json()

    const dummyData = {
        user_id: 123123,
        user_name: 'Sally The Fatty',
        profile_img: '',

        dietary_plan: {
            target_calories: '2000 cal',
            current_calories: '835 cal',
            target_weight: '75 kg',
            current_weight: '83 kg',
        },
    }

    dispatch({ type: FETCH_USER_DATA, user: dummyData })
}
