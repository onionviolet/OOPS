// Explicit supplied-stock QA derivative of the public synthetic learning fixture.
import fs from 'node:fs';
import {loadExpansionState} from '../../../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../../../../../../src/expedition_content.js';
export const prefix='book.mol.lore.';
export const note=JSON.stringify({id:'Cyorian borrowed workshop packet'});
export function fixture(){
 const file=new URL('../../../../other-systems-depth-2026-10-26/learning/evidence/TEST-FIXTURE-R15-G4-learning-house.txt',import.meta.url);
 const raw=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').trim().split(':')[1],'base64'));
 raw.inventories.person['book.mol.ibery'][note]={count:1};
 const state=loadExpansionState(raw.expansion,registry);
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,bag])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(bag).map(([k,e])=>[k,e.count])),skills:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:30,max_stamina:51}]));vitals.player={health:80,max_health:80,stamina:30,max_stamina:51};
 return {state,gameplay,vitals,external:{money:raw.character.money},equipment:{},raw};
}
export function context(p,targetId=null){return {actorId:'player',targetId,nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:p.state.motherOfLearning.nativeRevision,body:p.state.simulation.people.player.body},vitals:p.vitals,gameplay:p.gameplay,external:p.external,facts:{location:p.state.simulation.people.player.location}};}
