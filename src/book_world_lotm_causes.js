// Loss of control as stated causes (B3, 2026-10-23). The source names five causes: skipping Sequences, a wrong-pathway potion, switching
// pathways, residue from rushing, and temptation through heightened senses; pre-signs are reversible, full loss is not
// [LOTM_RULES L7: 0018, 0033, 0165-0167]. Each cause here is a row with its own pressure. A pathway added as data inherits the rows through
// the generic dose commands below, so the Seer's failure rules cannot be bypassed by adding a pathway. A cause is a consequence, not a wall:
// the stated acts are possible (through a broker's unmarked dose) and cost pressure; at the loss line the branch is over. Amounts and the
// two lines are authored proposals (WPR5). Temptation has no heightened-sense mechanic in this slice and stays an unmodelled row.
import {LOTM_IDS as I,LOTM_KEYS as K} from './book_world_lotm_ids.js';
import {eq,gte,all,not,af,has,no,item,attention,know,cmd} from './book_world_lotm_kit.js';
import {LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
export const LOTM_PRESSURE=Object.freeze({presign:2,loss:6});
export const LOTM_CAUSES=Object.freeze([
 {id:'skip',label:'Skipping a Sequence step',pressure:3,modelled:true,source:'[0018] Dunn: skipping Sequences',text:'You drank a heavier potion without the digestion and assessment the church requires.'},
 {id:'wrong_pathway',label:'A wrong-pathway potion',pressure:3,modelled:true,source:'[0033] [0165-0167]: a potion of another pathway',text:'You drank a potion that does not belong to your pathway.'},
 {id:'switching',label:'Switching pathways',pressure:3,modelled:true,source:'[0018]: switching pathways',text:'You took a second pathway\'s potion after a first; one pathway per life.'},
 {id:'rushed',label:'Residue from rushing',pressure:2,modelled:true,source:'[0018] [0106]: residue from a hurried promotion',text:'The potion before it was not settled when you took the next, and the residue stays.'},
 {id:'temptation',label:'Temptation through heightened senses',pressure:2,modelled:false,source:'[0018]: temptation',text:'No heightened-sense mechanic exists in this slice, so this cause is recorded and not applied.'}]);
// The primary lane's cause table (LOTM_LOSS_CAUSES) and record flags (loc.<id>) are kept as aliases of these rows. `defaultBlock` is that lane's dial: the
// legitimate commands refuse the step by default. Here the dial is also open on one route (a broker's unmarked dose, below), where the step costs pressure
// instead; temptation has no route. A save may carry either flag family; both mean the same cause.
export const LOTM_CAUSE_ALIASES=Object.freeze({switching:'switching',skippingSequence:'skip',wrongPotion:'wrong_pathway',rushedResidue:'rushed',temptation:'temptation'});
export const LOTM_LOSS_CAUSES=Object.freeze(Object.entries(LOTM_CAUSE_ALIASES).map(([alias,id])=>{const c=LOTM_CAUSES.find(x=>x.id===id);return Object.freeze({id:alias,label:c.label,defaultBlock:c.modelled,reason:c.text,enforcedBy:c.modelled?'legitimate commands refuse it; the broker route applies its pressure':'not modelled in this slice'});}));
export const LOTM_LOC_FLAGS=Object.freeze(Object.keys(LOTM_CAUSE_ALIASES).map(a=>`loc.${a}`));
export const causeHeld=(has,id)=>has(`cause.${id}`)||has(`loc.${Object.entries(LOTM_CAUSE_ALIASES).find(([,v])=>v===id)[0]}`);
const cause=(...ids)=>ids.map(id=>LOTM_CAUSES.find(c=>c.id===id));
const total=cs=>cs.reduce((n,c)=>n+c.pressure,0);
const press=amount=>({type:'resource',actor:'player',key:'book.lotm.pressure',amount});
const notes=(cs)=>cs.map(c=>c.text).join(' ');
// Generic over a pathway row: the unmarked base dose drunk by someone already on another pathway (wrong pathway and switching),
// and the unmarked next dose drunk before the potion is digested and assessed (skipping, rushing).
export function causeCommands(row){
 const f=n=>row.prefix?`${row.prefix}.${n}`:n,grant=id=>({type:'source',actor:'player',sourceId:id,operation:'grant',origin:'acquired',awakened:true,active:true}),mk=row.market;
 if(!mk)return [];
 const foreign=cause('wrong_pathway','switching'),rush=cause('skip','rushed');
 return [
  cmd(`drink_market_${row.key}9`,`Drink the unmarked ${row.potion} dose you bought (nobody issued it to you)`,L.docks,{alone:true,once:true,requires:all(eq('lotm.ingestedAny'),no(f('ingested')),gte(`lotm.holds.${mk.baseHold}`,1)),
   costs:[item('player',K[mk.baseHold],-1)],effects:[grant(row.base),af(f('allocated')),af(f('ingested')),af(f('stabilized')),...foreign.map(c=>af(`cause.${c.id}`)),press(total(foreign)),
    know(`cause.foreign.${row.key}`,`${notes(foreign)} The potion took. Whispers pressed in at once and did not ease: this is how a wrong potion on top of another pathway ends.`,'player','player','observation','understood')]}),
  cmd(`drink_market_${row.key}8`,`Drink the unmarked ${row.next} dose you bought before your digestion is assessed`,L.docks,{alone:true,once:true,requires:all(has(f('ingested')),no(f('assessed')),gte(`lotm.holds.${mk.nextHold}`,1)),
   costs:[item('player',K[mk.nextHold],-1)],effects:[grant(row.nextSource),af(f('promoted')),...rush.map(c=>af(`cause.${c.id}`)),press(total(rush)),
    know(`cause.rush.${row.key}`,`${notes(rush)} Your body is stronger, and the pre-signs began at once: a hum behind the eyes that does not stop.`,'player','player','observation','understood')]})];
}
export const causeFlags=[...LOTM_CAUSES.map(c=>`cause.${c.id}`),...LOTM_LOC_FLAGS];
// Steadying is the reversible half: guided attention under the supervisor lowers pressure while it is still below the loss line.
export const causeSteadyCommand=cmd('steady','Ask Hale for guided attention to steady the pre-signs · 1 of Hale\'s attention',L.workroom,{targetId:I.supervisor,once:false,
 requires:all(gte('lotm.pressure',1),not(gte('lotm.pressure',LOTM_PRESSURE.loss)),gte('lotm.supervisorAttention',1)),costs:[attention()],effects:[press(-1),know('cause.steadied','Hale held your attention on a familiar object until the hum eased a little. It is only the pre-signs; past the line there is no easing them.','player','player','observation','understood')]});
// Completed recoveries that may bring recorded pressure to zero: the steadying above and the self-addressed rite (ritual.js, M4 A5).
export const LOTM_RECOVERY_COMMANDS=Object.freeze(['book.lotm.steady','book.lotm.rit_self_light','book.lotm.rit_self_light_body']);
export function causeFacts(state,f){
 const n=state.actors?.player?.resources?.['book.lotm.pressure']||0;
 f['lotm.pressure']=n;f['lotm.presign']=n>=LOTM_PRESSURE.presign;f['lotm.lostControl']=n>=LOTM_PRESSURE.loss;
}
export function causeAssertions({a,has,assert,natural}){
 const n=a.player.resources?.['book.lotm.pressure'];
 const causes=LOTM_CAUSES.filter(c=>causeHeld(has,c.id));
 assert(n===undefined||natural(n),'Pressure is a natural number.');
 assert((n||0)<=total(causes)+LOTM_PRESSURE.loss,'Pressure cannot exceed what the recorded causes add.');
 // Zero is reachable only through a completed recovery; the causes stay recorded as history either way.
 const recovered=LOTM_RECOVERY_COMMANDS.some(id=>(a.player.completed?.[id]||0)>0);
 assert(causes.length===0||(n||0)>0||has('declined')||recovered,'A recorded cause leaves pressure behind.');
}
export const causeView=f=>({pressure:f['lotm.pressure'],presign:f['lotm.presign'],lost:f['lotm.lostControl'],loss:LOTM_PRESSURE.loss,
 line:f['lotm.lostControl']?'You have lost control. The branch is over: nothing you do here changes it.':f['lotm.presign']?`Pre-signs: a hum behind the eyes and whispers at the edge of hearing (${f['lotm.pressure']} of ${LOTM_PRESSURE.loss}). Guided attention can ease them; past the line nothing can.`:f['lotm.pressure']?`A faint residue (${f['lotm.pressure']} of ${LOTM_PRESSURE.loss}).`:''});
