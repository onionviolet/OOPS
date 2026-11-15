// The will contest for claiming a Gu (RWT19, RWT34; foundation run 2026-11-14; proposal under AD32 and AD56). Pure leaf over the shared
// working kernel (kernel_working.js, RWT16): the essence a claim takes and the chance it holds both come from the Gu's will set against
// the refiner's, and the step publishes them as KW15 costs and odds, so the kernel's draw port (KW6, E11) decides a slip.
// Canon basis: a Gu master refines a Gu by pouring essence into it until his will wears out the Gu's own (RIG12; ch10 for the sea
// scale); a stronger aura cows a Gu (ch162). Every number is a dial with its reason, and "authored" means no source gives a figure.
// Identity settlement stays in gu_refinement.js; this file owns only the contest.
import {defineWorkingLaw, settleWorking, beginWorking, quoteWorking} from './kernel_working.js';
import {drawU32} from './gen_kit.js';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export const GU_WILL_DIALS = Object.freeze({
    gu: Object.freeze({
        perRank: Object.freeze({value: 8, why: 'Authored: a rank is the largest single gap between Gu and master, since a stronger aura cows a weaker Gu outright (ch162).'}),
        // Kind temperament (default 0): how stubborn the kind is. Authored from what the kinds do in the readings.
        temperament: Object.freeze({'little-light': 0, moonlight: 1, 'stealth-rock': 3, 'liquor-worm': 4, 'vitality-leaf': -2}),
        temperamentWhy: 'Authored: a stone-still Gu holds its ground (ch121), a worm that flees fights being held (ch7, ch14), a detached leaf barely resists (ch102).',
        hungerRelief: Object.freeze({value: 2, why: 'Authored: a hungry Gu takes essence eagerly (Gu live on it), so each level of hunger (0 fed to 3 starving) takes this much off its will.'}),
        injuryRelief: Object.freeze({value: 3, why: 'Authored: a hurt Gu has less to resist with.'}),
        waryPer: Object.freeze({value: 2, why: 'Authored (RWT19): a Gu that slipped a hold is warier, so each failed try adds this much to its will.'}),
        imprintPer: Object.freeze({value: 6, why: 'Authored (RWT34): another master\'s will is already on the Gu, so each point of the mark\'s strength adds this much to what must be worn down.'}),
    }),
    refiner: Object.freeze({
        perRank: Object.freeze({value: 8, why: 'Authored: the same step as the Gu\'s rank, so equal ranks meet evenly.'}),
        perRealm: Object.freeze({value: 2, why: 'Authored: each realm inside a rank (0 initial, 1 middle, 2 upper, 3 peak) adds a little, less than a whole rank.'}),
        steadiness: Object.freeze({value: 2, max: 4, why: 'Authored: a calm mind holds a hold. Default 2 until a character stat owner supplies it.'}),
    }),
    odds: Object.freeze({
        base: Object.freeze({value: 700, why: 'Authored: whole permille when the wills are even; a hold between equals usually holds.'}),
        slope: Object.freeze({value: 50, why: 'Authored: each point the refiner leads or trails moves the chance by this many permille.'}),
        min: 100, max: 950, cowedBonus: 200,
        bounds: 'Authored: a claim is never certain and never hopeless, so a stronger Gu can beat a weak refiner and a strong refiner can still slip.',
    }),
    parts: Object.freeze({min: Object.freeze({value: 2, why: 'A claim always costs something.'})}),
});

// The Gu's will, itemised so a quote can say why. `gu` is a specimen's condition: {rank, kind, hunger 0-3, injured, wary, imprint}.
export function guWill({rank = 1, kind, hunger = 0, injured = false, wary = 0, imprint} = {}, refiner = 'player') {
    const D = GU_WILL_DIALS.gu, rows = [{why: 'rank', amount: rank * D.perRank.value}];
    const temper = D.temperament[kind] ?? 0;
    if(temper) rows.push({why: 'temperament', amount: temper});
    if(hunger) rows.push({why: 'hunger', amount: -clamp(hunger, 0, 3) * D.hungerRelief.value});
    if(injured) rows.push({why: 'injury', amount: -D.injuryRelief.value});
    if(wary) rows.push({why: 'wary', amount: wary * D.waryPer.value});
    // RWT34: a mark by another will adds to the work; your own mark costs nothing extra (lifting it is a later, cheap act).
    if(imprint && imprint.by !== refiner) rows.push({why: 'imprint', amount: Math.max(0, imprint.strength) * D.imprintPer.value});
    return {value: Math.max(1, rows.reduce((n, r) => n + r.amount, 0)), rows};
}
export function refinerWill({rank = 1, realm = 0, steadiness} = {}) {
    const D = GU_WILL_DIALS.refiner, steady = clamp(steadiness ?? D.steadiness.value, 0, D.steadiness.max);
    return {value: rank * D.perRank.value + clamp(realm, 0, 3) * D.perRealm.value + steady,
        rows: [{why: 'rank', amount: rank * D.perRank.value}, {why: 'realm', amount: clamp(realm, 0, 3) * D.perRealm.value}, {why: 'steadiness', amount: steady}]};
}

