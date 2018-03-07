export const validateSanitizeGetFood = param => {
    const { query } = param

    if (typeof query === 'string') {
        if (query.length) {
            return [
                false,
                {
                    query,
                },
            ]
        }
    }

    return [true]
}
