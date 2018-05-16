import {
    getSuggestion,
    getRestaurantSuggestion,
    getNearbyRestaurant,
    getMenusFromRestaurant,
} from '@urls'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

export const FETCHING_SUGGEST = 'FETCHING_SUGGEST'
export const FAILED_FETCH_SUGGEST = 'FAILED_FETCH_SUGGEST'

export const FETCHED_SUGGEST_FOOD = 'FETCHED_SUGGEST_FOOD'
export const FETCHED_SUGGEST_RESTAURANT = 'FETCHED_SUGGEST_RESTAURANT'

export const FETCHED_RESTAURANT_NEARBY = 'FETCHED_RESTAURANT_NEARBY'
export const FETCHED_MENUS = 'FETCHED_MENUS'

export const fetchSuggestFood = location => async dispatch => {
    dispatch({ type: FETCHING_SUGGEST })

    const { lon, lat } = location

    const query = qs({
        lon,
        lat,
    })

    const [err, res] = await to(
        fetch(getSuggestion + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAILED_FETCH_SUGGEST })

    const food = await res.json()

    return dispatch({ type: FETCHED_SUGGEST_FOOD, food })
}

export const fetchSuggestRestaurant = ({
    location,
    cuisine,
    keywords,
}) => async dispatch => {
    dispatch({ type: FETCHING_SUGGEST })

    const query = qs({
        cuisine,
        keywords,
    })

    const [err, res] = await to(
        fetch(getRestaurantSuggestion + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAILED_FETCH_SUGGEST })

    const restaurant = await res.json()

    return dispatch({ type: FETCHED_SUGGEST_RESTAURANT, restaurant })
}

export const fetchRestaurantNearby = ({ lon, lat }) => async dispatch => {
    dispatch({ type: FETCHING_SUGGEST })

    const query = qs({
        lon,
        lat,
        cuisine: 1,
    })

    const [err, res] = await to(
        fetch(getNearbyRestaurant + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAILED_FETCH_SUGGEST })

    const restaurant_nearby = await res.json()

    const cuisines = Object.keys(restaurant_nearby)

    return dispatch({
        type: FETCHED_RESTAURANT_NEARBY,
        restaurant_nearby,
        cuisines,
    })
}

export const fetchMenuFromRestaurant = ({
    restaurant_ids,
    calories,
}) => async dispatch => {
    dispatch({ type: FETCHING_SUGGEST })

    const r_ids = restaurant_ids.join(',')

    const query = qs({
        restaurant_ids: r_ids,
        calories,
    })

    const [err, res] = await to(
        fetch(getMenusFromRestaurant + query, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            credentials: 'same-origin',
        })
    )
    if (err) return dispatch({ type: FAILED_FETCH_SUGGEST })

    const menus = await res.json()

    return dispatch({
        type: FETCHED_MENUS,
        menus,
    })
}
