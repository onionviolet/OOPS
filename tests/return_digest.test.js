import test from 'node:test';
import assert from 'node:assert/strict';
import {spanPhrase, agoPhrase, groupDigest, returnDigest, digestFigure} from '../src/return_digest.js';
import {validateFigureSpec, figureText} from '../src/ui/figure.js';
import {RETURN_DIGEST_FIXTURE, RETURN_DIGEST_SAMPLE} from '../src/ui/preview/fixtures/time.js';
import {configureReturnDigest, validateReturnDigest} from '../src/return_digest_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {createExpansionState, commitAction, advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {createChronicle} from '../src/chronicle.js';

const calendar = {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1};

test('time reads as phrases, not minutes (LSD161)', () => {
    assert.equal(spanPhrase(5), 'a few minutes');
    assert.equal(spanPhrase(60), 'about an hour');
    assert.equal(spanPhrase(300), 'about 5 hours');
    assert.equal(spanPhrase(720), 'about half a day');
    assert.equal(spanPhrase(1440), 'about a day');
    assert.equal(spanPhrase(3 * 1440), 'about 3 days');
    assert.equal(spanPhrase(21 * 1440), 'about 3 weeks');
    assert.equal(agoPhrase(995, 1000), 'just now');
    assert.throws(() => spanPhrase(-1));
});

test('digest groups by person first, then you, around and missed; repeats and old lines drop', () => {
    const d = groupDigest({clock: 1000, seenAt: 200,
        people: [{id: 'tobb', name: 'Old Tobb', memories: [{at: 900, text: 'Asked about the debt.'}]},
            {id: 'mara', name: 'Mara Venn', memories: [{at: 500, text: 'Lent you her lantern.'}, {at: 800, text: 'Asked where you went.'}, {at: 100, text: 'Too old.'}]},
            {id: 'quiet', name: 'Quiet one', memories: []}],
        own: [{at: 950, text: 'Finished the road check.'}],
        around: [{at: 600, text: 'The market closed early.'}, {at: 800, text: 'Asked where you went.'}],
        missed: [{at: 700, text: 'The visiting group left.'}]});
    assert.equal(d.visible, true);
    assert.deepEqual(d.groups.map(g => g.label), ['Mara Venn', 'Old Tobb', 'You', 'Around', 'Missed']);
    assert.deepEqual(d.groups[0].lines.map(l => l.text), ['Asked where you went.', 'Lent you her lantern.']);
    assert.equal(d.groups[3].lines.length, 1, 'a line already under a person is not repeated');
    assert.equal(d.spanText, 'about half a day');
    assert.equal(d.groups[0].lines[0].when, 'about 3 hours ago');
    assert.match(d.text, /^While you were away \(about half a day\): Mara Venn: Asked where you went; Lent you her lantern\. Old Tobb:/);
});

test('digest stays hidden below the dial, with no lines, without a marker, and clamps a future marker', () => {
    const people = [{id: 'a', name: 'A', memories: [{at: 950, text: 'Waved.'}]}];
    assert.equal(groupDigest({clock: 1000, seenAt: 900, people}).visible, false, 'under four hours');
    assert.equal(groupDigest({clock: 1000, seenAt: 900, people, threshold: 60}).visible, true, 'a world can lower the dial');
    assert.equal(groupDigest({clock: 1000, seenAt: 0}).visible, false, 'nothing to say');
    assert.equal(groupDigest({clock: 1000, seenAt: null, people}).visible, false);
    assert.equal(groupDigest({clock: 1000, seenAt: 5000, people}).seenAt, 1000);
});

test('adapter reads real state: your finished work and a known person, read only', () => {
    const state = initializeExpedition(createExpansionState(7));
    const plan = commitAction(state, registry, 'village.waypost', {actorId: 'player', worldId: 'base.frontier', external: {money: 10},
        facts: {location: 'Village', 'village.elderMet': true, perception: 0}, gameplay: {player: {inventory: {},
            skills: {Perception: {xp: 0, parent: null, enabled: true}}, reputation: {Village: 0}}}});
    const done = advanceSimulation(plan.state, registry, 300, plan.external, plan.gameplay).state;
    done.chronicle = createChronicle(0, calendar);
    done.chronicle.relationships.villageElder.memories.push({id: 'm1', at: 290, text: 'The elder thanked you for the records.'});
    const before = structuredClone(done);
    const d = returnDigest(done, registry, {facts: {location: 'Village', 'village.elderMet': true}, seenAt: 0});
    assert.equal(d.visible, true);
    assert.deepEqual(d.groups.map(g => g.kind), ['person', 'you']);
    assert.equal(d.groups[0].label, 'Village elder');
    assert.ok(d.groups[1].lines.some(l => /waypost/i.test(l.text)));
    assert.deepEqual(done, before, 'read only');
});

test('marker slice: validated, baselined to the clock, clamped, and written on Mark as read', () => {
    assert.throws(() => validateReturnDigest({schema: 2, seenAt: 0}));
    assert.throws(() => validateReturnDigest({schema: 1, seenAt: -1}));
    assert.throws(() => validateReturnDigest({schema: 1, seenAt: 1, extra: true}));
    assert.equal(validateReturnDigest(null), null);
    let clock = 500, writes = 0, writable = true;
    configureReturnDigest({root: () => ({clock}), persist: () => {writes++;}, writable: () => writable});
    domainRegistry.load({});
    assert.equal(domainRegistry.project('returnDigest').seenAt, 500, 'a save without the slice starts at the current clock');
    domainRegistry.load({returnDigest: {schema: 1, seenAt: 9000}});
    assert.equal(domainRegistry.project('returnDigest').seenAt, 500, 'an imported marker ahead of its clock clamps');
    domainRegistry.load({returnDigest: {schema: 1, seenAt: 100}});
    assert.deepEqual(domainRegistry.save({}).returnDigest, {schema: 1, seenAt: 100});
    clock = 900; writable = false;
    assert.throws(() => domainRegistry.command('returnDigest', 'markRead')(), /stays unread/);
    writable = true;
    domainRegistry.command('returnDigest', 'markRead')();
    assert.equal(writes, 1);
    assert.deepEqual(domainRegistry.save({}).returnDigest, {schema: 1, seenAt: 900});
    assert.throws(() => domainRegistry.validate({returnDigest: {schema: 1, seenAt: 'x'}}));
});

test('gallery fixture is the same digest as a figure with a text form (UR37)', () => {
    validateFigureSpec(RETURN_DIGEST_FIXTURE);
    const text = figureText(RETURN_DIGEST_FIXTURE);
    for (const g of RETURN_DIGEST_SAMPLE.groups) for (const l of g.lines) assert.ok(text.includes(l.text.replace(/[.\s]+$/, '')), l.text);
    assert.ok(text.includes('Missed · 1 (strained)'));
    assert.equal(digestFigure(groupDigest({clock: 10, seenAt: 10})).summary, 'Nothing new since you last looked.');
});
