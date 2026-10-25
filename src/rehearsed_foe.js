// RF1: actor-owned memory, not player-held state or a second combat executor.
import {check,natural} from './basics.js';
import {validateCheatCard} from './cheat_cards.js';
export const RF1_POWER='cheat.rehearsed_foe';
export const RF1_DEFINITION=Object.freeze({id:RF1_POWER,revision:1,label:'Rehearsed opening',model:'practice',capacity:1,
    execution:{fact:'body.alive',op:'eq',value:true},rehearsal:{staminaCost:2,damageScale:.5,memoryLimit:8}});
export const RF1_TELL='Your opponent moves before your familiar opening. A different stance or weapon may disrupt the read.';
export function ensureRehearsedFoe(state,holderId) {
    const powers=state.simulation.powers[holderId]??={};
    if(!powers[RF1_POWER])powers[RF1_POWER]={revision:1,owned:true,mastery:0,fragments:[],executions:0,
        card:{id:'rehearsed-foe',family:'rehearsal',name:'Rehearsed Foe',ui:'quiet',terms:'matured',hooks:['native-contest.opening'],
            state:{revision:1,holderId,memories:[],lastSession:null,scars:0},stages:[],observers:[],sources:[{route:'native-contest',at:state.clock}]}};
    validateRehearsedRecord(powers[RF1_POWER],holderId);return powers[RF1_POWER];
}
export function validateRehearsedRecord(record,holderId) {
    const card=record?.card;validateCheatCard(card);
    const s=card.state;
    check(card.id==='rehearsed-foe'&&s.revision===1&&s.holderId===holderId&&natural(s.scars)&&
        (s.lastSession===null||typeof s.lastSession==='string')&&Array.isArray(s.memories)&&s.memories.length<=8&&
        s.memories.every(m=>m&&typeof m.signature==='string'&&m.signature.length<=300&&natural(m.at))&&
        new Set(s.memories.map(m=>m.signature)).size===s.memories.length,'Invalid RF1 actor record.');
}
// A signature names actual means, so changing a stance/weapon changes what is
// rehearsed. No future input, seed peek or hidden player choice is consulted.
export function openingSignature(fighter) {
    return JSON.stringify([fighter.attackPower,fighter.stats.attack_count||1,fighter.shield||0,
        fighter.stats.attack_points||0,fighter.stats.crit_rate||0]);
}
export function rehearseOpening(state,registry,{actorId,targetId,sessionId,attacker}) {
    const record=state.simulation.powers[targetId]?.[RF1_POWER];
    if(!record?.owned)return {scale:1,tell:null};
    validateRehearsedRecord(record,targetId);
    const s=record.card.state;if(s.lastSession===sessionId)return {scale:1,tell:null};
    const body=state.simulation.people[targetId];
    if(body?.life!=='alive'||body.vitals.health<=1)return {scale:1,tell:null};
    const d=registry.simulation.powers.get(RF1_POWER).rehearsal,signature=openingSignature(attacker);
    const remembered=s.memories.some(m=>m.signature===signature);
    s.lastSession=sessionId;s.memories=s.memories.filter(m=>m.signature!==signature);
    s.memories.push({signature,at:state.clock});s.memories=s.memories.slice(-d.memoryLimit);
    record.mastery=s.memories.length;
    if(!remembered||body.vitals.stamina<d.staminaCost)return {scale:1,tell:null};
    body.vitals.stamina-=d.staminaCost;s.scars++;record.executions++;
    return {scale:d.damageScale,tell:RF1_TELL,observerId:actorId};
}
export function rehearsedFoeObservation(state,observerId='player') {
    return state.simulation?.knowledge?.[observerId]?.['cheat.rf1.tell']?.value||'';
}
