// L9 host consumer: the one place the Tingen host talks to the harm domain (AR3: harm_state owns the
// counter; this file only supplies the command class, reads modifiers and records accrual and rest).
import {harmState,setHarmState,addBacklash,restBacklash,relieveBacklash,healPart,backlashStage,resolveDeath,restReading,settleRestHarm,harmBody,HARM_WORLDS} from './harm_state.js';
import {bodyData} from './needs.js';
import {lossOfControlTick} from './harm_engine.js';
const WORLD='book.lotm.tingen',CARRIER='power';
// Proposed dials (default, dial, reason): peeking and ritual casts strain the power most, plain practice a little.
// Retune per rung once play shows the pace; stages sit at 3, 6 and 9 in HARM_WORLDS.
export const LOTM_ACCRUAL={divination:{source:'divination peek',weight:1},ability:{source:'ability use',weight:0.5}};
// The function class a command belongs to; unmatched commands stay 'other'.
export function harmClassOf(def){
 if(def.bodyCare)return def.bodyCare.kind==='sleep'?'rest':'care';
 if(def.journey||String(def.id).startsWith('lotm.move.'))return 'travel';
 if(def.divination||def.lotmAct?.kind==='station'||def.lotmAct&&/^lotm\.rite\./.test(def.lotmAct.rowId))return 'ritual';
 if(def.lotmAct)return 'craft';
 if(def.castAbility)return 'practice';
 if(/bf_|brew|making/.test(def.id)||def.making)return 'craft';
 if(/observe_|inference/.test(def.id)||def.inference)return 'research';
 if(def.topicTalk||/talk/.test(def.id))return 'socialize';
 return 'other';
}
export const harmContext=(s,def)=>({harmSave:{expansion:s,harm:harmState()},harmActionClass:harmClassOf(def)});
// MND8 (RCL5): one carrier. Loss-of-control causes (bad doses) and their relief (guided attention, the self rite) are
// written by simulation rows as positive inbox resources, `book.lotm.pressure` (loss due) and `book.lotm.relief`
// (relief due), on the source's own six-step line (LOTM_RULES L7). The inbox is drained into the power carrier after
// each committed command and on the clock tick; until then every reader adds it in, so a quote and its commit agree.
// The carrier's lost stage sits at 9, so inbox amounts scale by 1.5: two serious causes still reach the line and
// pre-signs (2) still start at the strained stage (3). Dial: the scale, if the stages move.
export const LOTM_LOSS_SCALE=1.5;
export const LOTM_INBOX=Object.freeze({loss:'book.lotm.pressure',relief:'book.lotm.relief'});
// One accrual per peek (the divination's attempt step), not per preparation or interpretation step.
const accrualOf=def=>def.divination?.kind==='attempt'?LOTM_ACCRUAL.divination:def.castAbility?LOTM_ACCRUAL.ability:null;
// Pure: a harm slice with a state's pending inbox applied (loss first, then relief, which respects the carrier's hold).
export function withLotmInbox(harm,state){
 const r=state?.actors?.player?.resources||{},loss=r[LOTM_INBOX.loss]||0,relief=r[LOTM_INBOX.relief]||0,rules=HARM_WORLDS[WORLD];let next=harm??undefined;
 if(loss>0)next=addBacklash(next,rules,CARRIER,{source:'loss-of-control cause',weight:loss*LOTM_LOSS_SCALE}).state;
 if(relief>0)next=relieveBacklash(next,rules,CARRIER,{source:'steadying',amount:relief*LOTM_LOSS_SCALE}).state;
 return next;
}
// Moves the inbox out of a plan's state (the caller saves the plan, then sets the returned slice). Null when empty.
export function drainLotmInbox(state,harm){
 const r=state?.actors?.player?.resources;if(!r||!(r[LOTM_INBOX.loss]>0||r[LOTM_INBOX.relief]>0))return null;
 const next=withLotmInbox(harm,state);delete r[LOTM_INBOX.loss];delete r[LOTM_INBOX.relief];return next;
}
// Accrues after a committed command; the harm slice saves through the registry, so no new key.
export function accrueHarm(s,def){
 const a=accrualOf(def);if(!a||s.actors?.player?.worldId!==WORLD)return null;
 const next=addBacklash(harmState(),HARM_WORLDS[WORLD],CARRIER,a);setHarmState(next.state);return next.record;
}
// The carrier's count (inbox included) and its lines, for facts and views: one read for every reader.
export function lotmLossLine(harm,state){
 const rules=HARM_WORLDS[WORLD],row=rules.carriers[CARRIER],h=withLotmInbox(harm,state),count=h?.backlash?.[CARRIER]??row.floor;
 const grace=rules.lossOfControl.graceMinutes,lostFor=h?.lostFor?.[CARRIER]??0;
 return {count,presign:row.stages.find(x=>x.id==='strained').at,loss:row.stages.find(x=>x.id==='lost').at,
  stage:backlashStage(rules,CARRIER,count),graceLeft:Math.max(0,grace-lostFor)};
}
// FBK (feedback): one Reports line when the carrier moves to another stage, in the world's own words.
const STAGE_LINES=Object.freeze({steady:'The hum behind your eyes has gone quiet.',strained:'Your power feels strained: a hum behind the eyes and whispers at the edge of hearing.',
 slipping:'Your control is slipping. Rituals and research will not hold your attention now; rest, or ask Hale to steady you.',
 lost:'You have lost control. Past this line nothing eases it, and within half an hour of waking time it ends you.'});