// The contest itself: `ceiling` is what a claim costs when the wills are even and is also the most it can cost (the command reserves it);
// beyond that the odds, not the price, carry a stronger Gu.
// Whose will resists is data: `resist` is a list of {source, strength} (the Gu's own will, the imprint as a 'mark', a former owner's 'hostility'), summed.
// `gu` is the common case and expands to the Gu's own rows, with another's imprint as its own source (RWT51, RWT47 reuse this).
export const guResist = (gu, refiner) => guWill(gu, refiner).rows.map(row => ({source: row.why === 'imprint' ? 'mark' : 'gu', why: row.why, strength: row.amount}));
export function willContest({gu, resist, refiner, ceiling, cowed = false}) {
    const rows = resist ?? guResist(gu), g = {value: Math.max(1, rows.reduce((n, row) => n + row.strength, 0)), rows};
    const r = refinerWill(refiner), O = GU_WILL_DIALS.odds;
    const parts = clamp(Math.round(ceiling * g.value / r.value), GU_WILL_DIALS.parts.min.value, ceiling);
    const odds = clamp(O.base.value + O.slope.value * (r.value - g.value) + (cowed ? O.cowedBonus : 0), O.min, O.max);
    return {parts, odds, guWill: g.value, refinerWill: r.value, guRows: g.rows, refinerRows: r.rows};
}

// The kernel law: one operation per stage. `hold` takes the Gu in hand; `wear_will` is the contest, publishing its cost and odds (KW15)
// and what a miss does (a slipped hold stops the working with a reason, KW8).
export const WILL_LAW = defineWorkingLaw({id: 'gu.will', revision: 1, operations: {
    hold: {roles: {gu: 'gu'}, settle: () => ({ok: true})},
    wear_will: {roles: {gu: 'gu'}, settle({bound, options}) {
        const c = willContest({gu: bound.gu.condition, resist: options.resist, refiner: options.refiner, ceiling: options.ceiling, cowed: options.cowed});
        return {ok: true, odds: c.odds, costs: [{material: options.material, amount: c.parts}], facts: {parts: c.parts, guWill: c.guWill, refinerWill: c.refinerWill},
            cause: 'will-contest', miss: {ok: false, reason: 'slipped-hold'}};
    }},
}});
export function willMethod({id, ceiling, material, refiner, cowed = false, minutes, holdMinutes = 0, resist}) {
    const options = {ceiling, material, refiner, cowed, ...(resist && {resist})}, bindings = {gu: 'gu'};
    return {id, revision: 1, law: WILL_LAW.ref, roles: {gu: 'gu'},
        steps: [{op: 'hold', bindings, minutes: holdMinutes}, {op: 'wear_will', bindings, minutes, options}]};
}

// Run one claim to its end through the kernel. `condition` is the Gu as the contest reads it; `drawKey` keys the draw so a retry (a new
// `tries`) gets a fresh roll and a replay gets the same one. Returns what the host needs: held or slipped, the parts, and the receipt.
export function runWillContest({seed, drawKey, gu, condition, resist, refiner, ceiling, material, cowed = false, minutes, holdMinutes = 0}) {
    const method = willMethod({id: 'gu.claim', ceiling, material, refiner, cowed, minutes, holdMinutes, resist});
    const ports = {read: ref => ({kind: 'gu', id: ref.id, condition}), draw: ({address}) => ({value: drawU32(seed ?? 1, `${drawKey}:${address}`)})};
    const bindings = {gu: {kind: 'gu', id: gu}};
    const record = beginWorking(WILL_LAW, method, {id: 'claim', bindings, at: 0});
    const done = settleWorking(WILL_LAW, record, {now: record.deadlines.at(-1), ports}).record;
    const receipt = done.receipts.find(row => row.op === 'wear_will');
    const truth = receipt.truth;
    return {held: done.status === 'complete', parts: truth.costs[0].amount, odds: truth.odds, roll: truth.draw?.roll,
        guWill: truth.facts.guWill ?? willContest({gu: condition, resist, refiner, ceiling, cowed}).guWill, status: done.status};
}

// A quote for the player's screen: no draw, so it cannot read the outcome (KW15).
export function quoteWillContest({condition, refiner, ceiling, material, cowed = false, minutes}) {
    const method = willMethod({id: 'gu.claim', ceiling, material, refiner, cowed, minutes});
    const q = quoteWorking(WILL_LAW, method, {bindings: {gu: {kind: 'gu', id: 'claim'}}, at: 0, ports: {read: ref => ({kind: 'gu', id: ref.id, condition})}});
    return {parts: q.costs.find(c => c.material === material)?.amount ?? null, odds: q.odds.at(-1), ...willContest({gu: condition, refiner, ceiling, cowed})};
}
