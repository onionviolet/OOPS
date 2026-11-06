// FD3: the ready-stock seam alone, with a revolver-shaped spec and a hypothetical arrow quiver (capacity 1) so the seam is not revolver-shaped.
// Failure scenarios: loading past capacity is refused by the predicate and caught by the assertion; spending from an empty ready slot yields no effect.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as RS from '../src/ready_stock.js';
const gun={prefix:'t.',carried:'carried',ready:'loaded',kinds:['ordinary','silver'],capacity:6,unit:'rounds',kindLabel:'round kind',factPrefix:'t.gun',readyFact:'loaded',useKey:'t.practice'};
const bow={prefix:'t.bow.',carried:'quiver',ready:'nocked',kinds:['arrow'],capacity:1,unit:'arrows',factPrefix:'t.bow',readyFact:'nocked'};
const bag={prefix:'t.bag.',carried:'held',kinds:['dose'],factPrefix:'t.bag'};
const res=(key,amount)=>({type:'resource',actor:'player',key,amount});
const apply=(r,effects)=>{for(const e of effects){r[e.key]=(r[e.key]||0)+e.amount;if(r[e.key]<0)throw Error('Insufficient');}return r;};
const check=(s,r,opts)=>{const bad=[];RS.stockAssertions(s,r,(ok,m)=>{if(!ok)bad.push(m);},opts);return bad;};

test('keys and effects: stock in, ready, unready lose nothing, spend takes exactly one',()=>{
 assert.equal(RS.stockKey(gun,'carried','silver'),'t.carried.silver');
 assert.deepEqual(RS.stockKeys(gun).ready('silver'),'t.loaded.silver');
 assert.deepEqual(RS.stockInEffects(gun,'silver',3),[res('t.carried.silver',3)]);
 assert.deepEqual(RS.readyEffects(gun,'silver',2),[res('t.carried.silver',-2),res('t.loaded.silver',2)]);
 assert.deepEqual(RS.unreadyEffects(gun,'silver',2),[res('t.loaded.silver',-2),res('t.carried.silver',2)]);
 assert.deepEqual(RS.spendEffects(gun,'silver'),[res('t.loaded.silver',-1)]);
 assert.deepEqual(RS.spendEffects(gun,'silver',{counter:true}),[res('t.loaded.silver',-1),res('t.practice',1)]);
 const r=apply({},RS.stockInEffects(gun,'ordinary',5));apply(r,RS.readyEffects(gun,'ordinary',4));apply(r,RS.unreadyEffects(gun,'ordinary',4));
 assert.deepEqual([r['t.carried.ordinary'],r['t.loaded.ordinary']],[5,0],'unready returns everything');
 for(const bad of [0,-1,1.5,'2'])assert.throws(()=>RS.stockInEffects(gun,'ordinary',bad),/positive whole number of rounds/);
 assert.throws(()=>RS.readyEffects(gun,'nope',1),/Unknown round kind nope/);
 assert.throws(()=>RS.spendEffects(bow,'arrow',{counter:true}),/no use counter/);
 assert.throws(()=>RS.readyEffects(bag,'dose',1),/no ready slot/);
});

test('spending from an empty ready slot yields no effect, never a negative count',()=>{
 assert.deepEqual(RS.spendIfReadyEffects(gun,'ordinary',0),[]);
 assert.deepEqual(RS.spendIfReadyEffects(gun,'ordinary',undefined),[]);
 assert.equal(RS.spendIfReadyEffects(gun,'ordinary',1,{counter:true}).length,2);
 assert.throws(()=>apply({},RS.spendEffects(gun,'ordinary')),/Insufficient/,'the raw effect on an empty slot is refused by the engine');
});

