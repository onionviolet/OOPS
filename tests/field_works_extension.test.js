import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldFixture,joinField,completeFieldProject,fieldContext} from '../scripts/field_fixtures.mjs';
import {expeditionRegistry as registry,initializeExpedition} from '../src/expedition_content.js';
import {advanceSimulation,validateExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {WORKS as I,WORKS_KEYS as K} from '../src/field_works_content.js';
import {FIELD_EXTENSION as E,freightOrderId} from '../src/field_works_extension_content.js';
import {fieldWorksFacts,fieldWorksView} from '../src/field_works_facts.js';
import {planHome,validateHomes} from '../src/home_model.js';
import {workerLodgingStatus} from '../src/home_workers.js';
import {isRainingAtMinute} from '../src/weather_calendar.js';
const P=I.prefix,body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
function rig(){
 let p=completeFieldProject(joinField(createFieldFixture()));p.external.money=500;for(const k of ['log','coal','ore','iron','wet','shards','parts','stave'])p.gameplay.player.inventory[K[k]]=30;
 const r={p,homes:null,location:'Shack',calendar:{calendarMinute:480,clock:p.state.clock},context(actor='player'){return {...fieldContext(this.p,this.location),actorId:actor,worldId:I.world,nativeBody:body,nativeAlive:true,nativeReady:true,nativeHomes:this.homes,remainderLivelihoodClock:this.calendar,nativeWeatherClock:this.weather||{minute:this.calendar.calendarMinute,clock:this.calendar.clock},facts:{...fieldContext(this.p,actor==='player'?this.location:this.p.state.simulation.people[actor].location).facts}};},
 command(id){this.p=commitSimulationCommand(this.p.state,registry,{id:id.startsWith(P)?id:P+id},this.context());validateExpansionState(this.p.state,registry);return this;},
 advance(n){const contexts=Object.fromEntries(Object.keys(this.p.state.simulation.people).map(id=>[id,{...this.context(id),vitals:this.context().vitals.player}]));this.p=advanceSimulation(this.p.state,registry,n,this.p.external,this.p.gameplay,contexts);validateExpansionState(this.p.state,registry);return this;},
 run(id){this.command(id);const j=this.p.state.simulation.jobs.find(j=>j.actorId==='player');if(j)this.advance(j.due-this.p.state.clock);return this;},
 reload(){this.p={...structuredClone(this.p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(this.p.state)),registry))};this.homes=JSON.parse(JSON.stringify(this.homes));validateHomes(this.homes,{clock:this.p.state.clock,sequence:this.p.state.sequence});return this;},
 native(k){return this.p.gameplay.player.inventory[K[k]]||0;},held(id,k){return this.p.state.simulation.owners[id][K[k]]||0;},res(k,actor='player'){return this.p.state.actors[actor].resources[P+k]||0;},
 home(request){const c={world:I.world,location:this.location,clock:this.p.state.clock,sequence:this.p.state.sequence,alive:true,ready:true,body,money:this.p.external.money,inventory:this.p.gameplay.player.inventory,workers:this.p.state.simulation.people};const o=planHome(this.homes,request,c);this.homes=o.state;this.p.external.money=o.money;for(const item of o.items)this.p.gameplay.player.inventory[item.key]=(this.p.gameplay.player.inventory[item.key]||0)+item.amount;if(o.minutes)this.advance(o.minutes);return this;},
 };return r.run('begin');
}
const quote=(r,id)=>previewSimulationCommand(r.p.state,registry,id.startsWith(P)?id:P+id,r.context());

