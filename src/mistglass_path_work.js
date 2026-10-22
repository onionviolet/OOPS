// W4 original local techniques. Energy is held as committed work escrow after
// native debit, not a second regenerating reserve. The native pool stays owner.
import {check,natural} from './basics.js';
import {cultivationView} from './absorb_p23/world_adaptation/techniques.js';
import {mistglassProfile as P} from './absorb_p23/world_adaptation/profile.js';
import {planProcessedMaterial} from './material_lineage.js';
export const PATH_WORK=Object.freeze({
 breath:{label:'Flow-cut',source:'ambient conservatory mist',product:'Processed rat pelt',quality:[65,85,95]},
 settling:{label:'Set-grain',source:'one paid Cloudseed dose dissolved into condensate',product:'Piece of wolf rat leather',quality:[70,90,100]},
});
const shape=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const controlOf=t=>t.stage==='Integrated'?3:t.stage==='Practiced'?2:1;
export function validatePathWork(w,clock,bodyId,instanceId){
 if(w===undefined)return;
 check(shape(w,['schema','prepared','completed','last'])&&w.schema===1&&natural(w.completed),'Invalid prepared path work.');
 if(w.prepared!==null){const p=w.prepared;check(shape(p,['path','control','at','energySpent','bodyId','instanceId'])&&PATH_WORK[p.path]&&[1,2,3].includes(p.control)&&natural(p.at)&&p.at<=clock&&p.energySpent===1000&&p.bodyId===bodyId&&p.instanceId===instanceId,'Invalid prepared path reserve provenance.');}
 if(w.last!==null){const l=w.last;check(shape(l,['path','control','quality','at','productId'])&&PATH_WORK[l.path]&&[1,2,3].includes(l.control)&&l.quality===PATH_WORK[l.path].quality[l.control-1]&&l.productId===PATH_WORK[l.path].product&&natural(l.at)&&l.at<=clock&&w.completed>0,'Invalid path work result.');}else check(w.completed===0,'Missing path work result.');
}
export function pathWorkView(s){
 const t=cultivationView(s.techniques),d=PATH_WORK[t.id],w=s.pathWork;
 return {path:t.id,label:d?.label||null,source:d?.source||'Choose circulation or refinement for a precise work technique.',quality:d?.quality[controlOf(t)-1]||null,prepared:w?.prepared?{...w.prepared}:null,last:w?.last?{...w.last}:null};
}
export function quotePathWork(s,c,reserve,inventory,action){
 try{
  check(s&&c.clock===s.clock&&c.worldId===P.worldId&&c.instanceId===s.instanceId&&c.bodyId===s.bodyId&&c.bodyForm===P.bodyForm&&c.ownerId==='player'&&c.controllerId==='player'&&c.alive&&c.conditionIds.includes(P.exposureConditionId)&&!c.conditionIds.includes(P.blockedConditionId),'Use your enrolled body in this conservatory’s mist, without rawness.');
  check(!s.pending,'Finish the pending purification before precise work.');
  const v=pathWorkView(s),w=s.pathWork||{schema:1,prepared:null,completed:0,last:null},spend=[],receive=[];
  const take=(key,count)=>{check((inventory[key]||0)>=count,'Carry the exact owned material needed for this preparation.');spend.push({key,count});};
  let summary='';
  if(action==='prepare'){
   check(v.label&&!w.prepared,'Choose circulation or refinement and finish or abandon existing prepared work.');check(reserve>=1000,'Prepare this reserve from at least one native condensate.');
   if(v.path==='settling'){const dose=Object.keys(inventory).find(k=>JSON.parse(k).id===P.doseItemId&&inventory[k]>0);check(dose,'Set-grain preparation needs one paid Cloudseed dose; ambient flow preparation does not.');take(dose,1);}
   summary=`Commit 1 condensate to ${v.label} at control ${controlOf(cultivationView(s.techniques))}. ${v.source}. Quality is frozen for the compatible operation; abandoning releases the spent preparation into the mist, without refund.`;
  }else if(action==='discard'){check(w.prepared,'There is no prepared work to abandon.');summary='The prepared charge disperses into its source mist. Already converted energy and any dose remain spent.';
  }else{
   const p=w.prepared,d=PATH_WORK[p?.path];check(p&&d,'Prepare a path-specific charge before its compatible technique.');check(action===(p.path==='breath'?'cut':'set'),'This prepared reserve supports its own technique; use Flow-cut for circulation or Set-grain for refinement.');
   const lot=Object.keys(inventory).find(k=>JSON.parse(k).id==='Rat pelt'&&inventory[k]>0);check(lot,'Carry an owned rat pelt as the physical workpiece.');take(lot,1);
   const product=planProcessedMaterial({stock:inventory,inputs:[{item_key:lot,count:1}],output:{id:d.product,family:'animal-hide',count:1,quality:d.quality[p.control-1]},process:{id:'mistglass.'+action,revision:1,at:c.materialClock??c.clock,world_id:P.worldId,parameters:{path:p.path,control:p.control,energySpent:p.energySpent,conversion:p.path==='breath'?'mist pressure guides the cut':'dissolved seed loosens hair and settles grain'}}});
   receive.push({key:product.item_key,count:1});summary=`${d.label} consumes the actual pelt and committed charge, leaving one ${d.quality[p.control-1]}-quality ${d.product} for native leatherwork. Control changes the material result, not its count.`;
  }
  return {eligible:true,action,spend,receive,summary,revision:s.revision,reserve};
 }catch(e){return {eligible:false,action,reason:e.message};}
}
export function planPathWork(s,c,reserve,inventory,action){
 const q=quotePathWork(s,c,reserve,inventory,action);check(q.eligible,q.reason);
 const next=structuredClone(s);next.revision++;next.pathWork||={schema:1,prepared:null,completed:0,last:null};const w=next.pathWork;
 if(action==='prepare'){w.prepared={path:s.techniques.selected,control:controlOf(cultivationView(s.techniques)),at:c.clock,energySpent:1000,bodyId:s.bodyId,instanceId:s.instanceId};}
 else if(action==='discard')w.prepared=null;
 else{const p=w.prepared,d=PATH_WORK[p.path];w.last={path:p.path,control:p.control,quality:d.quality[p.control-1],at:c.clock,productId:d.product};w.completed++;w.prepared=null;}
 return {state:next,quote:q,expectedRevision:s.revision,expectedReserve:reserve,effects:[...(action==='prepare'?[{kind:'resource-debit',resourceId:P.resourceId,amount:1000}]:[]),...q.spend.map(r=>({kind:'native-material-spend',...r})),...q.receive.map(r=>({kind:'native-material-product',...r}))]};
}
