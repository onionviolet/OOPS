// Household life events (W3, 2026-10-23): orphan, grief and came-of-age events (G26), cause-of-death lessons (G25),
// the relationship status overlay (G03) and capped memory broadcast (G06). Pure rules; the domain owns the slice.
// `npc_lives` stays the one authority for who lives, dies and ages: nothing here copies it. This slice keeps only what
// the player did about it (AD1, AD19: every cost is small, every event waits, mourning fades by itself).
import {check, natural, object} from './basics.js';
import {fnv1a} from './hash_rng.js';
import {bondStatuses, pairKey} from './npc_lives.js';

export const EVENT_CAP = 24, SEEN_CAP = 160, MEMORY_CAP = 12, BROADCAST_CAP = 8, LESSON_AGES = 8, DRIFT_YEARS = 60;
export const DEFAULT_DIAL = Object.freeze({id: 'gentle', adultAge: 18, mourningYears: 2, courtYears: 1, healYears: 3, quarrelPermille: 25, costScale: 1,
    reason: 'An ordinary village: griefs are real and small, quarrels mend, and nothing is lost for leaving a day unmarked.'});
const DIAL_KEYS = ['id', 'adultAge', 'mourningYears', 'courtYears', 'healYears', 'quarrelPermille', 'costScale', 'reason'];
export const CAUSE_LABELS = Object.freeze({age: 'old age', illness: 'a fever', mishap: 'a mishap', combat: 'a fight', harm: 'harm'});
const QUARRELS = ['a quarrel over the winter stores', 'a hard word about the children', 'a long silence after a bad harvest'];

// Choices per event kind. Cost is coins; every kind has a free, blameless option.
export const CHOICES = Object.freeze({
    orphan: [{id: 'take_in', label: 'Take them in', cost: 30, tip: 'A ward of yours: food and a bed for a season.'}, {id: 'find_kin', label: 'Ask after kin', cost: 5, tip: 'A grown sibling takes them if one lives; otherwise the Village raises them.'}, {id: 'village', label: 'Leave it to the Village', cost: 0, tip: 'The Village raises them.'}],
    grief: [{id: 'vigil', label: 'Sit the vigil', cost: 3, tip: 'Candles and company: mourning ends a year sooner.'}, {id: 'word', label: 'Send a kind word', cost: 0, tip: 'No cost.'}, {id: 'space', label: 'Give them room', cost: 0, tip: 'No cost; mourning fades in its own time.'}],
    age: [{id: 'mark', label: 'Mark the day', cost: 5, tip: 'A small gift.'}, {id: 'advice', label: 'Offer a word of advice', cost: 0, tip: 'No cost.'}, {id: 'pass', label: 'Let it pass', cost: 0, tip: 'No cost.'}],
    stage: [{id: 'note', label: 'Take note', cost: 0, tip: 'No cost.'}],
});
const hash = s => fnv1a(2166136261, s);
const coins = (dial, c) => Math.round(c * dial.costScale);
export const freshEvents = () => ({schema: 1, lastYear: null, seen: [], events: [], bonds: {}, mourning: {}, wards: {}, memories: {}, lessons: {}, playerStage: null, dial: {...DEFAULT_DIAL}});

