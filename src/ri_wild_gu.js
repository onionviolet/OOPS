// The wild Gu Fang Yuan finds under the wall on a wolf-tide patrol (RI_DAY_ITEMS.wildGu, ri_lead_day_facts.js), and how it is refined
// (foundation run, OR1 consumer: his ordinary day, 2026-11-14; proposal under AD32 and AD56). Pure leaf: a keyed kind draw, the refinement
// rows in the catalogue's recipe shape, and one refinement run through the shared engine (gu_refinement.js). Nothing here saves or ticks.
// Canon basis: a Gu master refines a Gu by pouring his essence into it until his will wears out its wild one (RIG12, progression gates
// 2026-10-23); a Gu cowed by a stronger aura stops resisting and the same work takes a few breaths (ch162 p65-66, lead-run rules note
// ri.craft.gu-refining-by-will). Every number below is a dial with its reason; the kind weights and the eye's role are authored.
// Host: the world-agnostic `guRefine` effect (gu_refiner_registry.js). His pack (world_packs/book_gu_lead_wild_refinement.js) reserves
// the wild Gu, the eye and the essence through the ordinary command costs; at completion this module runs those exact inputs through the
// engine and returns the refined Gu as an item. The rows stay here, shaped to move into gu_catalogue.js as `recipe` bindings unchanged.
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {registerGuRefiner} from './gu_refiner_registry.js';
import {guCatalogue} from './gu_catalogue.js';
import {drawU32, indexFromU32, pickWeighted} from './gen_kit.js';
import {runWillContest} from './gu_will_contest.js';
import {RI_DAY_ITEMS} from './ri_lead_day_facts.js';

// Which kind the found Gu is. The patrol's line says it "glowed and did not run", so the defaults favour the light Gu and leave out
// kinds that run or are not creatures. Authored weights (dial: per row; a later reading that names wild stock under the wall replaces them).
export const RI_WILD_GU_KINDS = Object.freeze([
    Object.freeze({id: 'little-light', kind: 'little-light', label: 'Little Light Gu', weight: 3, why: 'Authored: a rank-one light Gu that glows and has no reason to run; small and common enough to turn up in brush.'}),
    Object.freeze({id: 'moonlight', kind: 'moonlight', label: 'Moonlight Gu', weight: 2, why: 'Authored: glows blue and is rank one (ch8, ch22). The clan raises its own stock, so a wild one is rarer than Little Light.'}),
    Object.freeze({id: 'stealth-rock', kind: 'stealth-rock', label: 'Stealth Rock Gu', weight: 1, why: 'Authored: rank one and lies still like a stone (ch121); it does not glow, so it is the least likely to be the thing that caught your eye.'}),
    Object.freeze({id: 'liquor-worm', kind: 'liquor-worm', label: 'Liquor Worm', weight: 0, why: 'A wild Liquor Worm flees (ch7, ch14), and this one did not run. Dial: raise it for a patrol line that has something fleeing.'}),
    Object.freeze({id: 'vitality-leaf', kind: 'vitality-leaf', label: 'Vitality Leaf Gu', weight: 0, why: 'A detached leaf of the Vitality Grass (ch102), not a creature that wanders under a wall.'}),
].map(row => {
    if(!guCatalogue[row.kind]?.parts?.value?.rank?.includes(1)) throw Error(`${row.kind} is not a rank-one catalogue kind.`);
    return row;
}));

export const RI_WILD_GU_DIALS = Object.freeze({
    // RWT19: these two are now the price when the wills are even and the most a claim can take (the command reserves it); the Gu's
    // condition and the refiner's will (gu_will_contest.js) bring it down, and the odds carry the rest.
    parts: Object.freeze({value: 20, why: 'Authored: wearing down a small wild Gu\'s will takes about half a C-grade sea (44 parts, ch10) when the wills are even. The source\'s clan Moonlight took several stones of essence for a weak refiner (RIG12); a wild one found already still is taken as easier.'}),
    cowedParts: Object.freeze({value: 8, why: 'Authored: a cowed Gu stops resisting (ch162), so most of the work is skipped. What is left is the essence that marks the Gu as yours, scaled by the same contest.'}),
    injuredChance: Object.freeze({value: 150, why: 'Authored: whole permille of finds that are hurt (a Gu in brush under a wall that has met a wolf or a fall).'}),
    // The eye's role is a proposal under AD56, not a canon use of the eye. Dial: 0 removes the cowed route.
    eyes: Object.freeze({value: 1, why: 'Authored: a lightning wolf eye still holds the wolf\'s aura; held over the wild Gu it cows it the way a stronger aura does (ch162).'}),
    minutes: Object.freeze({value: 60, why: 'Authored: an hour of steady pouring for a Gu that resists.'}),
    cowedMinutes: Object.freeze({value: 10, why: 'A cowed Gu is refined "in a few breaths" (ch162); ten minutes covers taking it in hand and settling it.'}),
});

