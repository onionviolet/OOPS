// World-neutral memory consumers. The host owns clock, presence and transactions.
import {freshMemory, readMemories, remember, tellMemory, vividness} from './person_memory.js';
import {checkKey} from './check_keys.js';
import {address, hash64, drawFraction, compareCodePoints} from './gen_kit.js';

export const REACTION_VIVIDNESS = 0.25;
export const KIND_WEIGHTS = Object.freeze({helped: 1, harmed: 1, betrayed: 1, witnessed: 0.25, told: 0.5, impression: 0});
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
const token = value => hash64(0, address(value)).toString(16);

// The fact is an opaque event pointer plus a small template payload, never prose.
export function episodeFromEffect({holder, subject, cause, axis, amount, text, day}) {
    if(!Number.isFinite(amount)) throw TypeError('Memory effect needs a finite amount.');
    if(amount === 0) return null;
    const kind = amount > 0 ? 'helped' : 'harmed';
    return {kind, about: subject, fact: `fx1|${encodeURIComponent(axis)}|${amount}|${TOPICS[text] || kind}|${token(holder)}|${token([cause, holder, subject, axis])}`,
        source: 'saw', certainty: 100, feeling: Math.sign(amount)*Math.min(100,Math.floor(Math.abs(amount))), day, count: 1};
}
export function rememberEffect(memory, effect, day) {
    const e = episodeFromEffect({...effect, day:effect.day ?? day});
    if(!e || readMemories(memory, effect.holder, day).some(row => row.fact === e.fact)) return memory;
    return remember(memory, effect.holder, e, day);
}

// Legacy axes already include these effects. Remove each mirrored contribution
// before adding its current strength; hearsay has no mirrored stored write.
export function derivedBond({memory = freshMemory(), holder, subject, axis, baseline = 0, day}) {
    let value = baseline;
    for(const e of readMemories(memory, holder, day)) {
        const p = payload(e);
        if(e.about !== subject || !p || p.axis !== axis) continue;
        if(e.source === 'saw' && p.holder === token(holder)) value -= e.feeling;
        value += (KIND_WEIGHTS[e.kind] || 0) * e.feeling * vividness(e, day);
    }
    return value;
}

export function reactionLine({memory = freshMemory(), holder, subject, day, root = 0, baseline = {}}) {
    const rows = readMemories(memory, holder, day).filter(e => e.about === subject && payload(e) && e.feeling && vividness(e, day) >= REACTION_VIVIDNESS)
        .sort((a,b) => Math.abs(b.feeling) * vividness(b, day) - Math.abs(a.feeling) * vividness(a, day) || compareCodePoints(a.fact,b.fact));
    if(!rows.length) return '';
    const e = rows[0], p = payload(e), bond = derivedBond({memory, holder, subject, axis:p.axis, baseline:baseline[p.axis] || 0, day});
    const key = checkKey({subject:holder, method:'memory.manner@1', period:{day}, targetState:{other:subject, fact:e.fact, bond:Math.round(bond*1000)}});
    const warm = bond >= 0;
    const manner = warm ? ['Warmer toward you', 'More at ease with you'] : ['Wary of you', 'Cooler toward you'];
    const phrase = PHRASES[p.topic] || PHRASES[e.kind] || 'that encounter';
    const why = e.source === 'saw' ? `since ${phrase}` : `after hearing that ${phrase}`;
    return `${manner[drawFraction(root,key) < 0.5 ? 0 : 1]} ${why}.`;
}

// Called at a played-time transaction boundary. Existing causes own daily
// receipts, so save/reload and split advances cannot repeat a day's telling.
export function gossipStep({memory, simulation, actors, day, root}) {
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
                Math.abs(derivedBond({memory:before,holder,subject:other,axis,baseline:base,day})) >= 1));
        const rows = readMemories(before,holder,day).filter(e => e.kind !== 'impression' && e.certainty > 20 && Math.abs(e.feeling) >= 1 && vividness(e,day) >= REACTION_VIVIDNESS)
            .sort((a,b) => Math.abs(b.feeling)*vividness(b,day)-Math.abs(a.feeling)*vividness(a,day) || compareCodePoints(a.fact,b.fact));
        if(!listeners.length || !rows.length) continue;
        const key = checkKey({subject:holder,method:'memory.gossip@1',period:{day},targetState:{listeners, fact:rows[0].fact}});
        const listener = listeners[Math.floor(drawFraction(root,key)*listeners.length)], e = tellMemory(rows[0],holder,day);
        if(!readMemories(memory,listener,day).some(row => row.fact === e.fact)) memory = remember(memory,listener,e,day);
    }
    return {memory, causes};
}

// Produce an envelope candidate. Nothing live changes until durable publication.
export function memoryForPlan({memory = freshMemory(), plan, day, minute = day*1440}) {
    for(const input of plan.memoryEffects || []) memory = rememberEffect(memory,{...input,day:Math.max(0,Math.floor((minute-(plan.state.clock-input.clock))/1440))},day);
    if(!plan.state.simulation) return {memory, causes:null};
    return gossipStep({memory, simulation:plan.state.simulation,actors:plan.state.actors,day,root:plan.state.simulation.seed});
}
