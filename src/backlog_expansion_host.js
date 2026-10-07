import {enrollSimulation} from './simulation.js';
import {validateExpansionState, FEATURE_ENGINE_SCHEMA} from './expansion_engine.js';
import {jsonData} from './simulation_contracts.js';
import {BACKLOG_SCHEMA, BACKLOG_REPLACEMENT_SCHEMA, backlogAssert, backlogPlan, assertBacklogBoundary} from './backlog_expansion_core.js';
import {bodyCommands, stageBodyCommand, bodyView, validateBodyRecord, reanchorBodyInputs, bodyActionReasons, bodyNativeInputs, bodyItemDispositionReasons, validateBodyNativeInventory} from './backlog_expansion_body.js';
import {timeCommands, stageTimeCommand, timeView, validateTimeRecord, settleTimeAdvance, timeActionReasons, timeNativeActionReasons, assertTimeSeal} from './backlog_expansion_time.js';
import {opportunityCommands, stageOpportunityCommand, opportunityView, validateOpportunityRecord} from './backlog_expansion_opportunities.js';
import {replacementCommands,stageReplacementCommand,replacementView,validateReplacementRecord,replacementActionVisible} from './backlog_expansion_replacement.js';

// Simulation/engine/content import each other. Read command rows only after the
// module graph initializes; registry imports must not inspect an unready worker.
const lanes = () => [
    {commands:bodyCommands, stage:stageBodyCommand, view:bodyView},
    {commands:timeCommands, stage:stageTimeCommand, view:timeView},
    {commands:opportunityCommands, stage:stageOpportunityCommand, view:opportunityView},
    {commands:replacementCommands,stage:stageReplacementCommand,view:replacementView},
];
export function backlogActions() {return Object.freeze(lanes().flatMap(lane => lane.commands));}
const laneFor = id => lanes().find(lane => lane.commands.some(row => row.id === id));

/** Supply actual character/creation state from main; no saved eligibility flag. */
export function backlogNativeContext(state, context, nativeInputs) {
    return {...context,nativeAlive:nativeInputs?.character?.is_alive === true,...bodyNativeInputs(state,nativeInputs)};
}

/** Optional namespace: loading/rendering missing data never enrolls a character. */
export function validateBacklogState(state) {
    const r = state.backlog;
    if(r == null) return;
    jsonData(r);
    backlogAssert([FEATURE_ENGINE_SCHEMA,7,8,9,10,11].includes(state.schema), 'This optional life/clock save needs an admitted expansion6/7/8/9/10 reader. Preserve the original file.');
    backlogAssert([BACKLOG_SCHEMA,BACKLOG_REPLACEMENT_SCHEMA].includes(r.schema) && r.revision === 1 && Number.isSafeInteger(r.enrolledAt) &&
        r.enrolledAt >= 0 && r.enrolledAt <= state.clock && r.receipts && typeof r.receipts === 'object' && !Array.isArray(r.receipts), 'Unsupported backlog state.');
    backlogAssert(r.schema===BACKLOG_REPLACEMENT_SCHEMA ? r.replacement!=null : r.replacement==null,'Replacement requires its explicit optional Backlog2 reader.');
    validateBodyRecord(r,state); validateTimeRecord(r,state); validateOpportunityRecord(r,state);
    validateReplacementRecord(r,state);
}

function prepare(state, registry, command, context) {
    const lane = laneFor(command.id);
    backlogAssert(lane, 'Unknown optional life or world action.');
    backlogAssert(command.sequence == null || command.sequence === state.sequence, 'This action changed. Review its current terms.');
    const sealReasons = timeActionReasons(state, command.id);
    backlogAssert(!sealReasons.length, sealReasons.join(' '));
    const physicalReasons = bodyActionReasons(state, command.id);
    backlogAssert(!physicalReasons.length, physicalReasons.join(' '));
    // Enrollment is a deliberate command, never a UI or loader operation.
    const enrolled = state.simulation ? null : enrollSimulation(state, registry, context, state.sequence);
    const base = enrolled?.state || state;
    const ctx = {...(enrolled ? reanchorBodyInputs(context,state,base) : context), external:enrolled?.external || context.external,
        gameplay:enrolled?.gameplay || context.gameplay};
    assertBacklogBoundary(base, ctx);
    const out = backlogPlan(base,ctx);
    if(enrolled) {out.acquisitions.push(...enrolled.acquisitions);out.unlocks.push(...enrolled.unlocks);}
    lane.stage(out, command, ctx);
    out.backlogCommand = command.id;
    // Reuse the integrator's actual optional wave version. Existing saves keep5;
    // older expansion5 readers reject6 before loading or losing new owners.
    out.state.schema = Math.max(out.state.schema,FEATURE_ENGINE_SCHEMA);
    out.state.sequence++;
    validateBacklogState(out.state);
    validateBodyNativeInventory(out.state,out.gameplay.player.inventory,{otherInventories:context.nativeOtherInventories || []});
    validateExpansionState(out.state,registry);
    return out;
}

/** Preview uses the same immediate staged legality; no state, draws or saving. */
export function previewBacklogAction(state, registry, actionId, context, packet = {}) {
    const action = backlogActions().find(row => row.id === actionId);
    if(!action) return {visible:false,eligible:false,reasons:['Unknown action.']};
    if(!replacementActionVisible(state,actionId))return {...action,visible:false,eligible:false,reasons:[],sequence:state.sequence};
    try {
        const plan = prepare(state,registry,{...packet,id:actionId,sequence:state.sequence},context);
        return {...action,visible:true,eligible:true,reasons:[],sequence:state.sequence,
            minutes:plan.backlogAdvanceMinutes || 0};
    } catch(error) {return {...action,visible:true,eligible:false,reasons:[error.message],sequence:state.sequence};}
}

