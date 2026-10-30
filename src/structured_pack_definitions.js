import {check, object} from './basics.js';
import {requireExtensionBase} from './structured_pack_extensions.js';
import {compileStructuredExpeditions} from './structured_expedition_runtime.js';
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {compileClaims} from './claim_runtime.js';
import {validateStructuredEquipmentDefinition} from './structured_equipment_runtime.js';
import {validateStructuredRenewalDefinition} from './structured_renewal.js';
import {createContentRegistry} from './expansion_engine.js';
import {validateStructuredBootstrap} from './structured_pack_runtime.js';
import {validateLadderPresentation} from './structured_ladder_view.js';
import {jsonData, stableId,validatePredicate} from './simulation_contracts.js';

const contentFamilies = ['worlds', 'actions', 'opportunities', 'capabilities', 'sources', 'rollTables', 'techniques'];
const simulationFamilies = ['people', 'commands', 'powers', 'advancements', 'sites', 'events', 'controllers', 'transitions', 'origins', 'conditions', 'encounters', 'energies', 'pursuits', 'situations', 'containers'];
const supportedCapabilities = new Set(['native-stock', 'custody', 'jobs', 'recipient-care', 'source-function']);
const freeze = value => {
    if(object(value) || Array.isArray(value)) {Object.values(value).forEach(freeze); Object.freeze(value);}
    return value;
};
const entries = (registry, family, simulation = false) => [...((simulation ? registry?.simulation : registry)?.[family]?.values() || [])];

function preflight(extra, existing) {
    if(!existing) return;
    for(const family of contentFamilies) {
        check(existing[family] instanceof Map, `Missing native registry family: ${family}`);
        for(const id of extra[family].keys()) check(!existing[family].has(id), `Structured content collision: ${family}/${id}`);
    }
    for(const family of simulationFamilies) {
        check(existing.simulation?.[family] instanceof Map, `Missing simulation registry family: ${family}`);
        for(const id of extra.simulation[family].keys()) check(!existing.simulation[family].has(id), `Structured content collision: simulation/${family}/${id}`);
    }
}

