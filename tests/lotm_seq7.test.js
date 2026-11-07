import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fresh,run,wait,at,holds,save,ctx,lotmFacts,hostOver,registry} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView,setAdvancement,advancementRungs,lotmRungAbilities,seerPathway} from '../src/book_world_lotm_path.js';
import {advanceLadders} from '../src/lotm_advancement.js';
import {rowById} from '../src/lotm_formula_rows.js';
import {INGREDIENT_BY_NAME} from '../src/book_world_lotm_bench.js';
import {SEQ7_SOURCE,SEQ7_FORMULA} from '../src/book_world_lotm_seq7.js';
// LG9: Sequence 7 for the Seer ladder through the advancement seam. Proof tier: focused node fixture, synthetic rung pack (the real one is private and
// holds the ability names). Gate: Clown promotion, six acts in the Clown role, a brewed dose; no rite. Inert without a pack.
const eq=(fact,value=true)=>({fact,op:'eq',value});
const synthetic=()=>({meta:{},rungs:{seq7:{label:'Sequence 7',formulaRow:SEQ7_FORMULA,crossings:[
 {id:'dig',type:'digest',label:'Act in the Clown role',fact:'acting7',need:6},{id:'dose',type:'ingest',label:'Hold the dose',fact:'heldMagician',need:true,irreversible:true}],
 grants:['A new faculty'],failure:{signs:'Pressure',outcome:'Owned by the backlash lane'},
 abilities:[{key:'step',label:'Step',sourceId:'book.lotm.magician',conditions:[{label:'Ready',requires:eq('actor.ready')}],cost:[{type:'resource',scope:'actor',key:'spirit',amount:-1}],
  limit:{kind:'cooldown',minutes:5},effects:[{type:'condition',id:'book.lotm.rungseven.step',operation:'apply',duration:3}],failure:{hook:'lotm.backlash'}}]}}});
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const pass=(p,m)=>{const to=p.state.clock+m;for(let i=0;p.state.clock<to&&i<40;i++)p=wait(p,to-p.state.clock);return p;};
const f=p=>lotmFacts(p.state,ctx(p));
const refuses=(p,id)=>assert.throws(()=>run(p,id));
function brew(p,id){const row=rowById(id);p=at(p,L.docks);p=run(p,`bf_buy_${id}`);
 for(const s of row.slots)p=run(p,`bf_ing_${INGREDIENT_BY_NAME[s.select.material].slug}`);
 p=at(p,L.workroom);p=run(p,`bf_start_${id}`);return run(pass(p,row.minutes),`bf_collect_${id}`);}
const read=p=>pass(run(p,'act_reading'),10);
function sleep(p){at(p,L.lodging);p=pass(run(p,'sleep'),120);return at(p,L.workroom);}
// A Seer who has been through the supervised Sequence 8 promotion (the existing path, unchanged).
function clown(){let p=run(fresh(40000),'report_in');p=run(p,'accept_allocation');p=run(p,'ingest');p=pass(run(p,'lesson'),5);
 p=read(read(p));p=sleep(p);p=read(read(read(p)));p=run(p,'act_refusal');p=pass(run(run(p,'request_assessment'),'request_exam_seer'),60);return run(p,'ingest_clown');}
