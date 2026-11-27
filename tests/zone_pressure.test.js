import test from 'node:test';
import assert from 'node:assert/strict';
import {zonePressure, pressureTemplate} from '../src/zone_pressure.js';
test('clears raise risk and rewards together up to the zone cap', () => {
    const zone={id:'Infested field', enemy_groups_killed:15, enemy_count:15};
    const scalar=zonePressure(zone);
    assert.equal(scalar,1.1);
    const base={stats:{health:100,attack:20,defense:0},xp_value:10};
    const grown=pressureTemplate(base,scalar);
    assert.equal(grown.stats.attack,22);
    assert.equal(grown.xp_value,11);
    assert.equal(base.stats.attack,20);
    assert.equal(zonePressure({...zone,enemy_groups_killed:9999}),1.4);
    assert.equal(zonePressure({id:'other'}),1);
});
