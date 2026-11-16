// Klein's own life (Be Klein): digesting the Seer potion by acting (LTS11-LTS14, OR1 consumer). PROPOSAL (AD5, AD56):
// canon-close and adjustable; every count and dial below is authored, not a canon rate.
// - An act is a reading given to someone else in the Seer's role. Two producers, read here, no new save slice:
//   1. a completed interpret step on one of the for-others reading rows writes the actor fact
//      `book.lotm.be.acting.<row>` (the adapter's interpretEffects hook, src/cast_divination_adapter.js);
//   2. a paid club client session the cast pack already records as `book.lotm.be.client.<name>` (Anna, Joyce, Glacis, Bogda).
// - Default: one act per reading. A flag is a SET fact, so repeating the same reading for the same client never counts
//   twice, and a row that is the same reading as a pack session counts once with it (ROW_CLIENT). Dial: a world (or a later row) may give a return visit its own row id, as canon gives Glacis a second chart
//   (zh 第115章 p54) after the astrolabe session; that is a different reading and counts once more.
// - Default: an unclear reading (nothing Klein knew grounded it) does not count. Dial COUNT_UNCLEAR. Reason: an answer
//   the client cannot use is not the Seer's part played; the act is giving the reading, not only sitting down to it.
// - Default: the pack's client sessions count (dial COUNT_CLIENT_SESSIONS). Reason: they are the canon in-role readings
//   at the Divination Club, the acting canon describes.
// Pure: no clock, no state writes. The probationer branch keeps its own counter (book_world_lotm_state.js:92).
import {digestionFacts,digestionFelt} from './book_world_lotm_digestion.js';
import {LOTM_DIGEST_ACTS} from './book_world_lotm_ids.js';
import {BE_PROFILE_ID} from './seat_profiles.js';

export const LOTM_BE_ACTING_ROWS=Object.freeze(['lotm.div.astrological-chart','lotm.div.tarot-divination','lotm.div.numerology','lotm.div.tarot-lost-object']);
// A row that is the same reading as a pack client session counts as that session (one reading, one act): the Bogda
// operation spread is Bogda's paid session (kj3ao) and Joyce's date numbers are Anna's (kj3aa). The chart row is
// Glacis's later chart (zh 第115章 p54), a reading of its own, so it keeps its own key.
export const ROW_CLIENT=Object.freeze({'tarot-divination':'bogda','numerology':'anna'});
export const COUNT_UNCLEAR=false,COUNT_CLIENT_SESSIONS=true;
export const BE_ACTING_PREFIX='book.lotm.be.acting.';
const CLIENT=/^book\.lotm\.be\.client\.[a-z0-9-]+$/;
export const beActingKey=rowId=>BE_ACTING_PREFIX+rowId.replace(/^lotm\.div\./,'');

// Adapter hook (defineDivinations option): effects added to a row's interpret step, per grounded/unclear variant.
export function lotmBeInterpretEffects(row,{grounded}){
 if(!LOTM_BE_ACTING_ROWS.includes(row.id)||grounded===false&&!COUNT_UNCLEAR)return [];
 return [{type:'fact',scope:'actor',actor:'player',key:beActingKey(row.id),value:true}];
}

// Distinct in-role readings recorded on the lead's own facts.
export function beActingCount(state){
 const f=state?.actors?.player?.facts||{},acts=new Set();
 for(const [k,v] of Object.entries(f)){
  if(!v)continue;
  if(k.startsWith(BE_ACTING_PREFIX)){const row=k.slice(BE_ACTING_PREFIX.length);acts.add(ROW_CLIENT[row]?`client:${ROW_CLIENT[row]}`:`row:${row}`);}
  else if(COUNT_CLIENT_SESSIONS&&CLIENT.test(k))acts.add(`client:${k.slice('book.lotm.be.client.'.length)}`);
 }
 return acts.size;
}

const FELT={unsettled:'The Seer potion still sits unsettled in you',settling:'The Seer potion is settling as you play the Seer',
 settled:'The Seer potion has settled; you feel it fully yours'};
// One player line for the resident view, or null outside Klein's life or before the potion.
export function lotmBeActingLine(state){
 if(state?.lotm?.entryProfile!==BE_PROFILE_ID||state.actors?.player?.facts?.['book.lotm.be.seer.ingested']!==true)return null;
 const n=beActingCount(state),f=digestionFacts({},'lotm.be',Math.min(n,LOTM_DIGEST_ACTS),LOTM_DIGEST_ACTS);
 return `${FELT[digestionFelt(f,'lotm.be')]}: ${Math.min(n,LOTM_DIGEST_ACTS)} of ${LOTM_DIGEST_ACTS} readings given to others in the Seer's role.`;
}
