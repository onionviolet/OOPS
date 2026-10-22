import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHomes,quoteHome,executeHome,residenceState,stageResidenceClock,residenceSleepAllowed,projectHomes} from '../src/home_domain.js';
class Availability{constructor({is_unlocked=false}={}){this.is_unlocked=is_unlocked;}getStatus(){return {is_unlocked:this.is_unlocked};}}
class Part{constructor(data={}){this.availability=new Availability(data);this.tiers={cooking:1};}getAvailabilityComponent(){return this.availability;}isUnlocked(){return this.availability.is_unlocked;}}
class Place extends Part{constructor(data={}){super(data);Object.assign(this,data);this.activities={};}}
function setup(itemFactory=key=>JSON.parse(key)){
    const c={world:'base.frontier',location:'Village',clock:0,sequence:0,alive:true,ready:true,fresh:true,money:200,body:{form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},inventory:{},nativeRights:{},wet:false};
    const locations={Village:new Place({name:'Village',is_unlocked:true,crafting:new Part(),connected_locations:[]}),Shack:new Place({name:'Shack',housing:new Part()})};locations.Village.activities.meditating=new Part();
    let paths=0,fail=false,last;
    configureHomes({locations,SafeLocation:Place,read:()=>c,assertSpend:()=>{},itemFactory,pathing:()=>paths++,bedAccess:()=>{},effects:()=>{},setForm:()=>{},log:()=>{},
        plan:minutes=>({state:{clock:c.clock+minutes,sequence:c.sequence,actors:{player:{worldId:c.world}},simulation:null},external:{money:c.money},gameplay:{player:{inventory:{...c.inventory},skills:{},reputation:{}}}}),
        commit:plan=>{stageResidenceClock(plan);last=plan;if(fail)throw Error('Storage failure');plan.absorbPublish?.();c.clock=plan.state.clock;c.sequence=plan.state.sequence;c.money=plan.external.money;c.inventory=plan.gameplay.player.inventory;}
    });domainRegistry.load({});return {c,locations,get paths(){return paths;},get last(){return last;},fail:()=>{fail=true;}};
}
test('native residence publication refreshes cached paths and persists derived access in the same envelope',()=>{
    const r=setup();executeHome(quoteHome({type:'acquire',home:'cottage'}));assert.equal(r.paths,1);assert.equal(r.locations['Hearthside cottage'].isUnlocked(),true);
    assert.equal(r.last.nativePatch['availabilities/location/Hearthside cottage'],1);assert.equal(r.last.nativePatch['availabilities/location/Hearthside cottage:housing'],1);
    assert.equal(r.locations['Hearthside cottage'].crafting.isUnlocked(),false);assert.equal(r.locations['Hearthside cottage'].crafting.tiers.forging,0);
    assert.equal(r.c.money,120);
});
test('stale quotes and storage failures preserve residence, inventory and currency before publication',()=>{
    const r=setup(),q=quoteHome({type:'acquire',home:'rental'});r.c.money--;assert.throws(()=>executeHome(q),/terms changed/);assert.equal(residenceState(),null);
    r.c.money++;const current=quoteHome({type:'acquire',home:'rental'}),before=structuredClone(r.c);r.fail();assert.throws(()=>executeHome(current),/Storage failure/);assert.deepEqual(r.c,before);assert.equal(residenceState(),null);assert.equal(r.locations['Riverside rented room'].isUnlocked(),false);
});
test('rental expiry revokes sleeping and kitchen services but retains physical retrieval access',()=>{
    const r=setup();executeHome(quoteHome({type:'acquire',home:'rental'}));r.c.location='Riverside rented room';assert.equal(residenceSleepAllowed(),true);
    const plan={state:{clock:1440,sequence:r.c.sequence,actors:{player:{worldId:r.c.world}}}};stageResidenceClock(plan);plan.absorbPublish();r.c.clock=1440;
    domainRegistry.refresh();assert.equal(residenceSleepAllowed(),false);assert.equal(r.locations['Riverside rented room'].isUnlocked(),true);assert.equal(r.locations['Riverside rented room'].housing.isUnlocked(),false);assert.equal(plan.nativePatch['availabilities/location/Riverside rented room:housing'],0);
});

test('home projection remains a serializable public frame rather than exposing weather callbacks',()=>{setup();assert.doesNotThrow(()=>structuredClone(projectHomes()));assert.equal(projectHomes().context.weatherAt,undefined);});

test('restored projects validate their held native material keys before publication',()=>{
 const seen=[];setup(key=>{seen.push(key);if(JSON.parse(key).id==='Unregistered project material')throw Error('Unknown native item');return JSON.parse(key);});
 const homes={schema:1,revision:1,start:null,primary:null,properties:{},lodger:null,beginning:false,ledger:[],projects:{shelter:{home:'shelter',kind:'build',at:0,required:40,materials:{'{"id":"Unregistered project material"}':1}}}};
 assert.throws(()=>domainRegistry.validate({homes,expansion:{clock:0,sequence:0}}),/Unknown native item/);assert.deepEqual(seen,['{"id":"Unregistered project material"}']);
});
