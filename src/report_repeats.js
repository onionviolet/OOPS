// Reports log: a non-combat line that repeats the newest line folds into "×N".
// Returns a stable key from message type and final text, or null when the line never folds.
// Combat kinds fold through combat_log.js; calendar day headers always stand alone.
export function reportRepeatKey(type, text, details = {}) {
    if (typeof type !== 'string' || typeof text !== 'string' || !text) return null;
    if (/^(?:hero|enemy)_/.test(type) || details.combat || details.calendarDate) return null;
    return `${type}\u0000${text}`;
}
