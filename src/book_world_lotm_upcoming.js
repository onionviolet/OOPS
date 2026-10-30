// L14/G14 host consumer: the lead's upcoming strip rows (TC12, SUI7). Reads the same event book as lotmRestrictions, then
// narrows it through the bridge. `announced` (event ids a posted notice told him of, gap G20) and `gatherings` (rows he has
// been told of) are host inputs; nothing writes either yet, so today the strip shows only a restriction already in force.
import {upcomingStrip} from './read_models/upcoming_strip_bridge.js';
import {lotmEventBook,lotmDay,LOTM_LEAD_CHANNELS,getPrivateEvents} from './book_world_lotm_events.js';
export function lotmUpcoming({state,days,pack=getPrivateEvents(),announced=new Set(),gatherings=[]}){
 if(!pack||!state?.lotm)return [];
 const book=lotmEventBook({state,days,pack});
 return upcomingStrip(book,'player',lotmDay(state),{presence:()=>null,channels:()=>LOTM_LEAD_CHANNELS},k=>pack.lines?.[k]??null,{announced,gatherings});
}
