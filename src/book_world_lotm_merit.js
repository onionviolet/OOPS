// Tingen Nighthawks merit (DWF154, DWF155, DWF162) on the shared institution store (institution_store.js). Merit is earned by assignments Warden Hale gives
// (real timed actions at the workroom) and spent at the church's evidence store, which holds recovered paper and common materials. Canon: churches pay merit and
// check it before a Sequence 8 handover; the figures, the two assignments and the stock are authored PROPOSALS (WPR5). Merit is a resource pair (earned and spent)
// on the player, so no new save slice exists; standing (faction_rank.js) is a different fact and is untouched.
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {eq,gte,all,af,no,item,know,cmd} from './book_world_lotm_kit.js';
import {defineInstitution,auditLedger,offerFor} from './institution_store.js';
import {INGREDIENT_BY_NAME} from './book_world_lotm_bench.js';

const KEY='book.lotm.merit.nighthawks';
export const meritRes={earned:`${KEY}.earned`,spent:`${KEY}.spent`,bought:rid=>`${KEY}.bought.${rid}`};
const counter=(key,amount)=>({type:'resource',actor:'player',key,amount});
const SUNFLOWER=INGREDIENT_BY_NAME['Crystal sunflower'];
const U='understood';
export const NIGHTHAWKS=defineInstitution({id:'nighthawks',world:'lotm',name:'Nighthawks (Evernight Church)',currency:{label:'Merit',unit:'merit'},
 evidence:['institutions pass F1, F2','canon: churches pay merit and check it before a Sequence 8 handover'],
 proposals:['Assignments, pay, prices and stock are authored; scale them per world.'],
 missions:[
  {id:'cold_room_watch',label:'Stand a night watch over the cold room for Warden Hale',pay:2,minutes:60,issuer:'Warden Hale',risk:'Sleepless hours; nothing you cannot walk away from, but the watch is not logged as done until the hour ends.',text:'You sat with the covered dead while the lamps burned low. Hale initialled the watch book.'},
  {id:'case_file_copy',label:'Copy a closed case file into the church records',pay:1,minutes:30,issuer:'Warden Hale',risk:'None beyond a cramped hand.',text:'You copied the file in a plain hand. Hale did not say what the case was.'}],
 store:[
  {id:'sun_8_sheet',label:'A recovered copy of the Sequence 8 Light Supplicant formula',kind:'formula',price:8,gate:{rule:no('bf.sun_8.formula'),text:'You already hold this formula copy.'},grants:{flag:'bf.sun_8.formula'},
   text:'A sheet from an evidence box, copied by a clerk. Like any copied sheet, the church does not vouch that it is right.'},
  {id:'sunflower_lot',label:'One lot of crystal sunflower from the evidence store',kind:'ingredient',price:3,stock:2,grants:{key:SUNFLOWER.key,slug:SUNFLOWER.slug},
   text:'Seized with a smuggler\'s cache and kept in the store. Two lots are on the shelf (an authored stock).'}]});
const home=eq('lotm.home.evernight');
export const meritCommands=[
 ...NIGHTHAWKS.missions.map(m=>cmd(`merit_${m.id}`,`${m.label} · ${m.minutes} min · earns ${m.pay} merit (a proposal)`,L.workroom,{targetId:I.supervisor,once:false,requires:home,visibleWhen:home,duration:m.minutes,cancellation:'forfeit',
  effects:[counter(meritRes.earned,m.pay),know(`merit.${m.id}`,`${m.text} Merit earned: ${m.pay}.`,'player','player','observation',U)]})),
 ...NIGHTHAWKS.store.map(r=>{
  const grant=r.kind==='formula'?[af(r.grants.flag)]:[item('player',r.grants.key,1)];
  const rules=[home,gte('lotm.merit.balance',r.price),...(r.stock!=null?[gte(`lotm.merit.left.${r.id}`,1)]:[]),...(r.gate?[r.gate.rule]:[])];
  return cmd(`merit_buy_${r.id}`,`Spend ${r.price} merit at the evidence store: ${r.label}`,L.workroom,{targetId:I.supervisor,once:false,requires:all(...rules),visibleWhen:home,
   effects:[...grant,counter(meritRes.spent,r.price),...(r.stock!=null?[counter(meritRes.bought(r.id),1)]:[]),know(`merit.buy.${r.id}`,`Hale signed the store book and released ${r.label.toLowerCase()} against ${r.price} merit.`,'player','player','observation',U)]});})];
export const meritFacts=(state,f)=>{
 const res=state.actors?.player?.resources||{},earned=res[meritRes.earned]||0,spent=res[meritRes.spent]||0;
 f['lotm.merit.earned']=earned;f['lotm.merit.spent']=spent;f['lotm.merit.balance']=Math.max(0,earned-spent);
 for(const r of NIGHTHAWKS.store)f[`lotm.merit.left.${r.id}`]=r.stock==null?0:Math.max(0,r.stock-(res[meritRes.bought(r.id)]||0));
};
// Player-facing projection: balance, missions with their stated risk, and every store row with its refusal reasons (from the same rules the commands use).
export const meritView=(state,f,prev)=>{
 const balance=f['lotm.merit.balance']||0;
 return {name:NIGHTHAWKS.name,currency:NIGHTHAWKS.currency,earned:f['lotm.merit.earned']||0,spent:f['lotm.merit.spent']||0,balance,
  missions:NIGHTHAWKS.missions.map(m=>({...m,action:prev(`book.lotm.merit_${m.id}`)})),
  store:NIGHTHAWKS.store.map(r=>({...offerFor(NIGHTHAWKS,r.id,{balance,bought:r.stock==null?0:r.stock-(f[`lotm.merit.left.${r.id}`]||0),facts:f}),action:prev(`book.lotm.merit_buy_${r.id}`)})),proposals:NIGHTHAWKS.proposals};
};
export function meritAssertions(state,{a,assert,natural}){
 const res=a.player.resources||{};
 assert(natural(res[meritRes.earned]||0)&&natural(res[meritRes.spent]||0),'Merit counters are whole numbers.');
 try{auditLedger({earned:res[meritRes.earned]||0,spent:res[meritRes.spent]||0},'Nighthawk merit');}catch(e){assert(false,e.message);}
 for(const r of NIGHTHAWKS.store)if(r.stock!=null)assert((res[meritRes.bought(r.id)]||0)<=r.stock,`Store stock of ${r.label} is outside its seed.`);
}
