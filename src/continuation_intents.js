// Explicitly funded knowledge retention. No active policy, body stage, site,
// tool, paid preparation, source evidence or reserve is copied to a new life.
import {check} from './basics.js';
import {INTENTS} from './cultivation_intents.js';
import {setSavedPurse} from './money.js';
export function validateIntentMemory(m){if(m===undefined)return;check(m&&Object.keys(m).sort().join(',')==='anchored,known'&&['known','anchored'].every(k=>Array.isArray(m[k])&&m[k].length<=2&&new Set(m[k]).size===m[k].length&&m[k].every(id=>INTENTS[id]))&&m.anchored.every(id=>m.known.includes(id)),'Invalid anchored cultivation insight.');}
export function observeIntents(c,root){if(c.challenge)return;const known=Object.keys(INTENTS).filter(id=>root?.actors?.player?.facts?.['cultivation.intent.'+id]===true);if(!known.length)return;c.intentMemory ||= {known:[],anchored:[]};for(const id of known)if(!c.intentMemory.known.includes(id))c.intentMemory.known.push(id);validateIntentMemory(c.intentMemory);}
export function intentMemoryView(c,money){const m=c.intentMemory||{known:[],anchored:[]};validateIntentMemory(m);return m.known.map(id=>({id,name:INTENTS[id].name,anchored:m.anchored.includes(id),cost:100,affordable:money>=100,eligible:!c.challenge&&!m.anchored.includes(id)}));}
export function anchorIntent(save,c,id){const q=intentMemoryView(c,save.character.money).find(x=>x.id===id);check(q?.eligible,'Learn this actual habit before anchoring it, and keep challenge lives isolated.');check(q.affordable,'This knowledge anchor costs 100 actual carried coins.');setSavedPurse(save,save.character.money-100,'continuation.intent_anchor');c.intentMemory.anchored.push(id);validateIntentMemory(c.intentMemory);}
export function applyIntentMemory(save,c){if(c.challenge||!c.intentMemory)return;validateIntentMemory(c.intentMemory);save.expansion.actors.player.facts ||= {};for(const id of c.intentMemory.anchored)save.expansion.actors.player.facts['cultivation.intent.'+id]=true;}
