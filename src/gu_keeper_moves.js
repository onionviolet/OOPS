// Gu abilities and killer moves for the keeper life (GKM1, GKM2, GKM5-GKM8, GKM10, GKM13-GKM18; proposal under AD56).
// A Gu's ability is its `use`, read from its being record (CPR10). A move is a composed_moves recipe over roles; each way the
// keeper's Gu can fill it becomes one native command through the existing descriptor route (power_grammar -> spell_seam ->
// ability_records -> spell_cast_lowering), so quoting, revalidation at commit (AR7), costs and seeded outcomes stay the engine's.
// A single Gu used alone is a one-role recipe, so the plain ability and a killer move are the same code.
//
// Readiness (GKM2) splits in two. Blocks sit in `requires`: the recipe unknown, a Gu not yours, dead or elsewhere. Rank is not a
// block (GKM16): a Gu above your rank is priced by the cost read (GKM13). A shortfall drives the outcome: a hungry or starved-out Gu still lets the move start, and it backfires. The host
// supplies both through facts (`guKm.<move>.*`, the keeper domain's facts projection), read from the Gu's real state.
// Busy (GKM10): every Gu a move uses is a participant of its job, so the engine itself refuses a second command that needs one.
// Gu do not level from use (world card): the lowering takes no `practice`. Move practice (GKM9) is deferred.
//
// Backlash (GKM8): the recoil lands on the core Gu's condition, one point per part that fell short, never below 1, and the
// essence is spent either way. FINDING: the keeper world has no HARM_WORLDS row and structured-local commits never reach the
// harm slice, so this is not the shared harm carrier; that route needs a keeper harm row and one host drain line after a
// structured-local commit (main.js commandStructuredCampaign, an AR1-paid line). Recorded in the GKM palette.
//
// Calibration (SKR21): Fang Yuan's first pairing, Moonlight Gu with a Little Light Gu (Reverend Insanity, Calibre 15 English
// EPUB, ch62 he picks the Little Light Gu as the Moonlight Gu's common assistant; ch70 the light fuses into the moonlight and the
// moonblade doubles in size and reach; ch106 a second Little Light still adds 100%, not 200%). The text calls it a pairing; the
// first move it names a killer move is the eight beast phantoms at rank three (ch319-321), out of reach for a first-rank life.
// Substitute (SKR17, `original`): the jade-guarded moonblade, White Jade Gu's jade skin in a guard role, by mechanism.
// Above your rank (GKM13, GKM14, GKM17): each above-rank Gu can run on your own lower-grade essence (cost doubles per rank of gap,
// 25% backlash per rank, both dials) or on stored essence of its grade, a sealed vial bought from the steward and spent once
// (the one GKM14 route in this slice). Every form of a move is its own command, so the quote names route, gap, cost and odds.
// Numbers that are not canon (one stone per boar, an hour's hunt, essence per Gu) are labelled assumed dials.
import {defineRecipe, assignments, composeMove, moveCost} from './composed_moves.js';
import {definePowerGrammar} from './power_grammar.js';
import {defineSpellAdapter} from './spell_seam.js';
import {lowerSpellCasts} from './spell_cast_lowering.js';
import {guBeing} from './being_gu.js';

export const KM_HUNT_MINUTES = 60; // assumed dial: one hunt at reach 1; reach divides it
// Dials (GKM13): own essence below a Gu's grade costs 2^gap times its essence and adds 25% backlash per rank of gap.
export const KM_GAP_CURVE = Object.freeze({cost: gap => 2 ** gap, risk: gap => 0.25 * gap});
export const kmFact = (key, name) => `guKm.${key}.${name}`;

export const KEEPER_RECIPES = Object.freeze([
    defineRecipe({id: 'moonblade', label: 'Moonblade', origin: 'canon', locator: 'Reverend Insanity ch70 (moonblades thrown at the boar)', known: 'own',
        roles: [{id: 'blade', label: 'Blade', core: true, needs: {fn: 'cut'}}]}),
    defineRecipe({id: 'little_light_moonblade', label: 'Little Light moonblade', origin: 'canon', known: 'learned',
        locator: 'Reverend Insanity ch62 (common assistant to the Moonlight Gu), ch70 (size and reach double), ch106 (a second Little Light adds nothing)',
        roles: [{id: 'blade', label: 'Blade', core: true, needs: {fn: 'cut'}}, {id: 'light', label: 'Brighten', needs: {fn: 'brighten'}}]}),
    defineRecipe({id: 'jade_guarded_moonblade', label: 'Jade-guarded moonblade', origin: 'original', known: 'worked out',
        reason: 'Substitute by mechanism: jade skin lets you close on a cut boar and finish it, so the guard adds a kill, not reach.',
        roles: [{id: 'blade', label: 'Blade', core: true, needs: {fn: 'cut'}}, {id: 'guard', label: 'Guard', needs: {fn: 'guard'}},
            {id: 'light', label: 'Brighten', optional: true, needs: {fn: 'brighten'}}]})
]);

