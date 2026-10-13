import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginSociety,commitSocietyAction} from '../src/feature_expansion_society_host.js';
import {commitAgreedDutyAction,agreedDutyPresentation} from '../src/agreed_duty_host.js';
import {AGREED_DUTY_IDS as I} from '../src/agreed_duty_content.js';
import {AGREED_DUTY_CONTINUATION_IDS as C} from '../src/agreed_duty_continuation.js';
import {SOCIETY_IDS as S,SOCIETY_ITEMS as K} from '../src/feature_expansion_society.js';
import {cancelSimulationJob,previewSimulationCommand} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {featureRecordedKnowledge} from '../src/feature_expansion_host.js';

// Controlled unit fixture. Browser proof must earn its native resources separately.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const context=p=>({actorId:'player',facts:{location:'Village','village.elderMet':true},external:p.external,gameplay:p.gameplay,
    vitals:p.vitals||{player:{health:20,max_health:20,stamina:20,max_stamina:20}},nativeBody:body,nativeAlive:true,nativeReady:true});
const society=(p,id)=>commitSocietyAction(p.state,registry,{type:'command',id:`feature_society.${id}`},context(p));
const duty=(p,id)=>commitAgreedDutyAction(p.state,registry,context(p),id);
const advance=(p,n)=>{const c=context(p);return advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const quote=(p,id,extra={})=>previewSimulationCommand(p.state,registry,id,{...context(p),targetId:registry.simulation.commands.get(id).targetId,...extra});
const owned=(p,a,k)=>p.state.simulation.owners[a]?.[k]||0;
function setup(){
    let p={state:initializeExpedition(createExpansionState(17)),external:{money:30},gameplay:{player:{inventory:{[K.wood]:4},skills:{},reputation:{}}}};
    p=beginSociety(p.state,registry,context(p));p=society(p,'terms');return society(p,'supply');
}
function booked(choice=I.repairFirst){return duty(setup(),choice);}
function kept(choice=I.repairFirst){return advance(booked(choice),14);}
function stopped(){let p=advance(booked(),1);p=society(p,'stop_future');return advance(p,6);}
const result=p=>JSON.parse(p.state.simulation.knowledge.player[I.resultKey].value);
const accounts=p=>Object.entries(p.state.simulation.knowledge.player).filter(([k])=>k.startsWith('feature_society.duty.continuation.account.'));

test('fresh optional booking is visible and actually settles; both first-duty orders retain actual accounts',()=>{
    const p=setup();assert(quote(p,I.repairFirst).visible);assert(quote(p,I.repairFirst).eligible);
    for(const [choice,preference,first] of [[I.repairFirst,'repair',I.repair],[I.lessonFirst,'lesson',I.lesson],[I.ordinary,'ordinary',I.repair]]){
        const done=kept(choice);assert.equal(result(done).status,'kept');assert.equal(result(done).preference,preference);
        assert.equal(result(done).dutyCommandId,first);assert.equal(done.state.actors[S.craftsperson].completed[first],1);
        assert(quote(done,C.sponsored).eligible);assert(!quote(done,C.paid).visible);
    }
});

test('no-preference legacy controller preserves original order without any new booking or outcome history',()=>{
    let p=society(setup(),'authorize_home');p=advance(p,7);
    assert.equal(p.state.actors[S.craftsperson].completed[I.repair],1);
    assert.equal(p.state.simulation.knowledge.player[I.agreementKey],undefined);
    assert.equal(p.state.simulation.knowledge.player[I.resultKey],undefined);
    assert(!quote(p,C.sponsored).visible);assert(!quote(p,C.paid).visible);
});

test('pending original booking restores exact frozen terms and subsequent occupancy blocks a later workshop',()=>{
    const accepted=booked(),job=structuredClone(accepted.state.simulation.jobs[0]);
    const restored=reload(accepted);assert.deepEqual(restored.state.simulation.jobs[0],job);
    const first=advance(restored,7);assert.equal(result(first).status,'kept');
    assert(first.state.simulation.jobs.some(j=>j.commandId===I.lesson));assert(!quote(first,C.sponsored).eligible);
    assert.equal(advance(first,7).state.actors[S.craftsperson].completed[I.lesson],1);
});

test('kept outcome enables fresh sponsored terms, real finite means and one useful native kit',()=>{
    let p=kept();const before=structuredClone(p),old=result(p);
    for(let n=0;n<3;n++)assert(agreedDutyPresentation(p.state,registry,context(p)).actions.some(a=>a.id===C.sponsored&&a.eligible));
    assert.deepEqual(p,before);
    p=duty(p,C.sponsored);assert.equal(owned(p,S.household,K.wood),1);assert.equal(owned(p,S.craftsperson,K.kit),0);
    assert.equal(p.gameplay.player.inventory[K.wood],before.gameplay.player.inventory[K.wood]-1);
    assert.equal(p.state.actors[S.craftsperson].resources.attention,0);assert.equal(p.gameplay.player.inventory[K.kit]||0,0);
    p=advance(reload(p),3);assert.equal(p.gameplay.player.inventory[K.kit],1);assert.equal(owned(p,S.craftsperson,K.kit),1);
    assert.equal(p.state.actors[S.craftsperson].resources.coins,before.state.actors[S.craftsperson].resources.coins+1);
    assert.equal(p.external.money,before.external.money);assert.deepEqual(result(p),old);
    assert.equal(p.state.simulation.powers.player?.[S.method],undefined);
    assert.equal(JSON.parse(accounts(p)[0][1].value).priorCause,before.state.simulation.knowledge.player[I.resultKey].cause);
    const shown=featureRecordedKnowledge(p.state,['feature_society.duty.continuation.account.']);
    assert(shown[0].text.includes('later agreed workshop completed'));assert(!shown[0].text.includes('schema'));
    const finished=reload(p);assert(!quote(finished,C.sponsored).eligible);assert.throws(()=>duty(finished,C.sponsored));
    assert.deepEqual(advance(finished,5).gameplay.player.inventory,finished.gameplay.player.inventory);
});

test('actual consent withdrawal stops the earlier duty, refunds it and offers distinct personally funded work',()=>{
    let p=stopped();assert.equal(result(p).status,'stopped');assert.equal(p.state.worlds[S.world].facts['feature_society.homeRepaired'],false);
    assert.equal(owned(p,S.household,K.wood),3);assert.equal(p.state.actors[S.household].resources.coins,6);
    assert(!quote(p,C.sponsored).visible);assert(quote(p,C.paid).eligible);
    const before=structuredClone(p);p=duty(p,C.paid);assert.equal(p.external.money,before.external.money-1);
    assert.equal(p.gameplay.player.inventory[K.wood],before.gameplay.player.inventory[K.wood]-1);
    p=advance(p,3);assert.equal(p.gameplay.player.inventory[K.kit],1);assert.equal(owned(p,S.household,K.wood),3);
    assert.equal(p.state.actors[S.household].resources.coins,6);assert.equal(result(p).status,'stopped');
});

test('the original NPC cancellation authority keeps its distinct account and actual original refund',()=>{
    const accepted=advance(booked(),1),job=accepted.state.simulation.jobs.find(j=>j.commandId===I.repair);
    const cancelled=cancelSimulationJob(accepted.state,registry,job.id,{...context(accepted),actorId:S.craftsperson});
    assert.equal(result(cancelled).status,'cancelled');assert.equal(owned(cancelled,S.household,K.wood),3);
    assert.equal(cancelled.state.actors[S.household].resources.coins,6);assert.equal(owned(cancelled,S.craftsperson,K.kit),1);
    assert(quote(cancelled,C.paid).visible);assert(!quote(cancelled,C.sponsored).visible);
    assert.equal(result(reload(cancelled)).status,'cancelled');
});

test('later refusal changes no prior result, money, stock, mastery or rights and closes only its offer',()=>{
    for(const make of [kept,stopped]){
        const p=make(),old=structuredClone(p),done=duty(p,C.decline);
        assert.deepEqual(done.external,old.external);assert.deepEqual(done.gameplay,old.gameplay);
        assert.deepEqual(done.state.simulation.owners,old.state.simulation.owners);assert.deepEqual(done.state.simulation.claims,old.state.simulation.claims);
        assert.deepEqual(result(done),result(old));assert.equal(done.state.clock,old.state.clock);
        assert(!quote(done,C.sponsored).visible);assert(!quote(done,C.paid).visible);
        assert.throws(()=>duty(reload(done),C.decline));
    }
});

test('exact workshop cancellation refunds actual reservations and preserves account through retry',()=>{
    for(const [make,id] of [[kept,C.sponsored],[stopped,C.paid]]){
        const p=make(),accepted=duty(p,id),job=accepted.state.simulation.jobs.find(j=>j.commandId===id);
        let cancelled=cancelSimulationJob(accepted.state,registry,job.id,context(accepted));
        assert.deepEqual(cancelled.external,p.external);assert.deepEqual(cancelled.gameplay,p.gameplay);
        assert.deepEqual(cancelled.state.simulation.owners,p.state.simulation.owners);
        assert.deepEqual(cancelled.state.actors[S.craftsperson].resources,p.state.actors[S.craftsperson].resources);
        assert.equal(JSON.parse(accounts(cancelled)[0][1].value).status,'cancelled');assert(quote(cancelled,id).eligible);
        cancelled=advance(duty(reload(cancelled),id),3);assert.equal(cancelled.gameplay.player.inventory[K.kit],1);
        assert.deepEqual(accounts(cancelled).map(([,r])=>JSON.parse(r.value).status),['cancelled','completed']);
    }
});

test('controlled loss of actual method/body/contact/right support refunds with a truthful stopped account',()=>{
    for(const loss of [p=>{p.state.simulation.faculties[S.craftsperson][S.method].active=false;},
        p=>{p.state.simulation.people[S.craftsperson].location='Shack';},
        p=>{p.state.simulation.claims[S.benchRight].owner=S.household;},
        p=>{p.state.simulation.people.player.body={...body,hands:1};}]){
        const p=kept();let accepted=duty(p,C.sponsored);loss(accepted);accepted=advance(accepted,3);
        assert.equal(accepted.gameplay.player.inventory[K.kit]||0,0);assert.deepEqual(accepted.external,p.external);
        assert.deepEqual(accepted.state.simulation.owners,p.state.simulation.owners);
        assert.equal(JSON.parse(accounts(accepted)[0][1].value).status,'stopped');
        assert.equal(accepted.state.worlds[S.world].facts[C.closedFact],undefined);
    }
});

test('missing participant means, capability, contact, busy capacity, body and stale sequence never accept',()=>{
    for(const change of [p=>{p.state.simulation.owners[S.craftsperson][K.kit]=0;},
        p=>{p.state.actors[S.craftsperson].resources.attention=0;},p=>{p.state.simulation.powers[S.craftsperson][S.method].owned=false;},
        p=>{p.state.simulation.people[S.craftsperson].location='Shack';},p=>{p.gameplay.player.inventory[K.wood]=0;},
        p=>{p.state.actors[S.household].resources.coins=0;},p=>{p.state.simulation.people.player.body={...body,hands:1};}]){
        const p=kept();change(p);const unchanged=structuredClone(p);assert(!quote(p,C.sponsored).eligible);
        assert.throws(()=>duty(p,C.sponsored));assert.deepEqual(p,unchanged);
    }
    const p=kept();assert(!quote(p,C.sponsored,{facts:{location:'Shack'}}).eligible);
    assert(!quote(p,C.sponsored,{busy:true}).eligible);
    assert.throws(()=>commitAgreedDutyAction(p.state,registry,context(p),C.sponsored,p.state.sequence-1),/stale/);
    const pending=duty(p,C.sponsored);assert(!quote(pending,C.sponsored).eligible);assert(!quote(pending,C.decline).eligible);
});

test('forged or absent prior outcome cannot create a new later agreement',()=>{
    const p=setup();assert(!quote(p,C.sponsored).visible);assert(!quote(p,C.paid).visible);
    const fake=kept();const data=result(fake);data.jobId='simulation:99999';fake.state.simulation.knowledge.player[I.resultKey].value=JSON.stringify(data);
    assert(!quote(fake,C.sponsored).eligible);assert.throws(()=>loadExpansionState(fake.state,registry),/duty result/);
    const absent=initializeExpedition(createExpansionState(9));assert.equal(reload({state:absent}).state.simulation,null);
});

test('failed durable publication leaves live prior state untouched and offers one legitimate retry',()=>{
    const p=kept(),before=structuredClone(p),accepted=duty(p,C.sponsored);
    assert.throws(()=>persistExpansionPlan(accepted,{createSave:()=>JSON.stringify({character:{money:p.external.money},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}}}),
        bindings:{player:{category:'person',id:'main_character'}},storage:{setItem(){throw Error('quota');}},key:'disposable'}),/quota/);
    assert.deepEqual(p,before);assert(quote(p,C.sponsored).eligible);
    assert.equal(advance(duty(p,C.sponsored),3).gameplay.player.inventory[K.kit],1);
});