export function validateEvents(s) {
    check(object(s) && s.schema === 1 && (s.lastYear === null || natural(s.lastYear)), 'Invalid life events.');
    check(Array.isArray(s.seen) && s.seen.length <= SEEN_CAP && s.seen.every(i => typeof i === 'string' && i.length <= 80), 'Invalid life-event record.');
    check(Array.isArray(s.events) && s.events.length <= EVENT_CAP, 'Invalid life-event list.');
    const ids = new Set();
    for(const e of s.events) {
        check(object(e) && typeof e.id === 'string' && !ids.has(e.id) && Object.hasOwn(CHOICES, e.kind) && natural(e.year) && typeof e.who === 'string' && typeof e.text === 'string' && e.text.length <= 200 &&
            (e.status === 'open' && e.choice === null || e.status === 'done' && CHOICES[e.kind].some(c => c.id === e.choice)), 'Invalid life event.');
        ids.add(e.id);
    }
    check(object(s.bonds) && Object.entries(s.bonds).every(([k, b]) => /^[a-z][a-z0-9_]*\|[a-z][a-z0-9_]*$/.test(k) && ['courting', 'married', 'estranged'].includes(b.status) && natural(b.since) && (b.restore === undefined || ['scripted', 'courted'].includes(b.restore))), 'Invalid bond.');
    check(object(s.mourning) && Object.values(s.mourning).every(natural) && object(s.wards) && Object.values(s.wards).every(w => object(w) && natural(w.since) && typeof w.by === 'string'), 'Invalid mourning or ward.');
    check(object(s.memories) && Object.values(s.memories).every(l => Array.isArray(l) && l.length <= MEMORY_CAP && l.every(m => typeof m.id === 'string' && natural(m.at) && typeof m.text === 'string' && m.text.length <= 200)), 'Invalid household memories.');
    check(object(s.lessons) && Object.entries(s.lessons).every(([k, l]) => Object.hasOwn(CAUSE_LABELS, k) && natural(l.n) && Array.isArray(l.ages) && l.ages.length <= LESSON_AGES && l.ages.every(natural)), 'Invalid death lessons.');
    check(s.playerStage === null || object(s.playerStage) && natural(s.playerStage.key) && ['youth', 'adult', 'elder'].includes(s.playerStage.stage), 'Invalid player stage.');
    check(object(s.dial) && Object.keys(s.dial).every(k => DIAL_KEYS.includes(k)) && natural(s.dial.adultAge) && s.dial.adultAge >= 8 && natural(s.dial.mourningYears) && natural(s.dial.courtYears) && natural(s.dial.healYears) &&
        natural(s.dial.quarrelPermille) && s.dial.quarrelPermille <= 1000 && s.dial.costScale >= 0 && s.dial.costScale <= 10 && typeof s.dial.reason === 'string' && s.dial.reason.length > 0, 'Invalid life-event dial.');
    return s;
}
export const migrateEvents = slice => slice == null ? freshEvents() : validateEvents(structuredClone(slice));
export const isFresh = s => s.lastYear === null && !s.events.length;

// G06: one fact into several memories at once. Capped on recipients per broadcast and on memories per person; the
// same fact id is never written twice to one person. Returns the state and the people who actually gained it.
export function broadcast(state, fact, recipients, at) {
    check(typeof fact.id === 'string' && typeof fact.text === 'string' && natural(at), 'Invalid broadcast.');
    const next = structuredClone(state), heard = [];
    for(const id of [...new Set(recipients)].slice(0, BROADCAST_CAP)) {
        const list = next.memories[id] ?? (next.memories[id] = []);
        if(list.some(m => m.id === fact.id)) continue;
        list.push({id: fact.id, at, text: fact.text.slice(0, 200)});
        if(list.length > MEMORY_CAP) list.splice(0, list.length - MEMORY_CAP);
        heard.push(id);
    }
    return {state: next, heard};
}

const known = (lives, year) => lives.people.filter(p => p.joinedYear <= year);
const aliveAt = (p, y) => y < p.deathYear;
const related = (p, q) => p.parents.includes(q.id) || q.parents.includes(p.id) || p.parents.some(id => q.parents.includes(id));
const reserved = (lives, p) => lives.people.some(q => q.spouseId === p.id);
const addSeen = (s, id) => {s.seen.push(id);if(s.seen.length > SEEN_CAP) s.seen.splice(0, s.seen.length - SEEN_CAP);};

