import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {commitContextualBalmCommand as commit,stageContextualBalmEffectRequest as stage,contextualBalmContext,validateContextualBalmState,contextualBalmPresentation} from '../src/contextual_balm_host.js';
import {contextualBalmAvailableCount} from '../src/contextual_balm_facts.js';
import {CONTEXTUAL_BALM_IDS as I} from '../src/contextual_balm_content.js';
import {prepareContextualBalmNative as prepare} from '../src/contextual_balm_native.js';
import {ActiveEffect,effect_templates} from '../src/active_effects.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';

// Controlled SOURCE fixtures only. These prove neither native acquisition nor browser play.
const key=JSON.stringify({id:I.itemId});
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const frame={clock:0,battleRunning:false,effects:{}};
const context=(p,extra={})=>({actorId:'player',worldId:I.location,external:p.external,gameplay:p.gameplay,
    facts:{location:'Village','village.elderMet':true},nativeBody:body,nativeAlive:true,nativeCareFrame:frame,...extra});
function setup(){
    const p={state:initializeExpedition(createExpansionState(17)),external:{money:20},gameplay:{player:{inventory:{[key]:2},skills:{},reputation:{}}}};
    const out=beginBodyRecord(p.state,registry,context(p));
    out.state.simulation.conditions.player ||= {};
    out.state.simulation.conditions.player['body.scraped_hands']={intensity:1,expiresAt:20,cause:'source:fixture'};
    out.state.simulation.conditions.player['body.sore_hands']={intensity:1,expiresAt:12,cause:'source:fixture'};
    return out;
}
const dress=(p,extra={},seq=p.state.sequence)=>commit(p.state,registry,{id:I.dress},context(p,extra),seq);
const advance=(p,n,extra={})=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:context(p,extra)});
const reload=p=>({...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const receipt=p=>p.state.simulation.knowledge.player?.[I.receipt];
function finished(n=1,extra={}){const p=dress(setup());return {before:p,plan:stage(p.state,advance(p,n,extra),context(p,extra))};}
const nativeBindings=(activeEffects,refresh=()=>{})=>({activeEffects,itemTemplates:{[I.itemId]:{effects:[{effect:I.effectId,duration:90}],recovery_chances:{}}},effectTemplates:effect_templates,ActiveEffect,refresh});

test('absent feature remains absent and reserved dressing survives exact JSON restoration',()=>{
    const absent=initializeExpedition(createExpansionState(9));assert.equal(loadExpansionState(absent,registry).simulation,null);
    const p=setup();assert.equal(receipt(reload(p)),undefined);assert.equal(p.state.actors.player.facts[I.version],undefined);
    const booked=dress(p),restored=reload(booked);assert.deepEqual(restored.state,booked.state);
    assert.equal(booked.gameplay.player.inventory[key],1);assert.equal(booked.state.simulation.jobs[0].due,p.state.clock+1);
    assert.equal(receipt(booked),undefined);
});

test('actual joined advance finishes at one minute and preserves soreness, body and independent state',()=>{
    const booked=dress(setup()),before=structuredClone(booked);
    assert.deepEqual(advance(booked,0).state,booked.state);
    const done=advance(reload(booked),1);assert.equal(done.state.clock,booked.state.clock+1);
    assert.equal(done.state.simulation.conditions.player['body.scraped_hands'],undefined);
    assert.deepEqual(done.state.simulation.conditions.player['body.sore_hands'],before.state.simulation.conditions.player['body.sore_hands']);
    assert.deepEqual(done.state.simulation.people.player.body,before.state.simulation.people.player.body);
    assert.deepEqual(done.gameplay,before.gameplay);assert.deepEqual(done.external,before.external);
    assert.equal(done.state.actors.player.completed[I.dress],1);assert.equal(receipt(done).at,1);
    assert.deepEqual(reload(done).state,done.state);assert.throws(()=>dress(done));
});

test('cancellation refunds the exact balm without a receipt or native effect and allows retry',()=>{
    const p=setup(),booked=reload(dress(p)),job=booked.state.simulation.jobs[0];
    const cancelled=commit(booked.state,registry,{action:'cancel',id:job.id},context(booked));
    assert.deepEqual(cancelled.gameplay,p.gameplay);assert.equal(receipt(cancelled),undefined);
    assert.equal(stage(booked.state,cancelled,context(booked)).contextualBalmEffectRequests,undefined);
    assert.throws(()=>commit(cancelled.state,registry,{action:'cancel',id:job.id},context(cancelled)));
    assert.equal(advance(dress(reload(cancelled)),1).state.actors.player.completed[I.dress],1);
});

test('support loss and scrape expiry refund rather than inventing treatment',()=>{
    for(const alter of [p=>{p.state.simulation.people.player.body={...body,hands:1};},p=>{p.state.simulation.conditions.player['body.scraped_hands'].expiresAt=1;}]){
        const p=dress(setup());alter(p);const done=advance(p,1);
        assert.equal(done.gameplay.player.inventory[key],2);assert.equal(receipt(done),undefined);assert.equal(done.state.actors.player.completed[I.dress],undefined);
    }
    for(const extra of [{facts:{location:'Forest road'}},{nativeAlive:false},{nativeCareFrame:{...frame,battleRunning:true}}]){
        const p=dress(setup()),done=advance(p,1,extra);assert.equal(done.gameplay.player.inventory[key],2);assert.equal(receipt(done),undefined);
    }
});

test('missing stock, custody, equipment, unsupported body/place and busy state refuse without mutation',()=>{
    for(const alter of [p=>{delete p.gameplay.player.inventory[key];},p=>{p.state.simulation.custody.fixture={holder:'player',key};},p=>{p.state.simulation.people.player.body={...body,controllerId:'other'};}]){
        const p=setup();alter(p);const snapshot=structuredClone(p);assert.throws(()=>dress(p));assert.deepEqual(p,snapshot);
    }
    const p=setup();assert.equal(contextualBalmAvailableCount(p.state,context(p,{equipment:{player:{hand:key}}})),0);
    for(const extra of [{equipment:{player:{hand:key}}},{busy:true},{nativeAlive:false},{facts:{location:'Town'}},{nativeCareFrame:{...frame,battleRunning:true}}])assert.throws(()=>dress(p,extra));
});

test('stale and repeated commands cannot reserve twice; presentation facts refresh at actual time',()=>{
    const p=setup();assert.throws(()=>dress(p,{},p.state.sequence-1),/current/);
    const booked=dress(p);assert.throws(()=>dress(booked),/current work/);assert.equal(booked.gameplay.player.inventory[key],1);
    const c=context(p,{nativeCareFrame:{...frame,effects:{[I.effectId]:{duration:12}}}});
    assert.equal(contextualBalmContext({...p.state,clock:5},c).facts['contextualBalm.currentWeakBalmDuration'],7);
});

test('pending restoration rejects modified cost, effect, time, participants and support contract',()=>{
    const p=dress(setup());
    for(const alter of [j=>j.costs[0].amount=0,j=>j.effects[0].operation='apply',j=>j.due=2,j=>j.participants=[],j=>j.completionSupport.location='Town',j=>j.completionSupport.requires={all:[]},j=>j.reservationReturns=0,j=>j.commandId='contextual_balm.unknown']){
        const bad=structuredClone(p);alter(bad.state.simulation.jobs[0]);assert.throws(()=>reload(bad));
    }
});

test('receipt restoration rejects altered stage/value/cause/time, namespace copies and missing receipt',()=>{
    const p=finished().plan;
    for(const alter of [p=>receipt(p).stage='noticed',p=>receipt(p).value='invented',p=>receipt(p).cause='simulation:99999',p=>receipt(p).at=0,p=>receipt(p).extra=true,p=>delete p.state.simulation.knowledge.player[I.receipt],p=>p.state.actors.player.facts['contextual_balm.fake']=true,p=>{p.state.simulation.knowledge.other={[I.receipt]:structuredClone(receipt(p))};}]){
        const bad=structuredClone(p);alter(bad);assert.throws(()=>reload(bad));
    }
    assert.doesNotThrow(()=>validateContextualBalmState(p.state,registry));
});

test('joined multi-minute advance ages the new effect from actual completion; re-staging is idempotent',()=>{
    const {before,plan}=finished(4);assert.equal(receipt(plan).at,1);assert.equal(plan.contextualBalmEffectRequests[0].remainingNewDuration,87);
    assert.equal(plan.contextualBalmEffectRequests[0].effectiveDuration,87);
    const snapshot=structuredClone(plan.contextualBalmEffectRequests);stage(before.state,plan,context(before));assert.deepEqual(plan.contextualBalmEffectRequests,snapshot);
    plan.contextualBalmEffectRequests[0].receiptAt=2;assert.throws(()=>stage(before.state,plan,context(before)),/repeated/);
    const expired=finished(91).plan;assert.equal(expired.contextualBalmEffectRequests,undefined);
});

test('native staging preserves longer weak balm and distinct stronger effects until durable publication',()=>{
    const existing={duration:150},strong={duration:30};const effects={[I.effectId]:existing,'Healing balm':strong};
    const {before,plan}=finished(4,{nativeCareFrame:{...frame,effects:structuredClone(effects)}});
    let refreshes=0;const publication=prepare(before.state,plan,nativeBindings(effects,()=>refreshes++));
    assert.throws(()=>publication.publish(),/persist/);assert.equal(effects[I.effectId],existing);
    const envelope={active_effects:{[I.effectId]:{duration:146},'Healing balm':structuredClone(strong)}};
    publication.write(envelope);assert.equal(envelope.active_effects[I.effectId].duration,146);assert.equal(effects[I.effectId],existing);
    publication.publish();assert.equal(effects[I.effectId].duration,146);assert.equal(effects['Healing balm'],strong);assert.equal(refreshes,1);
    const changed=structuredClone(plan);changed.contextualBalmEffectRequests[0].duration=900;assert.throws(()=>prepare(before.state,changed,nativeBindings(effects)),/contract/);
});

test('failed durable write publishes no live native effect and retry uses the same caused completion',()=>{
    const {before,plan}=finished();const effects={},publication=prepare(before.state,plan,nativeBindings(effects));
    const options={createSave:()=>JSON.stringify({character:{money:20},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}},active_effects:{}}),bindings:{player:{category:'person',id:'main_character'}},nativePublication:publication,key:'source-only',storage:{setItem(){throw Error('quota');}}};
    assert.throws(()=>persistExpansionPlan(plan,options),/quota/);assert.deepEqual(effects,{});assert.equal(receipt(before),undefined);
    let saved;const retry=prepare(before.state,plan,nativeBindings(effects));persistExpansionPlan(plan,{...options,nativePublication:retry,storage:{setItem(k,v){saved=JSON.parse(v);}}});
    assert.deepEqual(effects,{});retry.publish();assert.equal(effects[I.effectId].duration,90);assert.equal(saved.active_effects[I.effectId].duration,90);assert.equal(saved.expansion.simulation.knowledge.player[I.receipt].cause,receipt(plan).cause);
});

