// L9 host consumer: the one place the Tingen host talks to the harm domain (AR3: harm_state owns the
// counter; this file only supplies the command class, reads modifiers and records accrual and rest).
import {harmState,setHarmState,addBacklash,restBacklash,backlashStage,resolveDeath,HARM_WORLDS} from './harm_state.js';
const WORLD='book.lotm.tingen',CARRIER='power';
// Proposed dials (default, dial, reason): peeking and ritual casts strain the power most, plain practice a little.
// Retune per rung once play shows the pace; stages sit at 3, 6 and 9 in HARM_WORLDS.
export const LOTM_ACCRUAL={divination:{source:'divination peek',weight:1},ability:{source:'ability use',weight:0.5}};
// The function class a command belongs to; unmatched commands stay 'other'.
export function harmClassOf(def){
 if(def.bodyCare)return def.bodyCare.kind==='sleep'?'rest':'care';
 if(def.journey||String(def.id).startsWith('lotm.move.'))return 'travel';
 if(def.divination)return 'ritual';
 if(def.castAbility)return 'practice';
 if(/bf_|brew|making/.test(def.id)||def.making)return 'craft';
 if(/observe_|inference/.test(def.id)||def.inference)return 'research';
 if(def.topicTalk||/talk/.test(def.id))return 'socialize';
 return 'other';
}
export const harmContext=(s,def)=>({harmSave:{expansion:s,harm:harmState()},harmActionClass:harmClassOf(def)});
// One accrual per peek (the divination's attempt step), not per preparation or interpretation step.
const accrualOf=def=>def.divination?.kind==='attempt'?LOTM_ACCRUAL.divination:def.castAbility?LOTM_ACCRUAL.ability:null;
// Accrues after a committed command; the harm slice saves through the registry, so no new key.
export function accrueHarm(s,def){
 const a=accrualOf(def);if(!a||s.actors?.player?.worldId!==WORLD)return null;
 const next=addBacklash(harmState(),HARM_WORLDS[WORLD],CARRIER,a);setHarmState(next.state);return next.record;
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
