// A2 claims with named dependencies (RS16-RS18, G6). Reversible authoring
// proposal: a world declares what a belief claims, by what means, how precise it
// is and which facts it depends on. Everything compiles into existing persisted
// state (knowledge entries, actor facts) and ordinary predicates and commands.
// A claim goes stale only when one of its own dependencies stops holding; there
// is no global reliability meter. A hypothesis test resolves through weighted
// outcomes read from a hidden truth fact, so the test is equally available
// either way and reveals only the authored result, not the full rule.
import {assert, record, stableId, jsonData, validatePredicate} from './simulation_contracts.js';

const fields = new Set(['id', 'about', 'means', 'precision', 'dependsOn', 'hypothesis']);
const hypothesisFields = new Set(['refutedBy', 'test', 'refuted', 'supported']);
// Means differ in failure mode, not just in a number (RS17); worlds pick theirs.
const means = new Set(['memory', 'divination', 'information', 'report', 'investigation', 'inheritance']);
const precisions = new Set(['gist', 'event', 'window', 'exact']);
const knowledgeKey = id => `belief.${id}`;
const seen = id => ({fact: `knowledge.${knowledgeKey(id)}.seen`, op: 'eq', value: true});

export function compileClaims(definition) {
    const rows = Object.hasOwn(definition, 'claims') ? definition.claims : [];
    assert(Array.isArray(rows), 'Invalid claims.');
    const owned = id => stableId(id) && id.startsWith(definition.id + '.');
    const ids = new Set(), claims = new Map(), commands = [];
    for(const row of rows) {
        jsonData(row);
        assert(record(row) && Object.keys(row).every(k => fields.has(k)) && owned(row.id) && !ids.has(row.id), 'Invalid or duplicate claim.');
        ids.add(row.id);
        assert(typeof row.about === 'string' && row.about.length > 0 && means.has(row.means) && precisions.has(row.precision), 'A claim needs what it says, its means and its precision.');
        assert(Array.isArray(row.dependsOn), 'A claim must name its dependencies, even when it has none.');
        row.dependsOn.forEach(rule => {assert(record(rule), 'Invalid claim dependency.'); validatePredicate(rule);});
        claims.set(row.id, structuredClone(row));
        const h = row.hypothesis;
        if(h == null) continue;
        assert(record(h) && Object.keys(h).every(k => hypothesisFields.has(k)) && typeof h.refutedBy === 'string' && /^world\.[a-z][a-z0-9_.:-]*$/i.test(h.refutedBy), 'A hypothesis needs a hidden world truth to test against.');
        assert(typeof h.refuted === 'string' && h.refuted && typeof h.supported === 'string' && h.supported, 'A hypothesis needs both authored results.');
        assert(record(h.test) && typeof h.test.label === 'string' && Object.keys(h.test).every(k => ['label', 'requires', 'costs', 'actorId'].includes(k)), 'Invalid hypothesis test.');
        validatePredicate(h.test.requires);
        const actorId = h.test.actorId ?? 'player', key = knowledgeKey(row.id);
        const result = (status, value) => [{type: 'knowledge', actor: actorId, key, stage: 'understood', value},
            {type: 'fact', scope: 'actor', actor: actorId, key: `${key}.status`, value: status}];
        commands.push({id: `${row.id}.test`, revision: 1, label: h.test.label, worldId: definition.world.id, actorId, once: true,
            costs: structuredClone(h.test.costs || []), effects: [],
            requires: {all: [seen(row.id), ...(h.test.requires ? [h.test.requires] : [])]},
            // Truth 1 means the hypothesis is false. Exactly one weight is positive.
            outcomes: [{id: 'refuted', weight: {fact: h.refutedBy, scale: 1, min: 0, max: 1}, effects: result('refuted', h.refuted)},
                {id: 'supported', weight: {fact: h.refutedBy, scale: -1, add: 1, min: 0, max: 1}, effects: result('supported', h.supported)}]});
    }
    return {claims, commands};
}

// Effects that give an actor the claim as an interpreted belief plus its means
// and precision, so later checks can tell memory from divination (G6).
export function claimEffects(compiled, id, actor = 'player') {
    const c = compiled.claims.get(id); assert(c, 'Unknown claim.');
    const key = knowledgeKey(id);
    return [{type: 'knowledge', actor, key, stage: 'interpreted', value: c.about},
        {type: 'fact', scope: 'actor', actor, key: `${key}.means`, value: c.means},
        {type: 'fact', scope: 'actor', actor, key: `${key}.precision`, value: c.precision}];
}

// Held and every dependency still holds. An unknown dependency is not fresh.
export function claimFresh(compiled, id) {
    const c = compiled.claims.get(id); assert(c, 'Unknown claim.');
    return {all: [seen(id), ...structuredClone(c.dependsOn)]};
}

// Held and some dependency is known to have stopped holding. A claim with no
// dependencies cannot go stale; it can only be refuted by a test.
export function claimStale(compiled, id) {
    const c = compiled.claims.get(id); assert(c, 'Unknown claim.');
    if(!c.dependsOn.length) return null;
    return {all: [seen(id), {any: c.dependsOn.map(rule => ({not: structuredClone(rule)}))}]};
}

export function validateClaims(definition) {compileClaims(definition);}
