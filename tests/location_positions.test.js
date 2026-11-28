import test from 'node:test';
import assert from 'node:assert/strict';
import {placeMapPositions, exitArrow} from '../src/location_positions.js';

test('anchored places and generated exits get stable, distinct positions across a cycle', () => {
    const a = {}, b = {}, c = {};
    a.connected_locations = [{location:b, azimuth:0, travel_time:25}, {location:c, azimuth:0, travel_time:25}];
    b.connected_locations = [{location:a}];
    placeMapPositions({a,b,c}, {a:[0,0]});
    assert.deepEqual(b.mapPosition, {x:0,y:-2});
    assert.notDeepEqual(b.mapPosition, c.mapPosition);
    assert.equal(exitArrow(a.mapPosition, b.mapPosition), '↑');
    assert.equal(exitArrow(b.mapPosition, a.mapPosition), '↓');
});