test('existing native pending work and running routine block the reservation',()=>{
    for(const alter of [p=>{p.state.pending.push({context:{actorId:'player'}});},p=>{p.state.simulation.programs.player={status:'running'};}]){
        const p=setup();alter(p);const snapshot=structuredClone(p);assert.throws(()=>dress(p),/current work/);assert.deepEqual(p,snapshot);
    }
});

test('native staging rejects mismatched clock envelopes and altered actual template contract',()=>{
    const {before,plan}=finished();
    const publication=prepare(before.state,plan,nativeBindings({}));
    assert.throws(()=>publication.write({active_effects:{[I.effectId]:{duration:9}}}),/clock/);
    assert.throws(()=>publication.publish(),/persist/);
    const bindings=nativeBindings({});bindings.itemTemplates[I.itemId].effects[0].duration=900;
    assert.throws(()=>prepare(before.state,plan,bindings),/template changed/);
    const fake=structuredClone(plan);fake.contextualBalmEffectRequests[0].durableCause='simulation:99999';
    assert.throws(()=>prepare(before.state,fake,nativeBindings({})),/caused/);
});

test('copied feature pending job, condition, routine or player record cannot restore as valid care',()=>{
    const p=dress(setup());
    for(const alter of [p=>{p.state.simulation.jobs.push(structuredClone(p.state.simulation.jobs[0]));},
        p=>{p.state.simulation.conditions.player['contextual_balm.fake']={intensity:1,expiresAt:null,cause:'fixture'};},
        p=>{p.state.simulation.programs.player={commandId:I.dress,status:'paused'};},
        p=>{p.state.simulation.people.player.facts={[I.version]:1};}]){
        const bad=structuredClone(p);alter(bad);assert.throws(()=>reload(bad));
    }
});

test('latest treatment record labels the current Weak healing balm duration as current, not as before treatment',()=>{
    // R15 G1 browser run: the record read "88 played minutes before this treatment" while the
    // treatment had started from 0. The value is the current remaining duration.
    const {plan}=finished(1);
    const now={clock:plan.state.clock,battleRunning:false,effects:{[I.effectId]:{duration:88}}};
    const text=contextualBalmPresentation(plan.state,registry,context(plan,{nativeCareFrame:now})).sections[0].records
        .find(r=>r.id==='contextual_balm.lastTreatment').text;
    assert.match(text,/Native Weak healing balm remaining now: 88 played minutes\.$/);
    assert.doesNotMatch(text,/before this treatment/);
});
