import {
    handleUpdateDietPlan,
    handleInsertUpdateGoal,
} from '@handler/api/dietplan'
import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

export default function(r) {
    r.post(url.updatePlan, mustAuthenticate, handleUpdateDietPlan)
    r.post(url.insertUpdateGoal, mustAuthenticate, handleInsertUpdateGoal)
}
