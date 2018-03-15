import { isEqual } from 'lodash'

export default function checkObjectStructure(
    objectToCheck = {},
    objectReference = {}
) {
    const key1 = Object.keys(objectToCheck).sort()
    const key2 = Object.keys(objectReference).sort()

    return isEqual(key1, key2)
}
