// L10: a character holds ladders as data (Weibao 2026-10-30, "Abilities: no hardcoded path"). World-neutral and pure: no host
// state, no save slice (AR3, AR12). A ladder row names its rungs; the lead's pathway is chosen from the catalog, and the
// book's own pathway is only the default. Moves between ladders are transition rows with costs and a failure hook:
//   swap     leave one ladder for a neighbouring one at a stated rung (the old rung is given up)
//   branch   take a second ladder and keep the first
//   demote   fall back by some rungs (cost: what the fall takes)
//   wrong    taking a rung out of order or from another ladder than the held one, which fails by the row's hook
// Every number a transition carries is an authored proposal (WPR5) and is listed in `unstated`; `failure.hook` is the opaque
// id of the backlash owner (GM32), as in ability_records.js.
import {check, deepFreeze, natural, object} from './basics.js';
import {definePath} from './ascension_paths.js';

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.-]*$/.test(v);
const text = v => typeof v === 'string' && v.length > 0;
export const transitionKinds = Object.freeze(['swap', 'branch', 'demote', 'wrong']);

// A ladder row -> an ascension path. Index 0 is the entry stage, so a rung's stage index is its position.
export function pathFromLadderRow(row) {
    check(object(row) && id(row.id) && id(row.world) && text(row.label) && Array.isArray(row.rungs) && row.rungs.length > 0, 'Invalid ladder row.');
    const entry = {id: 'ordinary', label: row.entryLabel || 'Ordinary life', crossings: [], grants: [...(row.entryGrants || ['No source'])]};
    return definePath({id: row.id, world: row.world, label: row.label, shape: 'ladder', stages: [entry, ...row.rungs.map(r => ({...r, grants: r.grants || []}))]});
}

function validateTransition(t, ladders) {
    check(object(t) && id(t.id) && text(t.label) && transitionKinds.includes(t.kind), `Invalid transition ${t?.id}.`);
    const from = ladders.get(t.from?.ladder);
    check(from, `Transition ${t.id} names an unknown source ladder.`);
    check(natural(t.from.min ?? 0) && natural(t.from.max ?? from.stages.length - 1), `Transition ${t.id} has a bad source range.`);
    if (t.kind === 'swap' || t.kind === 'branch') {
        const to = ladders.get(t.to?.ladder);
        check(to && t.to.ladder !== t.from.ladder && natural(t.to.position) && t.to.position < to.stages.length, `Transition ${t.id} needs a different target ladder and rung.`);
    }
    if (t.kind === 'demote') check(Number.isInteger(t.drop) && t.drop > 0, `Transition ${t.id} needs a positive drop.`);
    check((t.costs ?? []).every(c => object(c) && text(c.key) && Number.isFinite(c.amount)), `Transition ${t.id} has a bad cost.`);
    check((t.requires ?? []).every(r => object(r) && text(r.fact) && (r.need === true || natural(r.need)) && text(r.label)), `Transition ${t.id} has a bad requirement.`);
    check(t.failure === undefined || (object(t.failure) && text(t.failure.hook) && text(t.failure.signs) && text(t.failure.outcome)), `Transition ${t.id} has a bad failure.`);
    check(t.kind !== 'wrong' || t.failure, `Wrong-order transition ${t.id} needs a failure.`);
}

// catalog: {ladders: [ladder rows, the first marked default], transitions: [rows]}.
export function defineHoldings({ladders, transitions = []}) {
    check(Array.isArray(ladders) && ladders.length > 0, 'A catalog needs ladders.');
    const paths = new Map();
    for (const row of ladders) {
        const p = pathFromLadderRow(row);
        check(!paths.has(p.id), `Duplicate ladder ${p.id}.`);
        paths.set(p.id, p);
    }
    check(new Set(transitions.map(t => t?.id)).size === transitions.length, 'Duplicate transition id.');
    transitions.forEach(t => validateTransition(t, paths));
    const defaultLadder = (ladders.find(r => r.default) ?? ladders[0]).id;
    return deepFreeze({paths: Object.fromEntries(paths), transitions: structuredClone(transitions), defaultLadder});
}

// The lead's ladder is data: a requested id wins, otherwise the book's default. Unknown ids fail loudly.
export function startHoldings(def, ladderId = def.defaultLadder) {
    check(def.paths[ladderId], `Unknown ladder ${ladderId}.`);
    return {held: [{ladder: ladderId, position: 0}], active: ladderId};
}
const find = (h, ladder) => h.held.find(x => x.ladder === ladder);
const withHeld = (h, held, active = h.active) => ({held, active: held.some(x => x.ladder === active) ? active : held[0]?.ladder ?? null});

// A held position moves one rung at a time: the next rung is `position + 1`.
export function advanceHeld(def, h, ladder) {
    const at = find(h, ladder), path = def.paths[ladder];
    check(at && path, `Not holding ${ladder}.`);
    check(at.position + 1 < path.stages.length, `${ladder} has no rung above ${at.position}.`);
    return withHeld(h, h.held.map(x => x === at ? {...x, position: x.position + 1} : x));
}

