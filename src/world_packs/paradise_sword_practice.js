// Test Hall, local English MTL sid28 p14–70. One hour with Koshiro's image at
// the intermediate rate is sourced. The lesson's exact application to an
// opening cut and the sparring image are authored for this comparison.
import {beginContest, defineContestLaw, runContest, TICKS_PER_SECOND} from '../contest.js';
import {contestBody} from '../contest_bodies.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {trackLevel, trackThreshold, trackMax} from '../progression_path.js';
import {readQuantity} from '../world_substrate.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

const HALL = 'paradise.test_hall';
const SU_XIAO = 'su_xiao';
const TUTOR = 'koshiro_image';
const RIVAL = 'sparring_image';
const COINS = 'stock:paradise_coin';
const TIMING = 'paradise.read_opening';
const XP = 'paradise.sword_practice_xp';
const STUDY = 'paradise.opening_study';
const practiceTrack = {kind: 'table', values: [100, 200]};
const lessonXP = 100, sparXP = 25, studyXP = 75;
const cutTicks = [12, 7, 6];
const BOUTS = 'paradise.practice_bouts';
const LESSON = 'intermediate_lesson';
const FEE = 1000;
const MINUTES = 60;
const ROLES = {student: 'body', teacher: 'paradise.tutor'};
const BINDINGS = {student: 'student', teacher: 'teacher'};
const fullVitality = 30;

function atLesson({student, teacher}) {
    return student.place === HALL && teacher.place === HALL;
}

const practiceLaw = defineWorkingLaw({id: 'paradise.test_hall_lesson', revision: 1, operations: {
    enroll: {roles: ROLES, settle({bound}) {
        if (!atLesson(bound)) return {ok: false, reason: 'Meet Koshiro’s image in the Test Hall.'};
        const {student} = bound;
        if ((student.quantities[COINS] ?? 0) < FEE) return {ok: false, reason: 'The lesson costs 1,000 Paradise Coins.'};
        return {ok: true, costs: [{quantity: COINS, amount: FEE, payer: student.holder}]};
    }},
    practice: {roles: ROLES, settle({bound}) {
        if (!atLesson(bound)) return {ok: false, reason: 'The lesson ended before you finished practicing.'};
        return {ok: true, effects: [{op: 'property', holder: bound.student.holder, property: TIMING, value: true},
            {op: 'property', holder: bound.student.holder, property: XP, value: lessonXP}]};
    }},
}});
const method = {id: LESSON, revision: 1, law: practiceLaw.ref, roles: ROLES, steps: [
    {op: 'enroll', bindings: BINDINGS}, {op: 'practice', bindings: BINDINGS, minutes: MINUTES},
]};
const config = {packs: ['c.contest'], host: {laws: [practiceLaw]}, shared: {
    properties: [{id: TIMING, type: 'flag'}, {id: XP, type: 'level', min: 0, max: 1000000}], quantities: [WORLD_QUANTITIES.stock],
}};

const spar = defineContestLaw({id: 'c.paradise_opening', revision: 1, moves: {
    cut: {resolver: 'strike', steps: [cutTicks[0]], power: 8},
    read_and_cut: {resolver: 'strike', steps: [cutTicks[1]], power: 8},
    practiced_cut: {resolver: 'strike', steps: [cutTicks[2]], power: 8},
    return_cut: {resolver: 'strike', steps: [9], power: 8},
}});
const lessonRecord = engine => engine.records.workings[LESSON]?.record;
const student = engine => engine.world.holders[SU_XIAO];
const trainedBouts = engine => bouts(engine).filter(bout => bout.trained);
// Older completed lessons retain the first milestone and their settled drill.
const experience = engine => student(engine).properties[XP] ??
    (student(engine).properties[TIMING] === true ? lessonXP + trainedBouts(engine).length * sparXP : 0);
const level = engine => trackLevel(practiceTrack, experience(engine));
const studied = engine => student(engine).state[STUDY];
const award = (engine, amount) => ({op: 'property', holder: SU_XIAO, property: XP, value: experience(engine) + amount});
const bouts = engine => engine.world.holders[SU_XIAO].state[BOUTS] ?? [];

function fight(engine) {
    const skillLevel = level(engine);
    const trained = skillLevel > 0;
    // Reset the practice bodies for an equal first-touch drill. Contest lands
    // the strike on these bodies and the Test Hall retains the result.
    const ready = applyEngineOps(engine, [SU_XIAO, RIVAL].map(holder =>
        ({op: 'set', holder, quantity: 'vitality', amount: fullVitality})), 'paradise:prepare_drill');
    const entrants = [
        {id: SU_XIAO, body: SU_XIAO, side: 'student', profile: {attack: 28, evasion: 5}, moves: [['cut', 'read_and_cut', 'practiced_cut'][skillLevel]]},
        {id: RIVAL, body: RIVAL, side: 'opponent', profile: {attack: 28, evasion: 5}, moves: ['return_cut']},
    ];
    const bout = beginContest(spar, {id: 'opening_drill', seed: 2, place: HALL, entrants, limits: {landed: 1}}, ready.world);
    const {record, world} = runContest(spar, bout, ready.rules, ready.world);
    const hit = record.log.find(row => row.outcome === 'hit');
    const result = {trained, skillLevel, first: hit?.actor ?? null, seconds: hit ? hit.at / TICKS_PER_SECOND : null};
    return applyEngineOps({...ready, world}, [{op: 'state', holder: SU_XIAO, pack: BOUTS, value: [...bouts(engine), result]},
        ...(skillLevel === 1 ? [award(engine, sparXP)] : [])],
        'paradise:opening_drill_result');
}

