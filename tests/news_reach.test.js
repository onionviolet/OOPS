// FRC news (proposal, AD56): what one person saw of the lead reaches others along real ties, a day at a time, and may bend on the way.
// Generic seam first (gossipStep ports, readers), then the Tingen caller over a cast fixture shaped like the shipped pack.
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshMemory, readMemories, remember, encodeMemory, decodeMemory, validateMemory} from '../src/person_memory.js';
import {gossipStep, memoryForPlan, registerMemoryTopic, episodeFromEffect} from '../src/person_memory_effects.js';
import {registerNewsWorld, newsPorts, heardAbout, newsMoodRows, newsReports, foldNewsMood, newsSighting, contactAxis} from '../src/news_reach.js';
import {payload} from '../src/person_episode.js';

const W = 'test.news.world';
registerMemoryTopic({causePrefix: 'test.news.filed', topic: 'test_filed', phrase: 'you file your papers on time'});
registerNewsWorld({worldId: W, ties: () => [{holder: 'p.cap', other: 'p.exam', kind: 'colleague'}], nameOf: id => ({'p.cap': 'the captain', 'p.exam': 'the examiner'})[id] || id,
    limits: {id: 'memory.test.news', revision: 1, tellingLoss: 15, hearsayTrust: 90}, drift: {test_filed: {to: 'test_bent', chance: 0, feeling: -0.5}}});
const seen = day => episodeFromEffect({holder: 'p.cap', subject: 'player', cause: 'test.news.filed.w1', axis: 'tie.trust', amount: 3, day});
const world = (at = {cap: 'office', exam: 'office'}) => ({
    simulation: {seed: 41, causes: {}, clock: 0, people: {player: {life: 'alive', location: 'office'}, 'p.cap': {life: 'alive', location: at.cap}, 'p.exam': {life: 'alive', location: at.exam}}, relationships: {}},
    actors: {player: {worldId: W}, 'p.cap': {worldId: W}, 'p.exam': {worldId: W}}});
const step = (state, memory, day, news = newsPorts(state)) => gossipStep({memory, simulation: state.simulation, actors: state.actors, day, root: 41, news});

test('a registered cause names the topic, so the account reads as what happened', () => {
    assert.equal(payload(seen(1)).topic, 'test_filed');
    assert.equal(payload(episodeFromEffect({holder: 'p.cap', subject: 'player', cause: 'other.cause', axis: 'tie.trust', amount: 3, day: 1})).topic, 'helped');
});

test('a real tie with no edge carries news to a colleague in the same place, labelled as heard, with the world\'s loss', () => {
    const state = world(), memory = remember(freshMemory(), 'p.cap', seen(1), 1);
    assert.equal(readMemories(step(state, memory, 1, {}).memory, 'p.exam', 1).length, 0, 'without the world table the edge store has no tie');
    const out = step(state, memory, 1), heard = readMemories(out.memory, 'p.exam', 1)[0];
    assert.deepEqual(heard.source, {teller: 'p.cap'}, 'an account keeps its teller (KNW4)');
    assert.equal(heard.certainty, Math.round((100 - 15) * 90 / 100), 'Tingen-style loss 15, hearsay trust 90');
    assert.ok(Object.hasOwn(out.causes, 'memory.gossip:1:p.cap'), 'the day\'s telling is spent');
    assert.deepEqual(step({...state, simulation: {...state.simulation, causes: out.causes}}, out.memory, 1).memory, out.memory, 'one telling per day, replay-safe');
    assert.equal(Object.keys(state.simulation.relationships).length, 0, 'no edge written for the pack tie');
    assert.deepEqual(newsPorts(state).contactsOf('p.exam', 'p.cap'), {[contactAxis('colleague')]: 1}, 'people talk both ways');
});

test('apart, nothing travels and the day is not spent; when they meet later that day, it does (the delay is real contact)', () => {
    const memory = remember(freshMemory(), 'p.cap', seen(1), 1), apart = world({cap: 'office', exam: 'home'});
    const first = step(apart, memory, 1);
    assert.equal(readMemories(first.memory, 'p.exam', 1).length, 0);
    assert.equal(first.causes['memory.gossip:1:p.cap'], undefined, 'a save with nobody around spends nothing');
    const together = world(); together.simulation.causes = first.causes;
    assert.equal(readMemories(step(together, first.memory, 1).memory, 'p.exam', 1).length, 1);
});

