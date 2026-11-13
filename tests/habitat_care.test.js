import test from 'node:test';
import assert from 'node:assert/strict';
import {HABITAT as H,HAY_KEY as hay,WOOL_KEY as wool,planHabitatAction,projectHabitat,habitatFacts,migrateHabitat,validateHabitat} from '../src/habitat_care.js';
import {MEADOW_BAIT_KEY, RABBIT_MEAT_KEY} from '../src/meadow_wildlife.js';
import {creatureHealth, injureCreature} from '../src/creature_lifecycle.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
import {encodeSaveFile,decodeSaveFile,validateSaveEnvelope} from '../src/save_files.js';
const initial=()=>({owner:null,clock:100,money:100,inventory:{},location:H.location,world:H.world,ready:true});
function act(p,action){const q=planHabitatAction(p.owner,action,p),inventory={...p.inventory};for(const {key,amount}of q.items){inventory[key]=(inventory[key]||0)+amount;if(!inventory[key])delete inventory[key];}validateHabitat(q.state,p.clock);return {...p,owner:q.state,money:q.money,inventory};}
const housed=()=>act(act(initial(),'build'),'adopt');
const cared=()=>act(act(act(housed(),'buy_feed'),'feed'),'attend');
test('site and creature are actually paid, unique and bound to suitable player ownership',()=>{
    const p=initial();assert.throws(()=>act(p,'adopt'),/pen/);assert.throws(()=>act({...p,money:17},'build'),/18 coins/);
    const built=act(p,'build');assert.equal(built.money,82);assert.throws(()=>act(built,'build'),/already/);
    const own=act(built,'adopt');assert.equal(own.money,70);assert.equal(own.owner.animal.site,own.owner.site.id);assert.throws(()=>act(own,'adopt'),/already/);
    for(const change of [{ready:false},{location:'Shack'},{world:'pocket.other'}])assert.throws(()=>act({...own,...change},'buy_feed'),/Village/);
});
test('no inherited care, instant harm or stock; feeding spends real inventory once',()=>{
    let p=housed();assert.equal(habitatFacts(p.owner,500).welfare,'Safe in suitable shelter with clean water; she is in full health');assert.equal(projectHabitat(p.owner,500).progress,0);assert.deepEqual(p.inventory,{});
    assert.throws(()=>act(p,'feed'),/actual/);p=act(p,'buy_feed');assert.equal(p.inventory[hay],1);assert.equal(p.money,68);
    p=act(p,'feed');assert.equal(p.inventory[hay],undefined);assert.equal(p.owner.feeds,1);assert.throws(()=>act(p,'feed'),/ration/);
    assert.equal(projectHabitat(p.owner,105).progress,5);assert.throws(()=>act({...p,clock:105},'collect'),/not ready/);
});
// FRC56 changed the gate on purpose: hay grows wool (Stardew's shape); brushing sets the fleece's grade, not whether it grows.
test('brushing alone produces nothing; hay alone grows the batch, in either care order',()=>{
    let b=act(housed(),'attend');assert.equal(projectHabitat(b.owner,130).progress,0);
    for(const order of [['feed','attend'],['attend','feed']]){
        let p=act(housed(),'buy_feed');p=act(p,order[0]);assert.equal(projectHabitat(p.owner,105).progress,order[0]==='feed'?5:0);p=act({...p,clock:102},order[1]);
        const at=order[0]==='feed'?100:102;assert.equal(habitatFacts(p.owner,at+5).ready,false);assert.equal(habitatFacts(p.owner,at+6).ready,true);
        const f=habitatFacts(p.owner,130);assert.equal(f.fed,false);assert.equal(f.attended,false);assert.equal(f.ready,true);assert.match(f.welfare,/Safe/);
        const done=act({...p,clock:130},'collect');assert.equal(done.inventory[wool],5);assert.equal(done.owner.collected,1);assert.throws(()=>act(done,'collect'),/not ready/);
        assert.equal(projectHabitat(done.owner,500).progress,0);assert.equal(projectHabitat(done.owner,500).collected,1);
    }
});
test('partial fed time survives persistence and completes on the same ration',()=>{
    let p=act(housed(),'buy_feed');p=act({...p,clock:108},'feed');
    assert.equal(projectHabitat(p.owner,110).progress,2);
    p.owner=projectHabitat(p.owner,110);p.owner=JSON.parse(JSON.stringify(p.owner));p.clock=110;
    assert.equal(projectHabitat(p.owner,113).progress,5);assert.equal(projectHabitat(p.owner,130).progress,6);
    assert.equal(act({...p,clock:130},'collect').inventory[wool],5);
});
test('save/reload/export-style roundtrip retains pending and collected states without rewards',()=>{
    let p=cared();for(const clock of [103,106]){
        const loaded=JSON.parse(JSON.stringify({...p,clock}));assert.deepEqual(loaded.inventory,p.inventory);assert.equal(habitatFacts(loaded.owner,clock).state.progress,clock-100);
        assert.deepEqual(projectHabitat(loaded.owner,clock),projectHabitat(p.owner,clock));
    }
    p=act({...p,clock:106},'collect');const saved=JSON.stringify(p);const loaded=JSON.parse(saved);
    assert.deepEqual(loaded,p);assert.throws(()=>act(loaded,'collect'));assert.equal(loaded.inventory[wool],5);
    assert.equal(validateHabitat(null),null);assert.equal(projectHabitat(null,100),null);
});
test('malformed ownership, future receipts, unsupported revisions and impossible harvest reject',()=>{
    const p=cared();for(const mutate of [s=>s.schema=2,s=>s.site.owner='stranger',s=>s.site.sheltered=false,s=>s.animal.site='other',s=>s.animal.owner='stranger',s=>s.fedAt=101,s=>s.progress=7,s=>s.collected=2]){
        const bad=structuredClone(p.owner);mutate(bad);assert.throws(()=>validateHabitat(bad,100));
    }
});
test('failed durable publication restores the exact native inventory, purse and care owner',()=>{
    const p=cared(),model={money:p.money,inventory:structuredClone(p.inventory)};let owner=p.owner;
    const before=structuredClone({model,owner});const tx=beginNativeCraftTransaction({owners:[model],bindings:[{get:()=>owner,set:v=>owner=v}]});
    const result=planHabitatAction(owner,'collect',{...p,clock:106});owner=result.state;model.inventory[wool]=5;
    tx.rollback();assert.deepEqual({model,owner},before);assert.equal(tx.status,'rolled-back');
});
test('real native save encoding accepts optional care and leaves old envelopes without it unchanged',()=>{
    const version='v0.5.5.30',old={'game version':version,'current time':{year:999,month:4,day:1,hour:8,minute:0},
        'current location':'Village',character:{name:'Hero',money:102,xp:{total_xp:0},inventory:{},equipment:{}},
        skills:{Literacy:{total_xp:0}},locations:{},activities:{},dialogues:{},traders:{}};
    assert.deepEqual(validateSaveEnvelope(old,version),old);assert.equal(Object.hasOwn(old,'meadow_pen'),false);
    const p=cared(),saved={...old,meadow_pen:p.owner};
    assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(saved)),version),saved);
    saved.meadow_pen.animal.owner='foreign';assert.throws(()=>decodeSaveFile(encodeSaveFile(JSON.stringify(saved)),version),/owned pen/);
});

