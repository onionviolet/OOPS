// Tingen Nighthawks merit (DWF154, DWF155, DWF162) on the shared institution store (institution_store.js). Merit is earned by assignments Warden Hale gives
// (real timed actions at the workroom) and spent at the church's evidence store, which holds recovered paper and common materials. Canon: churches pay merit and
// check it before a Sequence 8 handover; the figures, the two assignments and the stock are authored PROPOSALS (WPR5). Merit is a resource pair (earned and spent)
// on the player, so no new save slice exists; standing (faction_rank.js) is a different fact and is untouched.
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {eq,gte,all,af,no,item,know,cmd} from './book_world_lotm_kit.js';
import {defineInstitution,auditLedger,offerFor} from './institution_store.js';
import {INGREDIENT_BY_NAME} from './book_world_lotm_bench.js';
import {gainEffects,spendCosts,spendEffects,spendRequires,learnedFact,levelFact,checkpointFact,checkpointsLost,poolView,masteryPoolFacts} from './mastery_pool.js';

const KEY='book.lotm.merit.nighthawks';
export const meritRes={earned:`${KEY}.earned`,spent:`${KEY}.spent`,bought:rid=>`${KEY}.bought.${rid}`};
const counter=(key,amount)=>({type:'resource',actor:'player',key,amount});
const SUNFLOWER=INGREDIENT_BY_NAME['Crystal sunflower'];
const U='understood';
export const NIGHTHAWKS=defineInstitution({id:'nighthawks',world:'lotm',name:'Nighthawks (Evernight Church)',currency:{label:'Merit',unit:'merit'},
 evidence:['institutions pass F1, F2','canon: churches pay merit and check it before a Sequence 8 handover'],
 proposals:['Assignments, pay, prices and stock are authored; scale them per world.'],
 missions:[
  {id:'cold_room_watch',label:'Stand a night watch over the cold room for Warden Hale',pay:2,minutes:60,issuer:'Warden Hale',risk:'Sleepless hours. You can walk away, but the watch only counts once the hour ends.',text:'You sat with the covered dead while the lamps burned low. Hale initialled the watch book.'},
  {id:'case_file_copy',label:'Copy a closed case file into the church records',pay:1,minutes:30,issuer:'Warden Hale',risk:'None beyond a cramped hand.',text:'You copied the file in a plain hand. Hale did not say what the case was.'},
  {id:'cited_file_copy',label:'Copy a case file that cites sealed references',pay:2,minutes:60,issuer:'Warden Hale',risk:'A slip in a citation sends the copy back.',text:'You copied every citation to the sealed shelf exactly as written and read nothing into it. Hale checked the references and initialled the copy.'}],
 store:[
  {id:'sun_8_sheet',label:'A recovered copy of the Sequence 8 Light Supplicant formula',kind:'formula',price:8,gate:{rule:no('bf.sun_8.formula'),text:'You already hold this formula copy.'},grants:{flag:'bf.sun_8.formula'},
   text:'A sheet from an evidence box, copied by a clerk. Like any copied sheet, the church does not vouch that it is right.'},
  {id:'sunflower_lot',label:'One lot of crystal sunflower from the evidence store',kind:'ingredient',price:3,stock:2,grants:{key:SUNFLOWER.key,slug:SUNFLOWER.slug},
   text:'Seized with a smuggler\'s cache and kept in the store. Two lots are on the shelf (an authored stock).'}]});
// Copying practice (mastery_pool.js, MEL-PROD-C05 shape). The copying hand is an ordinary practice power: the first copy learns it,
// every later copy refines it and feeds the Tingen pool. Two checkpoints change what the work is, not how much it pays:
// action mastery 20 opens files that cite sealed references; a pool at half its cap lets the copyist work at the lodging.
export const COPYING_HAND='book.lotm.power.copying_hand';
export const copyingPower=Object.freeze({id:COPYING_HAND,revision:1,label:'Copying hand',model:'practice',capacity:1,worlds:[I.world],cooldown:0,
 description:'A clerk\'s hand for the church records: steady letters, exact citations, nothing read into them. Grows with each copied file.'});
export const SPEND_STEP=4;
// Which assignments are copying practice, and the hand's mastery each one needs (institution rows keep only their own fields).
const PRACTICE=Object.freeze({case_file_copy:0,cited_file_copy:20});
const practiceOf=m=>m.id in PRACTICE?{practice:true,mastery:PRACTICE[m.id]}:{};
const home=all(eq('lotm.home.evernight'),eq('lotm.beyonderTrack'));
const W=I.world;
const practiceOutcomes=()=>[
 {id:'learn',weight:{fact:`${learnedFact(W,COPYING_HAND)}.n`,scale:-1,add:1},effects:[{type:'power',actor:'player',powerId:COPYING_HAND,operation:'learn'},
  know('merit.copying_hand','Hale showed you how the records want a file copied: the case number first, every citation kept as written. The next copy will come easier.','player','player','instruction',U)]},
 {id:'practice',weight:{fact:`${learnedFact(W,COPYING_HAND)}.n`},effects:gainEffects(W,COPYING_HAND)}];
