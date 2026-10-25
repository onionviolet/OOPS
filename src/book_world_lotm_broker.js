// Beyonder broker trade (Q5, institutions pass F10, F13-F15, EF4, EF5): a trusted middleman holds both the money and the item until
// the buyer verifies; a forged lot is returned and the money comes back; barter swaps equal values. This is the shared form of the bespoke
// escrow elsewhere (implementation map C5/E3): a lot is a row, custody is the engine's transfer, the escrow is a resource on the broker, and
// every step leaves a record. Source anchors: the broker holds both until verification [459 p32, 460 p76-p80]; a price carries a rarity
// premium over the market band [459 p26-p31]; an agent's commission can be a percentage with a floor [498 p75]; equal-value barter is
// accepted [459 p30]. The lots, prices, fees and the cut are authored proposals at Tingen's scale (WPR5), not the source's pounds.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,money,transfer,know,cmd} from './book_world_lotm_kit.js';
export const BROKER_PLACE=L.docks;
export const BROKER_CUT={percent:10,floorPence:P.soli};
export const BROKER_VERIFY_FEE=P.soli;
import {pathwayRows} from './book_world_lotm_rows.js';
// Unmarked doses: every pathway row that defines a market gets two lots (its Sequence 9 and its Sequence 8 dose), so a pathway added as data is
// purchasable and carries the stated causes through book_world_lotm_causes.js. The appraiser's verdict names what the dose is.
const marketLots=pathwayRows.filter(r=>r.market).flatMap(r=>[
 {id:`dose9_${r.key}`,label:'an unmarked prepared dose',item:K[r.market.baseHold],genuine:true,payment:{pence:6*P.pound},verdict:`The appraiser judged the unmarked dose genuine: a Sequence 9 ${r.potion} potion. Drinking it is not covered by any church allocation.`},
 {id:`dose8_${r.key}`,label:'an unmarked Sequence 8 dose',item:K[r.market.nextHold],genuine:true,payment:{pence:12*P.pound},verdict:`The appraiser judged the dose genuine: a Sequence 8 ${r.next} potion. Taking it out of order, undigested or unassessed is a stated cause of loss of control.`}]);
export const LOTM_LOTS=Object.freeze([
 {id:'frog',label:'a dried black-spotted frog',item:K.frog,genuine:true,payment:{pence:3*P.soli},blurb:'A formula material sold by a seller\'s agent; the broker holds it.'},
 {id:'hairs',label:'a bundle of rare hairs',item:K.hairs,genuine:false,payment:{pence:4*P.soli},blurb:'A rarer lot at a rarer price; the broker cannot promise it is what the agent says.'},
 ...marketLots,
 {id:'ink',label:'a jar of grave-dust ink',item:K.ink,genuine:true,valuePence:3*P.soli,payment:{barter:{key:K.frog,label:'a dried black-spotted frog',valuePence:3*P.soli}},blurb:'Offered only in barter, one frog for one jar at equal value.'}]);
