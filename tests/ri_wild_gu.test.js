import test from 'node:test';
import assert from 'node:assert/strict';
import {RI_WILD_GU_DIALS as D, RI_WILD_GU_KINDS, riWildGuKind, riWildGuRecipe, riWildGuReadiness, riWildGuWorld, riBeginWildGu, riFinishWildGu,
    riRefineWildGu, riWildGuLabel, riWildGuCondition} from '../src/ri_wild_gu.js';
import {willContest, guWill, runWillContest, GU_WILL_DIALS} from '../src/gu_will_contest.js';
import {RI_WILD_GU_MATERIALS} from '../src/ri_wild_gu.js';

test('the found Gu is a seeded rank-one kind, the same on a replay', () => {
    const kinds = new Set();
    for(let n = 1; n <= 60; n++) {
        const kind = riWildGuKind(1234, n);
        assert.equal(kind, riWildGuKind(1234, n));
        kinds.add(kind);
    }
    const allowed = RI_WILD_GU_KINDS.filter(r => r.weight > 0).map(r => r.kind);
    assert.ok([...kinds].every(k => allowed.includes(k)), 'zero-weight kinds never come up');
    assert.ok(kinds.size > 1, 'the draw varies between finds');
    for(const row of RI_WILD_GU_KINDS) assert.ok(row.why.length > 10);
});

test('refining through the shared engine yields the drawn kind and spends the wild Gu and essence', () => {
    const r = riRefineWildGu({seed: 7, ordinal: 1, essence: 44, condition: {hunger: 1, injured: false}, refiner: {rank: 1, realm: 3, steadiness: 4}});
    assert.equal(r.ok, true);
    assert.equal(r.product.kind, riWildGuKind(7, 1));
    assert.equal(r.product.rank, 1);
    assert.equal(r.product.holder, 'player');
    assert.deepEqual(r.spent, {essence: r.contest.parts, eyes: 0, wildGu: 1});
    assert.ok(r.contest.parts <= D.parts.value, 'the reserved ceiling is the most it takes');
    // RWT22 (MR44): the same individual, claimed in place, with the find in its history and a mark of the claimer.
    assert.equal(r.world.gu.length, 1);
    assert.equal(r.product.id, 'ri.wild_gu.found');
    assert.equal(r.product.wild, undefined);
    assert.equal(r.product.provenance.found, 'wolf-tide patrol');
    assert.equal(r.product.provenance.ordinal, 1);
    assert.deepEqual(r.product.imprint, {by: 'player', strength: 1, at: 0});
    assert.match(r.line, new RegExp(riWildGuLabel(r.kind)));
    assert.doesNotMatch(r.line, /[a-z]+-[a-z]+|ri\./, 'player words, no engine ids');
});

test('a cowed Gu takes the eye and less essence', () => {
    const r = riRefineWildGu({seed: 7, ordinal: 1, essence: 44, eyes: 2, cowed: true, condition: {hunger: 0, injured: false}, refiner: {rank: 1, realm: 3, steadiness: 4}});
    assert.equal(r.ok, true);
    assert.deepEqual(r.spent, {essence: r.contest.parts, eyes: D.eyes.value, wildGu: 1});
    assert.ok(r.contest.parts <= D.cowedParts.value);
    assert.ok(D.cowedParts.value < D.parts.value);
    assert.equal(riWildGuRecipe('moonlight', {cowed: true}).stages[0].inputs[0].material, 'lightning-wolf-eye');
});

test('an empty sea, no wild Gu or no eye blocks by its mechanism and spends nothing', () => {
    for(const [args, pattern] of [[{essence: 0}, /sea is empty/], [{essence: 5}, /holds 5 parts/], [{essence: 44, wildGu: 0}, /no wild Gu in hand/],
        [{essence: 44, eyes: 0, cowed: true}, /no lightning wolf eye/]]) {
        const r = riRefineWildGu({seed: 7, ordinal: 1, ...args});
        assert.equal(r.ok, false);
        assert.match(r.reason, pattern);
        assert.deepEqual(r.spent, {essence: 0, eyes: 0, wildGu: 0});
    }
    const blocked = riWildGuReadiness({wildGu: 1, essence: 0});
    assert.equal(blocked.inputs.essence, D.parts.value, 'the row can show its inputs while blocked');
});

test('a refinement saved mid-way keeps its attempt and settles after reload', () => {
    const kind = riWildGuKind(99, 2);
    const begun = riBeginWildGu(riWildGuWorld({kind, essence: 30, eyes: 0}), {kind});
    assert.equal(begun.ok, true);
    assert.equal(begun.world.attempts[0].status, 'working');
    assert.equal(begun.world.stocks.player.primeval, 30 - D.parts.value, 'essence is reserved at the start');
    const reloaded = JSON.parse(JSON.stringify(begun.world));
    const done = riFinishWildGu(reloaded);
    assert.equal(done.status, 'complete');
    assert.equal(done.product.kind, kind);
    assert.deepEqual(done, riFinishWildGu(begun.world));
});

