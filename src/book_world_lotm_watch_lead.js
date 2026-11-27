// Public work, heard from a present supervisor or found by applying actual papers research.
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {all,eq,know,cmd} from './book_world_lotm_kit.js';
import {districtById,districtCommands} from './book_world_lotm_districts.js';
import {LOTM_LIBRARY_KEY,LOTM_LIBRARY_REQUIREMENTS} from './book_world_lotm_inquiry.js';
import {formatDuration} from './number_format.js';
export const WATCH_STORM_NOTE='book.lotm.office.storm_contact';
export const WATCH_HANDOVER='book.lotm.watch_storm_handover';
export const DIRECTORY_STORM='book.lotm.directory_storm_contact';
export const STORM_PUBLIC_WORK=districtById('storm');
const ordinary=eq('lotm.profile.probationer'),unknown=eq('lotm.office.stormKnown',false);
const office='the Punishers’ duty office at the Tingen docks';
const DIRECTORY_MINUTES=1;
export const watchLeadCommands=[
 cmd('watch_storm_handover','Ask Hale about public office work at the watch handover',L.workroom,{targetId:I.supervisor,
  visibleWhen:all(ordinary,eq('lotm.office.watchCompleted'),unknown),requires:all(ordinary,eq('lotm.office.watchCompleted'),unknown),
  effects:[know('office.storm_contact',`At the handover, Hale gives you the address of ${office}. He tells you to ask its duty officer about the current terms for endorsed harbour work.`,I.supervisor,'player','instruction','understood')]}),
 cmd('directory_storm_contact',`Find the public duty contact in your city-papers notes · ${formatDuration(DIRECTORY_MINUTES)}`,L.university,{alone:true,duration:DIRECTORY_MINUTES,cancellation:'forfeit',
  visibleWhen:all(ordinary,eq('lotm.at.university'),unknown),requires:all(ordinary,eq('lotm.office.papersRead'),unknown),
  effects:[know('office.storm_contact',`You match a public service notice in your city-papers notes to ${office}. Your note gives its address and says to ask the duty officer about current endorsed harbour work.`,'player','player','observation','understood')]})
];
export function watchLeadFacts(state,f){
 const known=state.simulation?.knowledge?.player||{};
 f['lotm.office.stormKnown']=!!known[WATCH_STORM_NOTE];
 f['lotm.office.watchCompleted']=(state.actors?.player?.completed?.['book.lotm.merit_cold_room_watch']||0)>0;
 f['lotm.office.papersRead']=['interpreted','understood'].includes(known[LOTM_LIBRARY_KEY]?.stage);
}
export function stormWorkTerms(commands=districtCommands){
 const get=id=>Array.isArray(commands)?commands.find(c=>c.id===id):commands.get(id);
 const endorsement=get('book.lotm.endorse_storm'),errand=get('book.lotm.errand_storm');
 return {endorsementPence:-(endorsement.costs.find(e=>e.key==='money'&&e.amount<0)?.amount||0),minutes:errand.duration,payPence:errand.effects.find(e=>e.key==='money'&&e.amount>0)?.amount||0};
}
export function watchLeadView(state,preview,commands=districtCommands){
 const note=state.simulation?.knowledge?.player?.[WATCH_STORM_NOTE],directory=watchLeadCommands.find(c=>c.id===DIRECTORY_STORM);
 return {note:note?.value||null,place:STORM_PUBLIC_WORK.places[0],terms:stormWorkTerms(commands),handover:preview(WATCH_HANDOVER),
  forecast:`A completed watch lets you ask Hale about public office work at handover, if he is there. The independent reading-room route takes ${formatDuration(LOTM_LIBRARY_REQUIREMENTS.minutes)} of city-papers study, then ${formatDuration(directory.duration)} to find the duty contact in your notes.`};
}