export const RI_WILD_GU_MATERIALS = Object.freeze({essence: 'primeval', eye: 'lightning-wolf-eye'});
const REFINER = 'player', WILD = 'ri.wild_gu.found';
const byKind = Object.fromEntries(RI_WILD_GU_KINDS.map(row => [row.kind, row]));

// The same found Gu is the same kind on a replay: one keyed draw per find. `ordinal` is which wild Gu this is in his life (1 for the
// first one found), so the key never depends on when he chose to refine it.
export function riWildGuKind(seed, ordinal) {
    if(!Number.isSafeInteger(ordinal) || ordinal < 1) throw Error('A found Gu needs its ordinal, counting from 1.');
    const pick = pickWeighted(RI_WILD_GU_KINDS, row => ({weight: row.weight, reason: row.why}), drawU32(seed ?? 1, `ri.wild_gu:kind:${ordinal}`));
    return pick.value.kind;
}
export const riWildGuLabel = kind => byKind[kind]?.label ?? 'Gu';

// The refinement rows, one per route, in the catalogue's `recipe` value shape (gu_refinement.js reads them). The wild specimen is the
// one ingredient; the product is the same kind at rank one, now held by the refiner. Essence and the eye are stage materials.
export function riWildGuRecipe(kind, {cowed = false, parts} = {}) {
    if(!byKind[kind]) throw Error(`${kind} is not a wild Gu kind here.`);
    const D = RI_WILD_GU_DIALS;
    if(cowed && D.eyes.value < 1) throw Error('The cowed route is turned off.');
    const essence = {material: RI_WILD_GU_MATERIALS.essence, amount: parts ?? (cowed ? D.cowedParts.value : D.parts.value)};
    const stages = cowed
        ? [{id: 'cow', inputs: [{material: RI_WILD_GU_MATERIALS.eye, amount: D.eyes.value}], minutes: 0},
            {id: 'mark', inputs: [essence], minutes: D.cowedMinutes.value}]
        : [{id: 'hold', inputs: [], minutes: 0}, {id: 'wear_will', inputs: [essence], minutes: D.minutes.value}];
    // MR44 (RWT22): a claim, not a replacement. The found specimen is the precursor and keeps its id; a failed contest leaves it warier.
    const last = stages.length - 1;
    stages[last] = {...stages[last], onPrecursorControlFailure: 'wary'};
    return {id: `ri-wild-${kind}-${cowed ? 'cowed' : 'refine'}`, revision: 1, kind, rank: 1, precursorKind: kind, claim: true, imprintStrength: 1, stages};
}

// What refining needs and why it is blocked, by mechanism (AD38): no wild Gu in hand, too little essence in the sea, no eye to cow it.
export function riWildGuReadiness({wildGu = 0, essence = 0, eyes = 0, cowed = false}) {
    const D = RI_WILD_GU_DIALS, need = cowed ? D.cowedParts.value : D.parts.value;
    const inputs = {wildGu: 1, essence: need, ...(cowed && {eyes: D.eyes.value}), minutes: cowed ? D.cowedMinutes.value : D.minutes.value};
    if(wildGu < 1) return {ready: false, inputs, reason: 'You have no wild Gu in hand to refine.'};
    if(cowed && eyes < D.eyes.value) return {ready: false, inputs, reason: 'You have no lightning wolf eye to cow it with.'};
    if(essence < need) return {ready: false, inputs, reason: essence < 1
        ? `Your sea is empty. Wearing down its will takes ${need} parts of essence.`
        : `Your sea holds ${essence} parts. Wearing down its will takes ${need}.`};
    return {ready: true, inputs, reason: null};
}

// The found Gu's condition, drawn once per find (the same on a replay and on every retry): how hungry it is (0 fed to 3 starving)
// and whether it is hurt. Authored: nothing in the patrol line says, so the find's own draw does (dial: injuredChance).
export function riWildGuCondition(seed, ordinal) {
    return {hunger: indexFromU32(drawU32(seed ?? 1, `ri.wild_gu:hunger:${ordinal}`), 4),
        injured: drawU32(seed ?? 1, `ri.wild_gu:injured:${ordinal}`) % 1000 < RI_WILD_GU_DIALS.injuredChance.value};
}
// The refiner's side, until a stat owner supplies it (named gap): rank, realm inside the rank, steadiness. All dials in gu_will_contest.js.
export const RI_WILD_REFINER = Object.freeze({rank: 1, realm: 0});

