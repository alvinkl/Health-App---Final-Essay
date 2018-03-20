import {
    handleUpdateDietPlan,
    handleInsertUpdateGoal,
} from '@handler/api/dietplan'
import { mustAuthenticate } from '../middleware'

export default function(r) {
    r.post('/api/updatePlan', mustAuthenticate, handleUpdateDietPlan)
    r.post('/api/insertUpdateGoal', mustAuthenticate, handleInsertUpdateGoal)
}
