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
    target_weight: {
        value: 0,
        tp: 0,
    },
    target_calories: 0,
    current_height: {
        value: 0,
        tp: 0,
    },
    activity: 0,
    birth_date: null,
}

export const validateSanitizeInsertUpdateGoal = param => {
    if (!eq(param, insertUpdateGoalParamType))
        return [
            'Invalid Parameter, parameter should contain: ' +
                JSON.stringify(insertUpdateGoalParamType),
        ]

    const {
        goal,
        gender,
        current_weight,
        target_weight,
        current_height,
        target_calories,
        activity,
        birth_date,
    } = param

    const { value: cw_val, tp: cw_tp } = current_weight
    const { value: ct_val, tp: ct_tp } = target_weight
    const { value: ch_val, tp: ch_tp } = current_height

    const gl = parseInt(goal)
    const gd = parseInt(gender)
    const cwv = parseInt(cw_val)
    const cwt = parseInt(cw_tp)
    const ctv = parseInt(ct_val)
    const ctt = parseInt(ct_tp)
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
    if (!(typeof ctv === 'number') && ct_val <= 0)
        return ['Target weight value has to be integer']
    if (!(typeof ctt === 'number') && ctt <= 0)
        return ['Target weight tp has to be integer']
    if (!(typeof chv === 'number') && chv <= 0)
        return ['Current height value has to be integer']
    if (!(typeof cht === 'number') && cht <= 0)
        return ['Current height tp has to be integer']
    if (!(typeof ac === 'number') && ac <= 0)
        return ['Activity  has to be integer']
    if (!(typeof target_calories === 'number') && target_calories <= 0)
        return ['Target calories has to be integer']

    return [
        false,
        {
            goal: gl,
            gender: gd,
            current_weight: {
                value: cwv,
                tp: cwt,
            },
            target_weight: {
                value: ctv,
                tp: ctt,
            },
            target_calories,
            current_height: {
                value: chv,
                tp: cht,
            },
            activity: ac,
            birth_date,
        },
    ]
}
