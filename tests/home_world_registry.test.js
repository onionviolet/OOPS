// W3a S1: a world registers homes, furniture and rooms into the home engine's own tables; native loops never see them, and a save
// holding a world home validates on load (registration runs at import, before restore).
import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHomeWorld, nativeHomeEntries, nativeFurnitureValues, nativeRoomEntries, HOME_PLACES, DOMICILE_FURNITURE, homeKey, homeWorlds} from '../src/home_content.js';
import {validateHomes, emptyHomes, homeAt, homeCapacity} from '../src/home_model.js';

const W = 'test.homeworld';
const nativeBefore = nativeHomeEntries().map(([id]) => id);
registerHomeWorld({worldId: W,
    places: {[`${W}.flat`]: {name: 'A rented flat', location: `${W}.place.flat`, tenure: 'rented', owner: `${W}.landlady`, price: 0, forms: ['human'], capacity: 6, description: 'Two rooms up a stair.'}},
    furniture: {[`${W}.cot`]: {name: 'Folding cot', slot: 'bed', price: 3, forms: ['human'], effects: {rest: 1.02}, description: 'A narrow cot.'},
        [`${W}.crate`]: {name: 'Tea crate', slot: 'box', price: 1, forms: ['human'], effects: {storage: 4}, description: 'An old crate with a lid.'}},
    rooms: {[`${W}.nook`]: {name: 'Curtain off a nook', minutes: 20, capacity: 2}}});

test('registered rows join the lookup tables but never the native loops', () => {
    assert.ok(HOME_PLACES[`${W}.flat`].registered);
    assert.equal(HOME_PLACES[`${W}.flat`].world, W);
    assert.deepEqual(nativeHomeEntries().map(([id]) => id), nativeBefore);
    assert.ok(!nativeFurnitureValues().some(f => f.world === W));
    assert.ok(!nativeRoomEntries().some(([id]) => id.startsWith(W)));
    assert.ok(homeWorlds().includes(W));
});

test('ids must be namespaced, native ids and the native world are refused', () => {
    assert.throws(() => registerHomeWorld({worldId: 'base.frontier'}), /own world id/);
    assert.throws(() => registerHomeWorld({worldId: 'test.other', places: {cottage: {}}}), /namespaced/);
    assert.throws(() => registerHomeWorld({worldId: 'test.other', furniture: {'test.other.x': {name: 'X'}}}), /furniture needs/);
});

test('failure scenario: a save holding a world home validates, finds the home by its world and location, and counts its furniture', () => {
    const flat = {id: `${W}.flat`, name: 'A rented flat', tenure: 'rented', owner: `${W}.landlady`, access: true, acquiredAt: 0, paidUntil: null,
        stock: {[homeKey('bread')]: 2}, fixtures: {bed: {key: homeKey(`${W}.cot`), owner: 'player'}, box: {key: homeKey(`${W}.crate`), owner: 'player'}}, improvements: []};
    const s = {...emptyHomes(), primary: flat.id, properties: {[flat.id]: flat}};
    const restored = JSON.parse(JSON.stringify(s));
    assert.doesNotThrow(() => validateHomes(restored, {clock: 10}));
    assert.equal(homeAt(restored, {world: W, location: `${W}.place.flat`})?.id, flat.id);
    assert.equal(homeCapacity(restored.properties[flat.id]), 10);
    // A renter may not make structural changes (the engine's own tenure rule applies to world homes too).
    restored.properties[flat.id].improvements = [`${W}.nook`];
    assert.throws(() => validateHomes(restored, {clock: 10}), /unauthorized structural improvement/);
});

test('S2: a world home is taken up at itself by its own life, with the landlord’s furniture; the world’s seller sells in its own coin', async () => {
    const {planHome} = await import('../src/home_model.js');
    registerHomeWorld({worldId: 'test.s2', furniture: {'test.s2.bed': {name: 'Iron bed', slot: 'bed', price: 0, forms: ['human'], effects: {}, description: 'The landlady’s bed.'},
        'test.s2.rug': {name: 'Rag rug', slot: 'blanket', price: 9, forms: ['human'], effects: {}, description: 'A rug.', soldAt: ['test.s2.market']}},
        places: {'test.s2.flat': {name: 'Flat', location: 'test.s2.home', tenure: 'rented', owner: 'test.s2.landlady', price: 0, forms: ['human'], capacity: 6, description: 'A flat.', startsHere: true, furnished: ['test.s2.bed']}}});
    const c = (location, money = 20) => ({world: 'test.s2', location, clock: 100, sequence: 1, alive: true, ready: true, writable: true, money, inventory: {}, body: {ownerId: 'player', controllerId: 'player', form: 'human', hands: 2, mobile: true}, nativeRights: {}});
    assert.throws(() => planHome(emptyHomes(), {type: 'settle_world_home', home: 'test.s2.flat'}, c('test.s2.market')), /not a home you can take up here/);
    const r = planHome(emptyHomes(), {type: 'settle_world_home', home: 'test.s2.flat'}, c('test.s2.home'));
    assert.equal(r.state.primary, 'test.s2.flat');
    assert.deepEqual(r.state.properties['test.s2.flat'].fixtures.bed, {key: homeKey('test.s2.bed'), owner: 'test.s2.landlady'});
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, c('test.s2.home')), /buy this where it is sold/);
    const bought = planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, c('test.s2.market'));
    assert.equal(bought.money, 11);
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, {...c('test.s2.market'), world: 'test.homeworld'}), /buy this where it is sold/);
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'Home plain bed'}, c('test.s2.market')), /Village home supplier/);
});

