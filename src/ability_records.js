// Typed ability records (GM26, MR-neutral): one row shape {conditions, cost, limit, effects, price, failure} for any world.
// It authors nothing the engine lacks: a row lowers to a native command (cost and effects paid in the ordinary ledger), a held-source
// ability binding (compileStructuredAbilities), and for a limit either a power cooldown (the engine's "Power recovers in N minutes")
// or a charge pool with a recharge rule. Refusal is the engine's own; this leaf adds the validated row, the lowering and a read model.
// Defaults and dials (per world): a limit of kind 'none' is allowed; costs and limits the source does not state are labelled `unstated`
// rather than invented. `failure.hook` is an opaque id another owner (backlash, loss of control) can read; nothing here models it.
import {assert, record, stableId, jsonData, validatePredicate, meets} from './simulation_contracts.js';
import {evaluateRule} from './rules.js';
import {compileStructuredAbilities} from './structured_ability_runtime.js';

const fields = new Set(['key', 'label', 'description', 'sourceId', 'acquisition', 'kind', 'fn', 'conditions', 'cost', 'limit', 'effects', 'price', 'failure', 'unstated', 'locator', 'costBasis', 'learn', 'blockedBy', 'notes']);
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
    // A blocker is a named state that cancels the ability while it holds (heavy rain, a blocked mind, a stated aura): a typed counter, shown by label.
    assert(row.blockedBy == null || Array.isArray(row.blockedBy) && row.blockedBy.every(b => record(b) && text(b.label) && record(b.active)), 'A blocker needs a label and a typed predicate.');
    (row.blockedBy ?? []).forEach(b => validatePredicate(b.active));
    if(row.learn != null) validateLearn(row.learn);
    assert(row.unstated == null || Array.isArray(row.unstated) && row.unstated.every(text), 'Invalid unstated list.');
}

// A learnable row (GM8, GM40): who teaches, what must already be held, how long practice takes and what shows progress. Every part is optional
// (rows rarely state them: 3-6% of spell rows in HP, MoL and Shadow Slave); a missing part is listed under `unstated`, never invented.
// teacher/prerequisites carry a typed predicate and the reason shown when it fails; mastery is the engine's power mastery.
function validateLearn(l) {
    assert(record(l) && Object.keys(l).every(k => ['teacher', 'prerequisites', 'lessonCost', 'practice', 'masteryNeeded', 'signs'].includes(k)), 'Invalid learn block.');
    const gate = g => assert(record(g) && text(g.label) && text(g.reason) && record(g.requires), 'A learning gate needs a label, a reason and a typed predicate.');
    if(l.teacher != null) gate(l.teacher);
    (l.prerequisites ?? []).forEach(gate);
    [l.teacher?.requires, ...(l.prerequisites ?? []).map(g => g.requires)].filter(Boolean).forEach(validatePredicate);
    assert(l.lessonCost == null || Array.isArray(l.lessonCost) && l.lessonCost.every(c => record(c) && c.amount < 0), 'Lesson costs must name spent stock.');
    assert(l.practice == null || record(l.practice) && nat(l.practice.minutes) && nat(l.practice.mastery), 'Practice needs minutes and a mastery gain per session.');
    assert(l.masteryNeeded == null || nat(l.masteryNeeded) && l.practice, 'A mastery threshold needs a practice session to reach it.');
    assert(l.signs == null || Array.isArray(l.signs) && l.signs.every(x => record(x) && nat(x.at) && text(x.text)), 'Signs of progress need a mastery point and text.');
}
const gated = g => ({all: [{...structuredClone(g.requires), reason: g.reason}]});