// A bare refinement world for one found Gu: the wild specimen in hand and the refiner's essence and eyes as stocks. The specimen keeps
// its condition and what it has done to the refiner before (`wary`), and its provenance names the find (RWT22).
export function riWildGuWorld({kind, essence, eyes, hunger = 0, injured = false, wary = 0, ordinal = 1}) {
    return {gu: [{id: WILD, kind, rank: 1, holder: REFINER, alive: true, wild: true, hunger, ...(injured && {injured: true}), ...(wary && {wary}),
        provenance: {found: 'wolf-tide patrol', ordinal}}], attempts: [],
        stocks: {[REFINER]: {[RI_WILD_GU_MATERIALS.essence]: essence, [RI_WILD_GU_MATERIALS.eye]: eyes}}};
}
const conditionOf = gu => ({rank: gu.rank, kind: gu.kind, hunger: gu.hunger ?? 0, injured: !!gu.injured, wary: gu.wary ?? 0, imprint: gu.imprint});
// Begin: the contest runs through the kernel first (its price and draw), then the engine reserves exactly that price and binds the
// found Gu as the precursor. `key` keys the draw: one find, one try (the number of slips so far), so a replay rolls the same.
// Returns the next world (JSON-safe, so a host can save it mid-refinement; the contest result rides on the attempt) or the blocked reason.
export function riBeginWildGu(world, {kind, cowed = false, wildGu = 1, attempt = 'ri.wild_gu.attempt', seed = 1, ordinal = 1, refiner = RI_WILD_REFINER}) {
    const stock = world.stocks[REFINER];
    const check = riWildGuReadiness({wildGu, essence: stock[RI_WILD_GU_MATERIALS.essence], eyes: stock[RI_WILD_GU_MATERIALS.eye], cowed});
    if(!check.ready) return {ok: false, reason: check.reason, world};
    const D = RI_WILD_GU_DIALS, gu = world.gu.find(row => row.id === WILD);
    const contest = runWillContest({seed, drawKey: `ri.wild_gu:will:${ordinal}:${gu.wary ?? 0}`, gu: WILD, condition: conditionOf(gu), refiner,
        ceiling: cowed ? D.cowedParts.value : D.parts.value, material: RI_WILD_GU_MATERIALS.essence, cowed, minutes: cowed ? D.cowedMinutes.value : D.minutes.value});
    const next = beginGuRefinement(world, {id: attempt, refiner: REFINER, recipe: riWildGuRecipe(kind, {cowed, parts: contest.parts}), precursor: WILD});
    next.attempts.find(row => row.id === attempt).contest = {parts: contest.parts, odds: contest.odds, roll: contest.roll, held: contest.held};
    return {ok: true, world: stepGuRefinement(next, attempt), contest};
}
// Finish: the last stage settles. A held contest claims the same specimen; a slipped one leaves it in hand, warier (RWT4, RWT17).
export function riFinishWildGu(world, attempt = 'ri.wild_gu.attempt') {
    const held = world.attempts.find(row => row.id === attempt).contest?.held !== false;
    const next = stepGuRefinement(world, attempt, {controlFailed: !held});
    const job = next.attempts.find(row => row.id === attempt);
    const product = job.status === 'complete' ? next.gu.find(gu => gu.id === job.product) : null;
    const slipped = job.status === 'failed' && job.cause === 'control';
    return {world: next, status: job.status, product, slipped,
        line: product ? `You poured your essence into the wild Gu until its will gave way. It is a ${riWildGuLabel(product.kind)}, and it is yours now.`
            : slipped ? 'The wild Gu slipped your hold. It is warier now, and the essence you poured in is gone.' : null};
}
// The whole refinement for a found Gu, begin to settle, in one call (an instant host, or a test). `wary` is how many times this Gu has
// already slipped a hold; `condition` overrides the find's drawn condition (a test, or a Gu fed or hurt since).
export function riRefineWildGu({seed, ordinal, essence, eyes = 0, wildGu = 1, cowed = false, wary = 0, condition, refiner}) {
    const kind = riWildGuKind(seed, ordinal), cond = condition ?? riWildGuCondition(seed, ordinal);
    const begun = riBeginWildGu(riWildGuWorld({kind, essence, eyes, wary, ordinal, ...cond}), {kind, cowed, wildGu, seed, ordinal, refiner});
    if(!begun.ok) return {ok: false, kind, reason: begun.reason, spent: {essence: 0, eyes: 0, wildGu: 0}};
    const done = riFinishWildGu(begun.world);
    const left = done.world.stocks[REFINER];
    return {ok: !!done.product, slipped: done.slipped, kind, product: done.product, line: done.line, world: done.world, contest: begun.contest,
        wary: done.world.gu[0].wary ?? 0,
        spent: {essence: essence - left[RI_WILD_GU_MATERIALS.essence], eyes: eyes - left[RI_WILD_GU_MATERIALS.eye], wildGu: done.product ? 1 : 0}};
}