test('restoration rejects changed frozen output, costs, time, participants, accounts and closure',()=>{
    const accepted=duty(kept(),C.sponsored);
    for(const alter of [p=>{p.state.simulation.jobs.find(j=>j.commandId===C.sponsored).effects.find(e=>e.actor==='player'&&e.type==='item').amount=7;},
        p=>{p.state.simulation.jobs.find(j=>j.commandId===C.sponsored).costs[0].amount=0;},
        p=>{p.state.simulation.jobs.find(j=>j.commandId===C.sponsored).due+=1;},
        p=>{p.state.simulation.jobs.find(j=>j.commandId===C.sponsored).participants.pop();},
        p=>{p.state.worlds[S.world].facts[C.closedFact]=true;}]){
        const p=structuredClone(accepted);alter(p);assert.throws(()=>reload(p));
    }
    const done=advance(accepted,3);
    for(const alter of [p=>{accounts(p)[0][1].value='{"schema":999,"status":"garbage"}';},
        p=>{p.state.worlds[S.world].facts[C.closedFact]=false;},
        p=>{delete p.state.simulation.knowledge.player[accounts(p)[0][0]];}]){
        const p=structuredClone(done);alter(p);assert.throws(()=>reload(p));
    }
    assert.equal(reload(done).gameplay.player.inventory[K.kit],1);
});
