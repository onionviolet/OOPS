// Paid client sessions and referral standing (AD48 briefs B6 and R9). A session for a client is one place-act row that carries the effects below.
// One authority per fact (AR, ECC25): the fee lands in the native purse (the only money ledger) as one `money` effect; everything else is a player
// fact per client (status, net fee received as a receipt, favor), and the services-sold and referral readings are DERIVED from those facts, so there
// is no second counter that could drift. The fee is a quote with a basis: stated (the text gives it), listed (a posted price), assumed (a default
// with a dial), or unknown (no figure; nothing is paid and no figure is invented). Proposal values below are assumed (WPR5, AD49). Pure data and
// functions; no state, no clock, no save. Effects are plain JSON, so a cast pack can embed them.
// The be seat's situation (LOTM_CAST_SITUATION in book_world_lotm_cast_host.js; copied to keep this module a leaf).
const SITUATION='book.lotm.tingen.canon_beside';
export const BE_CLIENT_PREFIX='book.lotm.be.client.';
export const BE_CLIENT_STATUS=Object.freeze(['none','paid','served_unpaid','refused']);
export const FEE_BASES=Object.freeze(['stated','listed','assumed','unknown']);
// Dials (limits are adjectives): favor a served client holds toward the lead, and whether serving without a fee still earns it.
export const BE_FAVOR={paid:1,servedUnpaid:1,refused:0};
// First clients. `referrer` is a standing key, not a person id. Fee and house cut are assumed (ch48 P025-P077 posts two then eight pence and says the
// club keeps an eighth; no paragraph through ch54 P079 shows a fee agreed). Content passes its own quote; an absent quote is `unknown`.
export const BE_CLIENTS=Object.freeze([
 {id:'anna',label:'Anna',service:'divination',referrer:'angelica',referrerLabel:'Angelica',quote:{pence:8,currency:'pence',basis:'assumed',houseCut:{num:1,den:8,basis:'assumed'}}}]);