test('road freight holds cargo and two endpoint reservations; arrival does not silently give it to the player',()=>{
 const r=rig().command('freight');for(let i=0;i<3;i++)r.command('freight_store_shack_ore');const player=r.native('ore');
 r.command(freightOrderId('shack','ore',3)).advance(1);const job=r.p.state.simulation.jobs.find(j=>j.actorId===E.freighter);assert.equal(job.due-r.p.state.clock,E.roadMinutes);assert.equal(r.held(E.shack,'ore'),0);assert.equal(r.res('storage',E.shack),9);assert.equal(r.res('storage',E.village),9);
 assert.equal(quote(r,freightOrderId('shack','ore',1)).eligible,false);r.reload().advance(10);assert.equal(r.held(E.village,'ore'),3);assert.equal(r.native('ore'),player);assert.equal(r.p.state.simulation.people[E.freighter].location,'Village');assert.equal(r.res('earnedWages',E.freighter),1);
 assert.equal(quote(r,'freight_take_village_ore').eligible,false);r.location='Village';r.command('freight_take_village_ore');assert.equal(r.native('ore'),player+1);assert.equal(r.res('storage',E.village),10);
 r.command(freightOrderId('village','ore',1)).advance(11);assert.equal(r.held(E.shack,'ore'),1);assert.equal(r.p.state.simulation.people[E.freighter].location,'Shack');
});
test('a delayed or paused parcel cannot duplicate funding or overflow a full destination; empty return takes real time',()=>{
 const r=rig().command('freight');r.command('freight_store_shack_coal').command(freightOrderId('shack','coal',1)).advance(11);
 r.command('freight_store_shack_coal').command(freightOrderId('shack','coal',1)).advance(1);let j=r.p.state.simulation.jobs.find(j=>j.actorId===E.freighter);assert.match(j.commandId,/freight_return_village/);assert.equal(j.due-r.p.state.clock,10);r.reload().advance(10);j=r.p.state.simulation.jobs.find(j=>j.actorId===E.freighter);assert.match(j.commandId,/freight_deliver_shack_coal_1/);
 r.command('freight_pause').reload().advance(10);assert.equal(r.held(E.shack,'coal'),1);assert.equal(r.res('freightOrders'),1);assert.equal(r.res('earnedWages',E.freighter),1);const coins=r.p.external.money;r.command('freight_cancel');assert.equal(r.p.external.money,coins+1);assert.throws(()=>r.command('freight_cancel'),/hidden|missing|Insufficient/);
 r.location='Village';for(let i=0;i<11;i++)r.command('freight_store_village_ore');r.location='Shack';assert.equal(quote(r,freightOrderId('shack','coal',1)).eligible,false);
 const corrupt=structuredClone(r.p.state);corrupt.actors[E.village].resources[P+'storage']++;assert.throws(()=>loadExpansionState(corrupt,registry),/receiving space/);
});
test('native rain resets exposed progress even when paused; a real cover protects a retained batch',()=>{
 const r=rig().run('rack');r.calendar={calendarMinute:4*1440-4,clock:r.p.state.clock};r.command('rack_add_3').advance(3);assert.equal(r.res('rackProgress'),2);r.command('rack_pause').reload().advance(1);assert.equal(isRainingAtMinute(4*1440),true);assert.equal(r.res('rackProgress'),0);assert.equal(r.held(E.rack,'wet'),3);
 r.run('rack_cover').command('rack_resume').reload().advance(8);assert.equal(r.held(E.rack,'wet'),0);assert.equal(r.held(E.rack,'dry'),3);const before=r.native('dry');r.command('rack_take_dry');assert.equal(r.native('dry'),before+1);
});
test('adding a wet piece resets the retained batch; long and split weather advances agree exactly',()=>{
 const a=rig().run('rack');a.calendar={calendarMinute:4*1440-8,clock:a.p.state.clock};a.command('rack_add_1').advance(3);assert.equal(a.res('rackProgress'),2);a.command('rack_add_1');assert.equal(a.res('rackProgress'),0);assert.equal(a.held(E.rack,'wet'),2);
 const b=rig();b.p=structuredClone(a.p);b.calendar=structuredClone(a.calendar);a.advance(20);b.advance(4).reload().advance(16);assert.deepEqual(a.p.state,b.p.state);assert.equal(a.held(E.rack,'wet'),2);assert.equal(a.res('rackProgress'),0);
});
function guestRoom(r){r.location='Village';r.home({type:'acquire',home:'cottage'});r.location='Hearthside cottage';r.home({type:'improve',home:'cottage',improvement:'restore'}).home({type:'improve',home:'cottage',improvement:'guestroom'});return r;}
test('worker rooms share actual home occupancy with lodgers, preserve rights and serialize without a second ledger',()=>{
 const r=guestRoom(rig().command('hire_artisan').command('hire_courier'));
 r.home({type:'worker_assign',home:'cottage',worker:I.artisan,shift:'night'});assert.throws(()=>r.home({type:'invite',home:'cottage'}),/houses a worker/);assert.throws(()=>r.home({type:'worker_assign',home:'cottage',worker:I.courier,shift:'day'}),/occupant/);
 r.reload();const damaged=structuredClone(r.homes);damaged.properties.cottage.condition={...damaged.properties.cottage.condition,integrity:20};assert.equal(workerLodgingStatus(damaged,I.artisan,20*60).valid,false);assert.equal(r.homes.workers[I.artisan].shift,'night');assert.equal(workerLodgingStatus(r.homes,I.artisan,8*60).canStart,false);assert.equal(workerLodgingStatus(r.homes,I.artisan,20*60).canStart,true);
 const oldPerson=structuredClone(r.p.state.simulation.people[I.artisan]);r.p.state.simulation.people[I.artisan].life='dead';r.location='Village';r.home({type:'worker_release',home:'cottage',worker:I.artisan});r.p.state.simulation.people[I.artisan]=oldPerson;r.location='Hearthside cottage';r.home({type:'invite',home:'cottage'});assert.throws(()=>r.home({type:'worker_assign',home:'cottage',worker:I.artisan,shift:'night'}),/occupant/);
});
test('human shifts stop new batches but retain accepted work; live room loss refunds reserved stock and wages',()=>{
 const r=guestRoom(rig().command('hire_artisan'));r.home({type:'worker_assign',home:'cottage',worker:I.artisan,shift:'night'});r.location='Shack';r.command('supply_artisan');r.advance(3);assert.equal(r.res('earnedWages',I.artisan),0);
 r.calendar={calendarMinute:6*60-2,clock:r.p.state.clock};r.advance(1);assert.ok(r.p.state.simulation.jobs.some(j=>j.actorId===I.artisan));r.advance(3);assert.equal(r.res('earnedWages',I.artisan),1);r.command('collect_artisan').command('supply_artisan');r.advance(2);assert.equal(r.res('earnedWages',I.artisan),1);
 r.calendar={calendarMinute:20*60,clock:r.p.state.clock};r.advance(1);r.homes.properties.cottage.access=false;r.reload().advance(3);assert.equal(r.res('earnedWages',I.artisan),1);assert.equal(r.held(I.artisan,'stave'),2);assert.equal(r.res('artisanOrders'),2);
});
test('exact missing-component top ups recover partial deliveries without overfilling a held batch',()=>{
 const r=rig().command('hire_artisan').command('supply_artisan').command('pause_artisan').command('recall_artisan_stave');assert.equal(r.held(I.artisan,'stave'),1);assert.equal(quote(r,'supply_artisan').eligible,false);
 r.command('topup_artisan_stave');assert.equal(r.held(I.artisan,'stave'),2);assert.equal(quote(r,'topup_artisan_stave').eligible,false);r.command('resume_artisan').advance(4);assert.equal(r.res('earnedWages',I.artisan),1);
});

test('shipping retained unknown stock preserves material identity and does not grant an observation',()=>{
 const r=rig().command('freight');r.p.gameplay.player.inventory[K.sample]=1;r.command('freight_store_shack_sample').command(freightOrderId('shack','sample',1)).advance(11).reload();
 assert.equal(r.held(E.village,'sample'),1);assert.equal(r.p.state.actors.player.facts[P+'mineralKnown'],undefined);assert.match(fieldWorksView(r.p.state,r.context()).mineral,/not yet characterized/);
});


test('weather day_count stays distinct from the absolute service calendar and unavailable history earns no drying',()=>{
 const r=rig().run('rack');r.command('rack_add_1').advance(3);assert.equal(r.res('rackProgress'),2);
 r.calendar={calendarMinute:999*360*1440+480,clock:r.p.state.clock};r.weather={minute:4*1440,clock:r.p.state.clock};r.advance(1);assert.equal(r.res('rackProgress'),0);assert.equal(fieldWorksView(r.p.state,r.context()).rack.raining,true);
 const c=r.context();delete c.nativeWeatherClock;assert.equal(fieldWorksFacts(r.p.state,c)['fieldWorks.rackSupported'],false);
});
