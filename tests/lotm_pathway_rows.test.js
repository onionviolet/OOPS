import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {lotmContext,lotmFacts,lotmPathwayCommands} from '../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_PATHWAYS,LOTM_ASSESSORS,LOTM_LOSS_CAUSES} from '../src/book_world_lotm_pathways.js';
import {LOTM_IDS as I,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
// LOTM B2/B3: a pathway is one data row. The stub row below is test-only (no third pathway ships): it reuses the Corpse Collector
// items and sources so the engine accepts it, and everything else (commands, facts, blocks) is generated from the row.
const vit={health:24,max_health:24,stamina:18,max_stamina:18};
const corpse=LOTM_PATHWAYS[1],seerRow=LOTM_PATHWAYS[0];
const SRC1='book.lotm.stub_source',SRC2='book.lotm.stub_source_two';
const stub={...corpse,sourceId:SRC1,nextSourceId:SRC2,id:'stub',pathId:'lotm.stub',prefix:'tx.',label:'Stub',nextLabel:'Stub Two',digestActs:2,actingKey:'book.lotm.tx.acting',actingFact:'lotm.tx.acting',digestedFact:'lotm.tx.digested',supportedFact:'lotm.txSupported',
 actingNeeds:'tx.ingested',ids:{accept:'accept_stub',ingest:'ingest_stub',assess:'request_assessment_stub',promote:'ingest_stub_two'},assessor:'examiner_stub',
 labels:{...corpse.labels,accept:'Accept the stub dose',ingest:'Take the stub dose',assessSuffix:' (Stub)',promote:'Drink the stub two dose'},
 actGate:{fact:'lotm.txSupported',flags:['tx.stabilized']},
 acts:[{id:'act_stub_rite',label:'Perform the stub rite · 1 of Hale\'s attention, 5 min',once:false,minutes:5,cost:'attention',supervised:true,knowKey:'tx.acting.rite',text:'You performed the stub rite.'}]};
// An assessor row of another kind: a senior deacon, who needs more of the attention budget (data only).
const examiner={id:'examiner_stub',pathway:'stub',kind:'senior_deacon',label:'Deacon Stub',short:'Deacon',authored:true,sourceKind:'senior deacon',digestRequired:true,attention:2,releases:'gravediggerDose'};
const rows=[seerRow,stub],assessors=[...LOTM_ASSESSORS,examiner];
const stubCommands=lotmPathwayCommands(stub,assessors);
const stubList=[stubCommands.accept,stubCommands.ingest,...stubCommands.acts,stubCommands.assess,stubCommands.promote];
const srcDef=id=>({...registry.sources.get(I.corpse),id});
const reg={...registry,sources:new Map([...registry.sources,[SRC1,srcDef(SRC1)],[SRC2,srcDef(SRC2)]]),simulation:{...registry.simulation,commands:new Map([...registry.simulation.commands,...stubList.map(c=>[c.id,c])])}};
function fresh(){
 let p={state:initializeExpedition(createExpansionState(41)),external:{money:50},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=enrollSimulation(p.state,reg,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
 enrollLotmBranch(p.state);
 p.gameplay[I.supervisor]={inventory:structuredClone(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};
 return p;
}
const ctx=(p,targetId)=>lotmContext(p.state,{actorId:'player',pathways:rows,external:p.external,gameplay:p.gameplay,vitals:{player:vit,[I.supervisor]:vit},vitalsByActor:{player:vit,[I.supervisor]:vit},nativeAlive:true,
 ...(targetId?{targetId}:{}),facts:{location:p.state.simulation.people.player.location}});
const def=id=>reg.simulation.commands.get(`book.lotm.${id}`);
function run(p,id){const d=def(id);const out=commitSimulationCommand(p.state,reg,{id:d.id},ctx(p,d.targetId));return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}
const eligible=(p,id)=>{const d=def(id);return previewSimulationCommand(p.state,reg,d.id,{...ctx(p,d.targetId),targetId:d.targetId||null}).eligible;};
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const holds=(p,key)=>p.gameplay.player.inventory[key]||0;

test('a stub third pathway row yields working accept, ingest, act, assessment, promotion and cause-block commands without new code',()=>{
 assert.equal(LOTM_PATHWAYS.length,2,'no third pathway ships');
 let p=fresh();p=run(p,'report_in');
 assert.ok(eligible(p,'accept_stub')&&eligible(p,'accept_allocation'));
 p=run(p,'accept_stub');assert.equal(holds(p,K.corpseDose),1);
 refuses(p,'ingest_stub_two');refuses(p,'act_stub_rite');
 p=run(p,'ingest_stub');assert.ok(p.state.actors.player.sources[SRC1]);assert.equal(p.state.actors.player.facts['book.lotm.tx.stabilized'],true);
 // The cause row blocks switching to the other pathway with its own reason, read from the row.
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.block.seer.switching'],true);
 refuses(p,'accept_allocation');assert.equal(eligible(p,'accept_allocation'),false);
 for(let i=0;i<2;i++){p=run(p,'act_stub_rite');p=advance(p,5);}
 assert.equal(p.state.actors.player.resources['book.lotm.tx.acting'],2);assert.equal(lotmFacts(p.state,ctx(p))['lotm.tx.digested'],true);
 // Assessment reads the assessor row: the deacon takes 2 of the attention budget, not 1.
 const before=p.state.actors[I.supervisor].resources['book.lotm.attention'];
 p=run(p,'request_assessment_stub');assert.equal(before-p.state.actors[I.supervisor].resources['book.lotm.attention'],2);
 assert.equal(holds(p,K.gravediggerDose),1);
 p=run(p,'ingest_stub_two');assert.ok(p.state.actors.player.sources[SRC2]);
});
function advance(p,minutes){const c=ctx(p);const out=advanceSimulation(p.state,reg,minutes,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay};}

test('the cause rows carry the five stated causes of loss of control, each with a player-readable reason, and the dial turns the switching block off',()=>{
 assert.deepEqual(LOTM_LOSS_CAUSES.map(c=>c.id),['switching','skippingSequence','wrongPotion','rushedResidue','temptation']);
 for(const c of LOTM_LOSS_CAUSES)assert.ok(c.reason.length>40&&c.label&&c.enforcedBy);
 assert.ok(LOTM_ASSESSORS.every(a=>a.kind&&a.authored&&a.sourceKind==='senior deacon'&&a.digestRequired&&a.releases));
 let p=fresh();p=run(p,'report_in');p=run(p,'accept_allocation');
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.block.stub.switching'],true);refuses(p,'accept_stub');
 // A wrong-pathway potion in hand blocks drinking (cause row wrongPotion).
 const mixed=structuredClone(p);mixed.gameplay.player.inventory[K.corpseDose]=1;
 assert.equal(lotmFacts(mixed.state,ctx(mixed))['lotm.block.seer.wrongPotion'],true);assert.equal(eligible(mixed,'ingest'),false);
});

test('a save holding both pathways validates only as the flagged loss-of-control record; every earlier fixture still loads',()=>{
 let p=fresh();p=run(p,'report_in');p=run(p,'accept_allocation');p=run(p,'ingest');
 const forged=structuredClone(p.state);forged.actors.player.facts['book.lotm.cc.allocated']=true;
 assert.throws(()=>validateLotmState(forged),/switching, a stated cause of loss of control/);
 forged.actors.player.facts['book.lotm.loc.switching']=true;assert.equal(validateLotmState(forged),true);
 const unknown=structuredClone(p.state);unknown.actors.player.facts['book.lotm.loc.invented']=true;assert.throws(()=>validateLotmState(unknown),/Unknown loss-of-control/);
 const dir=name=>new URL(`../docs/gm/dispatch/${name}.json`,import.meta.url);
 for(const name of ['lotm-q1-2026-10-23/fixtures/seer_taught','lotm-q1-2026-10-23/fixtures/seer_promoted','lotm-q2-2026-10-23/fixtures/seer_taught','lotm-q2-2026-10-23/fixtures/seer_promoted','lotm-q2-2026-10-23/fixtures/cc_stabilized','lotm-q2-2026-10-23/fixtures/cc_promoted']){
  const save=JSON.parse(fs.readFileSync(dir(name),'utf8'));
  assert.equal(validateLotmState(save.expansion),true,name);assert.equal(validateLotmEnvelope(save),true,name);
 }
});
