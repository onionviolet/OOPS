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
const fields = new Set(['id', 'commandId', 'sourceId', 'powerId', 'function', 'acquisition', 'executionKind', 'control', 'target', 'counters', 'carriers']);
const held = sourceId => ({fact: `faculty.${sourceId}.active`, op: 'eq', value: true});
const safeRule = rule => {
    const clone = structuredClone(rule);
    const clean = value => {if(!record(value))return; delete value.reason; for(const child of Object.values(value))if(Array.isArray(child))child.forEach(clean);else clean(child);};
    clean(clone); return clone;
};
const combine = rules => ({all: rules.filter(Boolean).map(safeRule), reason: 'The held method, control or target does not support this action.'});

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
    const seen = new Set(), bound = new Set();
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
        const support = combine([{any: alternatives}, row.control, row.target, ...row.counters.map(counter => ({not: counter}))]);
        command.requires = combine([command.requires, support]);
        if(command.duration > 0) {
            assert(command.cancellation === 'refund' && (command.completionFailure == null || command.completionFailure === 'refund'), 'Timed ability must return reservations when held support is lost.');
            command.completionRequires = combine([command.completionRequires, support]);
            command.completionFailure = 'refund';
        }
    }
    return {commands, powers};
}

export function validateStructuredAbilities(definition) {compileStructuredAbilities(definition);}
