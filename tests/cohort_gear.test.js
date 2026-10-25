import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {cancelSimulationJob,simulationOccupiesActor} from '../src/simulation.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {registerHomeWork} from '../src/home_work.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {cohortDefinitions} from '../src/cohort_battle_content.js';
import {bookCohortGear} from '../src/cohort_gear.js';
import {cohortFrameFit,cohortFramePreview} from '../src/cohort_gear_facts.js';
import {FEATURE_HARNESS,FEATURE_KIT,FEATURE_LOG} from '../src/feature_expansion_powers.js';
import {COHORT_MEMBERS,COHORT_COACHES,COHORT_ROOM} from '../src/cohort_battle_facts.js';
if(!registry.simulation.people.has(COHORT_MEMBERS[0]))registerHomeWork(registry);
const additions=createSimulationRegistry(cohortDefinitions);for(const family of ['people','commands','encounters'])for(const [id,d]of additions[family])if(!registry.simulation[family].has(id))registry.simulation[family].set(id,d);
const id=COHORT_MEMBERS[1],coach=COHORT_COACHES[0],S='home.manor.steward';
function ready(){let p=joinField(createFieldFixture());p.state.simulation.people.player.location=COHORT_ROOM;p.gameplay.player.inventory[FEATURE_KIT]=2;p.gameplay.player.inventory[FEATURE_LOG]=2;applySimulationEffects(p,[...COHORT_MEMBERS,...COHORT_COACHES].map(personId=>({type:'spawn',personId,definitionId:personId})),{actorId:'player'},registry,'fixture:gear');const a=p.state.actors[id],n=p.state.simulation.people[id];a.facts['home.employed']=true;a.facts['home.leave']=false;a.facts['cohort.willing']=true;a.resources={...a.resources,'cohort.training':1,'home.energy':100};n.body={...n.body,cohortTempering:1};n.vitals={health:20,max_health:28,stamina:12,max_stamina:16};p.state.actors[S].resources['home.estateFunds']=30;return p;}
const context=p=>({...fieldContext(p,COHORT_ROOM),location:COHORT_ROOM});
const advance=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,Object.fromEntries(Object.entries(p.state.simulation.people).map(([actorId,r])=>[actorId,{actorId,facts:{location:r.location},vitals:r.vitals}])));
test('the actual two-kit/two-log frame belongs to the paid member and enters the existing equipment owner only after completion',()=>{
 let p=ready(),old=structuredClone(p);assert.equal(bookCohortGear(structuredClone(p),registry,context(p),id,'build',{preview:true}).eligible,true);assert.deepEqual(p,old);bookCohortGear(p,registry,context(p),id,'build');assert.equal(simulationOccupiesActor(p.state,id),true);assert.equal(simulationOccupiesActor(p.state,coach),true);assert.equal(p.gameplay.player.inventory[FEATURE_KIT]||0,0);assert.equal(p.gameplay.player.inventory[FEATURE_LOG]||0,0);assert.equal(p.state.actors[S].resources['home.estateFunds'],26);assert.equal(cohortFrameFit(p.state,id).active,false);p=advance(p,30);assert.equal(p.state.simulation.owners[id][FEATURE_HARNESS],1);assert.equal(p.state.simulation.equipment[id].field_frame,FEATURE_HARNESS);assert.equal(p.state.actors[id].resources['home.wages'],2);assert.equal(p.state.actors[coach].resources.coins,2);const g=cohortFrameFit(p.state,id);assert.equal(g.active,true);assert.equal(g.defenseBonus,2);assert.equal(g.blockStrength,4);assert.equal(g.blockChance,.4);assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry),p.state);assert.throws(()=>bookCohortGear(p,registry,context(p),id,'build'),/existing actual frame/);
});
test('unbuckling removes the real native terms while keeping custody; fitting the existing piece restores them without another item',()=>{
 let p=ready();bookCohortGear(p,registry,context(p),id,'build');p=advance(p,30);const worn=cohortFramePreview(p.state,id);assert.equal(worn.opponents[0].currentDamage,1);assert.equal(worn.opponents[0].fittedDamage,1);bookCohortGear(p,registry,context(p),id,'park');p=advance(p,2);assert.equal(cohortFrameFit(p.state,id).active,false);assert.equal(p.state.simulation.owners[id][FEATURE_HARNESS],1);const loose=cohortFramePreview(p.state,id);assert.equal(loose.opponents[0].currentDamage,2);assert.equal(loose.opponents[0].fittedDamage,1);bookCohortGear(p,registry,context(p),id,'fit');p=advance(p,15);assert.equal(cohortFrameFit(p.state,id).active,true);assert.equal(p.state.simulation.owners[id][FEATURE_HARNESS],1);assert.equal(p.state.actors[S].resources['home.estateFunds'],24);
});
test('current body mechanics, shape, actual equipment custody and physical training control fit rather than the actor label',()=>{
 let p=ready();bookCohortGear(p,registry,context(p),id,'build');p=advance(p,30);const baseline=structuredClone(p.state);for(const variant of ['hands','shape','form','mobile','training','stock','custody']){const s=structuredClone(baseline);if(variant==='hands')s.simulation.people[id].body.hands=1;if(variant==='shape')s.simulation.people[id].body.frameBuild='broad';if(variant==='form')s.simulation.people[id].body.form='bird';if(variant==='mobile')s.simulation.people[id].body.mobile=false;if(variant==='training')s.actors[id].resources['cohort.training']=0;if(variant==='stock')delete s.simulation.owners[id][FEATURE_HARNESS];if(variant==='custody')s.simulation.custody.borrowed={holder:id,key:FEATURE_HARNESS};assert.equal(cohortFrameFit(s,id).active,false,variant);}p.state.simulation.people[id].body.cohortTempering=3;assert.equal(cohortFrameFit(p.state,id).blockChance,.6);p.state.simulation.people[id].body.id='a-different-but-equally-shaped-human';assert.equal(cohortFrameFit(p.state,id).active,true,'ordinary straps fit an equally shaped instructed human body');
});
test('cancellation or another body arriving during the job refunds all actual reservations and produces no frame',()=>{
 for(const changed of [false,true]){let p=ready();const j=bookCohortGear(p,registry,context(p),id,'build');if(changed){p.state.simulation.people[id].body.id='another-body';p=advance(p,30);}else p=cancelSimulationJob(p.state,registry,j.id,{...context(p),actorId:id});assert.equal(p.state.simulation.owners[id][FEATURE_HARNESS]||0,0);assert.equal(p.state.simulation.equipment[id]?.field_frame,undefined);assert.equal(p.gameplay.player.inventory[FEATURE_KIT],2);assert.equal(p.gameplay.player.inventory[FEATURE_LOG],2);assert.equal(p.state.actors[S].resources['home.estateFunds'],30);assert.equal(p.state.actors[id].resources['home.wages']||0,0);}
});

test('the live fixed-instructor preview includes the native next-strike exhaustion boundary',()=>{
 const p=ready();assert.equal(cohortFramePreview(p.state,id).opponents[0].attack,2);for(const stamina of [1,0]){p.state.simulation.people[coach].vitals.stamina=stamina;const q=cohortFramePreview(p.state,id).opponents[0];assert.equal(q.attack,1);assert.equal(q.currentDamage,1);assert.equal(q.fittedDamage,1);}
});