test('a world names its own money in the engine\u2019s refusals; the Village keeps coins', async () => {
    const {homeMoneyWord} = await import('../src/home_content.js');
    await import('../src/lotm_home_world.js');
    assert.equal(homeMoneyWord('book.lotm.tingen'), 'pence');
    assert.equal(homeMoneyWord('base.frontier'), 'coins');
    assert.throws(() => registerHomeWorld({worldId: 'test.money', money: 'Pence!'}), /short plain word/);
});

test('world improvements use their actual home, materials and tenure; a renter can hang removable furnishings', async()=>{
 const {planHome}=await import('../src/home_model.js');
 const {LOTM_FLAT_HOME,LOTM_FLAT_PLACE,LOTM_HOME_ROOMS}=await import('../src/lotm_home_world.js');
 const c={world:'book.lotm.tingen',location:LOTM_FLAT_PLACE,clock:100,sequence:1,alive:true,ready:true,writable:true,money:0,inventory:{},body:{ownerId:'player',controllerId:'player',form:'human',hands:2,mobile:true},nativeRights:{}};
 const s=planHome(emptyHomes(),{type:'settle_world_home',home:LOTM_FLAT_HOME},c).state;
 const [id,room]=Object.entries(LOTM_HOME_ROOMS)[0];
 assert.throws(()=>planHome(s,{type:'improve',improvement:id},c),/materials/);
 const built=planHome(s,{type:'improve',improvement:id},{...c,inventory:{...room.materials}});
 assert.equal(built.minutes,15);assert.equal(built.state.properties[LOTM_FLAT_HOME].tenure,'rented');
 assert.deepEqual(built.items,Object.entries(room.materials).map(([key,n])=>({key,amount:-n})));
 assert.doesNotThrow(()=>validateHomes(JSON.parse(JSON.stringify(built.state)),{clock:100}));
 assert.throws(()=>planHome(built.state,{type:'improve',improvement:id},c),/unfinished/);
 assert.throws(()=>planHome(s,{type:'improve',improvement:id},{...c,location:'elsewhere'}),/actual residence/);
});

test('a tied-person purchase retains title and one balance through cash, loan and installments',async()=>{
 const {planHome}=await import('../src/home_model.js');
 const {homePurchaseRows}=await import('../src/home_purchase.js');
 const W='test.deal',H=W+'.house',SELLER=W+'.owner';
 registerHomeWorld({worldId:W,money:'pence',places:{[H]:{name:'Fixture house',startsHere:true,period:10,location:W+'.door',tenure:'rented',owner:SELLER,forms:['human'],capacity:8,price:100,listedAt:[W+'.office'],description:'A house offered by its holder.',purchase:{seller:SELLER,price:100,tie:{kind:'trust',atLeast:2,reason:'The seller needs to know you first.'},loan:{deposit:10,interest:5,period:100,installment:20,creditor:W+'.lender'},installments:{deposit:20,period:100,installment:20}}}}});
 const c={world:W,location:W+'.office',clock:100,sequence:1,alive:true,ready:true,writable:true,money:100,inventory:{},body:{ownerId:'player',controllerId:'player',form:'human',hands:2,mobile:true},nativeRights:{},relationships:{[SELLER]:{player:{axes:{'tie.trust':2}}}}};
 assert.throws(()=>planHome(emptyHomes(),{type:'acquire',home:H},{...c,relationships:{}}),/know you/);
 for(const method of ['cash','loan','installments']){
  const buy=planHome(emptyHomes(),{type:'acquire',home:H,method},c),h=buy.state.properties[H];
  assert.equal(h.owner,'player');assert.equal(h.tenure,'owned');
  const loaded=JSON.parse(JSON.stringify(buy.state));assert.doesNotThrow(()=>validateHomes(loaded,{clock:100}));
  assert.equal(homePurchaseRows(loaded).length,method==='cash'?0:1);
  if(method!=='cash'){const row=homePurchaseRows(loaded)[0];assert.equal(row.unit.many,'pence');assert.equal(row.creditorLabel,method==='loan'?'the lender':'the seller');assert.equal(homePurchaseRows(loaded,{clock:200,displayClock:1000})[0].since,900);}
  if(method!=='cash'){
   const old=h.purchase.balance,paid=planHome(loaded,{type:'repay_purchase',home:H,amount:20},c);
   assert.equal(paid.state.properties[H].purchase.balance,old-20);assert.equal(paid.money,80);
   assert.equal(homePurchaseRows(paid.state)[0].amount,old-20);
   assert.throws(()=>planHome(loaded,{type:'repay_purchase',home:H,amount:20},{...c,money:0}),/not enough/);
  }
 }
 const renting=planHome(emptyHomes(),{type:'settle_world_home',home:H},{...c,location:W+'.door'}).state;
 renting.properties[H].stock[homeKey('Personal letter')]=1;
 const bought=planHome(renting,{type:'acquire',home:H,method:'installments'},c).state;
 assert.equal(bought.properties[H].stock[homeKey('Personal letter')],1,'title transfer keeps possessions');
 const {homeUsable}=await import('../src/home_model.js');
 assert.equal(homeUsable(bought.properties[H],{...c,clock:1000}),true,'old rent expiry no longer controls owned title');
 const part=planHome(bought,{type:'repay_purchase',home:H,amount:10},c).state;
 assert.equal(part.properties[H].purchase.due,200);
 const whole=planHome(part,{type:'repay_purchase',home:H,amount:10},c).state;
 assert.equal(whole.properties[H].purchase.due,300,'two partial payments keep one installment');
 assert.doesNotThrow(()=>validateHomes(whole,{clock:100}));

});
