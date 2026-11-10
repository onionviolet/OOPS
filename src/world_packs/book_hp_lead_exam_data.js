// Harry's first-year exams as native commands (GTR14: an exam is a check whose risk is in its outcomes; GTR26: attempts are visible).
// Pure data over facts that book_world_hp_exams.js (hpExamFacts) computes; the model is src/hp_exam_model.js.
//   revise_<subject>  repeatable revision sessions between the Easter holidays and exam day; each adds one session to that subject
//                     (an actor resource) up to the cap, and costs stamina. The pack's own revision act credits two to every subject.
//   exam_<subject>    one paper each on exam day, in timetable order; its outcome is the band, rolled with the exact chances and saved
//                     as an actor fact, so a reload never rerolls and later practice never changes it (GTR12).
//   read_marks        on the last day of term: the saved bands become the overall verdict and the line the status row shows.
import {SUBJECT_IDS, EXAM_SUBJECTS, BANDS, BAND_WORDS, REVISION_CAP, REVISION_OPENS, EXAM_DAY} from '../hp_exam_model.js';
const P = 'book.hp.lead', alive = {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, {fact: 'native.ready', op: 'eq', value: true}]};
export const HP_EXAM_IDS = Object.freeze({revise: s => `${P}.revise_${s}`, paper: s => `${P}.exam_${s}`, marks: `${P}.read_marks`, resource: s => `${P}.revision.${s}`,
    resultKey: 'book.hp.lead.w11_finale.exam-result'});
const base = {revision: 1, group: 'structured_local', worldId: `${P}.world`, actorId: 'player', location: `${P}.school_hall`, audience: ['$actor'], costs: [],
    cancellation: 'refund', completionRequires: alive, completionCoLocated: true, completionFailure: 'refund'};
const fact = (key, op, value, reason) => ({fact: key, op, value, ...(reason ? {reason} : {})});
const note = (key, value) => ({type: 'knowledge', key: `${P}.${key}`, stage: 'understood', value});
export const HP_REVISE_STAMINA = 6;
export const hpLeadExamCommands = [
    ...EXAM_SUBJECTS.map(s => ({...base, id: HP_EXAM_IDS.revise(s.id), label: `Revise ${s.label} · 90 min`, duration: 90,
        costs: [{type: 'vital', key: 'stamina', amount: -HP_REVISE_STAMINA}],
        requires: {all: [...alive.all, fact('hp.lead.exam.revisionOpen', 'eq', true), fact(`hp.lead.exam.rev.${s.id}`, 'lte', REVISION_CAP - 1)],
            reason: `Revision runs from the Easter holidays until the exams begin, and ${s.label} stops gaining after ${REVISION_CAP} sessions: past that it is practice or a teacher.`},
        description: `Go over your ${s.label} notes. Each session helps the paper and steadies the result; it tires you (${HP_REVISE_STAMINA} stamina), and past ${REVISION_CAP} sessions the notes add nothing.`,
        effects: [{type: 'resource', actor: 'player', key: HP_EXAM_IDS.resource(s.id), amount: 1},
            note(`revision.${s.id}.last`, `You went over your ${s.label} notes until the order of things was clear.`)]})),
    ...EXAM_SUBJECTS.map((s, i) => ({...base, id: HP_EXAM_IDS.paper(s.id), label: `Sit the ${s.label} paper · 90 min`, duration: 90, once: true,
        requires: {all: [...alive.all, fact('hp.lead.exam.open', 'eq', true, `The papers are sat on ${'17 June'}, once the exam week begins.`),
            ...(i ? [fact(`completed.${HP_EXAM_IDS.paper(EXAM_SUBJECTS[i - 1].id)}`, 'eq', true, `Sit the ${EXAM_SUBJECTS[i - 1].label} paper first.`)] : [])]},
        description: `The ${s.label} paper, set by ${s.teacher}. Your practice and study this year and every revision session count; marks are read at the end of term.`,
        outcomes: BANDS.map(b => ({id: b, weight: {fact: `hp.lead.exam.p.${s.id}.${b}`},
            effects: [{type: 'fact', scope: 'actor', key: `hp.lead.exam.band.${s.id}`, value: b}, note(`exam.${s.id}.sat`, `You put down your quill on the ${s.label} paper. The marks are read at the end of term.`)]}))})),
    {...base, id: HP_EXAM_IDS.marks, label: 'Read your marks on the board · 10 min', duration: 10, once: true,
        requires: {all: [...alive.all, fact(`completed.${HP_EXAM_IDS.paper(SUBJECT_IDS.at(-1))}`, 'eq', true, 'Sit the exams first.'),
            fact('hp.lead.day', 'gte', 329, 'The marks go up on the board on the last day of term.')]},
        description: 'Every first year’s marks are pinned on the board in the common room. Read yours.',
        outcomes: BANDS.map(b => ({id: b, weight: {fact: `hp.lead.exam.overall.${b}`},
            effects: [{type: 'fact', scope: 'actor', key: 'hp.lead.exam.overall', value: b},
                {type: 'knowledge', key: HP_EXAM_IDS.resultKey, stage: 'seen', value: `Your marks: ${BAND_WORDS[b]} overall. The notes from each master are on the board beside them.`,
                    basis: {kind: 'observation', attributedTo: 'player', situationId: `${P}.situation`}}]}))}];
export const HP_EXAM_WINDOWS = Object.freeze({revisionOpens: REVISION_OPENS, examDay: EXAM_DAY});