// Uses read from each Gu's being record, by slot.
export const keeperUses = guRows => Object.fromEntries(guRows.filter(g => g.use).map(g => [g.slot, guBeing({id: g.slot, label: g.label, use: g.use}).use]));

// The law prices nothing itself: the cost is the cost read's typed lines (GKM8, GKM17), and the failure
// chance is the host's fact. Handlers turn composed axes into real consumers: magnitude is boars felled (stones from the clan
// bounty), reach shortens the hunt (the clock). An augment's own handler adds no effect; it bends the axes.
const keeperLaw = ({essence, stone, vial}) => ({id: 'book.ri.keeper.km.law', basis: 'assumed: one stone per boar and an hour per hunt are keeper dials; doubling is ch70/ch106',
    prices: {cost: null, failure: {}, perMastery: null}, unknown: ['canon essence per activation at rank one', 'canon boar bounty'],
    // The aperture's policy releases one unit per draw, so an amount of n is n draws; stored essence is spent as vials.
    cost: (_values, parts) => parts.cost.flatMap(l => l.source === 'stored' ? [{type: 'item', key: vial, amount: -l.amount}]
        : Array.from({length: l.amount}, () => ({type: 'energy', energyId: essence, operation: 'use', output: 1, control: 1}))),
    functions: {cut: parts => [{type: 'item', actor: 'player', key: stone, amount: parts.magnitude}], brighten: () => [], guard: () => []}});

// Fuel plans for one assignment (GKM14, GKM17): your own essence for every Gu, and, when a Gu is above your grade, stored essence
// of its grade for that Gu. Typed sources: {grade, owner, source}.
export function fuelPlans(assignment, uses, userGrade, vialGrade) {
    const own = {grade: userGrade, owner: 'you', source: 'aperture'}, stored = {grade: vialGrade, owner: 'you', source: 'stored'};
    const plans = [{id: 'own', fuel: () => own}];
    if(assignment.parts.some(p => uses[p].rank > userGrade && uses[p].rank <= vialGrade)) plans.push({id: 'stored', fuel: p => uses[p].rank > userGrade ? stored : own});
    return plans;
}
const essenceWords = (c, label) => {
    const plain = c.lines.filter(l => l.source !== 'stored' && !l.gap).reduce((n, l) => n + l.amount, 0);
    const odd = c.lines.filter(l => l.source === 'stored' || l.gap).map(l => l.source === 'stored' ? `a rank-${l.grade} vial for the ${label(l.part)}` : `${l.amount} for the ${label(l.part)} (rank ${l.grade + l.gap}, ${l.gap} above you)`);
    return [plain ? `${plain} essence` : null, ...odd].filter(Boolean).join(', ').replace(/^(\d+) for/, '$1 essence for');
};