// ---- played through his pack (headless game, from the DEV fixture ri-fang-yuan-wild-gu; one build shared, each test boots its own copy) ----
import {boot} from '../scripts/headless/runner.mjs';
import {buildWorldFixture} from '../scripts/headless/world_fixtures.mjs';
import {RI_WILD_REFINEMENT as W, RI_WILD_NOTE, riWildGuItem} from '../src/ri_wild_gu.js';
import {RI_DAY_ITEMS} from '../src/ri_lead_day_facts.js';

const ESS = 'book.ri.lead.primeval', PANEL = '#workspace_navigation select[aria-label="Other known panels"]';
let fixture;
const start = async t => {
    fixture ??= JSON.parse(await buildWorldFixture('ri-fang-yuan-wild-gu'));
    const g = await boot(structuredClone(fixture), {seed: 1});
    t.after(() => g.close());
    return g;
};
const held = (save, id) => save.inventories.person.main_character[JSON.stringify({id})]?.count ?? 0;
const sea = save => save.expansion.simulation.energies.player[ESS].reserve;
async function row(g, op) {
    await g.fill(PANEL, 'beginning'); await g.settle(100);
    const b = g.document.querySelector(`[data-structured-action="${W}.${op}"]`);
    return {button: b, text: (b?.closest('li,div,article,section')?.textContent || '').replace(/\s+/g, ' ')};
}
async function edit(g, change) {
    const save = structuredClone(await g.save());
    change(save);
    await g.load(save); await g.settle(200);
}

test('pack: on an empty sea or with no wild Gu the row stays, blocked by that mechanism, and nothing is spent', async t => {
    const g = await start(t);
    await edit(g, save => {save.expansion.simulation.energies.player[ESS].reserve = 0;});
    let r = await row(g, 'refine');
    assert.ok(r.button, 'the row is still shown');
    assert.equal(r.button.disabled, true);
    assert.match(r.text, /sea is too low/);
    assert.match(r.text, /1 h/, 'its clock is beside the button');
    await g.click(r.button).catch(() => {});
    await g.step(70);
    let save = await g.save();
    assert.equal(held(save, RI_DAY_ITEMS.wildGu), 1);
    assert.equal(held(save, RI_DAY_ITEMS.eye), 1);
    assert.ok(RI_WILD_GU_KINDS.every(k => held(save, riWildGuItem(k.kind)) === 0));
    await edit(g, s => {s.expansion.simulation.energies.player[ESS].reserve = 44; delete s.inventories.person.main_character[JSON.stringify({id: RI_DAY_ITEMS.wildGu})];});
    r = await row(g, 'cow');
    assert.equal(r.button.disabled, true);
    assert.match(r.text, /no wild Gu in hand/);
    assert.deepEqual(g.errors, []);
});

test('pack: refining through the real command yields the drawn kind as his own Gu, and a save mid-refine keeps it', async t => {
    const g = await start(t);
    const kind = riWildGuKind(g.internals.expansionState.simulation.seed ?? 1, 1);
    let r = await row(g, 'refine');
    assert.equal(r.button.disabled, false);
    await g.click(r.button); await g.settle(100);
    await g.step(30);
    let save = await g.save();
    assert.equal(held(save, RI_DAY_ITEMS.wildGu), 0, 'the wild Gu is reserved while it is refined');
    assert.equal(sea(save), 44 - D.parts.value);
    await g.reload(); await g.settle(200);
    await g.step(40);
    save = await g.save();
    assert.equal(held(save, riWildGuItem(kind)), 1, `the refined ${kind} is his`);
    assert.equal(held(save, RI_DAY_ITEMS.eye), 1, 'the essence route leaves the eye');
    const line = save.expansion.simulation.knowledge.player[RI_WILD_NOTE].value;
    assert.match(line, new RegExp(riWildGuLabel(kind)));
    assert.ok(line.includes(`You spent ${44 - sea(save)} parts of essence`));
    assert.equal(save.expansion.actors.player.facts[`${W}.refined`], 1);
    assert.deepEqual(g.errors, []);
});

// ---- the will contest (RWT19), seeded ----
const refiner = {rank: 1, realm: 0, steadiness: 2}, ceiling = D.parts.value;
const cost = gu => willContest({gu: {rank: 1, kind: 'little-light', ...gu}, refiner, ceiling});

test('will: a hungry or hurt Gu costs less and is easier to hold, a warier or marked one costs more', () => {
    const fed = cost({hunger: 0}), starving = cost({hunger: 3}), hurt = cost({hunger: 0, injured: true});
    assert.ok(starving.parts < fed.parts && starving.odds > fed.odds);
    assert.ok(hurt.parts < fed.parts && hurt.odds > fed.odds);
    assert.ok(cost({hunger: 0, wary: 2}).odds < fed.odds, 'a failed try leaves it warier');
    const marked = cost({hunger: 0, imprint: {by: 'someone.else', strength: 2, at: 0}});
    assert.ok(marked.guWill > fed.guWill && marked.odds < fed.odds, 'RWT34: another will on the Gu adds to the work');
    assert.equal(cost({hunger: 0, imprint: {by: 'player', strength: 2, at: 0}}).guWill, fed.guWill, 'your own mark costs nothing extra');
    assert.ok(cost({hunger: 3, injured: true, kind: 'vitality-leaf'}).parts >= GU_WILL_DIALS.parts.min.value);
    assert.ok(fed.parts <= ceiling, 'never above what the command reserves');
});

