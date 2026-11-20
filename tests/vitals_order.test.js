import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';

test('HP appears above XP, stamina and mana in the character vitals', () => {
    const {document, loadHTML} = createDom();
    loadHTML(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
    const vitals = document.getElementById('basic_character_info_div');
    assert.ok(vitals, 'character vitals block exists');
    const bars = [...vitals.children].map(bar => bar.id);
    const hp = bars.indexOf('character_health_div');
    assert.notEqual(hp, -1, 'HP bar exists');
    for (const name of ['xp', 'stamina', 'mana']) {
        const position = bars.indexOf(`character_${name}_div`);
        assert.notEqual(position, -1, `${name} bar exists`);
        assert.ok(hp < position, `HP must appear before ${name}`);
    }
});
