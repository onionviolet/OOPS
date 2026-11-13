import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {defineRecord, KNOWLEDGE_KINDS, KNOWLEDGE_LAW, recordsOf} from '../src/knowledge_record.js';
import {closeFireManualMark, FIRE_MANUAL_LAWS, FIRE_MANUAL_SUBJECT, FIRE_TESTIMONY_LAW, fireManualAuthority, quoteFireManual,
    readFireManualKnowledge, reportFireManualTrial, reviewFireManualTrial, startFireManual,
    watchFireManualTrial} from '../src/world_packs/gu_fire_manual.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {generateRehearsalMoves, GU_REHEARSAL_FUEL as fuel, GU_REHEARSAL_LAW, guRehearsalPack,
    rehearseGuMove, rehearsalArchive, teachRehearsedGuMove, useLearnedGuMove, useRehearsedGuMove} from '../src/world_packs/gu_rehearsal_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const config = {ownPacks: [guRehearsalPack], packs: [guRehearsalPack.id, 'l.living_body', 'n.knowledge'],
    host: {laws: [GU_REHEARSAL_LAW, KNOWLEDGE_LAW, FIRE_TESTIMONY_LAW, ...FIRE_MANUAL_LAWS],
        ports: {authority: fireManualAuthority, readThing: readFireManualKnowledge}},
    shared: {properties: [...sharedProperties(['alive', 'senses', 'concealed']), ...GU_CONTROL_PROPERTIES, {id: 'gu_rank', type: 'level', min: 1}],
        quantities: sharedQuantities(['energy', 'temperature'])}};
const request = {id: 'kiln', operator: 'keeper', held: ['economy', 'size', 'core'], known: ['fire-source', 'enlarge', 'red-fire'],
    cause: {kind: 'practice', id: 'bench:kiln'}, novelty: {level: 3, cause: 'Heat the kiln with a smaller reserve.'}};

function setup() {
    const specimens = [['economy', 'fire-source'], ['size', 'enlarge'], ['core', 'red-fire'], ['spare-core', 'red-fire'],
        ['student-economy', 'fire-source', 'student'], ['student-size', 'enlarge', 'student'], ['student-core', 'red-fire', 'student']];
    return createEngineWorld({...config, holders: [
        {id: 'kiln', kind: 'place', quantities: {temperature: 20}},
        {id: 'keeper', kind: 'body', as: ['operator', 'mind'], place: 'kiln', properties: {alive: true}, quantities: {[fuel]: 12, 'energy:attention': 3}},
        {id: 'student', kind: 'body', as: ['operator', 'mind'], place: 'kiln', properties: {alive: true},
            quantities: {[fuel]: 8, 'energy:attention': 1}},
        {id: 'potter', kind: 'body', as: ['operator', 'mind'], place: 'kiln', properties: {alive: true}, quantities: {'energy:attention': 1}},
        {id: 'yard', kind: 'place'},
        ...specimens.map(([id, kind, owner = 'keeper']) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'kiln', satiety: 20}),
            properties: {alive: true, gu_kind: kind, gu_rank: 1, gu_keeper: owner, gu_controller: owner}})),
    ]});
}
const best = engine => generateRehearsalMoves(engine, request).results.find(row => row.pass && row.recipe.roles.length === 3);
const start = (engine, candidate = best(engine)) => rehearseGuMove(engine, {candidate, request, id: 'trial', target: 'kiln'});
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const reserve = engine => engine.world.holders.keeper.quantities[fuel];
const temperature = engine => engine.world.holders.kiln.quantities.temperature;
const entry = engine => rehearsalArchive(engine, 'keeper').niches['add|heat|gu'];
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
const manualRecord = (id, fillers) => defineRecord({id, subject: {kind: 'composition', id: FIRE_MANUAL_SUBJECT}, true: {fillers}});
const teachManual = (engine, id, teacher, options = {}) => teachRehearsedGuMove(engine, {id, teacher,
    student: 'student', record: 'kiln-manual', ...options}).engine;
const learnManual = (to, record) => ({op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: 'kiln', by: to,
    detail: {knowledge: {to, record}}});