const byId=Object.fromEntries(BE_CLIENTS.map(c=>[c.id,c]));
const key=(id,part='')=>`${BE_CLIENT_PREFIX}${id}${part?`.${part}`:''}`;
const fact=(k,value)=>({type:'fact',scope:'actor',actor:'player',key:k,value});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
// Net fee from a quote. Throws on a quote that cannot be paid honestly: a non-pence currency needs the exchange quote that owns it (ECX6, R2), and a
// stated figure must be a positive integer. An unknown quote yields null, never a number.
export function feeNet(quote){
 if(!quote||quote.basis==='unknown'||quote.pence==null)return null;
 if(!FEE_BASES.includes(quote.basis))throw Error('A fee quote needs a basis: stated, listed, assumed or unknown.');
 if(quote.currency!=='pence')throw Error('A fee in another currency needs its exchange quote first; this purse holds pence.');
 if(!Number.isSafeInteger(quote.pence)||quote.pence<=0)throw Error('A fee must be a positive whole number of pence.');
 const h=quote.houseCut,cut=h?Math.floor(quote.pence*h.num/h.den):0;
 if(h&&!(Number.isSafeInteger(h.num)&&Number.isSafeInteger(h.den)&&h.num>=0&&h.den>0&&h.num<=h.den))throw Error('A house cut is a fraction between zero and one.');
 return {gross:quote.pence,cut,net:quote.pence-cut,basis:quote.basis};
}
const word=n=>`${n} pence`;
function sessionPlan(clientId,quote){
 const c=byId[clientId];if(!c)throw Error('Unknown client.');
 const q=quote===undefined?c.quote:quote,net=feeNet(q),paid=!!net&&net.net>0;
 const line=paid?`${c.label} paid ${word(net.gross)} for the ${c.service}${net.cut?`; the club kept ${word(net.cut)} and you took ${word(net.net)}`:''} (${net.basis}). ${c.referrerLabel} sent ${c.label}, and ${c.label} thinks well of you.`
  :`You served ${c.label} and no fee was settled, so none is counted. ${c.label} remembers the help.`;
 return {c,net,paid,line};
}
// The line the act's `report` field should carry, so the existing Reports log shows the fee (knowledge entries go to the notebook, not the log).
export const clientSessionReport=(clientId,{quote}={})=>sessionPlan(clientId,quote).line;
// Serve a client. quote === undefined uses the client's own quote; pass {basis:'unknown'} for a session with no stated fee. Returns plain effects.
export function clientSessionEffects(clientId,{quote}={}){
 const {c,net,paid,line}=sessionPlan(clientId,quote);
 return [fact(key(c.id),paid?'paid':'served_unpaid'),
  ...(paid?[{type:'resource',actor:'player',key:'money',native:true,amount:net.net},fact(key(c.id,'fee'),net.net)]:[]),
  fact(key(c.id,'favor'),paid?BE_FAVOR.paid:BE_FAVOR.servedUnpaid),
  {type:'knowledge',actor:'player',key:`book.lotm.be.client.${c.id}.session`,stage:'seen',value:line,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}}];
}
// A refused client pays nothing and gains no favor or referral. Pair this with a place-act row for the refusal scene.
export function clientRefuseEffects(clientId){
 const c=byId[clientId];if(!c)throw Error('Unknown client.');
 return [fact(key(c.id),'refused'),fact(key(c.id,'favor'),BE_FAVOR.refused),
  {type:'knowledge',actor:'player',key:`book.lotm.be.client.${c.id}.session`,stage:'seen',value:`You turned ${c.label} away. No fee, no favor, and ${c.referrerLabel} hears of it.`,basis:{kind:'observation',attributedTo:'player',situationId:SITUATION}}];
}
// A client can be served once, and never after a refusal.
export const clientSessionRequires=clientId=>({fact:`lotm.be.client.${clientId}.status`,op:'eq',value:'none',reason:'This client has already been dealt with.'});
// Facts for rules, one set per registered client.
export function beClientFacts(state,f){
 const pf=state.actors?.player?.facts||{};
 for(const c of BE_CLIENTS){
  const s=pf[key(c.id)];f[`lotm.be.client.${c.id}.status`]=BE_CLIENT_STATUS.includes(s)?s:'none';
  f[`lotm.be.client.${c.id}.fee`]=pf[key(c.id,'fee')]??0;f[`lotm.be.client.${c.id}.favor`]=pf[key(c.id,'favor')]??0;
 }
}
// Derived reading (services sold, referral standing, favor): the existing Reports and character views can quote it; nothing is saved here.
export function beClientView(state){
 const pf=state.actors?.player?.facts||{},sold={},referrals={},clients=[];
 for(const c of BE_CLIENTS){
  const s=BE_CLIENT_STATUS.includes(pf[key(c.id)])?pf[key(c.id)]:'none';if(s==='none')continue;
  const fee=pf[key(c.id,'fee')]??null,favor=pf[key(c.id,'favor')]??0,r=referrals[c.referrer]||={label:c.referrerLabel,sent:0,paid:0,favor:0};
  clients.push({id:c.id,label:c.label,service:c.service,status:s,feePence:fee,favor,referrer:c.referrerLabel});
  r.sent++;r.favor+=favor;if(s==='paid'){r.paid++;sold[c.service]=(sold[c.service]||0)+1;}
 }
 return {clients,sold,referrals,incomePence:clients.reduce((n,c)=>n+(c.feePence||0),0)};
}
export function beClientAssertions({a,assert}){
 const pf=a.player.facts||{};
 for(const c of BE_CLIENTS){
  const s=pf[key(c.id)],fee=pf[key(c.id,'fee')],favor=pf[key(c.id,'favor')];
  assert(s===undefined||BE_CLIENT_STATUS.includes(s),'A client has one recorded status.');
  assert(s!==undefined||(fee===undefined&&favor===undefined),'A client record needs its status.');
  assert(s==='paid'?natural(fee)&&fee>0:fee===undefined,'Only a paid client carries a fee receipt.');
  assert(favor===undefined||Number.isSafeInteger(favor),'Favor is a whole number.');
  assert(s!=='refused'||favor===0,'A refused client holds no favor.');
 }
 for(const k of Object.keys(a.player.resources||{}))assert(!/^book\.lotm\.be\.(client|fee|income)/.test(k),'Client fees live in the purse only; no second money counter.');
}
