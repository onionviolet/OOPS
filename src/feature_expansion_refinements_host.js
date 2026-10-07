import {paradiseCampaignDepthPresentation} from './book_world_paradise_campaign_host.js';
import {paradisePresentation} from './book_world_paradise_host.js';
import {molPresentation} from './book_world_mol_host.js';
import {nestedLifePresentation} from './feature_expansion_nested_life.js';
import {playerOfferCostText} from './feature_expansion_presentation_costs.js';
// Observer-safe composition of actual host offers and player-addressed accounts.
import {nestedPresentation} from './feature_expansion_nested_host.js';
import {nestedChainPresentation} from './feature_expansion_nested_chains_host.js';
import {nestedCarrierKnowledge} from './feature_expansion_nested_carriers.js';
import {projectHubCampaignLegibility,projectActionLegibility} from './action_legibility.js';
const account=(id,r)=>({known:true,id,text:r.value??r.text,at:r.at,cause:r.cause,basis:r.basis,recipientId:'player',observerId:'player'});
function publicReason(value){
 const text=typeof value==='string'?value:value?.text||'';
 if(/nested\.credit/.test(text))return 'This action needs the stated available hub credits.';
 if(/book\.paradise\.(coin|belli)/.test(text))return 'This action needs the agreed participant’s available payment.';
 if(/book\.paradise\.(attention|agenda)/.test(text))return 'The participant needs their current consent and available time.';
 if(/book\.mol\.crowns/.test(text))return 'This action needs the agreed available local crowns.';
 if(/book\.mol\.(deviceFuel|personalMana)/.test(text))return 'The actual device or casting source needs its stated available fuel.';
 if(/book\.mol\.attention/.test(text))return 'The participant needs their current consent and available time.';
 if(/nested\.(attention|agenda)/.test(text))return 'The participant needs their current consent and available time.';
 if(/stale|revision|snapshot/i.test(text))return 'This offer changed. Review it again.';
 if(/^(Requires |Invalid |Missing |Unknown |Unsupported |Bind )/.test(text))return 'This offer needs its current supported body, place, means and agreement. Review the disclosed terms.';
 return text;
}
function qualifiedAction(action,state,registry,context){
 const id=action.id,definition=registry.simulation.commands.get(id),rawReasons=(action.reasons||[]).map(r=>typeof r==='string'?r:r?.text||'').filter(Boolean);
 const terms=[playerOfferCostText(definition?.costs||action.costs||[],action.duration??definition?.duration??0),definition?.cancellation==='refund'?'Cancel accepted work to return its reserved inputs.':''].filter(Boolean).join(' · ');
 return {known:true,recipientId:'player',id,label:action.label,description:action.description||definition?.description||'',
  preview:{visible:true,eligible:action.eligible,reasons:rawReasons},context,command:{...action.command,sequence:state.sequence},
  disclosure:{costs:terms?[{known:true,text:terms}]:[],reasons:rawReasons.map(match=>({known:true,match,text:publicReason(match)}))}};
}
export function refinementPresentation(snapshot,registry,{base,relayHost,referenceDeskHost,replacementContext}){
 const {state,context}=snapshot,view=base(snapshot,registry),sections=[...view.sections],actual=replacementContext();
 const relay=relayHost.presentation(state,registry,actual);
 if(relay.visible)sections.push({...relay,actions:[...relay.officeActions,...relay.actions],records:relay.records});
 const reference=referenceDeskHost.presentation(state,registry,actual);if(reference.visible)sections.push(reference);
 const life=nestedLifePresentation(state,registry,context);sections.push(...life.sections);
 const book=paradisePresentation(state,registry,context);sections.push(...book.sections);
 const mol=molPresentation(state,registry,context);sections.push(...mol.sections);
 const paradiseDepth=paradiseCampaignDepthPresentation(state,registry,context);sections.push(...paradiseDepth.sections);
 const nested=nestedPresentation(state,registry,context),chainView=nestedChainPresentation(state,registry,context);
 if(nested.visible){
  const known=state.simulation?.knowledge.player||{},visible=nested.actions.filter(a=>a.visible);
  const actions=visible.map(a=>qualifiedAction({...a,command:{type:'nested_campaign',id:a.id}},state,registry,context));
  const received=Object.entries(known).filter(([key])=>key.startsWith('nested.')&&!key.startsWith('nested.chain.')&&!key.startsWith('nested.life.'));
  const records=received.map(([id,r])=>account(id,r));
  if(state.nestedCampaign){
   const route=state.nestedCampaign.connections.find(c=>c.from.worldId===state.actors.player.worldId||c.to.worldId===state.actors.player.worldId);
   if(route)try{const evidence=nestedCarrierKnowledge(state,context,route,route.from.worldId===state.actors.player.worldId?'forward':'reverse');
    if(evidence.visible)for(const row of evidence.records)if(!records.some(r=>r.id===row.id))records.push({known:true,recipientId:'player',observerId:'player',...row});
   }catch{/* The real action quote reports an unsupported or stale route. */}
  }
  const missionRows=[];
  for(const record of [state.nestedCampaign?.mission,...(state.nestedCampaign?.history||[])].filter(Boolean)){
   const offer=known[`nested.offer.${record.id}`];if(!offer)continue;
   const def=nested.mission?.id===record.id?nested.mission.terms:null;
   const stages=['accepted','arrival','outcome','extension','extraction','recovery','returned'].flatMap(stage=>{
    const key=`nested.${stage}.${record.id}`,r=known[key];return r?[{...account(key,r),occurred:true}]:[];
   });
   if(record.id===nested.mission?.id&&known[`nested.arrival.${record.id}`]&&record.extraction&&record.stage==='extracting'){
    const stage=record.extraction.phase;
    stages.push({known:true,id:`${record.id}.current_extraction`,recipientId:'player',observerId:'player',current:true,
     text:stage==='ready'?'Extraction preparation is ready. Actual hub arrival remains a separate passage.':stage==='interrupted'?'The attempted route is interrupted. Repair it through its current declared recovery offer.':stage==='recovered'?'The selected route was repaired; its remaining preparation still uses the played local clock.':'Extraction preparation is in progress. Your body is still in the destination.',at:state.clock});
   }
   const settled=known[`nested.settled.${record.id}`];
   missionRows.push({known:true,recipientId:'player',id:record.id,label:def?.label||'Remembered issued contract',terms:[{known:true,text:offer.value}],
    objectives:def&&known[`nested.arrival.${record.id}`]?[{known:true,scope:'issuer',text:def.objective}]:[],stages,
    clocks:def&&nested.mission.remaining!=null?[{known:true,id:`${record.id}.return_clock`,label:'Accepted local return deadline',remainingMinutes:nested.mission.remaining,at:state.clock,policy:{known:true,text:'Only played residence advances this destination clock. Unsupported absence is frozen.'}}]:[],
    settlements:settled?[{...account(`nested.settled.${record.id}`,settled),occurred:true}]:[],
    actions:record.id===nested.mission?.id?actions.filter(a=>a.id.startsWith('nested.mission.')||a.id.startsWith('nested.extraction.')):[]});
  }
  const chains=chainView.sections.map(section=>({known:true,recipientId:'player',id:section.id,label:section.label,
   links:section.records.filter(r=>!r.id.endsWith('.revisit')&&!r.id.endsWith('.later')).map(r=>account(r.id,r)),
   closures:section.records.filter(r=>r.id.endsWith('.revisit')||r.id.endsWith('.later')).map(r=>({...account(r.id,r),occurred:true})),
   actions:section.actions.map(a=>qualifiedAction(a,state,registry,context))}));
  const people=Object.fromEntries(chainView.records.filter(r=>r.basis?.attributedTo).map(r=>[r.basis.attributedTo,{known:true,label:registry.simulation.people.get(r.basis.attributedTo)?.label||'Reported participant'}]));
  const groups=projectHubCampaignLegibility({people,hub:{known:true,recipientId:'player',id:'nested.campaign',label:nested.label,
   accounts:records,actions:actions.filter(a=>!state.nestedCampaign?.mission||!a.id.startsWith('nested.mission.')&&!a.id.startsWith('nested.extraction.'))},missions:missionRows,chains}).groups;
  for(const group of groups)sections.push({id:group.id,label:group.label,description:group.id==='nested.campaign'?`${nested.description}${state.nestedCampaign?` You hold ${nested.credits} hub credits.`:''}${state.actors.player.facts['nested.personal.active']?' This is your personal visit; no active mission or settlement is attached.':''}`:'Received accounts and actual current offers.',
   work:chainView.sections.find(s=>s.id===group.id)?.work||'',actions:group.actions.map(row=>({id:row.id,label:row.label,command:row.command,eligible:row.control.enabled,legibility:row})),
   records:group.aftermath.map(r=>({id:r.id,text:[r.basisLabel,r.sourceLabel,r.text,r.timeText].filter(Boolean).join(' · ')}))});
 }
 for(const section of sections)for(const action of section.actions||[])if(!action.legibility){
  const a=qualifiedAction(action,state,registry,action.command?.type==='backlog'?actual:context);action.command=a.command;
  action.legibility=projectActionLegibility({id:a.id,label:a.label,description:a.description,discovered:true,preview:a.preview,context:a.context,disclosure:a.disclosure});
 }
 return {visible:sections.length>0,sections};
}
