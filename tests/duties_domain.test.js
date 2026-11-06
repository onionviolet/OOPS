import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_DUTIES, lotmDutyRows} from '../src/book_world_lotm_duties.js';
import {freshDuties} from '../src/recurring_duties.js';
const WEEK = 10080, ID = 'lotm.expense_claim';
let clock = 10, enrolled = true;
registerDutySet('test', {defs: LOTM_DUTIES, state: () => ({clock, enrolled}), active: s => s.enrolled, minute: s => s.clock});
const slice = () => domainRegistry.save({}).duties;
const attend = () => domainRegistry.command('duties', 'attend')({dutyId: ID});
const reset = (at = 10) => { clock = at; enrolled = true; domainRegistry.load({}); };
test('a fresh registry initializes to an empty slice and writes no key', () => {
    domainRegistry.initialize();
    assert.equal(slice(), undefined);
    assert.deepEqual(domainRegistry.project('duties').rows.map(r => r.id), [`duty:${ID}`]);
});
test('save, validate and load round-trip a played slice', () => {
    reset(); domainRegistry.tick(1); attend();
    const env = domainRegistry.save({}), saved = structuredClone(env.duties);
    assert.equal(saved.lastDone[ID], 0);
    domainRegistry.validate(env); reset(); domainRegistry.load(JSON.parse(JSON.stringify(env)));
    assert.deepEqual(domainRegistry.save({}).duties, saved);
});
test('a save without the slice, or with a foreign one, loads fresh and never throws', () => {
    reset(); domainRegistry.tick(1); attend();
    domainRegistry.validate({}); domainRegistry.load({});
    assert.equal(slice(), undefined);
    for(const foreign of [{family: 'other@9', missed: {[ID]: 5}}, 'junk', 7]) {
        domainRegistry.validate({duties: foreign}); domainRegistry.load({duties: foreign});
        assert.equal(slice(), undefined);
        assert.equal(domainRegistry.project('duties').items[0].missed, 0);
    }
});
test('a shut, unattended week is one miss read the next day, and attending clears it (older saves owe nothing)', () => {
    reset(); domainRegistry.tick(1); // first sight of the clock: nothing owed retroactively
    clock = WEEK + 1440; domainRegistry.tick(1); domainRegistry.tick(1);
    assert.equal(slice().missed[ID], 1, 'counted once');
    const item = domainRegistry.project('duties').items[0];
    assert.equal(item.missed, 1); assert.match(domainRegistry.project('duties').rows[0].why, /Missed 1 time\./);
    attend();
    assert.equal(slice().missed[ID], 0);
    assert.throws(attend, /Already attended|Returns in/);
    assert.equal(domainRegistry.project('duties').items.length, 0);
});
test('a late save (clock far ahead) owes nothing for weeks it never saw', () => {
    reset(5 * WEEK + 3); domainRegistry.tick(1);
    assert.equal(slice().missed?.[ID] ?? 0, 0);
});
test('projection rows match dutyRows and a life that is not enrolled shows nothing and keeps no time', () => {
    reset(); domainRegistry.tick(1);
    assert.deepEqual(domainRegistry.project('duties').rows, lotmDutyRows({...freshDuties(), closed: {[ID]: 0}}, clock));
    enrolled = false;
    assert.deepEqual(domainRegistry.project('duties'), {rows: [], items: [], enrolled: false});
    assert.throws(attend, /not yours/);
});
