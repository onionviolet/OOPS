// Engine seams over harm_state for hosts and consumers (L9). Pure functions over a
// save value: nothing here registers, ticks or touches a clock. A host (floor-wire)
// calls these and writes the returned save back. World rows own every number
// (AD5: default, dial, reason); this module only reads them.
import {HARM_RUNGS,addBacklash,restBacklash,injurePart,actionModifiers,harmRules,resolveDeath} from './harm_state.js';
const check=(ok,message)=>{if(!ok)throw Error(message);};
const withHarm=(save,harm)=>({...save,harm});

// Weight of one strain source from the world's `sources` row. `weight` overrides the
// base (a rite row names its own); `rankGap` scales a cast's reach past comfort.
export function accrualFor(rules,kind,{weight,rankGap=0,prone=0}={}){
 const row=rules.sources?.[kind];
 check(row,'This world has no backlash source of that kind.');
 check(rankGap===undefined||Number.isFinite(rankGap)&&rankGap>=0,'Invalid rank gap.');
 const w=weight??row.base+(row.perRankGap??0)*rankGap+(row.perProne??0)*(prone??0);
 check(Number.isFinite(w)&&w>=0,'Invalid backlash weight.');
 return {carrier:row.carrier,weight:w};
}
export function accrueBacklash(save,kind,{source,weight,rankGap,prone}={}){
 const rules=harmRules(save),due=accrualFor(rules,kind,{weight,rankGap,prone});
 const r=addBacklash(save.harm,rules,due.carrier,{source:source??kind,weight:due.weight});
 return {save:withHarm(save,r.state),record:r.record};
}
// Adapter for lotm_act_engine's settleLotmBacklash(state,commands,worldId,facts,add):
//   const a=backlashAdder(save); settleLotmBacklash(state,acts,worldId,facts,a.add); save=a.result().save;
export function backlashAdder(save){
 const rules=harmRules(save);let harm=save.harm;const records=[];
 return {add(carrier,{source,weight}){const r=addBacklash(harm,rules,carrier,{source,weight});harm=r.state;records.push(r.record);return r.record;},
  result:()=>({save:records.length?withHarm(save,harm):save,records})};
}

// Loss of control: the world row's stage, held for its grace minutes with nobody
// attending, ends the life. Attended time (a rescuer, treatment) pauses the clock;
// leaving the stage clears it. `dieAfter` is minutes into this tick when the grace
// ran out, so the host stamps the moment of death rather than the end of the tick.
export function lossOfControlTick(save,{minutes,attended=false,facts={}}){
 check(Number.isFinite(minutes)&&minutes>=0,'Invalid tick minutes.');
 const rules=harmRules(save),cfg=rules.lossOfControl;
 if(!cfg)return {save,die:null,dieAfter:null,paused:false};
 const count=save.harm?.backlash?.[cfg.carrier]??rules.carriers[cfg.carrier].floor;
 const inStage=count>=rules.carriers[cfg.carrier].stages.find(x=>x.id===cfg.stage).at;
 const harm=structuredClone(save.harm??{schema:1,backlash:{}}),was=harm.lostFor?.[cfg.carrier]??0;
 const rescued=resolveDeath(rules,'loss_of_control',{facts}).alternatives.some(a=>a.kind==='rescued');
 const paused=inStage&&(attended||rescued);
 if(!inStage){
  if(was>0){delete harm.lostFor[cfg.carrier];if(!Object.keys(harm.lostFor).length)delete harm.lostFor;}
  return {save:was>0?withHarm(save,harm):save,die:null,dieAfter:null,paused:false};
 }
 if(paused)return {save,die:null,dieAfter:null,paused:true};
 harm.lostFor={...(harm.lostFor??{}),[cfg.carrier]:was+minutes};
 const over=was+minutes>=cfg.graceMinutes;
 return {save:withHarm(save,harm),die:over?'loss_of_control':null,dieAfter:over?Math.max(0,cfg.graceMinutes-was):null,paused:false};
}

// Combat/consumer view (request from the combat lane). `mods` is every graded axis,
// `shift` only the axes that move chance (hit, dodge, aim, speed, notice); strength
// axes (force, fineWork, clarity) change the result, not the odds. delta: a
// multiplier m reads m-1 (-0.5 is half as good); an offset reads as itself.
export const ODDS_AXES=Object.freeze(['accuracy','evasion','precision','speed','perception']);
export function harmOdds(save,actionClass='fight'){
 const r=actionModifiers(save,actionClass),mods=r.modifiers.flatMap(({axis,mult,add,cause})=>[
  ...(mult===undefined?[]:[{axis,delta:mult-1,cause,kind:'mult'}]),
  ...(add===undefined?[]:[{axis,delta:add,cause,kind:'add'}])]);
 return {allowed:r.allowed,blockedBy:r.blockedBy,'versus.you.mods':mods,'odds.shift':mods.filter(m=>ODDS_AXES.includes(m.axis))};
}
// Combat writes an injury through this one door; this module is the only ladder writer.
export function harmPart(save,{partId,rung,cause}){
 check(HARM_RUNGS.includes(rung),'Unknown harm rung.');
 const r=injurePart(save.harm,harmRules(save),partId,{rung,cause});
 return {save:withHarm(save,r.state),record:r.record};
}

// Cyclic sources (a curse, a held object, a place, a residue) add `base` per whole
// cycle of the row's `cycleMinutes` crossed between two native minutes. Crossing is
// by boundary, so ticking in small steps and in one long step give the same total.
const MAX_CYCLES=1000;
export function cycleBacklash(save,kind,{fromMinute,toMinute,source,weight}={}){
 const rules=harmRules(save),row=rules.sources?.[kind];
 check(row?.cycleMinutes>0,'This source does not recur.');
 check(Number.isFinite(fromMinute)&&Number.isFinite(toMinute)&&toMinute>=fromMinute,'Invalid cycle span.');
 const cycles=Math.min(MAX_CYCLES,Math.floor(toMinute/row.cycleMinutes)-Math.floor(fromMinute/row.cycleMinutes));
 if(cycles<=0)return {save,record:null,cycles:0};
 const per=accrualFor(rules,kind,{weight}),r=addBacklash(save.harm,rules,per.carrier,{source:source??kind,weight:per.weight*cycles});
 return {save:withHarm(save,r.state),record:r.record,cycles};
}
// Move strain between carriers (a curse passed on, a vessel taking it). The source
// carrier cannot fall below its floor; the target rises by `amount*ratio*riseScale`.
// `rules` may be supplied for worlds with several carriers; default is the save's world.
export function transferBacklash(save,{from,to,amount,ratio=1,rules=harmRules(save)}){
 check(from!==to,'Transfer needs two carriers.');
 check(Number.isFinite(amount)&&amount>=0&&Number.isFinite(ratio)&&ratio>=0,'Invalid transfer amount.');
 const src=rules.carriers[from];check(src,'Unknown backlash carrier.');
 const have=(save.harm?.backlash?.[from]??src.floor)-src.floor,moved=Math.min(amount,have);
 const down=restBacklash(save.harm,rules,from,{minutes:moved*60/src.restPerHour});
 const up=addBacklash(down.state,rules,to,{source:`transfer:${from}`,weight:moved*ratio});
 return {save:withHarm(save,up.state),moved,records:[down.record,up.record]};
}
