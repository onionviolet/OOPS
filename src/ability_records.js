// Typed ability records (GM26, MR-neutral): one row shape {conditions, cost, limit, effects, price, failure} for any world.
// It authors nothing the engine lacks: a row lowers to a native command (cost and effects paid in the ordinary ledger), a held-source
// ability binding (compileStructuredAbilities), and for a limit either a power cooldown (the engine's "Power recovers in N minutes")
// or a charge pool with a recharge rule. Refusal is the engine's own; this leaf adds the validated row, the lowering and a read model.
// Defaults and dials (per world): a limit of kind 'none' is allowed; costs and limits the source does not state are labelled `unstated`
// rather than invented. `failure.hook` is an opaque id another owner (backlash, loss of control) can read; nothing here models it.
import {assert, record, stableId, jsonData, validatePredicate, meets} from './simulation_contracts.js';
import {compileStructuredAbilities} from './structured_ability_runtime.js';

const fields = new Set(['key', 'label', 'description', 'sourceId', 'acquisition', 'kind', 'fn', 'conditions', 'cost', 'limit', 'effects', 'price', 'failure', 'unstated', 'locator']);
const limitKinds = new Set(['none', 'cooldown', 'charges']);
const text = v => typeof v === 'string' && v.trim().length > 0;
const nat = v => Number.isSafeInteger(v) && v > 0;

function validateRow(row, prefix) {
    jsonData(row);
    assert(record(row) && Object.keys(row).every(k => fields.has(k)) && /^[a-z][a-z0-9_]*$/.test(row.key || '') && text(row.label), 'Invalid ability record.');
    assert(stableId(row.sourceId) && row.sourceId.startsWith(prefix + '.'), 'An ability record needs an owned held source.');
    assert(Array.isArray(row.conditions) && row.conditions.every(c => record(c) && text(c.label) && record(c.requires)), 'Ability conditions need a label and a typed predicate.');
    row.conditions.forEach(c => validatePredicate(c.requires));
    assert(Array.isArray(row.cost) && row.cost.every(c => record(c) && ['resource', 'item', 'vital', 'energy'].includes(c.type) && Number.isFinite(c.amount) && c.amount < 0), 'Costs must name spent stock; an unknown cost goes in `unstated`.');
    assert(Array.isArray(row.effects) && row.effects.length > 0, 'An ability needs a concrete effect.');
    assert(row.price == null || Array.isArray(row.price) && row.price.length > 0, 'A price needs actual effects.');
    const l = row.limit ?? {kind: 'none'};
    assert(record(l) && limitKinds.has(l.kind), 'Unknown limit kind.');
    if(l.kind === 'cooldown') assert(nat(l.minutes), 'A cooldown needs positive minutes.');
    if(l.kind === 'charges') assert(nat(l.max) && record(l.recharge), 'Charges need a maximum and a recharge rule.');
    assert(row.failure == null || record(row.failure) && (row.failure.hook == null || stableId(row.failure.hook)), 'Invalid failure.');
    assert(row.unstated == null || Array.isArray(row.unstated) && row.unstated.every(text), 'Invalid unstated list.');
}

