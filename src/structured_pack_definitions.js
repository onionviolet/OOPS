import {check, object} from './basics.js';
import {isKeeperColonyEffect, keeperColonyEffectPack, keeperFarmWorld} from './gu_keeper_colony.js';
import {isKeeperTimeEffect, keeperTime, keeperTimeWorld} from './gu_keeper_time.js';
import {isKeeperWildEffect, keeperWildEffectPack, keeperWildWorld} from './gu_keeper_wild.js';
import {guRefinePackEffect} from './gu_refiner_registry.js';
import {isKeeperRefinementEffect, keeperRefinementEffectPack, keeperRefinementWorld} from './gu_keeper_refinement.js';
import {isMoonlightTrialEffect, moonlightTrialEffectPack, moonlightTrialWorld} from './gu_keeper_moonlight_trial.js';
import {isKeeperMoveTrialEffect, keeperMoveCommandId, keeperMoveTrialEffectPack, keeperMoveTrialWorld} from './gu_keeper_move_trial.js';
import {isKeeperRainbowEffect, keeperRainbow, keeperRainbowWorld} from './world_packs/book_gu_keeper_sustained.js';
import {isKeeperPropagationEffect, keeperPropagationEffectPack, keeperPropagationWorld} from './gu_keeper_propagation.js';
import {keeperPotatoMarket, potatoMarketEffects} from './gu_keeper_potato_market.js';
import {keeperVitality} from './world_packs/book_gu_keeper_gardens.js';
import {vitalityLeaf} from './gu_vitality_grass.js';
import {isKeeperFixedForgeEffect, keeperFixedForgeEffectPack, keeperFixedForgeWorld} from './gu_keeper_fixed_forge.js';
import {isKeeperFusionEffect, keeperFusionEffectPack, keeperFusionWorld} from './gu_keeper_fusion.js';
import {isKeeperGoalEffect, keeperGoal, keeperGoalWorld} from './gu_keeper_goal.js';
import {isKeeperSpiritEffect, keeperSpirit, keeperSpiritWorld} from './gu_keeper_spirit.js';
import {isKeeperProcedureEffect, keeperProcedureEffectPack, keeperProcedureWorld} from './gu_keeper_procedure.js';
import {isKeeperAntNestEffect, keeperAntNest, keeperAntWorld, antBroodMinutes} from './gu_keeper_ant_nest.js';
import {isKeeperAttitudeEffect, keeperAttitude, keeperAttitudeWorld} from './gu_keeper_attitude.js';
import {isKeeperFixedTravelEffect, keeperFixedTravel, keeperFixedTravelWorld} from './gu_keeper_immortal_travel.js';
import {isKeeperCooperationEffect, keeperCooperationEffectPack, keeperCooperationWorld} from './gu_keeper_cooperation.js';
import {isHostedWolfEffect, hostedWolfEffectPack, hostedWolfWorld} from './gu_hosted_wolf.js';
import {smokePassage, smokeSteward, smokeStewardDestinations} from './gu_smoke_passage.js';
import {requireExtensionBase,structuredSupportCommand} from './structured_pack_extensions.js';
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

