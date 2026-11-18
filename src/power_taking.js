// PT1 (proposal, 2026-11-18): powers as targets. A holder can copy or absorb another holder's power, or negate it
// for a while. The rows are ordinary power rows in `simulation.powers.<actor>` (CHT4, AD51), so a taken power is
// used, shown and saved like any other; there is no second store and no new save slice (the expansion save carries
// `simulation.powers`, validated by `validatePowerTakingRecord` / `validateTakenMarks` from simulation_contracts).
//
// Two stages, kept apart (discourse F3): DELIVERY is a sentence landed through `landEffect` on a scratch W world
// (copy.working or block.working, aimed by contact, so a ward on the target stops it at the aim); PAYLOAD is what
// the delivery changes on the power rows (copy, move, suppress), and it has its own adjectives (what can be taken,
// capacity, borrowed powers, a power that refuses). A counter can stop one without the other.
//
// The intake rule is data on the holder's card (discourse F4: an absorb power is judged by its intake loop): what it
// takes, from whom, on what condition, how many it can keep and on what terms. Limits are adjectives of one
// specific power (CHT12); nothing here is a rule that every holder must have a weakness. Terms are CHT4 names:
// digested/gift/matured are permanent; lease ends at its time; loan returns to its source at its time; lien,
// leash, burdened-loan and bound-item are carried as data (recall by the source) and not yet modelled further.
import {check, natural} from './basics.js';
import {formatDuration} from './number_format.js';
import {validateCheatCard} from './cheat_cards.js';
import {landEffect} from './effect_host.js';
import {composeSubstrate, createWorld, applyWorldOps} from './world_substrate.js';
import {WORLD_QUANTITIES, WORLD_PROPERTIES} from './world_quantities.js';

export const PT_POWER = 'cheat.power_taking';
export const PT_KNOWLEDGE = 'cheat.pt.seen';
export const PT_DEFINITION = Object.freeze({id: PT_POWER, revision: 1, label: 'Power taking', model: 'practice', capacity: 1,
    execution: {fact: 'body.alive', op: 'eq', value: true}});
export const TERMS = Object.freeze(['gift', 'digested', 'matured', 'lease', 'loan', 'lien', 'leash', 'burdened-loan', 'bound-item']);
const TIMED = ['lease', 'loan'];
const RECALLABLE = ['loan', 'lien', 'leash', 'burdened-loan'];
const MODES = ['copy', 'absorb'];
const SCOPES = ['use', 'taking'];
const KIT_KEEP = 6;
const PACK = 'k.power_target';
const KINDS = ['copy', 'move', 'block', 'remove'].map(v => `effect.${v}.working`);

// Mara's intake (a default with its dial; any holder can carry another). She copies, never absorbs: the road
// duel is agreed and nonlethal, and nobody loses a power to it. She keeps two copies on a lease.
export const MARA_TAKING = Object.freeze({mode: 'copy', takes: 'one learned practice power, the one you know best',
    needs: 'a landed hit in an agreed duel', perDuel: 1, capacity: 2, terms: 'lease', minutes: 360,
    negate: Object.freeze({minutes: 120, scope: 'use', when: 'you lose the duel to her'})});

const minutesOf = (until, now) => Math.max(0, until - now);
const text = value => typeof value === 'string' && value.trim().length > 0;
const label = (registry, id) => registry?.simulation?.powers?.get(id)?.label ?? id;
const rows = (state, id) => state.simulation.powers[id] ??= {};

export function ensurePowerTaking(state, holderId, intake = MARA_TAKING) {
    const powers = rows(state, holderId);
    if (!powers[PT_POWER]) powers[PT_POWER] = {revision: 1, owned: true, mastery: 0, fragments: [], executions: 0,
        card: {id: 'power-taking', family: 'taking', name: 'Power taking', ui: 'quiet', terms: 'matured', hooks: ['native-contest.hit'],
            state: {revision: 1, holderId, intake: structuredClone(intake), kit: [], lastSession: null, last: null},
            stages: [], observers: [], sources: [{route: 'native-contest', at: state.clock}]}};
    validatePowerTakingRecord(powers[PT_POWER], holderId);
    return powers[PT_POWER];
}

