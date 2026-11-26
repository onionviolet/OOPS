// Ch129–130 response loan: physical ownership and the lender's individual release.
// Old authored scalar units are recognized by this exact episode, not by a generic resource migration.
import {CHARM_MENTOR_ID} from './lotm_charm_upkeep.js';
import {CHARM_REPLACEMENT_KEY,CHARM_LOAN_KEY} from './lotm_charm_loan.js';
import {defineLotmActs} from './lotm_act_engine.js';
import {createSimulationRegistry} from './simulation_contracts.js';
export const RESPONSE_LOAN_ID='lotm.charm.swain-response.loan';
export const RESPONSE_CHARM=JSON.stringify({id:'book.lotm.response_slumber_charm'});
export const NEIL_RESPONSE_CHARM=JSON.stringify({id:'book.lotm.neil_response_slumber_charm'});
export const RESPONSE_SCALAR='book.lotm.kj3ba.slumber-charm';
export const RESPONSE_BORROW='book.lotm.kj3ba.borrow-charm';
export const RESPONSE_NEIL_USE='book.lotm.kj3ba.watch-neil-slow-it';
export const RESPONSE_USE='book.lotm.kj3ba.throw-slumber';
export const RESPONSE_HOME='book.lotm.kj3bb.go-home';
export const RESPONSE_RELEASE='lotm.craft.response-charm-release';
export const RESPONSE_KEEP='lotm.craft.response-charm-keep-promise';
export const RESPONSE_REPLACE='lotm.craft.response-charm-replace';
export const RESPONSE_RETURN='lotm.craft.response-charm-return';
export const RESPONSE_REBORROW='lotm.craft.response-charm-reborrow';
export const RESPONSE_INTENT='lotm.charm.response.compensation-intent';
const STATE='book.lotm.kj3ba.charm-loan',VERSION='lotm.charm.response.physical';
const SWAIN='lotm.person.cast-bee85a570706987a115c';
// These source actions physically take the colleagues away from their ordinary
// schedule. The visit ends at the source home departure, with no new location store.
export function responseCaseVisitors(state,visiting=new Set()){
 const completed=state.actors?.player?.completed||{};
 if(completed['book.lotm.kj3ba.follow-swain']&&!completed[RESPONSE_HOME])for(const id of [CHARM_MENTOR_ID,SWAIN])visiting.add(id);
 return visiting;
}
export const responseCharmItems=[['response_slumber_charm','Old Neil’s response Slumber charm','Lent for the shared response. Return or replace it, unless Old Neil releases that obligation.'],
 ['neil_response_slumber_charm','Old Neil’s own response charm','The other Slumber charm Old Neil brings to the response.']];