// rows: typed records. world: {id}. prefix: owner id for every generated id (ids are `${prefix}.<kind>.<key>`).
export function defineAbilityRecords(rows, {prefix, world, group = 'ability_record', actorId = 'player'}) {
    assert(stableId(prefix) && record(world) && stableId(world.id) && Array.isArray(rows), 'Invalid ability record set.');
    const abilityId = k => `${prefix}.ability.${k}`, commandId = k => `${prefix}.use.${k}`, powerId = k => `${prefix}.power.${k}`, limitId = k => `${prefix}.limit.${k}`;
    const seen = new Set(), commands = [], powers = [], abilities = [], sources = new Map(), cards = {}, grants = {};
    for(const row of rows) {
        validateRow(row, prefix);
        assert(!seen.has(row.key), 'Duplicate ability record.');
        seen.add(row.key);
        const limit = row.limit ?? {kind: 'none'}, k = row.key;
        const command = {id: commandId(k), revision: 1, label: row.label, ...(row.description ? {description: row.description} : {}), group, worldId: world.id, actorId, audience: ['$actor'],
            costs: structuredClone(row.cost), effects: structuredClone(row.effects)};
        const ab = {id: abilityId(k), commandId: command.id, sourceId: row.sourceId, function: row.fn ?? 'physical', acquisition: row.acquisition ?? 'acquired',
            executionKind: row.kind ?? 'body-faculty', control: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, ...row.conditions.map(c => structuredClone(c.requires))]}, target: null, counters: [], carriers: []};
        const conditionRows = [];
        if(row.price) conditionRows.push({id: `${prefix}.price.${k}`, price: structuredClone(row.price)});
        grants[k] = [];
        if(limit.kind === 'cooldown') {
            powers.push({id: powerId(k), revision: 1, label: row.label, model: 'practice', capacity: 1, cooldown: limit.minutes});
            command.powerId = ab.powerId = powerId(k);
            ab.acquisition = row.acquisition === 'innate' ? 'innate' : 'learned';
            grants[k].push({type: 'power', powerId: powerId(k), operation: 'learn'});
        } else if(limit.kind === 'charges') conditionRows.push({id: limitId(k), charges: {max: limit.max, ...(limit.initial != null ? {initial: limit.initial} : {}), recharge: structuredClone(limit.recharge)}});
        if(conditionRows.length) ab.conditions = conditionRows;
        if(!sources.has(row.sourceId)) sources.set(row.sourceId, {id: row.sourceId, revision: 1, label: row.sourceId, kind: 'trait', origin: 'acquired', grants: []});
        commands.push(command); abilities.push(ab);
        cards[k] = {id: ab.id, key: k, label: row.label, sourceId: row.sourceId, conditions: row.conditions.map(c => ({label: c.label, requires: structuredClone(c.requires)})),
            cost: structuredClone(row.cost), limit: structuredClone(limit), price: structuredClone(row.price ?? []), failureHook: row.failure?.hook ?? null, unstated: [...(row.unstated ?? [])], locator: row.locator ?? null};
    }
    const definition = {id: prefix, world: {id: world.id}, sources: [...sources.values()], abilities, simulation: {powers, commands}};
    const compiled = compileStructuredAbilities(definition);
    return {definition, commands: compiled.commands, powers: compiled.powers, conditions: compiled.conditions, seeds: compiled.seeds, cards, grants,
        ids: Object.fromEntries([...seen].map(k => [k, {ability: abilityId(k), command: commandId(k), power: powerId(k), limit: limitId(k)}]))};
}

// Read model for a sheet or combat panel (AR8: observer-safe, no secrets). facts: the fact map the engine evaluates; quote: an optional
// previewSimulationCommand result. Each condition reports met or not by its own label, never by the predicate; the limit reports what is left.
export function abilityView(card, {facts = {}, quote = null, charges = null, readyIn = null} = {}) {
    const conditions = card.conditions.map(c => ({label: c.label, met: meets(c.requires, facts)}));
    const limit = card.limit.kind === 'cooldown' ? {kind: 'cooldown', minutes: card.limit.minutes, readyIn: readyIn ?? 0}
        : card.limit.kind === 'charges' ? {kind: 'charges', max: card.limit.max, left: charges ?? card.limit.initial ?? card.limit.max} : {kind: 'none'};
    const ready = quote ? quote.eligible === true : conditions.every(c => c.met) && (limit.kind !== 'cooldown' || limit.readyIn === 0) && (limit.kind !== 'charges' || limit.left > 0);
    return {id: card.id, label: card.label, conditions, cost: card.cost.map(c => ({what: c.key ?? c.type, amount: -c.amount})), limit, price: card.price.length > 0,
        ready, refusedBy: ready ? [] : [...conditions.filter(c => !c.met).map(c => c.label), ...(limit.kind === 'cooldown' && limit.readyIn > 0 ? ['recovering'] : []), ...(limit.kind === 'charges' && limit.left <= 0 ? ['no charges left'] : [])],
        failureHook: card.failureHook, unstated: card.unstated};
}
