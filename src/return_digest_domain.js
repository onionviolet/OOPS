import {registerDomain} from './domain_registry.js';
// Return digest marker (TIME_AND_CHRONICLE, B1/UC-A1). Owns one namespaced save slice,
// `returnDigest: {schema: 1, seenAt}`: the expansion clock at which the player last marked the
// digest read. A save without the slice starts at the current clock, so old saves never replay
// their whole history (compatibility decision, no engine schema bump).
let seenAt = null, ports = null;
export function configureReturnDigest(operations) {ports = operations;}
const clock = () => ports?.root?.()?.clock ?? null;

export function validateReturnDigest(slice) {
    if (slice == null) return slice;
    if (typeof slice !== 'object' || Array.isArray(slice) || Object.keys(slice).sort().join(',') !== 'schema,seenAt' ||
        slice.schema !== 1 || !Number.isSafeInteger(slice.seenAt) || slice.seenAt < 0) throw new Error('Invalid return digest marker.');
    return slice;
}
// The marker the digest reads: baselined lazily once the expansion clock exists, clamped so an
// imported earlier save never sits ahead of its own clock.
function marker() {
    const now = clock();
    if (now == null) return seenAt;
    if (seenAt == null || seenAt > now) seenAt = now;
    return seenAt;
}
export function markReturnDigestRead() {
    if (ports?.writable?.() === false) throw new Error('Saving is unavailable, so this stays unread.');
    const now = clock();
    if (now == null) throw new Error('The game is still loading.');
    const previous = seenAt;
    seenAt = now;
    try {ports.persist(() => {});}
    catch (error) {seenAt = previous; throw error;}
}
registerDomain({id: 'returnDigest', initialState: () => null,
    save: () => {const at = marker(); return at == null ? undefined : {schema: 1, seenAt: at};},
    validate: slice => {validateReturnDigest(slice);},
    load: slice => {seenAt = validateReturnDigest(slice)?.seenAt ?? null;},
    projection: () => ({seenAt: marker(), writable: ports?.writable?.() !== false}),
    commands: {markRead: markReturnDigestRead}});