function manualRequest(id, record = 'kiln-manual') {
    const roles = {operator: ['operator', 'student'], target: ['place', 'kiln'], economy: ['gu', 'student-economy'],
        size: ['gu', 'student-size'], core: ['gu', 'student-core']};
    return {id, operator: 'student', record,
        bindings: Object.fromEntries(Object.entries(roles).map(([role, [kind, id]]) => [role, {kind, id}]))};
}

test('a generated move pays one beat at a time and archives the measured heat for replay with a different core', () => {
    const initial = setup();
    const move = best(initial);
    assert.deepEqual(move.recipe.roles.map(role => role.kind), request.known);
    assert.equal(reserve(initial), 12);
    const pending = start(initial, move).engine;
    const first = advance(pending, 1);
    assert.equal(reserve(first), 11);
    assert.equal(entry(first), undefined);
    const result = advance(restore(first), 3);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(pending, 3)));
    assert.equal(reserve(result), 7);
    assert.equal(temperature(result), 22);
    assert.deepEqual(entry(result).evidence, {working: 'trial', at: 3, target: 'kiln', amount: 2});
    assert.deepEqual(entry(result).recipe, move.recipe);

    const replay = useRehearsedGuMove(restore(result), {id: 'replay', operator: 'keeper', target: 'kiln',
        specimens: ['economy', 'size', 'spare-core']});
    const twice = advance(replay.engine, 6);
    assert.equal(reserve(twice), 2);
    assert.equal(temperature(twice), 24);
    assert.deepEqual(entry(twice), entry(result));
});

test('a stale quote starts nothing, and custody loss after preparation keeps only the first payment', () => {
    const initial = setup();
    const change = [{op: 'property', holder: 'size', property: 'gu_keeper', value: 'another'}];
    const changed = applyEngineOps(initial, change, 'fixture:custody');
    assert.equal(start(changed, best(initial)).engine, changed);
    const first = advance(start(initial).engine, 1);
    const result = advance(restore(applyEngineOps(first, change, 'fixture:custody')), 3);
    assert.equal(result.records.workings.trial.record.status, 'interrupted');
    assert.equal(reserve(result), 11);
    assert.equal(temperature(result), 20);
    assert.equal(entry(result), undefined);
    assert.deepEqual(recordsOf(result.world, 'keeper'), {});
});

test('a fully paid rehearsal intercepted by a ward never teaches the forecast', () => {
    const initial = applyEngineOps(setup(), [{op: 'law_add', field: {id: 'ward', kind: 'block', scope: 'kiln',
        params: {verb: 'add', object: 'temperature'}}}], 'fixture:ward');
    const result = advance(start(initial).engine, 3);
    assert.equal(reserve(result), 7);
    assert.equal(temperature(result), 20);
    assert.equal(entry(result), undefined);
    assert.equal(result.world.holders.keeper.state[guRehearsalPack.id].trial, undefined);
    assert.equal(useRehearsedGuMove(result, {operator: 'keeper'}).engine, result);
});

test('a later weaker trial cannot replace the stronger result in the live archive', () => {
    const initial = setup();
    const weaker = generateRehearsalMoves(initial, request).results.find(row => row.pass &&
        row.recipe.roles[0].kind === 'fire-source' && row.recipe.roles.length === 2);
    const strongPending = start(initial).engine;
    const both = rehearseGuMove(strongPending, {candidate: weaker, request, id: 'weak-trial', target: 'kiln'}).engine;
    const result = advance(restore(both), 3);
    assert.equal(reserve(result), 3);
    assert.equal(temperature(result), 23);
    assert.equal(entry(result).evidence.working, 'trial');
    assert.equal(entry(result).evidence.amount, 2);
});

const lessonRecord = 'gu.fire.fire-source.enlarge.red-fire';
const lesson = (engine, id, slots) => teachRehearsedGuMove(engine, {
    id, teacher: 'keeper', student: 'student', record: lessonRecord, slots,
});
const castLesson = engine => useLearnedGuMove(engine, {id: 'student-cast', operator: 'student', record: lessonRecord, target: 'kiln',
    specimens: ['student-economy', 'student-size', 'student-core']});