test('will: a stronger Gu can beat a weak refiner, and an even or stronger refiner usually wins', () => {
    const strong = willContest({gu: {rank: 2, kind: 'little-light', hunger: 0}, refiner, ceiling});
    const strongRefiner = willContest({gu: {rank: 1, kind: 'little-light', hunger: 0}, refiner: {rank: 2, realm: 2, steadiness: 4}, ceiling});
    assert.ok(strong.odds < 500, 'a rank-two Gu is likelier to hold than the rank-one refiner');
    assert.ok(strongRefiner.odds > 850);
    const run = n => runWillContest({seed: n, drawKey: 'k', gu: 'g', condition: {rank: 2, kind: 'little-light', hunger: 0}, refiner, ceiling, material: RI_WILD_GU_MATERIALS.essence, minutes: 60});
    const held = Array.from({length: 200}, (_, n) => run(n + 1)).filter(r => r.held).length;
    assert.ok(held > 20 && held < 140, `the weak refiner sometimes holds and often does not (${held}/200)`);
    assert.deepEqual(run(5), run(5), 'a replay rolls the same');
});

test('will: "slipped your hold" is reachable, leaves the Gu in hand and warier, and the next try is harder', () => {
    let slipped = null;
    for(let seed = 1; seed <= 400 && !slipped; seed++) {
        const r = riRefineWildGu({seed, ordinal: 1, essence: 44, condition: {hunger: 0, injured: false}, refiner: {rank: 1, realm: 0, steadiness: 0}});
        if(r.slipped) slipped = {seed, r};
    }
    assert.ok(slipped, 'some seed slips');
    const {seed, r} = slipped, gu = r.world.gu[0];
    assert.equal(r.ok, false);
    assert.match(r.line, /slipped your hold/);
    assert.equal(gu.holder, 'player');
    assert.equal(gu.alive, true);
    assert.equal(gu.wild, true, 'still a wild Gu, still the same specimen');
    assert.equal(gu.wary, 1);
    assert.ok(r.spent.essence > 0 && r.spent.wildGu === 0);
    const again = riRefineWildGu({seed, ordinal: 1, essence: 44, wary: gu.wary, condition: {hunger: 0, injured: false}, refiner: {rank: 1, realm: 0, steadiness: 0}});
    assert.ok(again.contest.odds < r.contest.odds, 'warier means lower odds');
});

test('will: the find\'s condition is drawn once per find and varies between finds', () => {
    const seen = new Set();
    for(let n = 1; n <= 40; n++) {
        assert.deepEqual(riWildGuCondition(9, n), riWildGuCondition(9, n));
        seen.add(JSON.stringify(riWildGuCondition(9, n)));
    }
    assert.ok(seen.size > 3);
    assert.equal(guWill({rank: 1, kind: 'stealth-rock', hunger: 0}).value, 8 + GU_WILL_DIALS.gu.temperament['stealth-rock']);
});

test('pack: a slipped hold returns the wild Gu to his hand, warier, with the essence spent and no refined Gu', async t => {
    const g = await start(t);
    const kind = riWildGuKind(g.internals.expansionState.simulation.seed ?? 1, 1);
    await edit(g, save => {save.expansion.actors.player.facts[`${W}.wary`] = 4;});   // seed 1, ordinal 1, wary 4 rolls a slip (pure test above)
    const r = await row(g, 'refine');
    assert.equal(r.button.disabled, false);
    await g.click(r.button); await g.settle(100);
    await g.step(70);
    const save = await g.save();
    assert.equal(held(save, RI_DAY_ITEMS.wildGu), 1, 'the wild Gu is back in his hand');
    assert.equal(held(save, riWildGuItem(kind)), 0, 'no refined Gu');
    assert.equal(save.expansion.actors.player.facts[`${W}.wary`], 5, 'warier');
    assert.equal(save.expansion.actors.player.facts[`${W}.refined`] ?? 0, 0);
    assert.equal(sea(save), 44 - D.parts.value, 'the essence poured in stays spent');
    const note = save.expansion.simulation.knowledge.player[RI_WILD_NOTE].value;
    assert.match(note, /slipped your hold/);
    assert.ok(note.includes(`You spent ${44 - sea(save)} parts of essence`));
    assert.deepEqual(g.errors, []);
});

test('will: whose will resists is data, so a later mark adds to the same contest', () => {
    const gu = {rank: 1, kind: 'little-light', hunger: 0};
    const plain = willContest({gu, refiner, ceiling}), same = willContest({resist: [{source: 'gu', strength: plain.guWill}], refiner, ceiling});
    assert.deepEqual([same.parts, same.odds], [plain.parts, plain.odds]);
    const marked = willContest({resist: [{source: 'gu', strength: plain.guWill}, {source: 'mark', strength: 6}], refiner, ceiling});
    assert.ok(marked.odds < plain.odds && marked.parts >= plain.parts);
});
