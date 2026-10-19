// Finite original proposals. Only unpublished plans are changed here.
// The host joins elapsed requests to the existing clock and durable publisher.
import {copy as clone, natural, object} from './basics.js';
import {backlogAssert, backlogRecord, backlogActor, backlogInventory, backlogItem, backlogLog,
    assertBacklogBoundary} from './backlog_expansion_core.js';
import {validateOwnership} from './acquisition.js';
import {jsonData} from './simulation_contracts.js';
import {bodyTransitionActive} from './backlog_expansion_body.js';

const WORLD = 'base.frontier', LOCATION = 'Village';
const KEEPER = 'backlog.bell_keeper', SITE = 'backlog.bell_yard';
const FOCUS = 'backlog.bell_focus', PATTERN = 'backlog.bell_pattern', CLAIM = 'backlog.bell_trial';
const WOOD = JSON.stringify({id:'Rough wood log'}), KIT = JSON.stringify({id:'Prepared survey kit'});
const equal = (a,b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) &&
        a.length === b.length && a.every((value,i) => equal(value,b[i]));
    if(!object(a) || !object(b)) return false;
    const keys = Object.keys(a).sort(), other = Object.keys(b).sort();
    return keys.length === other.length && keys.every((key,i) => key === other[i] && equal(a[key],b[key]));
};
const receipt = state => `backlog:${state.sequence + 1}`;
const queueOpen = state => ['armed','paused'].includes(state.backlog?.offline?.status);
const loopOpen = state => state.backlog?.loop?.status === 'active';
const loopAllowed = new Set(['backlog.loop.practice','backlog.loop.rewind','backlog.loop.finish']);
const packingAllowed = new Set(['backlog.offline.request','backlog.offline.pause','backlog.offline.resume','backlog.offline.cancel']);
const row = (id,label,description,family,packet = {}) => Object.freeze({id,label,description,family,
    packet:typeof packet === 'function' ? packet : Object.freeze({id,...packet})});
const packingPacket = state => ({id:'backlog.offline.request',reviewed:true,
    elapsedMinutes:(state.backlog?.offline?.escrow?.logs ?? 3)*2});

export const timeCommands = Object.freeze([
    row('backlog.loop.open','Seal a bell-yard trial · 1 log',
        'One original trial, at most three attempts and two rewinds. Your actual body, local focus, bell-yard facts and keeper restore; common time, knowledge and claims stay. The paid log cannot leave the seal.', 'time_loop'),
    row('backlog.loop.practice','Strike the trial bell · 1 minute',
        'Spend two actual stamina, one health and local focus. The keeper spends the sealed log. This changes both live bodies and the actual work site; nothing is exported.', 'time_loop'),
    row('backlog.loop.rewind','Rewind the sealed bell yard',
        'Restore the declared actual local domains on the same people. Keep the minute already spent and what both people learned. Two rewinds maximum.', 'time_loop'),
    row('backlog.loop.finish','Close the seal and return',
        'Restore the trial body state, consume the single sealed log, settle the retained claim and reopen ordinary native actions. No stock or reward is copied out.', 'time_loop'),
    row('backlog.offline.arm','Arm a packing batch · 3 logs + 3 coins',
        'Prepay three kits and pause ordinary play. Each needs two actual wall seconds, equivalent to two native game minutes; six minutes total. Nothing advances without your elapsed review.', 'offline'),
    row('backlog.offline.request','Review elapsed time and pack the funded batch',
        'Explicitly review up to six actual elapsed minutes for the remaining funded kits. This control waits for that full wall interval; unsupported elapsed time is reported and discarded.', 'offline', packingPacket),
    row('backlog.offline.pause','Pause packing and show its report',
        'Keep the remaining prepaid inputs. Discard the current unreviewed wall window; paused wall time earns nothing.', 'offline'),
    row('backlog.offline.resume','Resume prepaid packing',
        'Start a fresh supported wall window for the remaining paid kits. Paused time and previously discarded time cannot be replayed.', 'offline'),
    row('backlog.offline.cancel','Cancel and return unused inputs',
        'Return only the unspent prepaid logs and coins once. Already packed kits remain actual owned stock.', 'offline')
]);

