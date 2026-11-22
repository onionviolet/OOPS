// Arkivia extractor against a tiny synthetic snippet shaped like the real
// definitions. It does not need the private raw files.
import test from 'node:test';
import assert from 'node:assert/strict';
import {extractArkivia} from '../prototypes/world-atlas/source-arkivia.mjs';

const SNIPPET = `const VERSION = "9.9.9"
const enemyData = {
    "rat": {
        "name": "Rat",
        "health": [1, 2]
    }
}
const itemData = {
    "wood": {
        "name": "Wood"
    },
    "club": {
        "name": "Club",
        "crafting": {
            "complexity": 5
        }
    }
}
const shopData = {
    "store": [
        {"name": "club", "chance": 100, "quantity": [1, 1], "price": [1, 2]}
    ]
}
const sceneTicks = new Map([
    ["cellar", function() {
        generateEnemy("rat")
    }]
])
const sceneRegions = {
    "square": "town",
    "store": "town",
    "cellar": "town",
    "road": "wild"
}
class scenes {
    static square() {
        return \`You are in the square.\\n\\n{![dollar.png]Store|store}\\n{![chat.png]Mayor|mayor}\\n{![leave.png]Road|road|200(The Road)}\`
    }
    static store() {
        return \`"Hi"\\n\\n{![leave.png]Leave|square}\`
    }
    static mayor() {
        return \`"Hello."\\n\\n{Return|square}\`
    }
    static cellar() {
        return \`Dark.\${processingGen()}\\n\\n{Stop|square}\`
    }
    static road() {
        return \`A road.\\n\\n{Square|square|100}\\n{Rat hunt|cellar|0|generateEnemy(rat,rat)}\`
    }
}
class sceneEndFunctions {
    static store() {
        generateShop("store")
    }
}
function getMovementSpeed() {
    return (50 + getSkillLevel("walking") * 3) * 1
}
`;

test('extracts places, routes, shops and enemies from a synthetic snippet', () => {
    const out = extractArkivia(SNIPPET);
    assert.equal(out.game, 'arkivia');
    assert.equal(out.source.version, '9.9.9');
    const by = Object.fromEntries(out.places.map(p => [p.id, p]));
    assert.ok(by.town && by.wild, 'regions present');
    assert.equal(by.square.parent, 'town');
    assert.equal(by.town.kind, 'region');
    const road = by.square.routes.find(r => r.to === 'road');
    assert.equal(road.distance, 200);
    assert.equal(road.minutes, 4);
    assert.equal(by.store.kind, 'shop');
    assert.deepEqual(by.store.shops, ['Store: Club']);
    assert.ok(by.square.people.includes('Mayor'));
    assert.deepEqual(by.cellar.enemies, ['Rat']);
    assert.equal(by.cellar.kind, 'activity');
    assert.ok(by.road.enemies.includes('Rat'));
    assert.ok(by.square.sourceLine > 0);
    assert.ok(out.notes.length > 0);
});

test('empty input does not throw', () => {
    const out = extractArkivia('');
    assert.deepEqual(out.places, []);
});
