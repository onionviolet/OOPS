import {featureCostText} from './feature_expansion_host.js';
import {NESTED_MISSIONS,nestedDefinitions} from './feature_expansion_nested_content.js';
const number=n=>Math.abs(n);
export function playerOfferCostText(costs=[],minutes=0){
 const terms=[];
 for(const c of costs){
  const actor=c.actor||'$actor',player=['player','$actor'].includes(actor);
  if(c.type==='resource'&&['nested.credit','money'].includes(c.key)){
   terms.push(`${player?'Pay':'Provider reserves'} ${number(c.amount)} ${c.key==='nested.credit'?'hub credits':'coins'}`);continue;
  }
  if(!player&&c.type!=='transfer'){
   if(c.type==='item')terms.push(`Provider supplies ${featureCostText([c])}`);
   else if(c.type==='vital')terms.push('Requires the participant’s available body support.');
   else terms.push('Requires the participant’s agreed attention and available time.');
   continue;
  }
  const text=featureCostText([c]);if(text)terms.push(text);
 }
 terms.push(`${Math.max(0,minutes||0)} played minutes`);return [...new Set(terms)].join(' · ');
}
export function qualifyNestedInkCosts(host){
 const preview=host.preview;
 return {...host,preview(state,registry,binding,context){
  const quote=preview(state,registry,binding,context);
  if(!quote.visible)return quote;
  const definition=registry.simulation.commands.get(binding.id)||nestedDefinitions.commands.find(d=>d.id===binding.id);
  const costs=quote.costs||definition?.costs||[];
  let text=playerOfferCostText(costs,quote.duration??definition?.duration??0);
  if(binding.id==='nested.mission.extend'){
   const mission=NESTED_MISSIONS.find(m=>m.id===state.nestedCampaign?.mission?.id);
   if(mission)text=`Pay ${mission.extensionCost} hub credits · add ${mission.extension} declared local minutes to this accepted return deadline`;
  }
  return {...quote,costText:text};
 }};
}