// Definitions only. This compiler neither provisions actors/stock nor creates a
// save, native object, timer or random selection.
export function compileStructuredPack(raw, existingRegistry = null) {
    jsonData(raw);
    const d = structuredClone(raw);
    check(object(d) && d.schema === 2 && stableId(d.id) && Number.isSafeInteger(d.revision) && d.revision >= 1, 'Invalid structured pack header.');
    check(!['initial', 'activities', 'values', 'eval'].some(key => Object.hasOwn(d, key)), 'Scalar activities or executable evaluation are not structured definitions.');
    if(d.admission!=null)check(object(d.admission)&&Object.keys(d.admission).every(k=>['forms','lifeStages'].includes(k))&&[d.admission.forms,d.admission.lifeStages].every(rows=>Array.isArray(rows)&&rows.length>0&&new Set(rows).size===rows.length&&rows.every(v=>typeof v==='string'&&v.length>0)), 'Invalid native body admission.');
    check(object(d.compatibility) && d.compatibility.legacy === 'preserve-dormant' && d.compatibility.origin === 'mandatory', 'Unsupported structured pack compatibility.');
    check(Array.isArray(d.capabilities) && d.capabilities.length > 0 && new Set(d.capabilities).size === d.capabilities.length && d.capabilities.every(c => supportedCapabilities.has(c)), 'Unsupported structured pack capability.');
    check(object(d.world) && typeof d.world.label === 'string', 'Invalid structured pack world.');
    const ownedId = id => stableId(id) && id.startsWith(d.id + '.');
    check(ownedId(d.world.id), 'Structured world must belong to its pack.');
    const validateRows = (rows, family) => {
        check(Array.isArray(rows), `Invalid structured ${family}.`);
        const seen = new Set();
        for(const row of rows) {
            check(object(row) && ownedId(row.id) && !seen.has(row.id), `Invalid or duplicate structured ${family} ID.`);
            seen.add(row.id);
        }
        return seen;
    };
    const locations = validateRows(d.locations, 'locations');
    check(locations.size > 0, 'Structured pack needs a native location.');
    for(const row of d.locations) check(typeof row.label === 'string' && typeof row.description === 'string', 'Invalid structured location presentation.');
    for(const row of d.locations)if(row.underRoof!=null)check(typeof row.underRoof==='boolean','Invalid structured shelter.');
    for(const row of d.locations) if(row.combat!=null) {
        const c=row.combat;
        check(object(c)&&Object.keys(c).every(k=>['enemyIds','parentId'].includes(k))&&Array.isArray(c.enemyIds)&&c.enemyIds.length>0&&c.enemyIds.every(id=>typeof id==='string'&&id.length>0)&&locations.has(c.parentId)&&c.parentId!==row.id&&!d.locations.find(l=>l.id===c.parentId)?.combat, 'Invalid structured native combat location.');
    }
    const items = validateRows(d.items || [], 'items');
    for(const row of d.items || [])validateStructuredEquipmentDefinition(row);
    for(const row of d.items || []) check(typeof row.label === 'string' && typeof row.description === 'string', 'Invalid structured native item presentation.');
    validateRows(d.units||[], 'units');
    for(const unit of d.units||[]) {
        check(Array.isArray(unit.keys)&&unit.keys.length>0&&new Set(unit.keys).size===unit.keys.length&&unit.keys.every(key=>{try{return items.has(JSON.parse(key).id);}catch{return false;}}), 'Structured unit needs exact native condition keys.');
        check(ownedId(unit.titleClaimId)&&(unit.titleOwner==='player'||(d.simulation?.people||[]).some(p=>p.id===unit.titleOwner))&&(unit.recipient==null||unit.recipient==='player'||(d.simulation?.people||[]).some(p=>p.id===unit.recipient)), 'Structured unit needs an actual title owner and recipient.');
        if(unit.titleRecipients!=null)check(Array.isArray(unit.titleRecipients)&&unit.titleRecipients.length>0&&new Set(unit.titleRecipients).size===unit.titleRecipients.length&&unit.titleRecipients.every(id=>id==='player'||(d.simulation?.people||[]).some(p=>p.id===id)), 'Structured title transfer needs actual permitted recipients.');
        if(unit.deferred!=null)check(unit.deferred===true, 'Invalid deferred structured unit.');
    }
    check(object(d.simulation), 'Invalid structured simulation definitions.');
    check(Object.keys(d.simulation).every(f => simulationFamilies.includes(f) || f === 'onEnroll'), 'Unsupported structured simulation family.');
    check(d.simulation.onEnroll == null || Array.isArray(d.simulation.onEnroll) && d.simulation.onEnroll.length === 0, 'Structured content requires explicit initialization, not onEnroll provisioning.');
    for(const family of simulationFamilies) validateRows(d.simulation[family] || [], family);
    for(const p of d.simulation.people || []) check(p.worldId === d.world.id && locations.has(p.location), 'Structured person needs an owned world/location.');

    const presentation = d.presentation;
    check(object(presentation) && object(presentation.people) && Array.isArray(presentation.status), 'Structured content needs observer presentation.');
    const people = new Set((d.simulation.people || []).map(p => p.id));
    check(Object.keys(presentation.people).every(id => people.has(id)), 'Unknown structured presentation person.');
    for(const id of people) check(object(presentation.people[id]) && ownedId(presentation.people[id].introductionKnowledgeKey), 'Structured person needs an introduction knowledge key.');
    validateRows(presentation.status, 'status');
    validateLadderPresentation(presentation.ladders);
    for(const row of presentation.status) check(typeof row.label === 'string' && ownedId(row.knowledgeKey), 'Structured status needs held knowledge.');
    for(const command of d.simulation.commands || []) {
        check(Array.isArray(command.audience) && command.audience.length > 0, 'Structured commands require an explicit observer audience.');
        check(command.worldId === d.world.id && (command.location == null || locations.has(command.location)), 'Structured command needs an owned world/location.');
    }
    for(const c of d.simulation.containers||[]) {
        check(c.worldId===d.world.id&&c.holder==='player'&&c.category==='storage', 'Unsupported structured inventory binding.');
        for(const o of c.objects) {
            const u=(d.units||[]).find(u=>u.id===o.unitId);
            check(u&&u.keys.includes(o.key)&&(!o.expiredKey||u.keys.includes(o.expiredKey))&&u.titleClaimId===o.titleClaimId&&u.titleOwner===o.titleOwner&&(o.deferred!==true||u.deferred===true), 'Container object and identified title disagree.');
        }
    }
    for(const command of d.simulation.commands||[]) {
        const walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(!object(v))return;
            if(v.type==='relocate'&&(v.actor==null||['player','$actor'].includes(v.actor)))check(!(command.duration>0)||command.completionRequires!=null&&command.completionFailure==='refund', 'Timed native travel requires current completion support and refunds.');
            if(v.type==='container')check(!(command.duration>0)&&v.operation!=='prepare', 'Container access requires an immediate native command.');
            Object.values(v).forEach(walk);};walk(command);
    }
    if(d.capabilities.includes('source-function'))check(d.simulation.containers?.length>0,'Unsupported structured pack capability without actual consumer.');
    // Compile metadata into the commands that the shared transaction validates.
    // Absent metadata leaves the original definition and receipt hash unchanged.
    if(Object.hasOwn(d, 'abilities')) {
        const abilities = compileStructuredAbilities(d);
        // Condition commands (recharge, enforcement) are ordinary actor commands.
        d.simulation.commands = abilities.commands.map(c => c.audience ? c : {...c, audience: ['$actor']});
        if(d.simulation.powers) d.simulation.powers = abilities.powers;
    }
    // A2 claims: hypothesis tests join the commands; beliefs stay ordinary knowledge.
    if(Object.hasOwn(d, 'claims')) {
        const claims = compileClaims(d);
        d.simulation.commands = [...(d.simulation.commands || []), ...claims.commands.map(c => ({group: 'structured_local', audience: ['$actor'], ...c}))];
    }
    if(Object.hasOwn(d, 'expeditions'))d.simulation.commands = compileStructuredExpeditions(d).commands;
    const authored = {worlds: [d.world], simulation: d.simulation};
    for(const family of contentFamilies.filter(f => f !== 'worlds')) {
        const rows = (family === 'capabilities' ? d.capabilityDefinitions : d[family]) || [];
        validateRows(rows, family);
        authored[family] = rows;
    }
    // Validate against a combined registry so legal references to existing
    // native definitions work without mutating their live Maps.
    const combined = {simulation: {onEnroll: existingRegistry?.simulation?.onEnroll || []}};
    for(const family of contentFamilies) combined[family] = [...entries(existingRegistry, family), ...authored[family]];
    for(const family of simulationFamilies) combined.simulation[family] = [...entries(existingRegistry, family, true), ...(d.simulation[family] || [])];
    const all = createContentRegistry(combined);
    for(const c of d.simulation.containers||[])check(all.sources.has(c.sourceId),'Unknown structured container source.');
    const registry = {simulation: {onEnroll: []}};
    for(const family of contentFamilies) registry[family] = new Map(authored[family].map(row => [row.id, all[family].get(row.id)]));
    for(const family of simulationFamilies) registry.simulation[family] = new Map((d.simulation[family] || []).map(row => [row.id, all.simulation[family].get(row.id)]));
    preflight(registry, existingRegistry);
    const participant = id => id === 'player' || all.simulation.people.has(id) || ['$actor', '$target', '$party'].includes(id) || typeof id === 'string' && id.startsWith('$spawn.');
    const inspect = (value,allowPrepare=false) => {
        if(Array.isArray(value)) {value.forEach(v=>inspect(v,allowPrepare)); return;}
        if(!object(value)) return;
        if(value.type) {
            if(value.type==='container'&&value.operation==='prepare')check(allowPrepare,'Container preparation belongs only to a beginning.');
            for(const field of ['actor', 'target', 'from', 'to']) if(value[field] != null) check(participant(value[field]), 'Unknown structured effect participant.');
            const references = {containerId: all.simulation.containers, sourceId: all.sources, powerId: all.simulation.powers, definitionId: all.simulation.people, techniqueId: all.techniques, worldId: all.worlds};
            for(const [field, map] of Object.entries(references)) if(value[field] != null) check(map.has(value[field]), `Unknown structured effect ${field}.`);
            if(value.type === 'condition') check(all.simulation.conditions.has(value.id), 'Unknown structured condition.');
            if(['item', 'transfer', 'custody'].includes(value.type)) {
                const id = JSON.parse(value.key).id;
                if(ownedId(id)) check(items.has(id), 'Unknown structured native item.');
            }
        }
        Object.values(value).forEach(v=>inspect(v,allowPrepare));
    };
    inspect(authored);
    if(d.starts || d.bootstrap)validateStructuredBootstrap(d);
    validateStructuredRenewalDefinition(d);
    inspect(d.starts || d.bootstrap,true);
    for(const b of d.starts || [])for(const e of b.effects)if(e.type==='relocate')check(locations.has(e.location),'Unknown structured beginning location.');
    for(const family of simulationFamilies) for(const row of d.simulation[family] || []) {
        if(row.worldId != null) check(all.worlds.has(row.worldId), 'Unknown structured definition world.');
        for(const field of ['actorId', 'targetId']) if(row[field] != null) check(participant(row[field]), 'Unknown structured definition participant.');
        for(const id of row.audience || []) check(participant(id), 'Unknown structured command audience.');
    }
    return {definition: freeze(d), registry};
}

