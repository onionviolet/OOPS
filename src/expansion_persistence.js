import {simulationDefinitions} from './simulation_content.js';
import {createTemperamentPort} from './person_temperament.js';
import {domainRegistry} from './domain_registry.js';
import {memoryForPlan} from './person_memory_effects.js';
import {calendarMinutes} from './world_rhythm.js';
import {validateExpansionState} from "./expansion_engine.js";
import {writeOwnershipToEnvelope} from "./acquisition.js";
import {publishDefeat} from "./defeat_domain.js";
import {writeGameplayToEnvelope} from "./gameplay_transactions.js";
import {setSavedPurse} from "./money.js";

const memoryDefinitions=new Map(simulationDefinitions.people.map(p=>[p.id,p]));

// Caller publishes plan.state and plan.external only after this succeeds.
// The existing envelope is copied, retaining unrelated and dormant content.
export function persistExpansionPlan(plan, options) {
    // A staged defeat (saved-battle loss, structured death) is part of this write: in place while the
    // save is built, undone if the write throws (CBR2).
    if(plan.defeat) { let committed; publishDefeat(plan.defeat, () => { committed = writeExpansionPlan(plan, options); }); return committed; }
    return writeExpansionPlan(plan, options);
}
function writeExpansionPlan(plan, {createSave, storage, key, bindings, ownershipBindings, validateEnvelope, unlockPublication, equipmentPublication, nativePublication}) {
    validateExpansionState(plan.state);
    const serialized = createSave();
    if(typeof serialized !== "string") throw new Error("No valid save could be created.");
    const envelope = plan.replacementEnvelope ? structuredClone(plan.replacementEnvelope) : JSON.parse(serialized);
    if(!envelope?.character || !Number.isFinite(plan.external.money) || plan.external.money < 0) {
        throw new Error("Invalid character resource transaction.");
    }
    envelope.expansion = plan.state;
    setSavedPurse(envelope, plan.external.money, "native plan");
    if(plan.calendar) envelope["current time"] = plan.calendar;
    if(plan.effectDurations) for(const [id, duration] of Object.entries(plan.effectDurations)) {
        if(!Number.isFinite(duration) || duration < 0 || !envelope.active_effects?.[id]) throw new Error("Invalid staged effect duration.");
        if(duration === 0) delete envelope.active_effects[id]; else envelope.active_effects[id].duration = duration;
    }
    if(plan.native) {
        if(!Number.isFinite(plan.native.staminaToFull) || plan.native.staminaToFull < 0) throw new Error("Invalid staged stamina.");
        envelope.character.stamina_to_full = plan.native.staminaToFull;
        if(plan.native.hpToFull != null) {
            if(!Number.isFinite(plan.native.hpToFull) || plan.native.hpToFull < 0) throw new Error("Invalid staged health.");
            envelope.character.hp_to_full = plan.native.hpToFull;
        }
    }
    writeGameplayToEnvelope(envelope, plan.gameplay || {}, bindings);
    if(plan.ownership) writeOwnershipToEnvelope(envelope, plan.ownership, ownershipBindings);
    if(plan.market) envelope.loot_sold_count = plan.market;
    if(plan.itemLog) envelope.item_log = plan.itemLog;
    unlockPublication?.write(envelope);
    equipmentPublication?.write(envelope);
    if(plan.nativePatch) for(const [path, value] of Object.entries(plan.nativePatch)) {
        const parts = path.split("/");
        if(parts.some(p => !p || ["__proto__", "constructor", "prototype"].includes(p)) || ["expansion", "retired_content", "game version", "saved_at"].includes(parts[0])) throw new Error("Unsafe native transition patch.");
        let target = envelope;
        for(const part of parts.slice(0, -1)) {
            if(!target[part] || typeof target[part] !== "object") throw new Error("Missing native transition domain.");
            target = target[part];
        }
        target[parts.at(-1)] = structuredClone(value);
    }
    nativePublication?.write(envelope);
    const temperamentOf=createTemperamentPort(id=>memoryDefinitions.get(plan.state.simulation?.people[id]?.definitionId || id));
    const memoryCandidate = envelope['current time'] ? memoryForPlan({memory:envelope.memory,plan,temperamentOf,minute:calendarMinutes(envelope['current time']),day:Math.floor(calendarMinutes(envelope['current time'])/1440)}) : null;
    if(memoryCandidate && (Object.hasOwn(envelope, 'memory') || Object.keys(memoryCandidate.memory.holders).length)) envelope.memory = memoryCandidate.memory;
    if(memoryCandidate?.causes) envelope.expansion.simulation.causes = memoryCandidate.causes;
    for(const {holder,trait} of memoryCandidate?.observations || []) {
        const known=envelope.expansion.simulation.knowledge.player ||= {};
        const traitKey=`person.${holder}.trait.${trait}`;
        known[traitKey] ||= {stage:'seen',value:trait,at:plan.state.clock,cause:'memory.observed'};
    }
    if(validateEnvelope) validateEnvelope(envelope);
    const committed = JSON.stringify(envelope);
    // Native life-save ownership can consume the already detached envelope.
    // Keep the serialized return and validation point identical to string stores.
    if(storage.setEnvelope) storage.setEnvelope(key, envelope);
    else storage.setItem(key, committed);
    if(memoryCandidate) domainRegistry.command('memory','publish')?.(memoryCandidate.memory);
    return committed;
}
