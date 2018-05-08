import { mustAuthenticate } from '../middleware'
import * as url from '@urls'

import * as h from '@server/handler/api/workout'

export default function(r) {
    r.get(url.getWorkoutInfo, mustAuthenticate, h.handleGetWorkoutInfo)

    r.post(url.insertWorkout, mustAuthenticate, h.handleInsertWorkout)
}