test('a second operator can assemble a working from two paid lessons and cast with their own Gu', () => {
    const initial = setup();
    assert.equal(lesson(initial, 'premature').engine, initial);
    const rehearsed = advance(start(initial).engine, 3);
    const written = recordsOf(rehearsed.world, 'keeper')[lessonRecord];
    assert.deepEqual(written.source, {kind: 'observation', by: 'keeper', from: 'trial', at: 3});

    const pending = lesson(rehearsed, 'first-lesson', ['cast.0', 'cast.1']).engine;
    const partial = advance(restore(advance(pending, 4)), 5);
    assert.deepEqual(serializeEngineWorld(partial), serializeEngineWorld(advance(pending, 5)));
    assert.deepEqual(recordsOf(partial.world, 'student')[lessonRecord].believed.fillers, {'cast.0': 'fire-source', 'cast.1': 'enlarge'});
    assert.equal(castLesson(partial).engine, partial);
    const complete = advance(lesson(partial, 'last-lesson', ['cast.2']).engine, 7);
    assert.deepEqual(recordsOf(complete.world, 'student')[lessonRecord].source,
        {kind: 'instruction', by: 'keeper', from: lessonRecord, at: 5});
    assert.equal(complete.world.holders.keeper.quantities['energy:attention'], 1);
    assert.deepEqual(rehearsalArchive(complete, 'student').niches, {});
    const result = advance(restore(castLesson(complete).engine), 10);
    assert.equal(temperature(result), 24);
    assert.equal(result.world.holders.student.quantities[fuel], 3);
    assert.equal(reserve(result), 7);
});

test('knowing the complete move does not substitute for a living Gu under the student’s control', () => {
    const rehearsed = advance(start(setup()).engine, 3);
    const taught = advance(lesson(rehearsed, 'lesson').engine, 5);
    const queued = castLesson(taught).engine;
    const interrupted = applyEngineOps(advance(queued, 7), [
        {op: 'property', holder: 'student-core', property: 'gu_controller', value: 'keeper'},
    ], 'fixture:control-lost');
    const result = advance(restore(interrupted), 8);
    assert.equal(result.records.workings['student-cast'].record.status, 'interrupted');
    assert.equal(result.world.holders.student.quantities[fuel], 6);
    assert.equal(temperature(result), 22);
    assert.ok(recordsOf(result.world, 'student')[lessonRecord]);
});

test('a student who leaves before the lesson settles receives no record', () => {
    const rehearsed = advance(start(setup()).engine, 3);
    const pending = lesson(rehearsed, 'lesson').engine;
    const left = applyEngineOps(pending, [{op: 'move', holder: 'student', to: 'yard'}], 'fixture:left');
    const result = advance(restore(left), 5);
    assert.equal(result.records.workings.lesson.record.status, 'interrupted');
    assert.equal(result.world.holders.keeper.quantities['energy:attention'], 3);
    assert.deepEqual(recordsOf(result.world, 'student'), {});
});

