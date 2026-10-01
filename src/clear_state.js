export function hasEarnedClear(groupsKilled, groupsPerClear, requiredClears = 1) {
    return Number.isSafeInteger(groupsKilled) && groupsKilled >= 0 &&
        Number.isSafeInteger(groupsPerClear) && groupsPerClear > 0 &&
        Number.isSafeInteger(requiredClears) && requiredClears > 0 &&
        groupsKilled >= groupsPerClear * requiredClears;
}
