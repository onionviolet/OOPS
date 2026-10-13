// Controlled source fixture: actual chart/enrollment/entry with registered owner snapshots.
// This supplies counted fixture goods only and is not natural browser proof.
import {createExpansionState,advanceSimulation} from '../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry,initializeExpedition} from '../../../../../src/expedition_content.js';
import {commitNestedCommand,previewNestedCommand,nestedContext} from '../../../../../src/feature_expansion_nested_host.js';
import {previewNestedLifeCommand,commitNestedLifeCommand,nestedLifeContext} from '../../../../../src/feature_expansion_nested_life.js';
import {createNestedInkHost} from '../../../../../src/ink_scene_content.js';
import {NESTED_IDS as I,NESTED_LOCATIONS as L,NESTED_KEYS as K,NESTED_FOOTPRINTS,NESTED_NATIVE_STOCK} from '../../../../../src/feature_expansion_nested_content.js';
export {registry,I,L,K};
export function ctx(p,extra={}) {return {actorId:'player',worldId:p.state.actors.player.worldId,external:p.external,gameplay:p.gameplay,equipment:p.equipment||Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),frontierLocationOwner:{id:'Village',available:true},vitals:p.vitals,nativeAlive:true,nestedNative:{bound:true,revision:p.state.nestedCampaign?.nativeRevision||0,body:{id:'native.player.body',form:'human'},stock:structuredClone(NESTED_NATIVE_STOCK),endpointBindings:[{endpoint:{worldId:'base.frontier',instanceId:'frontier.main',regionId:'frontier.village',layerId:'surface'},available:true,positions:[{id:'gate.arrival',free:true,bodyForms:['human']}]},...NESTED_FOOTPRINTS.map(f=>({endpoint:structuredClone(f.endpoint),available:true,positions:[{id:'gate.arrival',free:true,bodyForms:['human']}]}))]},facts:{location:p.state.simulation?.people.player.location||'Village','village.elderMet':true},...extra};}
let fixtureSnapshot;
export function fixture(){if(fixtureSnapshot)return structuredClone(fixtureSnapshot);let p={state:initializeExpedition(createExpansionState(311)),external:{money:30},gameplay:{player:{inventory:{[K.log]:2,[K.rope]:2},skills:{},reputation:{}},oldCraftsman:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}};
 p=commitNestedCommand(p.state,registry,'nested.chart',ctx(p));p=commitNestedCommand(p.state,registry,'nested.enroll',ctx(p));
 // The normal native enrollment wrapper admits expansion7 before publication.
 p.state.schema=7;
 p.vitals={...p.vitals,...Object.fromEntries(Object.entries(p.state.simulation.people).filter(([,v])=>v.vitals).map(([id,v])=>[id,structuredClone(v.vitals)]))};
 p=commitNestedCommand(p.state,registry,'nested.enter_hub',ctx(p));fixtureSnapshot=structuredClone(p);return p;}
export const host=p=>createNestedInkHost({state:p.state,registry,context:ctx(p),sceneId:'nested.hub',previewNative:previewNestedCommand,commitNative:commitNestedCommand,previewLife:previewNestedLifeCommand,commitLife:commitNestedLifeCommand});
export const life=(p,id)=>commitNestedLifeCommand(p.state,registry,{type:'nested_life',id:`nested.life.lin.${id}`},ctx(p));
export function advance(p,n){const contexts=Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...nestedLifeContext(p.state,nestedContext(p.state,ctx(p))),actorId:id,vitals:p.vitals[id]||p.state.simulation.people[id].vitals}]));const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts);return {...out,vitals:out.vitals||structuredClone(p.vitals)};}
