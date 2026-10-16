import {reachBand} from './village_obtainability.js';
// Known-source projection only. No draw, unlock, latent person fact or sealed ID.
export function travelerSourceHint(goal,index,context={}) {
 const row=index?.[goal.item];if(!row)return {band:goal.band??'unknown',line:goal.clue??''};
 const band=reachBand(row,{quantity:goal.quantity??1,money:context.money??0});
 const known=row.routes.filter(r=>r.known);
 const source=known.find(r=>r.kind==='inventory'&&r.count>=(goal.quantity??1))||known.find(r=>r.kind==='trader')||known.find(r=>r.kind==='gather')||known.find(r=>r.kind==='recipe')||known.find(r=>r.kind==='drop');
 if(!source)return {band,line:goal.clue??'You have not learned a source for this supply yet.'};
 let line;
 if(source.kind==='inventory')line='Known source: your supplies.';
 else if(source.kind==='trader')line=`Known source: the Village market (${source.price} coins each before discounts${source.chance<1?'; stock varies':''}).`;
 else if(source.kind==='gather')line=`Known source: ${source.source.split(':').slice(1).join(':')} in Village${source.tool?`; needs a ${source.tool.replaceAll('_',' ')}`:''}.`;
 else if(source.kind==='recipe')line=`Known source: the ${source.source.split(':')[1]} bench in Village. Check the recipe's materials.`;
 else line=`Known source: ${source.source}, which you have encountered. Drops are not guaranteed.`;
 return {band,line};
}
