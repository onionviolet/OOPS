// Klein's Sequence 7 (Magician) on the Seer ladder (LG9, LANE_D_WORLD_GAPS 2.6): the playable crossing the advancement seam (lotm_advancement.js,
// setAdvancement in book_world_lotm_path.js) only displayed. The formula row (fool_7: brewable, no rite) and the ability cards come from existing owners;
// this module adds what play lacked: Clown-role acts counted on their own resource, the no-rite drink, the held-dose fact and the source.
// Gate (same shape as the Sequence 8 gate, minus the examination because the notes record none): the Seer line promoted to Clown, six acts in the
// Clown role, and a brewed Magician dose. Digesting the Clown potion before taking the next is the canon digestion law (stated, the notes' Magician
// digestion row); the acts below are authored proposals (WPR5): the notes record no Clown acting principle (gap). Everything is inert until the private
// advancement pack is loaded (setSeq7Loaded, called by setAdvancement), so with no pack play is exactly as the Sequence 8 slice ends it.
// Leaf module: imports only ids, kit and bench, so generated.js and path.js can depend on it without a cycle. Ability names and effects stay in the pack.
import {LOTM_KEYS as K,LOTM_DIGEST_ACTS,LOTM_IDS as I} from './book_world_lotm_ids.js';
import {eq,gte,all,not,af,has,no,item,know,cmd} from './book_world_lotm_kit.js';
import {drunkEffect} from './book_world_lotm_bench.js';
export const SEQ7_SOURCE='book.lotm.adv.magician'; // lotm_advancement.js rewrites the pack's book.lotm.* source ids under book.lotm.adv.*
export const SEQ7_FORMULA='fool_7';
export const SEQ7_ACTING='book.lotm.clown.acting';
const U='understood';
let loaded=false;
export const setSeq7Loaded=v=>{loaded=!!v;};
export const seq7Loaded=()=>loaded;
const acted={type:'resource',actor:'player',key:SEQ7_ACTING,amount:1};
const undigested=not(gte('lotm.clown.acting',LOTM_DIGEST_ACTS));
const base=all(eq('lotm.seq7.available'),eq('lotm.clownSupported'),has('promoted'),no('seq7.promoted'));
const act=(id,minutes,label,key,text)=>cmd(id,label,null,{alone:true,once:false,visibleWhen:all(eq('lotm.enrolled'),eq('lotm.seq7.available'),has('promoted'),no('seq7.promoted'),undigested),
 requires:all(base,undigested),duration:minutes,cancellation:'forfeit',effects:[acted,know(key,text,'player','player','observation',U)]});
export const seq7Commands=[
 act('act_clown_turn',20,'Play the fool for the dockhands: a tumble, a borrowed hat and a joke at your own expense · 20 min','clown.acting.turn',
  'You played the fool on the quay and the carters laughed, you with them. Taking the laugh on yourself, as a clown does, settles the role in you a little more each time.'),
 act('act_clown_mimic',20,'Borrow a stranger\'s walk and expression for a street corner, then drop it with a bow · 20 min','clown.acting.mimic',
  'You wore a stranger\'s manner for a few minutes and put it down again on purpose. Holding a face and letting it go at will counted toward the role.'),
 cmd('drink_magician','Drink the brewed Magician dose (irreversible: Sequence 7, no rite)',null,{alone:true,
  visibleWhen:all(eq('lotm.enrolled'),eq('lotm.seq7.available'),has('promoted'),no('seq7.promoted'),gte('lotm.holds.magicianDose',1)),
  requires:all(base,eq('lotm.clown.digested'),gte('lotm.holds.magicianDose',1)),costs:[item('player',K.magicianDose,-1)],
  effects:[{type:'source',actor:'player',sourceId:SEQ7_SOURCE,operation:'grant',origin:'acquired',awakened:true,active:true},af('seq7.promoted'),drunkEffect(SEQ7_FORMULA),
   know('seq7.promoted','The Magician potion is gone for good. The Clown potion had settled, so it took without a fight. Your hands feel lighter and the next trick you imagine seems nearer to hand than it should. This Sequence needs digesting in turn, by its own role.','player','player','observation',U)]})];
// Dose key for the bench host: fool_7's drink option (the host previews these instead of the "not yet written" marker).
export const SEQ7_DRINK_IDS=Object.freeze({[SEQ7_FORMULA]:['book.lotm.drink_magician']});
export const seq7Flags=Object.freeze(['seq7.promoted']);
export const seq7Sources=Object.freeze([{id:SEQ7_SOURCE,revision:1,label:'Magician source (Sequence 7)',kind:'trait',origin:'acquired',grants:[],
 bioDetail:'A consumed brewed dose taken after the Clown potion had settled. Its abilities come from the ladder records, not from this source alone.'}]);
export function seq7Facts(state,f,{inv,flag}){
 const s=state.simulation||{},a=state.actors?.player,src=a?.sources?.[I.clown],fac=s.faculties?.player?.[I.clown];
 const n=a?.resources?.[SEQ7_ACTING]||0;
 f['lotm.seq7.available']=loaded;
 f['lotm.clownSupported']=!!f['lotm.enrolled']&&!!src&&(src.expiresAt==null||src.expiresAt>state.clock)&&fac?.awakened===true&&fac.active===true&&!fac.suppressed;
 f['lotm.clown.acting']=n;f['lotm.clown.digested']=n>=LOTM_DIGEST_ACTS;f['lotm.holds.magicianDose']=inv[K.magicianDose]||0;
}
export function seq7Assertions({a,has,assert,natural}){
 const n=a.player.resources?.[SEQ7_ACTING],src=a.player.sources?.[SEQ7_SOURCE],clown=a.player.sources?.[I.clown];
 assert(n===undefined||natural(n)&&n<=LOTM_DIGEST_ACTS&&has('promoted')&&!!clown,'Acting in the Clown role needs the Clown source and stays within the digestion count.');
 assert(!!src===has('seq7.promoted'),'The Magician source exists exactly when the promotion is recorded.');
 assert(!has('seq7.promoted')||has('promoted')&&n===LOTM_DIGEST_ACTS,'A Magician promotion needs the Clown promotion and a digested Clown potion.');
}
