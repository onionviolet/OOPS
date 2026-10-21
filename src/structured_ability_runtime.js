// Adapted from the MIT YAIRPG Air snapshot:
// /Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/wider-gameplay/yet-another-idle-rpg/src/structured_ability_runtime.js
// Upstream copyright (c) 2021 Miktaew; see LICENSE. Reversible authoring proposal.
import {assert, record, stableId, jsonData, validatePredicate} from './simulation_contracts.js';

const functions = {
    physical: new Set(['vital', 'condition', 'body', 'item', 'equipment', 'relocate']),
    craft: new Set(['item', 'transfer', 'equipment', 'container']),
    storage: new Set(['container', 'transfer', 'custody']),
    perception: new Set(['knowledge', 'observation']),
    support: new Set(['vital', 'condition', 'body', 'energy', 'relationship', 'knowledge'])
};
const acquisitions = new Set(['innate', 'learned', 'borrowed', 'acquired']);
const kinds = new Set(['body-faculty', 'permanent-imprint', 'device-construct', 'temporary-construct', 'ordinary-technique']);
const fields = new Set(['id', 'commandId', 'sourceId', 'powerId', 'function', 'acquisition', 'executionKind', 'control', 'target', 'counters', 'carriers', 'conditions']);
const conditionFields = new Set(['id', 'subject', 'sourceWorldId', 'parties', 'enforcer', 'charges', 'requires', 'strengthens', 'price', 'breach', 'ends']);
const held = sourceId => ({fact: `faculty.${sourceId}.active`, op: 'eq', value: true});
const safeRule = rule => {
    const clone = structuredClone(rule);
    const clean = value => {if(!record(value))return; delete value.reason; for(const child of Object.values(value))if(Array.isArray(child))child.forEach(clean);else clean(child);};
    clean(clone); return clone;
};
const combine = rules => ({all: rules.filter(Boolean).map(safeRule), reason: 'The held method, control or target does not support this action.'});