test('a false lesson forecasts one sequence and settles a different paid result through restore', () => {
    const actual = {first: 'size', second: 'core', third: 'economy'};
    const advertised = {first: 'economy', second: 'size', third: 'core'};
    const world = applyEngineOps(setup(), [manualRecord('poor-manual', actual), manualRecord('good-manual', advertised)]
        .map(record => learnManual('keeper', record)), 'fixture:teacher-manuals');
    const taught = teachRehearsedGuMove(world, {id: 'false-lesson', teacher: 'keeper', student: 'student',
        record: 'poor-manual', cover: 'good-manual'}).engine;
    const learned = advance(restore(advance(taught, 1)), 2);
    const student = recordsOf(learned.world, 'student')['poor-manual'];
    assert.deepEqual(student.believed.fillers, advertised);
    assert.deepEqual(student.true.fillers, actual);
    assert.equal(learned.world.holders.keeper.quantities['energy:attention'], 2);
    const request = manualRequest('fire-from-manual', 'poor-manual');
    const quote = quoteFireManual(learned, request);
    assert.equal(quote.ok, true);
    assert.equal(quote.costs.reduce((sum, row) => sum + row.amount, 0), 5);
    assert.equal(quote.effects[0].details.amount, 2);
    const casting = startFireManual(learned, request).engine;
    const mid = advance(casting, 3);
    const heated = advance(restore(mid), 4);
    assert.equal(temperature(heated), 22);
    assert.equal(heated.records.workings['fire-from-manual'].record.status, 'running');
    const result = advance(heated, 5);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(casting, 5)));
    assert.equal(result.world.holders.student.quantities[fuel], 0);
    assert.equal(temperature(result), 22);
    assert.deepEqual(recordsOf(result.world, 'student')['poor-manual'].believed.fillers, advertised);
    const review = {id: 'review-completed-cast', operator: 'student', cast: request.id};
    const pending = reviewFireManualTrial(result, review).engine;
    const reviewed = advance(restore(pending), 6);
    assert.deepEqual(serializeEngineWorld(reviewed), serializeEngineWorld(advance(pending, 6)));
    const revised = recordsOf(reviewed.world, 'student')['poor-manual'];
    assert.deepEqual(revised.believed.fillers, actual);
    assert.equal(reviewed.world.holders.student.quantities['energy:attention'], 0);
    const replenished = applyEngineOps(reviewed, [{op: 'set', holder: 'student', quantity: fuel, amount: 8}], 'fixture:new-reserve');
    const retry = manualRequest('revised-cast', 'poor-manual');
    const revisedQuote = quoteFireManual(replenished, retry);
    assert.equal(revisedQuote.ok, true);
    assert.equal(revisedQuote.costs.reduce((sum, row) => sum + row.amount, 0), 8);
    assert.equal(revisedQuote.effects[0].details.amount, 2);
    const replay = advance(startFireManual(replenished, retry).engine, 9);
    assert.equal(replay.world.holders.student.quantities[fuel], 0);
    assert.equal(temperature(replay), 24);
    const short = applyEngineOps(learned, [{op: 'set', holder: 'student', quantity: fuel, amount: 5}], 'fixture:quoted-reserve');
    const failed = advance(restore(startFireManual(short, request).engine), 5);
    assert.equal(failed.records.workings['fire-from-manual'].record.status, 'interrupted');
    assert.equal(failed.world.holders.student.quantities[fuel], 4);
    assert.equal(temperature(failed), 20);
});

test('two paid teachers can supply one manual, and the first incomplete casting spends fuel without heating', () => {
    const whole = {first: 'economy', second: 'size', third: 'core'};
    const initial = applyEngineOps(setup(), [
        learnManual('keeper', manualRecord('kiln-manual', whole)),
        learnManual('potter', manualRecord('kiln-manual', {third: 'core'})),
    ], 'fixture:manual-teachers');
    const omitted = {slots: ['first', 'second']};
    const honest = advance(teachManual(initial, 'open-lesson', 'keeper', omitted), 2);
    const openQuote = quoteFireManual(honest, manualRequest('open-cast'));
    assert.equal(openQuote.ok, true);
    assert.equal(openQuote.effects.length, 0);
    assert.equal(openQuote.costs.reduce((sum, row) => sum + row.amount, 0), 2);

    const learned = advance(teachManual(initial, 'first-lesson', 'keeper', {...omitted, cover: 'kiln-manual'}), 2);
    const first = manualRequest('withheld-cast');
    assert.equal(quoteFireManual(learned, first).effects[0].details.amount, 2);
    const pending = startFireManual(learned, first).engine;
    const mid = advance(pending, 3);
    const partial = advance(restore(mid), 4);
    assert.deepEqual(serializeEngineWorld(partial), serializeEngineWorld(advance(pending, 4)));
    assert.equal(partial.records.workings[first.id].record.status, 'complete');
    assert.equal(temperature(partial), 20);
    assert.equal(partial.world.holders.student.quantities[fuel], 6);
    assert.equal(partial.world.holders.keeper.quantities['energy:attention'], 2);

    const secondLesson = teachManual(partial, 'second-lesson', 'potter');
    const finished = advance(restore(advance(secondLesson, 5)), 6);
    const merged = recordsOf(finished.world, 'student')['kiln-manual'];
    assert.deepEqual(merged.true.fillers, whole);
    assert.deepEqual(merged.source, recordsOf(learned.world, 'student')['kiln-manual'].source);
    assert.equal(finished.world.holders.potter.quantities['energy:attention'], 0);
    const result = advance(startFireManual(finished, manualRequest('complete-cast')).engine, 9);
    assert.equal(result.world.holders.student.quantities[fuel], 1);
    assert.equal(temperature(result), 22);
});