const missionCommand=(row,{home:atHome=false}={})=>{
 const m={...row,...practiceOf(row)};
 const gate=all(home,...(m.mastery?[gte(levelFact(W,COPYING_HAND),m.mastery)]:[]),...(atHome?[eq(checkpointFact(W,'take_home'))]:[]));
 const pay=[counter(meritRes.earned,m.pay),know(`merit.${m.id}`,`${m.text} Merit earned: ${m.pay}.`,'player','player','observation',U)];
 const id=atHome?`merit_${m.id}_home`:`merit_${m.id}`,label=atHome?`At your lodging: ${m.label.charAt(0).toLowerCase()+m.label.slice(1)} · ${m.minutes} min · earns ${m.pay} merit`:`${m.label} · ${m.minutes} min · earns ${m.pay} merit`;
 const place=atHome?{alone:true}:{targetId:I.supervisor};
 return cmd(id,label,atHome?L.lodging:L.workroom,{...place,once:false,requires:gate,visibleWhen:gate,duration:m.minutes,cancellation:'forfeit',
  effects:pay,...(m.practice?{outcomes:practiceOutcomes()}:{})});
};
const spendCommand=cmd('merit_spend_copying',`Put ${SPEND_STEP} pooled desk practice into your copying hand`,null,{alone:true,once:false,
 requires:all(home,spendRequires(W,COPYING_HAND,SPEND_STEP)),visibleWhen:all(home,eq(learnedFact(W,COPYING_HAND))),
 costs:spendCosts(W,SPEND_STEP),effects:[...spendEffects(W,COPYING_HAND,SPEND_STEP),know('merit.copying_spent',`You worked ${SPEND_STEP} of your general desk practice into copying files. The hand is sharper; the desk is less settled.`,'player','player','observation',U)]});
// Merit is the probationer's ledger: civil staff are paid by contract and have no assignments or store (AT24).
export const meritCommands=[
 ...NIGHTHAWKS.missions.map(m=>missionCommand(m)),
 ...NIGHTHAWKS.missions.filter(m=>m.id in PRACTICE).map(m=>missionCommand(m,{home:true})),
 spendCommand,
 ...NIGHTHAWKS.store.map(r=>{
  const grant=r.kind==='formula'?[af(r.grants.flag)]:[item('player',r.grants.key,1)];
  const rules=[home,gte('lotm.merit.balance',r.price),...(r.stock!=null?[gte(`lotm.merit.left.${r.id}`,1)]:[]),...(r.gate?[r.gate.rule]:[])];
  return cmd(`merit_buy_${r.id}`,`Spend ${r.price} merit at the evidence store: ${r.label}`,L.workroom,{targetId:I.supervisor,once:false,requires:all(...rules),visibleWhen:home,
   effects:[...grant,counter(meritRes.spent,r.price),...(r.stock!=null?[counter(meritRes.bought(r.id),1)]:[]),know(`merit.buy.${r.id}`,`Hale signed the store book and released ${r.label.toLowerCase()} against ${r.price} merit.`,'player','player','observation',U)]});})];
export const meritFacts=(state,f)=>{
 const res=state.actors?.player?.resources||{},earned=res[meritRes.earned]||0,spent=res[meritRes.spent]||0;
 f['lotm.merit.earned']=earned;f['lotm.merit.spent']=spent;f['lotm.merit.balance']=Math.max(0,earned-spent);
 for(const r of NIGHTHAWKS.store)f[`lotm.merit.left.${r.id}`]=r.stock==null?0:Math.max(0,r.stock-(res[meritRes.bought(r.id)]||0));
 masteryPoolFacts(state,f,{worldId:W});
};
// Player-facing projection: balance, missions with their stated risk, and every store row with its refusal reasons (from the same rules the commands use).
export const meritView=(state,f,prev)=>{
 const balance=f['lotm.merit.balance']||0;
 const level=f[levelFact(W,COPYING_HAND)]||0,learned=!!f[learnedFact(W,COPYING_HAND)];
 const practice={learned,level,next:NIGHTHAWKS.missions.filter(m=>PRACTICE[m.id]>level).map(m=>({...m,mastery:PRACTICE[m.id]})).map(m=>({at:m.mastery,label:m.label})),pool:poolView(f,W),
  spend:{step:SPEND_STEP,loses:checkpointsLost(f,W,SPEND_STEP).map(c=>c.label),action:prev('book.lotm.merit_spend_copying')}};
 return {name:NIGHTHAWKS.name,currency:NIGHTHAWKS.currency,earned:f['lotm.merit.earned']||0,spent:f['lotm.merit.spent']||0,balance,practice,
  missions:[...NIGHTHAWKS.missions.map(m=>({...m,action:prev(`book.lotm.merit_${m.id}`)})),...NIGHTHAWKS.missions.filter(m=>m.id in PRACTICE).map(m=>({...m,issuer:'Yourself, with Hale\'s leave',action:prev(`book.lotm.merit_${m.id}_home`)}))].filter(m=>m.action?.visible!==false),
  store:NIGHTHAWKS.store.map(r=>({...offerFor(NIGHTHAWKS,r.id,{balance,bought:r.stock==null?0:r.stock-(f[`lotm.merit.left.${r.id}`]||0),facts:f}),action:prev(`book.lotm.merit_buy_${r.id}`)})),proposals:NIGHTHAWKS.proposals};
};
export function meritAssertions(state,{a,assert,natural}){
 const res=a.player.resources||{};
 assert(natural(res[meritRes.earned]||0)&&natural(res[meritRes.spent]||0),'Merit counters are whole numbers.');
 try{auditLedger({earned:res[meritRes.earned]||0,spent:res[meritRes.spent]||0},'Nighthawk merit');}catch(e){assert(false,e.message);}
 for(const r of NIGHTHAWKS.store)if(r.stock!=null)assert((res[meritRes.bought(r.id)]||0)<=r.stock,`Store stock of ${r.label} is outside its seed.`);
}
