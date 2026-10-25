// Original pressure-timing observation. Visited time and unsuccessful searches
// supply evidence; the existing knowledge and discovery-stream owners retain it.
import {check,natural} from './basics.js';
import {drawUnit,scopedStream} from './seeded_streams.js';
import {mistglassProfile as P} from './absorb_p23/world_adaptation/profile.js';
export const PRESSURE_REVELATION='p23.mistglass.inquiry.pressure_timing';
const ATTEMPTS='cultivation.pressureSearches',FAILURES='cultivation.pressureSearchFailures';
export const pressureTimingKnown=s=>s.simulation?.knowledge?.player?.[PRESSURE_REVELATION]?.stage==='understood';
export function revelationView(state){
 const elapsed=state.mistglassRealm?.instance.clock.elapsed||0,r=state.actors.player.resources,attempts=r[ATTEMPTS]||0,failures=r[FAILURES]||0;
 check(natural(elapsed)&&natural(attempts)&&natural(failures)&&failures<=attempts,'Invalid pressure-search evidence.');
 return {elapsed,attempts,failures,known:pressureTimingKnown(state),chance:Math.min(1,.2+.002*elapsed+.1*failures),minutes:5,saving:100};
}
export function stageRevelation(plan,context,{advance,settle}){
 const q=revelationView(plan.state);check(!q.known,'This pressure timing is already understood.');check(!context.choiceWaiting&&typeof advance==='function','Resolve the waiting choice before this five-minute search.');
 const at=plan.state.clock,body=JSON.stringify(plan.state.simulation.people.player.body),advanced=advance(plan,q.minutes);
 check(advanced.state.clock-at===q.minutes&&!advanced.stoppedAtChoice,'Finish the pending local choice before the full five-minute search.');
 check(advanced.state.actors.player.worldId===P.worldId&&advanced.state.simulation.people.player.life==='alive'&&advanced.state.simulation.people.player.location===P.locationId&&JSON.stringify(advanced.state.simulation.people.player.body)===body,'Keep the admitted living body in this region for the search.');
 Object.assign(plan,advanced);settle(plan);
 const r=plan.state.actors.player.resources,attempt=q.attempts+1;check(natural(attempt),'Pressure-search count overflow.');
 const found=drawUnit(plan.state,scopedStream('discovery:mistglass.pressure',P.worldId),`search.${attempt}`)<q.chance;
 r[ATTEMPTS]=attempt;r[FAILURES]=q.failures+Number(!found);plan.state.sequence++;
 const knowledge=plan.state.simulation.knowledge.player||={};
 knowledge[PRESSURE_REVELATION]={stage:found?'understood':'seen',value:found?'Repeated local observation reveals when the returning mist helps drive the outflow. Timing a charged sluice operation now saves 0.1 condensate; its output and keeper payment stay the same.':`Search ${attempt} left an incomplete pressure pattern. ${q.failures+1} unsuccessful local searches now support the next observation.`,at:plan.state.clock,cause:`mistglass.pressure.${plan.state.sequence}`};
 return plan;
}
