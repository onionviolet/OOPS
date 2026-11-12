// Gu on the kernel working (chat G phase 2, PFP1, PFP21, SC6). One working law runs every Gu catalogue
// binding as data: activation, essence conversion, refinement stages, growth and treatment. Methods are
// built from catalogue rows, so a canon Gu costs a row and no scene module. Killer moves are composed
// methods: one activate step per role, with supports carried between steps as returned facts (KB1).
// The host publishes effects and writes its own owners; this law keeps reserves, refinement world and
// modifiers in the working's facts and never touches saves (KW11, AR3).
import {defineWorkingLaw} from './kernel_working.js';
import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';

// Dials (authored defaults, adjustable per world pack). The novel gives no stage duration or derived cost.
export const GU_WORKING_DIALS = Object.freeze({refineStageMinutes: 20, immortalFromRank: 6, derivedCost: 1, derivedMagnitude: 1});

const fail = reason => ({ok: false, reason});
// Bound Gu carry the kernel role kind in `kind` ('gu', KW3) and their catalogue kind in `guKind`.
// Leaves read `kind` as the catalogue kind, so operations hand them the leaf view.
export const guRef = id => ({kind: 'gu', id});
export const asBoundGu = specimen => ({...specimen, kind: 'gu', guKind: specimen.kind});
const leaf = bound => ({...bound, kind: bound.guKind});
const pool = (rank, stage) => `primeval.r${rank}.${stage}`;
const binding = (kind, name) => guCatalogue[kind]?.[name]?.value;

// A parts row with a chapter rank and a function, but no authored ability, runs on a derived default:
// the fuel family from rank (GG13) unless the chapters state it, one unit of cost and magnitude.
// Labelled `derived` so a consumer can tell it from a canon calibration (PFP16, SKR3).
export function derivedGuAbility(kind) {
    const parts = guCatalogue[kind]?.parts?.value;
    if (!parts?.function || !parts.rank.length) return null;
    const rank = Math.min(...parts.rank);
    const fuel = parts.fuel ?? (rank >= GU_WORKING_DIALS.immortalFromRank ? 'immortal' : 'primeval');
    return {derived: true, fuel, cost: GU_WORKING_DIALS.derivedCost, ...(parts.path && {path: parts.path}),
        effect: {kind: parts.function, magnitude: GU_WORKING_DIALS.derivedMagnitude}};
}
export const guAbility = kind => binding(kind, 'ability') ?? derivedGuAbility(kind);

function activate({bound, facts, options, at}) {
    const gu = leaf(bound.gu), {operator} = bound;
    const ability = options.ability ?? guAbility(gu.kind);
    if (!ability) return fail(`${gu.kind} has no ability the rules can run.`);
    const supply = options.pool && {pool: options.pool, family: ability.fuel, rank: options.rank ?? gu.rank,
        source: options.source ?? 'stored', ...(options.stage && {stage: options.stage})};
    const reserves = {[operator.id]: {}, ...(facts.reserves ?? {})};
    const result = resolveGuActivation({stages: [{gu, operator: operator.id, ability, ...(supply && {supply})}],
        reserves, day: facts.day ?? at, modifiers: facts.modifiers ?? []});
    if (result.outcome !== 'complete') return {ok: false, reason: result.reason, observed: {stopped: gu.kind}};
    return {ok: true, facts: {reserves: result.remaining, modifiers: result.modifiers},
        effects: result.effects.map(effect => ({...effect, source: gu.id})),
        observed: {activated: gu.kind, cost: result.activations[0].cost}};
}

function convert({bound, facts, at}) {
    const converter = leaf(bound.converter), {operator} = bound;
    const row = binding(converter.kind, 'conversion');
    if (!row) return fail(`${converter.kind} converts no essence.`);
    if (converter.alive === false) return fail('Gu unavailable');
    if (converter.fedThrough < (facts.day ?? at)) return fail('needs feeding');
    const from = pool(row.rank, row.from ?? 'initial'), to = pool(row.rank, row.stage);
    const held = facts.reserves?.[operator.id] ?? {};
    if ((held[from] ?? 0) < row.cost) return fail('needs more essence');
    const reserves = {...facts.reserves, [operator.id]: {...held, [from]: held[from] - row.cost, [to]: (held[to] ?? 0) + row.yield}};
    return {ok: true, facts: {reserves}, effects: [{kind: 'essence-converted', from, to, spent: row.cost, gained: row.yield}],
        observed: {converted: row.stage}};
}

function refine({bound: {refiner}, facts, options, address}) {
    const recipe = binding(options.kind, 'recipe');
    if (!recipe) return fail(`${options.kind} has no recipe.`);
    const id = options.attempt ?? address.replaceAll('/', '.');
    try {
        if (options.action === 'begin') {
            const world = beginGuRefinement(facts.world, {id, refiner: refiner.id, recipe,
                ingredients: options.ingredients ?? {}, productId: options.productId ?? `${id}.product`});
            return {ok: true, facts: {world, attempt: id}, observed: {began: recipe.kind}};
        }
        const world = stepGuRefinement(facts.world, facts.attempt);
        const job = world.attempts.find(row => row.id === facts.attempt);
        if (job.status !== 'working' && job.status !== 'complete') return {ok: false, reason: job.status, observed: {failed: recipe.kind}};
        const product = job.status === 'complete' ? world.gu.find(gu => gu.id === job.productId) : null;
        return {ok: true, facts: {world}, effects: product ? [{kind: 'gu-emerged', gu: product.id, guKind: product.kind}] : [],
            observed: {stage: job.cursor}};
    } catch (error) {
        return fail(error.message);
    }
}

