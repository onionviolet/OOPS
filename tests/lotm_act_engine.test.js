import test from 'node:test';
import assert from 'node:assert/strict';
import {defineLotmActs,backlashDue,settleLotmBacklash,quoteLotmActs} from '../src/lotm_act_engine.js';
import {LOTM_ACT_BINDINGS,LOTM_ACT_KEYS as K} from '../src/lotm_act_bindings.js';
import {LOTM_RITE_ROWS} from '../src/lotm_rite_rows.js';
import {LOTM_CRAFT_ROWS} from '../src/lotm_craft_rows.js';
import {LOTM_AID_PREPARATIONS} from '../src/lotm_potion_rule_rows.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand,simulationFacts} from '../src/simulation.js';
const rows=[...LOTM_RITE_ROWS.rows,...LOTM_CRAFT_ROWS.rows,...LOTM_AID_PREPARATIONS.rows];
const {commands,unbound}=defineLotmActs(rows,LOTM_ACT_BINDINGS,{worldId:I.world,group:'book_lotm',situationId:I.situation});
const defs=createSimulationRegistry({commands});for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
const room='fixture.workroom';
function setup(facts={}){const p=fresh(5);applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'t.begin');
 p.state.simulation.people.player.location=room;Object.assign(p.state.actors.player.facts,facts);return p;}
const def=id=>registry.simulation.commands.get(id);
const preview=(p,id)=>previewSimulationCommand(p.state,registry,id,ctx(p));
const doStep=(p,id)=>{const out=commitSimulationCommand(p.state,registry,{id},ctx(p),p.state.sequence);return wait({...p,...out},def(id).duration);};
const run=(p,row,ids)=>ids.reduce((p,s)=>doStep(p,`${row}.${s}`),p);
const stock=(p,k,n)=>{p.gameplay.player.inventory[k]=n;return p;};

test('rows without a complete binding are reported, not guessed',()=>{
 const ids=new Set(commands.map(c=>c.lotmAct.rowId));
 assert.equal(ids.size,5);
 assert.ok(unbound.length>60);
 assert.match(unbound.find(u=>u.id==='lotm.rite.spirit-call').reasons[0],/No binding/);
 const partial=defineLotmActs(LOTM_CRAFT_ROWS.rows.slice(5,6),{[LOTM_CRAFT_ROWS.rows[5].id]:{place:room,steps:{},inputs:{}}},{worldId:I.world,group:'g',situationId:I.situation});
 assert.equal(partial.commands.length,0);assert.ok(partial.unbound[0].reasons.some(r=>/minutes/.test(r))&&partial.unbound[0].reasons.some(r=>/Moon flower/.test(r)));
});
test('volume 1 craft: inputs spend at distill, oil appears at the end, bath aid consumes the product line',()=>{
 let p=stock(stock(setup({'lotm.craft.botanical-distillation':true}),K.botanicals,1),K.bottle,1);
 assert.equal(preview(p,'lotm.craft.ritual-essence-oil.distill').eligible,false);
 p=run(p,'lotm.craft.ritual-essence-oil',['select']);
 assert.equal(p.gameplay.player.inventory[K.botanicals],1);
 p=run(p,'lotm.craft.ritual-essence-oil',['distill','set-out']);
 assert.equal(p.gameplay.player.inventory[K.botanicals]??0,0);assert.equal(p.gameplay.player.inventory[K.essenceOil],1);
 assert.equal(p.state.actors.player.facts['lotm.aid.ritual-oil-bath.ready'],true);
 p=run(p,'lotm.aid.ritual-oil-bath',['add']);
 assert.equal(p.gameplay.player.inventory[K.essenceOil]??0,0);assert.equal(p.state.actors.player.facts['lotm.mood.relaxed']??p.state.actors.player.facts['actor.lotm.mood.relaxed'],true);
});
test('volume 2 rite: ordered steps, offering spent, owner effects and risk settle once',()=>{
 let p=stock(setup({'lotm.rite.fool-offering-means':true}),K.metalBox,1);
 assert.equal(preview(p,'lotm.rite.fool-sacrifice.send').eligible,false);
 p=run(p,'lotm.rite.fool-sacrifice',['candle','petition','channel','send']);
 assert.equal(p.gameplay.player.inventory[K.metalBox]??0,0);
 assert.equal(p.state.actors.player.facts['lotm.custody.metal-box.sent'],true);
 const sacrifice=commands.filter(c=>c.lotmAct.rowId==='lotm.rite.fool-sacrifice');
 assert.equal(backlashDue(sacrifice[3],{}).weight,2);
 assert.equal(backlashDue(sacrifice[3],{'actor.lotm.protect.ward':true}).weight,1);
 p.state.worlds??={};p.state.worlds[I.world]??={facts:{}};
 const added=[];const add=(c,a)=>added.push([c,a]);
 const f=()=>simulationFacts(p.state,ctx(p),registry);
 settleLotmBacklash(p.state,sacrifice,I.world,f(),add);settleLotmBacklash(p.state,sacrifice,I.world,f(),add);
 assert.equal(added.length,1);assert.deepEqual(added[0],['spirit',{source:'lotm.rite.fool-sacrifice',weight:2}]);
});
test('volume 3 rite and craft: unresolved owners stay auditable; craft yields its product',()=>{
 let p=setup({'lotm.rite.v3-self-summon-transfer-v3':true,'lotm.craft.fish-man-hunting-preparation-means':true});
 p=run(p,'lotm.rite.self-summon-transfer-v3',['phase-1','phase-2','phase-3']);
 const key=Object.keys(p.state.actors.player.facts).find(k=>k.includes('owner_needed.item-custody'));assert.ok(key);
 assert.match(p.state.actors.player.facts[key],/owner needed: item-custody/);
 const q=quoteLotmActs(commands.filter(c=>c.lotmAct.rowId==='lotm.rite.self-summon-transfer-v3'),d=>preview(p,d.id));
 assert.deepEqual(q.at(-1).unresolved,['item-custody']);
 p=stock(stock(p,K.peppercorns,1),K.mintOintment,1);
 p=run(p,'lotm.craft.fish-man-hunting-preparation',['bait','coat','arrange']);
 assert.equal(p.gameplay.player.inventory[K.setup],1);assert.equal(p.gameplay.player.inventory[K.peppercorns]??0,0);
});