// One catch-up over (lastYear, year]. A missing or new slice takes the present as its baseline: nothing already
// past becomes a retroactive grief (old saves, heirs). Returns the new state plus what the domain must publish.
export function scan(state, lives, year, {stage = null, lifeKey = null, playerEnded = false, playerAge = null} = {}) {
    const s = structuredClone(state), notes = [], deaths = [], dial = s.dial;
    const from = s.lastYear ?? year, people = known(lives, year);
    const say = (ids, fact, y) => {const r = broadcast(s, fact, ids, y * 360 * 24 * 60);Object.assign(s, r.state);};
    const heardAt = y => people.filter(p => aliveAt(p, y) && p.joinedYear <= y).map(p => p.id);
    const items = [];
    if(s.lastYear !== null) {
        for(const p of lives.people) {
            if(p.deathYear > from && p.deathYear <= year && p.joinedYear <= p.deathYear) items.push({y: p.deathYear, t: 0, type: 'death', p});
            const coming = p.birthYear + dial.adultAge;
            if(coming > from && coming <= year && coming >= p.joinedYear && p.deathYear > coming) items.push({y: coming, t: 1, type: 'age', p});
        }
        items.sort((a, b) => a.y - b.y || a.t - b.t || a.p.id.localeCompare(b.p.id));
    } else for(const p of lives.people) {
        if(p.deathYear <= year) addSeen(s, `death:${p.id}`);
        if(p.birthYear + dial.adultAge <= year) addSeen(s, `age:${p.id}`);
    }
    const open = (id, kind, y, who, text) => {
        if(s.seen.includes(id)) return false;
        addSeen(s, id);s.events.push({id, kind, year: y, who, text, status: 'open', choice: null});return true;
    };
    for(const it of items) {
        const p = it.p, y = it.y;
        if(it.type === 'age') {
            if(open(`age:${p.id}`, 'age', y, p.id, `${p.name} comes of age.`)) notes.push(`${p.name} has come of age.`);
            continue;
        }
        if(s.seen.includes(`death:${p.id}`)) continue;
        addSeen(s, `death:${p.id}`);
        const cause = p.cause ?? 'age', age = p.deathYear - p.birthYear, lesson = s.lessons[cause] ?? (s.lessons[cause] = {n: 0, ages: []});
        lesson.n += 1;lesson.ages = [...lesson.ages, age].slice(-LESSON_AGES);
        deaths.push({id: p.id, kind: cause, age});
        notes.push(`${p.name} has died of ${CAUSE_LABELS[cause] ?? cause}, aged ${age}.`);
        const mourn = id => {s.mourning[id] = Math.max(s.mourning[id] ?? 0, y + dial.mourningYears);};
        const survivor = p.spouseId && people.find(q => q.id === p.spouseId && aliveAt(q, y));
        if(survivor && open(`grief:${survivor.id}:${p.id}`, 'grief', y, survivor.id, `${survivor.name} has lost ${p.name}.`)) mourn(survivor.id);
        for(const k of people.filter(q => q.parents.includes(p.id) && aliveAt(q, y))) {
            const minor = y - k.birthYear < dial.adultAge, orphaned = k.parents.every(id => { const par = lives.people.find(q => q.id === id); return par && !aliveAt(par, y); });
            if(minor && orphaned) {if(open(`orphan:${k.id}`, 'orphan', y, k.id, `${k.name} is left without parents at ${y - k.birthYear}.`)) mourn(k.id);}
            else if(!minor && open(`grief:${k.id}:${p.id}`, 'grief', y, k.id, `${k.name} mourns ${p.name}.`)) mourn(k.id);
        }
        say(heardAt(y).filter(id => id !== p.id), {id: `death:${p.id}`, text: `${p.name} died of ${CAUSE_LABELS[cause] ?? cause}, aged ${age}.`}, y);
    }
    // The player's own stage and end. Heirs and old saves baseline silently on the first sight of a life.
    if(lifeKey !== null) {
        if(s.playerStage?.key !== lifeKey) s.playerStage = {key: lifeKey, stage: stage ?? 'adult'};
        else if(stage && stage !== s.playerStage.stage) {
            const text = stage === 'adult' ? 'Your youth is behind you.' : 'You are counted among the elders now.';
            if(open(`stage:${lifeKey}:${stage}`, 'stage', year, 'player', text)) notes.push(text);
            s.playerStage.stage = stage;
        }
        if(playerEnded && !s.seen.includes(`death:player:${lifeKey}`)) {
            addSeen(s, `death:player:${lifeKey}`);
            const lesson = s.lessons.age ?? (s.lessons.age = {n: 0, ages: []});
            lesson.n += 1;if(playerAge !== null) lesson.ages = [...lesson.ages, Math.floor(playerAge)].slice(-LESSON_AGES);
            deaths.push({id: 'player', kind: 'age', age: playerAge === null ? null : Math.floor(playerAge)});
        }
    }
    // Bonds: courting ripens, quarrels come and mend by themselves; mourning fades. All yearly and forgiving.
    for(let y = Math.max(from + 1, year - DRIFT_YEARS + 1); s.lastYear !== null && y <= year; y++) {
        for(const row of bondStatuses(lives, s.bonds, y)) {
            const b = s.bonds[row.key];
            if(row.status === 'courting' && b && y >= b.since + dial.courtYears) {
                s.bonds[row.key] = {status: 'married', since: y};notes.push(`${nameOf(lives, row.a)} and ${nameOf(lives, row.b)} are married.`);
                say(heardAt(y), {id: `wed:${row.key}`, text: `${nameOf(lives, row.a)} and ${nameOf(lives, row.b)} married.`}, y);
            } else if(row.status === 'married' && hash(`${lives.seed}:${row.key}:${y}`) % 1000 < dial.quarrelPermille) {
                const scripted = lives.people.some(p => p.spouseId && pairKey(p.id, p.spouseId) === row.key), why = QUARRELS[hash(`why:${row.key}:${y}`) % QUARRELS.length];
                s.bonds[row.key] = {status: 'estranged', since: y, restore: scripted ? 'scripted' : 'courted', why};
                notes.push(`${nameOf(lives, row.a)} and ${nameOf(lives, row.b)} are estranged after ${why}.`);
            } else if(row.status === 'estranged' && b && y >= b.since + dial.healYears) {
                restoreBond(s, row.key, y);notes.push(`${nameOf(lives, row.a)} and ${nameOf(lives, row.b)} have made it up.`);
            }
        }
    }
    for(const [id, until] of Object.entries(s.mourning)) if(until <= year) delete s.mourning[id];
    if(s.events.length > EVENT_CAP) {
        const keep = s.events.filter(e => e.status === 'open'), done = s.events.filter(e => e.status === 'done');
        s.events = [...done.slice(-Math.max(0, EVENT_CAP - keep.length)), ...keep].slice(-EVENT_CAP).sort((a, b) => a.year - b.year);
    }
    s.lastYear = year;
    return {state: validateEvents(s), notes, deaths};
}
const nameOf = (lives, id) => lives.people.find(p => p.id === id)?.name ?? id;
function restoreBond(s, key, y) {
    if(s.bonds[key].restore === 'scripted') delete s.bonds[key];
    else s.bonds[key] = {status: 'married', since: y};
}