const turns=(p,n)=>{for(let i=0;i<n;i++)p=pass(run(p,i%2?'act_clown_mimic':'act_clown_turn'),20);return p;};
test('the dose key equals the bench product key; the formula row is brewable with no rite; the source id matches what the seam rewrites',()=>{
 const r=rowById(SEQ7_FORMULA);assert.equal(K.magicianDose,r.product.key);assert.equal(r.status,'brewable');assert.equal(r.ritual.needed,false);
 const l=advanceLadders(seerPathway,synthetic());assert.equal(l.rungs.seq7.promotionEffects.find(e=>e.type==='source').sourceId,SEQ7_SOURCE);
});
test('without the advancement pack the Clown ceiling holds: no Clown acts, no Magician drink, Sequence 8 play unchanged',()=>{
 setAdvancement(null);let p=clown();ok(p);
 for(const id of ['act_clown_turn','act_clown_mimic','drink_magician'])refuses(p,id);
 const v=lotmPathView(p.state,f(p));assert.equal(v.capped,true);assert.equal(v.stage,'Sequence 8 · Clown');
});
test('route: Clown, six Clown-role acts, brew the Magician dose, drink; the ladder moves to Sequence 7 and the ledger stays whole',()=>{
 setAdvancement(synthetic());
 try{
  let p=brew(clown(),SEQ7_FORMULA);assert.equal(holds(p,K.magicianDose),1);ok(p);
  assert.equal(f(p)['lotm.holds.magicianDose'],1);
  let v=lotmPathView(p.state,f(p));assert.equal(v.stage,'Sequence 8 · Clown');assert.equal(v.felt,'unsettled');
  assert.deepEqual(v.crossings.map(c=>[c.id,c.have,c.need,c.met]),[['dig',0,6,false],['dose',true,true,true]]);
  refuses(p,'drink_magician');
  p=turns(p,3);ok(p);assert.equal(f(p)['lotm.clown.acting'],3);assert.equal(lotmPathView(p.state,f(p)).felt,'settling');refuses(p,'drink_magician');
  p=turns(p,3);ok(p);assert.equal(f(p)['lotm.clown.digested'],true);assert.equal(lotmPathView(p.state,f(p)).felt,'settled');
  refuses(p,'act_clown_turn');
  assert.equal(lotmPathView(p.state,f(p)).ready,true);
  p=run(p,'drink_magician');ok(p);
  assert.equal(holds(p,K.magicianDose),0);assert.ok(p.state.actors.player.sources[SEQ7_SOURCE]);assert.ok(p.state.actors.player.sources[I.clown],'the Clown source stays');
  assert.equal(p.state.actors.player.resources['book.lotm.bf.fool_7.drunk'],1);
  v=lotmPathView(p.state,f(p));assert.equal(v.stage,'Sequence 7');
  refuses(p,'drink_magician');
  assert.equal(lotmRungAbilities(3).here.length,1,'the rung\'s ability records are listed once the rung is held');
 }finally{setAdvancement(null);}
});
test('the bench offers the Magician drink instead of the unwritten marker once the pack is loaded',()=>{
 setAdvancement(synthetic());
 try{
  const p=brew(clown(),SEQ7_FORMULA),{host}=hostOver(p),d=host.view(SEQ7_FORMULA).bench.selected;
  assert.equal(d.drink,null);assert.deepEqual(d.drinkOptions.map(o=>o.id),['book.lotm.drink_magician']);assert.equal(d.drinkOptions[0].eligible,false,'visible but refused until the Clown potion has settled');
 }finally{setAdvancement(null);}
});
test('failure scenarios: a dose without the Clown step cannot be drunk; forged Clown acting or a forged Magician source fails validation',()=>{
 setAdvancement(synthetic());
 try{
  let s=run(fresh(40000),'report_in');s=run(s,'accept_allocation');s=run(s,'ingest');s.gameplay.player.inventory[K.magicianDose]=1;refuses(s,'drink_magician');refuses(s,'act_clown_turn');
  const forged=clown();forged.state.actors.player.resources['book.lotm.clown.acting']=7;assert.throws(()=>validateLotmState(forged.state),/Clown role/);
  const early=run(fresh(40000),'report_in');early.state.actors.player.resources['book.lotm.clown.acting']=1;assert.throws(()=>validateLotmState(early.state),/Clown role/);
  const fake=clown();fake.state.actors.player.facts['book.lotm.seq7.promoted']=true;assert.throws(()=>validateLotmState(fake.state),/Magician/);
 }finally{setAdvancement(null);}
});
const priv=new URL('../private_packs/lotm-advancement/advancement.json',import.meta.url);
test('the private pack, when present, turns the gate on and every rung-7 ability card binds the held source (names not asserted)',{skip:!existsSync(priv)},()=>{
 const pack=JSON.parse(readFileSync(priv,'utf8'));setAdvancement(pack);
 try{
  assert.ok(advancementRungs().seq7);const cards=Object.values(advancementRungs().seq7.abilities.cards);
  assert.ok(cards.length>=1&&cards.every(c=>c.sourceId===SEQ7_SOURCE));
  assert.equal(pack.rungs.seq7.crossings.find(c=>c.type==='digest').need,6,'the pack\'s digestion count equals the game\'s');
  assert.equal(lotmFacts(clown().state,ctx(clown()))['lotm.seq7.available'],true);
 }finally{setAdvancement(null);}
});