const validNegate = n => n === undefined || (n && natural(n.minutes) && n.minutes > 0 && SCOPES.includes(n.scope) && text(n.when));
export function validatePowerTakingRecord(record, holderId) {
    validateCheatCard(record?.card);
    const s = record.card.state, i = s.intake;
    check(record.card.id === 'power-taking' && s.revision === 1 && s.holderId === holderId && i && MODES.includes(i.mode) &&
        text(i.takes) && text(i.needs) && natural(i.perDuel) && natural(i.capacity) && TERMS.includes(i.terms) &&
        (!TIMED.includes(i.terms) || (natural(i.minutes) && i.minutes > 0)) && validNegate(i.negate) &&
        (s.lastSession === null || typeof s.lastSession === 'string') && (s.last === null || (text(s.last?.text) && natural(s.last.at))) &&
        Array.isArray(s.kit) && s.kit.length <= 40 && s.kit.every(k => text(k.powerId) && text(k.from) && MODES.includes(k.mode) &&
            TERMS.includes(k.terms) && natural(k.at) && (k.until === null || natural(k.until)) && typeof k.observed === 'boolean' &&
            ['held', 'returned', 'ended', 'recalled'].includes(k.status)), 'Invalid power-taking record.');
}

// Marks on ordinary rows: `taken` on the taker's row, `takenBy` on a source's row, `suppressed` on a negated row.
export function validateTakenMarks(p) {
    const t = p.taken;
    check(t === undefined || (text(t.from) && MODES.includes(t.mode) && TERMS.includes(t.terms) && natural(t.at) && (t.until === null || natural(t.until))),
        'Invalid taken power mark.');
    check(p.takenBy === undefined || (Array.isArray(p.takenBy) && p.takenBy.length <= 8 && p.takenBy.every(m => text(m.by) && MODES.includes(m.mode) &&
        TERMS.includes(m.terms) && natural(m.at) && (m.until === null || natural(m.until)))), 'Invalid taken-by mark.');
    check(p.suppressed === undefined || (text(p.suppressed.by) && natural(p.suppressed.until) && natural(p.suppressed.at) && SCOPES.includes(p.suppressed.scope)),
        'Invalid suppressed mark.');
}

export const suppression = (row, now, scope = 'use') => row?.suppressed && row.suppressed.scope === scope && row.suppressed.until > now ? row.suppressed : null;

// The one gate the power commands read (simulation.js): a suppressed or lapsed row is not usable.
export function takenUseReason(row, now) {
    const s = suppression(row, now);
    if (s) return `${s.by === 'roadRival' ? 'Mara' : s.by} is holding this power shut for ${formatDuration(s.until - now)} more.`;
    if (row?.taken?.until != null && row.taken.until <= now) return 'This borrowed power has run out.';
    return null;
}

// ---- delivery: one sentence landed on a scratch W world (never saved) ----
const pack = {id: PACK, revision: 0, hears: KINDS, reactors: [{id: 'deliver', on: KINDS, appliesTo: h => h.kind === 'body',
    react(view, id, effect) {
        const {targets, working} = effect.detail?.application ?? {};
        if (!targets?.includes(id)) return [];
        const now = view.state(id) ?? {};
        return [{op: 'state', holder: id, value: {...now, delivered: [...(now.delivered ?? []), {kind: effect.kind, working, by: effect.by}]}}];
    }}]};
const rules = composeSubstrate({packs: [{id: 'w.vocabulary', quantities: Object.values(WORLD_QUANTITIES), properties: Object.values(WORLD_PROPERTIES)}, pack]});
// copy duplicates a row, move carries it off its source (absorb), block shuts it, remove strips it.
const SENTENCE = verb => ({verb, object: 'working', target: 'touched', time: 'instant', carrier: 'strike', cost: 'none', limits: []});

