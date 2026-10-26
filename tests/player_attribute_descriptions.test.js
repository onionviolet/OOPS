import test from 'node:test';
import assert from 'node:assert/strict';
import {playerAttributeDefinitions, ATTRIBUTE_DESCRIPTIONS} from '../src/player_attribute_definitions.js';

test('every inspectable attribute has player-facing meaning, including inactive resource dimensions', () => {
    for(const [id] of playerAttributeDefinitions) {
        assert.ok(ATTRIBUTE_DESCRIPTIONS[id]?.length > 20,`${id} needs an explanation`);
        assert.doesNotMatch(ATTRIBUTE_DESCRIPTIONS[id],/native|current-player attribute|stored|consumer|pipeline/i);
    }
    assert.match(ATTRIBUTE_DESCRIPTIONS.magic,/does not grant/);
    assert.match(ATTRIBUTE_DESCRIPTIONS.mana_efficiency,/no verified/);
    assert.match(ATTRIBUTE_DESCRIPTIONS.attack_points,/target/);
    assert.match(ATTRIBUTE_DESCRIPTIONS.block_chance,/need a shield/);
});
