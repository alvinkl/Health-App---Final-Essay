import eq from '@helper/checkObjectStructure'

const addFeedType = {
    title: '',
    subtitle: '',
    image: '',
    location: {},
    address: '',
}

export const validateAddFeed = param => {
    if (!eq(param, addFeedType)) return ['Parameter is invalid']

    const { title, subtitle, image, location, address } = param

    let loc = JSON.parse(location)
    loc = {
        ...loc,
        address,
    }

    return [
        false,
        {
            title,
            subtitle,
            image,
            location: loc,
        },
    ]
}

const addLikeType = {
    post_id: 0,
}

export const validateToggleLike = param => {
    if (!eq(param, addLikeType))
        return ['Parameter is invalid, post_id is required!']

    return [false, param.post_id]
}
