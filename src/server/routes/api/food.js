import { handleGetFood } from '@server/handler/api/food'

export default function(r) {
    r.get('/api/food', handleGetFood)
}
