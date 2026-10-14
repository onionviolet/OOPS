import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitRemainderLivelihoodCommand,remainderLivelihoodContext} from '../src/audit_remainder_livelihood_host.js';
import {previewSimulationCommand,advanceSimulationBoundary} from '../src/simulation.js';
const kit='{"id":"Prepared survey kit"}';
function setup(){
 const file=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-vale-wet.txt',import.meta.url);
 const raw=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').split(':')[1],'base64')),state=raw.expansion;
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,stock])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(stock).map(([k,e])=>[k,e.count])),skills:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:50,max_health:50,stamina:30,max_stamina:30}]));
 const context={actorId:'player',targetId:'feature_society.vale',nativeAlive:true,nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals,gameplay,external:{money:raw.character.money},equipment:{player:{}},facts:{location:'Village','auditRemainder.enrolled':true,'village.craftsmanMet':true},remainderLivelihoodClock:{clock:state.clock,calendarMinute:raw['current time'].hour*60+raw['current time'].minute}};
 return {state,context};
}
const fund=p=>commitRemainderLivelihoodCommand(p.state,registry,{type:'audit_remainder',id:'remainder_livelihood.fund_allocation_vale'},p.context);
test('funding supplies the one tool to willing trained Vale before her independent job requires it',()=>{
 const p=setup(),before=p.context.gameplay.player.inventory[kit];assert.equal(p.state.simulation.owners['feature_society.vale'][kit]||0,0);
 const quote=previewSimulationCommand(p.state,registry,'remainder_livelihood.fund_allocation_vale',remainderLivelihoodContext(p.state,p.context,registry));assert.equal(quote.eligible,true,quote.reasons.join(' '));
 const out=fund(p);assert.equal(out.gameplay.player.inventory[kit],before-1);assert.equal(out.state.simulation.owners['feature_society.vale'][kit],1);assert.equal(out.external.money,p.context.external.money-2);
 const contexts=Object.fromEntries(Object.entries(out.state.simulation.people).map(([id,person])=>[id,{...p.context,actorId:id,targetId:null,facts:{...p.context.facts,location:person.location}}]));
 for(let i=0;i<6;i++){out.state.clock++;advanceSimulationBoundary(out,registry,contexts);}
 assert.equal(out.state.actors['feature_society.vale'].completed['remainder_livelihood.work_allocation_vale'],1);
 assert.equal(out.state.simulation.owners['feature_society.vale'][kit],1);assert.equal(out.state.worlds['base.frontier'].facts['workbench.wet'],false);
 assert.equal(out.state.actors['feature_society.vale'].resources.coins,1);
});
test('a missing player tool refuses funding, and the same funding claim cannot sponsor Orr too',()=>{
 const p=setup();p.context.gameplay.player.inventory[kit]=0;assert.throws(()=>fund(p));
 const ready=setup(),out=fund(ready);assert.throws(()=>commitRemainderLivelihoodCommand(out.state,registry,{type:'audit_remainder',id:'remainder_livelihood.fund_allocation_orr'},{...ready.context,external:out.external,gameplay:out.gameplay,targetId:'feature_society.orr'}));
});
