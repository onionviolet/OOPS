import test from 'node:test';
import assert from 'node:assert/strict';
import {createRiFirstNightBed} from '../src/ri_first_night_bed.js';
import {GU_FIRST_NIGHT_CHOICE as extensionId,GU_FIRST_NIGHT_SLEEP_ACTION as actionId,GU_FIRST_NIGHT_STARTED as started} from '../src/world_packs/book_gu_lead_first_night_choice.js';
const HOME='book.ri.lead.home',WORLD='book.ri.lead.world';
function setup(){
 const c={state:{actors:{player:{worldId:WORLD,facts:{}}},simulation:{people:{player:{life:'alive',location:HOME,body:{id:'body',ownerId:'player',controllerId:'player'}}},jobs:[],knowledge:{player:{}}},pending:[]},record:{packId:'book.ri.lead',worldId:WORLD,bodyId:'body',locationIds:[HOME]},locationId:HOME,nativeAlive:true,writable:true,restoring:false,busy:false,sleeping:false};
 const locations={[HOME]:{id:HOME,name:'Guardians’ house',description:'Your room in the household.',getDescription(){return this.description;}}},availabilities={location:{}},commands=[],logs=[];let creates=0,starts=0,innActivations=0,eligible=true,fail=false,bed;
 const component={unlocked:true};
 const ports={locations,availabilities,read:()=>c,makeHousing:opts=>{creates++;return {...opts,isUnlocked:()=>component.unlocked,getAvailabilityComponent:()=>component};},
  extension:()=>({id:extensionId}),view:()=>({extensions:[{id:extensionId,revision:1,contentHash:'hash',eligible}],actions:[{id:actionId,eligible}]}),
  log:text=>logs.push(text),beginInnRecovery:s=>{assert.equal(s,c.state);innActivations++;},startSleep:()=>{if(bed.prepare()){c.sleeping=true;starts++;}},
  command:r=>{if(fail)throw Error('Saving is unavailable.');commands.push(r);if(r.type==='adopt-extension')c.record.extensions=[{id:extensionId}];else c.state.simulation.knowledge.player[started]={at:10};bed.settled(r);}};
 bed=createRiFirstNightBed(ports);
 return {bed,c,commands,logs,locations,component,ports,get creates(){return creates;},get starts(){return starts;},get innActivations(){return innActivations;},set eligible(v){eligible=v;},set fail(v){fail=v;}};
}
test('real native Sleep activation adopts once, dispatches once and starts native host once',()=>{
 const f=setup();const body=JSON.stringify(f.c.state.simulation.people.player);
 assert.equal(f.bed.prepare(),false,'nested host entry already started; caller must not start twice');
 assert.equal(f.starts,1);assert.equal(f.c.sleeping,true);assert.deepEqual(f.commands.map(r=>r.type),['adopt-extension','action']);
 assert.equal(f.commands[1].id,actionId);assert.equal(JSON.stringify(f.c.state.simulation.people.player),body,'adapter grants no healing, stock or energy');
 f.c.sleeping=false;assert.equal(f.bed.prepare(),true);assert.equal(f.commands.length,2);assert.equal(f.bed.continuing(),true);
});
test('fresh opening and old sleeping restoration do not invent a source recovery marker',()=>{
 const f=setup();f.eligible=false;assert.equal(f.bed.prepare(),true);assert.equal(f.commands.length,0);
 f.c.restoring=true;f.eligible=true;assert.equal(f.bed.prepare(),true);assert.equal(f.commands.length,0);assert.equal(f.c.state.simulation.knowledge.player[started],undefined);
});
test('house/structured/body agreement and scene access are required, with no duplicate bed on return',()=>{
 const f=setup(),housing=f.locations[HOME].housing;
 assert.equal(housing.personal_storage,false);assert.equal(housing.isUnlocked(),true);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='inn';assert.equal(housing.isUnlocked(),false);assert.equal(f.bed.prepare(),false);
 delete f.c.state.actors.player.facts['book.ri.lead.vital.scene'];f.c.state.simulation.people.player.location='academy';assert.equal(f.bed.prepare(),false);
 f.c.state.simulation.people.player.location=HOME;f.c.state.simulation.people.player.body.controllerId='other';assert.equal(f.bed.prepare(),false);
 f.c.state.simulation.people.player.body.controllerId='player';f.component.unlocked=false;assert.equal(f.bed.prepare(),false);f.component.unlocked=true;
 assert.equal(f.locations[HOME].housing,housing);assert.equal(f.creates,1);assert.equal(f.bed.prepare(),false);assert.equal(f.starts,1);
 const again=createRiFirstNightBed(f.ports);assert.equal(again.housing,housing);assert.equal(f.creates,1);
});
test('pending work and failed storage remain intact and cannot silently enter sleep',()=>{
 const f=setup();f.c.state.simulation.jobs=[{id:'pending',actorId:'player',due:50}];const before=JSON.stringify(f.c.state);
 assert.equal(f.bed.prepare(),false);assert.equal(JSON.stringify(f.c.state),before);assert.equal(f.starts,0);assert.equal(f.commands.length,0);
 f.c.state.simulation.jobs=[];f.fail=true;assert.equal(f.bed.prepare(),false);assert.equal(f.starts,0);assert.equal(f.c.sleeping,false);assert.equal(f.commands.length,0);
});
test('loss of bed access stops continuation; unrelated native lives retain their existing sleep path',()=>{
 const f=setup();f.eligible=false;assert.equal(f.bed.prepare(),true);assert.equal(f.bed.continuing(),true);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='inn';assert.equal(f.bed.continuing(),false);
 f.c.state.actors.player.worldId='base.frontier';f.c.record=null;assert.equal(f.bed.prepare(),true);assert.equal(f.bed.continuing(),true);
});

