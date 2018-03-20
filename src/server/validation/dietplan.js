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

const insertUpdateGoalParamType = {
    goal: 0,
    gender: 0,
    current_weight: {
        value: 0,
        tp: 0,
    },
    current_height: {
        value: 0,
        tp: 0,
    },
    activity: 0,
}

export const validateSanitizeInsertUpdateGoal = param => {
    if (!eq(param, insertUpdateGoalParamType))
        return [
            'Invalid Parameter, parameter should contain: ' +
                JSON.stringify(insertUpdateGoalParamType),
        ]

    const { goal, gender, current_weight, current_height, activity } = param

    const { value: cw_val, tp: cw_tp } = JSON.parse(current_weight)
    const { value: ch_val, tp: ch_tp } = JSON.parse(current_height)

    const gl = parseInt(goal)
    const gd = parseInt(gender)
    const cwv = parseInt(cw_val)
    const cwt = parseInt(cw_tp)
    const chv = parseInt(ch_val)
    const cht = parseInt(ch_tp)
    const ac = parseInt(activity)

    if (!(typeof gl === 'number') && goal <= 0)
        return ['Goal has to be integer']
    if (!(typeof gd === 'number') && gender <= 0)
        return ['Gender has to be integer']
    if (!(typeof cwv === 'number') && cw_val <= 0)
        return ['Current weight value has to be integer']
    if (!(typeof cwt === 'number') && cwt <= 0)
        return ['Current weight tp has to be integer']
    if (!(typeof chv === 'number') && chv <= 0)
        return ['Current height value has to be integer']
    if (!(typeof cht === 'number') && cht <= 0)
        return ['Current height tp has to be integer']
    if (!(typeof ac === 'number') && ac <= 0)
        return ['Activity  has to be integer']

    return [
        false,
        {
            goal: gl,
            gender: gd,
            current_weight: {
                value: cwv,
                tp: cwt,
            },
            current_height: {
                value: chv,
                tp: cht,
            },
            activity: ac,
        },
    ]
}