// A ward is a held power whose definition says it blocks these verbs (`taking: {ward: ['copy', 'block']}`).
function wardOn(state, registry, targetId, verb) {
    for (const [id, p] of Object.entries(state.simulation.powers[targetId] ?? {})) {
        if (p.owned && registry.simulation.powers.get(id)?.taking?.ward?.includes(verb === 'move' ? 'copy' : verb)) return id;
    }
    return null;
}

export function deliver(state, registry, {byId, targetId, powerId, verb}) {
    const ward = wardOn(state, registry, targetId, verb);
    const body = id => ({id, kind: 'body', place: 'duel', properties: {alive: true}});
    let world = createWorld(rules, {clock: state.clock, holders: [{id: 'duel', kind: 'place'}, body(byId), body(targetId)]});
    if (ward) world = applyWorldOps(rules, world, [{op: 'law_add', field: {id: `ward.${ward}`, scope: targetId, kind: 'block',
        params: {verb, object: '*', spellObject: 'working'}}}], 'power-taking:ward');
    const landed = landEffect(rules, world, {sentence: SENTENCE(verb), details: {target: {shape: 'holder', id: targetId}, working: powerId,
        contact: {from: byId, links: 0}}}, {cause: `power-taking:${verb}:${state.clock}`, by: byId});
    // A publish reads "published" whether or not it was heard: success is what the reactor wrote.
    const heard = landed.world.holders[targetId]?.state?.[PACK]?.delivered?.some(d => d.kind === `effect.${verb}.working` && d.working === powerId);
    return {ok: !!heard, status: landed.status, reason: heard ? null : landed.reason ?? 'Nothing answered the effect.', ward};
}

// ---- payload ----
const LABELS = {'roadRival': 'Mara'};
const who = id => LABELS[id] ?? (id === 'player' ? 'you' : id);
function candidate(state, registry, takerId, targetId, intake) {
    const mine = state.simulation.powers[takerId] ?? {};
    const held = Object.entries(state.simulation.powers[targetId] ?? {}).filter(([id, p]) => p.owned && !id.startsWith('cheat.') && registry.simulation.powers.has(id));
    if (!held.length) return {reason: `${who(targetId) === 'you' ? 'You hold' : `${who(targetId)} holds`} no learned power to take.`};
    const open = held.filter(([id, p]) => !p.taken && !suppression(p, state.clock, 'taking') && !registry.simulation.powers.get(id).taking?.refuses && !mine[id]?.owned);
    if (!open.length) {
        const [id, p] = held[0], def = registry.simulation.powers.get(id);
        return {reason: p.taken ? `${label(registry, id)} is borrowed, so there is nothing of it to take.` : def.taking?.refuses ? def.taking.refuses :
            suppression(p, state.clock, 'taking') ? `${label(registry, id)} is held shut against taking.` : `${who(takerId)} already hold${takerId === 'player' ? '' : 's'} ${label(registry, id)}.`};
    }
    open.sort(([a, x], [b, y]) => y.mastery - x.mastery || (a < b ? -1 : 1));
    return {powerId: open[0][0]};
}

function terms(intake, now) {
    return {terms: intake.terms, until: TIMED.includes(intake.terms) ? now + intake.minutes : null};
}