function create() {
    return createEngineWorld({...config, holders: [
        {id: HALL, kind: 'place'},
        contestBody(SU_XIAO, HALL, {vitality: fullVitality, [COINS]: 2000}),
        contestBody(RIVAL, HALL, {vitality: fullVitality}),
        {id: TUTOR, kind: 'thing', place: HALL, as: ['paradise.tutor']},
    ]});
}

function actions(engine) {
    const record = lessonRecord(engine), balance = readQuantity(engine.world, SU_XIAO, COINS);
    const skillLevel = level(engine), trained = skillLevel > 0;
    const alreadySparred = bouts(engine).some(bout => (bout.skillLevel ?? Number(bout.trained)) === skillLevel);
    const pending = record?.status === 'running';
    const {holders} = engine.world;
    const tutorReady = holders[SU_XIAO]?.place === HALL && holders[TUTOR]?.place === HALL;
    const bookingReason = record ? 'You have already paid for this lesson.'
        : !tutorReady ? 'Meet Koshiro’s image in the Test Hall.'
            : balance < FEE ? 'You need 1,000 Paradise Coins.' : undefined;
    return [
        {id: 'spar', label: skillLevel === 2 ? 'Test your practiced opening' : trained ? 'Spar again' : 'Spar before the lesson', detail: 'Face the same image in a first-touch sword drill.',
            reason: pending ? 'Finish the lesson first.' : alreadySparred ? 'You have recorded this drill.' : undefined},
        {id: 'enroll', label: 'Pay for the lesson', detail: 'Spend 1,000 Paradise Coins for one hour with Koshiro’s image.',
            reason: bookingReason},
        {id: 'study', label: 'Study the image’s opening', detail: 'Watch for the weight shift before the cut. Takes 10 minutes and earns 75 Sword Practice XP.',
            reason: studied(engine) ? 'You recorded this opening.' : !tutorReady ? 'Meet Koshiro’s image in the Test Hall.' :
                !skillLevel ? 'Reach Sword Practice level 1 to recognize the opening.' :
                    !trainedBouts(engine).length ? 'Try the opening in a drill first.' : undefined},
        {id: 'finish', label: 'Finish the hour of practice', detail: 'Practice watching for the opening before you cut.',
            reason: pending ? undefined : trained ? 'You finished this lesson.' : record ? 'The lesson ended early.' : 'Pay for the lesson to begin.'},
    ];
}

function report({trained, skillLevel, first, seconds}) {
    const label = skillLevel === 2 ? 'After studying the opening' : trained ? 'After practice' : 'Before practice';
    const winner = first === SU_XIAO ? 'Su Xiao' : 'Sparring image';
    return first ? `${label} · ${winner} landed the first cut in ${seconds.toFixed(1)} seconds.` : `${label} · Neither fighter landed a cut.`;
}

function view(engine) {
    const record = lessonRecord(engine), latest = bouts(engine).at(-1);
    const skillLevel = level(engine), xp = experience(engine);
    const practice = skillLevel ? 'Read the opening before cutting' : record?.status === 'running' ? 'Lesson in progress' : 'Unpracticed';
    const result = record?.status === 'running' ? 'You paid for the hour. Koshiro’s image is ready.'
        : record?.status === 'interrupted' ? 'The lesson ended early. You did not finish the drill.'
            : studied(engine) && latest?.skillLevel !== 2 ? studied(engine)
                : skillLevel && !latest?.trained ? 'You learned to read the opening. Try the same drill again.'
                : latest ? report(latest) : undefined;
    return {facts: [
        ['Paradise Coins', String(readQuantity(engine.world, SU_XIAO, COINS))],
        ['Time spent', `${engine.world.clock} min`],
        ['Sword practice', practice],
        ['Sword Practice level', skillLevel < trackMax(practiceTrack) ? `Level ${skillLevel} · ${xp} / ${trackThreshold(practiceTrack, skillLevel + 1)} XP` : `Level ${skillLevel} · ${xp} XP`],
        ['Opening cut', `${cutTicks[skillLevel] / TICKS_PER_SECOND} seconds to release`],
        ...(studied(engine) ? [['Observation', studied(engine)]] : []),
    ], actions: actions(engine), result, history: bouts(engine).map(report)};
}

function act(engine, id) {
    const action = actions(engine).find(action => action.id === id);
    if (!action || action.reason) return engine;
    if (id === 'spar') return fight(engine);
    if (id === 'study') {
        const advanced = advanceEngineWorld(engine, engine.world.clock + 10).engine;
        return applyEngineOps(advanced, [award(advanced, studyXP), {op: 'state', holder: SU_XIAO, pack: STUDY,
            value: 'The image shifts its weight before it cuts. You can start your cut as it shifts.'}], 'paradise:study_opening');
    }
    if (id === 'finish') return advanceEngineWorld(engine, lessonRecord(engine).deadlines.at(-1)).engine;
    return startEngineWorking(engine, {id: LESSON, law: practiceLaw, method, bindings: {
        student: {kind: 'body', id: SU_XIAO}, teacher: {kind: 'paradise.tutor', id: TUTOR},
    }});
}

export const paradisePracticeRun = {
    title: 'Su Xiao · Test Hall',
    introduction: 'Take a first-touch drill, learn from Koshiro’s image, then try the same opponent again.',
    create, restore: saved => restoreEngineWorld(saved, config), view, act,
};
