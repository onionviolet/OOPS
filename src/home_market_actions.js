import {HOME_PLACES,homeMoneyWord} from './home_content.js';
// Listings and retained accounts use the same home quote/commit path as fittings.
export function homeMarketActions(state,homes,quote) {
 if(typeof quote!=='function')return [];
 const world=state?.actors?.player?.worldId,at=state?.simulation?.people?.player?.location,rows=[];
 const offer=(id,label,request)=>{const q=quote(request);rows.push({id,label,request,eligible:q.eligible,reason:q.reason||''});};
 for(const [id,p]of Object.entries(HOME_PLACES)){
  if(!p.registered||p.world!==world)continue;
  const held=homes?.state?.properties?.[id];
  if((p.listedAt||[]).includes(at)&&(!held||p.purchase&&held.owner!=='player')){
   for(const method of p.purchase?['cash',...['loan','installments'].filter(m=>p.purchase[m])]:['cash']){
    const terms=p.purchase?.[method],price=terms?.deposit??p.purchase?.price??p.price;
    offer(`acquire:${id}:${method}`,`Take ${p.name} · ${price} ${homeMoneyWord(world)}${method==='cash'?'':` now, by ${method}`}`,{type:'acquire',home:id,method});
   }
  }
  if(held?.purchase?.balance>0&&(p.location===at||(p.listedAt||[]).includes(at))){
   const amount=Math.min(held.purchase.installment,held.purchase.balance);
   offer(`repay:${id}`,`Pay ${amount} ${homeMoneyWord(world)} towards ${p.name}`,{type:'repay_purchase',home:id,amount});
  }
 }
 return rows;
}
