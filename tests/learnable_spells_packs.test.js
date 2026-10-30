import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {defineAbilityRecords, learnView} from '../src/ability_records.js';

// Slice 4 (GM40): three spells each from Mother of Learning and Harry Potter, as typed learnable records.
// The packs are private (source-derived); the test skips when absent. It checks shape, citations and that each learn path is refusable.
for(const name of ['mol', 'hp']) {
    const url = new URL(`../private_packs/learnable-spells/${name}.json`, import.meta.url);
    test(`${name}: three learnable spells compile, cite locators and are refused without their teacher`, {skip: !existsSync(url)}, () => {
        const pack = JSON.parse(readFileSync(url, 'utf8'));
        const set = defineAbilityRecords(pack.rows.map(({ruleId, ...row}) => row), {prefix: pack.prefix, world: {id: pack.world}});
        assert.equal(Object.keys(set.cards).length, 3);
        for(const row of pack.rows) {
            assert.ok(row.locator && row.ruleId && row.learn.teacher.locator, row.key);
            assert.ok(row.conditions.every(c => c.locator), row.key);
            const card = set.cards[row.key], v = learnView(card, {facts: {}});
            assert.equal(v.stage, 'unlearned');
            assert.equal(v.canLearn, false, 'no teacher present');
            assert.equal(v.refusedBy[0], row.learn.teacher.reason);
            assert.ok(card.unstated.length > 0, 'a row that states less than the record needs says so');
        }
        const practiced = pack.rows.filter(r => r.learn.practice);
        assert.ok(practiced.length >= 2);
        const taught = Object.fromEntries(pack.rows.map(r => [r.learn.teacher.requires.fact, true]));
        for(const row of pack.rows) assert.equal(learnView(set.cards[row.key], {facts: taught}).canLearn, true, `${row.key} learnable once taught`);
    });
}
