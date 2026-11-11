// STN19 through the real host: a constable's notes make a case in the panel view; each route saves its closure with the player's own note.
import test from 'node:test';
import assert from 'node:assert/strict';
import {bare, hostOver} from './lotm_helpers.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHeatPurse} from '../src/heat.js';
import '../src/book_world_lotm_law.js';
import {migrateLaw, lawRestore} from '../src/book_world_lotm_law.js';
import {SIGHT_KEY, LOOK_KEY} from '../src/observed_look.js';

const note = (value, cause) => ({value, stage: 'seen', at: 100, cause});
function over(look = 'plain clothes', money = 500) {
    lawRestore(migrateLaw(null));
    const o = hostOver(bare(money)); o.host.enroll('probationer'); o.box.p.external = {...o.box.p.external, money};
    configureHeatPurse({balance: () => o.host.purseBalance(), pay: amount => o.host.payFine(amount)});
    const k = o.box.p.state.simulation.knowledge;
    k['book.lotm.constable.1'] = {[SIGHT_KEY]: note('fought you and lost', 'tempo-sight:t1'), [LOOK_KEY]: note(look, 'tempo-sight:t1')};
    return o;
}
const fined = () => domainRegistry.project('heat')?.fines ?? [];

test('the panel view lists the open case and its routes (STN19)', () => {
    const o = over();
    const law = o.host.view().law;
    assert.equal(law.cases.length, 1);
    assert.deepEqual(law.cases[0].routes.map(r => r.id), ['talk', 'pay', 'papers', 'flee']);
});
test('a look that no longer matches shows no case (AD38)', () => {
    assert.equal(over('a stranger in a dock coat').host.view().law, null);
});
test('talk saves the closure and the player\'s own note; the case does not come back', () => {
    const o = over();
    const id = o.host.view().law.cases[0].id;
    const line = o.host.lawRoute(id, 'talk');
    assert.match(line, /warning/);
    assert.equal(o.host.view().law.cases.length, 0);
    assert.ok(Object.keys(o.box.p.state.simulation.knowledge.player).some(k => k.startsWith('book.lotm.law_')));
    assert.deepEqual(domainRegistry.project('lotm_law').closed.map(c => c.how), ['talked']);
});
test('flee records a known act with the police', () => {
    const o = over();
    o.host.lawRoute(o.host.view().law.cases[0].id, 'flee');
    assert.ok((domainRegistry.project('heat').heat.find(h => h.authority === 'tingen_police')?.value ?? 0) >= 1);
});
test('pay settles through the purse and the fine row is settled', () => {
    const o = over('plain clothes', 500);
    const before = o.box.p.external.money;
    assert.equal(before, 500);
    o.host.lawRoute(o.host.view().law.cases[0].id, 'pay');
    assert.equal(before - o.box.p.external.money, 90);
    assert.ok(fined().every(f => f.settled));
});
test('pay with too little money is refused and nothing closes', () => {
    const o = over('plain clothes', 10);
    assert.throws(() => o.host.lawRoute(o.host.view().law.cases[0].id, 'pay'), /short of the fine/);
    assert.equal(o.host.view().law.cases.length, 1);
});
