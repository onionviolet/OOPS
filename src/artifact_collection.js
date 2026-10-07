// Compile physical artifact collections into the existing paid command system.
// There is no second inventory, power owner, save namespace or reward publisher.
import {assert, copy, jsonData, natural, record, stableId, validatePredicate, validateSimulationEffect} from './simulation_contracts.js';
import {validateItemKey} from './gameplay_transactions.js';

const all = (...rules) => ({all: rules.filter(Boolean)});
const item = (key, amount, returned = false) => ({type: 'item', key, amount, ...(returned ? {reservationReturn: true} : {})});
const positive = value => natural(value) && value > 0;

export function itemPossessionRule(key, count = 1, reason = 'Carry the required actual item.') {
    validateItemKey(key); assert(positive(count), 'An item gate needs a positive exact count.');
    return {fact: `item.${key}`, op: 'gte', value: count, reason};
}

// Native equipment lives in the host's fresh snapshot, not simulation.equipment.
// Check that owner as well before reserving physical assembly/use inputs. The
// executor remains authoritative for counts, custody and the paid transaction.
export function artifactEquipmentReasons(costs, state, context = {}) {
    const actorId = value => value == null || value === '$actor' ? context.actorId : value === '$target' ? context.targetId : value;
    const reasons = new Set();
    for(const cost of costs || []) {
        const owner = cost.type === 'item' && cost.amount < 0 ? actorId(cost.actor)
            : ['transfer', 'custody'].includes(cost.type) ? actorId(cost.from) : null;
        if(!owner || !cost.key) continue;
        const native = state.simulation?.people?.[owner]?.inventory === 'native';
        const equipment = native ? context.equipment?.[owner] : state.simulation?.equipment?.[owner];
        if(native && !record(equipment)) {
            reasons.add('Read the current native equipment before reserving an artifact input.');
            continue;
        }
        if(Object.values(equipment || {}).includes(cost.key)) reasons.add('Unequip the actual artifact input before reserving or handing it over.');
    }
    return [...reasons];
}

function baseCommand(collection, definition) {
    assert(positive(collection.revision) && stableId(collection.worldId) && stableId(collection.actorId || 'player') && stableId(collection.group || 'artifact_collection'), 'Invalid artifact command owner.');
    assert(stableId(definition.id) && typeof definition.label === 'string' && definition.label.length > 0, 'Artifact actions need an ID and label.');
    assert(natural(definition.duration || 0), 'Artifact work needs a whole played-minute duration.');
    validatePredicate(definition.requires); validatePredicate(definition.visibleWhen);
    for(const e of [...(definition.costs || []), ...(definition.effects || [])]) validateSimulationEffect(e);
    return {costs: [], effects: [], ...(collection.location ? {location: collection.location} : {}), ...copy(definition),
        revision: collection.revision, actorId: collection.actorId || 'player', worldId: collection.worldId, group: collection.group || 'artifact_collection', reservationReturns: 1,
        requires: all(collection.requires, definition.requires), visibleWhen: all(collection.visibleWhen, definition.visibleWhen)};
}