// Resolve one open event with one choice. Returns the new state, the cost, and a log line. Costs scale with the dial.
export function resolve(state, lives, year, eventId, choiceId, money) {
    const e = state.events.find(x => x.id === eventId);
    check(e && e.status === 'open', 'That moment has passed.');
    const choice = CHOICES[e.kind].find(c => c.id === choiceId);
    check(choice, 'That is not a choice here.');
    const cost = coins(state.dial, choice.cost);
    check(money >= cost, `That costs ${cost} coins.`);
    let s = structuredClone(state);
    const ev = s.events.find(x => x.id === eventId);ev.status = 'done';ev.choice = choiceId;
    const who = nameOf(lives, e.who), at = year * 360 * 24 * 60;
    const heard = known(lives, year).filter(p => aliveAt(p, year) && p.id !== e.who).map(p => p.id);
    let line = '', fact = null;
    if(e.kind === 'orphan') {
        const k = lives.people.find(p => p.id === e.who);
        if(choiceId === 'take_in') {s.wards[e.who] = {by: 'player', since: year};line = `${who} comes to stay with you.`;}
        else if(choiceId === 'find_kin') {
            const kin = known(lives, year).find(p => p.id !== e.who && aliveAt(p, year) && year - p.birthYear >= s.dial.adultAge && p.parents.some(id => k.parents.includes(id)));
            s.wards[e.who] = kin ? {by: kin.id, since: year} : {by: 'village', since: year};line = kin ? `${kin.name} takes ${who} in.` : `The Village raises ${who}.`;
        } else {s.wards[e.who] = {by: 'village', since: year};line = `The Village raises ${who}.`;}
        fact = {id: `ward:${e.who}`, text: `${who} was left without parents (${line.replace(/\.$/, '').toLowerCase()}).`};
    } else if(e.kind === 'grief') {
        if(choiceId === 'vigil') s.mourning[e.who] = Math.min(s.mourning[e.who] ?? year, year + Math.max(0, s.dial.mourningYears - 1));
        line = choiceId === 'vigil' ? `You sit with ${who}. The grief eases a little sooner.` : choiceId === 'word' ? `You send ${who} a kind word.` : `You give ${who} room.`;
        if(choiceId !== 'space') fact = {id: `comfort:${e.id}`, text: `The player ${choiceId === 'vigil' ? 'sat the vigil with' : 'sent a kind word to'} ${who}.`};
    } else if(e.kind === 'age') {
        line = choiceId === 'mark' ? `You mark the day for ${who}.` : choiceId === 'advice' ? `You offer ${who} a word of advice.` : `${who}'s day passes quietly.`;
        if(choiceId !== 'pass') fact = {id: `grown:${e.who}`, text: `${who} came of age; the player ${choiceId === 'mark' ? 'marked the day' : 'gave advice'}.`};
    } else line = 'You take note of the years.';
    if(fact) s = broadcast(s, fact, heard, at).state;
    return {state: validateEvents(s), cost, line};
}

