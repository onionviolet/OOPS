// Only measured expression enters this lossy biography. Genotypes remain sealed.
import {appendLifeMilestone,lifeCalendarMinute} from './life_record.js';
import {renderMemory} from './memory_messages.js';
export function stageRootRetuningMemory(plan,record,before,after,direction){
 const payload={direction,beforeFlow:before.flow,beforeStill:before.still,afterFlow:after.flow,afterStill:after.still},message={key:'life.root-retuning',payload},t=plan.calendar;
 plan.nativePatch={...plan.nativePatch,life_record:appendLifeMilestone(record,{year:t.year,at:lifeCalendarMinute(t),worldId:'p23.mistglass',kind:'memory',...message,text:renderMemory(message)})};
}