export function keeperMoveSet({gu: guRows, id, key, worldId, location, ready, faculty, userGrade, vialGrade}) {
    const uses = keeperUses(guRows), prefix = id('km'), owned = Object.entries(uses).map(([slot, use]) => ({id: slot, use}));
    const knownKey = r => `${prefix}.recipe.${r.id}`, gLabel = slot => guRows.find(g => g.slot === slot).label;
    const moves = [];
    for(const recipe of KEEPER_RECIPES) for(const a of assignments(recipe, owned)) for(const plan of fuelPlans(a, uses, userGrade, vialGrade)) {
        const k = `${recipe.id}__${a.parts.join('_')}__${plan.id}`, cost = moveCost(a, slot => uses[slot], plan.fuel, KM_GAP_CURVE);
        const parts = {...composeMove(recipe, a, slot => uses[slot]), cost: cost.lines};
        moves.push({key: k, recipe, assignment: a, plan: plan.id, cost, parts, gu: a.parts.map(id), minutes: Math.max(1, Math.round(KM_HUNT_MINUTES / Math.max(1, parts.range)))});
    }
    const label = m => `${m.recipe.label}${m.assignment.parts.some(p => uses[p].rank > userGrade) || m.plan !== 'own' ? ` (${m.assignment.parts.map(gLabel).join(' + ')})` : ''}: hunt boars · ${m.minutes} min, ${essenceWords(m.cost, gLabel)}${m.cost.risk ? `, ${Math.round(m.cost.risk * 100)}% backlash` : ''}, ${m.parts.magnitude} stone${m.parts.magnitude > 1 ? 's' : ''}`;
    const core = m => m.gu[0];
    const rows = moves.map(m => ({key: m.key, label: label(m), sourceId: `${prefix}.gu`, origin: {kind: 'granted'}, fn: 'physical', parts: m.parts,
        description: `${m.recipe.roles.filter(r => m.assignment.roles[r.id]).map(r => `${r.label}: ${gLabel(m.assignment.roles[r.id])}`).join(' · ')}. Every Gu here must be fed: one that is hungry or starved out makes the move backfire on the ${gLabel(m.assignment.roles.blade)}.${m.cost.gap ? m.plan === 'stored' ? ' The stored vial supplies essence of the Gu’s own grade, so there is no gap to pay for.' : ` Driving a Gu above your rank with your own essence costs more and can backfire even when every Gu is fed.` : ''}`,
        formula: [{label: 'You know this move', requires: m.recipe.known === 'own' ? {fact: kmFact(m.key, 'drivable'), op: 'eq', value: true} : {fact: `knowledge.${knownKey(m.recipe)}.seen`, op: 'eq', value: true}}],
        locator: m.recipe.locator ?? 'original', unstated: ['canon essence per activation at rank one'],
        failureOutcome: [{type: 'vital', actor: core(m), key: 'health', amount: {fact: kmFact(m.key, 'recoil'), scale: -1}},
            {type: 'knowledge', actor: 'player', key: id('km_last'), stage: 'understood', value: `The ${m.recipe.label} came apart in your palm${m.cost.gap ? '' : ': a Gu in it was not ready'}. The ${gLabel(m.assignment.roles.blade)} took the recoil, and the essence is gone.`}]}));
    const adapter = defineSpellAdapter({worldId, prefix, origins: {granted: {reason: 'A Gu does what it is; knowing a move is the knowledge gate.'}},
        failure: {chance: 0, reason: 'A move fails when one of its Gu is not ready for it.'},
        strain: {allowed: false, reason: 'No keeper harm row yet; recoil lands on the core Gu.'}});
    const set = definePowerGrammar(rows, keeperLaw({essence: id('primeval'), stone: key('stone'), vial: key('vial')}), adapter);
    const lowered = lowerSpellCasts(set, {chanceFact: cmd => kmFact(cmd.slice(`${prefix}.use.`.length), 'fail')});
    const commands = moves.map(m => {
        const c = lowered.find(x => x.id === set.ids[m.key].command), [cast, fizzled] = c.outcomes;
        const success = {type: 'knowledge', actor: 'player', key: id('km_last'), stage: 'understood', value: `${m.recipe.label}: ${m.parts.magnitude} boar${m.parts.magnitude > 1 ? 's' : ''} down for the clan bounty.`};
        // A first clean cast settles a worked-out recipe from guessed to known (KNW3).
        const settle = m.recipe.known === 'worked out' ? [{type: 'knowledge', actor: 'player', key: knownKey(m.recipe), stage: 'understood', value: `${m.recipe.label}: tried and it held.`}] : [];
        return {...c, group: 'structured_local', worldId, actorId: 'player', location, audience: ['$actor'], participants: m.gu, duration: m.minutes, cancellation: 'refund',
            requires: {all: [ready, faculty, ...set.cards[m.key].conditions.map(x => structuredClone(x.requires)), {fact: kmFact(m.key, 'drivable'), op: 'eq', value: true}],
                reason: 'Every Gu this move uses must be yours, alive and here, and you must know the move and have the essence. A hungry Gu does not stop you; it makes the move backfire.'},
            outcomes: [{...cast, id: id(`km_${m.key}_cast`), effects: [...cast.effects, success, ...settle]}, {...fizzled, id: id(`km_${m.key}_recoil`)}]};
    });
    const moon = guRows.find(g => g.use?.fn === 'cut' && g.use.rank === 1), jade = guRows.find(g => g.use?.fn === 'guard');
    const holds = g => ({fact: `claim.${id(g.slot + '_title')}.owner`, op: 'eq', value: 'player'});
    const [canon, substitute] = KEEPER_RECIPES.slice(1);
    const learn = [
        {id: id('km_learn_pairing'), revision: 1, label: 'Ask the steward what pairs with a Moonlight Gu', group: 'structured_local', worldId, actorId: 'player', location, audience: ['$actor'], once: true, costs: [],
            requires: {all: [ready, holds(moon)], reason: 'Take in the Moonlight Gu first; the steward talks pairings with keepers.'},
            description: 'The clan keeps Little Light Gu as the common assistant to a Moonlight Gu. The steward will tell a keeper how the two are driven together.',
            effects: [{type: 'knowledge', actor: 'player', key: knownKey(canon), stage: 'understood', value: 'Little Light moonblade: drive essence into a Moonlight Gu and a Little Light Gu together; the glow fuses into the blade, twice the size and reach. A second Little Light adds nothing.'}]},
        {id: id('km_work_out_guard'), revision: 1, label: 'Work out a jade-guarded moonblade · 20 min', group: 'structured_local', worldId, actorId: 'player', location, audience: ['$actor'], once: true, costs: [],
            duration: 20, cancellation: 'refund', completionFailure: 'refund',
            requires: {all: [ready, holds(moon), holds(jade), {fact: `knowledge.${knownKey(canon)}.seen`, op: 'eq', value: true}], reason: 'You need the Moonlight and White Jade Gu in your care and the steward’s pairing to start from.'},
            completionRequires: {all: [ready]},
            description: 'Think through driving the White Jade Gu with a moonblade: jade skin to close on a cut boar and finish it. Untested until it holds in a hunt.',
            effects: [{type: 'knowledge', actor: 'player', key: knownKey(substitute), stage: 'interpreted', value: 'Jade-guarded moonblade: a moonblade, then jade skin to step in and finish the boar. A Little Light can still brighten it. Untried.'}]}];
    return {prefix, moves, recipes: KEEPER_RECIPES, uses, set, commands: [...learn, ...commands], knownKey};
}
