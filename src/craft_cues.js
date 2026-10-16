// Text only: expertise changes attention, never the result or its hidden properties.
// Bands are presentation choices, not unlocks: novice <10, practiced <50, master 50+.
// Keep channels explicit for a future body-specific consumer; no presenter yet.
export const CRAFT_CUES = {
    Woodworking: {sight: {
        novice: 'You notice the lines in the wood.',
        practiced: 'You follow the grain as its lines change direction.',
        master: 'You read changes in the grain before judging the finished surface.',
    }},
    Forging: {sight: {
        novice: "Light catches the metal's surface.",
        practiced: "You follow the reflected line across the metal's surface.",
        master: 'You read the reflection to judge the evenness of the finished surface.',
    }},
};

// result is the measured receipt (made), or the recipe preview (count).
// A failed or empty craft has no finished piece to describe.
export function craftCue(skillId, level, result) {
    if(typeof level !== 'number' || !Number.isFinite(level) || level < 0
        || !((result?.made ?? result?.count) > 0)) return '';
    const band = level < 10 ? 'novice' : level < 50 ? 'practiced' : 'master';
    return CRAFT_CUES[skillId]?.sight?.[band] || '';
}