test('a trial observer can review only the beats seen while present', () => {
    const initial = applyEngineOps(setup(), [
        learnManual('student', manualRecord('kiln-manual', {first: 'economy', second: 'size', third: 'core'})),
        learnManual('potter', manualRecord('other-manual', {first: 'size', second: 'core', third: 'economy'})),
        {op: 'property', holder: 'potter', property: 'senses', value: ['sight']},
    ], 'fixture:two-manuals');
    const casting = startFireManual(initial, manualRequest('demonstration')).engine;
    const watched = watchFireManualTrial(casting, {id: 'watch-kiln', operator: 'potter',
        cast: 'demonstration', record: 'other-manual'}).engine;
    const first = advance(restore(watched), 1);
    const absent = applyEngineOps(first, [{op: 'move', holder: 'potter', to: 'yard'}], 'fixture:observer-leaves');
    const finished = advance(restore(absent), 3);
    const review = {id: 'review-watch', operator: 'potter', cast: 'watch-kiln'};
    const pending = reviewFireManualTrial(finished, review).engine;
    const reviewed = advance(restore(pending), 4);
    assert.deepEqual(serializeEngineWorld(reviewed), serializeEngineWorld(advance(pending, 4)));
    const record = recordsOf(reviewed.world, 'potter')['other-manual'];
    assert.deepEqual(record.doubts, ['first']);
    assert.deepEqual(record.checks[0].found, [{slot: 'first', kind: 'differs', other: 'student'}]);
    assert.equal(reviewed.world.holders.potter.quantities['energy:attention'], 0);
    assert.equal(reviewFireManualTrial(finished, {...review, operator: 'keeper'}).engine, finished);
    const unseen = advance(applyEngineOps(watched, [{op: 'move', holder: 'potter', to: 'yard'}], 'fixture:missed-all'), 3);
    assert.equal(reviewFireManualTrial(unseen, review).engine, unseen);
    const concealed = advance(applyEngineOps(watched, [
        {op: 'property', holder: 'student', property: 'concealed', value: ['sight']},
    ], 'fixture:hidden-demonstration'), 3);
    assert.equal(reviewFireManualTrial(concealed, review).engine, concealed);
    assert.equal(temperature(concealed), 22);
});

