import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureLamplight, setLamplightState, lamplightState, quoteLamp, executeLamp, validateLamplight, LAMP, OIL, FLASK_MINUTES, LAMP_LIGHT} from '../src/lamplight_domain.js';
import {readingLightFactor} from '../src/reveal_chain.js';
import {setCurrentLocation} from '../src/runtime_state.js';
import {current_game_time} from '../src/game_time.js';

const DEPTHS = {id: 'Cave depths', types: [{type: 'narrow', stage: 1}, {type: 'dark', stage: 2}]};
const VILLAGE = {id: 'Village', types: []};
const at = (location, hour) => { setCurrentLocation(location); current_game_time.hour = hour; current_game_time.minute = 0; };

// Tools-domain ports as main.js passes them, over a plain inventory owner. The actor sums light
// sources the way Hero.nativeLightBonus does; `gear` stands in for the living-gear aura.
function setup({lamp = 1, oil = 2, gear = 0} = {}) {
    const inv = {counts: {[LAMP]: lamp, [OIL]: oil}}, sources = new Map(), log = [], revealed = new Set(), env = {failWrite: false, writes: 0, gear};
    const actor = {setNativeLightSource: (id, reader) => sources.set(id, reader), nativeLightBonus: () => env.gear + [...sources.values()].reduce((n, r) => n + r(), 0)};
    configureLamplight({actor: () => actor, count: id => inv.counts[id] || 0, itemOwners: () => [inv], assertSpend: id => { if (!inv.counts[id]) throw Error('Not held.'); },
        removeItem: (id, n) => { inv.counts[id] -= n; }, persist: mark => { if (env.failWrite) throw Error('Disk full.'); env.writes++; mark(); },
        writable: () => true, location: () => globalThis.__lampPlace, refresh() {}, logMessage: m => log.push(m),
        locationRevealed: id => revealed.has(id), revealLocation: id => revealed.add(id)});
    setLamplightState(domainRegistry.list().find(d => d.id === 'lamplight').migrate(undefined));
    return {inv, actor, log, revealed, env};
}
const place = location => { globalThis.__lampPlace = location.id; };
const use = () => executeLamp(quoteLamp());
const tick = minutes => domainRegistry.list().find(d => d.id === 'lamplight').tick(minutes);

test('old save without the slice: unlit, empty lamp, nothing noticed, nothing saved', () => {
    setup();
    assert.deepEqual(lamplightState(), {schema: 1, lit: false, oil: 0, noticed: {}});
    const envelope = domainRegistry.save({});
    assert.equal(Object.hasOwn(envelope, 'lamplight'), false);
});

test('lighting spends one flask inside one durable write; putting out keeps the oil', () => {
    const s = setup();
    assert.equal(use().spend, 1);
    assert.equal(s.inv.counts[OIL], 1); assert.equal(s.env.writes, 1);
    assert.deepEqual(lamplightState(), {schema: 1, lit: true, oil: FLASK_MINUTES, noticed: {}});
    assert.equal(s.actor.nativeLightBonus(), LAMP_LIGHT);
    place(VILLAGE); at(VILLAGE, 12); tick(30);
    assert.equal(use().action, 'out');
    assert.equal(lamplightState().oil, FLASK_MINUTES - 30); assert.equal(s.actor.nativeLightBonus(), 0);
    assert.equal(use().spend, 0, 'relighting burns the oil already in the lamp');
    assert.equal(s.inv.counts[OIL], 1);
});

test('refusals: no lamp, dry lamp with no oil, stale quote; a failed write conserves the flask', () => {
    setup({lamp: 0});
    assert.match(quoteLamp().reason, /oil lamp/);
    setup({oil: 0});
    assert.match(quoteLamp().reason, /no lamp oil/);
    const s = setup();
    const quoted = quoteLamp();
    use(); use();
    assert.throws(() => executeLamp(quoted), /changed/);
    const t = setup({oil: 1});
    t.env.failWrite = true;
    assert.throws(use, /Disk full/);
    assert.equal(t.inv.counts[OIL], 1);
    assert.deepEqual(lamplightState(), {schema: 1, lit: false, oil: 0, noticed: {}});
    assert.equal(s.env.writes, 2);
});

test('the flask burns out; a lamp that leaves the pack stops shining', () => {
    const s = setup();
    place(VILLAGE); at(VILLAGE, 12); use();
    tick(FLASK_MINUTES + 10);
    assert.deepEqual([lamplightState().lit, lamplightState().oil], [false, 0]);
    assert.match(s.log.at(-1), /gutters out/);
    use(); s.inv.counts[LAMP] = 0;
    assert.equal(s.actor.nativeLightBonus(), 0, 'support loss: no light the moment the lamp is gone');
    tick(5);
    assert.equal(lamplightState().lit, false); assert.match(s.log.at(-1), /light is gone/);
});

test('reading pace: lamplight speeds night reading, not daylight; no lamp keeps native pace', () => {
    setup();
    place(VILLAGE); at(VILLAGE, 22);
    assert.equal(readingLightFactor(), 1);
    use();
    assert.equal(readingLightFactor(), 1.2);
    at(VILLAGE, 12);
    assert.equal(readingLightFactor(), 1);
});

test('Cave depths: enough light reveals the loose wall; the gear aura alone is too dim; once only', () => {
    const dim = setup({lamp: 0, gear: 25});
    place(DEPTHS); at(DEPTHS, 12);
    tick(60);
    assert.equal(dim.revealed.size, 0, 'light 45 shows nothing');
    assert.deepEqual(lamplightState().noticed, {});
    const s = setup();
    place(DEPTHS); at(DEPTHS, 12); use();
    tick(15);
    assert.equal(s.revealed.size, 0); assert.deepEqual(lamplightState().noticed, {'Cave depths': 15});
    tick(10);
    assert.deepEqual([...s.revealed], ['Suspicious wall']);
    assert.match(s.log.at(-1), /loose mortar/);
    assert.equal(lamplightState().oil, FLASK_MINUTES - 25);
    s.revealed.clear(); tick(30);
    assert.equal(s.revealed.size, 0, 'a place shows its detail once');
    const done = setup();
    done.revealed.add('Suspicious wall'); place(DEPTHS); use(); tick(30);
    assert.deepEqual(lamplightState().noticed, {}, 'an already open route needs no notice');
});

test('slice round trip through the registry; malformed slices refuse', () => {
    const s = setup();
    place(DEPTHS); at(DEPTHS, 12); use(); tick(7);
    const envelope = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.deepEqual(envelope.lamplight, {schema: 1, lit: true, oil: FLASK_MINUTES - 7, noticed: {'Cave depths': 7}});
    validateLamplight(envelope.lamplight);
    setLamplightState(null);
    domainRegistry.list().find(d => d.id === 'lamplight').load(domainRegistry.list().find(d => d.id === 'lamplight').migrate(envelope.lamplight));
    assert.deepEqual(lamplightState(), envelope.lamplight);
    assert.equal(s.actor.nativeLightBonus(), LAMP_LIGHT);
    for (const bad of [{schema: 2, lit: false, oil: 0, noticed: {}}, {schema: 1, lit: true, oil: 0, noticed: {}}, {schema: 1, lit: false, oil: FLASK_MINUTES + 1, noticed: {}},
        {schema: 1, lit: false, oil: 0, noticed: {Village: 3}}, {schema: 1, lit: false, oil: 0, noticed: {'Cave depths': 99}}, {schema: 1, lit: 'yes', oil: 0, noticed: {}}])
        assert.throws(() => validateLamplight(bad), /lamplight|lamp/);
});