// ----- relationship overlay actions (G03) -----
export function introduceCandidates(state, lives, year) {
    const a = known(lives, year).filter(p => aliveAt(p, year) && year - p.birthYear >= state.dial.adultAge && !p.spouseId && !reserved(lives, p) && !(state.mourning[p.id] > year));
    const busy = new Set(Object.keys(state.bonds).flatMap(k => k.split('|'))), out = [];
    for(let i = 0; i < a.length; i++) for(let j = i + 1; j < a.length; j++)
        if(!busy.has(a[i].id) && !busy.has(a[j].id) && !related(a[i], a[j])) out.push({a: a[i].id, b: a[j].id, names: `${a[i].name} and ${a[j].name}`});
    return out.slice(0, 6);
}
export const COSTS = Object.freeze({introduce: 5, mend: 10});
export function bondAction(state, lives, year, action, a, b, money) {
    const key = pairKey(a, b), s = structuredClone(state), cost = coins(s.dial, COSTS[action] ?? 0), bond = s.bonds[key];
    check(money >= cost, `That costs ${cost} coins.`);
    if(action === 'introduce') {
        check(introduceCandidates(state, lives, year).some(c => pairKey(c.a, c.b) === key), 'They cannot be introduced just now.');
        s.bonds[key] = {status: 'courting', since: year};
        return {state: validateEvents(broadcast(s, {id: `court:${key}:${year}`, text: `${nameOf(lives, a)} and ${nameOf(lives, b)} began courting.`}, known(lives, year).filter(p => aliveAt(p, year)).map(p => p.id), year * 360 * 24 * 60).state), cost, line: `You introduce ${nameOf(lives, a)} and ${nameOf(lives, b)}.`};
    }
    if(action === 'mend') {
        check(bond?.status === 'estranged', 'They are not estranged.');
        restoreBond(s, key, year);
        return {state: validateEvents(s), cost, line: `You speak for both; ${nameOf(lives, a)} and ${nameOf(lives, b)} make it up.`};
    }
    check(action === 'part' && (bond?.status === 'courting' || bond?.status === 'estranged' && bond.restore === 'courted'), 'Nothing to end.');
    delete s.bonds[key];
    return {state: validateEvents(s), cost: 0, line: `${nameOf(lives, a)} and ${nameOf(lives, b)} part kindly.`};
}

// ----- read side -----
// AD9: lessons only count deaths seen since this slice began; the forecast is the range of ages actually witnessed.
export function deathForecast(state) {
    return Object.entries(state.lessons).filter(([, l]) => l.n > 0).map(([cause, l]) => {
        const lo = Math.min(...l.ages), hi = Math.max(...l.ages), label = CAUSE_LABELS[cause] ?? cause;
        return {cause, n: l.n, ages: l.ages, text: l.ages.length
            ? `${label[0].toUpperCase()}${label.slice(1)} has taken ${l.n} you knew${lo === hi ? `, at ${lo}` : `, between ${lo} and ${hi}`}. ${cause === 'age' ? 'Company and care slow the later years.' : 'Watch the household in the same season.'}`
            : `${label[0].toUpperCase()}${label.slice(1)} has taken ${l.n} you knew.`};
    });
}
export function eventsView(state, lives, year) {
    const nm = id => id === 'player' ? 'You' : nameOf(lives, id), statusRows = bondStatuses(lives, state.bonds, year);
    return {
        open: state.events.filter(e => e.status === 'open').map(e => ({...e, name: nm(e.who), choices: CHOICES[e.kind].map(c => ({id: c.id, label: c.label, tip: c.tip, cost: coins(state.dial, c.cost)}))})),
        done: state.events.filter(e => e.status === 'done').slice(-5).reverse().map(e => ({id: e.id, text: e.text, choice: CHOICES[e.kind].find(c => c.id === e.choice).label})),
        mourning: Object.entries(state.mourning).filter(([, u]) => u > year).map(([id, until]) => ({id, name: nm(id), until})),
        wards: Object.entries(state.wards).map(([id, w]) => ({id, name: nm(id), by: w.by === 'player' ? 'you' : w.by === 'village' ? 'the Village' : nm(w.by)})),
        bonds: statusRows.map(r => ({...r, names: `${nm(r.a)} and ${nm(r.b)}`, why: state.bonds[r.key]?.why ?? null, actions: r.status === 'estranged' ? ['mend'].concat(state.bonds[r.key]?.restore === 'courted' ? ['part'] : []) : r.status === 'courting' ? ['part'] : []})),
        candidates: introduceCandidates(state, lives, year), forecast: deathForecast(state), dial: state.dial,
        memories: Object.entries(state.memories).map(([id, list]) => ({id, name: nm(id), last: list.at(-1)?.text ?? '', count: list.length})),
        costs: {introduce: coins(state.dial, COSTS.introduce), mend: coins(state.dial, COSTS.mend)}};
}
