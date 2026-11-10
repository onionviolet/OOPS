// L9 host consumer: the one place the Tingen host talks to the harm domain (AR3: harm_state owns the
// counter; this file only supplies the command class, reads modifiers and records accrual and rest).
import {harmState,setHarmState,addBacklash,restBacklash,relieveBacklash,backlashStage,resolveDeath,HARM_WORLDS} from './harm_state.js';
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
 const row=HARM_WORLDS[WORLD].carriers[CARRIER],h=withLotmInbox(harm,state),count=h?.backlash?.[CARRIER]??row.floor;
 return {count,presign:row.stages.find(x=>x.id==='strained').at,loss:row.stages.find(x=>x.id==='lost').at};
}
// A finished rite or craft names its carrier and weight (lotm_act_engine settle); the one door into the same slice.
export function accrueAct(carrier,{source,weight}){
 const next=addBacklash(harmState(),HARM_WORLDS[WORLD],carrier,{source,weight});setHarmState(next.state);return next.record;
}
export function restHarm(s,minutes,treated=false){
 if(s.actors?.player?.worldId!==WORLD||!(minutes>0))return null;
 const next=restBacklash(harmState(),HARM_WORLDS[WORLD],CARRIER,{minutes,treated});setHarmState(next.state);return next.record;
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
