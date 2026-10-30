// World-neutral memory consumers. The host owns clock, presence and transactions.
import {freshMemory, readMemories, remember, tellMemory, vividness, isMemorySnapshot, memorySnapshot} from './person_memory.js';
import {checkKey} from './check_keys.js';
import {address, hash64, drawFraction, compareCodePoints} from './gen_kit.js';

import {MEMORY_LIMITS, temperamentOf as defaultTemperamentOf} from './person_temperament.js';
export const REACTION_VIVIDNESS = MEMORY_LIMITS.reactionVividness;
export const KIND_WEIGHTS = Object.freeze({helped: 1, harmed: 1, betrayed: 1, witnessed: 0.25, told: 0.5, impression: 0, amends: 1});
const TOPICS = Object.freeze({
    'Asked how he prefers to work.': 'habits',
    'Supplied the agreed materials.': 'materials',
    'Interrupted him while he was counting fittings. He asked for quiet.': 'interruption',
    'Apologized for the interruption and supplied an actual log for later work.': 'apology',
});
const PHRASES = Object.freeze({habits: 'you asked about his working habits', materials: 'you supplied the agreed materials',
    interruption: 'you interrupted his counting at the bench', apology: 'you apologized and supplied a log',
    helped: 'you helped them', harmed: 'you harmed them', betrayed: 'you betrayed them'});
const payload = e => {
    const parts = e.fact?.split('|');
    return parts?.length === 6 && parts[0] === 'fx1' ? {axis: decodeURIComponent(parts[1]), amount: Number(parts[2]), topic: parts[3], holder: parts[4]} : null;
};
const tokens = new Map();
const token = value => {const key=address(value); if(!tokens.has(key)) {if(tokens.size>2048) tokens.clear(); const {lo,hi}=hash64(0,key); tokens.set(key,hi.toString(16).padStart(8,'0')+lo.toString(16).padStart(8,'0'));} return tokens.get(key);};

// The fact is an opaque event pointer plus a small template payload, never prose.
export function episodeFromEffect({holder, subject, cause, axis, amount, text, day}) {
    if(!Number.isFinite(amount)) throw TypeError('Memory effect needs a finite amount.');
    if(amount === 0) return null;
    const kind = TOPICS[text] === 'apology' ? 'amends' : amount > 0 ? 'helped' : 'harmed';
    return {kind, about: subject, fact: `fx1|${encodeURIComponent(axis)}|${amount}|${TOPICS[text] || kind}|${token(holder)}|${token([cause, holder, subject, axis])}`,
        source: 'saw', certainty: 100, feeling: Math.sign(amount)*Math.min(100,Math.floor(Math.abs(amount))), day, count: 1};
}
export function rememberEffect(memory, effect, day, limits = MEMORY_LIMITS) {
    const e = episodeFromEffect({...effect, day:effect.day ?? day});
    if(!e || readMemories(memory, effect.holder, day, {limits}).some(row => row.fact === e.fact)) return memory;
    return remember(memory, effect.holder, e, day, limits);
}

