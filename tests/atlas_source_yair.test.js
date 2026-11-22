import test from 'node:test';
import assert from 'node:assert/strict';
import {extractYair, blockEnd} from '../prototypes/world-atlas/source-yair.mjs';

test('blockEnd skips braces inside strings, templates and comments', () => {
    const t = 'f({a: "}", b: `${x}}`, // }\n c: {d: 1}}) tail';
    assert.equal(t.slice(blockEnd(t, 1)), ' tail');
});

test('extractYair reads places, parents, routes and later pushes', () => {
    const src = `
    locations["Village"] = new Location({
        dialogues: ["village elder"], traders: ["village trader"], name: "Village",
        crafting: {is_unlocked: true, tiers: {crafting: 1, cooking: 1}},
        getDescription: function() { return \`text {not a block\`; },
    });
    locations["Shack"] = new Location({
        connected_locations: [{location: locations["Village"], custom_text: "Go outside", travel_time: 10}],
        name: "Shack", is_unlocked: false,
    });
    locations["Village"].connected_locations.push({location: locations["Shack"], travel_time: 10});
    locations["Cellar"] = new Combat_zone({name: "Cellar", enemies_list: ["Rat"], parent_location: locations["Shack"]});
    `;
    const {places, notes} = extractYair(src);
    const by = Object.fromEntries(places.map(p => [p.id, p]));
    assert.deepEqual(Object.keys(by), ['Village', 'Shack', 'Cellar']);
    assert.deepEqual(by.Village.craft, ['crafting', 'cooking']);
    assert.deepEqual(by.Village.people, ['village elder']);
    assert.deepEqual(by.Village.routes, [{to: 'Shack', minutes: 10}]);
    assert.deepEqual(by.Shack.routes, [{to: 'Village', minutes: 10}]);
    assert.equal(by.Shack.unlocked, false);
    assert.equal(by.Cellar.kind, 'combat');
    assert.equal(by.Cellar.parent, 'Shack');
    assert.deepEqual(by.Cellar.enemies, ['Rat']);
    assert.deepEqual(notes, []);
});
