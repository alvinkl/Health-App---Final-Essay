import { getFoodDiary } from '@urls'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

export const FETCH_DIARY = 'FETCH_DIARY'
export const FAIL_FETCH_DIARY = 'FAIL_FETCH_DIARY'

export const fetchTodayDiary = (startDate, endDate) => async dispatch => {
    const today = new Date()

    const query = qs({
        startDate: parseDate(today),
    })

    const [err, data] = await to(
        fetch(getFoodDiary + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAIL_FETCH_DIARY })

    const diary = await data.json()

    dispatch({
        diary,
        type: FETCH_DIARY,
    })
}

const parseDate = date => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    const dt = date.getDate()

    return year + '-' + month + '-' + dt
}