export const cutFor=pence=>Math.max(BROKER_CUT.floorPence,Math.floor(pence*BROKER_CUT.percent/100));
const f=(lot,n)=>`lot.${lot.id}.${n}`,escrow=(actor,amount)=>({type:'resource',actor,key:'book.lotm.escrow',amount});
// Fixed posted terms, not an appraisal of hidden truth. Simulation preview/commit owns the
// executable quote and rechecks physical stock; these world rows own the proposed valuation.
export function brokerQuote(lot){
 const b=lot.payment.barter,positive=n=>Number.isSafeInteger(n)&&n>0;
 if(b){
  if(!positive(b.valuePence)||!positive(lot.valuePence))throw Error('Barter needs positive integer values in pence.');
  return {kind:'barter',offeredPence:b.valuePence,requestedPence:lot.valuePence,equal:b.valuePence===lot.valuePence,pricePence:0,feePence:BROKER_VERIFY_FEE};
 }
 if(!positive(lot.payment.pence))throw Error('A broker price must be positive integer pence.');
 return {kind:'money',pricePence:lot.payment.pence,feePence:BROKER_VERIFY_FEE};
}
const price=lot=>brokerQuote(lot).pricePence;
export function brokerLotCommands(lot){
 const quote=brokerQuote(lot);
 if(quote.kind==='barter'&&!quote.equal)throw Error('This broker accepts barter at equal posted value.');
 const bm=!!lot.payment.barter,t={alone:true,targetId:I.broker,visibleWhen:all(eq('lotm.enrolled'),eq('lotm.brokerHere'))};
 const where=(extra)=>all(eq('lotm.brokerHere'),...extra);
 return [
  cmd(`lot_pay_${lot.id}`,bm?`Barter ${lot.payment.barter.label} for ${lot.label}; the broker holds both`:`Pay ${price(lot)} pence for ${lot.label}; the broker holds the money and the item`,BROKER_PLACE,{...t,
   requires:where([eq(`lotm.lot.${lot.id}.held`),no(f(lot,'paid')),...(bm?[gte(`lotm.holds.${lot.payment.barter.key===K.frog?'frog':'x'}`,1)]:[])]),
   costs:bm?[transfer('player',I.broker,lot.payment.barter.key)]:[money(-price(lot))],
   effects:[af(f(lot,'paid')),...(bm?[]:[escrow(I.broker,price(lot))]),know(`lot.${lot.id}.held`,bm?`You handed ${lot.payment.barter.label} to the broker for ${lot.label}. The broker holds both sides until you verify; the broker's word is the stake, not a promise the lot is genuine.`:`You paid ${price(lot)} pence. The broker holds your money and ${lot.label} until you verify it; the seller's agent can carry the offer but cannot promise you will accept.`,'player','player','observation','understood')]}),
  cmd(`lot_verify_${lot.id}`,`Verify ${lot.label} with the broker's appraiser · ${BROKER_VERIFY_FEE} pence`,BROKER_PLACE,{...t,requires:where([eq(`lotm.lot.${lot.id}.held`),has(f(lot,'paid')),no(f(lot,'verified'))]),
   costs:[money(-BROKER_VERIFY_FEE)],effects:[af(f(lot,'verified')),af(f(lot,lot.genuine?'genuine':'forged')),know(`lot.${lot.id}.verdict`,lot.verdict??(lot.genuine?`The appraiser judged ${lot.label} genuine. You may settle, and the broker's cut comes out of the seller's side.`:`The appraiser judged ${lot.label} a forgery. Nothing has left the broker's hands: you may take your side back.`),'player','player','observation','understood')]}),
  cmd(`lot_settle_${lot.id}`,`Settle for ${lot.label}: the broker releases it and pays the seller`,BROKER_PLACE,{...t,requires:where([has(f(lot,'genuine')),no(f(lot,'settled'))]),
   costs:[transfer(I.broker,'player',lot.item),...(bm?[]:[escrow(I.broker,-price(lot))])],effects:[af(f(lot,'settled')),know(`lot.${lot.id}.settled`,bm?`The swap is done: ${lot.label} is yours and the seller has your ${lot.payment.barter.label}.`:`The broker released ${lot.label} to you and paid the seller ${price(lot)-cutFor(price(lot))} pence after a ${cutFor(price(lot))}-pence cut. The deal is closed.`,'player','player','observation','understood')]}),
  cmd(`lot_reject_${lot.id}`,`Reject ${lot.label} as forged and take your side back`,BROKER_PLACE,{...t,requires:where([has(f(lot,'forged')),no(f(lot,'rejected'))]),
   costs:bm?[transfer(I.broker,'player',lot.payment.barter.key)]:[escrow(I.broker,-price(lot))],effects:[af(f(lot,'rejected')),...(bm?[]:[money(price(lot))]),know(`lot.${lot.id}.rejected`,`The broker returned ${bm?lot.payment.barter.label:price(lot)+' pence'} and kept ${lot.label} for the seller's agent. You lost the appraiser's ${BROKER_VERIFY_FEE}-pence fee, which is the price of checking.`,'player','player','observation','understood')]})];
}
export const brokerCommands=LOTM_LOTS.flatMap(brokerLotCommands);
export const lotFlags=LOTM_LOTS.flatMap(l=>['paid','verified','genuine','forged','settled','rejected'].map(n=>f(l,n)));
export function brokerFacts(state,f2,{alive,enrolled,player,inventory={}}){
 const s=state.simulation||{},b=s.people?.[I.broker];
 f2['lotm.brokerHere']=enrolled&&state.actors?.[I.broker]?.worldId===I.world&&alive(b)&&b.location===player.location;
 for(const lot of LOTM_LOTS)f2[`lotm.lot.${lot.id}.held`]=(inventory[lot.item]||0)>=1;
 f2['lotm.escrow']=state.actors?.[I.broker]?.resources?.['book.lotm.escrow']??0;
}
// Escrow consistency: the broker's held money equals the price of every paid, unsettled, unrejected money lot.
export function brokerAssertions({a,has,assert}){
 const b=a[I.broker];if(!b)return;
 const held=LOTM_LOTS.filter(l=>!l.payment.barter&&has(f(l,'paid'))&&!has(f(l,'settled'))&&!has(f(l,'rejected'))).reduce((n,l)=>n+price(l),0);
 assert((b.resources?.['book.lotm.escrow']||0)===held,'The broker\'s escrow must equal the money held for open lots.');
 for(const l of LOTM_LOTS){
  const verified=has(f(l,'verified')),genuine=has(f(l,'genuine')),forged=has(f(l,'forged'));
  assert(!verified||has(f(l,'paid')),'A verification needs a paid lot.');
  assert(verified?(genuine!==forged):!genuine&&!forged,'A verified lot needs exactly one recorded verdict.');
  assert(!has(f(l,'settled'))||genuine,'Only a genuine lot settles.');
  assert(!has(f(l,'rejected'))||forged,'Only a forged lot is rejected.');
  assert(!(has(f(l,'settled'))&&has(f(l,'rejected'))),'A lot closes one way.');
 }
}

// Known trade status only: posted prices reveal no appraisal result before verification.
export function brokerView(state,facts){
 if(!facts['lotm.brokerHere'])return null;
 const has=(l,n)=>state.actors?.player?.facts?.[`book.lotm.${f(l,n)}`]===true;
 return {escrowPence:facts['lotm.escrow'],barters:LOTM_LOTS.filter(l=>l.payment.barter).map(l=>({id:l.id,label:l.label,offered:l.payment.barter.label,...brokerQuote(l)})),
  trades:LOTM_LOTS.filter(l=>has(l,'paid')).map(l=>({id:l.id,label:l.label,status:has(l,'settled')?'settled':has(l,'rejected')?'rejected and refunded':has(l,'forged')?'verification failed; refund available':has(l,'genuine')?'verified; release available':'held; awaiting verification'}))};
}
