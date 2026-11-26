// Individual charge belongs to the carried piece, never the aperture or holder.
// Legacy charge-state items are materialized conservatively after their pending
// v1 work settles. The v1 definitions and saved work remain byte-identical.
import {readItemKey} from './inventory_key.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
const WORLD='book.ri.lead.world',BASE='book.ri.lead.vital.half_stone',OLD='book.ri.lead.half_stone_use';
export const RI_PIECE_EXTENSION='book.ri.lead.half_stone_piece',RI_PIECE_DRAW=RI_PIECE_EXTENSION+'.draw';
export const riPieceKey=id=>JSON.stringify({id:BASE,ri_piece:id});
export const isRiPieceKey=key=>{const d=readItemKey(key);return !!(d?.id===BASE&&typeof d.ri_piece==='string'&&/^[a-zA-Z0-9_.:-]+$/.test(d.ri_piece)&&Object.keys(d).sort().join(',')==='id,ri_piece');};
const data=state=>state?.riStonePieces;
const legacyCharge=key=>{const id=readItemKey(key)?.id;if(id===BASE&&Object.keys(readItemKey(key)).length===1)return 15;const match=typeof id==='string'&&id.match(/^book\.ri\.lead\.half_stone_use\.remaining_(\d+)$/);return match&&+match[1]<15&&Object.keys(readItemKey(key)).length===1?+match[1]:null;};
const owners=plan=>[...Object.entries(plan.gameplay||{}).filter(([,v])=>v?.inventory).map(([id,v])=>[id,v.inventory]),...Object.entries(plan.state?.simulation?.owners||{})].sort(([a],[b])=>a.localeCompare(b));
export function stageRiStonePieces(plan){
 const state=plan?.state,world=state?.worlds?.[WORLD],instance=world?.facts?.['book.ri.lead.instance'];
 if(!world||!instance||!state.simulation)return;
 // A v1 job still owns its original reservation and refund contract.
 if(state.simulation.jobs.some(j=>j.commandId.startsWith(OLD+'.')))return;
 let store=data(state);
 for(const [owner,inventory] of owners(plan))for(const key of Object.keys(inventory).sort()){
  const remaining=legacyCharge(key),count=inventory[key];if(remaining===null)continue;
  store??=(state.riStonePieces={schema:1,nextId:1,pieces:{}});
  delete inventory[key];
  for(let n=0;n<count;n++){
   const serial=store.nextId++,id=instance+'.half-stone.'+serial,actual=riPieceKey(id);
   if(store.pieces[id]||inventory[actual])throw Error('Stone identity collision.');
   store.pieces[id]={id,serial,remaining,estimatedInitial:15,origin:owner==='book.ri.lead.breakfast.fang_zheng'?'witnessed-pouch':'legacy-unattributed'};
   inventory[actual]=1;
  }
 }
}
export function riStonePieces(state,rows){const store=data(state);return Object.entries(rows||{}).filter(([key,count])=>count>0&&isRiPieceKey(key)).map(([key,count])=>{const p=store?.pieces[readItemKey(key).ri_piece];if(!p||count!==1)throw Error('Restore the individual stone and its charge.');return {...p,key};}).sort((a,b)=>a.serial-b.serial);}
export function riSelectedStone(state,rows){const pieces=riStonePieces(state,rows);return pieces.find(p=>p.id===data(state)?.selectedId)||pieces.find(p=>p.remaining>0)||pieces[0]||null;}
export function riStoneFacts(state,context={}){
 const p=riSelectedStone(state,context.gameplay?.player?.inventory);
 const rows=context.gameplay?.player?.inventory,legacy=Object.keys(rows||{}).some(k=>legacyCharge(k)!==null);
 return {'riStone.held':!!p||legacy,'riStone.available':!!p&&p.remaining>0,'riStone.pieceId':p?.id||'','riStone.key':p?.key||'','riStone.remaining':p?.remaining||0};
}
export function bindRiStoneEffect(effect,facts){
 if(effect.type!=='riStoneDraw'||effect.pieceId)return effect;
 if(!facts['riStone.pieceId']||!(facts['riStone.remaining']>0))throw Error('Carry a stone with essence left.');
 return {...effect,pieceId:facts['riStone.pieceId'],key:facts['riStone.key'],remainingBefore:facts['riStone.remaining']};
}
export function validateRiStoneEffect(e){
 if(e.type!=='riStoneDraw')return false;
 const allowed=['type','actor','amount','pieceId','key','remainingBefore'];
 if(e.actor!=='player'||e.amount!==1||Object.keys(e).some(k=>!allowed.includes(k)))throw Error('Invalid individual stone draw.');
 if(['pieceId','key','remainingBefore'].some(k=>Object.hasOwn(e,k))&&!['pieceId','key','remainingBefore'].every(k=>Object.hasOwn(e,k)))throw Error('Incomplete bound stone draw.');
 if(e.pieceId!=null&&(!isRiPieceKey(e.key)||readItemKey(e.key).ri_piece!==e.pieceId||!Number.isInteger(e.remainingBefore)||e.remainingBefore<1||e.remainingBefore>15))throw Error('Invalid bound stone draw.');
 return true;
}
export function applyRiStoneDraw(plan,e,readInventory,writeInventory){
 validateRiStoneEffect(e);const p=data(plan.state)?.pieces[e.pieceId];
 if(!p||p.remaining!==e.remainingBefore||e.key!==riPieceKey(p.id)||!(p.remaining>0))throw Error('The reserved stone or its charge has changed.');
 const inventory=readInventory(plan,'player');if(inventory[e.key])throw Error('The drawn piece must be reserved.');
 p.remaining--;writeInventory(plan,'player',{...inventory,[e.key]:1});
}
export function riStoneCostKey(state,rows,key){
 if(!state||key!==JSON.stringify({id:BASE}))return null;
 const p=riSelectedStone(state,rows);return p?.key||null;
}
export function riStonePending(state,job,d){
 if(d?.id!==RI_PIECE_DRAW)return null;
 const cost=job.costs?.[0],piece=isRiPieceKey(cost?.key)?data(state)?.pieces[readItemKey(cost.key).ri_piece]:null;
 if(!piece||job.costs.length!==1||cost.type!=='item'||cost.actor!=='player'||cost.amount!==-1||cost.key!==riPieceKey(piece.id)||piece.remaining<1)throw Error('Restore the exact reserved stone.');
 return {costs:[{...d.costs[0],key:cost.key}],effects:d.effects.map(e=>e.type==='riStoneDraw'?{...e,pieceId:piece.id,key:cost.key,remainingBefore:piece.remaining}:e)};
}
const caption=p=>`${p.origin==='witnessed-pouch'?'Fang Zheng’s stone':'Small primeval stone'} · piece ${p.serial}`;
export function riStoneStatus(state,context){return riStonePieces(state,context.gameplay?.player?.inventory).map(p=>({label:caption(p),value:p.remaining?`Estimated essence left: ${p.remaining} parts.`:'No usable essence left. You keep the spent piece.'}));}
export function riStoneItemView(item,state,fallback){const key=typeof item==='string'?item:item?.getInventoryKey?.()||item?.key;if(!isRiPieceKey(key))return fallback;const p=data(state)?.pieces[readItemKey(key).ri_piece];if(!p)return fallback;return {...fallback,name:caption(p),description:p.remaining?`A small, partly depleted stone. Estimated essence left in this piece: ${p.remaining} parts.`:'This small stone is spent. You keep the same piece.'};}
export function riStoneChoices(state,context){const selected=riSelectedStone(state,context.gameplay?.player?.inventory);return riStonePieces(state,context.gameplay?.player?.inventory).map(p=>({key:p.key,label:`${caption(p)} · ${p.remaining} estimated parts left`,selected:p.id===selected?.id}));}
export function planRiStoneSelection(state,context,key){
 if(state?.actors?.player?.worldId!==WORLD||context.busy||state.simulation?.jobs?.some(j=>j.actorId==='player')||!context.nativeReady||!context.nativeAlive)throw Error('Finish your work before choosing a stone.');
 const p=riStonePieces(state,context.gameplay?.player?.inventory).find(p=>p.key===key);if(!p)throw Error('Choose a carried stone.');
 const out={state:structuredClone(state),gameplay:structuredClone(context.gameplay),external:structuredClone(context.external||{}),vitals:structuredClone(context.vitals||{}),equipment:structuredClone(context.equipment||{}),acquisitions:[],unlocks:[]};
 data(out.state).selectedId=p.id;out.state.sequence++;return out;
}
export function riStoneLegacyHidden(state,command,context){return command.startsWith(OLD+'.')&&riStonePieces(state,context.gameplay?.player?.inventory).length>0;}
export function validateRiStoneState(state){
 const store=data(state);if(!store)return;
 if(store.schema!==1||!Number.isSafeInteger(store.nextId)||store.nextId<1||!store.pieces||typeof store.pieces!=='object'||Array.isArray(store.pieces))throw Error('Invalid individual stone ledger.');
 const serials=new Set();for(const [id,p] of Object.entries(store.pieces)){if(p.id!==id||id!==state.worlds?.[WORLD]?.facts?.['book.ri.lead.instance']+'.half-stone.'+p.serial||serials.has(p.serial)||!Number.isSafeInteger(p.serial)||p.serial<1||p.serial>=store.nextId||p.estimatedInitial!==15||!Number.isInteger(p.remaining)||p.remaining<0||p.remaining>15||!['witnessed-pouch','legacy-unattributed'].includes(p.origin))throw Error('Invalid individual stone charge.');serials.add(p.serial);}
 if(store.selectedId!=null&&!store.pieces[store.selectedId])throw Error('Invalid selected stone.');
}
export function validateRiStoneEnvelope(envelope){
 const state=envelope?.expansion,store=data(state);validateRiStoneState(state);
 if(!store){const stale=Object.values(envelope.inventories||{}).some(category=>Object.values(category).some(rows=>Object.keys(rows).some(isRiPieceKey)))||Object.values(state?.simulation?.owners||{}).some(rows=>Object.keys(rows).some(isRiPieceKey))||state?.simulation?.jobs?.some(job=>(job.costs||[]).some(e=>isRiPieceKey(e.key)));if(stale)throw Error('Restore the individual stone ledger.');return;}
 const copies=new Map(),visit=(key,count)=>{if(!isRiPieceKey(key))return;const id=readItemKey(key).ri_piece;if(!store.pieces[id]||count!==1||copies.has(id))throw Error('Duplicated or missing stone identity.');copies.set(id,true);};
 for(const category of Object.values(envelope.inventories||{}))for(const rows of Object.values(category))for(const [key,row]of Object.entries(rows))visit(key,row.count);
 for(const rows of Object.values(state.simulation?.owners||{}))for(const [key,count]of Object.entries(rows))visit(key,count);
 for(const job of state.simulation?.jobs||[])for(const cost of job.costs||[])if(cost.type==='item'&&cost.amount<0)visit(cost.key,-cost.amount);
}
export function registerRiStonePieces(){if(!domainRegistry.list().some(d=>d.id==='ri_stone_pieces'))registerDomain({id:'ri_stone_pieces',stage:stageRiStonePieces,ownsItemKey:isRiPieceKey,validate:(_slice,envelope)=>validateRiStoneEnvelope(envelope),commands:{select:planRiStoneSelection,prepare:stageRiStonePieces},commandGuards:Object.fromEntries(Array.from({length:15},(_,i)=>[OLD+'.draw_'+(i+1),(state,_command,context)=>riStoneLegacyHidden(state,OLD+'.draw_'+(i+1),context)?['Choose the carried piece before drawing.']:[]]))});}
export function riStoneInventoryFacts(rows,prefix='item.'){
 let count=0;for(const [key,n]of Object.entries(rows||{}))if(isRiPieceKey(key))count+=n;
 return count?{[prefix+JSON.stringify({id:BASE})]:(rows?.[JSON.stringify({id:BASE})]||0)+count}:{};
}


