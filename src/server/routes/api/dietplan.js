import * as funcs from '@handler/api/dietplan'
import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

export default function(r) {
    r.post(
        url.getRecommendedCalories,
        mustAuthenticate,
        funcs.handleGetRecommendedCalories
    )

    r.post(url.updatePlan, mustAuthenticate, funcs.handleUpdateDietPlan)
    r.post(url.insertUpdateGoal, mustAuthenticate, funcs.handleInsertUpdateGoal)
    r.post(
        url.updateTargetCalories,
        mustAuthenticate,
        funcs.handleUpdateTargetCalories
    )
    r.post(url.updateWeight, mustAuthenticate, funcs.handleUpdateWeight)
}
