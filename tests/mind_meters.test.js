// FRC51 mind meters (proposal): marks are mood thought rows; the route opens at three with a last window; contentment spends one;
// a closed route feeds the one LOTM loss inbox only for a Beyonder; no new save key (docs/MIND_RULES.md, MND5, MND7-MND9).
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshThoughts, addThought, moodOf} from '../src/mood_thoughts.js';
import {markThought, mindMeter, spendMark, closeRoute, MIND_DIALS, MIND_KINDS} from '../src/mind_meters.js';
import {runningThoughts} from '../src/mood_thoughts.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/mood_thoughts_domain.js';
import {collectMindMarks, applyMindMarks, lotmMindView, lotmMindDue, lotmMindNote, LOTM_MIND_HOLDER} from '../src/book_world_lotm_mind.js';
import {LOTM_INBOX} from '../src/book_world_lotm_harm.js';
import {BE_SEER_SOURCE} from '../src/book_world_lotm_be_seer.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

const H = 'holder';
const mark = (slice, cause, now, kind = 'dread') => addThought(slice, markThought({holder: H, kind, cause, line: `saw ${cause}`}), now);
const rows = (slice, now) => runningThoughts(slice, H, now);

test('marks are mood rows: they lower the mood, count by kind, warn at two and open a route at three', () => {
    let s = mark(freshThoughts(), 'a', 0);
    assert.equal(mindMeter(rows(s, 10), 'dread', 10).stage, 'clear');
    s = mark(s, 'b', 100);
    assert.equal(mindMeter(rows(s, 110), 'dread', 110).stage, 'warned');
    s = mark(s, 'c', 200, 'fascination');
    assert.equal(mindMeter(rows(s, 210), 'dread', 210).stage, 'warned', 'another kind does not count');
    s = mark(s, 'd', 300);
    const m = mindMeter(rows(s, 310), 'dread', 310);
    assert.equal(m.stage, 'route');
    assert.equal(m.opensAt, 300);
    assert.equal(m.closesAt, 300 + MIND_DIALS.windowMinutes);
    assert.equal(m.due, false);
    assert.ok(moodOf(s, H, 310).total <= 3 * MIND_KINDS.dread.magnitude, 'one mood, read beside the other thoughts');
    assert.deepEqual(Object.keys(s), ['schema', 'rows'], 'nothing but thought rows is stored');
});

test('a mark runs out on its own; a route whose oldest mark runs out first passes by itself', () => {
    let s = mark(mark(mark(freshThoughts(), 'a', 0), 'b', 2000), 'c', 3000);
    const m = mindMeter(rows(s, 3000), 'dread', 3000);
    assert.equal(m.passes, true, 'mark a ends at 4320, before the window closes at 4440');
    assert.equal(mindMeter(rows(s, 4400), 'dread', 4400).stage, 'warned');
});

test('spending takes the oldest mark; closing a due route takes the three that opened it, once', () => {
    let s = mark(mark(mark(freshThoughts(), 'a', 0), 'b', 10), 'c', 20);
    const spent = spendMark(s, H, 'dread', 30);
    assert.equal(spent.spent.source, 'mind.dread.a');
    assert.equal(mindMeter(rows(spent.slice, 30), 'dread', 30).stage, 'warned');
    const late = 20 + MIND_DIALS.windowMinutes;
    assert.equal(closeRoute(s, H, 'dread', late - 1).closed.length, 0, 'not before the window ends');
    const c = closeRoute(s, H, 'dread', late);
    assert.equal(c.closed.length, 3);
    assert.equal(mindMeter(rows(c.slice, late), 'dread', late).stage, 'clear');
    assert.equal(closeRoute(c.slice, H, 'dread', late).closed.length, 0, 'closing twice is a no-op');
});

// LOTM caller over a minimal state: the act's knowledge is the witness; a marker rides the world facts.
const ACTS = {acts: [
    {id: 'book.lotm.opening.mirror', knowledgeKey: 'k.mirror'}, {id: 'book.lotm.household_clean', knowledgeKey: 'k.blood'},
    {id: 'book.lotm.kj3g.losing', knowledgeKey: 'k.losing'}, {id: 'book.lotm.kj3l.mass', knowledgeKey: 'k.mass'}]};
