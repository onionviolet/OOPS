// A private chest keeps its existing Home stock owner. A real buyer reserves
// her own time; settlement moves goods and finite coins atomically, or holds them.
import {check,natural} from './basics.js';
const ROOM='Arlmere family manor',M='home.manor.supplier',S='home.manor.steward',C='home.manor.cook',K='home.manor.keeper';
export const WAREHOUSE_JOB='home.warehouse.appraise',WOOD=JSON.stringify({id:'Rough wood log'});
export const warehouseCommands=[{id:WAREHOUSE_JOB,revision:1,label:'Mara assesses one stored rough log',worldId:'base.frontier',group:'home_work',actorId:M,location:ROOM,duration:60,cancellation:'refund',reservationReturns:1,completionFailure:'refund',costs:[],effects:[{type:'resource',actor:M,key:'home.warehouseAssessments',amount:1}],requires:{fact:'actor.home.employed',op:'eq',value:true},completionRequires:{all:[{fact:'actor.home.employed',op:'eq',value:true},{fact:'location',op:'eq',value:ROOM}]}}];
const completed=c=>c.warehouseCompleted||0;
const fresh=c=>({enabled:false,keep:1,turn:0,seen:completed(c),pending:null,last:null});
const exact=(x,keys)=>x&&Object.keys(x).sort().join(',')===keys.split(',').sort().join(',');
export function validateWarehouse(w,clock){
 if(w===undefined)return;check(exact(w,'enabled,keep,turn,seen,pending,last')&&typeof w.enabled==='boolean'&&natural(w.keep)&&w.keep<=100&&[0,1].includes(w.turn)&&natural(w.seen),'Invalid warehouse standing order.');
 if(w.pending)check(exact(w.pending,'id,keep')&&typeof w.pending.id==='string'&&w.pending.id.length<=200&&natural(w.pending.keep)&&w.pending.keep<=100,'Invalid warehouse appointment.');
 if(w.last)check(exact(w.last,'at,outcome,reason')&&natural(w.last.at)&&w.last.at<=clock&&['sold','held','cancelled'].includes(w.last.outcome)&&typeof w.last.reason==='string'&&w.last.reason.length<=240,'Invalid warehouse receipt.');
}
const busy=(c,id)=>c.jobs?.some(j=>(j.participants||[j.actorId]).includes(id));
export function warehouseDecision(h,c){
 const w=h?.warehouse;if(!h?.fixtures.box||!w?.enabled)return {run:false,reason:'Standing warehouse sales are off, or the actual storage box is packed.'};
 if(c.world!=='base.frontier'||!c.alive)return {run:false,reason:'The sale waits for your living Frontier account.'};
 if(!c.playerFacts?.['home.maraTradeIntroduced'])return {run:false,reason:'Ask Rowan for Mara’s actual introduction first.'};
 if(w.pending||busy(c,M))return {run:false,reason:'Mara is occupied by an actual appointment.'};
 if(c.people?.[M]?.life!=='alive'||c.people[M].location!==ROOM)return {run:false,reason:'Mara must actually visit the manor; a real pantry delivery brings her here.'};
 if((h.stock[WOOD]||0)<=w.keep)return {run:false,reason:`Stored rough logs are at the ${w.keep}-log reserve floor.`};
 if((c.staffResources?.[M]?.['home.wages']||0)<1)return {run:false,reason:'Mara’s personal purse cannot fund another one-coin purchase now; it refills from her wages, or you can pay her first.'};
 return {run:true,reason:'Mara can reserve sixty played minutes to assess one available log for one of her own coins.'};
}
function stationNeeds(h,c){
 const available=id=>c.people?.[id]?.life==='alive'&&c.people[id].location===ROOM&&c.staffFacts?.[id]?.['home.employed']===true&&!c.staffFacts[id]?.['home.leave']&&(c.staffResources[id]?.['home.energy']||0)>=20&&!busy(c,id);
 const funds=c.staffResources?.[S]?.['home.estateFunds']||0,stock=id=>c.staffStock?.[id]||{};
 return [{id:C,need:available(C)&&funds>=2&&(stock(C)['{"id":"Rat meat chunks"}']||0)>=2&&(stock(C)[WOOD]||0)<1},
 {id:K,need:available(K)&&funds>=3&&(h.condition?.integrity??100)<100&&!c.homeProjects?.manor&&(stock(K)['{"id":"Home dry grass"}']||0)>=2&&(stock(K)[WOOD]||0)<1}];
}
export function planHomeWarehouse(s,r,c,out){
 if(r.type==='remove'&&r.home==='manor'&&r.slot==='box'&&s.properties.manor?.warehouse){check(!s.properties.manor.warehouse.pending,'Finish or cancel the actual warehouse assessment before packing this box.');s.properties.manor.warehouse.enabled=false;return false;}
 if(!r.type.startsWith('warehouse_'))return false;
 const h=s.properties.manor;check(h?.access&&h.fixtures.box&&c.location===ROOM&&c.body.form==='human','operate your actual private storage box at the manor.');h.warehouse ||= fresh(c);const w=h.warehouse;
 if(r.type==='warehouse_stop'){
  w.enabled=false;if(w.pending){const j=c.jobs.find(j=>j.id===w.pending.id&&j.commandId===WAREHOUSE_JOB);if(j)out.job={cancel:j.id,actor:M};w.pending=null;}out.message='Standing assessments stop. Unpurchased goods remain in your private chest; neither buyer coins nor stock were reserved by the cancelled assessment.';
 }else if(r.type==='warehouse_start'){
  check(c.playerFacts?.['home.maraTradeIntroduced'],'agree the direct introduction with Rowan before offering Mara a standing sale.');w.enabled=true;out.message='You allow Mara to assess one rough log per actual sixty-minute appointment when she visits. At completion she pays one of her own coins if the log remains above your reserve and your account is in the living Frontier; otherwise the stock stays held. Other goods and communal supplies are excluded.';
 }else if(r.type==='warehouse_keep'){
  check(!w.pending,'Finish or cancel the quoted assessment before changing its reserve.');check(natural(r.keep)&&r.keep<=100,'choose a reserve from zero to one hundred stored logs.');w.keep=r.keep;out.message=`Sales and fair allocations leave ${r.keep} stored rough logs untouched.`;
 }else if(r.type==='warehouse_allocate'){
  const needs=stationNeeds(h,{...c,homeProjects:s.projects}),available=Math.max(0,(h.stock[WOOD]||0)-w.keep);check(available>0&&needs.some(n=>n.need),'store available rough logs above the reserve, with an actual funded cook or repair input shortage.');
  let given=0;const first=w.turn;for(let i=0;i<2&&given<available;i++){const index=(first+i)%2,row=needs[index];if(!row.need)continue;out.simEffects.push({type:'item',actor:row.id,key:WOOD,amount:1});h.stock[WOOD]--;given++;w.turn=(index+1)%2;}
  if(!h.stock[WOOD])delete h.stock[WOOD];out.message=`${given} actual private logs pass to the willing work buffers, one per funded shortage. The saved rotation gives the other station first turn after a one-log allocation. Normal jobs still spend these inputs, energy and wages.`;
 }else check(false,'Choose a known warehouse action.');return true;
}
export function stageWarehouse(plan,c,homes,{applyEffects,stageJob}){
 const h=homes.properties.manor,w=h?.warehouse;if(!w)return;const before=JSON.stringify([w,h.stock]),done=completed(c);
 if(w.pending&&!c.jobs.some(j=>j.id===w.pending.id)){
  const wasCompleted=done>w.seen,can=wasCompleted&&c.world==='base.frontier'&&c.alive&&c.people?.[M]?.life==='alive'&&c.people[M].location===ROOM&&(h.stock[WOOD]||0)>w.pending.keep&&(c.staffResources?.[M]?.['home.wages']||0)>=1;
  if(can){h.stock[WOOD]--;if(!h.stock[WOOD])delete h.stock[WOOD];plan.state.sequence++;applyEffects([{type:'item',actor:M,key:WOOD,amount:1},{type:'resource',actor:M,key:'home.wages',amount:-1},{type:'resource',actor:'player',native:true,key:'money',amount:1}]);}
  w.last={at:c.clock,outcome:can?'sold':wasCompleted?'held':'cancelled',reason:can?'One actual stored rough log sold to Mara for one coin from her own purse.':wasCompleted?'The assessment ended with stock, funds, place or your Frontier account unavailable; goods and coins stay held.':'The assessment was cancelled without moving goods or buyer coins.'};w.pending=null;
 }
 w.seen=done;
 const freshContext={...c,jobs:plan.state.simulation.jobs};if(warehouseDecision(h,freshContext).run){plan.state.sequence++;stageJob({id:WAREHOUSE_JOB,actor:M});const job=plan.state.simulation.jobs.find(j=>j.commandId===WAREHOUSE_JOB);check(job,'Warehouse assessment was not reserved.');w.pending={id:job.id,keep:w.keep};}
 if(before!==JSON.stringify([w,h.stock]))homes.revision++;
}
export function renderWarehouse({host,view,home,el,action}){
 if(home.id!=='manor'||!home.fixtures.box)return;const c=view.context,w=home.warehouse||fresh(c),d=warehouseDecision(home,c),box=el('details');box.append(el('summary','Private warehouse contracts'),el('p',`Actual stored rough logs ${home.stock[WOOD]||0}, reserve ${w.keep}. ${d.reason} A ripe appointment never creates a buyer purse or replaces missing goods. Other stored items stay outside this offer. The two work buffers share donated logs by saved rotation, one per actual funded shortage.`));host.append(box);
 action(box,'warehouse_start','Allow standing one-coin rough-log sales',{type:'warehouse_start'});action(box,'warehouse_stop','Stop sales and cancel the unfinished assessment',{type:'warehouse_stop'});
 for(const keep of [0,1,3])action(box,'warehouse_keep:'+keep,`Keep ${keep} stored logs untouched`,{type:'warehouse_keep',keep});
 action(box,'warehouse_allocate','Fairly supply funded cook/repair wood shortages',{type:'warehouse_allocate'});if(w.last)box.append(el('p',`Minute ${w.last.at}: ${w.last.reason}`));
 if(w.pending){const j=c.jobs.find(j=>j.id===w.pending.id);box.append(el('p',`Mara’s actual assessment: ${j?Math.max(0,j.due-c.clock)+' played minutes remain':'settling'}. Current quoted reserve ${w.pending.keep}.`));}
}
