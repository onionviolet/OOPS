import test from 'node:test';
import assert from 'node:assert/strict';
import {HABITAT as H, HAY_KEY as hay, WOOL_KEY as wool, planHabitatAction, validateHabitat, carriedWool} from '../src/habitat_care.js';
import {FLEECE, fleeceChance, happinessModifier, readFleece, keeperTie, fleeceKey, SHEEP_HOLDER} from '../src/fleece_from_care.js';
import {freshThoughts, addThought, moodOf, validateThoughts} from '../src/mood_thoughts.js';
import {readSheep, sheepTieLine} from '../src/being_sheep.js';
import {validateGradedKey} from '../src/harvest.js';

// A keeper's life over the pure owners: the pen plan, its thought rows into a mood slice, and the inventory it lands in.
function life() { return {owner: null, clock: 100, money: 1000, inventory: {}, location: H.location, world: H.world, ready: true, mind: freshThoughts(), log: []}; }
function act(p, action, at = p.clock) {
    const mood = moodOf(p.mind, SHEEP_HOLDER, at), q = planHabitatAction(p.owner, action, {...p, clock: at, mood});
    let mind = p.mind; for(const t of q.thoughts) mind = addThought(mind, t, at);
    const inventory = {...p.inventory}; for(const {key, amount} of q.items) { inventory[key] = (inventory[key] || 0) + amount; if(!inventory[key]) delete inventory[key]; }
    validateHabitat(q.state, at); validateThoughts(mind);
    return {...p, clock: at, owner: q.state, money: q.money, inventory, mind, log: q.fleece ? [...p.log, q.fleece] : p.log};
}
const housed = () => act(act(life(), 'build'), 'adopt');
// Well kept: hay and a brush the moment each fleece is collected. Neglected: hay only, and an hour late each time.
function keep(p, cycles, {brush, gap}) {
    for(let i = 0; i < cycles; i++) {
        p = act(act(p, 'buy_feed'), 'feed'); if(brush) p = act(p, 'attend');
        p = act(p, 'collect', p.clock + H.batchMinutes); p = {...p, clock: p.clock + gap};
    }
    return p;
}

test('Stardew calibration: the stated deluxe roll and its documented example', () => {
    assert.equal(fleeceChance(102, 150), 0.085); // friendship 102, happiness 150 -> 8.5 percent (FarmAnimalData comment)
    assert.equal(happinessModifier(250), 375); assert.equal(happinessModifier(150), 0); assert.equal(happinessModifier(60), -40);
    assert.equal(FLEECE.divisor, 1200); assert.equal(FLEECE.deluxeMinimum, 200);
});

test('a well-kept sheep gives finer and denser fleece than a neglected one, and neglect never goes below plain', () => {
    const kept = keep(housed(), 16, {brush: true, gap: 0}), neglected = keep(housed(), 16, {brush: false, gap: 60});
    const k = kept.log.at(-1), n = neglected.log.at(-1);
    assert.ok(k.quality >= 120, `kept ${k.quality}`); assert.equal(n.quality, FLEECE.plain); assert.equal(n.key, wool);
    assert.ok(kept.log.some(f => f.deluxe), 'a tied, content sheep rolls dense fleeces'); assert.ok(!neglected.log.some(f => f.deluxe));
    assert.ok(carriedWool(kept.inventory) > carriedWool(neglected.inventory));
    assert.ok(Object.keys(kept.inventory).some(key => key !== wool && JSON.parse(key).quality > 100), 'finer wool is its own graded stack');
    for(const key of Object.keys(kept.inventory).filter(key => JSON.parse(key).id === 'Wool')) validateGradedKey(key);
    assert.ok(neglected.log.every(f => f.quality >= FLEECE.plain && f.amount >= FLEECE.base));
});

test('the needs seam reveals a missed meal on the next feeding: a short, mild sour spell, not a lasting cost', () => {
    let p = keep(housed(), 1, {brush: true, gap: 0});
    p = act(act(p, 'buy_feed'), 'feed', p.clock + 40);
    const hungry = p.mind.rows.find(r => r.source === 'hungry');
    assert.ok(hungry && hungry.magnitude < 0 && hungry.magnitude >= FLEECE.thoughts.hungry.magnitude * FLEECE.thoughts.hungry.cap);
    assert.ok(hungry.until - hungry.at <= 2 * H.careMinutes);
    assert.equal(moodOf(p.mind, SHEEP_HOLDER, hungry.until).rows.some(r => r.source === 'hungry'), false);
    assert.equal(keeperTie(p.owner), FLEECE.perBrush * 1 + FLEECE.perMeal * 2, 'the tie keeps what care built');
});

