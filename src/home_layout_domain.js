import {householdFieldPower} from './home_cultivation_content.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {LAYOUT_FAMILY,emptyLayouts,freshLayout,GRIDS,PLACEABLE,planMove,bedDelta,cellReadout,validateLayouts,migrateLayouts,dialsFor,activeSlots} from './home_layout.js';
import {createHomeLayoutPanel} from './home_layout_panel.js';
// Live path for the spatial home layer (G22). The layout slice only says where fixtures stand; the
// fixtures themselves, the coins and the clock stay with the homes domain, so a move is one homes
// transaction (`layout_fee`) followed by the slice update. No slice means no layout and no change.
let state=null,panel=null;
export const layoutState=()=>state;
const homes=()=>domainRegistry.project('homes')||{};
const manorOf=()=>homes().homes?.find(h=>h.id==='manor');
const worldOf=()=>homes().context?.world;
// The term the household reads for a home's bed. 0 when there is no layout, dial, bed or home.
export function layoutBedDelta(home,world,fixtures){
 const l=state?.homes?.[home];return l?bedDelta(l,fixtures,home,world):0;
}
export function layoutQiAtBed(home,world,fixtures,powered=false){const l=state?.homes?.[home];if(!l?.at.bed||!powered)return 0;const f=cellReadout(l,fixtures,home,world,powered),[x,y]=l.at.bed;return f?.[y]?.[x]?.qi||0;}
export function adoptLayout({home='manor'}={}){
 const h=homes().homes?.find(x=>x.id===home);
 if(!h||!GRIDS[home])throw Error('No such home to lay out.');
 if(!dialsFor(worldOf()))throw Error('This world has no spatial layer for homes.');
 if(state?.homes?.[home])return state.homes[home];
 state={...(state||emptyLayouts()),homes:{...(state?.homes||{}),[home]:freshLayout(home)}};
 panel?.render();return state.homes[home];
}
export function quoteMove({home='manor',slot,x,y}){
 const h=homes().homes?.find(v=>v.id===home);
 if(!h)return {eligible:false,reason:'You have no such home.'};
 const m=planMove(state?.homes?.[home],h.fixtures,home,worldOf(),{slot,x,y});
 if(!m.eligible)return m;
 const pay=domainRegistry.command('homes','quote')({type:'layout_fee',home,fee:m.fee,text:`You move the ${PLACEABLE[slot].toLowerCase()} in ${h.name}.`});
 if(!pay.eligible)return {eligible:false,reason:pay.reason};
 return {...m,home,pay};
}
export function executeMove(quote){
 if(!quote?.eligible)throw Error(quote?.reason||'Review the move first.');
 const fresh=quoteMove({home:quote.home,slot:quote.slot,x:quote.x,y:quote.y});
 if(!fresh.eligible)throw Error(fresh.reason);
 const result=domainRegistry.command('homes','execute')(fresh.pay);
 state={...state,homes:{...state.homes,[fresh.home]:fresh.next}};
 panel?.render();return {...fresh,message:result.message};
}
export function projectLayout(){
 const h=homes(),manor=h.homes?.find(x=>x.id==='manor'),world=h.context?.world;
 if(!manor||!GRIDS.manor||!dialsFor(world))return {visible:false};
 const l=state?.homes?.manor||null,slots=Object.keys(PLACEABLE).filter(s=>manor.fixtures?.[s]);
 const field=l?cellReadout(l,manor.fixtures,'manor',world,householdFieldPower(h.context)):null;
 const cells=[];
 for(let y=0;y<GRIDS.manor.h;y++)for(let x=0;x<GRIDS.manor.w;x++){
  const slot=l&&activeSlots(l,manor.fixtures).find(s=>l.at[s][0]===x&&l.at[s][1]===y)||null;
  cells.push({x,y,slot,label:slot?PLACEABLE[slot]:'',...(field?.[y][x]||{})});
 }
 return {visible:true,adopted:!!l,w:GRIDS.manor.w,h:GRIDS.manor.h,slots:slots.map(s=>({id:s,label:PLACEABLE[s]})),cells,
  bedDelta:l?bedDelta(l,manor.fixtures,'manor',world):0,moves:l?.moves||0,fee:dialsFor(world).moveFee.value};
}
registerDomain({id:'home_layout',deps:['homes'],initialState:()=>null,
 save:()=>state&&Object.keys(state.homes).length?state:undefined,
 migrate:slice=>migrateLayouts(slice),
 validate:slice=>validateLayouts(slice),
 load:slice=>{state=slice?structuredClone(slice):null;},
 commands:{qiAtBed:({home,world,fixtures})=>layoutQiAtBed(home,world,fixtures,householdFieldPower(homes().context||{})),adopt:adoptLayout,quote:quoteMove,execute:executeMove},refresh:()=>panel?.render(),projection:projectLayout,
 panels:[()=>{panel=createHomeLayoutPanel({read:projectLayout,adopt:adoptLayout,quote:quoteMove,execute:executeMove});}]});
export {LAYOUT_FAMILY};
