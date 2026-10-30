import test from 'node:test';
import assert from 'node:assert/strict';
import {bondStage, bondMeter, BOND_STAGE_AT} from '../src/companion_stage.js';
import {RELATIONSHIP_STAGES} from '../src/ui/relationship_web.js';
import {COMPANION_PROFILES} from '../src/companion_wishes.js';

test('bk-party: bond levels map onto the shared relationship stage words, and the hold level is "Relied on"', () => {
    assert.equal(BOND_STAGE_AT.length, RELATIONSHIP_STAGES.length);
    assert.equal(bondStage(0).word, 'Met');
    assert.equal(bondStage(2).word, 'Acquainted');
    assert.equal(bondStage(COMPANION_PROFILES.free.holdLevel).word, 'Relied on');
    assert.equal(bondStage(99).toNext, 0);
    const m = bondMeter('party:lio', 4);
    assert.equal(m.label, 'Bond: Familiar'); assert.equal(m.value, 2); assert.match(m.note, /2 more bond/);
});