test('predicates match the requires shape and refuse a load past capacity',()=>{
 const held={fact:'t.held',op:'eq',value:true,reason:'No gun.'};
 const q=RS.readyRequires(gun,'silver',2,{before:[held],reasons:{carried:'Too few.',free:'Full.'}});
 assert.deepEqual(q,{all:[held,{fact:'t.gun.carried.silver',op:'gte',value:2,reason:'Too few.'},{fact:'t.gun.free',op:'gte',value:2,reason:'Full.'}]});
 assert.deepEqual(RS.spendRequires(gun,'silver',{reason:'Empty.'}),{all:[{fact:'t.gun.loaded.silver',op:'gte',value:1,reason:'Empty.'}]});
 const holds=(req,f)=>req.all.every(c=>c.op==='gte'?(f[c.fact]||0)>=c.value:f[c.fact]===c.value);
 const f={};RS.stockFacts(gun,apply(apply({},RS.stockInEffects(gun,'ordinary',9)),RS.readyEffects(gun,'ordinary',5)),f);
 assert.equal(f['t.gun.free'],1);
 assert.equal(holds(RS.readyRequires(gun,'ordinary',1),f),true);
 assert.equal(holds(RS.readyRequires(gun,'ordinary',2),f),false,'a second round past capacity is refused by the predicate');
});

test('facts projection and assertions: capacity, whole numbers, unknown keys',()=>{
 const r=apply(apply({},RS.stockInEffects(gun,'silver',4)),RS.readyEffects(gun,'silver',3));r['t.practice']=7;
 const f={};assert.equal(RS.stockFacts(gun,r,f),3);
 assert.deepEqual(f,{'t.gun.loaded.ordinary':0,'t.gun.carried.ordinary':0,'t.gun.loaded.silver':3,'t.gun.carried.silver':1,'t.gun.loaded':3,'t.gun.free':3});
 assert.deepEqual(RS.stockFacts(gun,undefined,{}),0);
 assert.deepEqual(check(gun,r),[]);
 assert.equal(check(gun,{...r,'t.loaded.silver':7}).length,1,'ready past capacity is caught by the assertion');
 assert.equal(check(gun,{...r,'t.loaded.silver':7},{capacity:8}).length,0,'capacity is a per-call dial');
 assert.equal(check(gun,{...r,'t.carried.silver':-1}).length,1);
 assert.equal(check(gun,{...r,'t.carried.silver':1.5}).length,1);
 assert.equal(check(gun,{...r,'t.carried.mithril':1}).length,1,'unknown kind key refused');
 assert.equal(check(gun,{...r,'t.loaded.mithril':1}).length,1);
 assert.deepEqual(RS.stockOwnedKeys(gun,{...r,'other.key':3}).sort(),['t.carried.silver','t.loaded.silver','t.practice']);
});

test('a second kind of stock: an arrow quiver with a one-arrow nock, and a stock with no ready slot',()=>{
 const r=apply({},RS.stockInEffects(bow,'arrow',12));
 const f={};RS.stockFacts(bow,r,f);assert.deepEqual(f,{'t.bow.nocked.arrow':0,'t.bow.quiver.arrow':12,'t.bow.nocked':0,'t.bow.free':1});
 apply(r,RS.readyEffects(bow,'arrow',1));RS.stockFacts(bow,r,f);
 assert.deepEqual([f['t.bow.nocked'],f['t.bow.free'],f['t.bow.quiver.arrow']],[1,0,11]);
 assert.deepEqual(check(bow,r),[]);
 assert.equal(check(bow,apply(r,RS.readyEffects(bow,'arrow',1))).length,1,'two nocked arrows exceed capacity 1');
 const d=apply({},RS.stockInEffects(bag,'dose',2)),g={};RS.stockFacts(bag,d,g);
 assert.deepEqual(g,{'t.bag.held.dose':2});assert.deepEqual(check(bag,d),[]);
});

test('countToStep: the last reached step, 0 below the first, flat past the last',()=>{
 const steps=[{count:0,step:0},{count:50,step:1},{count:250,step:2},{count:1000,step:3}];
 assert.deepEqual([0,49,50,249,250,999,1000,1e6].map(n=>RS.countToStep(n,steps)),[0,0,1,1,2,2,3,3]);
 assert.equal(RS.countToStep(5,[{count:10,step:4}]),0);assert.equal(RS.countToStep(5,[]),0);
});
