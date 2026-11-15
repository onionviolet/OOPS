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
import {drawU32, pickWeighted} from './gen_kit.js';

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
    parts: Object.freeze({value: 20, why: 'Authored: wearing down a small wild Gu\'s will takes about half a C-grade sea (44 parts, ch10). The source\'s clan Moonlight took several stones of essence for a weak refiner (RIG12); a wild one found already still is taken as easier.'}),
    cowedParts: Object.freeze({value: 8, why: 'Authored: a cowed Gu stops resisting (ch162), so most of the work is skipped. What is left is the essence that marks the Gu as yours.'}),
    // The eye's role is a proposal under AD56, not a canon use of the eye. Dial: 0 removes the cowed route.
    eyes: Object.freeze({value: 1, why: 'Authored: a lightning wolf eye still holds the wolf\'s aura; held over the wild Gu it cows it the way a stronger aura does (ch162).'}),
    minutes: Object.freeze({value: 60, why: 'Authored: an hour of steady pouring for a Gu that resists.'}),
    cowedMinutes: Object.freeze({value: 10, why: 'A cowed Gu is refined "in a few breaths" (ch162); ten minutes covers taking it in hand and settling it.'}),
});

export const RI_WILD_GU_MATERIALS = Object.freeze({essence: 'primeval', eye: 'lightning-wolf-eye'});
const REFINER = 'player', WILD = 'ri.wild_gu.found', PRODUCT = 'ri.wild_gu.refined';
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
export function riWildGuRecipe(kind, {cowed = false} = {}) {
    if(!byKind[kind]) throw Error(`${kind} is not a wild Gu kind here.`);
    const D = RI_WILD_GU_DIALS;
    if(cowed && D.eyes.value < 1) throw Error('The cowed route is turned off.');
    const essence = {material: RI_WILD_GU_MATERIALS.essence, amount: cowed ? D.cowedParts.value : D.parts.value};
    const stages = cowed
        ? [{id: 'cow', inputs: [{material: RI_WILD_GU_MATERIALS.eye, amount: D.eyes.value}], minutes: 0},
            {id: 'mark', inputs: [essence], minutes: D.cowedMinutes.value}]
        : [{id: 'hold', inputs: [], minutes: 0}, {id: 'wear_will', inputs: [essence], minutes: D.minutes.value}];
    return {id: `ri-wild-${kind}-${cowed ? 'cowed' : 'refine'}`, revision: 1, kind, rank: 1, recordLineage: true,
        ingredients: {wild: kind}, stages};
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

// A bare refinement world for one found Gu: the wild specimen in hand and the refiner's essence and eyes as stocks.
export function riWildGuWorld({kind, essence, eyes}) {
    return {gu: [{id: WILD, kind, rank: 1, holder: REFINER, alive: true, wild: true}], attempts: [],
        stocks: {[REFINER]: {[RI_WILD_GU_MATERIALS.essence]: essence, [RI_WILD_GU_MATERIALS.eye]: eyes}}};
}
// Begin: the engine reserves every stage's materials at once and binds the wild Gu. Returns the next world (JSON-safe, so a host can
// save it mid-refinement) or the blocked reason with nothing spent.
export function riBeginWildGu(world, {kind, cowed = false, wildGu = 1, attempt = 'ri.wild_gu.attempt'}) {
    const stock = world.stocks[REFINER];
    const check = riWildGuReadiness({wildGu, essence: stock[RI_WILD_GU_MATERIALS.essence], eyes: stock[RI_WILD_GU_MATERIALS.eye], cowed});
    if(!check.ready) return {ok: false, reason: check.reason, world};
    const next = beginGuRefinement(world, {id: attempt, refiner: REFINER, recipe: riWildGuRecipe(kind, {cowed}), ingredients: {wild: WILD}, productId: PRODUCT});
    return {ok: true, world: stepGuRefinement(next, attempt)};
}
// Finish: the last stage settles; the wild specimen is consumed and the refined Gu is the refiner's.
export function riFinishWildGu(world, attempt = 'ri.wild_gu.attempt') {
    const next = stepGuRefinement(world, attempt);
    const job = next.attempts.find(row => row.id === attempt);
    const product = job.status === 'complete' ? next.gu.find(gu => gu.id === job.product) : null;
    return {world: next, status: job.status, product,
        // No failed-control line yet: no route passes controlFailed, so a wild Gu cannot slip his hold until the will contest
        // (RWT19) gives it a chance. A line here would be one the player can never see (RWT17).
        line: product ? `You poured your essence into the wild Gu until its will gave way. It is a ${riWildGuLabel(product.kind)}, and it is yours now.` : null};
}
// The whole refinement for a found Gu, begin to settle, in one call (an instant host, or a test).
export function riRefineWildGu({seed, ordinal, essence, eyes = 0, wildGu = 1, cowed = false}) {
    const kind = riWildGuKind(seed, ordinal);
    const begun = riBeginWildGu(riWildGuWorld({kind, essence, eyes}), {kind, cowed, wildGu});
    if(!begun.ok) return {ok: false, kind, reason: begun.reason, spent: {essence: 0, eyes: 0, wildGu: 0}};
    const done = riFinishWildGu(begun.world);
    const left = done.world.stocks[REFINER];
    return {ok: !!done.product, kind, product: done.product, line: done.line, world: done.world,
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
// What one route takes, read from its recipe row (the same for every kind): the pack's costs and labels use these numbers.
export function riWildGuInputs({cowed = false} = {}) {
    const inputs = riWildGuRecipe(RI_WILD_GU_KINDS[0].kind, {cowed}).stages.flatMap(stage => stage.inputs);
    const amount = material => inputs.filter(i => i.material === material).reduce((n, i) => n + i.amount, 0);
    return {essence: amount(RI_WILD_GU_MATERIALS.essence), eyes: amount(RI_WILD_GU_MATERIALS.eye),
        minutes: cowed ? RI_WILD_GU_DIALS.cowedMinutes.value : RI_WILD_GU_DIALS.minutes.value};
}

export function riWildGuConsequences(state, effect) {
    const route = RI_WILD_ROUTES[effect.operation];
    if(!route) throw Error('Unknown wild Gu route.');
    const done = Number(state.actors.player.facts?.[RI_WILD_COUNT] ?? 0), ordinal = done + 1;
    // The command already reserved exactly these inputs (riWildGuInputs); the engine settles them and names what comes out.
    const need = riWildGuInputs(route);
    const r = riRefineWildGu({seed: state.simulation?.seed ?? 1, ordinal, essence: need.essence, eyes: need.eyes, cowed: route.cowed});
    if(!r.ok) throw Error(r.reason ?? 'The wild Gu refinement did not finish.');
    if(r.spent.essence !== need.essence || r.spent.eyes !== need.eyes) throw Error('The refinement and its reserved inputs disagree.');
    return [{type: 'item', actor: 'player', key: itemKey(riWildGuItem(r.kind)), amount: 1},
        {type: 'fact', actor: 'player', scope: 'actor', key: RI_WILD_COUNT, value: ordinal},
        {type: 'knowledge', actor: 'player', key: RI_WILD_NOTE, stage: 'understood', value: r.line}];
}
registerGuRefiner(RI_WILD_WORLD, {pack: RI_WILD_REFINEMENT, operations: Object.keys(RI_WILD_ROUTES), consequences: riWildGuConsequences});