const state = (clock, beyonder = false) => ({clock, worlds: {[I.world]: {facts: {}}}, simulation: {knowledge: {player: {}}},
    actors: {player: {worldId: I.world, resources: {}, sources: beyonder ? {[BE_SEER_SOURCE]: {}} : {}}}});
const witness = (s, key) => { s.simulation.knowledge.player[key] = {cause: `cause.${key}`, at: s.clock, value: 'seen'}; };

test('Klein: what he witnesses marks once; a reload or replay writes nothing twice; contentment spends a mark', () => {
    domainRegistry.load({});
    const s = state(100);
    witness(s, 'k.mirror'); witness(s, 'k.blood');
    const due = collectMindMarks(s, ACTS);
    assert.equal(due.length, 2);
    assert.deepEqual(applyMindMarks(due, s.clock), []);
    assert.equal(collectMindMarks(s, ACTS).length, 0, 'the marker holds');
    const v = lotmMindView(s);
    assert.equal(v.stages.dread, 'warned');
    assert.match(v.lines[0], /^Fear has not let go of you: the wound you saw in the mirror and the blood you wiped from the room\./);
    assert.doesNotMatch(v.lines.join(' '), /\d/, 'prose, never a count');
    assert.deepEqual(lotmMindNote({dread: 'clear', fascination: 'clear'}, v.stages), ['Fear has not let go of you.']);
    assert.deepEqual(lotmMindNote(null, v.stages), [], 'the first read after load only records');
    // Save, reload: the rows come back from the mood slice; nothing new is keyed.
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.deepEqual(Object.keys(saved), ['moodThoughts']);
    assert.ok(saved.moodThoughts.rows.every(r => r.holder === LOTM_MIND_HOLDER && r.source.startsWith('mind.dread.')));
    domainRegistry.load(saved);
    assert.equal(lotmMindView(s).stages.dread, 'warned');
    s.clock = 200; witness(s, 'k.mass');
    const lines = applyMindMarks(collectMindMarks(s, ACTS), s.clock);
    assert.deepEqual(lines, ['The quiet of the cathedral at Mass eased the wound you saw in the mirror.']);
    assert.equal(lotmMindView(s).stages.dread, 'clear');
});

test('the route opens at the third mark with a window; an ordinary man is left shaken, a Beyonder feeds the one loss inbox', () => {
    for(const beyonder of [false, true]) {
        domainRegistry.load({});
        const s = state(100, beyonder);
        for(const k of ['k.mirror', 'k.blood', 'k.losing']) { witness(s, k); s.clock += 10; }
        applyMindMarks(collectMindMarks(s, ACTS), s.clock);
        const v = lotmMindView(s);
        assert.equal(v.stages.dread, 'route');
        assert.match(v.lines[0], beyonder ? /will press on your control/ : /will stay with you for days/);
        assert.match(v.lines[0], /within 24 hours/);
        s.clock += MIND_DIALS.windowMinutes;
        assert.equal(lotmMindDue(s, {skipping: true}), null, 'skipped time never closes a route (BHR18)');
        const due = lotmMindDue(s);
        assert.equal(due.inbox.length, beyonder ? 1 : 0);
        if(beyonder) assert.deepEqual({key: due.inbox[0].key, amount: due.inbox[0].amount}, {key: LOTM_INBOX.loss, amount: 1}, 'below the pre-sign line, on the one carrier');
        assert.equal(lotmMindView(s).stages.dread, 'route', 'nothing changes until the commit after the save');
        due.commit();
        assert.equal(lotmMindView(s).stages.dread, 'clear');
        assert.equal(lotmMindDue(s), null, 'closed once');
        const left = runningThoughts(domainRegistry.save({}).moodThoughts ?? {rows: []}, LOTM_MIND_HOLDER, s.clock);
        assert.deepEqual(left.map(r => r.source), beyonder ? [] : ['mind.shaken.dread']);
    }
});

test('an untouched life writes no mood key', () => { domainRegistry.load({}); assert.equal(domainRegistry.save({}).moodThoughts, undefined); });
