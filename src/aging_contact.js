import {GAME_YEAR} from './chronicle.js';
// Age-driven chronic conditions and contact decay (G01/G02, AD13, AD19, AD38). Pure rules: the chronicle owns age
// and the clock, the hero owns stats; this slice keeps only choices, wear counted so far and who was written to.
// Every number is a default under a dial: a world's dial replaces the pace and states the in-world reason.
export const DAY = 24 * 60;
export const AGING_DIALS = Object.freeze({
    'base.frontier': Object.freeze({id: 'mortal', rate: 1, reason: 'An ordinary human body wears with the years.'}),
});
export const DEFAULT_DIAL = AGING_DIALS['base.frontier'];
// Floors keep the ceiling a slow tax, never a defeat (AD19): health and stamina refill, they just top out lower.
export const FLOOR = Object.freeze({health: 0.6, stamina: 0.7});
export const WEAR_FROM_AGE = 40, WEAR_PER_YEAR = 0.004, MAX_SEVERITY = 3, STEP_PENALTY = 0.04;
export const TREAT_SEASON = 90 * DAY, TREAT_COIN = 8;
export const CHRONIC = Object.freeze([
    {id: 'joints', onset: 45, step: 4, name: 'Stiff joints', symptom: 'Your joints ache on cold mornings.', health: 1, stamina: 0},
    {id: 'breath', onset: 52, step: 5, name: 'Short breath', symptom: 'You tire faster on the hill paths.', health: 0.5, stamina: 1},
    {id: 'sight', onset: 58, step: 5, name: 'Failing eyes', symptom: 'Small print swims at the end of the day.', health: 0.5, stamina: 0},
    {id: 'heart', onset: 65, step: 6, name: 'Heart strain', symptom: 'A flutter after climbing stairs.', health: 1, stamina: 0.5},
]);
export const STANCES = Object.freeze({
    ignore: {rate: 1, upkeep: 0, text: 'Carry on as before. Costs nothing; the condition advances at its full pace.'},
    manage: {rate: 0.35, upkeep: 0.02, text: 'Stretches, pacing and rest as a routine. Advances at about a third of the pace; the routine trims your stamina ceiling a little.'},
});
export const CONTACT = Object.freeze({max: 100, floor: 5, perDay: 4, villageEase: 0.5, letterEase: 0.7, letterDays: 3, letterWindow: 30 * DAY,
    company: 20, repeat: 8, letterSent: 6, reply: 25, memory: 10, maxPending: 2, catchUp: 7 * DAY});
export const PHASES = Object.freeze([
    {id: 'connected', from: 60, label: 'Connected', stamina: 0, health: 0, aging: 1, text: 'People know how you are and you know how they are.'},
    {id: 'quiet', from: 35, label: 'Quiet', stamina: 0, health: 0, aging: 1, text: 'Days pass without much talk. Nothing is wrong yet.'},
    {id: 'withdrawn', from: 15, label: 'Withdrawn', stamina: 0.05, health: 0, aging: 1.1, text: 'Long silence dulls your drive; the body wears a little faster with no one to share the load.'},
    {id: 'isolated', from: 0, label: 'Isolated', stamina: 0.1, health: 0.02, aging: 1.25, text: 'Weeks alone sap your stamina and health, and aches advance faster. A visit or a letter lifts it at once.'},
]);
export const CONTACT_NAMES = Object.freeze({villageElder: 'the Village elder'});