const knownProgress=state=>['replace if used','one replacement owed to Old Neil'].includes(state?.actors?.player?.facts?.[STATE]);
const legacyPending=(state,actor)=>(state.simulation.jobs||[]).some(job=>job.effects?.some(effect=>{const who=effect.actor==='$target'?job.context?.targetId:effect.actor==='$actor'?job.actorId:effect.actor||job.actorId;return effect.type==='resource'&&effect.key===RESPONSE_SCALAR&&effect.amount<0&&who===actor;}));
// Atomic plan-only reclassification: scalar -> item, no acquisition/reward, money or fresh source grant.
export function normalizeResponseLoanPlan(plan,{cause='lotm.response.saved-binding'}={}){
 const s=plan.state||{},player=s.actors?.player,neil=s.actors?.[CHARM_MENTOR_ID],sim=s.simulation,stock=plan.gameplay?.player?.inventory;
 if(!knownProgress(s)||!stock||!neil||!sim?.people?.[CHARM_MENTOR_ID]||player.worldId!=='book.lotm.tingen'||neil.worldId!==player.worldId)return false;
 const a=player.resources?.[RESPONSE_SCALAR]||0,b=neil.resources?.[RESPONSE_SCALAR]||0;
 if(![a,b].every(value=>Number.isInteger(value)&&value>=0&&value<=1)||!((player.completed?.[RESPONSE_BORROW]||0)>0||sim.knowledge?.player?.[RESPONSE_BORROW+'.seen']))return false;
 const prior=sim.custody[RESPONSE_LOAN_ID];
 if(prior&&(prior.owner!==CHARM_MENTOR_ID||prior.holder!=='player'||prior.key!==RESPONSE_CHARM||prior.count!==1||prior.equivalentKey!=null&&prior.equivalentKey!==CHARM_REPLACEMENT_KEY))return false;
 const homeSeen=(player.completed?.[RESPONSE_HOME]||0)>0||sim.knowledge?.player?.[RESPONSE_HOME+'.seen'];
 let changed=false;
 // Reclassify the other witnessed unit even when the old save already contains the later assurance.
 if(b===1&&!legacyPending(s,CHARM_MENTOR_ID)&&!(sim.owners[CHARM_MENTOR_ID]?.[NEIL_RESPONSE_CHARM]>0)){
  (sim.owners[CHARM_MENTOR_ID]||={})[NEIL_RESPONSE_CHARM]=1;neil.resources[RESPONSE_SCALAR]=0;changed=true;
 }
 if(player.facts[STATE]==='one replacement owed to Old Neil'&&a===0&&homeSeen&&player.facts['lotm.charm.response.choice']!=='continue'){
  delete sim.custody[RESPONSE_LOAN_ID];player.facts[STATE]='released by Old Neil';player.facts['lotm.charm.response.choice']='released';
  neil.facts||={};neil.facts[RESPONSE_INTENT]='Intends to ask Swain later; no agreement, amount or collection recorded.';neil.facts[RESPONSE_INTENT+'.counterparty']=SWAIN;player.facts[VERSION]=1;return true;
 }
 if(a===1&&!legacyPending(s,'player')&&!prior&&!(stock[RESPONSE_CHARM]>0)){
  stock[RESPONSE_CHARM]=1;player.resources[RESPONSE_SCALAR]=0;changed=true;
 }
 const held=stock[RESPONSE_CHARM]||0,consumed=player.facts[STATE]==='one replacement owed to Old Neil'&&a===0;
 if(!prior&&(held===1||consumed)){
  sim.custody[RESPONSE_LOAN_ID]={owner:CHARM_MENTOR_ID,holder:'player',key:RESPONSE_CHARM,count:1,at:s.clock,cause,equivalentKey:CHARM_REPLACEMENT_KEY};changed=true;
 }
 if(changed)player.facts[VERSION]=1;return changed;
}
export function normalizeResponseLoanEnvelope(save){
 const stock=save.inventories?.person?.main_character;if(!stock)return false;
 const inventory=Object.fromEntries(Object.entries(stock).map(([key,row])=>[key,row.count]));
 const changed=normalizeResponseLoanPlan({state:save.expansion,gameplay:{player:{inventory}}});
 if(changed)for(const key of [RESPONSE_CHARM])if(inventory[key]>0)stock[key]={...(stock[key]||{}),count:inventory[key]};return changed;
}
const mapRule=(rule,fn)=>!rule?rule:rule.fact?fn(rule):{...rule,...(rule.all?{all:rule.all.map(r=>mapRule(r,fn))}:{}),...(rule.any?{any:rule.any.map(r=>mapRule(r,fn))}:{}),...(rule.not?{not:mapRule(rule.not,fn)}:{})};
export function bindResponseLoanCommands(commands){
 return commands.map(command=>{
  if(![RESPONSE_BORROW,RESPONSE_NEIL_USE,RESPONSE_USE,RESPONSE_HOME].includes(command.id))return command;
  if(command.id===RESPONSE_BORROW)return {...command,once:true,targetId:CHARM_MENTOR_ID,participants:[...new Set([...(command.participants||[]),CHARM_MENTOR_ID])],coLocated:true,participantsCoLocated:true,
   effects:[...command.effects.filter(effect=>!(effect.type==='resource'&&effect.key===RESPONSE_SCALAR)),{type:'item',actor:CHARM_MENTOR_ID,key:NEIL_RESPONSE_CHARM,amount:1},{type:'item',actor:CHARM_MENTOR_ID,key:RESPONSE_CHARM,amount:1},{type:'custody',from:CHARM_MENTOR_ID,to:'player',key:RESPONSE_CHARM,count:1,loanId:RESPONSE_LOAN_ID,equivalentKey:CHARM_REPLACEMENT_KEY},{type:'fact',scope:'actor',actor:'player',key:VERSION,value:1}]};
  if(command.id===RESPONSE_HOME){const allow=rule=>rule.fact==='actor.'+STATE?{any:['one replacement owed to Old Neil','replacement promised','released by Old Neil','replacement returned'].map(value=>({...rule,value}))}:rule;return {...command,requires:mapRule(command.requires,allow),completionRequires:mapRule(command.completionRequires,allow)};}
  const own=command.id===RESPONSE_NEIL_USE,key=own?NEIL_RESPONSE_CHARM:RESPONSE_CHARM,actor=own?CHARM_MENTOR_ID:'player';
  const scalar=effect=>effect.type==='resource'&&effect.key===RESPONSE_SCALAR&&effect.amount<0;
  const spent=[...command.costs,...command.effects].filter(scalar).reduce((sum,effect)=>sum-effect.amount,0)||1;
  const replace=rule=>rule.fact.endsWith('resource.'+RESPONSE_SCALAR)?{...rule,fact:(own?'target.item.':'item.')+key}:rule;
  const completed=rule=>rule.fact.endsWith('resource.'+RESPONSE_SCALAR)?{fact:'actor.life',op:'eq',value:'alive'}:rule;
  return {...command,costs:[...command.costs.filter(effect=>!scalar(effect)),{type:'item',actor,key,amount:-spent,...(!own?{breakCustody:true}:{})}],effects:command.effects.filter(effect=>!scalar(effect)),requires:mapRule(command.requires,replace),completionRequires:mapRule(command.completionRequires,completed)};
 });
}
export const isResponseLoanJob=id=>[RESPONSE_BORROW,RESPONSE_NEIL_USE,RESPONSE_USE,RESPONSE_HOME].includes(id);
export function responseLoanFacts(state,context={}){
 const loan=state.simulation?.custody?.[RESPONSE_LOAN_ID],held=context.gameplay?.player?.inventory?.[RESPONSE_CHARM]||0;
 return {'charm.response.active':!!loan,'charm.response.held':held,'charm.response.canReborrow':!loan&&(state.simulation?.owners?.[CHARM_MENTOR_ID]?.[RESPONSE_CHARM]||0)>0&&(state.actors?.player?.completed?.[RESPONSE_BORROW]||0)>0,'charm.response.discussable':!!loan&&loan.owner===CHARM_MENTOR_ID&&held===0&&state.actors?.player?.facts?.['book.lotm.kj3ba.emergency']==='resolved'};
}
export function responseLoanView(state,context={}){
 const facts=responseLoanFacts(state,context);return {known:!!loanKnown(state),active:facts['charm.response.active'],held:facts['charm.response.held'],discussable:facts['charm.response.discussable'],choice:state.actors?.player?.facts?.['lotm.charm.response.choice']||'',intent:state.actors?.[CHARM_MENTOR_ID]?.facts?.[RESPONSE_INTENT]||''};
}
const loanKnown=state=>(state.actors?.player?.completed?.[RESPONSE_BORROW]||0)>0||state.simulation?.custody?.[RESPONSE_LOAN_ID];
export function responseChoiceActs(){
 const eq=(fact,value,reason)=>({fact,op:'eq',value,reason}),mentor=eq('charm.slumber.mentorAvailable',true,'Meet Old Neil here while he is awake.'),ready=eq('charm.response.discussable',true,'Discuss the consumed response charm after the shared emergency is resolved.');
 const fact=(actor,key,value)=>({type:'fact',scope:'actor',actor,key,value});
 const row=(id,label,step)=>({id,kind:'item_use',label,sourceIds:['lotm.rule.lender-release-and-compensation-intent'],locators:['zh 第130章 p30'],steps:[{id:step,kind:'use',text:label}],eligibility:null,inputs:[],effects:[]});
 const binding=(label,report,effects)=>({place:null,visibleWhen:eq('charm.response.active',true,'No response loan is open.'),support:{all:[mentor,ready]},inputs:{},steps:{agree:{minutes:1,label,description:report,costText:'A conversation with the actual lender; no money or stock changes',reportKey:'book.lotm.history.response-creditor',report,effects}}});
 const release={type:'custody',operation:'release',actor:CHARM_MENTOR_ID,from:'player',to:CHARM_MENTOR_ID,key:RESPONSE_CHARM,count:1,loanId:RESPONSE_LOAN_ID};
 const bindings={
  [RESPONSE_RETURN]:{place:null,visibleWhen:eq('charm.response.active',true,'No response loan is open.'),support:{all:[mentor,{fact:'charm.response.held',op:'gte',value:1,reason:'The borrowed response charm is no longer unused.'}]},inputs:{},steps:{agree:{minutes:1,label:'Return the unused response charm',description:'Hand the same unused Slumber charm back to Old Neil.',costText:'The same unused charm; no replacement or money',reportKey:'book.lotm.history.response-returned',report:'You return the unused response charm to Old Neil.',effects:[{type:'custody',from:'player',to:CHARM_MENTOR_ID,key:RESPONSE_CHARM,count:1,loanId:RESPONSE_LOAN_ID,returning:true},fact('player',STATE,'returned unused'),fact('player','lotm.charm.response.choice','returned-unused')]}}},
  [RESPONSE_REBORROW]:{place:null,visibleWhen:eq('charm.response.canReborrow',true,'No returned response charm is available.'),support:{all:[mentor,eq('charm.response.canReborrow',true,'No returned response charm is available.')]},inputs:{},steps:{agree:{minutes:1,label:'Borrow the returned response charm again',description:'Ask Old Neil for the same available response charm.',costText:'The actual returned charm, with its replacement promise',reportKey:'book.lotm.history.response-reborrowed',report:'Old Neil lends the returned response charm to you again.',effects:[{type:'custody',from:CHARM_MENTOR_ID,to:'player',key:RESPONSE_CHARM,count:1,loanId:RESPONSE_LOAN_ID,equivalentKey:CHARM_REPLACEMENT_KEY},fact('player',STATE,'replace if used'),fact('player','lotm.charm.response.choice','')]}}},
  [RESPONSE_RELEASE]:binding('Ask Old Neil to handle the used charm’s cost','Old Neil releases your replacement obligation. He intends to speak to Swain later, when the moment is suitable; no compensation has been agreed or collected.',[release,fact('player',STATE,'released by Old Neil'),fact('player','lotm.charm.response.choice','released'),fact(CHARM_MENTOR_ID,RESPONSE_INTENT,'Intends to ask Swain later; no agreement, amount or collection recorded.'),fact(CHARM_MENTOR_ID,RESPONSE_INTENT+'.counterparty',SWAIN)]),
  [RESPONSE_KEEP]:binding('Keep your promise to replace the charm','You keep the replacement promise. Old Neil has not received a replacement, and no money changes hands.',[fact('player',STATE,'replacement promised'),fact('player','lotm.charm.response.choice','continue')]),
  [RESPONSE_REPLACE]:{place:null,visibleWhen:eq('charm.response.active',true,'No response loan is open.'),support:{all:[mentor,eq('charm.response.active',true,'This loan is already settled.'),eq('charm.response.held',0,'Return the unused borrowed charm rather than replace it.'),{fact:'item.'+CHARM_REPLACEMENT_KEY,op:'gte',value:1,reason:'Bring an owned Slumber charm as the replacement.'}]},inputs:{},steps:{agree:{minutes:1,label:'Return a replacement for the response charm',description:'Give Old Neil one owned Slumber charm in kind.',costText:'One owned Slumber charm',reportKey:'book.lotm.history.response-replaced',report:'Old Neil receives the replacement. This response loan is settled.',effects:[{type:'custody',from:'player',to:CHARM_MENTOR_ID,key:RESPONSE_CHARM,count:1,loanId:RESPONSE_LOAN_ID,returning:true,replacementKey:CHARM_REPLACEMENT_KEY},{type:'item',actor:CHARM_MENTOR_ID,key:CHARM_REPLACEMENT_KEY,amount:-1},{type:'item',actor:CHARM_MENTOR_ID,key:CHARM_LOAN_KEY,amount:1},fact('player',STATE,'replacement returned'),fact('player','lotm.charm.response.choice','replaced')]}}}
 };
 return {rows:[row(RESPONSE_RELEASE,'Discuss the response charm','agree'),row(RESPONSE_KEEP,'Continue replacing the response charm','agree'),row(RESPONSE_REPLACE,'Replace the response charm','agree'),row(RESPONSE_RETURN,'Return the unused response charm','agree'),row(RESPONSE_REBORROW,'Borrow the returned response charm','agree')],bindings};
}
export function withResponseChoiceParticipants(compiled){
 return {...compiled,commands:compiled.commands.map(command=>RESPONSE_CHOICE_COMMANDS.includes(command.id)?{...command,participants:[...new Set([...(command.participants||[]),CHARM_MENTOR_ID])],participantsCoLocated:true}:command)};
}
const RESPONSE_CHOICE_COMMANDS=Object.freeze([RESPONSE_RELEASE,RESPONSE_KEEP,RESPONSE_REPLACE,RESPONSE_RETURN,RESPONSE_REBORROW].map(id=>id+'.agree'));
// Decode may validate before the private actor source arrives. Retain public
// definitions for these exact choices; saved effect arrays are not definitions.
export function retainResponseChoiceJobs(state,registry){
 const ids=new Set((state.simulation?.jobs||[]).map(job=>job.commandId));
 if(!RESPONSE_CHOICE_COMMANDS.some(id=>ids.has(id)&&!registry.simulation.commands.has(id)))return false;
 const data=responseChoiceActs(),compiled=withResponseChoiceParticipants(defineLotmActs(data.rows,data.bindings,{worldId:'book.lotm.tingen',group:'book_lotm',situationId:'book.lotm.tingen.canon_beside',requires:{fact:'lotm.profile.be',op:'eq',value:true}}));
 const missing=compiled.commands.filter(command=>ids.has(command.id)&&!registry.simulation.commands.has(command.id));
 if(!missing.length)return false;
 const checked=createSimulationRegistry({commands:missing});for(const [id,command] of checked.commands)registry.simulation.commands.set(id,command);return true;
}
