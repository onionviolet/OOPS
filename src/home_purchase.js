// Home purchase terms are world data. Homes owns the retained agreement;
// Ledger reads the same balance through obligations@1, without a second debt store.
import {HOME_PLACES,homeMoneyWord} from './home_content.js';
import {obligation} from './obligations_ledger.js';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const check=(v,m)=>{if(!v)throw Error(`Home: ${m}`);};
export function purchaseQuote(place, context, method='cash') {
 const sale=place.purchase;
 if(!sale)return {method:'cash',pay:place.price,balance:0,creditor:place.owner,due:null,installment:0};
 check(sale.seller===place.owner&&nat(sale.price)&&sale.price>0,'the seller must hold this title and state a price');
 const tie=sale.tie;
 if(tie){const regard=context.relationships?.[sale.seller]?.player?.axes?.[`tie.${tie.kind}`]||0;
  check(Number.isSafeInteger(tie.atLeast)&&regard>=tie.atLeast,tie.reason||'the seller has not agreed to these terms');}
 if(method==='cash')return {method,pay:sale.price,balance:0,creditor:sale.seller,due:null,installment:0};
 const terms=sale[method];
 check(['loan','installments'].includes(method)&&terms&&nat(terms.deposit)&&terms.deposit<=sale.price&&nat(terms.interest||0)&&Number.isSafeInteger(terms.period)&&terms.period>0&&Number.isSafeInteger(terms.installment)&&terms.installment>0,'these purchase terms are not offered');
 return {method,pay:terms.deposit,balance:sale.price-terms.deposit+(terms.interest||0),creditor:terms.creditor||sale.seller,due:context.clock+terms.period,installment:terms.installment,period:terms.period};
}
export function validatePurchase(home,place,clock) {
 if(!home.purchase)return;
 const r=home.purchase;
 check(place.purchase&&home.deed===true&&home.owner==='player'&&home.tenure==='owned'&&r.seller===place.owner&&['cash','loan','installments'].includes(r.method)&&nat(r.balance)&&nat(r.paid)&&typeof r.creditor==='string'&&nat(r.at)&&r.at<=clock,'invalid retained purchase');
 const terms=r.method==='cash'?null:place.purchase[r.method];
 check(terms?r.period===terms.period&&r.installment===terms.installment&&nat(r.due)&&r.creditor===(terms.creditor||place.owner)&&r.paid+r.balance===place.purchase.price+(terms.interest||0):r.balance===0&&r.paid===place.purchase.price&&r.due===null,'purchase balance and terms disagree');
}
export function homePurchaseRows(homes, {clock = null, displayClock = null} = {}) {
 return Object.values(homes?.properties||{}).filter(h=>h.purchase?.balance>0).map(h=>{
  const word=homeMoneyWord(HOME_PLACES[h.id]?.world),unit=HOME_PLACES[h.id]?.moneyUnit||(word==='pence'?{one:'penny',many:'pence'}:word==='coins'?{one:'coin',many:'coins'}:word);
  return {...obligation({id:`home:${h.id}`,kind:'coin',debtor:'player',creditor:h.purchase.creditor,amount:h.purchase.balance,
   why:`Purchase of ${h.name}.`,source:'homes',since:Number.isFinite(clock)&&Number.isFinite(displayClock)?Math.max(0,displayClock-Math.max(0,clock-h.purchase.at)):h.purchase.at,carries:HOME_PLACES[h.id]?.purchase?.carries!==false}),unit,creditorLabel:HOME_PLACES[h.id]?.purchase?.[h.purchase.method]?.creditorLabel||HOME_PLACES[h.id]?.purchase?.sellerLabel||(h.purchase.method==='loan'?'the lender':'the seller')};
 });
}