test('scene projection refreshes native actions once per actual change without changing authored ids',()=>{
 const f=setup(),house=f.locations[HOME];let redraws=0;
 const owner=createRiFirstNightBed({...f.ports,refreshLocal:()=>{redraws++;}});
 const id=house.id;owner.refresh();const first=redraws;owner.refresh();assert.equal(redraws,first);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='inn';owner.refresh();
 assert.equal(house.name,'Room at the inn');assert.match(house.getDescription(),/village inn/);
 assert.equal(house.housing.isUnlocked(),false);assert.equal(redraws,first+1);owner.refresh();assert.equal(redraws,first+1);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='home';owner.refresh();
 assert.equal(house.name,'Guardians’ house');assert.equal(house.housing.isUnlocked(),true);assert.equal(house.id,id);assert.equal(f.creates,1);
});

function earnInn(f){
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='inn';
 f.c.state.actors.player.completed={'book.ri.lead.vital.leave':1};
 f.c.record.extensions=[{id:'book.ri.lead.vital',revision:1,contentHash:'paid-v1'}];
}

test('paid inn room uses native housing without charging or activating the household choice',()=>{
 const f=setup();earnInn(f);const before=JSON.stringify(f.c.state),housing=f.locations[HOME].housing;
 assert.equal(housing.isUnlocked(),true);assert.equal(housing.text_to_sleep,'Sleep in your room at the inn');
 assert.equal(housing.personal_storage,false);assert.equal(f.bed.prepare(),true);
 assert.equal(f.innActivations,1);
 assert.equal(f.commands.length,0);assert.equal(JSON.stringify(f.c.state),before);
 assert.equal(f.c.state.simulation.knowledge.player[started],undefined);
 assert.equal(f.bed.continuing(),true);f.c.restoring=true;assert.equal(f.bed.prepare(),true);
 assert.equal(f.innActivations,1,'restore does not initialize or overwrite elapsed recovery');
 assert.equal(f.creates,1);assert.equal(f.bed.continuing(),true);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='grove';
 assert.equal(housing.isUnlocked(),false);assert.equal(f.bed.continuing(),false);
 f.c.state.actors.player.facts['book.ri.lead.vital.scene']='inn';assert.equal(housing.isUnlocked(),true);
 assert.equal(f.creates,1);assert.equal(f.bed.prepare(),true);
});

test('unearned room, worm deposit and remote bodies cannot confer an inn bed',()=>{
 const f=setup();earnInn(f);const housing=f.locations[HOME].housing;
 delete f.c.state.actors.player.completed['book.ri.lead.vital.leave'];
 f.c.state.actors.player.facts['book.ri.lead.vital.worm_custody']='inn_bed';
 assert.equal(housing.isUnlocked(),false);assert.equal(f.bed.prepare(),false);
 f.c.state.actors.player.completed['book.ri.lead.vital.leave']=1;f.c.record.extensions=[];
 assert.equal(housing.isUnlocked(),false);assert.equal(f.bed.prepare(),false);
 earnInn(f);
 for(const scene of ['grove','crevice','academy']){
  f.c.state.actors.player.facts['book.ri.lead.vital.scene']=scene;
  assert.equal(housing.isUnlocked(),false);assert.equal(f.bed.prepare(),false);
 }
 earnInn(f);f.c.state.simulation.people.player.location='academy';assert.equal(f.bed.prepare(),false);
 f.c.state.simulation.people.player.location=HOME;f.c.locationId='academy';assert.equal(f.bed.prepare(),false);
 f.c.locationId=HOME;f.c.state.simulation.people.player.body.id='other';assert.equal(f.bed.prepare(),false);
 assert.equal(f.commands.length,0);
});

test('sleep cannot silently transfer between household and paid room, or bypass pending inn work',()=>{
 const f=setup();f.eligible=false;assert.equal(f.bed.prepare(),true);earnInn(f);
 assert.equal(f.bed.continuing(),false);
 f.c.state.simulation.jobs=[{id:'worm-refinement',actorId:'player',due:400}];
 const before=JSON.stringify(f.c.state);assert.equal(f.bed.prepare(),false);
 assert.equal(JSON.stringify(f.c.state),before);assert.equal(f.commands.length,0);
 assert.equal(f.innActivations,0);
});