test('an active legacy meadow save migrates without altering inventory or earned wool', () => {
    const p = cared();
    const legacy = projectHabitat(p.owner, 103);
    delete legacy.lifecycle;
    delete legacy.sheepId;
    const migrated = migrateHabitat(legacy, 103);
    const sheep = migrated.lifecycle.individuals[migrated.sheepId];
    assert.equal(sheep.habitat, H.site);
    assert.equal(sheep.keeper, 'player');
    assert.equal(sheep.health.careUntil, 112);
    assert.equal(migrated.progress, 3);
    assert.equal(legacy.lifecycle, undefined);
    const collected = act({...p, owner: migrated, clock: 106}, 'collect');
    assert.equal(collected.inventory[wool], 5);
    assert.equal(collected.owner.sheepId, migrated.sheepId);
    assert.equal(creatureHealth(collected.owner.lifecycle, migrated.sheepId, 106).careUntil, null);
});

test('paid hay and brushing support recovery on the same persistent sheep', () => {
    const p = housed();
    const {sheepId: id, lifecycle} = p.owner;
    p.owner.lifecycle = injureCreature(lifecycle, {revision: lifecycle.revision, id, clock: p.clock,
        kind: 'cut', recoveryMinutes: 9});
    const fed = act(act(p, 'buy_feed'), 'feed');
    assert.equal(creatureHealth(fed.owner.lifecycle, id, 102).injury.remaining, 9);
    const brushed = act({...fed, clock: 102}, 'attend');
    assert.equal(brushed.owner.lifecycle.individuals[id].experience.player.bond, 1);
    assert.equal(creatureHealth(brushed.owner.lifecycle, id, 108).injury.remaining, 3);
    assert.equal(brushed.inventory[hay], undefined);
});

test('the Village copse exchanges finite prey for meat and keeps the later population outcome', () => {
    const p = act(act(initial(), 'build'), 'survey_copse');
    assert.throws(() => act(p, 'hunt_rabbit'), /Stale bread/);
    const hunted = act({...p, inventory: {[MEADOW_BAIT_KEY]: 1}}, 'hunt_rabbit');
    assert.equal(hunted.inventory[RABBIT_MEAT_KEY], 1);
    assert.equal(hunted.inventory[MEADOW_BAIT_KEY], undefined);
    assert.equal(habitatFacts(hunted.owner, 111).wildlife.foxes, 1);
    const reload = JSON.parse(JSON.stringify(hunted.owner));
    const {rabbits, foxes} = habitatFacts(reload, 112).wildlife;
    assert.deepEqual({rabbits, foxes}, {rabbits: 3, foxes: 0});
    assert.equal(habitatFacts(p.owner, 112).wildlife.foxes, 1);
});