/** The integrator injects its existing staged calendar/scheduler bridge. */
export function commitBacklogAction(state, registry, command, context, expectedSequence = state.sequence, {advancePlan} = {}) {
    backlogAssert(state.sequence === expectedSequence, 'This action changed. Review its current terms.');
    let out = prepare(state,registry,command,context);
    if(out.backlogAdvanceMinutes != null) {
        const minutes = out.backlogAdvanceMinutes;
        backlogAssert(Number.isSafeInteger(minutes) && minutes > 0 && minutes <= 120 && typeof advancePlan === 'function', 'Bind the supported shared clock before settling this work.');
        const before = out.state.clock, old = out, settlement = out.backlogTimeSettlement;
        const advanced = advancePlan(out,minutes);
        backlogAssert(advanced?.state?.clock - before === minutes && !advanced.stoppedAtChoice, 'Catch-up paused at a waiting choice. Resolve it before reviewing this work again.');
        // Existing bridge owns time/native effects; retain explicit cursor/receipt
        // data already written into the staged state, never a second publisher.
        out = {...old,...advanced};
        if(settlement) settleTimeAdvance(out,settlement);
        delete out.backlogAdvanceMinutes;
        delete out.backlogTimeSettlement;
    }
    validateBacklogState(out.state); validateExpansionState(out.state,registry);
    validateBodyNativeInventory(out.state,out.gameplay.player.inventory,{otherInventories:context.nativeOtherInventories || []});
    return out;
}

export function backlogView(state, context = {}) {
    return {enrolled:!!state.backlog, schema:state.backlog?.schema || null,
        sections:lanes().map(lane => lane.view(state,context)), sequence:state.sequence,
        note:'Optional original proofs. New gameplay awaits its deferred playable checks.'};
}

/** Join these at native and extension starts, before any live owner changes. */
export function backlogNativeActionReasons(state, operation = 'ordinary') {
    return [...timeNativeActionReasons(state),...bodyActionReasons(state,operation)];
}

/** Central final plan guard complements per-action native gates. */
export function assertBacklogPublication(state, plan) {
    const physicalReasons = bodyActionReasons(state,plan.backlogCommand || 'ordinary');
    backlogAssert(!physicalReasons.length,physicalReasons.join(' '));
    const temporalReasons = timeActionReasons(state,plan.backlogCommand || 'ordinary');
    backlogAssert(!temporalReasons.length,temporalReasons.join(' '));
    assertTimeSeal(state,{...plan,facts:{location:state.simulation?.people.player?.location}});
}

export function backlogNativeClockPaused(state) {
    return state.backlog?.loop?.status === 'active' || ['armed','paused'].includes(state.backlog?.offline?.status) ||
        state.backlog?.body?.possession?.status === 'active';
}

export function validateBacklogEnvelope(envelope) {
    if(envelope?.expansion?.backlog == null) return;
    validateBacklogState(envelope.expansion);
    const inventories = envelope.inventories, player = inventories?.person?.main_character;
    backlogAssert(player, 'Bind the native character inventory before validating a body or stock carrier.');
    const flat = bag => Object.fromEntries(Object.entries(bag).map(([key,row]) => [key,row.count]));
    // Match the native Item.createInventoryKey codec for saved equipped items.
    const equipmentKey = item => JSON.stringify({...(item.components ? {components:item.components} : {id:item.id}),
        ...(item.quality ? {quality:item.quality} : {})});
    const equipment = Object.fromEntries(Object.entries(envelope.character?.equipment || {}).filter(([,item]) => item)
        .map(([slot,item]) => [slot,equipmentKey(item)]));
    const others = [];
    for(const [category,owners] of Object.entries(inventories)) for(const [owner,bag] of Object.entries(owners)) {
        if(category !== 'person' || owner !== 'main_character') others.push(flat(bag));
    }
    others.push(Object.fromEntries(Object.values(equipment).map(key => [key,1])));
    for(const slots of Object.values(envelope.npc_equipment || {})) others.push(Object.fromEntries(Object.values(slots).filter(Boolean).map(key => [key,1])));
    validateBodyNativeInventory(envelope.expansion,flat(player),{otherInventories:others});
    const visit = envelope.expansion.backlog.body?.possession;
    if(visit?.status === 'active') backlogAssert(envelope.character.hp_to_full === visit.homeVitals.max_health - visit.homeVitals.health &&
        envelope.character.stamina_to_full === visit.homeVitals.max_stamina - visit.homeVitals.stamina,
        'The parked native body changed during the consenting clay visit. Preserve the original file.');
    assertTimeSeal(envelope.expansion,{facts:{location:envelope['current location']},external:{money:envelope.character?.money},
        gameplay:{player:{inventory:flat(player)}},equipment:{player:equipment},
        vitals:{player:envelope.expansion.backlog.loop?.anchor.people.player.vitals}});
}

export function assertBacklogItemDisposition(state, itemKey) {
    const reasons = [...timeNativeActionReasons(state),...bodyItemDispositionReasons(state,itemKey)];
    backlogAssert(!reasons.length,reasons.join(' '));
}
