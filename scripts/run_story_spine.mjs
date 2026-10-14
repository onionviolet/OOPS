import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {spineFixture} from '../tests/helpers/story_spine.js';
import {planStoryRequest} from '../src/story_requests.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {respondSimulationEvent,waitingSimulationChoice} from '../src/simulation.js';
import {validateStoryletState} from '../src/storylet_deck.js';
export function runSeededStory(seed=43,{chunk=3600,reload=false,minutes=3600}={}) {
 const f=spineFixture(seed);let envelope=planStoryRequest(f.envelope,{action:'raise'}).envelope;const request=envelope.generated_people.storyRequests.requests[0];
 envelope=planStoryRequest(envelope,{action:'take',id:request.id}).envelope;
 envelope.inventories.person.main_character[JSON.stringify({id:request.item})]={count:1};
 envelope=planStoryRequest(envelope,{action:'deliver',id:request.id,itemKey:JSON.stringify({id:request.item})}).envelope;
 let out={state:envelope.expansion,external:{money:envelope.character.money},gameplay:structuredClone(f.context.gameplay)},budgetReturns=0,calls=0;
 function advanceTo(target){
  while(out.state.clock<target) {
   const before=out.state.clock;out=advanceSimulation(out.state,f.registry,Math.min(chunk,target-before),out.external,out.gameplay,{player:{...f.context,external:out.external,gameplay:out.gameplay}});calls++;
   assert.equal(out.stoppedAtChoice,false,'Generated decisions must remain nonblocking.');assert.ok(out.state.clock>before,'Scheduler must consume time or report a real gate.');
   if(out.budgetExhausted){budgetReturns++;assert.ok(out.remaining>0);}
   if(reload){out.state=loadExpansionState(JSON.parse(JSON.stringify(out.state)),f.registry);validateStoryletState(out.state);}
   assert.ok(calls<5000,'Scheduler continuation bounded.');
  }
 }
 advanceTo(60);const event=Object.values(out.state.simulation.events).find(e=>e.definitionId==='village.remembered_supply'&&e.status==='open');assert.ok(event,'Actual deed must make an aftermath eligible.');
 out=respondSimulationEvent(out.state,f.registry,event.id,'listen',{...f.context,external:out.external,gameplay:out.gameplay});
 advanceTo(minutes);assert.equal(waitingSimulationChoice(out.state),undefined);
 return {seed,projection:{receipts:out.state.loreHistory.receipts,draws:out.state.streams,decks:out.state.simulation.decks,money:out.external.money,inventory:out.gameplay.player.inventory,skills:out.gameplay.player.skills,clock:out.state.clock},budgetReturns,calls};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const a=runSeededStory(),b=runSeededStory();assert.deepEqual(a,b);console.log(JSON.stringify({label:'SOURCE',seed:a.seed,playedMinutes:a.projection.clock,receipts:a.projection.receipts.length,budgetReturns:a.budgetReturns,calls:a.calls,sameSeedExact:true}));}
