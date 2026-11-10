// Paid client sessions and referral standing (AD48 briefs B6 and R9). A session for a client is one place-act row that carries the effects below.
// One authority per fact (AR, ECC25): the fee lands in the native purse (the only money ledger) as one `money` effect; everything else is a player
// fact per client (status, net fee received as a receipt, favor), and the services-sold and referral readings are DERIVED from those facts, so there
// is no second counter that could drift. The fee is a quote with a basis: stated (the text gives it), listed (a posted price), assumed (a default
// with a dial), or unknown (no figure; nothing is paid and no figure is invented). Proposal values below are assumed (WPR5, AD49). Pure data and
// functions; no state, no clock, no save. Effects are plain JSON, so a cast pack can embed them.
// The be seat's situation (LOTM_CAST_SITUATION in book_world_lotm_cast_host.js; copied to keep this module a leaf).
import {isGrained,roundToGrain,grainFor,penceLabel} from './currency_subunits.js';
const SITUATION='book.lotm.tingen.canon_beside';
export const BE_CLIENT_PREFIX='book.lotm.be.client.';
export const BE_CLIENT_STATUS=Object.freeze(['none','paid','served_unpaid','refused']);
export const FEE_BASES=Object.freeze(['stated','listed','assumed','unknown']);
// Dials (limits are adjectives): favor a served client holds toward the lead, and whether serving without a fee still earns it.
export const BE_FAVOR={paid:1,servedUnpaid:1,refused:0};
// Clients are DATA in a registry (C1): content registers a client with `registerBeClient` and needs no src edit. A client carries its own quote:
// {amount, currency, basis, houseCut?, tip?, settle?}. Currency is a denomination of the one Loen purse (pence 1, soli 12, pound 240; the purse
// stays one number in pence, ECC25), not an exchange pair. `houseCut` is {num,den,basis}; `tip` is {pence,basis}; `settle` is when cut and tip leave the
// purse: 'session' (default, netted into the session money effect) or 'later' (the session pays gross and clientSettleEffects pays them once, as
// the text does at ch56 P036-P038). A figure is never invented: no quote or basis 'unknown' pays nothing. Figures come from the text, not from the
// BE_CLIENTS defaults: Anna's note is one soli (ch55 P067), the club takes an eighth as standing practice (ch52), Klein's tip is a halfpenny (ch56 P038).
export const DENOMINATIONS=Object.freeze({pence:1,soli:12,pound:240});
export const BE_GRAIN=grainFor('book.lotm.tingen');
const BASES=Object.freeze(['stated','listed','assumed','unknown']);
export const BE_CLIENTS=[];
const onGrain=n=>typeof n==='number'&&n>=0&&isGrained(n,BE_GRAIN);
const byId=new Map();
export function registerBeClient(def){
 const ok=s=>typeof s==='string'&&/^[a-z0-9_]+$/.test(s);
 if(!def||!ok(def.id))throw Error('A client needs a lowercase id.');
 for(const k of ['label','service','referrer','referrerLabel'])if(typeof def[k]!=='string'||!def[k])throw Error(`A client needs ${k}.`);
 if(def.quote!=null)feeNet(def.quote);
 const prior=byId.get(def.id);
 if(prior&&JSON.stringify(prior)!==JSON.stringify(def))throw Error('That client is already registered with different terms.');
 if(!prior){const c=JSON.parse(JSON.stringify(def));byId.set(c.id,c);BE_CLIENTS.push(c);}
 return byId.get(def.id);
}
// The first clients (proposal values marked by basis; the text locators are in the C1 receipt).
registerBeClient({id:'anna',label:'Anna',service:'divination',referrer:'angelica',referrerLabel:'Angelica',quote:{amount:1,currency:'soli',basis:'stated',houseCut:{num:1,den:8,basis:'stated'},tip:{pence:0.5,basis:'stated'},settle:'later'}});
registerBeClient({id:'glacis',label:'Glacis',service:'divination',referrer:'angelica',referrerLabel:'Angelica',quote:{amount:8,currency:'pence',basis:'listed',houseCut:{num:1,den:8,basis:'listed'},settle:'later'}});
registerBeClient({id:'joyce',label:'Joyce',service:'dream interpretation',referrer:'angelica',referrerLabel:'Angelica',quote:{amount:1,currency:'soli',basis:'stated',houseCut:{num:1,den:8,basis:'listed'},settle:'later'}});
registerBeClient({id:'bogda',label:'Bogda',service:'divination',referrer:'angelica',referrerLabel:'Angelica',quote:{amount:8,currency:'pence',basis:'stated',houseCut:{num:1,den:8,basis:'listed'},settle:'later'}});
const key=(id,part='')=>`${BE_CLIENT_PREFIX}${id}${part?`.${part}`:''}`;
const fact=(k,value)=>({type:'fact',scope:'actor',actor:'player',key:k,value});
// Saved ids too (load order: a save can hold a client the pack has not registered yet).
const idsIn=pf=>[...new Set([...BE_CLIENTS.map(c=>c.id),...Object.keys(pf).map(k=>k.startsWith(BE_CLIENT_PREFIX)&&k.slice(BE_CLIENT_PREFIX.length).split('.')[0]).filter(Boolean)])];
const describe=id=>byId.get(id)||{id,label:id,service:'a service',referrer:'unknown',referrerLabel:'someone'};
// Net fee from a quote, all in pence on the world grain. Throws on a quote that cannot be paid honestly. An unknown quote yields null, never a number.
// {gross, cut, tip, owed (cut+tip), now (what the session moves: gross, less owed when settle is 'session'), net (gross - owed), basis}.
export function feeNet(quote){
 if(!quote||quote.basis==='unknown')return null;
 const amount=quote.amount??quote.pence;if(amount==null)return null;
 if(!BASES.includes(quote.basis))throw Error('A fee quote needs a basis: stated, listed, assumed or unknown.');
 const unit=DENOMINATIONS[quote.currency];
 if(!unit)throw Error('A fee in another currency needs its exchange quote first; this purse holds pence.');
 if(!(typeof amount==='number'&&amount>0&&Number.isFinite(amount)))throw Error('A fee must be a positive number.');
 const gross=amount*unit;if(!isGrained(gross,BE_GRAIN))throw Error('A fee must be on the purse grain (whole pence or halfpence).');
 const h=quote.houseCut;
 if(h&&!(Number.isSafeInteger(h.num)&&Number.isSafeInteger(h.den)&&h.num>=0&&h.den>0&&h.num<=h.den))throw Error('A house cut is a fraction between zero and one.');
 const cut=h?roundToGrain(gross*h.num/h.den,BE_GRAIN,'up'):0;
 const tip=quote.tip?quote.tip.pence:0;
 if(tip&&!(onGrain(tip)))throw Error('A tip must be a non-negative sum on the purse grain.');
 if(quote.settle!==undefined&&!['session','later'].includes(quote.settle))throw Error('Settle is session or later.');
 const owed=cut+tip;if(owed>gross)throw Error('Cut and tip cannot exceed the fee.');
 return {gross,cut,tip,owed,now:quote.settle==='later'?gross:gross-owed,net:gross-owed,later:quote.settle==='later'?owed:0,basis:quote.basis};
}
const word=n=>penceLabel(n);
function sessionPlan(clientId,quote){
 const c=byId.get(clientId);if(!c)throw Error('Unknown client.');
 const q=quote===undefined?c.quote:quote,net=feeNet(q),paid=!!net&&net.now>0;
 const owedWords=net&&net.owed?(net.later?`; ${word(net.owed)} is still owed the club and your tip`:`; the club kept ${word(net.cut)}${net.tip?` and you tipped ${word(net.tip)}`:''} and you took ${word(net.now)}`):'';
 const line=paid?`${c.label} paid ${word(net.gross)} for the ${c.service}${owedWords} (${net.basis}). ${c.referrerLabel} sent ${c.label}, and ${c.label} thinks well of you.`
  :`You served ${c.label} and no fee was settled, so none is counted. ${c.label} remembers the help.`;
 return {c,net,paid,line};
}
// The line the act's `report` field should carry, so the existing Reports log shows the fee (knowledge entries go to the notebook, not the log).
export const clientSessionReport=(clientId,{quote}={})=>sessionPlan(clientId,quote).line;
// Serve a client. quote === undefined uses the client's own quote; pass {basis:'unknown'} for a session with no stated fee. Returns plain effects.
export function clientSessionEffects(clientId,{quote}={}){
 const {c,net,paid,line}=sessionPlan(clientId,quote);
 return [fact(key(c.id),paid?'paid':'served_unpaid'),
  ...(paid?[{type:'resource',actor:'player',key:'money',native:true,amount:net.now},fact(key(c.id,'fee'),net.now),...(net.later?[fact(key(c.id,'owed'),net.later)]:[])]:[]),
  fact(key(c.id,'favor'),paid?BE_FAVOR.paid:BE_FAVOR.servedUnpaid),
  {type:'knowledge',actor:'player',key:`book.lotm.be.client.${c.id}.session`,stage:'seen',value:line,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}}];
}
// Pay what a 'later' session left owed (the club's share and the tip) once: one money effect, the receipt becomes the net, and the owed fact
// clears to 0. Safe for saves already past the session whose figures were hand-written (they carry no owed fact): pass {owed} to state it.
export function clientSettleEffects(clientId,{quote,owed}={}){
 const c=byId.get(clientId);if(!c)throw Error('Unknown client.');
 const net=feeNet(quote===undefined?c.quote:quote),amount=owed??net?.later;
 if(!net||!(amount>0)||!onGrain(amount))throw Error('Nothing is owed on this client.');
 return [{type:'resource',actor:'player',key:'money',native:true,amount:-amount},fact(key(c.id,'fee'),net.gross-amount),fact(key(c.id,'owed'),0),
  {type:'knowledge',actor:'player',key:`book.lotm.be.client.${c.id}.settle`,stage:'seen',value:`You paid ${word(amount)} to ${c.referrerLabel} for the club's share${net.tip?' and your tip':''} on ${c.label}.`,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}}];
}
// Settle only while something is owed (statuses are `paid`; the owed fact is derived below).
export const clientSettleRequires=clientId=>({all:[{fact:`lotm.be.client.${clientId}.status`,op:'eq',value:'paid'},{fact:`lotm.be.client.${clientId}.owed`,op:'gte',value:0.5,reason:'Nothing is owed on this client.'}]});
// A refused client pays nothing and gains no favor or referral. Pair this with a place-act row for the refusal scene.
export function clientRefuseEffects(clientId){
 const c=byId.get(clientId);if(!c)throw Error('Unknown client.');
 return [fact(key(c.id),'refused'),fact(key(c.id,'favor'),BE_FAVOR.refused),
  {type:'knowledge',actor:'player',key:`book.lotm.be.client.${c.id}.session`,stage:'seen',value:`You turned ${c.label} away. No fee, no favor, and ${c.referrerLabel} hears of it.`,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}}];
}
// A client can be served once, and never after a refusal.
export const clientSessionRequires=clientId=>({fact:`lotm.be.client.${clientId}.status`,op:'eq',value:'none',reason:'This client has already been dealt with.'});
// Facts for rules, one set per client (registered or found in the save).
export function beClientFacts(state,f){
 const pf=state.actors?.player?.facts||{};
 for(const id of idsIn(pf)){
  const s=pf[key(id)];f[`lotm.be.client.${id}.status`]=BE_CLIENT_STATUS.includes(s)?s:'none';
  f[`lotm.be.client.${id}.fee`]=pf[key(id,'fee')]??0;f[`lotm.be.client.${id}.favor`]=pf[key(id,'favor')]??0;f[`lotm.be.client.${id}.owed`]=pf[key(id,'owed')]??0;
 }
}
// Derived reading (services sold, referral standing, favor): the existing Reports and character views can quote it; nothing is saved here.
export function beClientView(state){
 const pf=state.actors?.player?.facts||{},sold={},referrals={},clients=[];
 for(const id of idsIn(pf)){
  const c=describe(id),s=BE_CLIENT_STATUS.includes(pf[key(id)])?pf[key(id)]:'none';if(s==='none')continue;
  const fee=pf[key(id,'fee')]??null,favor=pf[key(id,'favor')]??0,owed=pf[key(id,'owed')]??0,r=referrals[c.referrer]||={label:c.referrerLabel,sent:0,paid:0,favor:0};
  clients.push({id,label:c.label,service:c.service,status:s,feePence:fee,owedPence:owed,favor,referrer:c.referrerLabel});
  r.sent++;r.favor+=favor;if(s==='paid'){r.paid++;sold[c.service]=(sold[c.service]||0)+1;}
 }
 return {clients,sold,referrals,incomePence:clients.reduce((n,c)=>n+(c.feePence||0),0)};
}
export function beClientAssertions({a,assert}){
 const pf=a.player.facts||{};
 for(const id of idsIn(pf)){
  const s=pf[key(id)],fee=pf[key(id,'fee')],favor=pf[key(id,'favor')],owed=pf[key(id,'owed')];
  assert(s===undefined||BE_CLIENT_STATUS.includes(s),'A client has one recorded status.');
  assert(s!==undefined||(fee===undefined&&favor===undefined&&owed===undefined),'A client record needs its status.');
  assert(s==='paid'?onGrain(fee)&&fee>0:fee===undefined,'Only a paid client carries a fee receipt.');
  assert(owed===undefined||(s==='paid'&&onGrain(owed)),'Only a paid client can owe the club.');
  assert(favor===undefined||Number.isSafeInteger(favor),'Favor is a whole number.');
  assert(s!=='refused'||favor===0,'A refused client holds no favor.');
 }
 for(const k of Object.keys(a.player.resources||{}))assert(!/^book\.lotm\.be\.(client|fee|income)/.test(k),'Client fees live in the purse only; no second money counter.');
}