test('mood is only the sheep\'s own keyed rows: replaying an act adds nothing', () => {
    let p = act(act(housed(), 'buy_feed'), 'feed');
    const q = planHabitatAction(p.owner, 'attend', {...p, mood: moodOf(p.mind, SHEEP_HOLDER, p.clock)});
    let mind = p.mind; for(const t of q.thoughts) mind = addThought(mind, t, p.clock);
    const once = mind.rows.length; for(const t of q.thoughts) mind = addThought(mind, t, p.clock);
    assert.equal(mind.rows.length, once); assert.ok(mind.rows.every(r => r.holder === SHEEP_HOLDER && r.subject === 'player'));
});

test('the fleece draw is fixed per batch, so save, reload and import cannot reroll it', () => {
    let p = keep(housed(), 12, {brush: true, gap: 0}); p = act(act(act(p, 'buy_feed'), 'feed'), 'attend');
    const ready = {...p, clock: p.clock + H.batchMinutes}, mood = moodOf(p.mind, SHEEP_HOLDER, ready.clock);
    const a = planHabitatAction(ready.owner, 'collect', {...ready, mood});
    const reloaded = JSON.parse(JSON.stringify({owner: ready.owner, mind: ready.mind}));
    const b = planHabitatAction(reloaded.owner, 'collect', {...ready, owner: reloaded.owner, mood: moodOf(reloaded.mind, SHEEP_HOLDER, ready.clock)});
    assert.deepEqual(a.items, b.items); assert.deepEqual(a.fleece, b.fleece);
});

test('the sheep is a being record: held when bought, tied once brushed, its tie read from care counts', () => {
    const bought = housed(); assert.equal(readSheep(bought.owner).grain, 'held'); assert.match(sheepTieLine(bought.owner), /Held/);
    const kept = keep(housed(), 10, {brush: true, gap: 0}), b = readSheep(kept.owner);
    assert.equal(b.grain, 'tied'); assert.equal(b.ties[0].level, Math.floor(keeperTie(kept.owner) / 100)); assert.match(sheepTieLine(kept.owner), /of 1000/);
    assert.equal(b.custody.map(c => c.step).join(), 'bought,knows_you');
});

test('older pen saves without a last-meal receipt still load, and bad receipts reject', () => {
    const p = act(act(housed(), 'buy_feed'), 'feed'), old = structuredClone(p.owner); delete old.lastMealAt;
    assert.doesNotThrow(() => validateHabitat(old, p.clock)); assert.equal(planHabitatAction(old, 'buy_feed', p).thoughts.length, 0);
    for(const v of [-1, p.clock + 1, 1.5]) { const bad = {...structuredClone(p.owner), lastMealAt: v}; assert.throws(() => validateHabitat(bad, p.clock)); }
    assert.equal(fleeceKey(100), wool); assert.equal(fleeceKey(125), JSON.stringify({id: 'Wool', quality: 125}));
    assert.equal(readFleece({owner: p.owner}).quality, FLEECE.plain);
    assert.equal(p.inventory[hay], undefined);
});

test('the pen writes the sheep\'s rows on the root clock, so another holder\'s running thought survives a care act', async () => {
    const {configureResourceDomains, setHabitatOwner} = await import('../src/native_resources_domain.js');
    const {addMoodThought, readMood} = await import('../src/mood_thoughts_domain.js');
    const {domainRegistry} = await import('../src/domain_registry.js');
    let owner = null, money = 100, inventory = {}; const root = 4320, calendar = 6240; // root (TMR1) and calendar minutes differ, as in play
    configureResourceDomains({clock: () => calendar, rootClock: () => root, logMessage: () => {},
        habitatContext: () => ({owner, clock: calendar, money, inventory, location: H.location, world: H.world, ready: true}),
        commitHabitatPlan: plan => { owner = plan.state; setHabitatOwner(owner); money = plan.money; for(const {key, amount} of plan.items) inventory[key] = (inventory[key] || 0) + amount; }});
    addMoodThought({holder: 'other.person', subject: 'player', source: 'test', magnitude: 5, minutes: 600, line: 'Still pleased.', key: 'other:1'}, root);
    for(const a of ['build', 'adopt', 'buy_feed', 'feed']) domainRegistry.command('meadow_pen', 'act')(a);
    assert.equal(readMood('other.person', root + 1).total, 5);
    assert.ok(readMood(SHEEP_HOLDER, root).rows.some(r => r.source === 'fed'));
});