// Register the definition, but introduce this new person only on explicit open.
export const timePeople = Object.freeze([Object.freeze({id:KEEPER,revision:1,label:'Ira, bell keeper',
    worldId:WORLD,location:LOCATION,inventory:'simulation',provision:false,
    vitals:{health:8,max_health:8,stamina:6,max_stamina:6},body:{form:'human',hands:2}})]);
export const timeSites = Object.freeze([Object.freeze({id:SITE,revision:1,label:'Sealed bell yard',capacity:1})]);

export function timeActionReasons(state, actionId) {
    if(loopOpen(state) && !loopAllowed.has(actionId)) return ['Close the bell-yard seal before another action, reward, transfer, body change or journey.'];
    if(queueOpen(state) && !packingAllowed.has(actionId)) return ['Review, finish or cancel prepaid packing before ordinary play, ticking, a body change or another commitment.'];
    return [];
}
export function timeNativeActionReasons(state) {
    return timeActionReasons(state, 'native.write');
}
export function timeClockPauseReason(state) {
    return queueOpen(state) ? 'Ordinary time is paused for prepaid packing. Review actual elapsed time, resume paused work or cancel the batch.' : '';
}

function localBoundary(state,context) {
    assertBacklogBoundary(state,context);
    backlogAssert(state.actors.player.worldId === WORLD && context.worldId === WORLD &&
        context.facts?.location === LOCATION, 'Return to Village in the original frontier.');
    backlogAssert(state.simulation.people.player.inventory === 'native', 'This proof needs the actual native player body and bag.');
    backlogAssert(!bodyTransitionActive(state), 'Return to your own body and remove any installed prototype before a temporal proof.');
}
function wallNow(context,q) {
    const now = context.wallNowMs;
    backlogAssert(natural(now) && (!q || now >= q.reviewedThroughWallMs), 'Bind a trusted current wall timestamp; a backwards clock cannot earn catch-up.');
    return now;
}
function observedWallMinutes(q,now) {
    return Math.floor((now-q.reviewedThroughWallMs)/q.terms.wallMinuteMs);
}
function vitals(value) {
    backlogAssert(object(value) && ['health','max_health','stamina','max_stamina'].every(key =>
        Number.isFinite(value[key]) && value[key] >= 0) && value.max_health > 0 &&
        value.health <= value.max_health && value.stamina <= value.max_stamina, 'Bind the actual player health and stamina.');
    return value;
}
function nativeVitals(plan) {
    const actual = clone(vitals(plan.vitals?.player));
    if(plan.native?.hpToFull != null) actual.health = Math.max(0,actual.max_health - plan.native.hpToFull);
    if(plan.native?.staminaToFull != null) actual.stamina = Math.max(0,actual.max_stamina - plan.native.staminaToFull);
    return actual;
}
function writeNativeVitals(plan,value) {
    vitals(value);
    plan.vitals ||= {}; plan.vitals.player = clone(value);
    plan.native = {...plan.native, hpToFull:value.max_health-value.health, staminaToFull:value.max_stamina-value.stamina};
}
function personSnapshot(plan,id) {
    const {actor,person} = backlogActor(plan,id);
    return {life:person.life,location:person.location,bodyPresent:Object.hasOwn(person,'body'),body:clone(person.body || {}),
        vitals:clone(id === 'player' ? nativeVitals(plan) : vitals(person.vitals)),
        focusPresent:Object.hasOwn(actor.resources,FOCUS),focus:actor.resources[FOCUS] || 0,
        patternPresent:Object.hasOwn(actor.facts,PATTERN),pattern:actor.facts[PATTERN] ?? null};
}
function restorePerson(plan,id,snapshot) {
    const {actor,person} = backlogActor(plan,id);
    person.life = snapshot.life; person.location = snapshot.location;
    if(snapshot.bodyPresent) person.body = clone(snapshot.body); else delete person.body;
    if(snapshot.focusPresent) actor.resources[FOCUS] = snapshot.focus; else delete actor.resources[FOCUS];
    if(snapshot.patternPresent) actor.facts[PATTERN] = snapshot.pattern; else delete actor.facts[PATTERN];
    if(id === 'player') {
        // Maxima are current outside/native owners, never part of the rewind.
        const now = nativeVitals(plan);
        writeNativeVitals(plan,{...now,health:Math.min(now.max_health,snapshot.vitals.health),
            stamina:Math.min(now.max_stamina,snapshot.vitals.stamina)});
    } else person.vitals = clone(snapshot.vitals);
}
function restoreLoop(plan,loop) {
    for(const id of ['player',KEEPER]) restorePerson(plan,id,loop.anchor.people[id]);
    plan.state.simulation.owners[KEEPER] = clone(loop.anchor.keeperInventory);
    plan.state.simulation.sites[SITE] = clone(loop.anchor.site);
    loop.localMinutes = 0;
}
function observe(plan,actorId,key,value,cause) {
    (plan.state.simulation.knowledge[actorId] ||= {})[key] = {stage:'seen',value,at:plan.state.clock,cause};
}

