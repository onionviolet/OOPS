// PL-H1 (protagonist-life PLAN section 4; CANON_PROTAGONIST_INTERACTIONS PX64, reduced): the Village
// mini-line as the engine harness. DATA ONLY: five dated beats over facts and places the Village
// already names (src/village_content.js). The old craftsman is the lead NPC. No engine verb is
// invented, no save field is added, nothing registers this pack: callers pass it to
// resolveBeats (src/beat_records.js). Original and public; nothing here is sealed.
// PROPOSAL (labels are I: authored for the harness, not accepted canon).
import {defineBeats} from '../beat_records.js';

export const LEAD_ID = 'oldCraftsman';    // the existing Village dialogue id, used as the lead's life id
export const LEAD_LINE_ID = 'village.lead_line';

const eq = (fact, value) => ({fact, op: 'eq', value});
const set = (fact, value) => ({fact, value});

// Pack records (PX64 check 2): every fact a beat reads or writes, with the Village record it
// resolves to. `record` names the id or key in src/village_content.js the test greps for.
export const LEAD_FACTS = Object.freeze({
    'village.craftsmanPresent': {record: 'village.craftsmanPresent', role: 'input', initial: true},
    'village.teacherHours': {record: 'village.teacherHours', role: 'input', initial: true},
    'perception': {record: 'perception', role: 'input', initial: 3},
    'campaign.anchor': {record: 'campaign.anchor', role: 'input', initial: true},
    'village.discovered': {record: 'village.discovered', role: 'written'},
    'village.craftsmanMet': {record: 'village.craftsmanMet', role: 'written'},
    'village.tokenReturned': {record: 'village.tokenReturned', role: 'written'},
    'village.routeKnown': {record: 'village.routeKnown', role: 'written'},
    'village.routeOrigin': {record: 'village.routeOrigin', role: 'written'},
    'village.surveyed': {record: 'surveyed', role: 'written'},
    'crossing': {record: 'crossing', role: 'written'},
    'guide.condition': {record: 'guide.condition', role: 'written'},
    'village.circleOpen': {record: 'village.circleOpen', role: 'written'},
});
export const leadStartFacts = () => Object.fromEntries(Object.entries(LEAD_FACTS)
    .filter(([, f]) => f.role === 'input').map(([k, f]) => [k, f.initial]));

// Two world days keep the bot run cheap (the headless stepper costs about 14 s per world day); beats on one
// day resolve in table order, each seeing the facts the earlier ones wrote.
// Place ids are Village world locations. Dates are dayIndex (played calendar day_count, PL-E0).
const places = {footprint: ['Village'], aftermath: ['Shack']};
export const VILLAGE_BEATS = defineBeats([
    {id: 'vl.waypost_checked', dayIndex: 2, kind: 'detail', actor: LEAD_ID, label: 'I',
        effects: [set('village.discovered', true)], scope: places,
        notes: {heard: 'Word is the old marker by the fence was looked over.', aftermath: 'The marker has been moved a hand-width.'}},
    {id: 'vl.token_returned', dayIndex: 2, until: 3, kind: 'great', actor: LEAD_ID, label: 'I',
        deps: [{id: 'vl.waypost_checked', kind: 'needs'}],
        needs: [eq('village.craftsmanPresent', true), eq('village.discovered', true)],
        effects: [set('village.craftsmanMet', true), set('village.tokenReturned', true)], scope: places,
        notes: {heard: 'The craftsman got a brass token back, they say.', aftermath: 'His bench has a new brass token on it.',
            present: 'The craftsman turns a brass token over and nods.'}},
    {id: 'vl.route_taught', dayIndex: 3, until: 4, kind: 'great', actor: LEAD_ID, label: 'I',
        deps: [{id: 'vl.token_returned', kind: 'needs'}],
        needs: [eq('village.craftsmanPresent', true), eq('village.teacherHours', true)],
        altered: [{when: {all: [eq('village.teacherHours', false), {fact: 'perception', op: 'gte', value: 3}]},
            effects: [set('village.routeKnown', true), set('village.routeOrigin', 'field')],
            notes: {heard: 'Nobody taught it; someone worked the drainage marks out alone.'}}],
        effects: [set('village.routeKnown', true), set('village.routeOrigin', 'teacher')], scope: places,
        notes: {heard: 'The craftsman explained the drainage marks to someone.', aftermath: 'Chalk marks on the bench show the drainage cuts.'}},
    {id: 'vl.dry_bank_surveyed', dayIndex: 3, until: 4, kind: 'great', actor: LEAD_ID, label: 'I',
        deps: [{id: 'vl.route_taught', kind: 'needs'}],
        needs: [eq('village.routeKnown', true), eq('campaign.anchor', true)],
        effects: [set('village.surveyed', true), set('crossing', 'unrepaired'), set('guide.condition', 'ready')], scope: places,
        notes: {heard: 'The dry-bank path is mapped; the crossing is still down.', aftermath: 'Fresh drainage-cut marks line the bank path.'}},
    {id: 'vl.morning_circle_held', dayIndex: 3, kind: 'detail', actor: LEAD_ID, label: 'I',
        needs: [eq('guide.condition', 'ready')],
        effects: [set('village.circleOpen', true)], scope: places,
        notes: {heard: 'The morning circle met again.', aftermath: 'Chalk directions are left from the morning circle.'}},
]);

const ruleFacts = r => r == null ? [] : Array.isArray(r) ? r.flatMap(ruleFacts) : r.all ? r.all.flatMap(ruleFacts) : [r.fact];

/** PX64 check 1: one row per beat with date, place, dependencies, touched facts and label. */
export function villageLeadRunRows(beats = VILLAGE_BEATS) {
    return beats.map(b => ({beat: b.id, order: b.order, date: {calendar: 'played', dayIndex: b.dayIndex, until: b.until ?? b.dayIndex},
        place: b.scope.footprint[0], deps: (b.deps ?? []).map(d => ({id: d.id, kind: d.kind})),
        touched: [...new Set([...ruleFacts(b.needs), ...b.effects.map(e => e.fact),
            ...(b.altered ?? []).flatMap(a => [...ruleFacts(a.when), ...a.effects.map(e => e.fact)])])],
        weight: b.kind, label: b.label}));
}