const object = v => v && typeof v === 'object' && !Array.isArray(v);
const finite = v => Number.isFinite(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const key = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && v.length <= 64 && !['__proto__', 'constructor', 'prototype'].includes(v);
const round = v => Math.round(v * 1000) / 1000;

export const freshAging = () => ({schema: 1, lifeKey: null, lastAge: null, dial: null, conditions: {},
    contact: {score: CONTACT.max, seenMemory: 0, company: {day: -1, gains: 0}, letters: []}});

export function validateAgingContact(slice) {
    if(slice == null) return;
    const bad = m => {throw Error(`Invalid aging and contact slice: ${m}`);};
    if(!object(slice) || slice.schema !== 1) bad('schema');
    if(!(slice.lifeKey === null || natural(slice.lifeKey)) || !(slice.lastAge === null || finite(slice.lastAge) && slice.lastAge >= 0 && slice.lastAge < 1000)) bad('life');
    if(slice.dial !== null && !(object(slice.dial) && key(slice.dial.id) && finite(slice.dial.rate) && slice.dial.rate >= 0 && slice.dial.rate <= 2 &&
        typeof slice.dial.reason === 'string' && slice.dial.reason.length > 0 && slice.dial.reason.length <= 200)) bad('dial');
    if(!object(slice.conditions)) bad('conditions');
    for(const [id, c] of Object.entries(slice.conditions)) {
        if(!CHRONIC.some(d => d.id === id) || !object(c) || !finite(c.progress) || c.progress < 0 || c.progress > 200 || !natural(c.relief) || c.relief > MAX_SEVERITY + 2 ||
            !Object.hasOwn(STANCES, c.stance) || !natural(c.treatedUntil) || typeof c.diagnosed !== 'boolean') bad(`condition ${id}`);
    }
    const k = slice.contact;
    if(!object(k) || !finite(k.score) || k.score < CONTACT.floor || k.score > CONTACT.max || !natural(k.seenMemory) || !object(k.company) || !Number.isSafeInteger(k.company.day) ||
        !natural(k.company.gains) || !Array.isArray(k.letters) || k.letters.length > 8) bad('contact');
    for(const l of k.letters) if(!object(l) || !key(l.to) || !natural(l.sentAt) || !natural(l.replyAt) || l.replyAt < l.sentAt || !['pending', 'replied'].includes(l.status)) bad('letter');
}
export function migrateAgingContact(slice) {
    if(slice == null) return freshAging();
    validateAgingContact(slice);
    return structuredClone(slice);
}

export const dialFor = (state, worldId) => state.dial ?? AGING_DIALS[worldId] ?? DEFAULT_DIAL;
export const phaseOf = score => PHASES.find(p => score >= p.from);
export const severityOf = (def, c) => c ? Math.max(0, Math.min(MAX_SEVERITY, Math.floor(c.progress / def.step) - c.relief)) : 0;
const treated = (c, clock) => !!c && c.treatedUntil > clock;
export const treatCost = (def, c) => TREAT_COIN * (severityOf(def, c) + 1);

// A new life is a new body: wear and relief belong to the body that earned them (BHR3).
export function syncLife(state, life) {
    if(life == null) return state;
    if(state.lifeKey === life.key) return state;
    return {...freshAging(), dial: state.dial, lifeKey: life.key, lastAge: life.age};
}

// Advance by played minutes. Wear counts only the age span above each onset, at most one year per step,
// scaled by dial, stance and isolation. Returns the next slice and any messages for the log.
export function stepAging(state, input) {
    const {age, clock, minutes, worldId, ended = false, latestMemory = 0} = input, notes = [];
    if(ended) return {state, notes};
    let next = structuredClone(state);
    const dial = dialFor(next, worldId), phase = phaseOf(next.contact.score);
    const span = next.lastAge == null ? 0 : Math.max(0, Math.min(1, age - next.lastAge));
    for(const def of CHRONIC) {
        const over = Math.max(0, age - Math.max(def.onset, next.lastAge ?? age));
        if(age < def.onset && !next.conditions[def.id]) continue;
        const c = next.conditions[def.id] ??= {progress: 0, relief: 0, stance: 'ignore', treatedUntil: 0, diagnosed: false};
        const pace = treated(c, clock) ? 0.1 : STANCES[c.stance].rate;
        const before = severityOf(def, c);
        c.progress = Math.min(def.step * (MAX_SEVERITY + c.relief), c.progress + Math.min(span, over) * dial.rate * pace * phase.aging);
        if(severityOf(def, c) > before) notes.push(c.diagnosed ? `${def.name} has worsened.` : def.symptom);
    }
    next.lastAge = next.lastAge == null ? age : next.lastAge + span;
    const k = next.contact, decay = CONTACT.perDay * Math.min(minutes, CONTACT.catchUp) / DAY;
    const writing = k.letters.some(l => clock - l.sentAt <= CONTACT.letterWindow);
    const ease = (input.inVillage ? CONTACT.villageEase : 1) * (writing ? CONTACT.letterEase : 1);
    const before = phaseOf(k.score).id;
    k.score = Math.max(CONTACT.floor, k.score - decay * ease);
    for(const l of k.letters) if(l.status === 'pending' && clock >= l.replyAt) {
        l.status = 'replied';k.score = Math.min(CONTACT.max, k.score + CONTACT.reply);
        notes.push(`A reply arrives from ${CONTACT_NAMES[l.to] ?? l.to}. It is good to hear from someone.`);
    }
    if(latestMemory > k.seenMemory) {
        k.score = Math.min(CONTACT.max, k.score + (k.seenMemory > 0 ? CONTACT.memory : 0));k.seenMemory = latestMemory;
    }
    const after = phaseOf(k.score).id;
    if(after !== before && PHASES.findIndex(p => p.id === after) > PHASES.findIndex(p => p.id === before)) notes.push(phaseOf(k.score).text);
    return {state: next, notes};
}

export function setStance(state, id, stance, clock) {
    const def = CHRONIC.find(d => d.id === id);
    if(!def || !Object.hasOwn(STANCES, stance)) throw Error('Unknown stance.');
    const c = state.conditions[id];
    if(!c || severityOf(def, c) === 0 && !c.progress) throw Error('Nothing to manage yet.');
    const next = structuredClone(state);
    next.conditions[id] = {...c, stance, diagnosed: true};
    return next;
}
export function treat(state, id, clock, coins) {
    const def = CHRONIC.find(d => d.id === id), c = state.conditions[id];
    if(!def || !c || c.progress <= 0) throw Error('Nothing to treat yet.');
    const cost = treatCost(def, c);
    if(coins < cost) throw Error(`A course of care costs ${cost} coins.`);
    const next = structuredClone(state);
    next.conditions[id] = {...c, relief: Math.min(c.relief + (severityOf(def, c) > 0 ? 1 : 0), Math.floor(c.progress / def.step)), treatedUntil: clock + TREAT_SEASON, diagnosed: true};
    return {state: next, cost};
}

export const contactChoices = (relationships, ownIds = []) =>
    [...new Set([...Object.keys(relationships ?? {}), ...ownIds])].filter(key).map(id => ({id, label: CONTACT_NAMES[id] ?? id}));
export function spendCompany(state, clock, withId) {
    const k = state.contact, day = Math.floor(clock / DAY);
    const next = structuredClone(state), c = next.contact;
    if(c.company.day !== day) c.company = {day, gains: 0};
    const gain = c.company.gains === 0 ? CONTACT.company : CONTACT.repeat;
    c.company.gains += 1;c.score = Math.min(CONTACT.max, c.score + gain);
    return {state: next, gain, from: k.score};
}
export function writeLetter(state, clock, to, coins) {
    if(coins < 1) throw Error('A letter needs a coin for paper and carriage.');
    if(state.contact.letters.filter(l => l.status === 'pending').length >= CONTACT.maxPending) throw Error('Two letters are already out. Wait for a reply.');
    if(state.contact.letters.some(l => l.to === to && l.status === 'pending')) throw Error('A letter to them is already out.');
    const next = structuredClone(state), k = next.contact;
    k.letters = [...k.letters.filter(l => l.status === 'pending' || clock - l.sentAt <= CONTACT.letterWindow), {to, sentAt: clock, replyAt: clock + CONTACT.letterDays * DAY, status: 'pending'}].slice(-8);
    k.score = Math.min(CONTACT.max, k.score + CONTACT.letterSent);
    return {state: next, cost: 1};
}

// What the hero's stats read. Each bucket is one named cause so the stat tooltip shows the parts.
export function ceilingParts(state, {age, worldId, clock}) {
    const dial = dialFor(state, worldId), phase = phaseOf(state.contact.score);
    const wear = round(Math.max(0, age - WEAR_FROM_AGE) * WEAR_PER_YEAR * dial.rate);
    const parts = {health: [], stamina: []};
    if(wear > 0) {parts.health.push({bucket: 'aging_wear', label: `Age ${Math.floor(age)} (${dial.id})`, loss: wear});parts.stamina.push({bucket: 'aging_wear', label: `Age ${Math.floor(age)} (${dial.id})`, loss: round(wear / 2)});}
    for(const def of CHRONIC) {
        const c = state.conditions[def.id], s = severityOf(def, c);
        if(s > 0) {
            if(def.health) parts.health.push({bucket: 'aging_chronic', label: `${c.diagnosed ? def.name : 'Unexplained ache'} ${s}/${MAX_SEVERITY}`, loss: round(s * STEP_PENALTY * def.health)});
            if(def.stamina) parts.stamina.push({bucket: 'aging_chronic', label: `${c.diagnosed ? def.name : 'Unexplained ache'} ${s}/${MAX_SEVERITY}`, loss: round(s * STEP_PENALTY * def.stamina)});
        }
        if(c && c.stance === 'manage' && !treated(c, clock) && c.progress > 0) parts.stamina.push({bucket: 'aging_chronic', label: `${def.name} routine`, loss: STANCES.manage.upkeep});
    }
    if(phase.health) parts.health.push({bucket: 'aging_contact', label: `${phase.label}`, loss: phase.health});
    if(phase.stamina) parts.stamina.push({bucket: 'aging_contact', label: `${phase.label}`, loss: phase.stamina});
    return parts;
}
export function ceilings(state, input) {
    const parts = ceilingParts(state, input), out = {health: {}, stamina: {}, parts};
    for(const stat of ['health', 'stamina']) {
        const total = parts[stat].reduce((a, p) => a + p.loss, 0);
        const mult = Math.max(FLOOR[stat], round(1 - total));
        // Scale buckets so their product equals the floored multiplier but each stays attributable.
        const shown = total > 0 ? (1 - mult) / total : 0;
        for(const p of parts[stat]) out[stat][p.bucket] = round((out[stat][p.bucket] ?? 1) - p.loss * shown);
        out[stat].multiplier = mult;
    }
    return out;
}
export const buckets = (c) => {
    const result = {};
    for(const bucket of ['aging_wear', 'aging_chronic', 'aging_contact']) result[bucket] = {};
    for(const [stat, field] of [['max_health', 'health'], ['max_stamina', 'stamina']])
        for(const bucket of Object.keys(result)) if(c[field][bucket] != null) result[bucket][stat] = c[field][bucket];
    return result;
};

export function agingView(state, input) {
    const dial = dialFor(state, input.worldId), c = ceilings(state, input), phase = phaseOf(state.contact.score), clock = input.clock;
    const conditions = CHRONIC.map(def => {
        const cond = state.conditions[def.id], severity = severityOf(def, cond);
        if(!cond || cond.progress <= 0) return null;
        const left = Math.max(0, (def.step * (severity + 1 + cond.relief) - cond.progress));
        return {id: def.id, title: cond.diagnosed ? def.name : 'Unexplained ache', symptom: def.symptom, severity, stance: cond.stance, treated: treated(cond, clock),
            diagnosed: cond.diagnosed, cost: treatCost(def, cond), canTreat: true, next: severity >= MAX_SEVERITY ? 'Holding at the worst it gets.' : `Next step in about ${Math.max(1, Math.ceil(left / (dial.rate * (treated(cond, clock) ? 0.1 : STANCES[cond.stance].rate) || 1)))} years at this pace.`};
    }).filter(Boolean);
    const pct = v => `${Math.round((1 - v) * 100)}%`;
    return {age: Math.floor(input.age), dial, conditions, healthMultiplier: c.health.multiplier, staminaMultiplier: c.stamina.multiplier,
        reasons: {health: c.parts.health.map(p => `${p.label} -${Math.round(p.loss * 100)}%`), stamina: c.parts.stamina.map(p => `${p.label} -${Math.round(p.loss * 100)}%`)},
        summary: conditions.length || c.health.multiplier < 1 ? `Health tops out at ${Math.round(c.health.multiplier * 100)}% and stamina at ${Math.round(c.stamina.multiplier * 100)}% of what a young body holds (-${pct(c.health.multiplier).replace('%', '')}% and -${pct(c.stamina.multiplier).replace('%', '')}%). Rest still refills them.` : 'Your body feels in its prime.',
        contact: {score: Math.round(state.contact.score), phase: phase.id, label: phase.label, text: phase.text, letters: state.contact.letters.map(l => ({...l, name: CONTACT_NAMES[l.to] ?? l.to}))},
        yearsPerStep: CHRONIC.length};
}
export const lifeInput = chronicle => chronicle ? {key: chronicle.enrolledAt, age: chronicle.life.initialAge + (chronicle.lastClock - chronicle.enrolledAt) / GAME_YEAR, ended: chronicle.life.endedAt !== null} : null;
export function latestMemory(chronicle) {
    let at = 0;
    for(const r of Object.values(chronicle?.relationships ?? {})) for(const m of r.memories ?? []) at = Math.max(at, m.at);
    return at;
}
