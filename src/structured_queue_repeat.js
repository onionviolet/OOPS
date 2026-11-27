import {evaluateRule} from './rules.js';

// A reusable action need not be immediately repeatable from its own outcome.
// This is a conservative UI forecast, not a replacement for execution checks.
const directEffects=new Set(['relocate','fact','knowledge','item','xp','resource','vital','relationship','energy','claim']);
export function structuredQueueRepeatable(action,duration=action.duration) {
    // This quote covers the entire missing reserve. A second refill needs
    // something else to spend essence between runs.
    if(action.once||action.queueRepeatable===false||action.durationRecovery||!(duration>0))return false;
    if(action.outcomes?.length)return true;
    const effects=action.effects||[];
    if(effects.some(effect=>!directEffects.has(effect.type)))return true;
    const facts={},actor=action.actorId||'player';
    let destination;
    for(const effect of effects){
        const self=effect.actor==null||effect.actor==='$actor'||effect.actor===actor;
        if(!self)continue;
        if(effect.type==='relocate'){
            if(typeof effect.location!=='string')return true;
            destination=effect.location;
            facts['actor.location']=destination;
        }else if(effect.type==='fact'&&effect.scope==='actor'){
            if(effect.value!==null&&typeof effect.value==='object')return true;
            facts[`actor.${effect.key}`]=effect.value;
        }
    }
    if(action.location!=null&&destination!==undefined&&destination!==action.location)return false;
    for(const rule of [action.requires,action.visibleWhen]){
        if(!rule)continue;
        const next=evaluateRule(rule,facts);
        if(next.known&&!next.met)return false;
    }
    return true;
}
