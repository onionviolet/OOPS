import {qualifyNestedInkCosts} from './feature_expansion_presentation_costs.js';
// Current native contacts select independent instance/mission conversations.
// Cursor/content/acceptance remain owned by Ink and the normal durable host.
import {createNestedInkHost} from './ink_scene_content.js';
import {createInkNarrativeUI} from './ink_narrative_ui.js';
import {inkNarrativeView} from './ink_narrative.js';
import {NESTED_IDS,NESTED_LOCATIONS} from './feature_expansion_nested_content.js';
export function createNestedInkPanels({read,registry,previewNative,commitNative,command}){
 const element=document.createElement('details');element.id='nested_ink_panel';element.className='expedition_panel';
 const summary=document.createElement('summary');summary.textContent='Local conversations and return accounts';element.append(summary);
 document.getElementById('location_actions_div')?.append(element);const panels=new Map();
 function render(){
  const snapshot=read(),{state,context}=snapshot,d=state.nestedCampaign,world=state.actors.player.worldId,location=context.facts?.location,specs=[];
  if(d&&world===NESTED_IDS.hub){
   specs.push({sceneId:'nested.hub'});
   if(location===NESTED_LOCATIONS.hub){
    for(const offer of d.offers)if(state.simulation.knowledge.player?.[`nested.offer.${offer.id}`])specs.push({sceneId:'nested.offer',missionId:offer.id});
    for(const mission of [d.mission,...d.history].filter(Boolean))if(['returned','settled'].includes(mission.stage))specs.push({sceneId:'nested.return',missionId:mission.id});
   }
  }else if(d?.mission&&[NESTED_IDS.salt,NESTED_IDS.archive].includes(world)&&['arrived','outcome','extracting'].includes(d.mission.stage))specs.push({sceneId:'nested.mission',missionId:d.mission.id});
  const shown=new Set();
  for(const spec of specs){
   const key=`${spec.sceneId}.${spec.missionId||'hub'}.${location}`,getHost=()=>{const fresh=read();return qualifyNestedInkCosts(createNestedInkHost({...spec,state:fresh.state,context:fresh.context,registry,previewNative,commitNative}));};
   try{getHost();}catch{continue;}shown.add(key);
   let panel=panels.get(key);
   if(!panel){
    panel=createInkNarrativeUI({panelId:`ink_nested_${key.replaceAll(/[^a-z0-9_]/gi,'_')}`,
     read:()=>{const fresh=read();let host;try{host=getHost();}catch{return {visible:false,paragraphs:[],choices:[],actions:[]};}
      const view=inkNarrativeView(fresh.state,registry,fresh.context,host),enabled=fresh.canWrite&&!fresh.error;
      return {...view,choices:view.choices?.map(c=>({...c,eligible:enabled&&c.eligible})),actions:view.actions?.map(a=>({...a,eligible:enabled&&a.eligible}))};},
     act:(id,token)=>command(id,token,getHost()),choose:(id,token)=>command(id,token,getHost())});
    element.append(panel.element);panels.set(key,panel);
   }
   panel.render();
  }
  for(const [key,panel] of panels)if(!shown.has(key))panel.element.hidden=true;
  element.hidden=!shown.size;
 }
 render();return {element,render};
}