function grow({bound, facts, options, at}) {
    const producer = leaf(bound.producer), {operator} = bound;
    const row = binding(producer.kind, 'growth');
    if (!row) return fail(`${producer.kind} grows nothing.`);
    const leaves = facts.leaves ?? producer.leaves ?? 0;
    const held = facts.reserves?.[operator.id] ?? {};
    const essencePool = options.pool ?? pool(row.rank, 'initial');
    if (!options.daylight) return fail('needs daylight');
    if (leaves >= row.capacity) return fail('no room on the stem');
    if ((facts.water ?? 0) < row.waterCost) return fail('needs water');
    if ((held[essencePool] ?? 0) < row.essenceCost) return fail('needs more essence');
    return {ok: true, facts: {leaves: leaves + 1, water: facts.water - row.waterCost,
        reserves: {...facts.reserves, [operator.id]: {...held, [essencePool]: held[essencePool] - row.essenceCost}}},
    effects: [{kind: 'grow-leaf', source: producer.id, magnitude: 1, at}], observed: {leaves: leaves + 1}};
}

function treat({bound, facts, at}) {
    const consumable = leaf(bound.consumable), {patient} = bound;
    const row = binding(consumable.kind, 'treatment');
    if (!row) return fail(`${consumable.kind} treats nothing.`);
    const last = facts.treatedAt?.[patient.id];
    if (last !== undefined && at - last < row.restMinutes) return fail('the last leaf is still working');
    return {ok: true, facts: {treatedAt: {...facts.treatedAt, [patient.id]: at}},
        effects: [{kind: 'heal', target: patient.id, amount: row.health, consumed: consumable.id}], observed: {healed: row.health}};
}

export const guWorkingLaw = defineWorkingLaw({id: 'gu.working', revision: 1, operations: {
    activate: {roles: {gu: 'gu', operator: 'operator'}, settle: activate},
    convert: {roles: {converter: 'gu', operator: 'operator'}, settle: convert},
    refine: {roles: {refiner: 'operator'}, settle: refine},
    grow: {roles: {producer: 'gu', operator: 'operator'}, settle: grow},
    treat: {roles: {consumable: 'gu', patient: 'operator'}, settle: treat},
}});

const method = (id, roles, steps) => ({id, revision: 1, law: guWorkingLaw.ref, roles, steps});
const one = op => roles => ({op, bindings: roles});

// Every method a catalogue kind supplies, keyed by mechanism. Recipe stages take their minutes from the
// stage row when it names them, else the dial.
export function guMethods(kind) {
    const out = {};
    if (guAbility(kind)) out.activate = method(`gu.${kind}.activate`, {gu: 'gu', operator: 'operator'},
        [one('activate')({gu: 'gu', operator: 'operator'})]);
    if (binding(kind, 'conversion')) out.convert = method(`gu.${kind}.convert`, {converter: 'gu', operator: 'operator'},
        [one('convert')({converter: 'converter', operator: 'operator'})]);
    if (binding(kind, 'growth')) out.grow = method(`gu.${kind}.grow`, {producer: 'gu', operator: 'operator'},
        [{op: 'grow', bindings: {producer: 'producer', operator: 'operator'}, options: {daylight: true}}]);
    if (binding(kind, 'treatment')) out.treat = method(`gu.${kind}.treat`, {consumable: 'gu', patient: 'operator'},
        [one('treat')({consumable: 'consumable', patient: 'patient'})]);
    const recipe = binding(kind, 'recipe');
    if (recipe) out.refine = method(`gu.${kind}.refine`, {refiner: 'operator'}, [
        {op: 'refine', bindings: {refiner: 'refiner'}, options: {kind, action: 'begin'}},
        ...recipe.stages.map((stage, index) => ({op: 'refine', bindings: {refiner: 'refiner'},
            minutes: index === 0 ? 0 : stage.minutes ?? GU_WORKING_DIALS.refineStageMinutes, options: {kind, action: 'stage'}}))]);
    const move = binding(kind, 'move');
    if (move) out.move = guMoveMethod(move);
    return out;
}

// A killer move as a composed working: one activate step per role, in the record's order, all on one
// operator. Each role binds a Gu of the role's kind.
export function guMoveMethod({id, roles, operator = 'operator'}) {
    return method(`gu.move.${id}`, {[operator]: 'operator', ...Object.fromEntries(roles.map(role => [role.id, 'gu']))},
        roles.map(role => ({op: 'activate', bindings: {gu: role.id, operator}, ...(role.minutes && {minutes: role.minutes})})));
}

// Kinds the rules can run with no scene module, and why the others cannot.
export function guRunnableCoverage() {
    const rows = Object.keys(guCatalogue).map(kind => {
        const methods = Object.keys(guMethods(kind));
        const parts = guCatalogue[kind].parts?.value;
        const gap = methods.length ? null : !parts?.function ? 'no standalone function in the cited scenes'
            : 'no chapter rank to set its fuel';
        return {kind, methods, derived: !binding(kind, 'ability') && methods.includes('activate'), gap};
    });
    return {rows, runnable: rows.filter(row => row.methods.length).length, total: rows.length};
}
