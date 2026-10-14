import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// Native catalog/actor/component, with only browser presentation disconnected.
async function nativeModels() {
    const dir = await mkdtemp(join(tmpdir(), 'micro-p1-'));
    const outfile = join(dir, 'native.mjs');
    await build({stdin: {contents: `
        export {character} from './src/data/character.js';
        export {skills} from './src/data/skills.js';
        export {config} from './src/config.js';
        export {fill_availability_methods} from './src/component_management.js';`,
        resolveDir: resolve('.')}, bundle: true, format: 'esm', platform: 'node', outfile,
        plugins: [{name: 'presentation-only', setup(b) {
            b.onLoad({filter: /\/src\/(main|display)\.js$/}, async a => {
                const source = await readFile(a.path, 'utf8');
                const names = [...source.matchAll(/export\s*\{([^}]+)\}/g)]
                    .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).at(-1)))
                    .filter(s => /^[a-zA-Z_$][\w$]*$/.test(s));
                return {contents: names.map(s => `export const ${s} = ${s === 'game_options' ? '{}' : s === 'current_stance' ? '({getStats:()=>({})})' : s === 'current_location' ? 'null' : s === 'capitalize_first_letter' ? 's=>s[0].toUpperCase()+s.slice(1)' : '()=>{}'};`).join('\n')};
            });
        }}]});
    const native = await import(pathToFileURL(outfile));
    native.fill_availability_methods();
    return {native, cleanup: () => rm(dir, {recursive: true, force: true})};
}

test('native capped grants preserve ordering, uncapped restoration and parent catch-up', async () => {
    const {native: {character, skills, config}, cleanup} = await nativeModels();
    const grant = (id, xp, options = {}) => character.addXPToSkill({skill: skills[id], xp_to_add: xp,
        use_bonus: false, cap_gained_xp: true, add_to_parent: false, ...options});
    const xp = id => character.getSkillXPObject({skill_id: id});
    try {
        const limit = skills.Combat.base_xp_cost * config.skill_xp_gains_cap;
        grant('Combat', 1000);
        assert.equal(xp('Combat').total_xp, limit, 'finite capped native grant');
        grant('Combat', limit / 2);
        assert.equal(xp('Combat').total_xp, limit * 1.5, 'below-cap grant survives');
        grant('Combat', limit);
        assert.equal(xp('Combat').total_xp, limit * 2.5, 'exact boundary survives');

        const lvl = character.getLevelableComponent();
        lvl.xp_bonuses.total_multiplier.all_skill = 3;
        grant('Combat', limit / 2, {use_bonus: true});
        assert.equal(xp('Combat').total_xp, limit * 3.5, 'bonus applied before cap');
        lvl.xp_bonuses.total_multiplier.all_skill = 1;

        grant('Swords', 1000, {add_to_parent: true});
        const childLimit = skills.Swords.base_xp_cost * config.skill_xp_gains_cap;
        assert.equal(xp('Swords').total_xp, childLimit);
        assert.equal(xp('Weapon mastery').total_xp, childLimit,
            'parent receives accepted grant without a second cap or multiplier');
        grant('Weapon mastery', 1000, {cap_gained_xp: false});
        const parentBefore = xp('Weapon mastery').total_xp;
        grant('Swords', 1000, {add_to_parent: true, use_bonus: true});
        assert.equal(xp('Swords').total_xp, childLimit * 2, 'parent catch-up multiplier precedes cap');
        assert.equal(xp('Weapon mastery').total_xp, parentBefore, 'ahead parent gets no extra XP');

        grant('Sleeping', 10000, {cap_gained_xp: false});
        const saved = structuredClone(xp('Sleeping'));
        const milestones = structuredClone(lvl.stats.flat.skill_milestones);
        grant('Sleeping', 1, {cap_gained_xp: false});
        assert.deepEqual(lvl.stats.flat.skill_milestones, milestones, 'old milestone stats are not granted twice');
        delete lvl.skill_progress.Sleeping;
        grant('Sleeping', saved.total_xp, {cap_gained_xp: false});
        assert.deepEqual(structuredClone(xp('Sleeping')), saved, 'load reconstructs earned XP exactly without cap');

        grant('Smelting', 10000, {cap_gained_xp: false});
        assert.equal(xp('Smelting').total_xp, 10000, 'bulk crafting grant retains its caller policy');

        grant('Sleeping', 1e8, {cap_gained_xp: false});
        assert.equal(xp('Sleeping').xp_to_next_lvl, Infinity);
        const maxXP = xp('Sleeping').total_xp;
        grant('Sleeping', 1000);
        assert.equal(xp('Sleeping').total_xp, maxXP + 1000, 'max-level sentinel keeps existing semantics');
    } finally {await cleanup();}
});