// Optional, world-authored conditions (RS13/RS14, G3-G5). They compile into the
// existing transaction: charges are an actor resource paid as a cost, a
// restriction is a predicate on the bound route, a lasting price is an ordinary
// effect, recharge and enforcement are separate local commands. A world that
// authors none gets byte-identical commands. `subject: 'author'` binds only the
// original source route, so a transferred carrier escapes it (the source's
// loophole); `holder` binds every route. sourceWorldId travels with the record.
// Seeds are the starting charge effects a host applies at enrollment.
// Rules treat an absent fact as unknown, so a negated breach or end test would
// fail closed forever. Simple actor/world flags start false at enrollment;
// other evidence (knowledge, items) must exist before it is negated.
function seedFlags(rule, actorId, seeds) {
    if(!record(rule)) return;
    for(const child of rule.all || rule.any || []) seedFlags(child, actorId, seeds);
    if(rule.not) seedFlags(rule.not, actorId, seeds);
    const scope = typeof rule.fact === 'string' && rule.op === 'eq' && rule.value === true && ['actor', 'world'].find(s => rule.fact.startsWith(s + '.'));
    if(scope) seeds.push({type: 'fact', scope, ...(scope === 'actor' ? {actor: actorId} : {}), key: rule.fact.slice(scope.length + 1), value: false});
}
function compileConditions(definition, row, command, powers, owned) {
    const out = {primary: [], every: [], commands: [], records: [], seeds: []};
    if(!Object.hasOwn(row, 'conditions')) return out;
    assert(Array.isArray(row.conditions) && row.conditions.length > 0, 'Ability conditions must be a non-empty list.');
    const seen = new Set();
    for(const c of row.conditions) {
        assert(record(c) && Object.keys(c).every(k => conditionFields.has(k)) && owned(c.id) && !seen.has(c.id), 'Invalid or duplicate ability condition.');
        seen.add(c.id);
        const subject = c.subject ?? 'holder', sourceWorldId = c.sourceWorldId ?? definition.world.id;
        assert(['holder', 'author'].includes(subject) && stableId(sourceWorldId), 'Condition needs a supported bound subject and source world.');
        assert(c.parties == null || Array.isArray(c.parties) && c.parties.length > 0 && new Set(c.parties).size === c.parties.length && c.parties.every(stableId), 'Invalid condition parties.');
        if(c.enforcer != null) assert(record(c.enforcer) && ['law', 'agent'].includes(c.enforcer.kind) && typeof c.enforcer.reason === 'string' && c.enforcer.reason.length > 0 && (c.enforcer.kind === 'law' || stableId(c.enforcer.id)), 'Enforcer needs a kind, an in-world reason and an agent id when it is a person.');
        [c.requires, c.ends].forEach(validatePredicate);
        seedFlags(c.ends, command.actorId, out.seeds);
        const rules = [];
        if(c.requires) rules.push(c.requires);
        if(c.breach != null) {
            assert(record(c.breach) && record(c.breach.when) && ['block', 'consequence'].includes(c.breach.mode), 'Breach needs a test and a mode.');
            validatePredicate(c.breach.when);
            seedFlags(c.breach.when, c.breach.mode === 'block' || c.enforcer?.kind !== 'agent' ? command.actorId : c.enforcer.id, out.seeds);
            if(c.breach.mode === 'block') rules.push({not: c.breach.when});
            else {
                assert(c.enforcer && Array.isArray(c.breach.effects) && c.breach.effects.length > 0 && (c.enforcer.kind === 'agent' || stableId(c.breach.penalized)), 'A breach consequence needs an enforcer, effects and, under law, the penalized party.');
                c.breach.effects.forEach(jsonData);
                out.commands.push({id: `${c.id}.enforce`, revision: 1, label: 'Enforce breached condition', worldId: command.worldId, ...(command.location ? {location: command.location} : {}),
                    group: 'ability_condition', actorId: c.enforcer.kind === 'agent' ? c.enforcer.id : c.breach.penalized, once: true, costs: [],
                    requires: combine([c.breach.when, c.ends && {not: c.ends}]), effects: structuredClone(c.breach.effects)});
            }
        }
        if(rules.length) (subject === 'author' ? out.primary : out.every).push(c.ends ? {any: [c.ends, {all: rules}]} : {all: rules});
        let chargesKey = null;
        if(c.charges != null) {
            const k = c.charges, r = k.recharge;
            assert(record(k) && Number.isSafeInteger(k.max) && k.max > 0 && record(r) && ['empty', 'partial'].includes(r.when), 'Charges need a positive maximum and a recharge trigger.');
            const amount = r.when === 'empty' ? k.max : r.amount ?? 1;
            assert(Number.isSafeInteger(amount) && amount > 0 && amount <= k.max, 'Invalid recharge amount.');
            const initial = k.initial ?? k.max;
            assert(Object.keys(k).every(key => ['max', 'initial', 'recharge'].includes(key)) && Number.isSafeInteger(initial) && initial >= 0 && initial <= k.max, 'Invalid starting charge.');
            validatePredicate(r.requires);
            assert(r.label == null || typeof r.label === 'string' && r.label.length > 0, 'Invalid recharge label.');
            chargesKey = `${c.id}.charges`;
            // A starting balance makes "empty" a known fact rather than an absent one.
            out.seeds.push({type: 'resource', actor: command.actorId, key: chargesKey, amount: initial});
            command.costs.push({type: 'resource', scope: 'actor', key: chargesKey, amount: -1});
            const room = r.when === 'empty' ? {not: {fact: `resource.${chargesKey}`, op: 'gte', value: 1}} : {not: {fact: `resource.${chargesKey}`, op: 'gte', value: k.max - amount + 1}};
            out.commands.push({id: `${c.id}.recharge`, revision: 1, label: r.label ?? 'Recharge', worldId: command.worldId, ...(command.location ? {location: command.location} : {}),
                group: 'ability_condition', actorId: command.actorId, costs: [], requires: combine([room, r.requires]),
                effects: [{type: 'resource', key: chargesKey, amount}]});
        }
        if(c.price != null) {
            assert(Array.isArray(c.price) && c.price.length > 0 && c.price.every(record), 'A lasting price needs actual effects.');
            c.price.forEach(jsonData); command.effects.push(...structuredClone(c.price));
        }
        if(c.strengthens != null) {
            const power = powers.find(p => p.id === row.powerId);
            assert(power && record(c.strengthens) && Object.keys(c.strengthens).join() === 'capacity' && Number.isSafeInteger(c.strengthens.capacity) && c.strengthens.capacity > 0 && rules.length, 'A strengthening condition needs a bound power and an actual restriction.');
            power.capacity = (power.capacity ?? 1) + c.strengthens.capacity;
        }
        assert(rules.length || chargesKey || c.price || c.breach, 'A condition needs a restriction, charges, a price or an enforced breach.');
        out.records.push({id: c.id, abilityId: row.id, subject, sourceWorldId, parties: c.parties ? [...c.parties] : [command.actorId], enforcer: c.enforcer ? structuredClone(c.enforcer) : null, chargesKey});
    }
    return out;
}

