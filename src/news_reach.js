// News that travels (FRC news, proposal under AD56; KNW17, KNW18, STN3, TIE16). World-neutral and pure; saves nothing.
// The spreader stays gossipStep (person_memory_effects.js): one telling per holder per day, to people in the same place who
// hold a tie, losing certainty by temperament. This module is that step's world table and its readers:
//   - real ties the edge store does not hold (a pack's colleague, superior or kin lines) count as contact for telling;
//   - the world's telling numbers (loss, rate, hearsay trust; only these, reads keep the store's table) are its distortion dial, and a drift table can bend what is said;
//   - an audience's reaction to what reached it (a mood row, a reputation report) is read from its own memory, never from truth.
// Adapted from the bank (CK3 secrets: an account is known by a set of holders and spreads by contact; DF: rumours carry the teller
// and lose precision). The bank's CK3 snapshot is not on disk and DF rumour truth is unread, so the shapes are our own:
// no "known by" list (each holder's memory is the list), no exposure roll (telling is gossipStep's daily draw).
import {readMemories, vividness} from './person_memory.js';
import {payload} from './person_episode.js';
import {topicPhrase} from './person_memory_effects.js';
import {memoryLimits, MEMORY_LIMITS} from './person_temperament.js';
import {checkKey} from './check_keys.js';
import {drawFraction, compareCodePoints} from './gen_kit.js';
import {bandOf} from './mood_thoughts.js';

const worlds = new Map();
const idOk = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);
// decl: {worldId, limits?, ties(state) -> [{holder, other, kind}], contactWeight?, drift?: {topic: {to, chance, feeling?}},
//        reaction?: {magnitude, days}, nameOf?(id) -> string}
// Defaults with dials and reasons:
//   contactWeight 1: one real tie is enough contact for telling (gossipStep needs a bond of at least 1). Dial per world.
//     Reason: colleagues and kin talk; a tie the book states is a channel even before the player has changed it.
//   drift chance per retelling (0..1), scaled by the teller's slant (unreliable tellers bend more). Dial per world and topic.
//     Reason: KNW18, rumour is the interesting case; a world of careful clerks bends little.
//   reaction.magnitude 4 for a clear account (certainty 100), scaled by certainty; reaction.days 7. Reason: hearsay moves a
//     person less than seeing it (toldWeight 0.5), and a week-old story stops colouring today's manner.
export function registerNewsWorld(decl) {
    if(!decl || !idOk(decl.worldId) || typeof decl.ties !== 'function') throw Error('News needs a world and its ties reader.');
    const limits = decl.limits ? memoryLimits(decl.worldId, {[decl.worldId]: decl.limits}) : MEMORY_LIMITS;
    for(const [topic, d] of Object.entries(decl.drift || {}))
        if(!/^[a-z][a-z0-9_]*$/.test(topic) || !/^[a-z][a-z0-9_]*$/.test(d?.to) || !(d.chance >= 0 && d.chance <= 1) || d.feeling != null && !Number.isFinite(d.feeling)) throw Error(`Invalid drift for ${topic}.`);
    const reaction = {magnitude: 4, days: 7, ...(decl.reaction || {})};
    if(!Number.isSafeInteger(reaction.magnitude) || reaction.magnitude <= 0 || !Number.isSafeInteger(reaction.days) || reaction.days <= 0) throw Error('News reaction needs a positive magnitude and days.');
    const w = Object.freeze({worldId: decl.worldId, limits, ties: decl.ties, contactWeight: decl.contactWeight ?? 1, drift: Object.freeze({...(decl.drift || {})}),
        reaction: Object.freeze(reaction), nameOf: decl.nameOf || (id => id)});
    worlds.set(decl.worldId, w);
    return w;
}
export const newsWorld = worldId => worlds.get(worldId) || null;
export const contactAxis = kind => `contact.${String(kind).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'tie'}`;

// Ports for gossipStep over one plan state. Ties are read once per call; both directions count (people talk both ways).
export function newsPorts(state) {
    const actors = state?.actors || {}, contacts = new Map();
    const worldOf = id => newsWorld(actors[id]?.worldId);
    const edges = worldId => {
        if(contacts.has(worldId)) return contacts.get(worldId);
        const w = newsWorld(worldId), map = new Map();
        let rows = [];
        try { rows = w ? w.ties(state) || [] : []; } catch { rows = []; }
        for(const {holder, other, kind} of rows) for(const [a, b] of [[holder, other], [other, holder]]) {
            if(!idOk(a) || !idOk(b) || a === b) continue;
            const row = map.get(a) || new Map(); map.set(a, row);
            row.set(b, {...(row.get(b) || {}), [contactAxis(kind)]: w.contactWeight});
        }
        contacts.set(worldId, map);
        return map;
    };
    return {
        contactsOf: (holder, other) => { const w = worldOf(holder); return w ? edges(w.worldId).get(holder)?.get(other) || {} : {}; },
        limitsOf: worldId => newsWorld(worldId)?.limits || null,
        drift: ({row, holder, listener, day, root}) => {
            const w = worldOf(holder), topic = payload(row)?.topic, d = topic && w?.drift[topic];
            if(!d || !d.chance) return null;
            const key = checkKey({subject: holder, method: 'news.drift@1', period: {day}, targetState: {fact: row.fact, listener}});
            return drawFraction(root, key) < d.chance ? {topic: d.to, feeling: d.feeling ?? 1} : null;
        },
    };
}

