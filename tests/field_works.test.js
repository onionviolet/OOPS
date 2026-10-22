import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldFixture,joinField,completeFieldProject,fieldContext} from '../scripts/field_fixtures.mjs';
import {expeditionRegistry as registry,initializeExpedition} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState,validateExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob,setSimulationProgram,resumeSimulationProgram} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {WORKS as I,WORKS_KEYS as K,resolveFieldCeramic,fieldSequenceId} from '../src/field_works_content.js';
import {fieldWorksFacts,fieldWorksView,validateFieldWorksState,fieldWorksBodySupported} from '../src/field_works_facts.js';
import {previewFieldWorksCommand} from '../src/field_works_projection.js';
const P=I.prefix;
const body={id:'native.person.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const context=p=>({...fieldContext(p,'Shack'),nativeBody:body,nativeAlive:true,nativeReady:true,worldId:I.world});
const advance=(p,n)=>{const c=context(p);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});validateExpansionState(out.state,registry);return out;};
const command=(p,id)=>{const out=commitSimulationCommand(p.state,registry,{id:id.startsWith(P)?id:P+id},context(p));validateExpansionState(out.state,registry);return out;};
const run=(p,id)=>{const out=command(p,id),job=out.state.simulation.jobs.find(j=>j.actorId==='player');return job?advance(out,job.due-out.state.clock):out;};
const reload=p=>({...structuredClone(p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry))});
const amount=(p,k)=>p.gameplay.player.inventory[K[k]]||0;
const resource=(p,k)=>p.state.actors.player.resources[P+k]||0;
function fixture(){
    let p=completeFieldProject(joinField(createFieldFixture()));p.external.money=200;
    for(const k of ['log','coal','ore','iron','belmart','golmoon'])p.gameplay.player.inventory[K[k]]=30;
    return run(p,'begin');
}
function garden(p=fixture()) {for(const id of ['gather_clay','shape','dry','fire','gather_clay','shape','wet_fire','garden'])p=run(p,id);return p;}
const fill=p=>run(run(p,'grow_variety'),'grow_variety');
const drive=p=>run(p,'drive');

