import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {decodeSaveFile} from '../src/save_files.js';
import {rtSlice1Game, fixtureDirectory, fixtureNames} from './helpers/rt_slice1_fixtures.mjs';
const count = (save,id) => Object.entries(save.inventories.person.main_character)
    .filter(([k])=>JSON.parse(k).id===id).reduce((sum,[,v])=>sum+v.count,0);
// Skills added after the fixtures were captured load at zero XP; drop only those.
const withoutAddedZeroSkills = (restored, expected) => {
    const copy = structuredClone(restored);
    for(const key of Object.keys(copy.skill_xp || {})) if(!(key in (expected.skill_xp || {})) && copy.skill_xp[key] === 0) delete copy.skill_xp[key];
    return copy;
};

test('CN11 seeded saves restore crafts, levels and completed town chain through native loader', {timeout:120000}, async () => {
    const game=await rtSlice1Game();
    try {
        const manifest=JSON.parse(await readFile(new URL('manifest.json',fixtureDirectory),'utf8'));
        for(const name of fixtureNames) {
            const raw=await readFile(new URL(name+'.save.json',fixtureDirectory),'utf8');
            const exported=await readFile(new URL(name+'.save.txt',fixtureDirectory),'utf8');
            assert.deepEqual(decodeSaveFile(exported,JSON.parse(raw)["game version"]),JSON.parse(raw));
            const expected=JSON.parse(raw);
            const session=await game.open(raw);
            try {
                const restored=JSON.parse(await session.page.evaluate(()=>__rtSlice1.save()));
                assert.equal(restored.character.name,'TEST FIXTURE RT SLICE1 '+name.toUpperCase());
                assert.equal(restored['current location'],'Village');
                assert.deepEqual(restored.expansion.actors.player,expected.expansion.actors.player);
                assert.deepEqual(withoutAddedZeroSkills(restored.levels.person.main_character,expected.levels.person.main_character),expected.levels.person.main_character);
                assert.deepEqual(restored.inventories.person.main_character,expected.inventories.person.main_character);
                assert.equal(restored.total_crafting_attempts,expected.total_crafting_attempts);
                assert.equal(restored.total_crafting_successes,expected.total_crafting_successes);
                const facts=restored.expansion.actors.player.facts;
                if(name==='old-before-slice') {
                    assert.equal(restored.total_crafting_successes,0);
                    assert.equal(facts['town.returned'],false);
                    assert.equal(count(restored,'Processed rough wood'),0);
                    assert.equal(count(restored,'Iron chainmail'),0);
                } else {
                    const pairs=name==='crafted-low'?1:2;
                    assert.equal(count(restored,'Processed rough wood'),name==='crafted-low'?4:7);
                    assert.equal(count(restored,'Iron chainmail'),pairs);
                    assert.equal(restored.total_crafting_successes,2*pairs);
                    for(const skill of ['Woodworking','Forging']) {
                        const level=await session.page.evaluate(id=>__rtSlice1.level(id),skill);
                        assert.ok(name==='crafted-low'?level<5:level>=11);
                        assert.ok(restored.levels.person.main_character.skill_xp[skill]>0);
                    }
                    assert.equal(facts['town.returned'],name==='town-returned');
                }
                if(name==='town-returned') {
                    assert.equal(facts['town.approach'],'timber');
                    for(const fact of ['joined','briefed','worked','settled','returned']) assert.equal(facts['town.'+fact],true);
                    for(const id of ['begin','brief','timber','settle','return']) assert.equal(restored.expansion.actors.player.completed['town.'+id],1);
                    assert.ok(restored.expansion.actors.player.sources['town.route_ledger']);
                    assert.equal(count(restored,'Prepared survey kit'),1);
                    assert.equal(count(restored,'Rough wood log'),count(expected,'Rough wood log'));
                    assert.ok(restored.expansion.clock>=3);
                    assert.deepEqual(restored.expansion.pending,[]);
                }
            } finally {await session.close();}
        }
        assert.deepEqual(manifest.crafts.map(c=>[c.band,c.skill,c.level]),[
            ['low','Woodworking',0],['low','Forging',0],['high','Woodworking',11],['high','Forging',11]]);
        assert.deepEqual(game.errors,[]);
    } finally {await game.close();}
});