// Legacy axes already include these effects. Remove each mirrored contribution
// before adding its current strength; hearsay has no mirrored stored write.
const reactionPriority = e => e.kind==='amends' ? 2 : harm(e) ? 1 : 0;
const bondCache = new WeakMap();
const harm = e => ['harmed','betrayed'].includes(e.kind);
function weight(e, rows, day, temperament, limits) {
    const kindWeight = e.kind === 'amends' ? temperament.amends : e.kind === 'witnessed' ? limits.witnessedWeight : e.kind === 'told' ? limits.toldWeight : KIND_WEIGHTS[e.kind] || 0;
    let repair = 1;
    if(harm(e)) {
        const p = payload(e);
        const amends = rows.filter(a=>a.kind === 'amends' && a.about === e.about && a.day >= e.day && payload(a)?.axis === p?.axis)
            .reduce((sum,a)=>sum+Math.max(0,a.feeling)*a.certainty/100,0);
        repair = Math.max(0,1-amends*limits.amendsWeight*temperament.amends/Math.max(1,Math.abs(e.feeling)));
    }
    return kindWeight * vividness(e,day,temperament,limits) * repair * (e.source === 'saw' ? 1 : temperament.trust);
}
export function derivedBond({memory = freshMemory(), holder, subject, axis, baseline = 0, day, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    const temperament = temperamentOf(holder);
    let cache = isMemorySnapshot(memory) && bondCache.get(memory);
    if(!cache && isMemorySnapshot(memory)) {cache=new Map(); bondCache.set(memory,cache);}
    const previous=cache?.get(holder);
    const sameProfile=previous && previous.day===day && (previous.temperament===temperament && previous.limits===limits || previous.signature===JSON.stringify([temperament,limits]));
    let sums=sameProfile ? previous.sums : null;
    if(!sums) {
        sums=new Map(); const rows=readMemories(memory,holder,day,{limits}), own=token(holder);
        for(const e of rows) {
            const p=payload(e); if(!p) continue;
            const pair=JSON.stringify([e.about,p.axis]);
            const mirrored=e.source==='saw' && (p.holder===own || p.holder==='[object Object]') ? e.feeling : 0;
            sums.set(pair,(sums.get(pair)||0)-mirrored+e.feeling*weight(e,rows,day,temperament,limits));
        }
        if(cache) {if(cache.size>limits.holders) cache.clear(); cache.set(holder,{day,temperament,limits,signature:JSON.stringify([temperament,limits]),sums});}
    }
    return baseline+(sums.get(JSON.stringify([subject,axis]))||0);
}

// Trait discovery is an observation result. Hosts persist it through their knowledge owner.
export function observedMemoryTraits({memory = freshMemory(), holder, subject, day, traits = [], temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    const t=temperamentOf(holder), rows=readMemories(memory,holder,day,{limits}).filter(e=>e.about===subject);
    const vividHarm=rows.some(e=>harm(e) && weight(e,rows,day,t,limits)>=limits.reactionVividness);
    const repaired=rows.some(e=>e.kind==='amends') && rows.some(harm) && rows.filter(harm).every(e=>weight(e,rows,day,t,limits)<limits.reactionVividness);
    return traits.filter(trait=>trait==='grudging' && vividHarm && rows.some(e=>harm(e) && day-e.day>=limits.traitObservationDays) || trait==='forgiving' && repaired);
}
export function revengeStub({memory = freshMemory(), holder, subject, day, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    const t=temperamentOf(holder);
    return {pending: t.harmFade>1 && readMemories(memory,holder,day,{limits}).some(e=>e.about===subject && harm(e) && vividness(e,day,t,limits)>=limits.reactionVividness)};
}
export function reactionLine({memory = freshMemory(), holder, subject, day, root = 0, baseline = {}, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    const temperament=temperamentOf(holder), all=readMemories(memory,holder,day,{limits});
    const rows = all.filter(e => e.about === subject && payload(e) && e.feeling && weight(e,all,day,temperament,limits) >= limits.reactionVividness)
        .sort((a,b) => Math.abs(b.feeling)*weight(b,all,day,temperament,limits)-Math.abs(a.feeling)*weight(a,all,day,temperament,limits) || reactionPriority(b)-reactionPriority(a) || compareCodePoints(a.fact,b.fact));
    if(!rows.length) return '';
    const e=rows[0], p=payload(e), bond=derivedBond({memory,holder,subject,axis:p.axis,baseline:baseline[p.axis]||0,day,temperamentOf,limits});
    const key=checkKey({subject:holder,method:'memory.manner@1',period:{day},targetState:{other:subject,fact:e.fact,bond:Math.round(bond*1000)}});
    const manner=bond>=0 ? ['Warmer toward you','More at ease with you'] : ['Wary of you','Cooler toward you'];
    const phrase=PHRASES[p.topic]||PHRASES[e.kind]||'that encounter';
    const why=e.source==='saw' ? `since ${phrase}` : `after hearing that ${phrase}`;
    const habit=temperament.harmFade>1 && harm(e) ? ' Still brings up that hurt.' : e.kind==='amends' && temperament.amends>1 ? ' Lets the interruption rest after your amends.' : '';
    return `${manner[drawFraction(root,key)<0.5?0:1]} ${why}.${habit}`;
}

// Called at a played-time transaction boundary. Existing causes own daily
// receipts, so save/reload and split advances cannot repeat a day's telling.
export function gossipStep({memory, simulation, actors, day, root, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    const causes = {...simulation.causes}, people = simulation.people || {}, before = memory;
    const ids = Object.keys(people).sort(compareCodePoints);
    for(const holder of ids) {
        const receipt = `memory.gossip:${day}:${holder}`;
        if(Object.hasOwn(causes,receipt)) continue;
        causes[receipt] = simulation.clock ?? day;
        const here = people[holder];
        if(here.life !== 'alive') continue;
        const listeners = ids.filter(other => other !== holder && people[other].life === 'alive' &&
            people[other].location === here.location && actors[other]?.worldId === actors[holder]?.worldId &&
            Object.entries(simulation.relationships?.[holder]?.[other]?.axes || {}).some(([axis,base]) =>
                Math.abs(derivedBond({memory:before,holder,subject:other,axis,baseline:base,day,temperamentOf,limits})) >= 1));
        const temperament=temperamentOf(holder), loss=Math.max(1,Math.min(100,Math.round(limits.tellingLoss*temperament.loss)));
        const rows = readMemories(before,holder,day,{limits}).filter(e => e.kind !== 'impression' && e.certainty > loss && Math.abs(e.feeling) >= 1 && vividness(e,day,temperament,limits) >= limits.reactionVividness)
            .sort((a,b) => Math.abs(b.feeling)*vividness(b,day,temperament,limits)-Math.abs(a.feeling)*vividness(a,day,temperament,limits) || compareCodePoints(a.fact,b.fact));
        if(!listeners.length || !rows.length) continue;
        const key = checkKey({subject:holder,method:'memory.gossip@1',period:{day},targetState:{listeners, fact:rows[0].fact}});
        if(drawFraction(root,address(key,'rate'))*100>=Math.min(100,limits.tellingRate*temperament.telling)) continue;
        const start=Math.floor(drawFraction(root,key)*listeners.length);
        for(let index=0;index<Math.min(listeners.length,Math.ceil(temperament.telling));index++) {
        const listener = listeners[(start+index)%listeners.length], e = tellMemory(rows[0],holder,day,loss,limits);
        e.feeling=Math.max(-100,Math.min(100,Math.round(e.feeling*(1+temperament.slant))));
        e.certainty=Math.min(rows[0].certainty,Math.max(0,Math.round(e.certainty*temperamentOf(listener).trust*limits.hearsayTrust/100)));
        if(!readMemories(memory,listener,day,{limits}).some(row => row.fact === e.fact)) memory = remember(memory,listener,e,day,limits);
        }
    }
    return {memory, causes};
}

// Produce an envelope candidate. Nothing live changes until durable publication.
export function memoryForPlan({memory = freshMemory(), plan, day, minute = day*1440, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS}) {
    memory=memorySnapshot(memory,day,limits);
    for(const input of plan.memoryEffects || []) memory = rememberEffect(memory,{...input,day:Math.max(0,Math.floor((minute-(plan.state.clock-input.clock))/1440))},day,limits);
    if(!plan.state.simulation) return {memory, causes:null};
    const result=gossipStep({memory, simulation:plan.state.simulation,actors:plan.state.actors,day,root:plan.state.simulation.seed,temperamentOf,limits});
    result.observations=[];
    const people=plan.state.simulation.people, player=people.player;
    if(player?.life==='alive') for(const [holder,person] of Object.entries(people)) {
        if(holder==='player' || person.life!=='alive' || person.location!==player.location) continue;
        for(const trait of observedMemoryTraits({memory:result.memory,holder,subject:'player',day,traits:temperamentOf(holder).traits,temperamentOf,limits})) result.observations.push({holder,trait});
    }
    return result;
}