test('optional setup creates only paid owned fixtures; pre-existing saves remain absent',()=>{
    const old=completeFieldProject(joinField());const copy=reload(old);assert.equal(fieldWorksView(copy.state),null);
    assert.equal(copy.state.simulation.people[I.spirit],undefined);assert.equal(copy.state.simulation.sites[I.bench],undefined);
    const before=structuredClone(old);for(let i=0;i<3;i++){fieldWorksFacts(old.state,context(old));fieldWorksView(old.state);previewSimulationCommand(old.state,registry,P+'begin',context(old));}assert.deepEqual(old,before);
    const p=run(old,'begin');assert.equal(p.external.money,old.external.money-3);assert.equal(amount(p,'log'),amount(old,'log')-2);assert.equal(amount(p,'empty'),2);assert.equal(resource(p,'space'),12);
    assert.throws(()=>command(p,'begin'),/already|missing|hidden/);
});
test('ceramic laws retain real stages, wrong-order fragments and irreversible fired material',()=>{
    let p=fixture();p=run(p,'gather_clay');p=run(p,'shape');const wet=amount(p,'wet');
    let pending=command(p,'dry');const job=pending.state.simulation.jobs.find(j=>j.actorId==='player');
    pending=reload(pending);pending=cancelSimulationJob(pending.state,registry,job.id,context(pending));assert.equal(amount(pending,'wet'),wet);assert.equal(amount(pending,'clay'),amount(p,'clay'));
    p=run(pending,'dry');p=run(p,'rewet');assert.ok(amount(p,'clay')>0);p=run(p,'shape');p=run(p,'wet_fire');assert.equal(amount(p,'shards'),1);
    p=run(run(run(run(p,'gather_clay'),'shape'),'dry'),'fire');assert.equal(amount(p,'fired'),1);assert.throws(()=>command(p,'rewet'),/Insufficient|hidden/);
    assert.equal(resolveFieldCeramic(['shape','dry','fire'],'strong').output,'fired');assert.equal(resolveFieldCeramic(['shape','fire'],'strong').output,'shards');assert.equal(resolveFieldCeramic(['shape','dry','fire'],'gentle').output,'dry');
});
test('hand-work follows actual controlled means; losing them before completion returns unperformed stock',()=>{
    let p=fixture();const c=context(p);assert.equal(fieldWorksBodySupported(p.state,{...c,nativeBody:{...body,form:'construct',mobile:false}}),true);
    assert.equal(fieldWorksBodySupported(p.state,{...c,nativeBody:{...body,controllerId:'other'}}),false);
    p=run(run(run(p,'gather_clay'),'shape'),'dry');const before=structuredClone(p);p=command(p,'fire');
    const unsupported={...context(p),nativeBody:{...body,hands:0}};p=advanceSimulation(p.state,registry,3,p.external,p.gameplay,{player:{...unsupported,vitals:unsupported.vitals.player}});
    validateFieldWorksState(p.state);assert.equal(amount(p,'dry'),amount(before,'dry'));assert.equal(amount(p,'coal'),amount(before,'coal'));assert.equal(amount(p,'fired'),0);
});
test('reservoir reserves incoming and outgoing capacity; full beds consume no stock and idle has no output',()=>{
    let p=fill(garden()),before=structuredClone(p);assert.equal(resource(p,'mana'),12);assert.equal(resource(p,'space'),0);
    const q=previewSimulationCommand(p.state,registry,P+'grow_ember',context(p));assert.equal(q.eligible,false);assert.deepEqual(p,before);
    assert.throws(()=>command(p,'grow_ember'),/Insufficient/);p=advance(p,20);assert.equal(amount(p,'coal'),amount(before,'coal'));assert.equal(resource(p,'mana'),12);
    p=command(p,'bind_spirit');assert.equal(resource(p,'mana'),10);assert.equal(resource(p,'space'),0);validateFieldWorksState(p.state);
    p=advance(reload(p),2);assert.equal(resource(p,'space'),2);assert.ok(p.state.simulation.people[I.spirit]);
});
test('ordered learned techniques share a resolver with finite queues; modifiers change cost and output',()=>{
    let p=fill(garden());for(const id of ['composition','learn_shape','learn_dry','learn_fire','gather_clay','gather_clay'])p=run(p,id);
    const id=fieldSequenceId(['shape','dry','fire'],'strong'),pre=structuredClone(p);previewSimulationCommand(p.state,registry,id,context(p));assert.deepEqual(p,pre);
    p=run(p,id);assert.equal(amount(p,'fired'),1);assert.equal(resource(p,'mana'),9);
    p=run(p,fieldSequenceId(['shape','dry','fire'],'gentle'));assert.equal(amount(p,'dry'),1);assert.equal(resource(p,'mana'),8);
    p=run(p,fieldSequenceId(['shape','fire'],'strong'));assert.equal(amount(p,'shards'),1);assert.equal(resource(p,'mana'),5);
    p=setSimulationProgram(p.state,registry,id,3,context(p));p=advance(p,15);assert.equal(p.state.simulation.programs.player.status,'paused');assert.ok(p.state.simulation.programs.player.remaining>0);
    const before=resource(p,'mana');p=advance(reload(p),10);assert.equal(resource(p,'mana'),before);
});
test('unknown samples act before observation and stay the same actual item after identification',()=>{
    let p=garden();p=run(p,'gather_clay');p=run(run(p,'sift'),'sift');assert.equal(amount(p,'sample'),2);
    assert.equal(fieldWorksView(p.state).mineral.includes('not yet characterized'),true);p=run(p,'prepare_charge');p=run(p,'smelt');assert.equal(p.state.actors.player.facts[P+'mineralKnown'],undefined);
    p=run(p,'grow_ember');const sample=amount(p,'sample');p=run(p,'observe');assert.equal(amount(p,'sample'),sample);assert.equal(p.state.actors.player.facts[P+'mineralKnown'],true);
    const minerals=fieldWorksView(p.state).mineral;assert.notEqual(minerals,'');p=run(p,'known_charge');assert.equal(amount(p,'sample'),0);assert.equal(amount(p,'charge'),1);
});
test('powered jobs and wisp share drive load; full trays block work; collection and support-loss settle once',()=>{
    let p=drive(fill(garden()));p=run(p,'bind_spirit');p=command(p,'assign_spirit_3');p=command(p,'supply_spirit');p=advance(p,1);
    assert.equal(resource(p,'drive'),1);assert.equal(p.state.simulation.jobs.some(j=>j.actorId===I.spirit),true);
    const preview=previewFieldWorksCommand(p.state,registry,P+'press',context(p));assert.equal(preview.eligible,false);assert.match(preview.reasons.join(' '),/Drive needs 2/);
    p=command(p,'mill');assert.equal(resource(p,'drive'),0);p=advance(reload(p),4);assert.equal(resource(p,'drive'),2);assert.equal(amount(p,'staves'),1);assert.equal(p.state.simulation.owners[I.spirit][K.staves],1);
    assert.equal(previewSimulationCommand(p.state,registry,P+'mill',context(p)).eligible,false);
    p=command(p,'collect_staves');p=command(p,'collect_spirit');assert.equal(amount(p,'empty'),2);assert.equal(amount(p,'stave'),4);
    p=command(p,'supply_spirit');p=advance(p,1);p=command(p,'disconnect');p=advance(reload(p),4);assert.equal(resource(p,'drive'),2);assert.equal(p.state.simulation.owners[I.spirit][K.empty],1);assert.equal(p.state.simulation.owners[I.spirit][K.staves],undefined);
    const refunded=structuredClone(p);p=advance(p,8);assert.equal(amount(p,'coal'),amount(refunded,'coal'));assert.equal(resource(p,'drive'),2);
});
test('wisp rank has actual cost and duration; pause keeps orders and permits exact stock recovery',()=>{
    let p=drive(fill(garden()));p=run(p,'bind_spirit');p=run(p,'rank_spirit');assert.equal(resource(p,'mana'),6);
    p=command(p,'assign_spirit_1');p=command(p,'supply_spirit');p=advance(p,1);const job=p.state.simulation.jobs.find(j=>j.actorId===I.spirit);assert.equal(job.due-p.state.clock,2);
    p=command(p,'pause_spirit');p=advance(reload(p),2);assert.equal(resource(p,'spiritOrders'),1);assert.equal(p.state.simulation.owners[I.spirit][K.log],1);assert.equal(resource(p,'mana'),6);
    const log=amount(p,'log');p=command(p,'recall_spirit_log');assert.equal(amount(p,'log'),log+1);p=command(p,'recall_spirit_coal');p=command(p,'recall_spirit_empty');
    p=command(p,'supply_spirit');p=command(p,'resume_spirit');p=advance(p,3);assert.equal(resource(p,'spiritOrders'),0);assert.equal(p.state.simulation.owners[I.spirit][K.staves],1);
});
test('fitter requests consume exact delivered supplies, block duplicates, retain output and refund unearned wages',()=>{
    let p=drive(fixture());p=run(p,'mill');p=command(p,'collect_staves');p=run(p,'press');p=command(p,'collect_fittings');const money=p.external.money;
    p=command(p,'hire_artisan');assert.equal(p.external.money,money-3);assert.match(fieldWorksView(p.state).artisan.status,/Requests two/);
    p=command(p,'supply_artisan');assert.throws(()=>command(p,'supply_artisan'),/missing|hidden|required/);
    p=advance(p,4);assert.equal(p.state.simulation.owners[I.artisan][K.kits],1);assert.equal(fieldWorksView(p.state).artisan.earned,1);assert.equal(resource(p,'artisanOrders'),2);
    p=advance(reload(p),10);assert.equal(fieldWorksView(p.state).artisan.earned,1);p=command(p,'collect_artisan');assert.equal(amount(p,'kit'),2);assert.equal(amount(p,'empty'),2);
    p=command(p,'pause_artisan');p=command(p,'refund_artisan_2');assert.equal(p.external.money,money-1);assert.equal(resource(p,'artisanOrders'),0);assert.equal(fieldWorksView(p.state).artisan.wages,0);
    assert.throws(()=>command(p,'refund_artisan_2'),/missing|hidden/);
});
test('save round trips preserve pending stock/load/energy and failed storage publishes nothing',()=>{
    let p=drive(fill(garden()));p=run(p,'composition');for(const s of ['shape','dry','fire'])p=run(p,'learn_'+s);p=run(p,'gather_clay');
    p=command(p,fieldSequenceId(['shape','dry','fire'],'strong'));
    const before=structuredClone(p);let writes=0;
    assert.throws(()=>persistExpansionPlan(p,{createSave:()=>JSON.stringify({character:{money:p.external.money},inventories:{person:{main_character:{},oldCraftsman:{}}},levels:{person:{main_character:{skill_xp:{}},oldCraftsman:{skill_xp:{}}}},reputation:{Village:0}}),
        bindings:{player:{category:'person',id:'main_character'},oldCraftsman:{category:'person',id:'oldCraftsman'}},key:'proof',storage:{setItem(){writes++;throw new Error('disk full');}}}),/disk full/);assert.equal(writes,1);assert.deepEqual(p,before);
    const full=advance(reload(p),3),split=advance(reload(advance(reload(p),1)),2);assert.deepEqual(full.state,split.state);assert.deepEqual(full.gameplay,split.gameplay);
    const bad=structuredClone(p.state);bad.actors.player.resources[P+'space']++;assert.throws(()=>loadExpansionState(bad,registry),/reservoir/);
    const rank=structuredClone(p.state);rank.actors.player.facts[P+'version']=99;assert.throws(()=>loadExpansionState(rank,registry),/edition/);
});