// rows: typed records. world: {id}. prefix: owner id for every generated id (ids are `${prefix}.<kind>.<key>`).
export function defineAbilityRecords(rows, {prefix, world, group = 'ability_record', actorId = 'player'}) {
    assert(stableId(prefix) && record(world) && stableId(world.id) && Array.isArray(rows), 'Invalid ability record set.');
    const abilityId = k => `${prefix}.ability.${k}`, commandId = k => `${prefix}.use.${k}`, powerId = k => `${prefix}.power.${k}`, limitId = k => `${prefix}.limit.${k}`, learnId = k => `${prefix}.learn.${k}`, practiceId = k => `${prefix}.practice.${k}`;
    const seen = new Set(), commands = [], powers = [], abilities = [], sources = new Map(), cards = {}, grants = {};
    for(const row of rows) {
        validateRow(row, prefix);
        assert(!seen.has(row.key), 'Duplicate ability record.');
        seen.add(row.key);
        const limit = row.limit ?? {kind: 'none'}, k = row.key;
        const command = {id: commandId(k), revision: 1, label: row.label, ...(row.description ? {description: row.description} : {}), group, worldId: world.id, actorId, audience: ['$actor'],
            costs: structuredClone(row.cost), effects: structuredClone(row.effects)};
        const ab = {id: abilityId(k), commandId: command.id, sourceId: row.sourceId, function: row.fn ?? 'physical', acquisition: row.acquisition ?? 'acquired',
            executionKind: row.kind ?? 'body-faculty', control: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, ...row.conditions.map(c => structuredClone(c.requires))]}, target: null, counters: (row.blockedBy ?? []).map(b => structuredClone(b.active)), carriers: []};
        const conditionRows = [];
        if(row.price) conditionRows.push({id: `${prefix}.price.${k}`, price: structuredClone(row.price)});
        grants[k] = [];
        const learn = row.learn;
        if(learn) {
            // A learned spell is a power: learned from the teacher, practiced to the needed mastery, then cast.
            const need = learn.masteryNeeded ?? 0;
            powers.push({id: powerId(k), revision: 1, label: row.label, model: 'practice', capacity: 1, cooldown: limit.kind === 'cooldown' ? limit.minutes : 0});
            command.powerId = ab.powerId = powerId(k);
            ab.acquisition = 'learned';
            if(need) ab.control.all.push({fact: `power.${powerId(k)}.mastery`, op: 'gte', value: need, reason: 'Not practiced enough to cast this reliably.'});
            const gates = [learn.teacher, ...(learn.prerequisites ?? [])].filter(Boolean).map(gated);
            commands.push({id: learnId(k), revision: 1, label: `Learn ${row.label}`, group, worldId: world.id, actorId, audience: ['$actor'], once: true, costs: structuredClone(learn.lessonCost ?? []),
                requires: {all: [...gates], reason: `Needs: ${[learn.teacher, ...(learn.prerequisites ?? [])].filter(Boolean).map(g => g.label).join('; ') || 'nothing more'}`},
                effects: [{type: 'power', powerId: powerId(k), operation: 'learn'}]});
            if(learn.practice) commands.push({id: practiceId(k), revision: 1, label: `Practice ${row.label}`, group, worldId: world.id, actorId, audience: ['$actor'], duration: learn.practice.minutes, cancellation: 'refund',
                costs: [], requires: {all: [{fact: `power.${powerId(k)}.owned`, op: 'eq', value: true, reason: 'Learn it first.'}]},
                effects: [{type: 'power', powerId: powerId(k), operation: 'refine', amount: learn.practice.mastery}]});
        }
        if(limit.kind === 'cooldown' && !learn) {
            powers.push({id: powerId(k), revision: 1, label: row.label, model: 'practice', capacity: 1, cooldown: limit.minutes});
            command.powerId = ab.powerId = powerId(k);
            ab.acquisition = row.acquisition === 'innate' ? 'innate' : 'learned';
            grants[k].push({type: 'power', powerId: powerId(k), operation: 'learn'});
        } else if(limit.kind === 'charges') conditionRows.push({id: limitId(k), charges: {max: limit.max, ...(limit.initial != null ? {initial: limit.initial} : {}), recharge: structuredClone(limit.recharge)}});
        if(conditionRows.length) ab.conditions = conditionRows;
        if(!sources.has(row.sourceId)) sources.set(row.sourceId, {id: row.sourceId, revision: 1, label: row.sourceId, kind: 'trait', origin: 'acquired', grants: []});
        commands.push(command); abilities.push(ab);
        cards[k] = {id: ab.id, key: k, label: row.label, sourceId: row.sourceId, blockedBy: (row.blockedBy ?? []).map(b => ({label: b.label, active: structuredClone(b.active)})), conditions: row.conditions.map(c => ({label: c.label, requires: structuredClone(c.requires)})),
            cost: structuredClone(row.cost), limit: structuredClone(limit), price: structuredClone(row.price ?? []), failureHook: row.failure?.hook ?? null, unstated: [...(row.unstated ?? [])], locator: row.locator ?? null, costBasis: row.costBasis ? structuredClone(row.costBasis) : null,
            learn: row.learn ? {teacher: row.learn.teacher ?? null, prerequisites: structuredClone(row.learn.prerequisites ?? []), practice: row.learn.practice ?? null, masteryNeeded: row.learn.masteryNeeded ?? 0, signs: structuredClone(row.learn.signs ?? []), power: powerId(k)} : null};
        if(row.learn) for(const [part, ok] of [['teacher', row.learn.teacher], ['practice time', row.learn.practice], ['signs of progress', row.learn.signs?.length]]) if(!ok && !cards[k].unstated.includes(part)) cards[k].unstated.push(part);
    }
    // A blocker is negated, and an absent fact is unknown (a negation of it would fail closed forever), so simple actor and world flags start false.
    const flagSeeds = [];
    for(const row of rows) for(const b of row.blockedBy ?? []) {
        const scope = b.active.op === 'eq' && b.active.value === true && ['actor', 'world'].find(x => String(b.active.fact).startsWith(x + '.'));
        if(scope) flagSeeds.push({type: 'fact', scope, ...(scope === 'actor' ? {actor: actorId} : {}), key: b.active.fact.slice(scope.length + 1), value: false});
    }
    const definition = {id: prefix, world: {id: world.id}, sources: [...sources.values()], abilities, simulation: {powers, commands}};
    const compiled = compileStructuredAbilities(definition);
    return {definition, commands: compiled.commands, powers: compiled.powers, conditions: compiled.conditions, seeds: [...compiled.seeds, ...flagSeeds], cards, grants,
        ids: Object.fromEntries([...seen].map(k => [k, {ability: abilityId(k), command: commandId(k), power: powerId(k), limit: limitId(k), learn: learnId(k), practice: practiceId(k)}]))};
}

