// Brewing bench (DWF102, 2026-10-25): every brewable potion formula row of lotm_formula_rows.js, generated into commands over the shared
// process envelope (dose_process.js). Per row: buy the formula copy (knowledge, one purchase per row), start, collect, sell. Per ingredient: one buy
// command by sequence tier. All of it is data over one generator; the panel shows one selected formula at a time, never ~180 buttons (DWF128).
// Dose behaviour is not here: a brewed dose is holdable and sellable, and drinking it is honestly "not yet written" (DWF130). The Corpse Collector
// keeps its own shipped commands (book_world_lotm_brew.js) and is listed in the bench only as a pointer.
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,item,transfer,know,money,cmd,ready} from './book_world_lotm_kit.js';
import {processReady} from './dose_process.js';
import {LOTM_BREWABLE_ROWS,LOTM_INGREDIENTS,LOTM_TIERS,FORMULA_ROWS_REVISION,LOTM_FORMULA_ROWS} from './lotm_formula_rows.js';
export const BENCH_PREFIX='book.lotm.bf_';
export const STOCK_REV_KEY='book.lotm.stockRev';
const U='understood',BROKER_AT=all(eq('lotm.enrolled'),eq('lotm.brokerHere'));
const flag=(rid,n)=>`bf.${rid}.${n}`,res=(rid,n)=>`book.lotm.bf.${rid}.${n}`;
const ingredientsBought=LOTM_INGREDIENTS.filter(i=>i.tier!=='none');
export const INGREDIENT_BY_NAME=Object.fromEntries(LOTM_INGREDIENTS.map(i=>[i.name,i]));
const counter=(rid,n,amount=1)=>({type:'resource',actor:'player',key:res(rid,n),amount});
// A drunk dose leaves the ledger (held + sold + drunk = bottled); a generated pathway row's drink commands add this counter (DWF139).
export const drunkEffect=rid=>counter(rid,'drunk');
const trackOnly=eq('lotm.beyonderTrack');
export function benchRowCommands(row){
 const rid=row.id,slug=s=>INGREDIENT_BY_NAME[s.select.material].slug,P=row.product,F=flag(rid,'formula'),B=flag(rid,'brewing');
 const out=[];
 if(row.price)out.push(cmd(`bf_buy_${rid}`,`Buy a copy of the ${row.name} formula from the broker's desk · ${row.price.pence} pence (a scaled proposal; canon ${row.price.canon.pounds} pounds)`,L.docks,{alone:true,targetId:I.broker,
  visibleWhen:BROKER_AT,requires:all(eq('lotm.brokerHere'),no(F)),costs:[money(-row.price.pence)],
  effects:[af(F),know(`brew.${rid}.formula`,`The broker's desk sold you a copied sheet for the Sequence ${row.seq} ${row.name} formula: ${row.slots.map(s=>s.select.material.toLowerCase()).join(', ')}. The broker cannot vouch that a copied sheet is right.`,'player','player','instruction',U)]}));
 out.push(cmd(`bf_start_${rid}`,`Start brewing the ${row.name} potion at Hale's bench: consumes one lot of each listed material`,L.workroom,{targetId:I.supervisor,once:false,
  visibleWhen:all(ready,trackOnly,has(F),no(B)),
  requires:all(ready,trackOnly,has(F),no(B),eq('lotm.bf.busy',false),...row.slots.map(s=>gte(`lotm.bf.holds.${slug(s)}`,s.qty))),
  costs:row.slots.map(s=>item('player',s.key,-s.qty)),
  effects:[af(B),know(`brew.${rid}.started`,`The materials are in the pot and Hale has set the bench. It needs ${row.minutes} minutes before it can be bottled.`,'player','player','observation',U)]}));
 out.push(cmd(`bf_collect_${rid}`,`Bottle the brewed ${row.name} dose`,L.workroom,{targetId:I.supervisor,once:false,
  visibleWhen:all(ready,has(B)),requires:all(ready,has(B),eq(`lotm.bf.ready.${rid}`)),
  effects:[af(B,false),item('player',P.key,1),counter(rid,'made'),know(`brew.${rid}.collected`,`The pot settled and you bottled one ${P.name}. Holding it grants nothing; drinking it is a separate, irreversible step where the pathway has one written.`,'player','player','observation',U)]}));
 if(P.sellPence)out.push(cmd(`bf_sell_${rid}`,`Sell the ${P.name} to the broker · ${P.sellPence} pence (a proposal)`,L.docks,{alone:true,targetId:I.broker,once:false,
  visibleWhen:BROKER_AT,requires:all(eq('lotm.brokerHere'),gte(`lotm.bf.holds.dose_${rid}`,1)),costs:[item('player',P.key,-1)],
  effects:[money(P.sellPence),counter(rid,'sold'),know(`brew.${rid}.sold`,`The broker paid ${P.sellPence} pence for the ${P.name} and will find a buyer who asks no questions.`,'player','player','observation',U)]}));
 return out;
}
export function benchIngredientCommand(i){
 const tierWord=i.tier==='supplier'?'at the supplier\'s counter':'by special order through the broker (premium)';
 return cmd(`bf_ing_${i.slug}`,`Buy ${i.name.toLowerCase()} ${tierWord} · ${i.pence} pence`,L.docks,{alone:true,targetId:I.broker,once:false,
  visibleWhen:BROKER_AT,requires:all(eq('lotm.brokerHere'),gte(`lotm.bf.stock.${i.slug}`,1)),costs:[money(-i.pence),transfer(I.broker,'player',i.key)],
  effects:[know(`brew.ing.${i.slug}`,`${i.name}: bought ${tierWord}. ${LOTM_TIERS[i.tier].reason}`,'player','player','observation',U)]});
}
export const benchCommands=[...LOTM_BREWABLE_ROWS.flatMap(benchRowCommands),...ingredientsBought.map(benchIngredientCommand)];
export const benchFlags=LOTM_BREWABLE_ROWS.flatMap(r=>[flag(r.id,'formula'),flag(r.id,'brewing')]);
// Opening stock for new enrollments, keyed by the same revision as the lazy seed so a save never gets it twice.
export const BENCH_STOCK=Object.freeze(Object.fromEntries(ingredientsBought.map(i=>[i.key,i.stock])));
const countOf=(gameplay,owner,key)=>gameplay?.[owner]?.inventory?.[key]||0;
export const stockSeeded=state=>(state.actors?.[I.broker]?.resources?.[STOCK_REV_KEY]||0)>=FORMULA_ROWS_REVISION;
// Lazy seeding (DWF127): mutates a plan ({state,gameplay}) once per row revision. Saves enrolled before the bench get their stock on first need.
export function seedBenchStock(plan){
 if(!plan.state.lotm||!plan.state.actors?.[I.broker]||stockSeeded(plan.state))return false;
 const inv=(plan.gameplay[I.broker]||={inventory:{},skills:{},reputation:{}}).inventory||={};
 for(const [key,n] of Object.entries(BENCH_STOCK))inv[key]=(inv[key]||0)+n;
 plan.state.actors[I.broker].resources[STOCK_REV_KEY]=FORMULA_ROWS_REVISION;
 return true;
}
export function benchFacts(state,f,{inv,brokerInv}){
 const seeded=stockSeeded(state),flagOn=n=>state.actors?.player?.facts?.[`book.lotm.${n}`]===true;
 for(const i of LOTM_INGREDIENTS){f[`lotm.bf.holds.${i.slug}`]=inv[i.key]||0;f[`lotm.bf.stock.${i.slug}`]=i.tier==='none'?0:seeded?brokerInv[i.key]||0:i.stock;}
 let busy=false;
 for(const r of LOTM_BREWABLE_ROWS){
  const note=state.simulation?.knowledge?.player?.[`book.lotm.brew.${r.id}.started`],on=flagOn(flag(r.id,'brewing'));busy=busy||on;
  f[`lotm.bf.ready.${r.id}`]=on&&!!note&&processReady({startedAt:note.at,now:state.clock,minutes:r.minutes});
  f[`lotm.bf.holds.dose_${r.id}`]=inv[r.product.key]||0;
 }
 f['lotm.bf.busy']=busy;
}
// State assertions (validateLotmState): a brew in progress needs its formula copy and its start note; counters are natural and sold never passes made.
export function benchAssertions(state,{a,has,assert,natural}){
 const known=state.simulation?.knowledge?.player||{};
 for(const r of LOTM_BREWABLE_ROWS){
  assert(!has(flag(r.id,'brewing'))||has(flag(r.id,'formula'))&&!!known[`book.lotm.brew.${r.id}.started`],`A ${r.name} brew needs its formula copy and its start note.`);
  const made=a.player.resources?.[res(r.id,'made')],sold=a.player.resources?.[res(r.id,'sold')];
  const drunk=a.player.resources?.[res(r.id,'drunk')];
  assert((made===undefined||natural(made))&&(sold===undefined||natural(sold))&&(drunk===undefined||natural(drunk))&&(sold||0)+(drunk||0)<=(made||0),`${r.name} bottled, sold and drunk counts must balance.`);
 }
}
// Envelope assertions (validateLotmEnvelope): held doses plus sold doses equal bottled doses; broker stock never exceeds its seed and is empty before the seed.
export function benchEnvelope(save,{count,assert,reserved}){
 const state=save.expansion,pr=state.actors?.player?.resources||{};
 for(const r of LOTM_BREWABLE_ROWS){
  const held=count(save,'main_character',r.product.key)+reserved(state,r.product.key);
  assert(held+(pr[res(r.id,'sold')]||0)+(pr[res(r.id,'drunk')]||0)===(pr[res(r.id,'made')]||0),`${r.name} doses held, sold and drunk must equal doses bottled.`);
 }
 const seeded=stockSeeded(state);
 for(const i of ingredientsBought){const n=count(save,I.broker,i.key);assert(seeded?n<=i.stock:n===0,`Broker stock of ${i.name} is outside its seed.`);}
}
// Player-facing projection of one formula (no preview here; the host adds eligibility). Truth stays out: only what the notes and the player's holdings show.
export function benchRowSummary(state,f,row){
 const known=state.actors?.player?.facts?.[`book.lotm.${flag(row.id,'formula')}`]===true,on=state.actors?.player?.facts?.[`book.lotm.${flag(row.id,'brewing')}`]===true;
 const note=state.simulation?.knowledge?.player?.[`book.lotm.brew.${row.id}.started`];
 return {id:row.id,pathway:row.pathway,seq:row.seq,name:row.name,status:row.id==='death_9'?'brewable':row.status,viaMain:row.id==='death_9',formulaKnown:known,brewing:on,ready:!!f[`lotm.bf.ready.${row.id}`],
  left:on&&note?Math.max(0,note.at+row.minutes-state.clock):0,doses:f[`lotm.bf.holds.dose_${row.id}`]||0};
}
export const benchRowList=(state,f)=>LOTM_FORMULA_ROWS.map(r=>benchRowSummary(state,f,r));
