// Pay lines and commissions with staged payment (AD48 rows G3 and G4). Same shape as book_world_lotm_be_clients.js: pure data and functions, no state,
// no clock, no save; effects are plain JSON a cast pack can embed. One authority per fact (ECC25, ECX6): every coin moves as one native `money` effect
// into or out of the one Loen purse (pence; pound 240, soli 12 are denominations, not exchange pairs). The progress is plain player facts, so a
// reload keeps it and a repeated act is refused by its own gate: a pay week or a commission stage pays ONCE. Elapsed time is derived from the
// `.at` of a start note, exactly as weeksOwed does for the civil contract; no second counter and no stored clock.
// A figure is never invented: an amount the text does not give is `null` and cannot be paid until content states it with a basis.
import {DENOMINATIONS,BE_GRAIN} from './book_world_lotm_be_clients.js';
import {isGrained,penceLabel} from './currency_subunits.js';
export const PAY_PREFIX='book.lotm.pay.';
export const COMMISSION_PREFIX='book.lotm.commission.';
export const WEEK_MINUTES=7*24*60;
export const DAY_MINUTES=24*60;
const BASES=Object.freeze(['stated','listed','assumed','unknown']);
const SITUATION='book.lotm.tingen.canon_beside';
const ID=/^[a-z0-9_]+$/;
const fact=(k,value)=>({type:'fact',scope:'actor',actor:'player',key:k,value});
const note=(k,value)=>({type:'knowledge',actor:'player',key:k,stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}});
const money=amount=>({type:'resource',actor:'player',key:'money',native:true,amount});
// A figure {amount,currency,basis,floor?} -> pence on the purse grain, or null (no figure). Throws on a figure that cannot be paid honestly.
export function toPence(f){
 if(f==null||f.amount==null||f.basis==='unknown')return null;
 if(!BASES.includes(f.basis))throw Error('A figure needs a basis: stated, listed, assumed or unknown.');
 const unit=DENOMINATIONS[f.currency];if(!unit)throw Error('A figure in another currency needs its exchange quote first; this purse holds pence.');
 if(!(typeof f.amount==='number'&&Number.isFinite(f.amount)&&f.amount>0))throw Error('A figure must be a positive number.');
 const p=f.amount*unit;if(!isGrained(p,BE_GRAIN))throw Error('A figure must be on the purse grain (whole pence or halfpence).');
 return p;
}
const label=p=>p%DENOMINATIONS.pound===0?`${p/DENOMINATIONS.pound} pound${p===DENOMINATIONS.pound?'':'s'}`:penceLabel(p);
// ---------------------------------------------------------------- G3: pay lines
// {id,label,payer,kind,steps:[{fromWeek,amount,currency,basis,floor?}]}. Week numbers count from the start note; a step holds until the next one
// (a raise "in about three months" is a later fromWeek with its own basis). Weeks before the first step pay nothing.
export const PAY_LINES=[];
const lineById=new Map();
export function registerPayLine(def){
 if(!def||!ID.test(def.id||''))throw Error('A pay line needs a lowercase id.');
 for(const k of ['label','payer','kind'])if(typeof def[k]!=='string'||!def[k])throw Error(`A pay line needs ${k}.`);
 if(!Array.isArray(def.steps)||!def.steps.length)throw Error('A pay line needs at least one step.');
 let last=0;for(const s of def.steps){if(!Number.isSafeInteger(s.fromWeek)||s.fromWeek<=last)throw Error('Steps need increasing whole weeks from 1.');last=s.fromWeek;toPence(s);}
 const prior=lineById.get(def.id);
 if(prior&&JSON.stringify(prior)!==JSON.stringify(def))throw Error('That pay line is already registered with different terms.');
 if(!prior){const c=JSON.parse(JSON.stringify(def));lineById.set(c.id,c);PAY_LINES.push(c);}
 return lineById.get(def.id);
}
export function payFor(id,week){
 const l=lineById.get(id);if(!l)throw Error('Unknown pay line.');
 if(!Number.isSafeInteger(week)||week<1)throw Error('A pay week is a whole number from 1.');
 const s=[...l.steps].reverse().find(x=>x.fromWeek<=week);return s?toPence(s):null;
}
const pkey=(id,part)=>`${PAY_PREFIX}${id}.${part}`;
export const payStartEffects=id=>{const l=lineById.get(id);if(!l)throw Error('Unknown pay line.');return [fact(pkey(id,'status'),'started'),note(pkey(id,'start'),`${l.payer} pays you: ${l.label}.`)];};
export const payStartRequires=id=>({fact:`lotm.pay.${id}.status`,op:'eq',value:'none',reason:'This pay has already started.'});
// Collect week `week` (1-based, the next unpaid one). One money effect; progress is a SET to the week, so a replay cannot pay twice.
export function payCollectEffects(id,{week}){
 const l=lineById.get(id),p=payFor(id,week);
 if(p==null)throw Error('No figure for this week; nothing is paid and none is invented.');
 const step=[...l.steps].reverse().find(x=>x.fromWeek<=week);
 return [money(p),fact(pkey(id,'paid'),week),note(pkey(id,'week'+week),`${l.payer} paid ${step.floor?'at least ':''}${label(p)} for week ${week}: ${l.label} (${step.basis}).`)];
}
export const payCollectRequires=(id,week)=>({all:[{fact:`lotm.pay.${id}.status`,op:'eq',value:'started'},{fact:`lotm.pay.${id}.paid`,op:'eq',value:week-1,reason:'That week is not the next one owed.'},{fact:`lotm.pay.${id}.weeks`,op:'gte',value:week,reason:'That week has not passed yet.'}]});
export const payReport=(id,week)=>payCollectEffects(id,{week}).find(e=>e.type==='knowledge').value;
// ---------------------------------------------------------------- G4: commissions
// {id,label,patron,total?,lead?:{days,basis},stages:[{id,label,amount|null,basis?,gate?}]}. Stages pay in order, once each. `gate` is an optional rule
// (a fact content owns) such as payment only after a result is verified. The total, if stated, bounds the known stages; a stage with no stated
// figure is `null` and is paid only when content supplies one with a basis at pay time.
export const COMMISSIONS=[];
const comById=new Map();
export function registerCommission(def){
 if(!def||!ID.test(def.id||''))throw Error('A commission needs a lowercase id.');
 for(const k of ['label','patron'])if(typeof def[k]!=='string'||!def[k])throw Error(`A commission needs ${k}.`);
 if(!Array.isArray(def.stages)||!def.stages.length)throw Error('A commission needs stages.');
 const seen=new Set();let known=0;
 for(const s of def.stages){
  if(!ID.test(s.id||'')||seen.has(s.id))throw Error('Stage ids are unique and lowercase.');seen.add(s.id);
  if(s.amount!=null)known+=toPence(s)??0;
 }
 const total=toPence(def.total);if(total!=null&&known>total)throw Error('Stated stages exceed the stated total.');
 if(def.lead&&!(Number.isSafeInteger(def.lead.days)&&def.lead.days>0))throw Error('Lead time is a whole number of days.');
 const prior=comById.get(def.id);
 if(prior&&JSON.stringify(prior)!==JSON.stringify(def))throw Error('That commission is already registered with different terms.');
 if(!prior){const c=JSON.parse(JSON.stringify(def));comById.set(c.id,c);COMMISSIONS.push(c);}
 return comById.get(def.id);
}
const ckey=(id,part)=>`${COMMISSION_PREFIX}${id}.${part}`;
const com=id=>{const c=comById.get(id);if(!c)throw Error('Unknown commission.');return c;};
export const commissionOpenEffects=id=>{const c=com(id);return [fact(ckey(id,'status'),'open'),note(ckey(id,'opened'),`You commissioned ${c.label} from ${c.patron}.`)];};
export const commissionOpenRequires=id=>({fact:`lotm.commission.${id}.status`,op:'eq',value:'none',reason:'That commission is already placed.'});
// Pay one stage. `pay` overrides a null figure ({amount,currency,basis}); an unknown stage with no override throws.
export function commissionStageEffects(id,stageId,{pay}={}){
 const c=com(id),s=c.stages.find(x=>x.id===stageId);if(!s)throw Error('Unknown stage.');
 const p=toPence(s.amount==null?pay:s);
 if(p==null)throw Error('No stated figure for this stage; nothing is paid and none is invented.');
 const fig=s.amount==null?pay:s;
 return [money(-p),fact(ckey(id,'stage.'+stageId),'paid'),note(ckey(id,'paid.'+stageId),`You paid ${label(p)} to ${c.patron} for ${c.label}: ${s.label||stageId} (${fig.basis}).`)];
}
export function commissionStageRequires(id,stageId){
 const c=com(id),i=c.stages.findIndex(x=>x.id===stageId);if(i<0)throw Error('Unknown stage.');
 const all=[{fact:`lotm.commission.${id}.status`,op:'eq',value:'open'},{fact:`lotm.commission.${id}.stage.${stageId}`,op:'eq',value:'none',reason:'That stage is already paid.'}];
 if(i>0)all.push({fact:`lotm.commission.${id}.stage.${c.stages[i-1].id}`,op:'eq',value:'paid',reason:'The earlier stage is not paid yet.'});
 if(c.stages[i].gate)all.push(c.stages[i].gate);
 return {all};
}
// Lead time: the work is ready after `lead.days` from the opened note. Content gates delivery on this fact: `lotm.commission.<id>.ready`.
export const commissionDeliverEffects=(id,text)=>{const c=com(id);return [fact(ckey(id,'status'),'done'),note(ckey(id,'delivered'),text||`${c.patron} delivered ${c.label}.`)];};
export const commissionDeliverRequires=id=>({all:[{fact:`lotm.commission.${id}.status`,op:'eq',value:'open'},{fact:`lotm.commission.${id}.ready`,op:'eq',value:true,reason:'The work is not ready yet.'}]});
// ---------------------------------------------------------------- facts, view, assertions
const noteAt=(state,k)=>state.simulation?.knowledge?.player?.[k]?.at;
const idsIn=(pf,prefix,reg)=>[...new Set([...reg.map(x=>x.id),...Object.keys(pf).filter(k=>k.startsWith(prefix)).map(k=>k.slice(prefix.length).split('.')[0]).filter(Boolean)])];
export function payFacts(state,f){
 const pf=state.actors?.player?.facts||{};
 for(const id of idsIn(pf,PAY_PREFIX,PAY_LINES)){
  const st=pf[pkey(id,'status')]==='started'?'started':'none',at=noteAt(state,pkey(id,'start'));
  f[`lotm.pay.${id}.status`]=st;f[`lotm.pay.${id}.paid`]=pf[pkey(id,'paid')]??0;
  f[`lotm.pay.${id}.weeks`]=st==='started'&&at!=null?Math.max(0,Math.floor((state.clock-at)/WEEK_MINUTES)):0;
 }
 for(const id of idsIn(pf,COMMISSION_PREFIX,COMMISSIONS)){
  const s=pf[ckey(id,'status')],st=s==='open'||s==='done'?s:'none',c=comById.get(id),at=noteAt(state,ckey(id,'opened'));
  f[`lotm.commission.${id}.status`]=st;
  f[`lotm.commission.${id}.ready`]=st==='open'&&at!=null&&!!c?.lead&&state.clock-at>=c.lead.days*DAY_MINUTES;
  for(const stg of c?.stages||[])f[`lotm.commission.${id}.stage.${stg.id}`]=pf[ckey(id,'stage.'+stg.id)]==='paid'?'paid':'none';
  for(const k of Object.keys(pf))if(k.startsWith(ckey(id,'stage.')))f[`lotm.${k.slice('book.lotm.'.length)}`]=pf[k]==='paid'?'paid':'none';
 }
}
// Read-only reading for Reports and the U4 ledger: open instalments with their state, due in words. Nothing is saved from it.
export function payView(state){
 const pf=state.actors?.player?.facts||{},lines=[],commissions=[],owed=[];
 for(const l of PAY_LINES){const paid=pf[pkey(l.id,'paid')]??0;if(pf[pkey(l.id,'status')]==='started'){const nx=paid+1,p=(()=>{try{return payFor(l.id,nx);}catch{return null;}})();lines.push({id:l.id,label:l.label,payer:l.payer,weeksPaid:paid,nextWeek:nx,nextPence:p});}}
 for(const c of COMMISSIONS){
  const s=pf[ckey(c.id,'status')];if(s!=='open'&&s!=='done')continue;
  const stages=c.stages.map(x=>({id:x.id,label:x.label||x.id,pence:x.amount==null?null:toPence(x),paid:pf[ckey(c.id,'stage.'+x.id)]==='paid'}));
  commissions.push({id:c.id,label:c.label,patron:c.patron,status:s,stages,paidPence:stages.filter(x=>x.paid).reduce((n,x)=>n+x.pence,0),leadDays:c.lead?.days??null});
  for(const x of stages)if(!x.paid&&x.pence!=null&&s==='open')owed.push({id:`commission:${c.id}:${x.id}`,kind:'coin',debtor:'player',creditor:c.patron,amount:x.pence,why:`${c.label}: ${x.label}`,source:'lotm_commission'});
 }
 return {lines,commissions,owed};
}
export function payAssertions({a,assert}){
 const pf=a.player.facts||{};
 for(const id of idsIn(pf,PAY_PREFIX,PAY_LINES)){
  const st=pf[pkey(id,'status')],paid=pf[pkey(id,'paid')];
  assert(st===undefined||st==='started','A pay line is started or absent.');
  assert(paid===undefined||(st==='started'&&Number.isSafeInteger(paid)&&paid>=0),'Paid weeks are a whole number on a started line.');
 }
 for(const id of idsIn(pf,COMMISSION_PREFIX,COMMISSIONS)){
  const st=pf[ckey(id,'status')],c=comById.get(id);
  assert(st===undefined||st==='open'||st==='done','A commission is open, done or absent.');
  const stageKeys=Object.keys(pf).filter(k=>k.startsWith(ckey(id,'stage.')));
  assert(st!==undefined||!stageKeys.length,'A stage payment needs its commission.');
  for(const k of stageKeys)assert(pf[k]==='paid','A stage is paid or absent.');
  if(c)for(let i=1;i<c.stages.length;i++)assert(pf[ckey(id,'stage.'+c.stages[i].id)]!=='paid'||pf[ckey(id,'stage.'+c.stages[i-1].id)]==='paid','Stages are paid in order.');
 }
 for(const k of Object.keys(a.player.resources||{}))assert(!/^book\.lotm\.(pay|commission)/.test(k),'Pay and commissions live in the purse only; no second money counter.');
}