// Call with actual native bindings both on a loaded active loop and before every
// durable mutation. Expected stock is checked, never silently overwritten.
export function assertTimeSeal(state,context) {
    if(!loopOpen(state)) return;
    const loop = state.backlog.loop, person = state.simulation.people[KEEPER];
    backlogAssert(state.actors.player.worldId === WORLD && context.facts?.location === LOCATION &&
        state.actors[KEEPER]?.worldId === WORLD && person?.location === LOCATION &&
        person.bornAt === loop.counterpart.bornAt && person.definitionId === KEEPER &&
        person.definitionRevision === 1, 'The sealed counterpart or place changed; use a compatible saved build.');
    backlogAssert(object(context.gameplay?.player?.inventory) && object(context.equipment?.player) &&
        context.external?.money === loop.seal.money && equal(context.gameplay.player.inventory,loop.seal.inventory) &&
        equal(context.equipment.player,loop.seal.equipment), 'The bell-yard bag, equipment or money seal changed. No rewind or partial publication is allowed.');
    const expected = loop.localMinutes === 0 ? {[WOOD]:1} : {};
    backlogAssert(equal(state.simulation.owners[KEEPER],expected), 'The sealed log moved outside its declared local use.');
    vitals(context.vitals?.player);
}

function armLoop(plan,context) {
    const state = plan.state, record = backlogRecord(plan), s = state.simulation;
    backlogAssert(!record.loop && !s.claims[CLAIM], 'The finite bell-yard trial has already been opened.');
    backlogAssert(!queueOpen(state), 'Close or finish the prepaid packing batch first.');
    backlogAssert(!state.actors[KEEPER] && !s.people[KEEPER], 'This counterpart already belongs to another actual record.');
    backlogAssert(object(plan.equipment?.player), 'Bind the actual native equipment before sealing a bag.');
    backlogAssert(Number.isFinite(plan.external.money) && plan.external.money >= 0, 'Bind your actual native coins before sealing the trial.');
    const actual = nativeVitals(plan);
    backlogAssert(actual.health > 1 && actual.stamina >= 2, 'Recover enough health and stamina for the trial first.');
    backlogAssert(!Object.values(s.custody).some(c => c.owner === 'player' || c.holder === 'player'), 'Return all borrowed or lent goods before sealing your bag.');
    const cause = receipt(state);
    backlogItem(plan,'player',WOOD,-1,{acquisition:false});
    state.actors[KEEPER] = {facts:{[PATTERN]:0},resources:{[FOCUS]:2},completed:{},sources:{},techniques:{},worldId:WORLD};
    s.people[KEEPER] = {life:'alive',inventory:'simulation',location:LOCATION,bornAt:state.clock,
        definitionId:KEEPER,definitionRevision:1,createdBy:'player',body:{form:'human',hands:2},
        vitals:{health:8,max_health:8,stamina:6,max_stamina:6}};
    // This actual owned log came from the native debit above, not a template gift.
    s.owners[KEEPER] = {[WOOD]:1};
    s.people.player.location = LOCATION;
    state.actors.player.resources[FOCUS] = 2; state.actors.player.facts[PATTERN] = 0;
    s.sites[SITE] = {capacity:1,reservations:{},owner:KEEPER,bellReady:false,strikes:0};
    s.claims[CLAIM] = {owner:'player',status:'held',cause,at:state.clock};
    record.loop = {revision:1,id:`backlog.bell_trial:${state.sequence+1}`,status:'active',openedAt:state.clock,
        localMinutes:0,rewinds:0,maxRewinds:2,attempts:0,
        counterpart:{id:KEEPER,bornAt:s.people[KEEPER].bornAt,definitionId:KEEPER,definitionRevision:1},
        seal:{worldId:WORLD,location:LOCATION,money:plan.external.money,
            inventory:clone(backlogInventory(plan,'player')),equipment:clone(plan.equipment.player)},
        anchor:{at:state.clock,people:{player:personSnapshot(plan,'player'),[KEEPER]:personSnapshot(plan,KEEPER)},
            keeperInventory:clone(s.owners[KEEPER]),site:clone(s.sites[SITE])},cause};
    observe(plan,'player','backlog.bell_terms','The seal restores local bodies, focus and bell-yard state. Common time, knowledge and this unique trial claim stay.',cause);
    backlogLog(plan,'The bell-yard seal closes around the same two people and one paid log.');
}
function stageLoopPractice(plan,context) {
    assertTimeSeal(plan.state,{...context,gameplay:plan.gameplay,external:plan.external,equipment:plan.equipment,vitals:plan.vitals});
    const loop = plan.state.backlog.loop;
    backlogAssert(loop.localMinutes === 0, 'Rewind this attempt or close the seal before another strike.');
    for(const id of ['player',KEEPER]) {
        const v = id === 'player' ? nativeVitals(plan) : vitals(plan.state.simulation.people[id].vitals);
        backlogAssert(v.health > 1 && v.stamina >= 2 && plan.state.actors[id].resources[FOCUS] >= 1,
            'Both actual bodies need health, stamina and local focus.');
    }
    plan.backlogAdvanceMinutes = 1;
    plan.backlogTimeSettlement = {kind:'bell_practice',loopId:loop.id,beforeClock:plan.state.clock,minutes:1,
        cause:receipt(plan.state),nativeVitals:clone(plan.vitals.player),attempts:loop.attempts,rewinds:loop.rewinds};
}
function stagePackingRequest(plan,command,context) {
    const q = plan.state.backlog?.offline;
    backlogAssert(q?.status === 'armed', 'Arm or explicitly resume a funded packing batch first.');
    const now = wallNow(context,q), observed = observedWallMinutes(q,now);
    backlogAssert(command.reviewed === true && natural(command.elapsedMinutes) && command.elapsedMinutes <= 120,
        'Explicitly review a whole elapsed-minute request from 0 to 120.');
    backlogAssert(command.elapsedMinutes <= observed, `Only ${observed} actual elapsed game minutes are available for review.`);
    const count = Math.min(q.escrow.logs,Math.floor(command.elapsedMinutes/q.terms.quantumMinutes));
    if(!count) {
        q.status = 'paused'; q.reviewedThroughWallMs = now;
        q.lastReport = {at:plan.state.clock,cause:receipt(plan.state),requestedMinutes:command.elapsedMinutes,
            observedMinutes:observed,creditedMinutes:0,uncreditedMinutes:observed,packed:0,remaining:q.escrow.logs};
        backlogLog(plan,'Packing pauses: this reviewed request contains no full funded two-minute quantum.');
        return;
    }
    plan.backlogAdvanceMinutes = count*q.terms.quantumMinutes;
    plan.backlogTimeSettlement = {kind:'offline_pack',batchId:q.id,beforeClock:plan.state.clock,
        minutes:plan.backlogAdvanceMinutes,count,requestedMinutes:command.elapsedMinutes,
        observedMinutes:observed,wallWindowFromMs:q.reviewedThroughWallMs,wallWindowThroughMs:now,
        cause:receipt(plan.state),packed:q.packed,remaining:q.escrow.logs};
}

