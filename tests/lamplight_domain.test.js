import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {configureLamplight, setLamplightState, lamplightState, lamplightPresentation, quoteLamp, executeLamp, validateLamplight, LAMP, OIL, FLASK_MINUTES, LAMP_LIGHT} from '../src/lamplight_domain.js';
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
        writable: () => !env.paused, location: () => globalThis.__lampPlace, refresh() {}, logMessage: m => log.push(m),
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

test('lamp presentation is a read-only view of loaded fuel, carried stock, and active burn',()=>{
    const s=setup({lamp:1,oil:2});place(VILLAGE);const before=JSON.stringify([lamplightState(),s.inv]);
    assert.equal(lamplightPresentation().held,true);assert.equal(lamplightPresentation().oil,0);
    assert.equal(JSON.stringify([lamplightState(),s.inv]),before);
    use();const reading=lamplightPresentation();assert.equal(reading.shining,true);assert.equal(reading.oil,FLASK_MINUTES);
    assert.equal(s.inv.counts[OIL],1);
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

// Registry ticks settle fuel before the native reading consumer runs.
test('elapsed reading gets the final and fractional fueled interval; projections stay current', () => {
    setup(); place(VILLAGE); at(VILLAGE, 22);
    setLamplightState({schema: 1, lit: true, oil: 0.5, noticed: {}});
    tick(1);
    assert.equal(readingLightFactor(), 1, 'current light is already out');
    assert.equal(readingLightFactor(1), 1.1, 'half a minute really had lamplight');
    assert.equal(lamplightState().oil, 0);
    current_game_time.goUp(1);
    assert.equal(readingLightFactor(1), 1, 'elapsed light is not a future buff');
    setLamplightState({schema: 1, lit: true, oil: 1, noticed: {}});
    tick(1);
    assert.equal(readingLightFactor(1), 1.2);
    setLamplightState({schema: 1, lit: false, oil: 0, noticed: {}});
    assert.equal(readingLightFactor(1), 1, 'restoring a state drops the transient interval');
});

test('elapsed light respects daylight, alternate light, custody loss and paused ticks', () => {
    const s = setup({gear: 60}); place(VILLAGE); at(VILLAGE, 22);
    setLamplightState({schema: 1, lit: true, oil: 0.5, noticed: {}});
    tick(1);
    assert.equal(readingLightFactor(1), 1.3, 'another source already reaches full light');
    at(VILLAGE, 12); use(); tick(FLASK_MINUTES);
    assert.equal(readingLightFactor(FLASK_MINUTES), 1, 'daylight supplies the light already');
    at(VILLAGE, 22); s.env.gear = 0;
    setLamplightState({schema: 1, lit: true, oil: 4, noticed: {}});
    s.env.paused = true; tick(1);
    assert.equal(lamplightState().oil, 4);
    s.env.paused = false; s.inv.counts[LAMP] = 0; tick(1);
    assert.equal(readingLightFactor(1), 1);
    assert.equal(lamplightState().oil, 4, 'custody loss preserves the unburned oil');
});

test('inspection keeps counting post-expiry minutes from a sufficient independent light', () => {
    setup({gear: 60}); place(DEPTHS); at(DEPTHS, 12);
    setLamplightState({schema: 1, lit: true, oil: 5, noticed: {}});
    tick(25);
    const whole = structuredClone(lamplightState());
    setup({gear: 60}); place(DEPTHS); at(DEPTHS, 12);
    setLamplightState({schema: 1, lit: true, oil: 5, noticed: {}});
    tick(5); tick(20);
    assert.deepEqual(lamplightState(), whole, 'boundary-aligned and whole domain advances agree');
    assert.equal(Object.values(whole.noticed)[0], 20);
});

test('projection and quote are read-only; stale expiry command cannot spend twice', () => {
    const s = setup(); place(VILLAGE); at(VILLAGE, 22); use();
    setLamplightState({...lamplightState(), oil: 1});
    const quote = quoteLamp();
    const before = JSON.stringify([lamplightState(), s.inv, s.env.writes]);
    for (let i = 0; i < 3; i++) { domainRegistry.project('lamplight'); quoteLamp(); readingLightFactor(); }
    assert.equal(JSON.stringify([lamplightState(), s.inv, s.env.writes]), before);
    tick(1);
    assert.throws(() => executeLamp(quote), /changed/);
    assert.equal(s.inv.counts[OIL], 1);
    assert.equal(s.log.filter(m => /gutters out/.test(m)).length, 1);
    tick(2);
    assert.equal(s.log.filter(m => /gutters out/.test(m)).length, 1);
});
