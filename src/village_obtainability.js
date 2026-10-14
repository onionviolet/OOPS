// Pure route analysis. Adapters supply the live tables; no DOM, RNG or save writes.
export const REACH_BANDS=Object.freeze(['ready','stretch','unknown']);
const stages=['inventory','village_market','village_gather','field_hunt','village_craft'];
export function openingBuyPrice(value,margin) {
 const n=value*margin,step=n>19999?1000:n>1999?100:n>199?10:1;
 return Math.ceil(n/step)*step;
}
export function buildVillageObtainability({items={},stock=[],margin=4,inventory={},gathers=[],drops=[],recipes=[]}={}) {
 const index={};
 const add=(item,route)=>{if(!items[item])return;const row=index[item]||={item,routes:[],earliestStage:null,effortMinutes:null};row.routes.push(route);};
 for(const [item,count] of Object.entries(inventory))if(count>0)add(item,{kind:'inventory',source:'your supplies',stage:'inventory',minutes:0,count,known:true,available:true});
 for(const r of stock)if(r.chance>0&&r.count[0]>0&&!r.quality)add(r.item,{kind:'trader',source:'village trader',stage:'village_market',minutes:5,price:openingBuyPrice(items[r.item]?.value||0,margin),chance:r.chance,count:r.count[0],known:r.known===true,available:r.available!==false});
 for(const g of gathers)for(const r of g.resources||[])if(r.chance[0]>0)add(r.item,{kind:'gather',source:g.source,stage:'village_gather',minutes:g.period/r.chance[0]/(r.count||1),chance:r.chance[0],known:g.known===true,available:g.available===true,tool:g.tool||null,season:g.season||null});
 for(const d of drops)if(d.chance>0)add(d.item,{kind:'drop',source:d.source,stage:'field_hunt',minutes:(d.killMinutes||3)/d.chance,rate:d.chance,known:d.known===true,available:d.available===true});
 // Bounded fixed point: recipes need reachable exact ingredients. Type ingredients
 // expand from actual item material types; unsupported/dynamic recipes add no route.
 summarize(index);
 for(let pass=0;pass<recipes.length;pass++) {
  let changed=false;
  for(const r of recipes) {
   if(!r.unlocked||!r.materials?.length||r.chance<=0||index[r.item]?.routes.some(x=>x.kind==='recipe'&&x.source===r.source))continue;
   const ingredients=r.materials.map(m=>{const options=m.item?[index[m.item]]:Object.values(index).filter(x=>items[x.item]?.materialType===m.type);const best=options.filter(Boolean).sort((a,b)=>a.effortMinutes-b.effortMinutes)[0];return best?{row:best,count:m.count}:null;});
   if(ingredients.some(x=>!x))continue;
   const minutes=(1+ingredients.reduce((n,x)=>n+Math.min(...(x.row.routes.some(t=>t.kind!=='inventory')?x.row.routes.filter(t=>t.kind!=='inventory'):x.row.routes).map(t=>t.minutes))*x.count,0))/r.chance/(r.count||1);
   add(r.item,{kind:'recipe',source:r.source,stage:'village_craft',minutes,known:r.known===true,available:r.available===true&&ingredients.every(x=>x.row.routes.some(t=>t.known&&t.available))});changed=true;
  }
  summarize(index);if(!changed)break;
 }
 return summarize(index);
}
function summarize(index) {
 for(const row of Object.values(index)) {row.earliestStage=[...row.routes].sort((a,b)=>stages.indexOf(a.stage)-stages.indexOf(b.stage))[0]?.stage;row.effortMinutes=Math.ceil(Math.min(...row.routes.map(r=>r.minutes)));}
 return index;
}
export function reachBand(row,{quantity=1,money=0}={}) {
 if(!row?.routes.length)return null;
 const known=row.routes.filter(r=>r.known);
 if(!known.length)return 'unknown';
 return known.some(r=>r.available&&(r.kind==='inventory'?r.count>=quantity:r.kind==='trader'?r.count>=quantity&&r.chance===1&&r.price*quantity<=money:true))?'ready':'stretch';
}
// The same normal form used by the SOURCE reader, built here from native owners.
export function villageTablesFromNative({items,trader,stock,inventory,activities,enemies,recipes,craftingKnown=false,gatheringKnown=false,tools={},season}) {
 const unlocked=o=>o?.getAvailabilityComponent?.().getStatus?.().is_unlocked===true;
 const knownTrader=unlocked(trader);
 return {items:Object.fromEntries(Object.entries(items).map(([id,i])=>[id,{value:i.getBaseValue(),materialType:i.material_type}])),margin:trader.profit_margin,
  inventory:Object.fromEntries(Object.entries(inventory).map(([key,r])=>{try{return [JSON.parse(key).id,r.count];}catch{return ['',0];}})),
  stock:stock.flatMap(g=>g.items.map(i=>({item:i.item_name,count:i.count,chance:i.chance,quality:i.quality,known:knownTrader,available:knownTrader}))),
  gathers:Object.entries(activities).filter(([,a])=>a.gained_resources).map(([id,a])=>({source:`Village:${id}`,resources:a.gained_resources.resources.map(r=>({item:r.name,chance:r.chance,count:r.ammount?.[0]?.[0]||1})),period:a.gained_resources.time_period[0],tool:a.require_tool?id==='woodcutting'?'axe':id==='fishing'?'fishing_rod':'shovel':null,season:a.availability_seasons||null,known:gatheringKnown&&unlocked(a),available:gatheringKnown&&unlocked(a)&&(!a.require_tool||!!tools[id])&&(!a.availability_seasons||a.availability_seasons.includes(season))})),
  drops:Object.entries(enemies).flatMap(([id,e])=>(e.loot_list||[]).map(d=>({item:d.item_name,chance:d.chance,source:id,known:(e.knownKills||0)>0,available:(e.knownKills||0)>0}))),
  recipes:Object.entries(recipes).flatMap(([category,rows])=>Object.entries(rows.items||{}).filter(([,r])=>r.result?.result_id).map(([id,r])=>({item:r.result.result_id,count:r.result.count,source:`Village:${category}:${id}`,unlocked:unlocked(r),known:craftingKnown&&unlocked(r),available:craftingKnown&&unlocked(r),chance:r.success_chance?.[0]||1,materials:r.materials.map(m=>({item:m.material_id,type:m.material_type,count:m.count}))}))) };
}