test('a paid spirit watch can read a hidden trial remotely while its channel stays open', () => {
    const attention = 'energy:attention';
    const taught = applyEngineOps(setup(), [
        learnManual('student', manualRecord('kiln-manual', {first: 'economy', second: 'size', third: 'core'})),
        learnManual('potter', manualRecord('other-manual', {first: 'size', second: 'core', third: 'economy'})),
    ], 'fixture:two-manuals');
    const initial = applyEngineOps(taught, [
        {op: 'property', holder: 'potter', property: 'senses', value: ['spirit']},
        {op: 'property', holder: 'student', property: 'concealed', value: ['sight']},
        {op: 'set', holder: 'potter', quantity: attention, amount: 2},
        {op: 'move', holder: 'potter', to: 'yard'},
        {op: 'link_add', link: {id: 'spirit-channel', kind: 'spirit', from: 'yard', to: 'kiln', cost: 2}},
    ], 'fixture:remote-observer');
    const casting = startFireManual(initial, manualRequest('demonstration')).engine;
    const watch = {id: 'watch-kiln', operator: 'potter', cast: 'demonstration', record: 'other-manual', channel: 'spirit'};
    const empty = applyEngineOps(casting, [
        {op: 'set', holder: 'potter', quantity: attention, amount: 0},
    ], 'fixture:no-attention');
    const unpaid = watchFireManualTrial(empty, watch).engine;
    assert.equal(unpaid.records.workings[watch.id].record.status, 'interrupted');
    assert.equal(unpaid.world.laws.some(field => field.id === watch.id), false);
    const watching = watchFireManualTrial(casting, watch).engine;
    assert.equal(watching.world.holders.potter.quantities[attention], 1);
    const first = advance(restore(watching), 1);
    const blocked = applyEngineOps(first, [{op: 'link_set', id: 'spirit-channel', state: 'closed'}], 'fixture:channel-closed');
    const review = {id: 'review-watch', operator: 'potter', cast: 'watch-kiln'};
    const finish = engine => advance(reviewFireManualTrial(advance(engine, 3), review).engine, 4);
    const reviewed = finish(restore(blocked));
    assert.deepEqual(serializeEngineWorld(reviewed), serializeEngineWorld(finish(blocked)));
    assert.deepEqual(recordsOf(reviewed.world, 'potter')['other-manual'].doubts, ['first']);
    assert.equal(reviewed.world.holders.potter.quantities[attention], 0);
    assert.equal(temperature(reviewed), 22);

    const concealed = applyEngineOps(watching, [
        {op: 'property', holder: 'student', property: 'concealed', value: ['sight', 'spirit']},
    ], 'fixture:spirit-concealment');
    const unseen = advance(concealed, 3);
    assert.equal(reviewFireManualTrial(unseen, review).reason, 'trial-unavailable');
    assert.equal(unseen.world.holders.potter.quantities[attention], 1);

    const finished = advance(blocked, 3);
    const instructed = applyEngineOps(finished, [
        learnManual('keeper', manualRecord('listener-manual', {first: 'size', second: 'core', third: 'economy'})),
    ], 'fixture:listener-manual');
    const listener = applyEngineOps(instructed, [
        {op: 'move', holder: 'keeper', to: 'yard'},
    ], 'fixture:listener-arrives');
    const report = {id: 'relay', caster: 'potter', listener: 'keeper', cast: 'demonstration',
        record: 'listener-manual', watch: 'watch-kiln'};
    assert.equal(reportFireManualTrial(listener, {...report, caster: 'student'}).reason, 'trial-unavailable');
    const telling = reportFireManualTrial(listener, report).engine;
    const told = advance(restore(telling), 4);
    assert.deepEqual(serializeEngineWorld(told), serializeEngineWorld(advance(telling, 4)));
    assert.equal(told.world.holders.potter.quantities[attention], 0);
    const relayId = 'gu.fire.testimony.relay.0';
    assert.deepEqual(told.world.laws.find(field => field.id === relayId).params, {
        cast: 'demonstration', caster: 'potter', record: 'listener-manual', watch: 'watch-kiln',
    });
    const comparison = reviewFireManualTrial(restore(told), {id: 'review-relay', operator: 'keeper', cast: relayId});
    const compared = advance(comparison.engine, 5);
    assert.deepEqual(recordsOf(compared.world, 'keeper')['listener-manual'].checks[0].found,
        [{slot: 'first', kind: 'differs', other: 'student'}]);
    assert.equal(compared.world.holders.keeper.quantities[attention], 2);
    const forward = {id: 'forward', caster: 'keeper', listener: 'student', cast: 'demonstration',
        record: 'kiln-manual', parent: relayId};
    const meeting = applyEngineOps(told, [{op: 'move', holder: 'student', to: 'yard'},
        {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: 'yard', by: 'student',
            detail: {knowledge: {to: 'student', record: manualRecord('student-copy', {first: 'size', second: 'core', third: 'economy'})}}},
    ], 'fixture:forwarding-meeting');
    assert.equal(reportFireManualTrial(meeting, {...forward, listener: 'potter', record: 'other-manual'}).reason, 'trial-unavailable');
    const sending = reportFireManualTrial(meeting, {...forward, record: 'student-copy'}).engine;
    const forwarded = advance(restore(sending), 5);
    assert.deepEqual(serializeEngineWorld(forwarded), serializeEngineWorld(advance(sending, 5)));
    assert.equal(forwarded.world.holders.keeper.quantities[attention], 2);
    const forwardedId = 'gu.fire.testimony.forward.0';
    const field = forwarded.world.laws.find(row => row.id === forwardedId);
    assert.equal(field.params.parent, relayId);
    assert.equal(field.params.watch, 'watch-kiln');
    assert.equal(field.until, 14);
    const reviewedCopy = advance(reviewFireManualTrial(restore(forwarded),
        {id: 'review-forward', operator: 'student', cast: forwardedId}).engine, 6);
    assert.deepEqual(recordsOf(reviewedCopy.world, 'student')['student-copy'].checks[0].found,
        [{slot: 'first', kind: 'differs', other: 'student'}]);
    assert.equal(reviewFireManualTrial(advance(forwarded, 14),
        {id: 'expired-review', operator: 'student', cast: forwardedId}).reason, 'trial-unavailable');

    const tooLate = reportFireManualTrial(advance(meeting, 13), {...forward, record: 'student-copy'}).engine;
    const expired = advance(restore(tooLate), 14);
    assert.equal(expired.records.workings.forward.record.status, 'interrupted');
    assert.equal(expired.world.holders.keeper.quantities[attention], 3);
    assert.equal(expired.world.laws.some(row => row.id === forwardedId), false);
    const gone = applyEngineOps(telling, [{op: 'move', holder: 'keeper', to: 'kiln'}], 'fixture:listener-leaves');
    const unheard = advance(restore(gone), 4);
    assert.equal(unheard.world.holders.potter.quantities[attention], 1);
    assert.equal(unheard.world.laws.some(field => field.id === relayId), false);
});

