import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../scripts/headless/runner.mjs';
// M3 B3: native load restored crafting-owned item keys through the generic quality path, dropping
// materialRef, so a saved gathered lot or crafted product made the whole save fail to load.
test('gathered lots and crafted products survive native Save and reload with writable saving',async()=>{
 const game=await boot(null,{seed:7});
 await game.fill('select[aria-label="Other known panels"]','herbal-experiments');
 await game.click('#crafting_gather');
 await game.click('[data-craft-material]');
 await game.click('#crafting_engine_home [data-craft-commit]');
 const before=game.snapshot(),keys=Object.keys(before.inventories.person.main_character);
 assert.ok(keys.some(k=>JSON.parse(k).materialRef)||keys.some(k=>JSON.parse(k).productFamily==='craft.batch@1'));
 assert.ok(keys.some(k=>JSON.parse(k).productFamily==='craft.batch@1'),'crafted product carried');
 await game.save();await game.reload();
 assert.equal(globalThis.simulationTestHooks.saveStatus().writeBlocked,'');
 const after=game.snapshot();
 assert.deepEqual(after.inventories.person.main_character,before.inventories.person.main_character);
 assert.deepEqual(after.crafting,before.crafting);
});
