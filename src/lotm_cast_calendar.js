// Existing relative cast calendar, extracted unchanged from its host so case
// projections can share its day/hour without importing the cast composition root.
export function castCalendar(state){
 const elapsed=Math.max(0,state.clock-state.lotm.initializedAt),day=Math.floor(elapsed/1440)+1; // rule-lint: allow Existing cast relative-calendar projection extracted unchanged from its host for shared client reads.
 // This profile starts at the opening small hours, minute 0; it owns no second timer.
 const minute=elapsed%1440;
 return {calendar:{year:Math.floor((day-1)/360),month:Math.floor((day-1)%360/30)+1,
  day:(day-1)%30+1,day_count:day,hour:Math.floor(minute/60),minute:minute%60}};
}