// Read model for a sheet or combat panel (AR8: observer-safe, no secrets). facts: the fact map the engine evaluates; quote: an optional
// previewSimulationCommand result. Each condition reports met or not by its own label, never by the predicate; the limit reports what is left.
export function abilityView(card, {facts = {}, quote = null, charges = null, readyIn = null} = {}) {
    const conditions = card.conditions.map(c => ({label: c.label, met: meets(c.requires, facts)})), blockers = (card.blockedBy ?? []).filter(b => meets(b.active, facts)).map(b => b.label);
    const limit = card.limit.kind === 'cooldown' ? {kind: 'cooldown', minutes: card.limit.minutes, readyIn: readyIn ?? 0}
        : card.limit.kind === 'charges' ? {kind: 'charges', max: card.limit.max, left: charges ?? card.limit.initial ?? card.limit.max} : {kind: 'none'};
    const ready = quote ? quote.eligible === true : blockers.length === 0 && conditions.every(c => c.met) && (limit.kind !== 'cooldown' || limit.readyIn === 0) && (limit.kind !== 'charges' || limit.left > 0);
    return {id: card.id, label: card.label, conditions, cost: card.cost.map(c => ({what: c.key ?? c.type, amount: -c.amount})), limit, price: card.price.length > 0,
        ready, refusedBy: ready ? [] : [...conditions.filter(c => !c.met).map(c => c.label), ...blockers.map(l => `blocked by ${l}`), ...(limit.kind === 'cooldown' && limit.readyIn > 0 ? ['recovering'] : []), ...(limit.kind === 'charges' && limit.left <= 0 ? ['no charges left'] : [])],
        failureHook: card.failureHook, unstated: card.unstated};
}

// Learning read model (GM8): stage, why learning is refused (the authored reasons, never the predicates), the next sign of progress.
// facts: the engine fact map (so `power.<id>.owned` and `.mastery` are read from it).
export function learnView(card, {facts = {}} = {}) {
    const l = card.learn;
    if(!l) return null;
    const owned = facts[`power.${l.power}.owned`] === true, mastery = Number(facts[`power.${l.power}.mastery`] ?? 0);
    const gates = [l.teacher, ...l.prerequisites].filter(Boolean).map(g => ({label: g.label, met: evaluateRule(g.requires, facts).met, reason: g.reason}));
    const stage = !owned ? 'unlearned' : mastery >= l.masteryNeeded ? 'castable' : 'practicing';
    const next = l.signs.filter(x => x.at > mastery).sort((a, b) => a.at - b.at)[0];
    return {id: card.id, stage, canLearn: !owned && gates.every(g => g.met), refusedBy: owned ? [] : gates.filter(g => !g.met).map(g => g.reason),
        gates: gates.map(({label, met}) => ({label, met})), mastery, masteryNeeded: l.masteryNeeded, practiceMinutes: l.practice?.minutes ?? null,
        sign: [...l.signs].filter(x => x.at <= mastery).sort((a, b) => b.at - a.at)[0]?.text ?? null, nextSignAt: next?.at ?? null, unstated: card.unstated};
}