// ---- his lead world (registered with the shared guRefine effect) ----
export const RI_WILD_WORLD = 'book.ri.lead.world';
export const RI_WILD_REFINEMENT = 'book.ri.lead.wild_refinement';
// The count of wild Gu he has refined, an actor fact the consequences write; the next one is ordinal count + 1 (the kind draw's key).
export const RI_WILD_COUNT = `${RI_WILD_REFINEMENT}.refined`;
export const RI_WILD_NOTE = `${RI_WILD_REFINEMENT}.result`;
export const riWildGuItem = kind => `${RI_WILD_REFINEMENT}.${kind.replaceAll('-', '_')}_gu`;
export const RI_WILD_ROUTES = Object.freeze({refine: Object.freeze({cowed: false}), cow: Object.freeze({cowed: true})});
const itemKey = id => JSON.stringify({id});
const id = name => `book.ri.lead.${name}`;
// What one route takes, read from its recipe row (the same for every kind): the pack's costs and labels use these numbers.
export function riWildGuInputs({cowed = false} = {}) {
    const inputs = riWildGuRecipe(RI_WILD_GU_KINDS[0].kind, {cowed}).stages.flatMap(stage => stage.inputs);
    const amount = material => inputs.filter(i => i.material === material).reduce((n, i) => n + i.amount, 0);
    return {essence: amount(RI_WILD_GU_MATERIALS.essence), eyes: amount(RI_WILD_GU_MATERIALS.eye),
        minutes: cowed ? RI_WILD_GU_DIALS.cowedMinutes.value : RI_WILD_GU_DIALS.minutes.value};
}

// How many times the found Gu has slipped his hold (an actor fact the consequences write; resets when he claims it).
export const RI_WILD_WARY = `${RI_WILD_REFINEMENT}.wary`;
export function riWildGuConsequences(state, effect) {
    const route = RI_WILD_ROUTES[effect.operation];
    if(!route) throw Error('Unknown wild Gu route.');
    const facts = state.actors.player.facts ?? {};
    const done = Number(facts[RI_WILD_COUNT] ?? 0), ordinal = done + 1, wary = Number(facts[RI_WILD_WARY] ?? 0);
    // The command already reserved the route's ceiling (riWildGuInputs). The contest sets what it really took; the rest goes back to the sea.
    const need = riWildGuInputs(route);
    const r = riRefineWildGu({seed: state.simulation?.seed ?? 1, ordinal, essence: need.essence, eyes: need.eyes, cowed: route.cowed, wary});
    if(!r.ok && !r.slipped) throw Error(r.reason ?? 'The wild Gu refinement did not finish.');
    const refund = need.essence - r.spent.essence;
    const back = refund > 0 ? [{type: 'energy', actor: 'player', energyId: id('primeval'), operation: 'recover', amount: refund}] : [];
    const note = {type: 'knowledge', actor: 'player', key: RI_WILD_NOTE, stage: 'understood',
        value: `${r.line} You spent ${r.spent.essence} parts of essence${r.spent.eyes ? ' and a lightning wolf eye' : ''}.${refund ? ` The remaining ${refund} returned to your sea.` : ''}`};
    if(r.slipped) {
        // The wild Gu is still his to try again: it comes back to his hand, warier, and the essence poured in stays spent.
        return [{type: 'item', actor: 'player', key: itemKey(RI_DAY_ITEMS.wildGu), amount: 1}, ...back,
            {type: 'fact', actor: 'player', scope: 'actor', key: RI_WILD_WARY, value: wary + 1}, note];
    }
    return [{type: 'item', actor: 'player', key: itemKey(riWildGuItem(r.kind)), amount: 1}, ...back,
        {type: 'fact', actor: 'player', scope: 'actor', key: RI_WILD_COUNT, value: ordinal},
        {type: 'fact', actor: 'player', scope: 'actor', key: RI_WILD_WARY, value: 0}, note];
}
registerGuRefiner(RI_WILD_WORLD, {pack: RI_WILD_REFINEMENT, operations: Object.keys(RI_WILD_ROUTES), consequences: riWildGuConsequences});
