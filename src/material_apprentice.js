// W1: original local repair work. Facts, sources and stock use their existing
// owners; this planner has no save slice or inventory of its own.
import {check} from './basics.js';
import {planProcessedMaterial} from './material_lineage.js';
import {treatmentOf} from './material_treatment.js';
export const MENDER_SOURCE='frontier.mender.fitted';
export const menderCapabilities=[{id:'frontier.fitted_repair',label:'Fitted repair',stacking:'max',providers:[]}];
export const menderSources=[{id:MENDER_SOURCE,revision:1,label:'Practiced fitting',kind:'technique',origin:'trained',grants:[{capability:'frontier.fitted_repair',amount:1}]}];
const LOG='{"id":"Rough wood log"}',KIT='Portable leatherworking kit';
export const MENDER_ACTIONS=Object.freeze({lesson:'Study hide preparation with the craftsman · 5 min',shift:'Help with local repairs · 5 min',tool:'Fit a portable leatherworking kit · 1 treated pelt + 1 log',advance:'Demonstrate a fitted preparation · consume treated pelts',fine:'Cut a fitted lining · 1 treated pelt + usable kit'});
const parsed=k=>{try{return JSON.parse(k);}catch{return {};}};
export function quoteMender({action,state,inventory,world,location,craftsmanHere,blocked,materialClock=state.clock,capability=0,toolCondition=()=>100}){
 try{
  check(!blocked,blocked);check(world==='base.frontier'&&location==='Village','Use this local repair bench in Village.');
  const requestAction=action,[operation,route]=action.split(':');action=operation;
  const a=state.actors.player,known=a.facts['mender.methodsKnown']===true,worked=a.facts['mender.repairShift']===true;
  const spend=[],receive=[],effects=[],fact=(key,value=true)=>effects.push({type:'fact',actor:'player',scope:'actor',key:'mender.'+key,value});
  const take=(key,n)=>{check((inventory[key]||0)>=n,'Keep enough of the exact owned lot for this work.');spend.push({key,count:n});};
  let minutes=0,summary='';
  if(action==='lesson'||action==='shift'){
   check(craftsmanHere,'Meet the living available old craftsman at his Village bench.');
   check(action==='lesson'?!known:known&&!worked,action==='lesson'?'You already recorded this preparation lesson.':'Study the preparation lesson before this repair shift, or continue ordinary workshop work.');
   minutes=5;fact(action==='lesson'?'methodsKnown':'repairShift');summary=action==='lesson'?'You compare smoke-set fur with oil-softened hide. The recorded preparation methods explain their later uses.':'You help fit and inspect the craftsman’s repair pieces. This completed local shift prepares your own fitting demonstration.';
  }else{
   check(known,'Study the craftsman’s preparation lesson first.');
   const lot=Object.entries(inventory).find(([k,n])=>parsed(k).id==='Rat pelt'&&n>0&&treatmentOf(k)&&(!route||treatmentOf(k)===route)&&(action!=='advance'||n>=(treatmentOf(k)==='oiled'?1:2)))?.[0];check(lot,'Prepare a counted lot of rat pelts with smoke or oil first.');
   const treatment=treatmentOf(lot),oiled=treatment==='oiled';
   if(action==='tool'){
    take(lot,1);take(LOG,1);
    const product=planProcessedMaterial({stock:inventory,inputs:spend.map(r=>({item_key:r.key,count:r.count})),output:{id:KIT,family:'workshop-tool',count:1,quality:oiled?80:60},process:{id:'mender.fit_tool',revision:1,at:materialClock,world_id:world,parameters:{treatment,waste:'trimmed hide and wood'}}});
    receive.push({key:product.item_key,count:1});summary=`The ${treatment} lot makes a ${oiled?80:60}-quality portable kit. Either works for supported leather reclamation; soft oil-dressed bindings support the fine cut without another fitting.`;
   }else if(action==='advance'){
    check(worked,'Complete a local repair shift before demonstrating your fitting.');check(!a.sources[MENDER_SOURCE],'You already retain this fitting capability.');
    take(lot,oiled?1:2);effects.push({type:'source',actor:'player',sourceId:MENDER_SOURCE,operation:'grant',origin:'trained',awakened:true,active:true});fact('advancementPreparation',treatment);
    summary=`Your ${treatment} preparation demonstrates a stable fitting. ${oiled?'One flexible piece':'Two smoke-set pieces'} is consumed. Practiced fitting now supports a precise lining cut using either usable kit grade.`;
   }else if(action==='fine'){
    check(capability>=1,'Earn and activate practiced fitting before this precision operation.');
    const tool=Object.keys(inventory).find(k=>inventory[k]>0&&parsed(k).id===KIT&&toolCondition(k)>0);check(tool,'Carry a usable portable leatherworking kit; either supported grade works with practiced fitting.');
    take(lot,1);const quality=oiled?95:85;
    const product=planProcessedMaterial({stock:inventory,inputs:[{item_key:lot,count:1}],output:{id:'Processed rat pelt',family:'animal-hide',count:1,quality},process:{id:'mender.fine_lining',revision:1,at:materialClock,world_id:world,parameters:{tool,treatment,capability:'frontier.fitted_repair'}}});receive.push({key:product.item_key,count:1});
    summary=`The actual ${treatment} hide yields one ${quality}-quality lining for native leatherwork. Your tool remains yours; the selected pelt is consumed.`;
   }else throw Error('Choose a known repairer operation.');
  }
  effects.push({type:'knowledge',actor:'player',key:'mender.'+action,stage:'understood',value:summary});
  return {eligible:true,action:requestAction,spend,receive,effects,minutes,summary,sequence:state.sequence};
 }catch(e){return {eligible:false,action,reason:e.message};}
}
