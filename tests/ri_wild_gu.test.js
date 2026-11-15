import test from 'node:test';
import assert from 'node:assert/strict';
import {RI_WILD_GU_DIALS as D, RI_WILD_GU_KINDS, riWildGuKind, riWildGuRecipe, riWildGuReadiness, riWildGuWorld, riBeginWildGu, riFinishWildGu,
    riRefineWildGu, riWildGuLabel} from '../src/ri_wild_gu.js';

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
    const r = riRefineWildGu({seed: 7, ordinal: 1, essence: 44});
    assert.equal(r.ok, true);
    assert.equal(r.product.kind, riWildGuKind(7, 1));
    assert.equal(r.product.rank, 1);
    assert.equal(r.product.holder, 'player');
    assert.deepEqual(r.spent, {essence: D.parts.value, eyes: 0, wildGu: 1});
    assert.equal(r.world.gu.find(g => g.wild).fate, 'consumed');
    assert.match(r.line, new RegExp(riWildGuLabel(r.kind)));
    assert.doesNotMatch(r.line, /[a-z]+-[a-z]+|ri\./, 'player words, no engine ids');
});

test('a cowed Gu takes the eye and less essence', () => {
    const r = riRefineWildGu({seed: 7, ordinal: 1, essence: 44, eyes: 2, cowed: true});
    assert.equal(r.ok, true);
    assert.deepEqual(r.spent, {essence: D.cowedParts.value, eyes: D.eyes.value, wildGu: 1});
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
    assert.equal(save.expansion.actors.player.facts[`${W}.refined`], 1);
    assert.deepEqual(g.errors, []);
});
