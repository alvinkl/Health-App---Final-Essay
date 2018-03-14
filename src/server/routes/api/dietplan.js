import { handleUpdateDietPlan } from '@handler/api/dietplan'
import { mustAuthenticate } from '../middleware'

export default function(r) {
    r.post('/api/updatePlan', mustAuthenticate, handleUpdateDietPlan)
}