// Authoring adapter only: all costs, effects, ownership, power acquisition and
// completion remain in the shared native command transaction. Classification
// never grants a source, learned power, knowledge or an extra inventory.
export function compileStructuredAbilities(definition) {
    const commands = structuredClone(definition.simulation?.commands || []);
    const powers = structuredClone(definition.simulation?.powers || []);
    const rows = Object.hasOwn(definition, 'abilities') ? definition.abilities : [];
    assert(Array.isArray(rows), 'Invalid structured abilities.');
    const owned = id => stableId(id) && id.startsWith(definition.id + '.');
    const sources = new Map((definition.sources || []).map(row => [row.id, row]));
    const seen = new Set(), bound = new Set(), conditions = [], seeds = [];
    for(const row of rows) {
        jsonData(row);
        assert(record(row) && Object.keys(row).every(key => fields.has(key)) && owned(row.id) && !seen.has(row.id), 'Invalid or duplicate structured ability.');
        seen.add(row.id);
        const command = commands.find(c => c.id === row.commandId);
        assert(command && owned(row.commandId) && !bound.has(row.commandId) && command.worldId === definition.world.id, 'Ability needs an exclusive owned local command.');
        bound.add(row.commandId);
        assert(owned(row.sourceId) && sources.has(row.sourceId), 'Ability needs an owned held source.');
        assert(functions[row.function] && acquisitions.has(row.acquisition) && kinds.has(row.executionKind), 'Invalid ability functional or acquisition kind.');
        assert(row.control && record(row.control), 'Ability needs explicit control requirements.');
        validatePredicate(row.control); validatePredicate(row.target);
        assert(Array.isArray(row.counters) && Array.isArray(row.carriers), 'Ability needs explicit counter and carrier policies.');
        row.counters.forEach(validatePredicate);
        assert(row.counters.every(record), 'Invalid ability counter.');
        const alternatives = [held(row.sourceId)], carrierIds = new Set();
        for(const carrier of row.carriers) {
            assert(record(carrier) && Object.keys(carrier).every(k => ['sourceId', 'requires'].includes(k)) && owned(carrier.sourceId) && sources.has(carrier.sourceId) && carrier.sourceId !== row.sourceId && !carrierIds.has(carrier.sourceId) && record(carrier.requires), 'Imported method needs an actual distinct carrier and compatibility rule.');
            carrierIds.add(carrier.sourceId); validatePredicate(carrier.requires);
            alternatives.push({all: [held(carrier.sourceId), safeRule(carrier.requires)]});
        }
        if(row.powerId != null) assert(owned(row.powerId) && powers.some(p => p.id === row.powerId) && command.powerId === row.powerId, 'Ability learning must bind its actual native power.');
        else assert(!command.powerId, 'Ability must declare its native learned power.');
        assert(Array.isArray(command.effects) && command.effects.some(e => functions[row.function].has(e.type)), 'Ability needs a concrete functional effect consumer.');
        assert(Array.isArray(command.costs), 'Ability must disclose its actual native costs.');
        if(row.target || command.effects.some(e => e.actor === '$target' || e.target === '$target')) assert(command.targetId || command.targetDefinitionId, 'Targeted ability needs an actual declared participant.');
        const bindings = compileConditions(definition, row, command, powers, owned);
        if(bindings.primary.length) alternatives[0] = {all: [alternatives[0], ...bindings.primary.map(safeRule)]};
        for(const extra of bindings.commands) {assert(!commands.some(c => c.id === extra.id), 'Condition command collides with an existing command.'); commands.push(extra);}
        conditions.push(...bindings.records); seeds.push(...bindings.seeds);
        const support = combine([{any: alternatives}, row.control, row.target, ...row.counters.map(counter => ({not: counter})), ...bindings.every]);
        command.requires = combine([command.requires, support]);
        if(command.duration > 0) {
            assert(command.cancellation === 'refund' && (command.completionFailure == null || command.completionFailure === 'refund'), 'Timed ability must return reservations when held support is lost.');
            command.completionRequires = combine([command.completionRequires, support]);
            command.completionFailure = 'refund';
        }
    }
    return {commands, powers, conditions, seeds};
}

export function validateStructuredAbilities(definition) {compileStructuredAbilities(definition);}