export function stageTimeCommand(plan,command,context) {
    const packet = typeof command === 'string' ? {id:command} : command;
    backlogAssert(timeCommands.some(row => row.id === packet?.id), 'Unknown temporal backlog command.');
    const state = plan.state, reasons = timeActionReasons(state,packet.id);
    backlogAssert(!reasons.length,reasons.join(' ')); localBoundary(state,context);
    backlogAssert(!plan.backlogTimeSettlement && !plan.backlogAdvanceMinutes, 'Join one elapsed request at a time.');
    if(packet.id === 'backlog.loop.open') armLoop(plan,context);
    else if(packet.id.startsWith('backlog.loop.')) {
        backlogAssert(loopOpen(state), 'Open the finite bell-yard trial first.');
        assertTimeSeal(state,{...context,gameplay:plan.gameplay,external:plan.external,equipment:plan.equipment,vitals:plan.vitals});
        const loop = state.backlog.loop;
        if(packet.id === 'backlog.loop.practice') stageLoopPractice(plan,context);
        else if(packet.id === 'backlog.loop.rewind') {
            backlogAssert(loop.localMinutes === 1 && loop.rewinds < loop.maxRewinds, 'A completed local attempt and an unused rewind are required.');
            restoreLoop(plan,loop); loop.rewinds++; loop.lastRewindAt = state.clock;
            backlogLog(plan,'The actual bell yard and the same bodies restore. Their knowledge and the spent common minute remain.');
        } else {
            restoreLoop(plan,loop);
            backlogItem(plan,KEEPER,WOOD,-1,{acquisition:false});
            loop.status = 'closed'; loop.closedAt = state.clock;
            state.simulation.claims[CLAIM].status = 'settled'; state.simulation.claims[CLAIM].cause = receipt(state);
            observe(plan,'player','backlog.bell_return','You left with the same owned bag, equipment and money sealed at entry. The single paid log was consumed; no local trial stock or reward was exported.',receipt(state));
            backlogLog(plan,'The seal opens. The paid log is consumed once; ordinary actions are available again.');
        }
    } else if(packet.id === 'backlog.offline.arm') {
        const record = backlogRecord(plan);
        backlogAssert(!record.offline, 'This finite prepaid packing proof has already been armed.');
        const now = wallNow(context);
        backlogAssert(Number.isFinite(plan.external.money) && plan.external.money >= 3, 'Reserve three actual coins first.');
        backlogItem(plan,'player',WOOD,-3,{acquisition:false}); plan.external.money -= 3;
        record.offline = {revision:1,id:`backlog.packing:${state.sequence+1}`,status:'armed',armedAt:state.clock,
            actorId:'player',worldId:WORLD,location:LOCATION,packed:0,creditedMinutes:0,
            armedAtWallMs:now,reviewedThroughWallMs:now,
            terms:{revision:1,quantityCap:3,quantumMinutes:2,minuteCap:6,wallMinuteMs:1000,inputKey:WOOD,outputKey:KIT,logsPerKit:1,coinsPerKit:1},
            prepaid:{logs:3,coins:3},escrow:{logs:3,coins:3},cause:receipt(state)};
        backlogLog(plan,'Three logs and three coins are reserved. Packing waits for an explicit reviewed elapsed request.');
    } else if(packet.id === 'backlog.offline.request') stagePackingRequest(plan,packet,context);
    else {
        backlogAssert(queueOpen(state), 'There is no unspent packing batch.');
        const q = state.backlog.offline;
        if(packet.id === 'backlog.offline.pause') {
            const now = wallNow(context,q), observed = q.status === 'armed' ? observedWallMinutes(q,now) : 0;
            q.reviewedThroughWallMs = now; q.status = 'paused';
            q.lastReport = {at:state.clock,cause:receipt(state),requestedMinutes:0,observedMinutes:observed,creditedMinutes:0,
                uncreditedMinutes:observed,packed:0,remaining:q.escrow.logs};
            backlogLog(plan,`Packing is paused with ${q.escrow.logs} paid kits still available.`);
        } else if(packet.id === 'backlog.offline.resume') {
            backlogAssert(q.status === 'paused', 'Packing is already armed.');
            q.reviewedThroughWallMs = wallNow(context,q); q.status = 'armed';
            backlogLog(plan,'Packing resumes from this actual wall timestamp. Paused elapsed time is discarded.');
        } else {
            const refund = clone(q.escrow);
            backlogItem(plan,'player',WOOD,refund.logs,{acquisition:false}); plan.external.money += refund.coins;
            q.escrow = {logs:0,coins:0}; q.refunded = refund; q.status = 'cancelled'; q.closedAt = state.clock;
            backlogLog(plan,`Unused packing inputs returned once: ${refund.logs} logs and ${refund.coins} coins.`);
        }
    }
    return plan;
}