test('an injured ewe recovers before wool and a paid brood yields one saleable lamb', () => {
    let p = act(act(initial(), 'build'), 'rescue_ewe');
    p = act(p, 'extend_pen');
    assert.throws(() => act(p, 'breed_sheep'), /recover/);
    p = act(act(act(p, 'buy_feed'), 'feed'), 'attend');
    assert.equal(habitatFacts(p.owner, 105).wound.remaining, 1);
    // The pen reads the ewe through the shared body read (foundation L, MS5).
    assert.match(habitatFacts(p.owner, 100).welfare, /she is weak$/);
    assert.equal(habitatFacts(p.owner, 105).body.vitality.value, 91, 'one of six minutes still owed');
    assert.match(habitatFacts(p.owner, 106).welfare, /she is in full health$/);
    assert.equal(habitatFacts(p.owner, 106).state.progress, 0);
    assert.equal(habitatFacts(p.owner, 112).ready, true);
    p = act({...p, clock: 112}, 'collect');
    const before = p.money;
    p = act(p, 'breed_sheep');
    assert.equal(p.money, before - H.breedingCost);
    assert.throws(() => act(p, 'breed_sheep'), /expecting/);
    assert.equal(habitatFacts(p.owner, 123).lamb, null);
    const restored = JSON.parse(JSON.stringify(p.owner));
    const {state, lamb} = habitatFacts(restored, 124);
    assert.ok(['cream', 'brown'].includes(lamb.traits.coat));
    assert.deepEqual(lamb.experience, {});
    assert.throws(() => act({...p, owner: restored, clock: 141}, 'sell_lamb'), /time to grow/);
    const sale = act({...p, owner: restored, clock: 142}, 'sell_lamb');
    assert.equal(sale.money, p.money + H.lambPrice);
    assert.equal(sale.owner.lifecycle.individuals[state.lambId].keeper, 'shepherd');
    assert.throws(() => act(sale, 'sell_lamb'), /no lamb/);
    const next = act(sale, 'breed_sheep');
    assert.equal(next.owner.ramId, sale.owner.ramId);
    assert.notEqual(habitatFacts(next.owner, 154).state.lambId, state.lambId);
});

test('a fine-fleece lamb yields a distinct lot only after growing and paid care', () => {
    const fineWool = JSON.stringify({id: 'Fine wool'});
    let p = act(act(housed(), 'extend_pen'), 'breed_sheep');
    assert.throws(() => act({...p, clock: 120}, 'tend_lamb'), /grow/);
    p = {...p, clock: 130};
    assert.equal(habitatFacts(p.owner, p.clock).lamb.traits.fleece, 'fine');
    assert.throws(() => act(p, 'tend_lamb'), /Meadow hay/);
    p = act(act(p, 'buy_feed'), 'tend_lamb');
    assert.equal(p.inventory[hay], undefined);
    assert.throws(() => act({...p, clock: 135}, 'shear_lamb'), /six minutes/);
    const reloaded = JSON.parse(JSON.stringify(p));
    const clipped = act({...reloaded, clock: 136}, 'shear_lamb');
    assert.equal(clipped.inventory[fineWool], 5);
    assert.equal(clipped.inventory[wool], undefined);
    assert.throws(() => act(clipped, 'shear_lamb'), /feed and brush/i);
    assert.throws(() => act(clipped, 'tend_lamb'), /grow back/);
});

test('a fitted construct reserves bread, can recall it, and settles the recipient inventory once', () => {
    const cloth = JSON.stringify({id: 'Wool cloth'});
    const bread = JSON.stringify({id: 'Stale bread'});
    const p = act({...act(initial(), 'build'), inventory: {[bread]: 2, [cloth]: 1}}, 'hire_courier');
    const carrier = p.owner.courier.id;
    assert.throws(() => act(p, 'dispatch_courier'), /too heavy/);
    assert.throws(() => act({...p, inventory: {}}, 'fit_courier'), /Wool cloth/);
    const fitted = act(p, 'fit_courier');
    assert.equal(fitted.inventory[cloth], undefined);
    const dispatched = act(fitted, 'dispatch_courier');
    assert.equal(dispatched.inventory[bread], undefined);
    assert.deepEqual(dispatched.owner.courier.order.parcel, {key: bread, count: 2});
    assert.throws(() => act({...dispatched, clock: 107}, 'receive_courier'), /Wait/);

    const recalled = act({...dispatched, clock: 107}, 'recall_courier');
    assert.equal(recalled.inventory[bread], 2);
    const second = act(recalled, 'dispatch_courier');
    const restored = JSON.parse(JSON.stringify(second));
    const arrived = {...restored, clock: 115};
    assert.throws(() => act(arrived, 'recall_courier'), /at the gate/);
    const delivered = act(arrived, 'receive_courier');
    assert.deepEqual(delivered.owner.courier.recipientStock, {[bread]: 2});
    assert.equal(delivered.owner.courier.order.parcel, undefined);
    assert.equal(delivered.owner.courier.id, carrier);
    assert.equal(delivered.owner.courier.lifecycle.individuals[carrier].habitat, 'village.shepherd_gate');
    assert.equal(delivered.money, second.money + 6);
    assert.throws(() => act(delivered, 'receive_courier'), /Wait/);
});
