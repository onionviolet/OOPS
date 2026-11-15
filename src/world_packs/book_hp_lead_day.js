// Harry's ordinary school week as a command extension (lead core-flow audit, loop H1 on the shared day shape PS5; proposal under AD32,
// ACR1, ACR6, ACR8). An extension on his own life, pinned to whatever hash the registered life has (as the Charms practice bench is),
// so no identity alias moves and an old save adopts it like any continuation. The day: go to the class the timetable has now (on time,
// a quarter hour's grace) and write that subject's homework in an evening hour. Both counts feed the June paper of that subject
// (book_world_hp_exams.js reads them), which is the longer loop. Timetable, facts and dials: book_world_hp_day.js.
import {extensionFact} from '../structured_pack_extensions.js';
import {HP_LEAD_DAY, HP_TIMETABLE, HP_DAY_DIALS as K, HP_NOTES_ITEM, HP_MARKED_ITEM, hpDayFact, hpTimetableWords} from '../book_world_hp_day.js';

const P = 'book.hp.lead', WORLD = `${P}.world`, HALL = `${P}.school_hall`;
const local = name => `${HP_LEAD_DAY}.${name}`;
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const alive = eq('actor.life', 'alive');
const admitted = eq(extensionFact(HP_LEAD_DAY), true);
const school = eq('actor.hp.lead.atSchool', true, 'Lessons are at Hogwarts.');
const sorted = eq(`completed.${P}.sorting`, true, 'You are sorted into a house first.');
const note = (key, value) => ({type: 'knowledge', actor: 'player', key, stage: 'understood', value, basis: {kind: 'observation', attributedTo: 'player', situationId: `${P}.situation`}});
const gain = id => ({type: 'item', actor: 'player', key: JSON.stringify({id}), amount: 1});
const cap = t => t[0].toUpperCase() + t.slice(1);
function act(name, label, duration, description, effects, needs) {
    const support = {all: [alive, admitted, school]};
    return {id: local(name), revision: 1, label, description, group: 'structured_local', worldId: WORLD, actorId: 'player', location: HALL,
        audience: ['$actor'], once: false, duration, costs: [], visibleWhen: admitted, requires: {all: [support, ...needs]},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund', cancellation: 'refund', reservationReturns: 1, effects};
}
const lesson = row => act(`attend_${row.id}`, `Go to ${row.label} · ${K.lessonMinutes.value / 60} h`, K.lessonMinutes.value,
    `${cap(row.teacher)} teaches it in ${row.room}, ${hpTimetableWords(row)}. ${row.basis} Each class leaves you a set of notes, and the June paper goes by what you have.`,
    [gain(HP_NOTES_ITEM(row.id)), note(local('last_lesson'), `${row.label}: ${row.lesson}`)],
    [eq(hpDayFact(row.id, 'startable'), true, `${row.label} is taught ${hpTimetableWords(row)} in term; come within a quarter of an hour of the start.`)]);
const homework = row => act(`homework_${row.id}`, `Write your ${row.label} homework · ${K.homeworkMinutes.value / 60} h`, K.homeworkMinutes.value,
    `One piece is set at each class. ${K.homeworkMinutes.why} It comes back marked, and the marked pieces you keep count towards the June paper alongside your notes.`,
    [gain(HP_MARKED_ITEM(row.id)), note(local('last_homework'), `${row.label}: ${row.homework}`)],
    [eq(hpDayFact(row.id, 'owed'), true, `No ${row.label} homework is waiting; it is set at the next class.`)]);

// What a class and a piece of homework leave him; also listed by his holdings reader (book_world_hp_lead_domain.js).
export const HP_LEAD_DAY_ITEMS = Object.freeze(HP_TIMETABLE.flatMap(r => [
    {id: HP_NOTES_ITEM(r.id), label: `${r.label} class notes`, description: `Your notes from one ${r.label} class. You revise from them in June.`, value: 0},
    {id: HP_MARKED_ITEM(r.id), label: `${r.label} homework · marked`, description: `A piece of ${r.label} homework, marked and handed back.`, value: 0}]));
export const HP_LEAD_DAY_COMMANDS = Object.freeze(HP_TIMETABLE.flatMap(row => [lesson(row), homework(row)]));
export function hpLeadDayExtension(base) {
    return {
        schema: 1, id: HP_LEAD_DAY, revision: 1,
        base: {id: base.id, revision: base.revision, contentHash: base.contentHash},
        label: 'Keep your school week: the timetable and its homework',
        description: `Charms and Potions are on Monday mornings. The rest of the week: ${HP_TIMETABLE.map(r => `${r.label}, ${hpTimetableWords(r)}`).join('. ')}. Go on time and write the homework; both count in June.`,
        requires: {all: [alive, school, sorted]}, reason: 'Arrive at Hogwarts and be sorted first.',
        items: HP_LEAD_DAY_ITEMS.map(i => ({...i})),
        status: [{id: local('lesson_status'), label: 'Last class', knowledgeKey: local('last_lesson')}, {id: local('homework_status'), label: 'Last homework', knowledgeKey: local('last_homework')}],
        commands: HP_LEAD_DAY_COMMANDS
    };
}