// Recipes name their exact ingredients and immutable output variant. Partial
// assemblies can themselves be ingredients. Unknown references and cycles fail
// during content loading, before any player accepts a paid transformation.
export function compileArtifactCollection(collection) {
    assert(record(collection), 'An artifact collection needs a definition.'); jsonData(collection);
    assert(stableId(collection.id) && stableId(collection.worldId) && positive(collection.revision), 'Invalid artifact collection identity.');
    assert(Array.isArray(collection.pieces) && collection.pieces.length > 0 && Array.isArray(collection.recipes || []), 'Declare the actual artifact pieces.');
    validatePredicate(collection.requires); validatePredicate(collection.visibleWhen);
    const entries = new Map(), keys = new Set(), commands = [], ids = new Set();
    for(const d of [...collection.pieces, ...(collection.recipes || [])]) {
        assert(stableId(d.id) && !entries.has(d.id) && typeof d.label === 'string', 'Duplicate or invalid artifact piece.');
        validateItemKey(d.key); assert(!keys.has(d.key), 'Artifact variants need distinct physical item identities.');
        keys.add(d.key); entries.set(d.id, copy(d));
    }
    const recipes = new Map((collection.recipes || []).map(d => [d.id, d])), visiting = new Set(), visited = new Set();
    const visit = id => {
        assert(!visiting.has(id), 'Artifact assembly recipes cannot form a cycle.');
        if(visited.has(id)) return;
        visiting.add(id); const recipe = recipes.get(id);
        if(recipe) {
            assert(Array.isArray(recipe.parts) && recipe.parts.length > 0, 'An assembly needs exact physical inputs.');
            const partIds = new Set();
            for(const p of recipe.parts) {
                assert(record(p) && entries.has(p.id) && !partIds.has(p.id) && positive(p.count), 'Invalid, duplicate or missing artifact ingredient.');
                partIds.add(p.id); visit(p.id);
            }
        }
        visiting.delete(id); visited.add(id);
    };
    entries.forEach((_, id) => visit(id));
    const add = d => {
        assert(!ids.has(d.id), 'Duplicate artifact action.'); ids.add(d.id); commands.push(baseCommand(collection, d));
    };
    for(const recipe of recipes.values()) {
        assert(record(recipe.assembly), 'An artifact recipe needs an authored assembly action.');
        assert(!recipe.assembly.outcomes && !recipe.assembly.encounterId, 'Exact assembly cannot hide another outcome or encounter.');
        // Transformations cannot hide a second physical input/output in extras.
        // Fuel belongs to uses; all assembly materials belong in recipe.parts.
        for(const extra of [...(recipe.assembly.costs || []), ...(recipe.assembly.effects || [])])
            assert(!['item', 'transfer', 'custody', 'equipment'].includes(extra.type), 'Assembly stock must be declared in its exact recipe.');
        add({...recipe.assembly, id: `${collection.id}.assemble.${recipe.id}`, cancellation: 'refund',
            costs: [...recipe.parts.map(p => item(entries.get(p.id).key, -p.count)), ...(recipe.assembly.costs || [])],
            effects: [item(recipe.key, 1), ...(recipe.assembly.effects || [])]});
        if(recipe.disassembly) {
            assert(record(recipe.disassembly), 'Invalid artifact disassembly action.');
            assert(!recipe.disassembly.outcomes && !recipe.disassembly.encounterId, 'Exact disassembly cannot hide another outcome or encounter.');
            for(const extra of [...(recipe.disassembly.costs || []), ...(recipe.disassembly.effects || [])])
                assert(!['item', 'transfer', 'custody', 'equipment'].includes(extra.type), 'Disassembly returns only this variant\'s exact ingredients.');
            add({...recipe.disassembly, id: `${collection.id}.disassemble.${recipe.id}`, cancellation: 'refund',
                costs: [item(recipe.key, -1), ...(recipe.disassembly.costs || [])],
                effects: [...recipe.parts.map(p => item(entries.get(p.id).key, p.count, true)), ...(recipe.disassembly.effects || [])]});
        }
    }
    for(const use of collection.uses || []) {
        assert(record(use) && stableId(use.id) && entries.has(use.carrier), 'An artifact use needs a declared physical carrier.');
        const carrier = entries.get(use.carrier);
        // Reserve the actual unequipped, owned apparatus, not a durable "has"
        // flag. The normal executor rejects custody and concurrent stock use.
        const extras = [...(use.costs || []), ...(use.effects || []), ...(use.outcomes || []).flatMap(o => o.effects || [])];
        for(const e of extras)
            assert(!(['item', 'transfer', 'custody', 'equipment'].includes(e.type) && e.key === carrier.key), 'An artifact use cannot also change its reserved carrier.');
        const action = copy(use); delete action.carrier;
        add({...action, id: `${collection.id}.use.${use.id}`, cancellation: 'refund',
            requires: all(itemPossessionRule(carrier.key, 1, `Carry ${carrier.label}.`), use.requires),
            costs: [item(carrier.key, -1), ...(use.costs || [])],
            effects: [item(carrier.key, 1, true), ...(use.effects || [])]});
    }
    return {id: collection.id, revision: collection.revision, entries: [...entries.values()], commands};
}

// Possession unlocks a scene without consuming or granting the gate item. The
// existing encounter session reserves its participants, owns responses and
// checks each response's actual costs against fresh inventory snapshots.
export function compileItemEncounter({command, encounter, items, ...defaults}) {
    assert(record(command) && record(encounter) && Array.isArray(items) && items.length > 0, 'An item encounter needs declared gates and a scene.');
    assert(command.encounterId == null && !(command.effects || []).length && !command.duration && !(command.costs || []).length && !command.outcomes,
        'Item encounter entry must not spend, transform or freeze unrelated outcomes.');
    const gates = items.map(d => itemPossessionRule(d.key, d.count ?? 1, d.reason));
    const location = command.location || defaults.location;
    const contact = [{fact: 'actor.world', op: 'eq', value: defaults.worldId}];
    if(location) contact.push({fact: 'actor.location', op: 'eq', value: location});
    if(command.targetId) {
        contact.push({fact: 'target.life', op: 'eq', value: 'alive'}, {fact: 'target.world', op: 'eq', value: defaults.worldId});
        if(command.coLocated && location) contact.push({fact: 'target.location', op: 'eq', value: location});
    }
    const entry = baseCommand({...defaults, id: command.id}, {...command, encounterId: encounter.id,
        requires: all(command.requires, ...gates), visibleWhen: all(command.visibleWhen, ...gates)});
    const scene = copy(encounter);
    assert(Array.isArray(scene.turns) && scene.turns.length > 0, 'An item encounter needs authored choices.');
    for(const turn of scene.turns) {
        assert(Array.isArray(turn.responses) && turn.responses.length > 0, 'An item encounter needs responses.');
        for(const response of turn.responses) response.requires = all(defaults.requires, command.requires, response.requires, ...contact, ...gates);
    }
    return {command: entry, encounter: scene};
}

// Read-only inventory projection. Display the recipe and count that actually
// exist; this view never grants items, mastery, source powers or assembly credit.
export function artifactCollectionView(compiled, inventory = {}) {
    return compiled.entries.map(d => ({id: d.id, label: d.label, key: d.key,
        carried: natural(inventory[d.key]) ? inventory[d.key] : 0,
        parts: (d.parts || []).map(p => ({id: p.id, count: p.count}))}));
}