// Bundled extensions may add local places. The base world, actors and
// beginning stay pinned. Stage native objects after the definition checks.
export function registerStructuredCommandExtension(raw,contentHash,base,registry,stageObjects,{bundledInstant=false}={}) {
    jsonData(raw, 0, raw?.id || 'extension');requireExtensionBase(raw,base);
    check(raw.schema===1&&stableId(raw.id)&&raw.id.startsWith(base.id+'.')&&Number.isSafeInteger(raw.revision)&&raw.revision>0&&/^sha256:[a-f0-9]{64}$/.test(contentHash),'Invalid command extension header.');
    check(Object.keys(raw).every(k=>['schema','id','revision','base','label','description','requires','reason','commands','items','status','locations','dependsOn','energies','roles','conditions','supportAlternatives'].includes(k))&&typeof raw.label==='string'&&typeof raw.description==='string'&&typeof raw.reason==='string'&&Array.isArray(raw.commands)&&raw.commands.length>0,'Only a command extension is supported.');
    validatePredicate(raw.requires);
    if(raw.supportAlternatives!==undefined) {
        check(bundledInstant&&Array.isArray(raw.supportAlternatives)&&raw.supportAlternatives.length>0,'Alternate means need a bundled method.');
        for(const a of raw.supportAlternatives) {
            const target=base.extensions?.find(e=>e.id===a?.target?.id&&e.revision===a.target.revision&&e.contentHash===a.target.contentHash);
            check(target&&Object.keys(a).sort().join(',')==='admission,commands,replaces,requires,target'&&typeof a.admission==='boolean'&&Array.isArray(a.commands)&&a.commands.length>0&&new Set(a.commands).size===a.commands.length&&a.commands.every(id=>target.commands.some(c=>c.id===id)),'Alternate means need an exact installed target and named commands.');
            validatePredicate(a.requires);check(a.requires!=null,'Alternate means need actual support.');
            validatePredicate(a.replaces);
            const receipt=a.replaces;
            check(object(receipt)&&Object.keys(receipt).sort().join(',')==='fact,op,value'&&receipt.fact.startsWith(`completed.${base.id}.`)&&receipt.op==='eq'&&receipt.value===true,'Alternate means replace one explicit completed receipt.');
            const contains=rule=>JSON.stringify(rule)===JSON.stringify(receipt)||['all','any'].some(join=>rule?.[join]?.some(contains));
            check((!a.admission||contains(target.requires))&&a.commands.every(id=>{const command=target.commands.find(c=>c.id===id);return ['requires','visibleWhen','completionRequires'].every(field=>contains(command[field]));}),'Alternate receipt must occur in admission and every named command support.');
        }
    }
    check(!(base.extensions||[]).some(e=>e.id===raw.id),'Duplicate structured extension.');
    for(const c of raw.commands) {
        // Curated player continuations can spend an attempt irreversibly (a
        // continuously fueled Gu, for example). Keep the existing refund path
        // and validate the same costs/effects and base ownership below.
        const spent=bundledInstant&&c.actorId==='player'&&c.cancellation==='forfeit'&&
            c.completionFailure==='forfeit'&&(c.reservationReturns??0)===0;
        const timed=c.duration>0&&(c.cancellation==='refund'&&c.reservationReturns===1||spent)&&!c.outcomes&&!c.powerId;
        const instant=bundledInstant&&c.duration===0&&c.actorId==='player'&&
            (!c.powerId||base.simulation.powers?.some(power=>power.id===c.powerId));
        check(c.id.startsWith(raw.id+'.')&&!registry.simulation.commands.has(c.id)&&!c.fluency&&(timed||instant),'Unsupported or colliding extension command.');
    }
    const roles=raw.roles||[];
    check(raw.roles===undefined||bundledInstant&&Array.isArray(roles)&&roles.length>0&&new Set(roles.map(r=>r.id)).size===roles.length&&roles.every(role=>role&&role.id.startsWith(raw.id+'.')&&role.worldId===base.world.id&&role.inventory==='simulation'&&role.provision===false&&role.introductionKnowledgeKey?.startsWith(raw.id+'.')&&!registry.simulation.people.has(role.id)),'Optional people need distinct, non-provisioned, local role definitions.');
    check(roles.every(role=>raw.commands.some(c=>(c.effects||[]).some(e=>e.type==='knowledge'&&e.actor==='player'&&e.key===role.introductionKnowledgeKey))),'Optional people need a declared player introduction.');
    const items=raw.items||[],status=raw.status||[];
    const own=id=>stableId(id)&&id.startsWith(raw.id+'.');
    const conditions=raw.conditions||[];
    check(raw.conditions===undefined||bundledInstant&&roles.length>0&&Array.isArray(conditions)&&conditions.length>0&&
        new Set(conditions.map(d=>d.id)).size===conditions.length&&conditions.every(d=>object(d)&&own(d.id)&&
            !registry.simulation.conditions.has(d.id)&&Object.keys(d).every(k=>['id','revision','label','stacking','absence'].includes(k))&&
            d.stacking==='max'&&d.absence==='zero'),'Optional conditions need local introduced people and inert condition definitions.');
    const energies=raw.energies||[];
    check(raw.energies===undefined||bundledInstant&&Array.isArray(energies)&&energies.length>0&&
        energies.every(d=>object(d)&&own(d.id)&&!registry.simulation.energies.has(d.id)),
        'Optional energy policies need a bundled continuation and unused local identities.');
    const locations=raw.locations||[];
    check(raw.locations===undefined||bundledInstant&&Array.isArray(locations)&&locations.length>0&&
        locations.every(l=>object(l)&&own(l.id)&&Object.keys(l).every(k=>['id','label','description','underRoof'].includes(k))),
        'Optional places need a bundled continuation.');
    const dependencies=raw.dependsOn||[];
    const previous=base.extensions||[];
    check(raw.dependsOn===undefined||bundledInstant&&Array.isArray(dependencies)&&dependencies.length>0&&
        new Set(dependencies).size===dependencies.length&&dependencies.every(id=>previous.some(e=>e.id===id)),
        'Install bundled continuation dependencies first.');
    const localLocations=[...base.locations,...locations,...previous.filter(e=>dependencies.includes(e.id)).flatMap(e=>e.locations||[])];
    const dependencyRoles=previous.filter(e=>dependencies.includes(e.id)).flatMap(e=>e.roles||[]);
    for(const c of raw.commands)check(c.location==null||localLocations.some(l=>l.id===c.location),'Unknown extension command location.');
    for(const c of raw.commands){
        const playerEffect=e=>c.actorId==='player'&&(e.actor==null||e.actor==='player'||e.actor==='$actor');
        const localEnergy=e=>e.type==='energy'&&playerEffect(e)&&energies.some(row=>row.id===e.energyId)&&e.policy===undefined;
        const existingEnergy=e=>localEnergy(e)||e.type==='energy'&&playerEffect(e)&&base.simulation.energies?.some(row=>row.id===e.energyId);
        const role=roles.find(r=>r.id===c.targetId)||registry.simulation.people.get(c.targetId);
        const ownRole=role?.provision===false&&role.inventory==='simulation'&&role.worldId===base.world.id&&role.id.startsWith(raw.id+'.');
        const dependentRole=role?.provision===false&&role.inventory==='simulation'&&role.worldId===base.world.id&&dependencyRoles.some(r=>r.id===role.id);
        const coLocatedTarget=c.actorId==='player'&&c.coLocated===true&&(c.duration===0||c.completionCoLocated===true)&&(base.simulation.people?.some(p=>p.id===c.targetId)||bundledInstant&&ownRole);
        const spawnRole=e=>bundledInstant&&e.type==='spawn'&&e.personId===e.definitionId&&e.personId.startsWith(raw.id+'.')&&roles.some(r=>r.id===e.definitionId);
        const roleCondition=e=>bundledInstant&&coLocatedTarget&&ownRole&&e.type==='condition'&&e.actor===c.targetId&&
            conditions.some(d=>d.id===e.id)&&(e.operation==='remove'||e.operation==='apply'&&e.intensity===1&&Number.isSafeInteger(e.duration)&&e.duration>0);
        const departRole=e=>bundledInstant&&dependentRole&&c.actorId==='player'&&c.coLocated===true&&c.duration===0&&
            e.type==='relocate'&&e.actor===c.targetId&&locations.some(l=>l.id===e.location);
        const offeredTransfer=e=>bundledInstant&&coLocatedTarget&&ownRole&&e.type==='transfer'&&e.from===c.targetId&&e.to==='player'&&Number.isSafeInteger(e.count)&&e.count>0;
        const allowedCost=e=>['item','vital'].includes(e.type)&&typeof e.amount==='number'||
            existingEnergy(e)&&e.operation==='use'&&Number.isSafeInteger(e.output)&&Number.isSafeInteger(e.control);
        const patrolLeaf=e=>bundledInstant&&raw.id==='book.ri.lead.leaf_treatment'&&base.world.id==='book.ri.lead.world'&&
            c.id==='book.ri.lead.leaf_treatment.treat'&&c.duration===0&&playerEffect(e)&&
            e.type==='fact'&&e.scope==='actor'&&e.key==='book.ri.lead.day.injured'&&e.value===false;
        const allowedEffect=e=>bundledInstant&&raw.id==='book.ri.lead.half_stone_piece'&&c.id===raw.id+'.draw'&&e.type==='riStoneDraw'&&e.actor==='player'&&e.amount===1||spawnRole(e)||roleCondition(e)||departRole(e)||offeredTransfer(e)||['item','knowledge','xp'].includes(e.type)&&(!('amount' in e)||typeof e.amount==='number')||patrolLeaf(e)||
            e.type==='fact'&&['actor','world'].includes(e.scope)&&playerEffect(e)&&own(e.key)||
            e.type==='relationship'&&coLocatedTarget&&e.actor===c.targetId&&e.target==='player'&&
                (e.axis==='tie.affection'||bundledInstant&&ownRole&&e.axis==='tie.trust')&&Number.isSafeInteger(e.amount)||
            e.type==='relocate'&&playerEffect(e)&&localLocations.some(row=>row.id===e.location)||
            existingEnergy(e)&&e.operation==='recover'&&Number.isSafeInteger(e.amount)||
            localEnergy(e)&&e.operation==='learn';
        const outcomes=(c.outcomes||[]).flatMap(outcome=>outcome.effects||[]);
        const practice=e=>bundledInstant&&c.duration===0&&e.type==='power'&&playerEffect(e)&&
            c.powerId===e.powerId&&e.operation==='refine'&&Number.isSafeInteger(e.amount)&&e.amount>0;
        const tendColony=e=>bundledInstant&&raw.id===keeperColonyEffectPack(e.operation)&&base.world.id===keeperFarmWorld&&
            c.duration===0&&playerEffect(e)&&e.type==='guColony'&&isKeeperColonyEffect(e);
        const useSeal=e=>bundledInstant&&raw.id===keeperTime&&base.world.id===keeperTimeWorld&&
            c.id===`${keeperTime}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperTimeEffect(e);
        const trackWorm=e=>bundledInstant&&raw.id===keeperWildEffectPack(e.operation)&&base.world.id===keeperWildWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperWildEffect(e);
        const refineImmortal=e=>bundledInstant&&raw.id===keeperRefinementEffectPack(e.operation)&&base.world.id===keeperRefinementWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperRefinementEffect(e);
        const compareMoonlight=e=>bundledInstant&&raw.id===moonlightTrialEffectPack(e.operation)&&base.world.id===moonlightTrialWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isMoonlightTrialEffect(e);
        const testMove=e=>bundledInstant&&raw.id===keeperMoveTrialEffectPack(e.operation)&&base.world.id===keeperMoveTrialWorld&&
            c.id===keeperMoveCommandId(e)&&c.duration===0&&playerEffect(e)&&isKeeperMoveTrialEffect(e);
        const holdRainbow=e=>bundledInstant&&raw.id===keeperRainbow&&base.world.id===keeperRainbowWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperRainbowEffect(e);
        const propagateGu=e=>bundledInstant&&raw.id===keeperPropagationEffectPack(e.operation)&&base.world.id===keeperPropagationWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperPropagationEffect(e);
        const tradePotato=e=>bundledInstant&&raw.id===keeperPotatoMarket&&base.world.id===keeperPropagationWorld&&
            c.actorId==='player'&&c.duration===0&&e.type==='transfer'&&
            potatoMarketEffects(c.id.slice(raw.id.length+1))?.some(allowed=>Object.keys(e).length===Object.keys(allowed).length&&
                Object.entries(allowed).every(([key,value])=>e[key]===value));
        const healLeaf=e=>bundledInstant&&raw.id===keeperVitality&&base.world.id===keeperPropagationWorld&&
            c.id===`${keeperVitality}.treat_leaf`&&c.duration===0&&playerEffect(e)&&e.type==='vital'&&
            e.key==='health'&&e.amount===vitalityLeaf.health;
        const followWolf=e=>bundledInstant&&raw.id===hostedWolfEffectPack(e.operation)&&base.world.id===hostedWolfWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isHostedWolfEffect(e);
        const walkWithSteward=e=>bundledInstant&&raw.id===smokePassage&&base.world.id===hostedWolfWorld&&c.duration===0&&
            e.type==='relocate'&&e.actor===smokeSteward&&e.location===smokeStewardDestinations[c.id.slice(smokePassage.length+1)];
        const requestAid=e=>bundledInstant&&raw.id===keeperCooperationEffectPack(e.operation)&&base.world.id===keeperCooperationWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperCooperationEffect(e);
        const immortalTravel=e=>bundledInstant&&raw.id===keeperFixedTravel&&base.world.id===keeperFixedTravelWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperFixedTravelEffect(e);
        const attitudeTrial=e=>bundledInstant&&raw.id===keeperAttitude&&base.world.id===keeperAttitudeWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperAttitudeEffect(e);
        const raiseAnts=e=>bundledInstant&&raw.id===keeperAntNest&&base.world.id===keeperAntWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===(e.operation==='brood'?antBroodMinutes:0)&&playerEffect(e)&&isKeeperAntNestEffect(e);
        const tryProcedure=e=>bundledInstant&&raw.id===keeperProcedureEffectPack(e.operation)&&base.world.id===keeperProcedureWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperProcedureEffect(e);
        const spirit=e=>bundledInstant&&raw.id===keeperSpirit&&base.world.id===keeperSpiritWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperSpiritEffect(e);
        const researchGoal=e=>bundledInstant&&raw.id===keeperGoal&&base.world.id===keeperGoalWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperGoalEffect(e);
        const fuseMoon=e=>bundledInstant&&raw.id===keeperFusionEffectPack(e.operation)&&base.world.id===keeperFusionWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperFusionEffect(e);
        const forgeFixed=e=>bundledInstant&&raw.id===keeperFixedForgeEffectPack(e.operation)&&base.world.id===keeperFixedForgeWorld&&
            c.id===`${raw.id}.${e.operation}`&&c.duration===0&&playerEffect(e)&&isKeeperFixedForgeEffect(e);
        check((c.costs||[]).every(allowedCost)&&[...(c.effects||[]),...outcomes].every(e=>allowedEffect(e)||guRefinePackEffect(e,{pack:raw.id,world:base.world.id,command:c.id,player:bundledInstant&&playerEffect(e)})||practice(e)||tendColony(e)||useSeal(e)||trackWorm(e)||refineImmortal(e)||compareMoonlight(e)||testMove(e)||holdRainbow(e)||propagateGu(e)||tradePotato(e)||healLeaf(e)||followWolf(e)||walkWithSteward(e)||requestAid(e)||immortalTravel(e)||attitudeTrial(e)||raiseAnts(e)||tryProcedure(e)||spirit(e)||researchGoal(e)||fuseMoon(e)||forgeFixed(e)),'Command-only extensions cannot provision actors, faculties or new runtime owners.');
    }
    const notes=new Set(raw.commands.flatMap(c=>c.effects||[]).filter(e=>e.type==='knowledge'&&e.actor==='player').map(e=>e.key));
    check(raw.items===undefined||Array.isArray(items)&&items.length>0&&items.every(i=>object(i)&&own(i.id)&&Object.keys(i).every(k=>['id','label','description','value'].includes(k))&&Number.isSafeInteger(i.value)&&i.value>=0),'Invalid extension item.');
    check(raw.status===undefined||Array.isArray(status)&&status.length>0&&status.every(r=>object(r)&&own(r.id)&&own(r.knowledgeKey)&&notes.has(r.knowledgeKey)),'Invalid extension status.');
    const priorItems=(base.extensions||[]).flatMap(extension=>extension.items||[]);
    const priorLocations=previous.flatMap(extension=>extension.locations||[]);
    const candidate={...base,locations:[...base.locations,...priorLocations,...locations],items:[...(base.items||[]),...priorItems,...items],presentation:{...base.presentation,people:{...base.presentation.people,...Object.fromEntries([...dependencyRoles,...roles].map(role=>[role.id,{introductionKnowledgeKey:role.introductionKnowledgeKey}]))},status:[...base.presentation.status,...status]},
        simulation:{...base.simulation,people:[...(base.simulation.people||[]),...dependencyRoles,...roles],conditions:[...(base.simulation.conditions||[]),...conditions],energies:[...(base.simulation.energies||[]),...energies],commands:[...base.simulation.commands,...raw.commands]}};
    const compiled=compileStructuredPack(candidate);
    const commands=raw.commands.map(c=>compiled.registry.simulation.commands.get(c.id));
    const extension=freeze({...structuredClone(raw),contentHash,commands});
    for(const c of commands)check(!registry.simulation.commands.has(c.id),'Structured extension command collision.');
    if((items.length||locations.length)&&stageObjects)stageObjects(items,locations);
    for(const role of roles)registry.simulation.people.set(role.id,compiled.registry.simulation.people.get(role.id));
    for(const d of conditions)registry.simulation.conditions.set(d.id,compiled.registry.simulation.conditions.get(d.id));
    for(const d of energies)registry.simulation.energies.set(d.id,compiled.registry.simulation.energies.get(d.id));
    for(const c of commands)registry.simulation.commands.set(c.id,c);
    base.extensions=[...(base.extensions||[]),extension];
    // Existing methods are untouched. Resolve only the explicitly named target
    // commands when an alternate provider is installed, not every prior command
    // after every extension registration.
    for(const alternative of raw.supportAlternatives||[]) {
        const target=base.extensions.find(e=>e.id===alternative.target.id);
        for(const id of alternative.commands) {
            const command=target.commands.find(c=>c.id===id);
            registry.simulation.commands.set(id,freeze(structuredSupportCommand(base,target,command)));
        }
    }
    return extension;
}
