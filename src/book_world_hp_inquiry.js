// W11-C consumer: Harry's library study (inquiry@1, src/inquiry.js). Two authored topics tied to his two first lessons. A session is
// an hour in the school library (the inquiry domain's `work` command spends the minutes through the chronicle clock); the
// evidence side counts what he has done in class, read from the world's own state, so reading alone cannot finish a topic.
// When it is done the output fact lands once in the player's knowledge (stage 'understood'); book_world_hp_lessons.js turns that
// fact into the practice bonus (HP_STUDY, dial and reason there). Nothing here is saved; the record is the inquiry slice.
// Authored proposals (AD32), not canon text: the topic answers are plain paraphrase-level craft notes, no secrets.
// Missing, named: the library is not a location (Harry studies from the Great Hall's place, which every school act uses), and it
// has no opening hours beyond "in term"; the bonus and the sessions are dials, not source numbers.
import {registerInquiry} from './inquiry.js';
import {HP_STUDY, hpLibraryReason} from './book_world_hp_lessons.js';
import {HP_LEVITATION} from './world_packs/book_hp_lead_life_data.js';

const SESSION = 60;
// Dials with reasons: three hours of reading per topic (a first-year text is short), and class evidence alongside it: the first
// Charms class plus two tries (3), or two Potions classes (Alchemy xp stands for classes, about 5 a class, see evidence below).
const TOPICS = [
    {topic: 'charms', label: 'the levitation charm', question: 'Why does the levitation charm work when I do it right?', need: {minutes: 180, evidence: 3},
        value: 'You read how the charm is built and what you saw in class makes sense: the swish and flick set the lift, and the word matters more than force, so a steady wrist beats a hard wave.',
        risk: 'A wrong idea of the motion costs you class tries and the feather stays put.',
        evidence: state => { const p = state?.simulation?.powers?.player?.[HP_LEVITATION]; return (p?.owned ? 1 : 0) + (p?.mastery ?? 0); }},
    {topic: 'potions', label: 'first-year potion ingredients', question: 'What do the plain first-year ingredients do, and in what order do they go in?', need: {minutes: 180, evidence: 2},
        value: 'You read what each plain ingredient is for and why the order and the heat matter: a draught spoils from rushing the steps, not from a missing rare part.',
        risk: 'Reading the steps wrong costs a spoiled draught and a point off your master\'s regard.',
        // The Alchemy skill is the only record of classes (no second counter): a class is worth 5 or 2 xp, so round up by 5.
        evidence: (_state, plan) => Math.ceil(Math.max(0, plan?.gameplay?.player?.skills?.Alchemy?.xp ?? 0) / 5)}];

export const HP_STUDY_TOPICS = Object.freeze(TOPICS.map(t => registerInquiry({
    id: HP_STUDY[t.topic].inquiry, question: t.question, method: 'read',
    sources: [{kind: 'book', id: `hp.lead.library.${t.topic}`, coverage: `a first-year text on ${t.label} (authored)`}, {kind: 'lesson', id: `hp.lead.lesson.${t.topic}`, coverage: 'what you have done in class'}],
    need: t.need, risk: t.risk, session: {minutes: SESSION},
    outputs: [{key: HP_STUDY[t.topic].key, stage: 'understood', value: t.value}],
    gate: state => hpLibraryReason(state), evidence: t.evidence})).map(d => Object.freeze({topic: d.id.split('.').pop(), id: d.id, label: TOPICS.find(t => d.id.endsWith(t.topic)).label})));

// Panel read model and starts, through the inquiry domain's commands (the panel never touches the slice or the clock itself).
const ask = (registry, name) => registry.command('inquiry', name);
export function hpStudyRows(registry) {
    return HP_STUDY_TOPICS.map(t => {
        let q; try { q = ask(registry, 'quote')({id: t.id}); } catch { return null; }
        return {id: t.id, topic: t.topic, label: `Study ${t.label} in the library · ${q.minutes} min`, eligible: q.eligible, reason: q.reason, done: q.done, progress: q.partial,
            question: q.question, canNote: q.done};
    }).filter(Boolean);
}
export const hpStudyStart = (registry, id) => { if(!HP_STUDY_TOPICS.some(t => t.id === id)) throw Error('That is not a library topic.'); return ask(registry, 'work')({id}); };
export const hpStudyWriteNote = (registry, id) => { if(!HP_STUDY_TOPICS.some(t => t.id === id)) throw Error('That is not a library topic.'); return ask(registry, 'writeNote')({id}); };
