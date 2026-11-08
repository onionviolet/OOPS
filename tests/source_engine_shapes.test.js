// Contract coverage is not gameplay coverage. Source holders/knowledge do not grant powers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {definePowerGrammar} from '../src/power_grammar.js';
import {hpSpellAdapter} from '../src/spell_adapter_hp.js';
import {lotmSpellAdapter} from '../src/spell_adapter_lotm.js';
import {compileProcedure} from '../src/making_procedure.js';
import {LOTM_DIVINATION_ROWS} from '../src/lotm_divination_rows.js';
const inventory=JSON.parse(readFileSync(new URL('../docs/gm/dispatch/cross-world-systems-2026-11-07/source_shapes.json',import.meta.url)));
const key=id=>JSON.stringify({id});
// Fixture bindings to existing effect owners, not authored implementations of these spells.
const bindings={
 transform:{fn:'craft',effects:[{type:'item',key:key('shape.raw'),amount:-1},{type:'item',key:key('shape.changed'),amount:1}]},
 move:{fn:'craft',effects:[{type:'transfer',from:'player',to:'shape.target',key:key('shape.object'),count:1}]},
 harm:{fn:'physical',effects:[{type:'vital',actor:'shape.target',key:'health',amount:-1}]},
 fire:{fn:'support',effects:[{type:'condition',id:'shape.fire',operation:'apply'}]},
 display:{fn:'support',effects:[{type:'condition',id:'shape.colour',operation:'apply'}]},
 control:{fn:'physical',effects:[{type:'condition',id:'shape.controlled',operation:'apply'}]},
 bind:{fn:'physical',effects:[{type:'condition',id:'shape.bound',operation:'apply'}]},
 unbind:{fn:'physical',effects:[{type:'condition',id:'shape.bound',operation:'remove'}]},
 unlock:{fn:'storage',effects:[{type:'container',containerId:'shape.lock',operation:'open'}]},
 divine:{fn:'perception',effects:[{type:'knowledge',key:'shape.signal',stage:'seen',value:'An observed sign, not a certain answer.'}]},
};
test('the entire indexed first-year spell inventory and pinned divination methods fit the descriptor contract',()=>{
 assert.equal(inventory.rows.filter(r=>r.world==='hp1').length,27);
 assert.equal(inventory.rows.filter(r=>r.world==='lotm1').length,9);
 for(const [i,row] of inventory.rows.entries()){
  const b=bindings[row.verb];assert.ok(b,`${row.id}: missing verb binding`);
  const law={id:'shape.law',basis:'fixture: numeric canon cost unknown',prices:{cost:null,failure:null,perMastery:null},cost:()=>[],functions:{[row.verb]:()=>structuredClone(b.effects)}};
  const adapter=(row.world==='hp1'?hpSpellAdapter:lotmSpellAdapter)({prefix:'shape',worldId:'shape.world',failure:{chance:null,reason:'Shape test: no probability stated.'}});
  const set=definePowerGrammar([{key:`case_${i}`,label:row.label,sourceId:'shape.source',origin:{kind:row.origin||'teacher'},fn:b.fn,parts:row.parts,
   formula:[{label:'Actual means and target',requires:{fact:'actor.shape.means',op:'eq',value:true}}],unstated:['cost amount','range','duration']}],law,adapter);
  const c=set.commands.find(c=>c.id===set.ids[`case_${i}`].command);
  assert.ok(c.requires);assert.equal(c.costs.length,0);assert.ok(c.effects.length);
  assert.equal(set.spells[`case_${i}`].failure.chance,null);
 }
});
test('divination methods preserve preparation, information contact, observation and interpretation as separate steps',()=>{
 for(const row of LOTM_DIVINATION_ROWS.queries){
  const steps=row.steps.map(s=>({id:s.id,label:s.label,minutes:s.minutes}));
  const cmd={id:`shape.${row.id}`,revision:1,actorId:'player',worldId:'shape.world',location:'shape.room',label:row.method,duration:steps.reduce((n,s)=>n+s.minutes,0),costs:[],effects:[{type:'knowledge',key:'shape.belief',stage:'interpreted',value:'An interpretation.'}],requires:{all:[row.means,row.contact]}};
  const result=compileProcedure(cmd,{steps});
  assert.equal(result.length,row.steps.length);
  assert.ok(result.slice(0,-1).every(c=>!c.effects.some(e=>e.key==='shape.belief')));
  assert.ok(result.at(-1).effects.some(e=>e.key==='shape.belief'));
 }
});