// Every collision is checked before the first live Map mutation.
export function mergeStructuredPack(compiled, registry) {
    check(compiled?.definition?.schema === 2 && compiled.registry, 'Expected compiled structured pack.');
    preflight(compiled.registry, registry);
    for(const family of contentFamilies) for(const [id, row] of compiled.registry[family]) registry[family].set(id, row);
    for(const family of simulationFamilies) for(const [id, row] of compiled.registry.simulation[family]) registry.simulation[family].set(id, row);
    return compiled.definition;
}

// Native constructors can register availability before their caller publishes a
// pack. Restore those exact entries if any constructor refuses the definition.
export function stageStructuredNativeObjects(d,{availabilities,makeLocation,makeItem,makeInventory}) {
    const before=Object.fromEntries(Object.entries(availabilities).map(([category,rows])=>[category,{...rows}]));
    try {
        return {locations:d.locations.map(l=>[l.id,makeLocation(l)]),items:(d.items||[]).map(i=>[i.id,makeItem(i)]),
            inventories:(d.simulation.containers||[]).map(c=>[c.category,c.id,makeInventory(c)])};
    } catch(error) {
        for(const category of Object.keys(availabilities)) {
            if(!before[category])delete availabilities[category];
            else {for(const key of Object.keys(availabilities[category]))delete availabilities[category][key];Object.assign(availabilities[category],before[category]);}
        }
        throw error;
    }
}

