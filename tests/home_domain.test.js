import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHomes,quoteHome,executeHome,residenceState,stageResidenceClock,residenceSleepAllowed,projectHomes} from '../src/home_domain.js';
import {advanceSimulation,createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {HOME_CAMPS,HOME_PLACES,HOME_SITE,HOME_WORLD,PACKED_TENT,homeKey} from '../src/home_content.js';
class Availability{constructor({is_unlocked=false}={}){this.is_unlocked=is_unlocked;}getStatus(){return {is_unlocked:this.is_unlocked};}}
class Part{constructor(data={}){this.availability=new Availability(data);this.tiers={cooking:1};}getAvailabilityComponent(){return this.availability;}isUnlocked(){return this.availability.is_unlocked;}}
class Place extends Part{constructor(data={}){super(data);Object.assign(this,data);this.activities={};}}
function setup(itemFactory=key=>JSON.parse(key),work=false){
    const c={world:'base.frontier',location:'Village',clock:0,sequence:0,alive:true,ready:true,fresh:true,money:200,body:{form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},inventory:{},nativeRights:{},wet:false};
    const locations={Village:new Place({name:'Village',is_unlocked:true,crafting:new Part(),connected_locations:[]}),Shack:new Place({name:'Shack',housing:new Part()})};locations.Village.activities.meditating=new Part();
    let paths=0,fail=false,last;
    const registry=work?createContentRegistry({worlds:[{id:HOME_WORLD}]}):null;
    let root=work?createExpansionState(19):null;
    const currentPlan=()=>({state:root,external:{money:c.money},gameplay:{player:{inventory:{...c.inventory},skills:{},reputation:{}}}});
    const calendarAt=clock=>({day_count:4,hour:Math.floor(clock/60),minute:clock%60});
    if(work){c.calendar=calendarAt(0);c.calendarClock=0;}
    const makePlan=minutes=>{
        const {state,external,gameplay}=currentPlan();
        const plan=advanceSimulation(state,registry,minutes,external,gameplay,{player:{actorId:'player',worldId:HOME_WORLD,facts:{location:c.location}}});
        return {...plan,calendar:calendarAt(plan.state.clock)};
    };
    const commit=plan=>{
        stageResidenceClock(plan);last=plan;if(fail)throw Error('Storage failure');
        plan.absorbPublish?.();c.clock=plan.state.clock;c.sequence=plan.state.sequence;c.money=plan.external.money;c.inventory=plan.gameplay.player.inventory;
        if(work){root=plan.state;c.calendar=plan.calendar;c.calendarClock=c.clock;c.location=plan.nativeLocation||c.location;c.ready=!root.simulation?.jobs.some(j=>j.actorId==='player');domainRegistry.refresh();}
    };
    configureHomes({locations,SafeLocation:Place,read:()=>c,assertSpend:()=>{},itemFactory,pathing:()=>paths++,bedAccess:()=>{},effects:()=>{},setForm:()=>{},log:()=>{},
        ...(work?{root:()=>root,registry}:{}),
        plan:work?makePlan:minutes=>({state:{clock:c.clock+minutes,sequence:c.sequence,actors:{player:{worldId:c.world}},simulation:null},external:{money:c.money},gameplay:{player:{inventory:{...c.inventory},skills:{},reputation:{}}}}),
        commit
    });domainRegistry.load({});
    if(work)domainRegistry.initialize();
    return {c,locations,get paths(){return paths;},get last(){return last;},fail:()=>{fail=true;},
        advance:minutes=>commit(makePlan(minutes)),
        save:()=>JSON.stringify(domainRegistry.save({expansion:root,inventory:c.inventory,location:c.location,calendar:c.calendar,money:c.money})),
        restore:bytes=>{
            const envelope=JSON.parse(bytes);
            root=loadExpansionState(envelope.expansion,registry);
            domainRegistry.validate(envelope);
            Object.assign(c,{clock:root.clock,sequence:root.sequence,location:envelope.location,money:envelope.money,
                calendar:envelope.calendar,calendarClock:root.clock,inventory:envelope.inventory,ready:!root.simulation?.jobs.some(j=>j.actorId==='player')});
            domainRegistry.load(envelope);domainRegistry.refresh();
        },
        walk:destination=>{
            const edge=locations[c.location].connected_locations.find(row=>row.location===locations[destination]);
            assert.ok(edge&&edge.location.isUnlocked(),`No route from ${c.location} to ${destination}`);
            c.location=destination;
            if(root.simulation?.people.player)root.simulation.people.player.location=destination;
            commit(makePlan(edge.travel_time));
        }
    };
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

test('native home clock honors offset rain boundary and derives the damaged/protected roof',()=>{
 const r=setup();executeHome(quoteHome({type:'acquire',home:'cottage'}));
 const h=residenceState().properties.cottage;h.condition.integrity=39;h.condition.wetness=10;
 r.c.calendar={day_count:3,hour:23,minute:30};r.c.calendarClock=r.c.clock;
 domainRegistry.refresh();assert.equal(r.locations['Hearthside cottage'].is_under_roof,false);assert.equal(r.locations['Hearthside cottage'].temperature_range_modifier,1);
 const clock=r.c.clock+60,plan={state:{clock,sequence:r.c.sequence,actors:{player:{worldId:r.c.world}}},calendar:{day_count:4,hour:0,minute:30}};
 stageResidenceClock(plan);plan.absorbPublish();r.c.clock=clock;r.c.calendar=plan.calendar;r.c.calendarClock=clock;
 assert.equal(residenceState().properties.cottage.condition.wetness,60);
 const current=residenceState().properties.cottage;current.condition.integrity=40;domainRegistry.refresh();assert.equal(r.locations['Hearthside cottage'].is_under_roof,true);assert.equal(r.locations['Hearthside cottage'].temperature_range_modifier,0.4);
 current.weatherproof=true;domainRegistry.refresh();assert.equal(r.locations['Hearthside cottage'].temperature_range_modifier,0.25);
 assert.doesNotThrow(()=>structuredClone(projectHomes()));
});

test('one paid travel shelter gives rainy-day drying at the camp where it is pitched, including after a mid-build restore',()=>{
 const poles=homeKey('Home fallen poles'),grass=homeKey('Home dry grass'),damp=homeKey('Home damp grass'),kit=homeKey(PACKED_TENT);
 const inside=HOME_PLACES.tent.location;
 const build={type:'build',home:'tent'},work={type:'work',home:'tent'},pack={type:'pack_home',home:'tent'};
 const dry={type:'dry_grass'},pitch={type:'pitch_home'};
 const run=request=>executeHome(quoteHome(request));
 const debit=(quote,key)=>quote.result.items.find(row=>row.key===key)?.amount;
 function start(r){
    run({type:'start',profile:'builder'});
    // Fixture stock: one missing pole, and bundles kept dry before the rain.
    Object.assign(r.c.inventory,{[poles]:1,[grass]:6,[damp]:1});
    const before=r.save();
    assert.match(quoteHome(build).reason,/enough usable owned materials/);
    assert.equal(r.save(),before);
    run({type:'gather',item:'Home fallen poles'});
    const quote=quoteHome(build);
    assert.equal(debit(quote,poles),-2);assert.equal(debit(quote,grass),-6);
    executeHome(quote);
    assert.deepEqual(r.c.inventory,{[damp]:1});
    assert.deepEqual(residenceState().projects.tent.materials,{[poles]:2,[grass]:6});
    assert.match(quoteHome(dry).reason,/sound roof/);
    run(work);r.advance(4);
    const saved=r.save(),job=JSON.parse(saved).expansion.simulation.jobs[0];
    assert.equal(job.commandId,'home.work.tent.build.rain');
    assert.equal(job.due-r.c.clock,6);
    assert.equal(residenceState().properties.tent,undefined);
    assert.equal(r.locations[inside].isUnlocked(),false);
    return saved;
 }
 function finish(r,destination){
    r.advance(6);
    for(let i=0;i<5;i++){run(work);r.advance(10);}
    assert.equal(residenceState().projects.tent,undefined);
    assert.equal(residenceState().properties.tent.anchor,HOME_SITE);
    r.walk(inside);run(pack);
    assert.deepEqual(r.c.inventory,{[damp]:1,[kit]:1});
    if(destination!==HOME_SITE)r.walk(destination);
    const other=HOME_CAMPS.find(camp=>camp!==destination);
    const quote=quoteHome(pitch);
    assert.equal(debit(quote,kit),-1);
    assert.equal(quote.result.minutes,5);
    assert.deepEqual(r.c.inventory,{[damp]:1,[kit]:1});
    executeHome(quote);
    assert.equal(residenceState().properties.tent.anchor,destination);
    assert.equal(r.locations[other].connected_locations.some(edge=>edge.location===r.locations[inside]),false);
    assert.equal(r.locations[destination].connected_locations.some(edge=>edge.location===r.locations[inside]),true);
    assert.match(quoteHome(dry).reason,/sound roof/);
    r.walk(inside);assert.equal(r.locations[inside].is_under_roof,true);
    const use=quoteHome(dry),at=r.c.clock;assert.equal(use.result.minutes,10);
    executeHome(use);
    assert.equal(r.c.clock,at+10);
    assert.deepEqual(r.c.inventory,{[grass]:1});
    assert.equal(residenceState().projects.tent,undefined);
    assert.deepEqual(JSON.parse(r.save()).expansion.simulation.jobs,[]);
    return r.save();
 }
 // Authored siting comparison: the willow camp stands in for a work site near
 // materials and Village for a serviced camp. Both keep the same native rain.
 for(const destination of HOME_CAMPS){
    const uninterrupted=setup(undefined,true),saved=start(uninterrupted);
    const expected=finish(uninterrupted,destination);
    const resumed=setup(undefined,true);resumed.restore(saved);
    assert.equal(resumed.save(),saved);
    assert.equal(finish(resumed,destination),expected);
 }
});