// The host saves this intent, increments the dispatch sequence, invokes its
// trusted advancePlan(plan,minutes), checks full clock consumption, then calls
// this function on that returned unpublished plan. Partial time earns nothing.
export function settleTimeAdvance(plan,intent) {
    backlogAssert(object(intent) && ['bell_practice','offline_pack'].includes(intent.kind) &&
        natural(intent.beforeClock) && natural(intent.minutes) && intent.minutes > 0 &&
        plan.state.clock === intent.beforeClock+intent.minutes, 'The shared clock did not consume this exact reviewed request.');
    const state = plan.state;
    backlogAssert(state.simulation?.people.player?.life === 'alive' && !state.chronicle?.session &&
        state.chronicle?.life.endedAt == null, 'This actual life cannot receive the catch-up result.');
    if(intent.kind === 'bell_practice') {
        const loop = state.backlog?.loop;
        backlogAssert(loop?.status === 'active' && loop.id === intent.loopId && loop.localMinutes === 0 &&
            loop.attempts === intent.attempts && loop.rewinds === intent.rewinds && intent.minutes === 1,
            'The bell attempt is stale or already settled.');
        plan.vitals ||= {}; plan.vitals.player = clone(intent.nativeVitals);
        const current = nativeVitals(plan);
        assertTimeSeal(state,{facts:{location:LOCATION},gameplay:plan.gameplay,external:plan.external,
            equipment:plan.equipment,vitals:{player:current}});
        backlogAssert(current.health > 1 && current.stamina >= 2, 'The shared minute left insufficient actual health or stamina for the strike.');
        writeNativeVitals(plan,{...current,health:current.health-1,stamina:current.stamina-2});
        const keeper = state.simulation.people[KEEPER];
        backlogAssert(keeper.life === 'alive' && keeper.vitals.health > 1 && keeper.vitals.stamina >= 2,
            'The actual keeper can no longer perform this strike.');
        keeper.vitals.health--; keeper.vitals.stamina -= 2;
        for(const id of ['player',KEEPER]) {
            backlogAssert(state.actors[id].resources[FOCUS] >= 1, 'Actual local focus is no longer available.');
            state.actors[id].resources[FOCUS]--;
            state.actors[id].facts[PATTERN] = 1;
            (state.simulation.people[id].body ||= {})['backlog.bell_strain'] = true;
        }
        backlogItem(plan,KEEPER,WOOD,-1,{acquisition:false});
        state.simulation.sites[SITE].bellReady = true; state.simulation.sites[SITE].strikes = 1;
        loop.localMinutes = 1; loop.attempts++; loop.lastAttemptAt = state.clock;
        for(const id of ['player',KEEPER]) observe(plan,id,'backlog.bell_measure',
            `You witnessed bell attempt ${loop.attempts}. The same keeper stands here; the local bodies, focus and sealed log changed.`,intent.cause);
        backlogLog(plan,'The live strike changes both bodies, local focus and the bell yard, consuming its sealed log.');
        state.simulation.log.at(-1).cause = intent.cause;
    } else {
        const q = state.backlog?.offline;
        backlogAssert(queueOpen(state) && q.id === intent.batchId && q.packed === intent.packed &&
            q.escrow.logs === intent.remaining && q.escrow.coins === intent.remaining && natural(intent.count) &&
            intent.count > 0 && intent.count <= q.escrow.logs && intent.minutes === intent.count*q.terms.quantumMinutes,
            'The prepaid packing request is stale or already settled.');
        backlogAssert(q.status === 'armed' && q.reviewedThroughWallMs === intent.wallWindowFromMs &&
            natural(intent.wallWindowThroughMs) && intent.wallWindowThroughMs >= intent.wallWindowFromMs &&
            intent.observedMinutes === observedWallMinutes(q,intent.wallWindowThroughMs) &&
            intent.requestedMinutes <= intent.observedMinutes && intent.minutes <= intent.requestedMinutes,
            'The explicit observed wall-time request is stale or unsupported.');
        backlogItem(plan,'player',q.terms.outputKey,intent.count);
        q.escrow.logs -= intent.count; q.escrow.coins -= intent.count; q.packed += intent.count; q.creditedMinutes += intent.minutes;
        q.status = q.escrow.logs ? 'paused' : 'completed'; if(q.status === 'completed') q.closedAt = state.clock;
        q.reviewedThroughWallMs = intent.wallWindowThroughMs;
        q.lastReport = {at:state.clock,cause:intent.cause,requestedMinutes:intent.requestedMinutes,creditedMinutes:intent.minutes,
            observedMinutes:intent.observedMinutes,uncreditedMinutes:intent.observedMinutes-intent.minutes,packed:intent.count,remaining:q.escrow.logs};
        backlogLog(plan,`Reviewed packing produced ${intent.count} actual kits in ${intent.minutes} common minutes. ${q.escrow.logs ? 'Remaining work is paused.' : 'The paid batch is complete.'}`);
        state.simulation.log.at(-1).cause = intent.cause;
    }
    delete plan.backlogAdvanceMinutes; delete plan.backlogTimeSettlement;
    return plan;
}

