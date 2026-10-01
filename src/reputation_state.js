// Saved totals are authoritative. Older saves without totals use reconstruction.
export function shouldReplayReputation(region, saved) {
    return saved == null || !Object.hasOwn(saved, region);
}

export function restoreSavedReputation(current, saved) {
    if(saved == null) return {...current};
    if(typeof saved !== "object" || Array.isArray(saved)) throw new Error("Saved reputation must be an object.");
    const result = {...current};
    for(const [region, value] of Object.entries(saved)) {
        if(!Object.hasOwn(current, region) || !Number.isSafeInteger(value)) {
            throw new Error("Saved reputation contains an unsupported region or invalid total.");
        }
        result[region] = value;
    }
    return result;
}
