// Institutional access grants (GM6, 2026-10-30, proposal). One issuer gives one subject a scoped, expiring right; the right can lapse or be
// suspended, and the subject's own skill is a separate fact that a lapse never touches. institution_store.js holds contribution and stock; this
// leaf holds the other half of an institution, who may do what here and until when. Pure: no world imports, no DOM, no clock, no save.
// Dials (term, scope, who may revoke) are per-world proposals set by the adapter, never fixed here.
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const natural = n => Number.isSafeInteger(n) && n >= 0;
export const ACCESS_STATES = Object.freeze(['active', 'expiring', 'expired', 'suspended']);

export function defineGrant(g) {
    if(g.expiresAt != null && !natural(g.expiresAt)) fail('A grant expiry is a whole number of minutes or open.');
    if(!natural(g.issuedAt)) fail('A grant records when it was issued.');
    const scope = (g.scope ?? []).map(s => ({id: text(s.id, 'Scope id'), label: text(s.label, 'Scope label')}));
    if(!scope.length) fail('A grant opens at least one thing.');
    return Object.freeze({id: text(g.id, 'Grant id'), issuer: text(g.issuer, 'Issuer'), subject: text(g.subject, 'Subject'), label: text(g.label, 'Grant label'),
        scope, notScope: (g.notScope ?? []).map(s => text(s, 'Closed line')), issuedAt: g.issuedAt, expiresAt: g.expiresAt ?? null,
        suspendedAt: g.suspendedAt ?? null, warnWithin: natural(g.warnWithin) ? g.warnWithin : 0});
}

// `retained` is the subject's own skill rows, passed through untouched: the proof that losing access is not losing ability.
export function accessStatus(grant, now, retained = []) {
    const left = grant.expiresAt == null ? null : grant.expiresAt - now;
    let state = 'active', why = 'Open.';
    if(grant.suspendedAt != null && now >= grant.suspendedAt) { state = 'suspended'; why = `${grant.issuer} has suspended it.`; }
    else if(left != null && left <= 0) { state = 'expired'; why = `It lapsed ${-left} minutes ago; ${grant.issuer} issues the next one.`; }
    else if(left != null && left <= grant.warnWithin) { state = 'expiring'; why = `It lapses in ${left} minutes.`; }
    const open = state === 'active' || state === 'expiring';
    return {state, why, left, opens: open ? grant.scope : [], closed: open ? grant.notScope : [...grant.scope.map(s => s.label), ...grant.notScope], retained: retained.map(r => ({...r}))};
}
