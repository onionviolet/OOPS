// WER9 for skills (skill_carry.js): what the Village hero's skills do inside a lead life's body. The pure rules first, then one real crossing:
// the Village hero trains a mind skill and a body skill, Harry's life begins, and the body skill stops counting while it learns back faster.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {CARRY_DIALS, carryDial, carryEffects, skillKind, takeCarried} from '../src/skill_carry.js';
import {migrateSkillRecords, freshSkillRecords} from '../src/skill_records.js';
import {boot, ROOT} from '../scripts/headless/runner.mjs';

const HP = 'book.hp.lead.world', PANEL = '#workspace_navigation select[aria-label="Other known panels"]';

test('every native skill has a kind: reading, patience and craft know-how are mind, breath, sight and weapon hands are body', () => {
    assert.deepEqual([['Literacy', 'Character'], ['Patience', 'Activity'], ['Meditation', 'Activity'], ['Cooking', 'Crafting'], ['Perception', 'Character']].map(([id, c]) => skillKind(id, c)), Array(5).fill('mind'));
    assert.equal(skillKind('Crafting', 'Crafting'), 'mind');
    assert.deepEqual(['Breathing', 'Night vision', 'Swords', 'Running', 'Iron skin'].map(id => skillKind(id, 'Weapon')), Array(5).fill('body'));
});

test('a mind skill keeps its level; a body skill stops counting and learns back faster until it is back where it was', () => {
    const dial = carryDial(HP), kinds = {Patience: 'mind', Breathing: 'body'}, names = {Patience: 'Patience', Breathing: 'Breathing'};
    const at = levels => carryEffects({Patience: 4, Breathing: 6}, dial, levels, kinds, names);
    const fresh = at({Patience: 4, Breathing: 6});
    assert.deepEqual(fresh.levelBonus, {Breathing: -6}, 'only the body skill is cut');
    assert.deepEqual(fresh.xp, {Breathing: 1.5}, 'and it learns back at 1.5 times the speed');
    assert.match(fresh.rows.find(r => r.id === 'Patience').text, /^Memory: you kept all 4 levels/);
    assert.match(fresh.rows.find(r => r.id === 'Breathing').text, /none of the 6 levels count here.*50% faster.*level 6/);
    assert.deepEqual(at({Patience: 4, Breathing: 2}).levelBonus, {Breathing: -2}, 'a level never drops below what the skill has now');
    assert.deepEqual(at({Patience: 4, Breathing: 12}).xp, {}, 'the head start ends once the body level is back where it was');
    assert.match(at({Patience: 4, Breathing: 12}).rows[1].text, /back at the level you brought/);
});

test('a carrier lets a body skill cross whole, and a dial row keeps part of a level; no dial row, no change', () => {
    const dial = {...carryDial(HP), carriers: {Breathing: 'the old breathing drill'}};
    const e = carryEffects({Breathing: 6}, dial, {Breathing: 6}, {Breathing: 'body'}, {Breathing: 'Breathing'});
    assert.deepEqual([e.levelBonus, e.xp], [{}, {}]);
    assert.match(e.rows[0].text, /^Carried by the old breathing drill/);
    const half = carryEffects({Breathing: 6}, {...carryDial(HP), body: {keep: 0.5, headStart: 0.2}}, {Breathing: 6}, {Breathing: 'body'});
    assert.deepEqual([half.levelBonus, half.xp], [{Breathing: -3}, {Breathing: 1.2}]);
    assert.deepEqual(carryEffects({Breathing: 6}, null, {}, {}), {levelBonus: {}, xp: {}, rows: []});
    assert.deepEqual(Object.keys(CARRY_DIALS).sort(), ['book.hp.lead.world', 'book.lotm.tingen', 'book.ri.keeper.world']);
});