test('the second hop waits a day and loses more; nobody tells the lead about themself', () => {
    const state = world();
    state.simulation.people['p.clerk'] = {life: 'alive', location: 'office'}; state.actors['p.clerk'] = {worldId: W};
    registerNewsWorld({worldId: W, ties: () => [{holder: 'p.cap', other: 'p.exam', kind: 'colleague'}, {holder: 'p.exam', other: 'p.clerk', kind: 'colleague'}],
        limits: {id: 'memory.test.news', revision: 1, tellingLoss: 15, hearsayTrust: 90}});
    let memory = remember(freshMemory(), 'p.cap', seen(1), 1);
    const d1 = step(state, memory, 1);
    assert.equal(readMemories(d1.memory, 'p.clerk', 1).length, 0, 'same day: only the captain\'s own account moves');
    state.simulation.causes = d1.causes;
    const d2 = step(state, d1.memory, 2), second = readMemories(d2.memory, 'p.clerk', 2)[0];
    assert.deepEqual(second.source, {teller: 'p.exam'});
    assert.ok(second.certainty < readMemories(d1.memory, 'p.exam', 1)[0].certainty);
    assert.equal(readMemories(d2.memory, 'player', 2).length, 0);
    assert.deepEqual(readMemories(d2.memory, 'p.cap', 2).map(e => e.source), ['saw'], 'the witness never hears his own story back');
    const bentBack = step(state, d1.memory, 2, {...newsPorts(state), drift: () => ({topic: 'test_bent', feeling: -0.5})});
    assert.deepEqual(readMemories(bentBack.memory, 'p.cap', 2).map(e => e.source), ['saw'], 'nor a bent version of it');
    registerNewsWorld({worldId: W, ties: () => [{holder: 'p.cap', other: 'p.exam', kind: 'colleague'}], nameOf: id => ({'p.cap': 'the captain', 'p.exam': 'the examiner'})[id] || id,
        limits: {id: 'memory.test.news', revision: 1, tellingLoss: 15, hearsayTrust: 90}, drift: {test_filed: {to: 'test_bent', chance: 0, feeling: -0.5}}});
});

test('drift is a per-world dial: a bent retelling changes what is said and how it feels, the same way on every read', () => {
    const state = world(), memory = remember(freshMemory(), 'p.cap', seen(1), 1);
    const ports = {...newsPorts(state), drift: ({row}) => payload(row).topic === 'test_filed' ? {topic: 'test_bent', feeling: -0.5} : null};
    const heard = readMemories(step(state, memory, 1, ports).memory, 'p.exam', 1)[0];
    assert.equal(payload(heard).topic, 'test_bent'); assert.ok(heard.feeling < 0);
    assert.equal(payload(readMemories(memory, 'p.cap', 1)[0]).topic, 'test_filed', 'the teller\'s own memory is untouched (KNW11)');
    assert.deepEqual(step(state, memory, 1, ports), step(state, memory, 1, ports));
    // The registered table: chance 1 always bends, chance 0 never.
    registerNewsWorld({worldId: 'test.news.bend', ties: () => [{holder: 'p.cap', other: 'p.exam', kind: 'colleague'}], drift: {test_filed: {to: 'test_bent', chance: 1, feeling: -0.5}}});
    const bend = world(); for(const a of Object.values(bend.actors)) a.worldId = 'test.news.bend';
    assert.equal(payload(readMemories(step(bend, memory, 1).memory, 'p.exam', 1)[0]).topic, 'test_bent');
    assert.throws(() => registerNewsWorld({worldId: 'x.y', ties: () => [], drift: {a: {to: 'b', chance: 2}}}), /drift/);
});

test('readers: the audience\'s heard account, a mood row that fades in a week, and a report with no numbers', () => {
    const state = world(), memory = step(state, remember(freshMemory(), 'p.cap', seen(1), 1), 1).memory;
    const [h] = heardAbout({memory, holder: 'p.exam', day: 1});
    assert.equal(h.teller, 'p.cap'); assert.equal(h.phrase, 'you file your papers on time');
    const [m] = newsMoodRows({memory, holder: 'p.exam', day: 1, worldId: W});
    assert.equal(m.magnitude, 3); assert.equal(m.line, 'heard from the captain that you file your papers on time');
    assert.deepEqual(newsMoodRows({memory, holder: 'p.exam', day: 8, worldId: W}), [], 'a week-old story stops colouring today');
    assert.deepEqual(newsMoodRows({memory, holder: 'p.cap', day: 1, worldId: W}), [], 'the one who saw it has no heard row');
    const folded = foldNewsMood({total: 0, band: 'even', rows: []}, [m]);
    assert.equal(folded.total, 3); assert.equal(folded.rows[0].line, m.line);
    assert.equal(foldNewsMood(null, []), null);
    const [r] = newsReports({memory, worldId: W, day: 1, audiences: ['p.cap', 'p.exam']});
    assert.equal(r.audienceId, 'p.exam'); assert.equal(r.heard, true); assert.equal(r.observed, true);
    assert.equal(r.line, 'from the captain, that you file your papers on time.');
    assert.doesNotMatch(r.line, /\d/);
});

test('persistence: a heard episode round-trips through the memory slice with its teller', () => {
    const memory = step(world(), remember(freshMemory(), 'p.cap', seen(1), 1), 1).memory;
    const bytes = JSON.parse(JSON.stringify(memory));
    validateMemory(bytes, 1);
    assert.deepEqual(readMemories(bytes, 'p.exam', 1), readMemories(memory, 'p.exam', 1));
    assert.deepEqual(decodeMemory(encodeMemory(decodeMemory(bytes, 1), 1), 1), decodeMemory(bytes, 1));
});

test('sighting seam: a witness row goes through the ordinary plan path and then travels like any account', () => {
    const state = world(), plan = {state: {...state, clock: 0}};
    newsSighting(plan, {holder: 'p.cap', cause: 'test.news.filed.seen', amount: 2});
    assert.throws(() => newsSighting(plan, {holder: 'p.cap', cause: '', amount: 2}));
    const out = memoryForPlan({plan, day: 1, news: newsPorts});
    assert.equal(payload(readMemories(out.memory, 'p.cap', 1)[0]).topic, 'test_filed');
    assert.equal(readMemories(out.memory, 'p.exam', 1)[0].source.teller, 'p.cap', 'the witness tells the colleague the same day');
});
