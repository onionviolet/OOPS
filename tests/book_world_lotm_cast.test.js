import test from 'node:test';
import assert from 'node:assert/strict';
import {LOTM_CAST, lotmAnchorProbes, validateLotmCast} from '../src/book_world_lotm_cast.js';
import {lintAnchors, whereabouts} from '../src/cast_schedule.js';
import {defineBeats, newBeatState, resolveBeats} from '../src/beat_records.js';

const person = suffix => LOTM_CAST.people.find(p => p.indexId === `lotm.person.${suffix}`);
const at = (day, hour) => ({calendar: {year: 999, month: 1, day, day_count: day, hour, minute: 0}});
const copy = () => structuredClone(LOTM_CAST);

test('cast rows have evidence, valid schedules, resolved references and bounded strings', () => {
    assert.deepEqual(validateLotmCast(), []);
    assert.equal(LOTM_CAST.timeModel.label, 'U');
    assert.equal(LOTM_CAST.people.filter(p => p.tier === 'principal').length, 8);
    assert.equal(LOTM_CAST.people.filter(p => p.tier === 'recurring').length, 12);
    assert.equal(new Set(LOTM_CAST.schedule.map(s => s.id)).size, LOTM_CAST.schedule.length);
    const roles = LOTM_CAST.people.filter(p => p.tier === 'role');
    assert.equal(new Set(roles.map(p => p.roleKey)).size, roles.length);
    for (const p of roles) assert.equal(p.knows, undefined);
    for (const p of LOTM_CAST.people.filter(p => p.tier === 'principal')) {
        assert.ok(Array.isArray(p.relations) && Array.isArray(p.knows) && Array.isArray(p.wants));
    }
    for (const row of LOTM_CAST.schedule) {
        assert.doesNotThrow(() => whereabouts([row], row.actor, at(1, 12)));
    }
    assert.doesNotThrow(() => defineBeats(LOTM_CAST.beats));
    assert.ok(Object.isFrozen(LOTM_CAST.people[0].relations));
});

test('undated anchors conservatively lint every actor and daily fills end at the slice boundary', () => {
    const probes = lotmAnchorProbes();
    for (const p of LOTM_CAST.people) {
        const anchors = LOTM_CAST.anchors.filter(a => a.actor === p.id);
        if (anchors.length) assert.ok(probes.some(a => a.actor === p.id));
        assert.deepEqual(lintAnchors(LOTM_CAST.schedule.filter(r => r.actor === p.id),
            probes.filter(a => a.actor === p.id)), []);
    }
    const dunn = person('dunn-smith');
    const conflicting = {...LOTM_CAST.schedule.find(r => r.actor === dunn.id && r.source === 'fill'), recurrence: 'daily'};
    assert.ok(lintAnchors([conflicting], probes).length > 0, 'date-free office fill must not override a later appearance');
    const baker = person('wendy-sline');
    assert.ok(whereabouts(LOTM_CAST.schedule, baker.id, at(7, 8)).place);
    assert.equal(whereabouts(LOTM_CAST.schedule, baker.id, at(8, 8)).place, null);
    for (const name of ['melissa', 'dunn-smith', 'luo-shan']) {
        const fill = LOTM_CAST.schedule.find(r => r.actor === person(name).id && r.source === 'fill');
        assert.equal(fill.recurrence, 'irregular', 'undated forward anchors keep the proposed duty phase inactive');
    }
});

test('unsettled dates cannot assert early outcomes and absent mechanisms block their own beats', () => {
    const klein = person('klein-moretti');
    const first = LOTM_CAST.beats.find(b => b.actor === klein.id && b.scene === 'lr.lotm.main.001');
    const ritual = LOTM_CAST.beats.find(b => b.scene === 'lr.lotm.main.109');
    const {state} = resolveBeats(LOTM_CAST.beats, newBeatState(), 1);
    assert.equal(state.done[first.id].status, 'carried');
    assert.equal(state.done[ritual.id].status, 'deferred');
    assert.equal(state.facts[ritual.effects[0].fact], undefined);
    const final = resolveBeats(LOTM_CAST.beats, newBeatState(), 7).state;
    assert.equal(final.done[ritual.id].status, 'blocked');
    assert.ok(final.done[ritual.id].causes.some(c => c.mechanism === 'lotm.cheat-space'));
    const dated = {...ritual, dayIndex: 3, until: 3};
    const bound = resolveBeats([dated], newBeatState({[ritual.needs.fact]: true}), 3).state;
    assert.equal(bound.done[ritual.id].status, 'blocked', 'binding a date does not supply a mechanism');
    const offered = resolveBeats([dated], newBeatState({[ritual.needs.fact]: true}), 3,
        {mechanisms: ['lotm.cheat-space']}).state;
    assert.equal(offered.done[ritual.id].status, 'carried');
});

test('mentions do not move Benson, relocate Melissa to the market or promote the remote members', () => {
    const benson = person('benson'), melissa = person('melissa');
    assert.equal(LOTM_CAST.schedule.filter(r => r.actor === benson.id).length, 0);
    assert.equal(LOTM_CAST.beats.filter(b => b.actor === benson.id).length, 0);
    assert.equal(LOTM_CAST.beats.some(b => b.actor === melissa.id && b.scene === 'lr.lotm.main.107'), false);
    for (const suffix of ['audrey-hall', 'alger-wilson']) {
        assert.equal(person(suffix), undefined);
        const ref = LOTM_CAST.references.find(r => r.indexId === `lotm.person.${suffix}`);
        assert.equal(ref.tier, 'M1');
        assert.ok(LOTM_CAST.remoteWhereabouts.some(r => r.actor === ref.id));
        assert.equal(LOTM_CAST.beats.some(b => b.actor === ref.id), false);
    }
    const young = person('young-detective');
    assert.equal(young.sameActorAs, person('leonard-mitchell').id);
    assert.equal(LOTM_CAST.schedule.some(r => r.actor === young.id), false);
});

test('validator rejects missing provenance, dangling beats, invalid times and oversized prose', () => {
    const pack = copy();
    delete pack.schedule[0].locator;
    pack.schedule[1].from = 1440;
    pack.schedule.find(r => r.source === 'fill').basis = '';
    pack.beats[0].actor = 'missing-person';
    pack.beats[1].place = 'missing-place';
    delete pack.beats[2].needs;
    pack.people[0].knows[0].since = null;
    pack.people[0].name = 'x'.repeat(201);
    const errors = validateLotmCast(pack);
    for (const match of [/evidence/, /from before to/, /fill basis/, /actor missing/, /place missing/,
        /undated knowledge/, /string over 200/, /dated window gate/]) assert.ok(errors.some(e => match.test(e)), String(match));
});