test('selected substrates and batch sizes retain each workpiece and exact reserved energy on cancellation',()=>{
    let p=fill(garden());for(const id of ['composition','learn_shape','learn_dry','learn_fire','gather_clay','gather_clay','shape','shape','shape'])p=run(p,id);
    const id=fieldSequenceId(['dry','fire'],'strong','wet',3),before=structuredClone(p);p=command(p,id);
    assert.equal(resource(p,'mana'),3);assert.equal(amount(p,'wet'),0);
    const job=p.state.simulation.jobs.find(j=>j.actorId==='player');p=reload(p);p=cancelSimulationJob(p.state,registry,job.id,context(p));
    assert.equal(resource(p,'mana'),resource(before,'mana'));assert.equal(amount(p,'wet'),3);
    p=run(p,id);assert.equal(amount(p,'fired'),3);assert.equal(amount(p,'wet'),0);assert.equal(resource(p,'mana'),3);
    const coal=amount(p,'coal'),logs=amount(p,'log');p=run(p,'charcoal');assert.equal(amount(p,'fired'),3);assert.equal(amount(p,'coal'),coal+2);assert.equal(amount(p,'log'),logs-2);
});

test('tended beds spend finite actual care and stock; demonstrated smelting shortcut needs both observations',()=>{
    let p=garden();p=run(p,'tend_garden');assert.equal(resource(p,'gardenCare'),3);assert.throws(()=>command(p,'tend_garden'),/missing|hidden|required/);
    p=run(p,'grow_tended');p=run(p,'grow_tended');assert.equal(resource(p,'gardenCare'),1);assert.equal(resource(p,'mana'),12);
    assert.equal(previewSimulationCommand(p.state,registry,P+'grow_tended',context(p)).eligible,false);
    p=run(run(p,'gather_clay'),'sift');assert.equal(previewSimulationCommand(p.state,registry,P+'recorded_smelt',context(p)).visible,false);
    p=run(p,'observe');assert.equal(previewSimulationCommand(p.state,registry,P+'recorded_smelt',context(p)).visible,false);
    p=run(run(p,'prepare_charge'),'smelt');p=run(run(p,'gather_clay'),'sift');const iron=amount(p,'iron'),ore=amount(p,'ore'),coal=amount(p,'coal');
    p=run(p,'recorded_smelt');assert.equal(amount(p,'iron'),iron+1);assert.equal(amount(p,'ore'),ore-1);assert.equal(amount(p,'coal'),coal-1);
});