export function lotmStageNote(before,after){return before&&after&&before!==after?STAGE_LINES[after]??null:null;}
// A finished rite or craft names its carrier and weight (lotm_act_engine settle); the one door into the same slice.
export function accrueAct(carrier,{source,weight}){
 const next=addBacklash(harmState(),HARM_WORLDS[WORLD],carrier,{source,weight});setHarmState(next.state);return next.record;
}
// FRC52: the lead's rest need. Waking time drains it (projected from the slice's `at`); this sleep tick, the one path
// every Tingen sleep takes (the bodyCare sleep job holds native sleep), repays it. Recovery in the same stretch reads the
// body heal multiplier times the rest stage's heal (needs.js) through harm_state's own recovery: power strain and each
// injured part. A tired body heals slower; nothing here kills (BHR16). The clock starts at the life's first sleep: a life
// with no sleep act yet (a probationer before the dose) cannot meet the need, so it does not tire. Dial: a world that gives
// every life a bed from day one can start it at entry instead.
const restSave=s=>({expansion:s,harm:harmState()});
export function startRest(s,clock=s.clock){
 if(s.actors?.player?.worldId!==WORLD||harmState().rest?.world===WORLD||!Number.isSafeInteger(clock)||clock<0)return null;
 const next=settleRestHarm(harmState(),{body:harmBody(HARM_WORLDS[WORLD]),world:WORLD,clock});setHarmState(next.state);return next.record;
}
export function restHarm(s,minutes,treated=false){
 if(s.actors?.player?.worldId!==WORLD||!(minutes>0))return null;
 const rules=HARM_WORLDS[WORLD],start=s.clock-minutes;startRest(s,start);
 const heal=(restReading(restSave(s),start)??{effect:{heal:bodyData(harmBody(rules)).heal}}).effect.heal;
 let next=restBacklash(harmState(),rules,CARRIER,{minutes,treated,heal});
 for(const id of Object.keys(next.state.parts??{}))next={state:healPart(next.state,rules,id,{minutes,treated,heal}).state,record:next.record};
 if(next.state.rest?.world!==WORLD||!Number.isSafeInteger(s.clock)){setHarmState(next.state);return next.record;}
 const at=next.state.rest.at,rest=settleRestHarm(next.state,{body:harmBody(rules),world:WORLD,clock:s.clock,awake:Math.max(0,start-at),asleep:minutes});
 setHarmState(rest.state);return {...next.record,rest:rest.record};
}
// The Rest bar for the lead's panel: the level as a pool with the stage and what it does, from the one reading.
export function lotmRestMeter(s){
 const r=s.actors?.player?.worldId===WORLD?restReading(restSave(s)):null;if(!r)return null;
 const slow=r.effect.work<1?` Work and fights run at ${Math.round(r.effect.work*100)}% and wounds mend at ${Math.round(r.effect.heal*100)}% until you sleep.`:'';
 return {id:'lotm.rest',label:`Rest: ${r.stageLabel}`,kind:'pool',value:Math.round(r.level*100),max:100,
  note:`Falls while you are awake; each minute asleep repays two waking minutes.${slow}`};
}
// Lost control left running is the world's death trigger (L9 design); the outcome row decides what it means.
export function lostControlOutcome(s){
 if(s.actors?.player?.worldId!==WORLD)return null;
 const rules=HARM_WORLDS[WORLD],stage=backlashStage(rules,CARRIER,harmState().backlash?.[CARRIER]??rules.carriers[CARRIER].floor);
 return stage.id==='lost'?resolveDeath(rules,'loss_of_control'):null;
}
// AD50, BHR18 (RCL5): the lost stage runs the world's grace clock (harm_engine lossOfControlTick: 30 unattended
// minutes, paused while attended or a rescuer is present) before the outcome row applies. Skipped time (spending the
// away bank, a fast-forward) does not run it: a lethal transition waits for the player.
export function lossOfControlStep(s,{minutes,skipping=false,attended=false,facts={}}){
 if(s.actors?.player?.worldId!==WORLD||!(minutes>0))return {die:null};
 if(skipping)return {die:null,held:lostControlOutcome(s)!==null};
 const t=lossOfControlTick({expansion:s,harm:harmState()},{minutes,attended,facts});
 if(t.save.harm!==undefined)setHarmState(t.save.harm);
 return {die:t.die,dieAfter:t.dieAfter,paused:t.paused};
}
