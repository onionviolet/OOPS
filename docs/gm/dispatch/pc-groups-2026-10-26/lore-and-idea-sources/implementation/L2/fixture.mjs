// Named synthetic QA provisioning over the exploration chat's earned public
// pre-lamp export. No private save, assembled-lamp reset or borrowed mastery.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {Game_Time} from '../../../../../../../src/game_time.js';
import {loadExpansionState} from '../../../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../../../../../../src/expedition_content.js';
import {commitMolCommand,syncMolClock} from '../../../../../../../src/book_world_mol_host.js';
import {advanceSimulationBoundary} from '../../../../../../../src/simulation.js';
import {molCalendarAt,molQuestProjection,validateMolEnvelope} from '../../../../../../../src/book_world_mol_native.js';
import {MOL_IDS as I,MOL_LOCATIONS as L,MOL_KEYS as K} from '../../../../../../../src/book_world_mol_ids.js';
export const P='book.mol.lore.',guide=JSON.stringify({id:'Cyorian single-cube tracing guide'}),packet=JSON.stringify({id:'Cyorian borrowed workshop packet'});
export function context(p){return {actorId:'player',nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:p.state.motherOfLearning.nativeRevision,body:p.state.simulation.people.player.body,endpointBindings:[p.state.motherOfLearning.connections[0].from,p.state.motherOfLearning.connections[0].to].map(endpoint=>({endpoint,available:true,positions:[{id:'gate.arrival',free:true,bodyForms:['human']}]}))},vitals:p.vitals,gameplay:p.gameplay,external:p.external,equipment:p.equipment,facts:{location:p.state.simulation.people.player.location}};}
export function act(p,id){return {...p,...commitMolCommand(p.state,registry,{type:'book_mol',id},context(p))};}
export function finish(p){while(p.state.simulation.jobs.some(j=>j.actorId==='player')){p.state.clock++;advanceSimulationBoundary(p,registry,{player:context(p)});}syncMolClock(p.state);return p;}
export function perform(p,id){return finish(act(p,id));}
export function move(p,where){return act(p,'book.mol.move.'+where);}
export function fixture(prerequisites=true){
 const source=new URL('../../../../other-systems-depth-2026-10-26/exploration/evidence/withdrawn-research.save.txt',import.meta.url);
 const raw=JSON.parse(Buffer.from(fs.readFileSync(source,'utf8').trim().split(':')[1],'base64'));
 // Disclosed QA stock and funding; no stock is credited as naturally earned.
 for(const [key,count] of [[K.paper,16],[K.ink,5],[K.cube,1],[K.oil,1]])raw.inventories.person.main_character[key]={count};
 raw.inventories.person[I.ibery][packet]={count:1};raw.expansion.actors.player.resources['book.mol.crowns']=60;
 raw.character.hp_to_full=0;raw.character.stamina_to_full=0;
 const state=loadExpansionState(raw.expansion,registry);
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,bag])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(bag).map(([k,e])=>[k,e.count])),skills:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:51,max_stamina:51}]));vitals.player={health:80,max_health:80,stamina:51,max_stamina:51};
 let p={state,raw,gameplay,vitals,equipment:{player:{}},external:{money:raw.character.money}};
 if(prerequisites){
  p=move(p,'academy');p=perform(p,'book.mol.mana_assessment');p=move(p,'library');p=perform(p,'book.mol.library_meet');p=perform(p,'book.mol.study_invocation');
  p=perform(p,P+'borrow');p=perform(p,P+'read');p=perform(p,P+'reverse');p=act(p,P+'return');
  p=move(p,'workshop');p=perform(p,'book.mol.study_formula');p=perform(p,P+'trial_ink');p=perform(p,P+'trial_oil');p=act(p,P+'compare');
 }
 return p;
}
export function envelope(p){
 syncMolClock(p.state);const raw=structuredClone(p.raw);raw.expansion=structuredClone(p.state);raw['current location']=p.state.simulation.people.player.location;
 const elapsed=p.state.clock-p.raw.expansion.clock;
 if(!Number.isSafeInteger(elapsed)||elapsed<0)throw Error('Fixture needs a forward native clock delta.');
 const native=new Game_Time(p.raw['current time']);native.goUp(elapsed);
 raw['current time']={year:native.year,month:native.month,day:native.day,hour:native.hour,minute:native.minute,day_count:native.day_count};
 raw.book_world_mol_native.worldOwners[0].calendar=molCalendarAt(p.state.motherOfLearning.instances[0].clock.elapsed);raw.character.money=p.external.money;raw.character.hp_to_full=0;raw.character.stamina_to_full=51-p.vitals.player.stamina;
 for(const [id,entry] of Object.entries(p.gameplay))raw.inventories.person[id==='player'?'main_character':id]=Object.fromEntries(Object.entries(entry.inventory).filter(([,count])=>count>0).map(([key,count])=>[key,{count}]));
 raw.quests[I.quest]=molQuestProjection(p.state,I.world);validateMolEnvelope(raw,p.state);return raw;
}
export function encoded(p){return 'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(envelope(p))).toString('base64');}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const out=new URL('./evidence/TEST-FIXTURE-G7-L2-pre-assembly-clock-correct.txt',import.meta.url);const p=fixture();fs.writeFileSync(out,encoded(p)+'\n');
 console.log('Wrote named pre-assembly fixture; actual prerequisites earned; stock/funds supplied; no lamp/mastery granted.');
}
