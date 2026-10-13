import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop,referenceGameplayFacts,previewReferenceGameplayCommand} from '../src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as I,REFERENCE_GAMEPLAY_KEYS as K} from '../src/reference_gameplay_content.js';
import {commitCoolingRefinementCommand as cooling,previewCoolingRefinementCommand as preview} from '../src/cooling_refinement_host.js';
import {coolingRefinementFacts,validateCoolingRefinement} from '../src/cooling_refinement_facts.js';
import {cancelSimulationJob,commitSimulationCommand,advanceSimulationBoundary} from '../src/simulation.js';
import {featureHookCoolingActive,initializeFeatureBattle,featureNativeAction,featureBattleToken} from '../src/feature_expansion_battle.js';
import {createFeatureBattleHost} from '../src/feature_expansion_battle_host.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {prepareOwnershipPublication} from '../src/acquisition.js';

// Controlled SOURCE fixtures. Seeds, funding, body and calendar here prove no native acquisition or play.
const P='reference.coolingRefinement.';
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
    facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'campaign.anchor':true,'actor.feature.battle.seen':false},nativeBody:body,nativeAlive:true,nativeReady:true,
    nativeCareFrame:{clock:0,calendarMinute:600,battleRunning:false,effects:{}},...extra});
const advance=(p,n,extra={})=>{const c=ctx(p,extra);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:p.vitals||c.vitals};};
const ref=(p,id,extra={})=>workshop(p.state,registry,{id},ctx(p,extra));
const refine=(p,id='reference_gameplay.refine_first',extra={},sequence=p.state.sequence)=>cooling(p.state,registry,{type:'cooling_refinement',id,sequence},ctx(p,extra),sequence);
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const facts=p=>p.state.actors.player.facts;
const receipt=p=>JSON.parse(facts(p)[P+'lastAttempt']);
const stock=(p,actor,key)=>actor==='player'?(p.gameplay.player.inventory[key]||0):(p.state.simulation.owners[actor]?.[key]||0);
function opened(seed=17){
    let p={state:initializeExpedition(createExpansionState(seed)),external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
    p=beginBodyRecord(p.state,registry,ctx(p));p.state.simulation.people.player.body=structuredClone(body);p=beginFeatureObjects(p.state,registry,ctx(p));
    p=commitFeatureObjectCommand(p.state,registry,{id:'feature_objects.inspect'},ctx(p));p=advance(p,2);
    p=enrollReferenceGameplay(p.state,ctx(p));return ref(p,I.open);
}
function trained(seed=17){
    let p=opened(seed);p=ref(p,'reference_gameplay.buy_sleeve');
    for(let n=0;n<8;n++)p=ref(p,'reference_gameplay.buy_salt');
    p=advance(ref(p,'reference_gameplay.learn'),3);
    for(let n=0;n<3;n++)p=advance(ref(p,I.practice),3);
    p=commitSimulationCommand(p.state,registry,{id:'feature_battle.inspect'},ctx(p));return advance(p,2);
}
function outcome(wanted){
    // Bounded deterministic test seam only, intentionally separate from the native finite-stock run.
    for(let seed=1;seed<=32;seed++){
        const before=trained(seed),accepted=refine(before),done=advance(accepted,3);
        if(receipt(done).result===wanted)return {before,accepted,done};
    }
    throw Error('Controlled seed set did not cover requested branch');
}
const job=p=>p.state.simulation.jobs.find(j=>j.commandId.startsWith('reference_gameplay.refine_'));

test('ordinary absent capability explicitly exposes the paid lesson without supplied power facts',()=>{
    const p=ref(opened(),'reference_gameplay.buy_sleeve');assert.equal(previewReferenceGameplayCommand(p.state,registry,'reference_gameplay.learn',ctx(p)).visible,true);
    assert.equal(previewReferenceGameplayCommand(p.state,registry,'reference_gameplay.learn',ctx(p)).eligible,true);
});

test('paid workshop stock and learned capability are separate, finite and three trials leave five salt attempts',()=>{
    let p=opened();assert.equal(stock(p,I.teacher,K.charged),2);assert.equal(stock(p,I.teacher,K.salt),8);
    assert.equal(stock(p,'player',K.charged),0);assert.equal(p.state.simulation.powers.player?.[I.cooling],undefined);
    const money=p.external.money;p=ref(p,'reference_gameplay.buy_sleeve');assert.equal(p.external.money,money-2);
    assert.equal(stock(p,I.teacher,K.charged),1);assert.equal(stock(p,'player',K.charged),1);assert.equal(p.state.simulation.powers.player?.[I.cooling],undefined);
    p=trained();assert.equal(stock(p,I.teacher,K.salt),0);assert.equal(stock(p,'player',K.salt),5);
    assert.equal(p.state.simulation.powers.player[I.cooling].mastery,3);assert(referenceGameplayFacts(p.state,ctx(p),registry)['reference.workshop.functionReady']);
    assert.throws(()=>ref(p,I.practice));assert.throws(()=>ref(p,I.open));assert.throws(()=>ref(p,'reference_gameplay.buy_salt'));
});

test('pending refinement reserves exact inputs, freezes one roll/quote and restores unchanged',()=>{
    const p=trained(),accepted=refine(p),j=job(accepted);assert.equal(stock(accepted,'player',K.salt),4);
    assert.equal(accepted.vitals.player.stamina,p.vitals.player.stamina-2);assert.equal(j.due,p.state.clock+3);
    assert.equal(j.costs[0].amount,-1);assert.equal(j.costs[1].amount,-2);assert.equal(accepted.state.simulation.seed!==p.state.simulation.seed,true);
    assert.deepEqual(reload(accepted).state,accepted.state);assert.deepEqual(advance(accepted,2).state.simulation.jobs[0],j);
    const done=advance(reload(accepted),3,{nativeCareFrame:{clock:p.state.clock,calendarMinute:360}});
    const r=receipt(done);assert.equal(r.calendarMinute,600+p.state.clock);assert.equal(r.prepared,false);assert.equal(r.successProbability,.5);
    assert.equal(r.roll,j.roll);assert.equal(r.acceptedAt,p.state.clock);assert.equal(r.acceptedAt+3,done.state.clock);
    assert.equal(done.state.simulation.seed,accepted.state.simulation.seed);assert.equal(job(done),undefined);assert.deepEqual(reload(done).state,done.state);
    assert.deepEqual(advance(done,0).state,done.state);
});

test('quiet window and actual focus select preparation; retry probability caps after three failures',()=>{
    const p=trained();
    for(const [minute,open,remaining] of [[359,false,0],[360,true,120],[479,true,1],[480,false,0]]){
        const f=coolingRefinementFacts(p.state,ctx(p,{nativeCareFrame:{clock:p.state.clock,calendarMinute:minute}}));
        assert.equal(f[P+'quietWindowOpen'],open);assert.equal(f[P+'quietWindowRemaining'],remaining);assert.equal(f[P+'successProbability'],open?.7:.5);
    }
    p.state.simulation.conditions.player||={};p.state.simulation.conditions.player['status.care.focused']={intensity:1,expiresAt:p.state.clock+1,cause:'source:fixture'};
    for(const n of [0,1,2,3,9]){facts(p)[P+'failedAttempts']=n;const f=coolingRefinementFacts(p.state,ctx(p));assert.equal(f[P+'successProbability'],.7+Math.min(n,3)*.05);}
    const accepted=refine(trained(),undefined,{nativeCareFrame:{clock:0,calendarMinute:360}});
    const r=JSON.parse(job(accepted).effects.find(e=>e.key===P+'lastAttempt').value);assert.equal(r.prepared,true);assert.equal(r.successProbability,.7);
});

test('cancel refunds salt and stamina without a result; repeated cancellation and stale reservation refuse',()=>{
    const p=trained(),accepted=refine(p),j=job(accepted);assert.throws(()=>refine(p,undefined,{},p.state.sequence-1),/stale/);assert.throws(()=>refine(accepted));
    const cancelled=cancelSimulationJob(accepted.state,registry,j.id,ctx(accepted));
    assert.deepEqual(cancelled.gameplay,p.gameplay);assert.deepEqual(cancelled.vitals,p.vitals);assert.equal(facts(cancelled)[P+'lastAttempt'],undefined);
    assert.throws(()=>cancelSimulationJob(cancelled.state,registry,j.id,ctx(cancelled)));
    assert.equal(stock(refine(reload(cancelled)),'player',K.salt),4);
});

test('loss of body, source, power or Village support refunds pending work without completion',()=>{
    for(const change of [p=>{p.state.simulation.people.player.body.hands=1;},p=>{p.state.simulation.faculties.player[I.cooling].active=false;},
        p=>{p.state.simulation.powers.player[I.cooling].owned=false;},p=>{p.state.actors.player.sources[I.cooling].expiresAt=p.state.clock+1;}]){
        const original=trained(),p=refine(original);change(p);const done=advance(p,3);
        assert.equal(stock(done,'player',K.salt),5);
        assert.equal(facts(done)[P+'lastAttempt'],undefined);assert.equal(done.state.actors.player.completed['reference_gameplay.refine_first'],undefined);
    }
    const original=trained(),p=refine(original),done=advance(p,3,{facts:{location:'Shack'}});assert.equal(stock(done,'player',K.salt),5);assert.equal(facts(done)[P+'lastAttempt'],undefined);
});

test('success grants exactly one application; actual sleeve becomes empty and hook field lasts five minutes',()=>{
    const {done}=outcome('success');assert.equal(facts(done)[P+'applicationAvailable'],true);
    const previous=structuredClone(done),applied=refine(done,'reference_gameplay.steady_hook');
    assert.equal(stock(applied,'player',K.charged),0);assert.equal(stock(applied,'player',K.empty),1);assert.equal(applied.vitals.player.stamina,done.vitals.player.stamina-2);
    assert.equal(facts(applied)[P+'applicationAvailable'],false);assert.equal(applied.state.simulation.conditions[I.hook][I.field].expiresAt,done.state.clock+5);
    assert(featureHookCoolingActive(applied.state));assert.throws(()=>refine(applied,'reference_gameplay.steady_hook'));
    assert.deepEqual(applied.state.actors.player.sources,previous.state.actors.player.sources);assert.deepEqual(applied.state.simulation.powers.player,previous.state.simulation.powers.player);
    assert.deepEqual(reload(applied).state,applied.state);assert(featureHookCoolingActive(advance(applied,4).state));assert(!featureHookCoolingActive(advance(applied,5).state));
});

test('failure spends reserved costs, grants no application and adds exact five-minute max soreness and retry',()=>{
    const {before,accepted,done}=outcome('failure'),r=receipt(done);
    assert.equal(stock(done,'player',K.salt),4);assert.equal(done.vitals.player.stamina,before.vitals.player.stamina-2);
    assert.equal(facts(done)[P+'failedAttempts'],1);assert.equal(facts(done)[P+'applicationAvailable'],undefined);
    const sore=done.state.simulation.conditions.player['body.sore_hands'];assert.equal(sore.expiresAt,r.acceptedAt+8);assert.equal(sore.cause,r.cause);
    assert.equal(accepted.state.simulation.seed,done.state.simulation.seed);assert.equal(preview(done.state,registry,'reference_gameplay.refine_second',ctx(done)).visible,true);
    assert.throws(()=>refine(done,'reference_gameplay.steady_hook'));assert.equal(advance(done,5).state.simulation.conditions.player?.['body.sore_hands'],undefined);
});

test('old direct hook command still conserves sleeve and validates a four-minute field',()=>{
    const p=trained(),applied=ref(p,'reference_gameplay.cool_hook');assert.equal(applied.state.simulation.conditions[I.hook][I.field].expiresAt,p.state.clock+4);
    assert.equal(stock(applied,'player',K.empty),1);assert.deepEqual(reload(applied).state,applied.state);
    assert(featureHookCoolingActive(advance(applied,3).state));assert(!featureHookCoolingActive(advance(applied,4).state));
});

test('missing, borrowed, equipped or transferred sleeve and absent salt/body/source/calendar refuse atomically',()=>{
    for(const change of [p=>{delete p.gameplay.player.inventory[K.charged];},p=>{p.state.simulation.custody.fixture={holder:'player',key:K.charged};},
        p=>{p.state.simulation.equipment.player={hand:K.charged};},p=>{p.gameplay.player.inventory[K.salt]=0;},
        p=>{p.state.simulation.people.player.body.controllerId='other';},p=>{p.state.simulation.faculties.player[I.cooling].suppressed=true;},
        p=>{p.state.simulation.powers.player[I.cooling].mastery=2;}]){
        const p=trained();change(p);const before=structuredClone(p);assert.throws(()=>refine(p));assert.deepEqual(p,before);
    }
    const p=trained();for(const extra of [{nativeAlive:false},{nativeCareFrame:null},{facts:{location:'Shack'}},{busy:true}])assert.throws(()=>refine(p,undefined,extra));
    const {done}=outcome('success');for(const change of [p=>{p.state.simulation.people[I.hook].location='Shack';},p=>{delete p.state.simulation.equipment[I.hook].hook_pole;},p=>{p.state.simulation.owners[I.hook][K.pole]=0;}]){
        const p=structuredClone(done);change(p);assert.throws(()=>refine(p,'reference_gameplay.steady_hook'));
    }
});

test('pending restoration rejects tampered quote, roll, due, costs, support, reservation and duplicate job',()=>{
    const p=refine(trained());for(const change of [j=>j.roll=.99,j=>j.due++,j=>j.costs[0].amount=0,j=>j.participants=[],j=>j.completionSupport.location='Shack',
        j=>j.reservationReturns=0,j=>{const e=j.effects.find(e=>e.key===P+'lastAttempt'),r=JSON.parse(e.value);r.successProbability=.85;e.value=JSON.stringify(r);}]){
        const bad=structuredClone(p);change(job(bad));assert.throws(()=>reload(bad));
    }
    for(const change of [p=>{p.state.simulation.sites[I.site].reservations={};},p=>{p.state.simulation.jobs.push(structuredClone(job(p)));},p=>{p.state.simulation.programs.player={commandId:'reference_gameplay.refine_first',status:'paused'};}]){
        const bad=structuredClone(p);change(bad);assert.throws(()=>reload(bad));
    }
});

test('completed restoration rejects forged result, retry, knowledge attribution and copied foreign receipts',()=>{
    const {done}=outcome('success');for(const change of [p=>facts(p)[P+'applicationAvailable']='true',p=>facts(p)[P+'failedAttempts']=99,
        p=>{const r=receipt(p);r.roll=.99;facts(p)[P+'lastAttempt']=JSON.stringify(r);},p=>{delete p.state.simulation.knowledge.player[P+'success'];},
        p=>{p.state.simulation.knowledge.player[P+'success'].basis.attributedTo='other';},p=>{p.state.actors[I.teacher].facts[P+'applicationAvailable']=true;}]){
        const bad=structuredClone(done);change(bad);assert.throws(()=>reload(bad));
    }
    assert.doesNotThrow(()=>validateCoolingRefinement(done.state,registry));
});

test('each material boundary persists before publication; quota failure preserves original and successful retry publishes exact stock once',()=>{
    const {before,accepted,done}=outcome('success');const applied=refine(done,'reference_gameplay.steady_hook');
    const cancel=cancelSimulationJob(accepted.state,registry,job(accepted).id,ctx(accepted));const failed=outcome('failure');
    for(const [old,plan] of [[opened(),ref(opened(),'reference_gameplay.buy_sleeve')],[before,accepted],[accepted,cancel],[accepted,done],[failed.accepted,failed.done],[done,applied]]){
        const oldCopy=structuredClone(old),bag=Object.fromEntries(Object.entries(old.gameplay.player.inventory).map(([key,count])=>[key,{item:{key},count}]));
        const bytes=JSON.stringify({character:{money:old.external.money},levels:{person:{main_character:{skill_xp:{}}}},inventories:{person:{main_character:structuredClone(bag)}},expansion:old.state});
        let saved=bytes;const publication=prepareOwnershipPublication({player:plan.gameplay.player.inventory},{itemsByOwner:{player:bag},getItem:()=>({})});
        const options={createSave:()=>bytes,key:'source-only',bindings:{player:{category:'person',id:'main_character'}}};
        assert.throws(()=>persistExpansionPlan(plan,{...options,storage:{setItem(){throw Error('quota');}}}),/quota/);
        assert.deepEqual(old,oldCopy);assert.equal(saved,bytes);assert.deepEqual(Object.fromEntries(Object.entries(bag).map(([k,v])=>[k,v.count])),old.gameplay.player.inventory);
        persistExpansionPlan(plan,{...options,storage:{setItem(k,v){saved=v;}}});publication.publish();
        assert.deepEqual(Object.fromEntries(Object.entries(bag).map(([k,v])=>[k,v.count])),plan.gameplay.player.inventory);
        assert.deepEqual(JSON.parse(saved).expansion,plan.state);assert.deepEqual(loadExpansionState(JSON.parse(saved).expansion,registry),plan.state);
        publication.publish();assert.deepEqual(Object.fromEntries(Object.entries(bag).map(([k,v])=>[k,v.count])),plan.gameplay.player.inventory);
    }
});


test('legacy typo basis pending migrates on copied load without altering paid terms or completing early',()=>{
    const accepted=refine(trained()),legacy=structuredClone(accepted);
    for(const e of job(legacy).effects)if(e.type==='knowledge')e.basis.situationId='feature_objects.joint';
    const frozen=structuredClone(legacy),restored=reload(legacy);assert.deepEqual(legacy,frozen);
    assert.deepEqual(restored.state,accepted.state);assert.deepEqual(restored.gameplay,accepted.gameplay);assert.deepEqual(restored.vitals,accepted.vitals);
    const done=advance(restored,3);assert.equal(receipt(done).roll,job(accepted).roll);assert.equal(receipt(done).acceptedAt+3,done.state.clock);
    const corrupt=structuredClone(legacy);job(corrupt).costs[0].amount=0;assert.throws(()=>reload(corrupt));
});


test('source boundary returns all reserved stamina on support loss without changing frozen RNG',()=>{
    const original=trained(),accepted=refine(original),plan=structuredClone(accepted);plan.state.simulation.people.player.body.hands=1;plan.state.clock=job(plan).due;
    advanceSimulationBoundary(plan,registry,{player:ctx(plan)});assert.equal(stock(plan,'player',K.salt),5);
    assert.equal(plan.vitals.player.stamina,original.vitals.player.stamina);assert.equal(facts(plan)[P+'lastAttempt'],undefined);
    assert.equal(plan.state.simulation.seed,accepted.state.simulation.seed);
});

test('paid lesson needs current teacher contact and refinement needs free actual bench',()=>{
    const offered=ref(opened(),'reference_gameplay.buy_sleeve');offered.state.simulation.people[I.teacher].location='Shack';
    assert.throws(()=>ref(offered,'reference_gameplay.learn'));
    for(const change of [p=>{delete p.state.simulation.sites[I.site];},p=>{p.state.simulation.sites[I.site].reservations.fixture=I.teacher;}]){
        const p=trained();change(p);const old=structuredClone(p);assert.throws(()=>refine(p));assert.deepEqual(p,old);
    }
});

test('cooling suppresses actual hook candidate while ordinary guard and jab remain available',()=>{
    const {done}=outcome('success'),applied=refine(done,'reference_gameplay.steady_hook');
    const battle=initializeFeatureBattle(applied.state,registry,{id:'feature_battle.start'},ctx(applied));
    const selected=featureNativeAction(battle.state,ctx(battle),I.hook);assert.equal(selected.technique,'brace');
    battle.state.simulation.people[I.hook].body.can_brace=false;
    assert.equal(featureNativeAction(battle.state,ctx(battle),I.hook).technique,'jab');
    battle.state.simulation.conditions[I.hook][I.field].expiresAt=battle.state.clock;
    assert.equal(featureNativeAction(battle.state,ctx(battle),I.hook).technique,'hook');
});


test('actual battle host initializes combat display before refreshing while syncing fighter state before start',()=>{
    const {done}=outcome('success'),applied=refine(done,'reference_gameplay.steady_hook');
    const battle=initializeFeatureBattle(applied.state,registry,{id:'feature_battle.start'},ctx(applied));
    const calls=[];let liveCombat=null,barsReady=false;
    class MockEnemy {
        constructor(options){this.id=options.id;this.stats={...options.stats};}
        init(){}
        getFullStats(){return this.stats;}
    }
    class MockCombat {
        constructor(options){this.options=options;}
        start(){
            assert.equal(liveCombat,this);assert.equal(barsReady,false);
            const oren=this.options.defenders.find(f=>f.id===I.hook);
            assert.equal(oren.is_alive,true);assert.equal(oren.getFullStats().stamina,battle.state.simulation.people[I.hook].vitals.stamina);
            barsReady=true;calls.push('start');
        }
    }
    const player={name:'Source fixture',getFullStats:()=>({health:100,stamina:100}),getAttackPower:()=>1,getEquipment:()=>({}),
        hasShield:()=>false,getBlockStrength:()=>0,getTotalSkillLevel:()=>0,getStats:()=>({}),getLevelableComponent:()=>({})};
    const host=createFeatureBattleHost({Combat:MockCombat,Enemy:MockEnemy,registry,player,getState:()=>battle.state,getContext:()=>ctx(battle),
        persist:()=>{throw Error('resume must not spend or persist');},getCombat:()=>liveCombat,setCombat:value=>{liveCombat=value;calls.push('set');},
        endCombat:()=>{liveCombat=null;},refresh:()=>{assert.equal(barsReady,true,'refresh requires DOM healthbars created by start');calls.push('refresh');},
        render:()=>{assert.equal(barsReady,true);calls.push('render');},attackersSlot:{},defendersSlot:{}});
    const before=structuredClone(battle);host.resume(featureBattleToken(battle.state));assert.deepEqual(calls,['set','start','refresh','render']);
    assert.equal(host.isRunning(),true);assert.deepEqual(battle,before);
});
