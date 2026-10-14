import {createExpansionState} from '../../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry} from '../../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from '../../src/simulation.js';
import {createStreams} from '../../src/seeded_streams.js';
import {createGeneratedPeople,interactGeneratedPerson} from '../../src/generated_people.js';
import {planStoryRequest} from '../../src/story_requests.js';
export function spineFixture(seed=43) {
 const context={actorId:'player',facts:{location:'Village','village.elderMet':true},external:{money:102},gameplay:{player:{inventory:{},skills:{Perception:{xp:0,enabled:true},'Pest killing':{xp:0,enabled:true}},reputation:{}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
 let state=initializeExpedition(createExpansionState(seed));state.streams=createStreams(seed);
 state=enrollSimulation(state,expeditionRegistry,context).state;
 state=commitSimulationCommand(state,expeditionRegistry,{id:'village.storylets.begin'},context).state;
 let people=createGeneratedPeople(seed,0,[],state);
 for(const p of people.people.slice(0,2))people=interactGeneratedPerson(people,p.id,'meet').state;
 let envelope={'game version':'v0.6','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'TEST FIXTURE PROCGEN P34 SOURCE',money:102,xp:{total_xp:0},equipment:{}},levels:{person:{main_character:{total_xp:0,skill_xp:{}}}},availabilities:{},npcs:{},inventories:{person:{main_character:{}}},skills:{},locations:{},activities:{},dialogues:{},traders:{},expansion:state,generated_people:people};
 envelope=planStoryRequest(envelope,{action:'enable'}).envelope;
 return {envelope,context,registry:expeditionRegistry};
}