export function timeView(state,context = {}) {
    const loop = state.backlog?.loop, q = state.backlog?.offline, records = [];
    if(loop) records.push(loop.status === 'active'
        ? `Bell-yard seal active: attempt ${loop.attempts}/3, rewinds ${loop.rewinds}/2; local minute ${loop.localMinutes}. Common minute ${state.clock}, knowledge and claim are retained.`
        : `Bell-yard seal closed after ${loop.attempts} attempts and ${loop.rewinds} rewinds. One paid log consumed; no duplicated exports.`);
    if(q) {
        records.push(`Packing ${q.status}: ${q.packed}/3 actual kits, ${q.escrow.logs} logs and ${q.escrow.coins} coins still prepaid. Frozen rule: 2 wall seconds / 2 common minutes per kit, 6 minutes maximum. Ordinary play is paused while inputs remain reserved.`);
        if(q.status === 'armed' && natural(context.wallNowMs) && context.wallNowMs >= q.reviewedThroughWallMs)
            records.push(`${observedWallMinutes(q,context.wallNowMs)} actual elapsed game minutes are available to review; no output has been awarded automatically.`);
        if(q.lastReport) records.push(`Last window: ${q.lastReport.observedMinutes} observed minutes, ${q.lastReport.requestedMinutes} explicitly requested; ${q.lastReport.creditedMinutes} credited, ${q.lastReport.uncreditedMinutes} discarded; ${q.lastReport.packed} kits packed. No elapsed remainder is retained.`);
    }
    return {title:'Sealed time and reviewed packing',description:'Optional original proofs. The live loop restores actual local state; packing advances only an explicitly reviewed, prepaid batch through the existing calendar.',records};
}