// Compile against the existing base's world/means without merging another world,
// item, actor, start or replacement command. Publish only after all checks pass.
export function registerStructuredCommandExtension(raw,contentHash,base,registry) {
    jsonData(raw);requireExtensionBase(raw,base);
    check(raw.schema===1&&stableId(raw.id)&&raw.id.startsWith(base.id+'.')&&Number.isSafeInteger(raw.revision)&&raw.revision>0&&/^sha256:[a-f0-9]{64}$/.test(contentHash),'Invalid command extension header.');
    check(Object.keys(raw).every(k=>['schema','id','revision','base','label','description','requires','reason','commands'].includes(k))&&typeof raw.label==='string'&&typeof raw.description==='string'&&typeof raw.reason==='string'&&Array.isArray(raw.commands)&&raw.commands.length>0,'Only a command extension is supported.');
    validatePredicate(raw.requires);
    check(!(base.extensions||[]).some(e=>e.id===raw.id),'Duplicate structured extension.');
    for(const c of raw.commands)check(c.id.startsWith(raw.id+'.')&&!registry.simulation.commands.has(c.id)&&c.duration>0&&c.cancellation==='refund'&&c.reservationReturns===1&&!c.outcomes&&!c.fluency&&!c.powerId,'Unsupported or colliding extension command.');
    for(const c of raw.commands)check((c.costs||[]).every(e=>['item','vital'].includes(e.type)&&typeof e.amount==='number')&&(c.effects||[]).every(e=>['item','knowledge','xp'].includes(e.type)&&(!('amount' in e)||typeof e.amount==='number')),'Command-only extensions cannot provision actors, faculties or new runtime owners.');
    const candidate={...base,simulation:{...base.simulation,commands:[...base.simulation.commands,...raw.commands]}};
    const compiled=compileStructuredPack(candidate);
    const commands=raw.commands.map(c=>compiled.registry.simulation.commands.get(c.id));
    const extension=freeze({...structuredClone(raw),contentHash,commands});
    // No constructor or asynchronous operation occurs after this preflight.
    for(const c of commands)check(!registry.simulation.commands.has(c.id),'Structured extension command collision.');
    for(const c of commands)registry.simulation.commands.set(c.id,c);
    base.extensions=[...(base.extensions||[]),extension];
    return extension;
}