test('a live closure blocks a concealed maker mark mid-cast and lapses on the world clock', () => {
    const marked = {first: 'economy', second: 'size', third: 'marked-core'};
    const cover = {first: 'economy', second: 'size', third: 'core'};
    const mark = 'kiln-maker-mark';
    const initial = applyEngineOps(setup(), [
        learnManual('keeper', defineRecord({id: 'kiln-manual', subject: {kind: 'composition', id: FIRE_MANUAL_SUBJECT},
            true: {fillers: marked}, believed: {fillers: marked, conditions: [mark]}})),
        learnManual('keeper', manualRecord('cover', cover)),
    ], 'fixture:marked-manual');
    const learned = advance(teachManual(initial, 'marked-lesson', 'keeper', {cover: 'cover'}), 2);
    const request = manualRequest('intercepted-cast');
    assert.equal(quoteFireManual(learned, request).effects[0].details.amount, 2);
    const prepared = advance(startFireManual(learned, request).engine, 3);
    assert.equal(prepared.world.holders.student.quantities[fuel], 7);
    const denied = closeFireManualMark(prepared, {id: 'unknown-mark', author: 'potter', operator: 'student'});
    assert.equal(denied.records.workings['unknown-mark'].record.receipts[0].reason, 'condition-unknown');
    assert.equal(denied.world.holders.potter.quantities['energy:attention'], 1);

    const closed = closeFireManualMark(denied, {id: 'close-mark', author: 'keeper', operator: 'student'});
    assert.equal(closed.world.holders.keeper.quantities['energy:attention'], 1);
    assert.equal(closeFireManualMark(closed, {id: 'repeat-close', author: 'keeper', operator: 'student'}), closed);
    assert.equal(quoteFireManual(closed, manualRequest('concealed-quote')).ok, true);
    const review = {id: 'study-the-failed-cast', operator: 'student', cast: request.id};
    assert.equal(reviewFireManualTrial(closed, review).engine, closed);

    // An open mark has the same result and cost as its cover. Completing that
    // cast gives the student no evidence that its ignition was marked.
    const ordinary = advance(startFireManual(learned, request).engine, 5);
    assert.equal(temperature(ordinary), 22);
    const checked = advance(reviewFireManualTrial(ordinary, review).engine, 6);
    const unchanged = recordsOf(checked.world, 'student')['kiln-manual'];
    assert.deepEqual(unchanged.believed, {fillers: cover, conditions: []});
    assert.deepEqual(unchanged.checks[0].found, []);
    assert.equal(checked.world.holders.student.quantities['energy:attention'], 0);
    const blocked = advance(restore(closed), 5);
    assert.deepEqual(serializeEngineWorld(blocked), serializeEngineWorld(advance(closed, 5)));
    const failure = blocked.records.workings[request.id].record.receipts.at(-1);
    assert.equal(failure.reason, 'condition-denied');
    assert.equal(failure.truth.cause, mark);
    assert.equal(blocked.world.holders.student.quantities[fuel], 5);
    assert.equal(temperature(blocked), 20);
    assert.deepEqual(recordsOf(blocked.world, 'student')['kiln-manual'].believed.conditions, []);
    assert.equal(reviewFireManualTrial(blocked, {...review, operator: 'potter'}).engine, blocked);
    const preparedListener = applyEngineOps(blocked, [
        learnManual('potter', {...recordsOf(blocked.world, 'student')['kiln-manual'], id: 'potter-manual'}),
    ], 'fixture:listener-manual');
    const report = {id: 'report', caster: 'student', listener: 'potter', cast: request.id, record: 'potter-manual'};
    const testimony = reportFireManualTrial(preparedListener, report).engine;
    const told = advance(restore(testimony), 6);
    assert.equal(told.world.holders.student.quantities['energy:attention'], 0);
    const listenerReview = {id: 'listener-review', operator: 'potter', cast: 'gu.fire.testimony.report.0'};
    const reviewing = reviewFireManualTrial(told, listenerReview).engine;
    assert.notEqual(reviewing, told);
    const listenerLearned = advance(restore(reviewing), 7);
    assert.deepEqual(serializeEngineWorld(listenerLearned), serializeEngineWorld(advance(reviewing, 7)));
    assert.deepEqual(recordsOf(listenerLearned.world, 'potter')['potter-manual'].believed.conditions, [mark]);
    assert.deepEqual(recordsOf(listenerLearned.world, 'student')['kiln-manual'].believed.conditions, []);
    assert.equal(listenerLearned.world.holders.potter.quantities['energy:attention'], 0);
    const apart = applyEngineOps(testimony, [{op: 'move', holder: 'potter', to: 'yard'}], 'fixture:listener-leaves');
    const unheard = advance(restore(apart), 6);
    assert.equal(unheard.records.workings.report.record.status, 'interrupted');
    assert.equal(unheard.world.holders.student.quantities['energy:attention'], 1);
    assert.equal(reviewFireManualTrial(unheard, listenerReview).engine, unheard);
    const studying = reviewFireManualTrial(blocked, review).engine;
    const distracted = applyEngineOps(studying, [{op: 'set', holder: 'student', quantity: 'energy:attention', amount: 0}], 'fixture:distracted');
    const missed = advance(restore(distracted), 6);
    assert.equal(missed.records.workings[review.id].record.status, 'interrupted');
    assert.deepEqual(recordsOf(missed.world, 'student')['kiln-manual'].believed.conditions, []);
    const informed = advance(restore(studying), 6);
    assert.deepEqual(serializeEngineWorld(informed), serializeEngineWorld(advance(studying, 6)));
    const studied = recordsOf(informed.world, 'student')['kiln-manual'];
    assert.deepEqual(studied.believed, {fillers: marked, conditions: [mark]});
    assert.deepEqual(studied.checks[0].found, [{slot: 'third', kind: 'condition', condition: mark, is: 'marked-core'}]);
    assert.equal(informed.world.holders.student.quantities['energy:attention'], 0);
    assert.equal(quoteFireManual(informed, manualRequest('informed-quote')).reason, 'condition-denied');
    const open = advance(informed, 7);
    const heated = advance(startFireManual(open, manualRequest('retry-cast')).engine, 10);
    assert.equal(heated.world.holders.student.quantities[fuel], 0);
    assert.equal(temperature(heated), 22);
});
