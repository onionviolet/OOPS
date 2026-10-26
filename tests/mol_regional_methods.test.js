import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fixture,context,act,perform,finish,move,P,guide,envelope} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewMolCommand,molPresentation} from '../src/book_world_mol_host.js';
import {cancelSimulationJob,advanceSimulationBoundary} from '../src/simulation.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {molLoreEvidence} from '../src/book_world_mol_lore.js';
import {molCommands} from '../src/book_world_mol_actions.js';
import {MOL_IDS as I,MOL_KEYS as K} from '../src/book_world_mol_ids.js';
const quote=(p,id)=>previewMolCommand(p.state,registry,P+id,context(p));
const stock=p=>p.gameplay.player.inventory;
const jig=p=>(p.state.worlds[I.world].facts[P+'jigRestored']=true,p);
const record=(p,id)=>p.state.simulation.knowledge.player[P+id];

test('all L1 and incumbent command definitions stay exact; earned fixture has no assembly claim or casting grant',()=>{
 const before=JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/evidence/commands-after-L1.json',import.meta.url)));
 for(const c of before)assert.deepEqual(molCommands.find(x=>x.id===c.id),c);
 const p=fixture();assert.equal(stock(p)[K.lamp]||0,0);assert.equal(p.state.simulation.claims['book.mol.receipt.assemble_lamp'],undefined);assert.equal(p.state.simulation.powers.player?.[I.operator],undefined);assert.ok(record(p,'trial.ink'));envelope(p);
});

test('jig and practiced household methods consume real ink/paper into guides and preserve earlier claims on repetition',()=>{
 let p=fixture(),before=structuredClone(p),ink=stock(p)[K.ink],paper=stock(p)[K.paper];
 assert.equal(quote(p,'prepare_guide_jig').eligible,false);p=jig(p);assert.equal(quote(p,'prepare_guide_jig').eligible,true);
 p=perform(p,P+'prepare_guide_jig');assert.equal(stock(p)[K.ink],ink-1);assert.equal(stock(p)[K.paper],paper-1);assert.equal(stock(p)[guide],1);
 p=perform(p,P+'practice_hand_guide');p=move(p,'house');p=perform(p,P+'prepare_guide_folded');assert.equal(stock(p)[guide],2);assert.equal(stock(p)[K.ink],ink-2);
 const first=structuredClone(record(p,'method.folded'));p=perform(p,P+'repeat_guide_folded');assert.equal(stock(p)[guide],3);assert.equal(stock(p)[K.ink],ink-3);assert.deepEqual(record(p,'method.folded'),first);
 assert.deepEqual(p.state.simulation.powers.player,before.state.simulation.powers.player);assert.deepEqual(record(p,'print.r1'),record(before,'print.r1'));assert.deepEqual(record(p,'trial.oil'),record(before,'trial.oil'));
 p=move(p,'workshop');p=act(p,P+'compare_methods');assert.match(record(p,'method.comparison').value,/not a claim.*one isolated cause/);
 const inert=JSON.stringify(p);molPresentation(p.state,registry,context(p));quote(p,'repeat_guide_jig');molLoreEvidence(p.state,I.nora);assert.equal(JSON.stringify(p),inert);
});

test('school title, a borrowed packet and stale quote cannot supply current support, practice or stock',()=>{
 let p=fixture();p.state.actors.player.facts[P+'schoolTitle']='academy';assert.equal(quote(p,'prepare_guide_jig').eligible,false);
 p=move(p,'house');assert.equal(quote(p,'prepare_guide_folded').eligible,false);p=move(p,'workshop');p=jig(p);assert.equal(quote(p,'prepare_guide_jig').eligible,true);
 delete p.gameplay.player.inventory[K.ink];const before=structuredClone(p);assert.throws(()=>act(p,P+'prepare_guide_jig'));assert.deepEqual(p,before);
 assert.ok(record(p,'margin.r1'));assert.equal(p.gameplay.player.inventory[JSON.stringify({id:'Cyorian borrowed workshop packet'})]||0,0);
});

test('cancellation and changed jig/body support at due refund exact reservations once without output or lost learning',()=>{
 for(const failure of ['cancel','jig','hands']){
  let p=jig(fixture()),before=structuredClone(p);p=act(p,P+'prepare_guide_jig');const job=p.state.simulation.jobs.find(j=>j.commandId===P+'prepare_guide_jig');assert.equal(stock(p)[K.ink],stock(before)[K.ink]-1);
  p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
  if(failure==='cancel')p={...p,...cancelSimulationJob(p.state,registry,job.id,context(p))};
  else{if(failure==='jig')p.state.worlds[I.world].facts[P+'jigRestored']=false;else p.state.simulation.people.player.body.hands=0;p=finish(p);}
  assert.deepEqual(stock(p),stock(before));assert.equal(p.vitals.player.stamina,before.vitals.player.stamina);assert.equal(record(p,'method.jig'),undefined);assert.deepEqual(record(p,'trial.ink'),record(before,'trial.ink'));
  assert.throws(()=>cancelSimulationJob(p.state,registry,job.id,context(p)));advanceSimulationBoundary(p,registry,{player:context(p)});assert.deepEqual(stock(p),stock(before));
 }
});

test('learned manual method survives passage; current region and tools reevaluate without copying faculty',()=>{
 let p=fixture();p=perform(p,P+'practice_hand_guide');p=move(p,'station');p=act(p,'book.mol.return');assert.ok(record(p,'hand.practice'));assert.equal(quote(p,'prepare_guide_folded').eligible,false);p=act(p,'book.mol.enter');p=move(p,'house');assert.equal(quote(p,'prepare_guide_folded').eligible,true);assert.equal(p.state.simulation.powers.player?.[I.operator],undefined);
});

test('prepared guide carries ink once into real lamp; unavailable specialist refunds; control and household remain useful consumers',()=>{
 let p=jig(fixture());p=perform(p,P+'prepare_guide_jig');const ink=stock(p)[K.ink];let pending=act(p,P+'assemble_guided_lamp');assert.equal(stock(pending)[guide]||0,0);
 pending.state.simulation.faculties[I.nora][I.noraFormula].suppressed=true;pending=finish(pending);assert.equal(stock(pending)[guide],1);assert.equal(stock(pending)[K.lamp]||0,0);assert.equal(pending.state.simulation.claims['book.mol.receipt.assemble_lamp'],undefined);
 p=perform(p,P+'assemble_guided_lamp');assert.equal(stock(p)[K.lamp],1);assert.equal(stock(p)[guide]||0,0);assert.equal(stock(p)[K.ink],ink);assert.equal(p.state.simulation.powers.player[I.operator].mastery,0);assert.equal(p.state.actors.player.resources['book.mol.personalMana'],undefined);
 assert.equal(previewMolCommand(p.state,registry,'book.mol.assemble_lamp',context(p)).eligible,false);
 p=perform(p,'book.mol.charge_1');p=move(p,'court');p=perform(p,'book.mol.control_drill');p=move(p,'workshop');p=perform(p,'book.mol.lamp_test');p=move(p,'house');p=perform(p,'book.mol.close_service_arc');p=perform(p,'book.mol.use_lamp_house');assert.ok(p.state.simulation.knowledge.player['book.mol.houseLamp']);assert.equal(p.state.simulation.powers.player[I.operator].mastery,1);envelope(p);
});
