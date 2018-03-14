import eq from '@helper/checkObjectStructure'

const getFoodType = {
    query: '',
}

export const validateSanitizeGetFood = param => {
    if (!eq(param, getFoodType)) return ['Invalid parameter!']

    const { query } = param

    if (!(typeof query === 'string') || !query) {
        return ['Invalid query']
    }

    return [
        false,
        {
            query,
        },
    ]
}
