// Pack-owned quotes over simulation admission, reserved stock and native money.
// Existing inventory/equipment owners settle the result; no stock is seeded here.
import {validateItemKey} from './inventory_key.js';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const natural=x=>Number.isSafeInteger(x)&&x>=0;
const positive=x=>natural(x)&&x>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
// exchanges: {schema:1,rows:[{id,revision,kind:'purchase'|'wear',place,minutes,
// label,description,report,requires?, sellerId?,items?:[{key,count,label}],
// price?:{total:number|null,unit,moneyPerUnit,tender?:number|null,change?:number|null},
// key?:<inventory key>,slot?:<existing equipment slot>}]}.
// A grouped total belongs to the whole row. No inferred line prices. Unknown
// price/denomination values are null; an unknown total has no executable quote.
export function defineCastExchanges(data,{worldId,actorId='player',group,situationId,requires=null}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid exchange binding.');
 if(data==null)return [];
 if(data.schema!==1||!Array.isArray(data.rows))throw Error('Invalid exchange pack.');
 const seen=new Set(),commands=[];
 for(const row of data.rows){
  if(!id(row.id)||seen.has(row.id)||!positive(row.revision)||!id(row.place)||!positive(row.minutes)||![row.label,row.description,row.report].every(text))throw Error('Invalid exchange row.');
  seen.add(row.id);
  const support={all:[...(requires?[requires]:[]),...(row.requires?[row.requires]:[])]};
  if(!support.all.length)support.all.push(eq('actor.life','alive'));
  const costs=[],effects=[];let costText;
  if(row.kind==='purchase'){
   const price=row.price;
   if(actorId!=='player'||!id(row.sellerId)||row.sellerId===actorId||!Array.isArray(row.items)||!row.items.length||
    !price||!text(price.unit)||!positive(price.moneyPerUnit)||price.total!==null&&!natural(price.total))throw Error('Purchase needs a bound seller, stock and grouped quote.');
   const keys=new Set();
   for(const item of row.items){
    validateItemKey(item.key);
    if(keys.has(item.key)||!positive(item.count)||!text(item.label))throw Error('Invalid exchange stock.');
    keys.add(item.key);
    costs.push({type:'item',actor:row.sellerId,key:item.key,amount:-item.count});
    effects.push({type:'item',actor:actorId,key:item.key,amount:item.count});
   }
   const tender=price.tender??null,change=price.change??null;
   if(tender!==null&&!natural(tender)||change!==null&&!natural(change)||
    (tender===null)!==(change===null)||tender!==null&&(price.total===null||tender-change!==price.total))throw Error('Tender and change must conserve the grouped price.');
   if(price.total===null)continue;
   const debit=(tender??price.total)*price.moneyPerUnit,credit=(change??0)*price.moneyPerUnit;
   if(!natural(debit)||!natural(credit))throw Error('Exchange currency exceeds supported precision.');
   if(debit)costs.push({type:'resource',actor:actorId,key:'money',native:true,amount:-debit});
   if(credit)effects.push({type:'resource',actor:actorId,key:'money',native:true,amount:credit});
   costText=`${price.total} ${price.unit} for ${row.items.map(x=>`${x.count} ${x.label}`).join(', ')}${tender!==null?`; tender ${tender}, change ${change} ${price.unit}`:''}`;
  }else if(row.kind==='wear'){
   validateItemKey(row.key);if(!id(row.slot))throw Error('Wear needs an existing equipment slot.');
   support.all.push({fact:`item.${row.key}`,op:'gte',value:1,reason:'Carry the item before putting it on.'});
   effects.push({type:'equipment',actor:actorId,slot:row.slot,key:row.key});costText='Uses the carried item; the current slot item is returned by its equipment owner.';
  }else throw Error('Exchange operation needs its existing owner.');
  const receiptKey=`exchange.${row.id}`;
  effects.push({type:'knowledge',actor:actorId,key:receiptKey,stage:'seen',value:row.report,basis:{kind:'observation',attributedTo:actorId,situationId}});
  commands.push({id:row.id,revision:row.revision,group,worldId,actorId,location:row.place,label:row.label,description:row.description,
   ...(row.kind==='purchase'?{targetId:row.sellerId,participants:[row.sellerId],coLocated:true,participantsCoLocated:true}:{}),
   once:false,duration:row.minutes,visibleWhen:requires||eq('actor.life','alive'),requires:support,completionRequires:support,
   completionCoLocated:true,completionFailure:'refund',cancellation:'refund',costs,effects,
   exchange:{kind:row.kind,costText,receiptKey}});
 }
 return commands;
}
export function quoteCastExchanges(state,commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 const place=state.simulation?.people?.player?.location,pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 return commands.filter(d=>d.location===place||pending.has(d.id)).flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return [{id:d.id,label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,perspective:'Your exchange',
   costText:d.exchange.costText,eligible:!!q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
