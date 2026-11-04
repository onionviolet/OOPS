import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {ladderView, ladderEffects, whyLines, sealedGrants} from '../src/skill_ladder.js';
import {grantEarnedTitles, normalizeTitles} from '../src/titles.js';

const ENTRY = `export {character} from './src/data/character.js'; export {skills} from './src/data/skills.js';
export {fill_availability_methods} from './src/component_management.js';
export {domainRegistry} from './src/domain_registry.js'; export {configureSkillRecords,setRust} from './src/skill_records_domain.js';
export {configureSkillLadder} from './src/skill_ladder_domain.js'; export {readLevels} from './src/skill_ladder.js';`;

test('pure rows: perks follow the rusted level, the sealed row shows a level only, the edge is one row on both ends', () => {
    const at = (native, total) => ({Sleeping: {native, total}, Patience: {native: 0, total: 0}});
    assert.deepEqual(ladderEffects(at(5, 5)).flats, {max_stamina: 10});
    assert.deepEqual(ladderEffects(at(5, 4)).flats, {max_stamina: 5});
    assert.equal(ladderView('Sleeping', at(5, 4)).rows.find(r => r.id === 'sleeping.5').state, 'rusted');
    const ms = {10: {unlocks: {recipes: [{recipe_id: 'Secret thing'}]}}};
    assert.equal(sealedGrants(ms).length, 1);
    const sealed = ladderView('Sleeping', at(5, 5), ms);
    assert.ok(!JSON.stringify(sealed).includes('Secret thing'));
    assert.deepEqual(sealed.rows.find(r => r.at === 10), {id: 'sleeping.10', at: 10, name: '??????', text: '', effect: '', state: 'sealed'});
    assert.ok(JSON.stringify(ladderView('Sleeping', at(10, 10), ms)).includes('Secret thing'));
    assert.equal(ladderView('Sleeping', at(5, 5)).edges[0].text, ladderView('Patience', at(5, 5)).edges[0].text);
    assert.ok(whyLines(at(5, 5), {sound_sleeper: {at: 1440 * 3}}).join(' ').includes('granted day 4'));
});

test('level 4 to 5 to 4 under rust, then reload: the perk follows the level, the title stays, nothing doubles', async () => {
    const n = await loadNative(ENTRY, {stubs: STANCE_LOCATION_STUBS, prefix: 'skill-ladder-'});
    const {character, skills, domainRegistry} = n;
    n.fill_availability_methods();
    const lv = character.getLevelableComponent();
    let clock = 0;
    n.configureSkillRecords({continuation: () => null, root: () => ({clock}), actor: () => character, world: () => 'base.frontier', persist: fn => fn(), skills: () => skills});
    n.configureSkillLadder({actor: () => character, skills: () => skills});
    const grant = (id, xp) => {character.addXPToSkill({skill: skills[id], xp_to_add: xp, use_bonus: false, cap_gained_xp: false, add_to_parent: false}); character.updateStatsAndDisplay();};
    const level = id => character.getSkillXPObject({skill_id: id}).current_level;
    const settle = (minutes = 1) => {domainRegistry.tick(minutes); domainRegistry.tick(0);};
    const stamina = () => lv.stats.full.max_stamina;
    const patienceRate = () => lv.xp_bonuses.total_multiplier.Patience;
    const titles = {}, counters = () => n.domainRegistry.command('skillLadder', 'titleCounters')();
    const base = (() => {settle(); return stamina();})();

    // Level 4: row 3 pays, row 5 does not, no title yet.
    while(level('Sleeping') < 4) grant('Sleeping', 50);
    settle();
    assert.equal(level('Sleeping'), 4);
    assert.equal(stamina() - base, 5, 'only the level 3 row pays at level 4');
    const rate4 = patienceRate();
    assert.ok(Math.abs(rate4 - 1.04) < 1e-9, `edge reads Sleeping level 4: ${rate4}`);
    assert.deepEqual(grantEarnedTitles(titles, counters(), 100), []);

    // Level 5: row 5 pays, edge grows, the deed title is granted once with its date.
    while(level('Sleeping') < 5) grant('Sleeping', 50);
    settle();
    assert.equal(stamina() - base, 10);
    assert.ok(Math.abs(patienceRate() - 1.05) < 1e-9);
    assert.deepEqual(grantEarnedTitles(titles, counters(), 4321), ['sound_sleeper']);
    assert.deepEqual(titles.sound_sleeper, {at: 4321});

    // Rust on, long idle: native peak stays 5, total level drops to 4, perk and edge follow, title stays.
    n.setRust(true);
    domainRegistry.tick(30000);
    domainRegistry.tick(0);
    assert.equal(level('Sleeping'), 5);
    assert.equal(character.getTotalSkillLevel('Sleeping'), 4);
    assert.equal(stamina() - base, 5);
    assert.ok(Math.abs(patienceRate() - 1.04) < 1e-9);
    assert.deepEqual(grantEarnedTitles(titles, counters(), 9999), [], 'no second grant while rusted');
    assert.deepEqual(titles.sound_sleeper, {at: 4321});

    // Reload: rebuild from saved XP, the saved records and the saved titles; re-apply twice. Nothing doubles, no replayed grant.
    const savedXp = {...Object.fromEntries(['Sleeping'].map(id => [id, character.getSkillXPObject({skill_id: id}).total_xp]))};
    const savedRecords = domainRegistry.save({}).skillRecords;
    const savedTitles = JSON.parse(JSON.stringify(titles));
    const before = {stamina: stamina(), rate: patienceRate()};
    delete lv.skill_progress.Sleeping;
    lv.stats.flat.ladder = {}; lv.xp_bonuses.multiplier.ladder = {}; lv.bonus_skill_levels.flat.rust = {};
    grant('Sleeping', savedXp.Sleeping);
    domainRegistry.load({skillRecords: savedRecords});
    settle(0); settle(0);
    assert.equal(level('Sleeping'), 5);
    assert.equal(character.getTotalSkillLevel('Sleeping'), 4);
    assert.equal(stamina(), before.stamina);
    assert.ok(Math.abs(patienceRate() - before.rate) < 1e-9);
    const restored = normalizeTitles(savedTitles);
    assert.deepEqual(grantEarnedTitles(restored, counters(), 20000), []);
    assert.deepEqual(restored.sound_sleeper, {at: 4321});

    // Practice lifts rust: back to 5, perk returns once, not twice.
    grant('Sleeping', 1); clock += 1; settle(1); grant('Sleeping', 1); settle(1);
    assert.equal(character.getTotalSkillLevel('Sleeping'), 5);
    assert.equal(stamina() - base, 10);
    assert.ok(Math.abs(patienceRate() - 1.05) < 1e-9);
});

test('Sleeping and Patience show the same edge row, and the sealed row is built from the real native grant', async () => {
    const n = await loadNative(ENTRY, {stubs: STANCE_LOCATION_STUBS, prefix: 'skill-ladder-ui-'});
    n.fill_availability_methods();
    const {skills} = n;
    assert.equal(sealedGrants(skills.Sleeping.milestones).length, 1, 'Sleeping 10 really unlocks a recipe');
    const s = skills.Sleeping.get_effect_description(), p = skills.Patience.get_effect_description();
    assert.match(s, /Easy rest/); assert.match(s, /Sleeping 10: \?\?\?\?\?\?/); assert.ok(!/dream catcher/i.test(s));
    assert.match(p, /Unhurried/);
    const edge = s.split('\n').find(l => l.startsWith('Sleeping feeds Patience'));
    assert.ok(edge && p.includes(edge));
});