test('capture takes positive levels and legacy observations do not become life records', () => {
    const rows = [{id: 'Breathing', level: 3}, {id: 'Weightlifting', level: 0}];
    assert.deepEqual(takeCarried(rows), {Breathing: 3});
    const legacy = {...freshSkillRecords(), carried: {[HP]: {Breathing: 9}}};
    assert.deepEqual(migrateSkillRecords(legacy), freshSkillRecords());
    assert.throws(() => migrateSkillRecords({...legacy, crossing: {worldId: HP, levels: {}}}), /Invalid skill records/);
});

test('Harry\'s life: the hero\'s trained breath stops counting in his body and the fold says so; his memory skill works as before', async t => {
    if (!existsSync(join(ROOT, 'private_packs/manifest.json'))) return t.skip('local private packs not present');
    const g = await boot(null, {seed: 1});
    t.after(() => g.close());
    await g.step(150);
    const {character, skills} = g.internals, lv = character.getLevelableComponent();
    for (const id of ['Patience', 'Breathing']) for (let i = 0; i < 40 && (lv.skill_progress[id]?.current_level || 0) < 3; i++) character.addXPToSkill({skill: skills[id], xp_to_add: 200, use_bonus: false});
    const before = {Patience: lv.getTotalSkillLevel('Patience'), Breathing: lv.getTotalSkillLevel('Breathing')};
    assert.ok(lv.skill_progress.Breathing.current_level >= 3 && lv.skill_progress.Patience.current_level >= 3, 'the Village hero trained both');
    const village = await g.save();
    assert.ok(village.expansion.clock > 120);
    const cross = async () => {
        await g.fill(PANEL, 'beginning');
        await g.fill(g.$('select[data-structured-choice="life"]'), 'book.hp.lead');
        await g.click('[data-structured-begin]');
        await g.settle(400);
        return g.save();
    };
    const crossed = await cross();
    const original = crossed.skillRecords.crossing;
    assert.equal(original.worldId, HP);
    assert.equal(original.instanceId, crossed.content_packs.structured.instanceId);
    assert.equal(original.levels.Breathing, before.Breathing);
    assert.equal(original.levels.Patience, before.Patience);
    const brought = lv.skill_progress.Breathing.current_level;
    assert.equal(lv.bonus_skill_levels.flat.carried.Breathing, -brought, 'the body skill is cut by what the hero brought');
    assert.equal(lv.bonus_skill_levels.flat.carried.Patience, undefined, 'the mind skill is not');
    assert.equal(lv.xp_bonuses.multiplier.carried.Breathing, 1.5);
    assert.equal(lv.getTotalSkillLevel('Patience'), before.Patience, 'memory still works at its old level');
    assert.equal(lv.getTotalSkillLevel('Breathing'), 0, 'the old breath does not');
    const xpBefore = lv.skill_progress.Breathing.total_xp; character.addXPToSkill({skill: skills.Breathing, xp_to_add: 10, use_bonus: true});
    assert.ok(lv.skill_progress.Breathing.total_xp - xpBefore >= 14.9, 'practice in this body pays 1.5 times what it did');
    const fold = g.document.querySelector('details.skills-carried');
    assert.match(fold?.textContent ?? '', /Breathing[\s\S]*50% faster/);
    assert.match(fold.textContent, /Patience[\s\S]*Memory: you kept all/);

    const persisted = await g.save();
    await g.reload();
    assert.deepEqual((await g.save()).skillRecords.crossing, original);
    const file = await g.exportFile();
    await g.importFile(file);
    assert.deepEqual((await g.save()).skillRecords.crossing, original);
    delete persisted.skillRecords.crossing;
    await g.load(persisted);
    assert.equal((await g.save()).skillRecords.crossing, undefined, 'loading a life never invents a crossing');

    // Model a fresh origin with previous same-world carry history still in its records.
    village.expansion.sequence += 1;
    village.skillRecords = {...village.skillRecords, crossing: {...original, levels: {Breathing: 99}}};
    await g.load(village);
    await g.step(4);
    const next = (await cross()).skillRecords.crossing;
    assert.notEqual(next.instanceId, original.instanceId);
    assert.equal(next.levels.Breathing, original.levels.Breathing);
});