// One attempt at taking from `targetId`. Returns {ok, text, observed} and writes the holder's `last` line (the inspector line:
// why it resolved as it did). `observed` is the sentence the target (the player) may learn; it never carries what the target cannot see.
export function attemptTaking(state, registry, {takerId, targetId, sessionId = null}) {
    const record = state.simulation.powers[takerId]?.[PT_POWER];
    if (!record?.owned) return null;
    validatePowerTakingRecord(record, takerId);
    const s = record.card.state, i = s.intake;
    if (sessionId && s.lastSession === sessionId) return null;
    s.lastSession = sessionId;
    const say = (ok, line, observed) => { s.last = {text: line, at: state.clock}; return {ok, text: line, observed: observed ?? null}; };
    settleTakenPowers(state);
    if (s.kit.filter(k => k.status === 'held').length >= i.capacity)
        return say(false, `${who(takerId)} kept the delivery but the kit is full (${i.capacity} held), so nothing was ${i.mode === 'copy' ? 'copied' : 'absorbed'}.`);
    const pick = candidate(state, registry, takerId, targetId, i);
    if (!pick.powerId) return say(false, `Delivery not tried: ${pick.reason}`, `${who(takerId)} reached for a power of yours and found nothing to take.`);
    const sent = deliver(state, registry, {byId: takerId, targetId, powerId: pick.powerId, verb: i.mode === 'absorb' ? 'move' : 'copy'});
    const name = label(registry, pick.powerId);
    if (!sent.ok) return say(false, `Delivery stopped: ${sent.reason}${sent.ward ? ` (${label(registry, sent.ward)} answers copying)` : ''} ${name} stayed where it was.`,
        `Something reached for ${name} and was turned aside.`);
    const {terms: t, until} = terms(i, state.clock), src = state.simulation.powers[targetId][pick.powerId];
    const mark = {by: takerId, mode: i.mode, terms: t, at: state.clock, until};
    (src.takenBy ??= []).push(mark); src.takenBy = src.takenBy.slice(-8);
    rows(state, takerId)[pick.powerId] = {revision: src.revision, owned: true, mastery: src.mastery, fragments: [], executions: 0,
        cause: `power-taking:${state.clock}`, lineage: [], taken: {from: targetId, mode: i.mode, terms: t, at: state.clock, until}};
    if (i.mode === 'absorb') src.owned = false;
    s.kit.push({powerId: pick.powerId, from: targetId, mode: i.mode, terms: t, at: state.clock, until, observed: targetId === 'player', status: 'held'});
    s.kit = trimKit(s.kit);
    const mode = i.mode === 'copy' ? 'copied' : 'absorbed', span = until === null ? 'for good' : `for ${formatDuration(until - state.clock)}`;
    return say(true, `Delivered, then taken: ${name} ${mode} from ${who(targetId)} (${t}, ${span}). Intake: ${i.takes}, ${i.needs}.`,
        `${who(takerId)} ${mode} your ${name} (${t}, ${until === null ? 'permanent' : `ends in ${formatDuration(minutesOf(until, state.clock))}`}).`);
}
const trimKit = kit => [...kit.filter(k => k.status === 'held'), ...kit.filter(k => k.status !== 'held').slice(-KIT_KEEP)];

// Negate: block a target power's use (or its being taken) for a stated scope and time.
export function negatePower(state, registry, {byId, targetId, powerId, minutes, scope = 'use'}) {
    check(natural(minutes) && minutes > 0 && SCOPES.includes(scope), 'A negation needs whole minutes and a scope.');
    const row = state.simulation.powers[targetId]?.[powerId], name = label(registry, powerId);
    if (!row?.owned) return {ok: false, text: `Nothing to negate: ${who(targetId)} do${targetId === 'player' ? '' : 'es'} not hold ${name}.`};
    const sent = deliver(state, registry, {byId, targetId, powerId, verb: 'block'});
    if (!sent.ok) return {ok: false, text: `Negation stopped at delivery: ${sent.reason} ${name} is untouched.`};
    row.suppressed = {by: byId, until: state.clock + minutes, at: state.clock, scope};
    return {ok: true, text: `${who(byId)} held ${name} shut against ${scope === 'use' ? 'use' : 'taking'} for ${formatDuration(minutes)}.`};
}

// The holder's own negate move (card `intake.negate`): after the duel is lost, she shuts the power she copied from you.
export function negateAfterWin(state, registry, {takerId, targetId}) {
    const record = state.simulation.powers[takerId]?.[PT_POWER];
    const n = record?.card.state.intake.negate;
    if (!n) return null;
    const s = record.card.state, entry = [...s.kit].reverse().find(k => k.status === 'held' && k.from === targetId);
    if (!entry) return null;
    const out = negatePower(state, registry, {byId: takerId, targetId, powerId: entry.powerId, minutes: n.minutes, scope: n.scope});
    s.last = {text: `${out.text} Condition: ${n.when}.`, at: state.clock};
    return {...out, observed: out.ok ? `${who(takerId)} held your ${label(registry, entry.powerId)} shut for ${formatDuration(n.minutes)}.` : null};
}