function deliveryFixture(){
    let p=fixture();p=command(p,'hire_artisan');p=command(p,'hire_courier');
    p.gameplay.player.inventory[K.stave]=4;p.gameplay.player.inventory[K.parts]=2;
    for(const k of ['stave','stave','parts','empty'])p=command(p,'stock_depot_'+k);
    return p;
}
test('scheduled depot delivery reserves cargo and recipient; reload cannot duplicate a promised batch or payment',()=>{
    let p=deliveryFixture(),money=p.external.money;p=advance(p,1);
    const job=p.state.simulation.jobs.find(j=>j.actorId===I.courier);assert.equal(job.commandId,P+'courier_supply_artisan');
    assert.equal(p.state.simulation.owners[I.courier][K.stave],undefined);assert.equal(p.state.simulation.owners[I.artisan][K.stave],undefined);
    assert.equal(fieldWorksFacts(p.state,context(p))['fieldWorks.artisanNeedsSupply'],false);
    assert.equal(previewSimulationCommand(p.state,registry,P+'supply_artisan',context(p)).eligible,false);
    p=advance(reload(p),2);assert.equal(fieldWorksView(p.state).courier.earned,1);
    p=advance(p,3);assert.equal(fieldWorksView(p.state).artisan.earned,1);assert.equal(fieldWorksView(p.state).courier.earned,1);
    p=advance(reload(p),2);assert.equal(amount(p,'kit'),2);assert.equal(amount(p,'empty'),2);assert.equal(fieldWorksView(p.state).courier.earned,2);assert.equal(p.external.money,money);
    p=advance(reload(p),15);assert.equal(amount(p,'kit'),2);assert.equal(fieldWorksView(p.state).courier.earned,2);
    p=command(p,'pause_courier');p=command(p,'refund_courier_1');assert.equal(p.external.money,money+1);assert.throws(()=>command(p,'resume_courier'),/missing|hidden|required/);
});
test('pausing an in-flight handcart returns its reserved cargo and wages exactly once',()=>{
    let p=deliveryFixture();p=advance(p,1);p=command(p,'pause_courier');p=advance(reload(p),2);
    assert.equal(fieldWorksView(p.state).courier.earned,0);assert.equal(resource(p,'courierOrders'),3);assert.equal(fieldWorksView(p.state).courier.wages,3);
    assert.equal(p.state.simulation.owners[I.courier][K.stave],2);assert.equal(p.state.simulation.owners[I.artisan][K.stave],undefined);
    const before=structuredClone(p);p=advance(reload(p),10);assert.deepEqual(p.state.simulation.owners,before.state.simulation.owners);
    p=command(p,'recall_courier_stave');p=command(p,'recall_courier_stave');assert.equal(amount(p,'stave'),4);
    p=command(p,'refund_courier_3');assert.equal(fieldWorksView(p.state).courier.wages,0);
});
test('paused wisp orders can be withdrawn without deleting held supplies or reissuing spent work',()=>{
    let p=fill(garden());p=run(p,'bind_spirit');p=command(p,'assign_spirit_3');p=command(p,'supply_spirit');p=command(p,'pause_spirit');
    p=command(p,'withdraw_spirit');assert.equal(resource(p,'spiritOrders'),0);assert.equal(p.state.simulation.owners[I.spirit][K.log],1);
    assert.equal(previewSimulationCommand(p.state,registry,P+'resume_spirit',context(p)).visible,false);p=command(p,'recall_spirit_log');assert.equal(p.state.simulation.owners[I.spirit][K.log],undefined);
});
