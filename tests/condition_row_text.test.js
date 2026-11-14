import test from 'node:test';
import assert from 'node:assert/strict';
import {effectSummary,easesText} from '../src/condition_row_text.js';

test('a condition row says what the effect does, from its own detail text (UIC129)',()=>{
    assert.equal(effectSummary('<br>Cold tolerance: -5'),'Cold tolerance: −5');
    assert.equal(effectSummary('<div><br>Stamina efficiency: x0.8<br>Strength: x0.9</div>'),'Stamina efficiency: ×0.8 · Strength: ×0.9');
    assert.equal(effectSummary('<div class="active_effect_description">A claw wound.</div><div><br>Health loss: -0.5</div>'),'A claw wound. · Health loss: −0.5');
    assert.equal(effectSummary(''),'');
});

test('weather conditions say what eases them; an effect with no known remedy says nothing',()=>{
    assert.match(easesText('Wet'),/out of the rain/);
    for(const name of ['Cold','Very cold','Freezing'])assert.match(easesText(name),/warm enough/);
    assert.equal(easesText('Bleeding'),'');
});
