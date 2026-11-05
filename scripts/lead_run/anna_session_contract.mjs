// Bounded enrichment of the existing source-qualified KJ3AA operations.
// stdin/out CLI is shared by its Python authoring builder and hunk publisher.
import {pathToFileURL} from 'node:url';
import {ANNA_ID,ANNA_DETAILS_KEY,ANNA_ADVICE_KEY,ANNA_MEMORY_KEY} from '../../src/lotm_anna_session_items.js';
const P='book.lotm.kj3aa.',S='book.lotm.tingen.canon_beside';
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const addEffect=(row,e)=>{row.effects??=[];if(!row.effects.some(x=>JSON.stringify(x)===JSON.stringify(e)))row.effects.push(e);};
const addGuard=(row,g)=>{const guards=row.requires?.all??(row.requires?[row.requires]:[]);if(!guards.some(x=>JSON.stringify(x)===JSON.stringify(g)))row.requires={all:[...guards,g]};};
export function applyAnnaSessionContract(acts){
 return structuredClone(acts).map(row=>{
  if(row.id===P+'study')addEffect(row,{type:'relocate',actor:ANNA_ID,location:row.place});
  if(row.id===P+'details'){
   row.targetId=ANNA_ID;
   addEffect(row,{type:'item',actor:'player',key:ANNA_DETAILS_KEY,amount:1});
  }
  if(row.id===P+'hermes'){
   addGuard(row,{any:[{fact:'item.'+ANNA_DETAILS_KEY,op:'gte',value:1},eq('knowledge.'+ANNA_MEMORY_KEY+'.understood')],reason:'Have Anna’s written details here, or have already memorized them.'});
   addEffect(row,{type:'knowledge',actor:'player',key:ANNA_MEMORY_KEY,stage:'understood',value:'You memorized the identity and birth details Anna supplied for this reading.',basis:{kind:'instruction',attributedTo:'player',situationId:S}});
  }
  if(row.id===P+'reveal'){
   row.targetId=ANNA_ID;
   addEffect(row,{type:'knowledge',actor:ANNA_ID,key:ANNA_ADVICE_KEY,stage:'seen',value:'Klein said Joyce was at your house after a calamity and needed comfort rather than questions.',basis:{kind:'instruction',attributedTo:'player',situationId:S}});
  }
  if(row.id===P+'paid'){
   row.targetId=ANNA_ID;
   addGuard(row,eq('target.knowledge.'+ANNA_ADVICE_KEY+'.seen',true,'Give Anna the advice before receiving her payment.'));
  }
  return row;
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 let input='';for await(const chunk of process.stdin)input+=chunk;
 process.stdout.write(JSON.stringify(applyAnnaSessionContract(JSON.parse(input))));
}