// What a holder heard about a subject (`limits` is the store's own table, not a world's telling numbers): accounts with a teller (KNW4: an account keeps its speaker), newest first. Never truth.
export function heardAbout({memory, holder, subject = 'player', day, limits = MEMORY_LIMITS}) {
    if(!memory || !Number.isSafeInteger(day)) return [];
    return readMemories(memory, holder, day, {limits})
        .filter(e => e.about === subject && e.source?.teller && payload(e) && vividness(e, day, undefined, limits) > 0)
        .map(e => ({teller: e.source.teller, topic: payload(e).topic, phrase: topicPhrase(payload(e).topic, e.kind), certainty: e.certainty, feeling: e.feeling, day: e.day, fact: e.fact}))
        .sort((a, b) => b.day - a.day || compareCodePoints(a.fact, b.fact));
}

// The audience's reaction now: one mood-shaped row per recent account, in the moodOf shape ({magnitude, line}), so a world can fold
// it into the mood reader its gates already use. Warm news warms, sour news sours; doubt (low certainty) moves less.
export function newsMoodRows({memory, holder, subject = 'player', day, worldId}) {
    const w = newsWorld(worldId);
    if(!w) return [];
    return heardAbout({memory, holder, subject, day}).filter(r => day - r.day < w.reaction.days && r.feeling && r.phrase).map(r => ({
        source: `news.${r.topic}`, magnitude: Math.sign(r.feeling) * Math.max(1, Math.round(w.reaction.magnitude * r.certainty / 100)),
        line: `heard from ${w.nameOf(r.teller)} that ${r.phrase}`, teller: r.teller, day: r.day}));
}

// Reputation reports (reputation_view.js shape) for audiences the viewer knows: what reached each one, labelled as heard.
// observed:true because the viewer reads it from the audience's own manner and words when they meet; the line never names
// a number or a truth the audience does not hold (KNW22).
export function newsReports({memory, worldId, day, audiences, subject = 'player'}) {
    const w = newsWorld(worldId);
    if(!w) return [];
    const out = [];
    for(const audienceId of audiences) {
        const r = heardAbout({memory, holder: audienceId, subject, day}).find(x => x.phrase);
        if(!r) continue;
        const doubt = r.certainty < 50 ? ' They do not seem sure of it.' : '';
        out.push({audienceId, subjectId: subject, label: w.nameOf(audienceId), heard: true, teller: r.teller, topic: r.topic,
            line: `from ${w.nameOf(r.teller)}, that ${r.phrase}.${doubt}`, evidence: `account from ${r.teller}`, observed: true});
    }
    return out;
}

// Seam for sightings (law by observation, fights, scenes): a witness who saw the subject do something becomes a holder of a
// `saw` episode through the ordinary memory path, which gossipStep then carries. The cause must start with a registered memory
// topic's prefix (registerMemoryTopic) so the account reads as what was seen. Pushes onto plan.memoryEffects; returns the row.
export function newsSighting(plan, {holder, subject = 'player', cause, axis = 'news.seen', amount}) {
    if(!plan || !idOk(holder) || !idOk(subject) || typeof cause !== 'string' || !cause || !Number.isSafeInteger(amount) || !amount) throw Error('A sighting needs a witness, a subject, a cause and a signed amount.');
    const row = {holder, subject, cause, axis, amount, clock: plan.state?.clock ?? 0};
    (plan.memoryEffects ||= []).push(row);
    return row;
}

// Fold news rows into a moodOf result ({total, band, rows}) without storing anything: the total is recomputed, the band uses the
// mood module's own edges, and each row keeps its line so the tie words can say what the person heard.
export function foldNewsMood(mood, rows) {
    if(!rows?.length) return mood;
    const all = [...(mood?.rows || []), ...rows.map(r => ({source: r.source, subject: 'player', line: r.line, value: r.magnitude}))]
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || (a.line < b.line ? -1 : 1));
    const total = Math.round(all.reduce((n, r) => n + r.value, 0));
    return {total, band: bandOf(total), rows: all};
}