// Lapse: a lease ends, a loan returns to its source. Called at each simulation boundary.
export function settleTakenPowers(state) {
    let work = 0, now = state.clock;
    for (const [takerId, powers] of Object.entries(state.simulation.powers)) {
        const kit = powers[PT_POWER]?.card.state.kit ?? [];
        for (const entry of kit) {
            if (entry.status !== 'held' || entry.until === null || entry.until > now) continue;
            const mine = powers[entry.powerId], src = state.simulation.powers[entry.from]?.[entry.powerId];
            if (mine?.taken?.at === entry.at) delete powers[entry.powerId];
            if (src) { src.takenBy = (src.takenBy ?? []).filter(m => !(m.by === takerId && m.at === entry.at)); if (!src.takenBy.length) delete src.takenBy; }
            if (entry.mode === 'absorb' && entry.terms === 'loan' && src) src.owned = true;
            entry.status = entry.terms === 'loan' ? 'returned' : 'ended'; work++;
        }
    }
    return work;
}

// Recall by a source under lien, leash, burdened-loan or loan terms (the source asks for it back).
export function recallTaken(state, {takerId, powerId}) {
    const entry = state.simulation.powers[takerId]?.[PT_POWER]?.card.state.kit.find(k => k.powerId === powerId && k.status === 'held');
    if (!entry || !RECALLABLE.includes(entry.terms)) return false;
    entry.until = state.clock; settleTakenPowers(state); entry.status = 'recalled'; return true;
}

// ---- views (what a sheet or panel prints) ----
export function powerSheet(state, registry, actorId, {asObserver = null} = {}) {
    const now = state.clock, out = [];
    for (const [id, p] of Object.entries(state.simulation.powers[actorId] ?? {})) {
        if (id.startsWith('cheat.') || !registry.simulation.powers.has(id)) continue;
        const s = suppression(p, now);
        const note = [];
        if (p.taken) note.push(`borrowed from ${who(p.taken.from)} (${p.taken.terms}${p.taken.until === null ? '' : `, ${formatDuration(p.taken.until - now)} left`})`);
        for (const m of p.takenBy ?? []) note.push(`${m.mode === 'copy' ? 'copy held by' : 'taken by'} ${who(m.by)} (${m.terms}${m.until === null ? '' : `, ${formatDuration(m.until - now)} left`})`);
        if (s) note.push(`held shut by ${who(s.by)} for ${formatDuration(s.until - now)} more`);
        if (!p.owned && !(p.takenBy ?? []).some(m => m.mode === 'absorb')) continue;
        out.push({id, label: label(registry, id), owned: p.owned, note});
    }
    return out;
}
// A holder's stored kit as the observer may know it: entries the observer saw (the holder's own sheet shows all).
export function storedKit(state, registry, holderId, observer = holderId) {
    const kit = state.simulation.powers[holderId]?.[PT_POWER]?.card.state.kit ?? [];
    return kit.filter(k => observer === holderId || k.observed).map(k => ({powerId: k.powerId, label: label(registry, k.powerId),
        from: k.from, mode: k.mode, terms: k.terms, left: k.until === null ? null : Math.max(0, k.until - state.clock), status: k.status}));
}
export const takingIntake = (state, holderId) => state.simulation.powers[holderId]?.[PT_POWER]?.card.state.intake ?? null;
export const takingWhy = (state, holderId) => state.simulation.powers[holderId]?.[PT_POWER]?.card.state.last?.text ?? '';

// A holder who has not yet met anyone with a learned power gets no record: ensure only when the target holds something to take,
// so fights with nothing at stake leave their saves exactly as they were. Holders with a record already keep it.
export function takeOnHit(state, registry, {takerId, targetId, sessionId, intake}) {
    const holds = Object.entries(state.simulation.powers[targetId] ?? {}).some(([id, p]) => p.owned && !id.startsWith('cheat.') && registry.simulation.powers.has(id));
    if (!holds && !state.simulation.powers[takerId]?.[PT_POWER]) return null;
    ensurePowerTaking(state, takerId, intake);
    return attemptTaking(state, registry, {takerId, targetId, sessionId});
}
