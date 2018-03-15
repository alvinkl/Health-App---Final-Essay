import eq from '@helper/checkObjectStructure'

const updateDietPlanParamType = {
    target_calories: 0,
    target_weight: 0,
}

export const validateSanitizeUpdatePlan = param => {
    if (!eq(param, updateDietPlanParamType)) return ['Invalid parameter!']

    const { target_calories, target_weight } = param
    const tc = parseInt(target_calories)
    const tw = parseInt(target_weight)

    if (!(typeof tc === 'number') && target_calories <= 0)
        return ['Total Calories has to be integer']
    if (!(typeof tw === 'number') && target_weight <= 0)
        return ['Total Calories has to be integer']

    return [
        false,
        {
            target_calories: tc,
            target_weight: tw,
        },
    ]
}