// Taking a rung of a held ladder out of order (a skipped rung) or of a ladder the character does not hold fails by the
// rung's own failure text; a wrong-order row for the ladder may name a different hook. Returns {ok} or {ok:false, failure}.
export function intake(def, h, ladder, rung) {
    const path = def.paths[ladder];
    check(path && natural(rung) && rung > 0 && rung < path.stages.length, `Unknown rung ${ladder}:${rung}.`);
    const at = find(h, ladder), expected = at ? at.position + 1 : null;
    if (at && rung === expected) return {ok: true, holdings: advanceHeld(def, h, ladder)};
    const row = def.transitions.find(t => t.kind === 'wrong' && t.from.ladder === ladder && (t.from.min ?? 0) <= (at?.position ?? 0) && (at?.position ?? 0) <= (t.from.max ?? 99));
    const stageFailure = path.stages[rung].failure;
    const failure = row?.failure ?? (stageFailure ? {hook: `${ladder}.${path.stages[rung].id}.wrong_order`, ...stageFailure} : {hook: `${ladder}.wrong_order`, signs: 'The potion does not take', outcome: 'Loss of control'});
    return {ok: false, reason: at ? `Out of order: ${ladder} is at ${at.position}, not ${rung - 1}.` : `${ladder} is not held.`, failure, row: row?.id ?? null, holdings: h};
}

// What a transition asks and gives right now. `facts` is the host's supply; an absent fact reads as unmet.
export function transitionView(def, h, tr, facts = {}) {
    const t = typeof tr === 'string' ? def.transitions.find(x => x.id === tr) : tr;
    check(t, 'Unknown transition.');
    const at = find(h, t.from.ladder), refusedBy = [];
    if (!at) refusedBy.push(`not on ${def.paths[t.from.ladder].label}`);
    else if (at.position < (t.from.min ?? 0) || at.position > (t.from.max ?? 99)) refusedBy.push('rung out of range');
    for (const r of t.requires ?? []) {
        const v = facts[r.fact];
        if (!(r.need === true ? v === true : natural(v) && v >= r.need)) refusedBy.push(r.label);
    }
    if (t.kind === 'demote' && at && at.position - t.drop < 0) refusedBy.push('nothing left to fall back from');
    if ((t.kind === 'swap' || t.kind === 'branch') && find(h, t.to.ladder)) refusedBy.push('already held');
    return {id: t.id, label: t.label, kind: t.kind, eligible: refusedBy.length === 0 && t.kind !== 'wrong', refusedBy, costs: (t.costs ?? []).map(c => ({...c})),
        failure: t.failure ? {...t.failure} : null, stated: [...(t.stated ?? [])], unstated: [...(t.unstated ?? [])]};
}

// Applies an eligible transition. `outcome:'fail'` applies the row's failure instead of its move: `onFail` is `stay` (default),
// `demote:N`, or `lose` (the source ladder is given up). The failure hook is returned for its owner; nothing is paid here.
export function applyTransition(def, h, tr, facts = {}, {outcome = 'ok'} = {}) {
    const t = typeof tr === 'string' ? def.transitions.find(x => x.id === tr) : tr;
    const v = transitionView(def, h, t, facts);
    check(v.eligible, `${t.id} is not available: ${v.refusedBy.join('; ') || 'wrong-order rows are not chosen'}.`);
    const at = find(h, t.from.ladder);
    if (outcome === 'fail') {
        check(t.failure, `${t.id} states no failure.`);
        const f = t.onFail ?? 'stay';
        let next = h;
        if (f === 'lose') next = withHeld(h, h.held.filter(x => x !== at));
        else if (f.startsWith('demote:')) { const n = Number(f.slice(7)); next = withHeld(h, h.held.map(x => x === at ? {...x, position: Math.max(0, x.position - n)} : x)); }
        return {holdings: next, failure: {...t.failure}, costs: v.costs};
    }
    let held = h.held;
    if (t.kind === 'swap') held = [...held.filter(x => x !== at), {ladder: t.to.ladder, position: t.to.position}];
    else if (t.kind === 'branch') held = [...held, {ladder: t.to.ladder, position: t.to.position}];
    else if (t.kind === 'demote') held = held.map(x => x === at ? {...x, position: x.position - t.drop} : x);
    return {holdings: withHeld(h, held, t.kind === 'demote' ? h.active : t.to?.ladder ?? h.active), failure: null, costs: v.costs};
}

// Observer-safe list of what is held, each with its stage label (names only what the position reaches).
export const heldView = (def, h) => h.held.map(x => ({ladder: x.ladder, label: def.paths[x.ladder].label, position: x.position, stage: def.paths[x.ladder].stages[x.position].label, active: x.ladder === h.active}));