export function validateTimeRecord(record,state) {
    if(record == null) return;
    for(const value of [record.loop,record.offline]) if(value != null) jsonData(value);
    const loop = record.loop;
    if(loop) {
        backlogAssert(object(loop) && loop.revision === 1 && ['active','closed'].includes(loop.status) &&
            typeof loop.id === 'string' && natural(loop.openedAt) && loop.openedAt <= state.clock &&
            [0,1].includes(loop.localMinutes) && natural(loop.rewinds) && loop.rewinds <= 2 && loop.maxRewinds === 2 &&
            natural(loop.attempts) && loop.attempts <= 3 && loop.attempts <= state.clock-loop.openedAt && (loop.status === 'active'
                ? loop.attempts === loop.rewinds+loop.localMinutes : [loop.rewinds,loop.rewinds+1].includes(loop.attempts)) &&
            object(loop.anchor) && loop.anchor.at === loop.openedAt && object(loop.anchor.people), 'Invalid finite live bell-yard record.');
        backlogAssert(loop.counterpart?.id === KEEPER && loop.counterpart.definitionId === KEEPER &&
            loop.counterpart.definitionRevision === 1 && natural(loop.counterpart.bornAt) &&
            state.simulation?.people[KEEPER]?.bornAt === loop.counterpart.bornAt &&
            state.simulation.people[KEEPER].definitionId === KEEPER && state.actors[KEEPER]?.worldId === WORLD,
            'The live loop needs its same actual counterpart.');
        for(const id of ['player',KEEPER]) {
            const p = loop.anchor.people[id];
            backlogAssert(object(p) && p.life === 'alive' && p.location === LOCATION &&
                typeof p.bodyPresent === 'boolean' && object(p.body) && typeof p.focusPresent === 'boolean' &&
                p.focus === 2 && p.focusPresent === true && p.patternPresent === true && p.pattern === 0,
                'Invalid declared actual person/body/resource/fact restore domain.');
            vitals(p.vitals);
        }
        backlogAssert(loop.seal?.worldId === WORLD && loop.seal.location === LOCATION &&
            Number.isFinite(loop.seal.money) && loop.seal.money >= 0 && object(loop.seal.equipment) &&
            equal(loop.anchor.keeperInventory,{[WOOD]:1}) && loop.anchor.site?.owner === KEEPER &&
            loop.anchor.site.capacity === 1 && equal(loop.anchor.site.reservations,{}) &&
            loop.anchor.site.bellReady === false && loop.anchor.site.strikes === 0, 'Invalid sealed bell-yard stock or site anchor.');
        validateOwnership({sealedPlayer:loop.seal.inventory,sealedKeeper:loop.anchor.keeperInventory});
        backlogAssert(state.simulation.claims[CLAIM]?.owner === 'player' &&
            state.simulation.claims[CLAIM].status === (loop.status === 'active' ? 'held' : 'settled'), 'The retained unique loop claim changed.');
        if(loop.status === 'active') backlogAssert(state.actors.player.worldId === WORLD &&
            state.simulation.people.player.location === LOCATION && state.simulation.people[KEEPER].location === LOCATION &&
            equal(state.simulation.owners[KEEPER],loop.localMinutes ? {} : {[WOOD]:1}) &&
            state.simulation.sites[SITE]?.owner === KEEPER &&
            state.simulation.sites[SITE].bellReady === !!loop.localMinutes && state.simulation.sites[SITE].strikes === loop.localMinutes &&
            ['player',KEEPER].every(id => state.actors[id].resources[FOCUS] === 2-loop.localMinutes &&
                state.actors[id].facts[PATTERN] === loop.localMinutes && state.simulation.people[id].life === 'alive'),
            'The saved live loop escaped its declared actual domains or stock seal.');
        else backlogAssert(natural(loop.closedAt) && loop.closedAt <= state.clock &&
            equal(state.simulation.owners[KEEPER],{}), 'Invalid closed loop stock or close receipt.');
    }
    const q = record.offline;
    if(q) {
        backlogAssert(object(q) && q.revision === 1 && typeof q.id === 'string' &&
            ['armed','paused','completed','cancelled'].includes(q.status) && natural(q.armedAt) && q.armedAt <= state.clock &&
            q.actorId === 'player' && q.worldId === WORLD && q.location === LOCATION && natural(q.packed) && q.packed <= 3 &&
            q.creditedMinutes === q.packed*2 && q.creditedMinutes <= state.clock-q.armedAt && equal(q.prepaid,{logs:3,coins:3}) &&
            natural(q.armedAtWallMs) && natural(q.reviewedThroughWallMs) && q.reviewedThroughWallMs >= q.armedAtWallMs &&
            equal(q.terms,{revision:1,quantityCap:3,quantumMinutes:2,minuteCap:6,wallMinuteMs:1000,inputKey:WOOD,outputKey:KIT,logsPerKit:1,coinsPerKit:1}),
            'Invalid frozen prepaid packing terms.');
        backlogAssert(object(q.escrow) && natural(q.escrow.logs) && q.escrow.logs <= 3 && q.escrow.coins === q.escrow.logs,
            'Invalid remaining prepaid packing stock.');
        const refunded = q.status === 'cancelled' ? q.refunded?.logs : 0;
        backlogAssert(natural(refunded) && (q.status !== 'cancelled' || q.refunded.coins === refunded) &&
            q.packed+q.escrow.logs+refunded === 3 &&
            (['armed','paused'].includes(q.status) ? q.escrow.logs > 0 : q.escrow.logs === 0) &&
            (q.status !== 'completed' || q.packed === 3), 'Prepaid packing conservation failed.');
        if(['completed','cancelled'].includes(q.status)) backlogAssert(natural(q.closedAt) && q.closedAt <= state.clock, 'Missing packing close receipt.');
        if(q.lastReport) {
            const r = q.lastReport;
            backlogAssert(natural(r.at) && r.at <= state.clock && natural(r.requestedMinutes) && r.requestedMinutes <= 120 &&
                natural(r.observedMinutes) && r.requestedMinutes <= r.observedMinutes &&
                natural(r.creditedMinutes) && r.creditedMinutes <= 6 && r.creditedMinutes <= r.requestedMinutes && natural(r.uncreditedMinutes) &&
                r.observedMinutes === r.creditedMinutes+r.uncreditedMinutes && natural(r.packed) && r.creditedMinutes === r.packed*2 &&
                natural(r.remaining) && r.remaining <= 3 && typeof r.cause === 'string', 'Invalid explicit elapsed packing report.');
        }
    }
    backlogAssert(!(loop?.status === 'active' && ['armed','paused'].includes(q?.status)), 'A live stock seal cannot overlap prepaid packing.');
}
