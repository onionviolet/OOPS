import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierCatalogue as cat, frontierBrewLaw as law, frontierSources as sources, tonicGrammar, binderGrammar} from '../src/craft_content_frontier.js';
import {defineCatalogue, generateMaterial, materialPool, pickMaterial, validateMaterial} from '../src/craft_materials.js';
import {defineCraftLaw, resolveBatch, validateBatchProduct} from '../src/craft_resolver.js';
import {defineRecipe, generateRecipe, matchRecipe} from '../src/craft_recipes.js';
import {defineSourceTable, validateSourceState, forecastHarvest, gatherIdle, harvest, localVariants, nodeAt, sourcesAt, MAX_IDLE_HARVESTS} from '../src/craft_sources.js';
import {createCraftState, freezeMaterials, freezeRecipe, knowsAxis, observe, projectMaterial, projectProduct, recordProduct,
    setSourceNode, validateCraftState} from '../src/craft_state.js';
import {classifyProductKey, keyForProduct, resolveProductKey} from '../src/craft_product_registry.js';
import {BATCH_FAMILY} from '../src/craft_resolver.js';

const roundTrip = value => JSON.parse(JSON.stringify(value));
const water = cat.materials['Spring water'], chalk = cat.materials['Lime chalk'];
const herbAt = (root, index = 0) => generateMaterial(cat, 'reedherb', {root, scope: 'base.frontier/meadow', index}).value;
const where = {world: 'base.frontier', location: 'meadow'};

test('generated materials: golden snapshots for three fixed roots', () => {
    const golden = {
        1: ['gen:hillore:7a918abc58da8d59', 'Star nodule', {ash: 523, glow: 62, hardness: 73, matrix: 477, restore: 0, toxin: 0, vigor: 0}],
        777: ['gen:hillore:c5ef9256622e249f', 'Star iron', {ash: 571, glow: 75, hardness: 87, matrix: 429, restore: 0, toxin: 0, vigor: 0}],
        4294967295: ['gen:hillore:bc2614f344af650c', 'Banded iron', {ash: 460, glow: 67, hardness: 81, matrix: 540, restore: 0, toxin: 0, vigor: 0}],
    };
    for(const [root, [id, name, properties]] of Object.entries(golden)) {
        const m = generateMaterial(cat, 'hillore', {root: Number(root), scope: 'w/hills', index: 2}).value;
        assert.deepEqual([m.id, m.name, m.properties], [id, name, properties]);
    }
});

test('generated materials: seed sweep keeps ranges, basis and correlation direction', () => {
    let correlated = 0;
    for(let root = 0; root < 300; root++) {
        const m = herbAt(root);
        const {restore, toxin, glow, matrix} = m.properties;
        assert.ok(restore >= 60 && restore <= 160 && toxin >= 0 && toxin <= 40 && glow <= 30);
        assert.equal(restore + toxin + matrix + m.properties.ash + m.properties.vigor, 1000);
        if((restore > 110) === (toxin > 20)) correlated++;
    }
    assert.ok(correlated > 170, `positive correlation should dominate, got ${correlated}/300`);
    assert.notEqual(herbAt(5).id, herbAt(5, 1).id);
    assert.deepEqual(herbAt(5), herbAt(5));
    assert.notDeepEqual(herbAt(5).properties, generateMaterial(cat, 'reedherb', {root: 5, scope: 'other.world/meadow', index: 0}).value.properties);
});

test('generated materials survive save/reload and are rejected under another catalogue', () => {
    const m = roundTrip(herbAt(9));
    assert.deepEqual(validateMaterial(cat, m), herbAt(9));
    const other = defineCatalogue({id: 'other', revision: 1, axes: [{id: 'restore', kind: 'fraction'}], tags: []});
    assert.throws(() => validateMaterial(other, {...m, properties: {restore: 1}}), /Unknown material family|not from other@1/);
    assert.throws(() => validateMaterial(cat, {...m, properties: {...m.properties, restore: 999}}), /exceed basis|out of bounds/);
});

test('pools filter by tag query and apply overlays in order with reasons', () => {
    const extra = [herbAt(1), herbAt(2)];
    assert.deepEqual(materialPool(cat, 'mineral').map(r => r.material.id), ['Lime chalk']);
    assert.equal(materialPool(cat, 'plant', {extra}).length, 2);
    const banned = materialPool(cat, null, {extra, overlays: [{id: 'drought', op: 'ban', match: 'wet'}]});
    assert.ok(banned.every(r => r.material.family !== 'reedherb'));
    const reweighted = materialPool(cat, 'herb', {extra, overlays: [{id: 'lush', op: 'reweight', match: 'herb', permille: 2000}]});
    assert.ok(reweighted.every(r => r.weight === 6 && r.reasons.includes('reweight:lush')));
    const a = pickMaterial(cat, 'plant', {root: 3, key: 'k', extra}), b = pickMaterial(cat, 'plant', {root: 3, key: 'k', extra});
    assert.equal(a.value.id, b.value.id);
    assert.throws(() => materialPool(cat, 'nonsense'), /Unknown query tag/);
});

test('resolver conserves mass, keeps traces, and is pure and repeatable', () => {
    const herb = herbAt(4), inputs = [{material: herb, qty: 2}, {material: water, qty: 1}];
    const before = roundTrip(inputs);
    const a = resolveBatch(law, {inputs, process: [{op: 'steep', level: 2}]});
    const b = resolveBatch(law, {inputs: [...inputs].reverse(), process: [{op: 'steep', level: 2}]});
    assert.deepEqual(roundTrip(inputs), before);
    assert.equal(a.product.id, b.product.id);
    assert.equal(Object.values(a.product.composition).reduce((n, v) => n + v, 0), a.product.mass);
    assert.equal(a.product.composition.toxin, herb.properties.toxin * 2);
    assert.deepEqual(a.debits, [{material: 'Spring water', qty: 1}, {material: herb.id, qty: 2}]);
});

test('process, dilution and catalysts change the product without new templates', () => {
    const herb = herbAt(4);
    const base = [{material: herb, qty: 2}, {material: water, qty: 1}];
    const steep = resolveBatch(law, {inputs: base, process: [{op: 'steep', level: 1}]}).product;
    const boil = resolveBatch(law, {inputs: base, process: [{op: 'boil', level: 3}], stations: ['hearth']}).product;
    const diluted = resolveBatch(law, {inputs: [base[0], {material: water, qty: 5}], process: [{op: 'steep', level: 1}]}).product;
    const bound = resolveBatch(law, {inputs: [...base, {material: chalk, qty: 1, role: 'catalyst'}], process: [{op: 'steep', level: 1}]});
    assert.ok(boil.composition.restore < steep.composition.restore, 'heat destroys some restorative sap');
    assert.ok(boil.composition.ash > steep.composition.ash);
    assert.ok((diluted.outputs.oral?.health ?? 0) < steep.outputs.oral.health, 'more water lowers dose');
    assert.equal(diluted.composition.restore, steep.composition.restore, 'dilution never deletes actives');
    assert.ok(bound.product.composition.toxin > 0 && bound.product.composition.toxin < steep.composition.toxin, 'specific neutralizer leaves a remainder');
    assert.deepEqual(bound.retained, [{material: 'Lime chalk', qty: 1}]);
    assert.equal(bound.debits.some(d => d.material === 'Lime chalk'), false);
    assert.throws(() => resolveBatch(law, {inputs: base, process: [{op: 'boil', level: 1}]}), /needs a hearth station/);
    assert.throws(() => resolveBatch(law, {inputs: base, process: [{op: 'steep', level: 9}]}), /level must be 1-3/);
    assert.throws(() => resolveBatch(law, {inputs: [{material: chalk, qty: 1, role: 'catalyst'}]}), /at least one consumed/);
});

test('law definitions reject non-conserving reactions and unknown axes', () => {
    assert.throws(() => defineCraftLaw({id: 'x', revision: 1, catalogue: cat, reactions: [{id: 'r', reactants: {toxin: 1}, products: {ash: 2}}]}), /conserve/);
    assert.throws(() => defineCraftLaw({id: 'x', revision: 1, catalogue: cat, outputs: [{id: 'o', route: 'oral', effect: 'e', axis: 'nope', per: 1}]}), /Unknown law axis/);
});

test('retained products validate only under their own law revision', () => {
    const herb = herbAt(4);
    const {product} = resolveBatch(law, {inputs: [{material: herb, qty: 1}, {material: water, qty: 1}], process: [{op: 'steep', level: 1}]});
    const materials = {...cat.materials, [herb.id]: herb};
    assert.equal(validateBatchProduct(law, roundTrip(product), materials).id, product.id);
    const law2 = defineCraftLaw({id: 'frontier.brew', revision: 3, catalogue: cat, carrier: 'Herbal vial', outputs: []});
    assert.throws(() => validateBatchProduct(law2, product, materials), /needs law frontier.brew@2/);
    assert.throws(() => validateBatchProduct(law, {...product, outputs: {oral: {health: 999}}}, materials), /disagrees/);
});

test('recipes match exact, tag and property slots and explain misses', () => {
    const herb = herbAt(4);
    const recipe = defineRecipe(cat, {id: 'salve', revision: 1, slots: [
        {id: 'herb', role: 'base', select: {all: [{tags: 'herb'}, {property: {axis: 'restore', min: 50}}]}, qty: [1, 3]},
        {id: 'water', role: 'solvent', select: {material: 'Spring water'}},
        {id: 'chalk', role: 'catalyst', select: {tags: 'alkaline'}}], process: [{op: 'steep', levels: [1, 2]}]});
    const inputs = [{material: water, qty: 1}, {material: chalk, qty: 1, role: 'catalyst'}, {material: herb, qty: 2}];
    assert.equal(matchRecipe(cat, recipe, inputs, {process: [{op: 'steep', level: 2}]}).ok, true);
    const missing = matchRecipe(cat, recipe, inputs.slice(0, 2));
    assert.equal(missing.ok, false);
    assert.deepEqual(missing.problems.map(p => p.slot), ['herb']);
    assert.match(matchRecipe(cat, recipe, inputs, {process: [{op: 'boil', level: 1}]}).problems[0].reason, /step 1 differs/);
    const unsure = matchRecipe(cat, recipe, inputs, {knows: () => false});
    assert.deepEqual([unsure.ok, unsure.unknown], [false, ['herb']], 'unknown property is a trial, not a refusal');
});

test('seeded discovery recipes are stable, worthwhile and satisfied by their witness', () => {
    const extra = [...Object.values(localVariants(sources, 'reed-patch', {root: 12345, ...where})).flat(),
        ...Object.values(localVariants(sources, 'root-bed', {root: 12345, ...where})).flat()];
    const g = generateRecipe(law, tonicGrammar, {root: 12345, scope: 'base.frontier', index: 0, extra});
    assert.deepEqual(roundTrip(generateRecipe(law, tonicGrammar, {root: 12345, scope: 'base.frontier', index: 0, extra}).value), roundTrip(g.value));
    assert.equal(g.receipt.fallbackUsed, false);
    const byId = Object.fromEntries([...extra.map(m => [m.id, m]), ...Object.entries(cat.materials)]);
    const inputs = g.witness.inputs.map(w => ({...w, material: byId[w.material]}));
    assert.equal(matchRecipe(cat, g.value, inputs, {process: g.witness.process}).ok, true);
    const {product} = resolveBatch(law, {inputs, process: g.witness.process, stations: ['hearth']});
    assert.ok(Object.values(product.outputs.oral).some(v => v > 0));
    const ids = new Set(Array.from({length: 20}, (_, i) => generateRecipe(law, tonicGrammar, {root: i, scope: 'base.frontier', index: 0, extra}).value.id));
    assert.equal(ids.size, 20);
    const none = generateRecipe(law, tonicGrammar, {root: 1, scope: 'base.frontier', index: 0, extra: []});
    assert.equal(none.receipt.fallbackUsed, true, 'no herbs in reach: named authored fallback');
    assert.equal(none.value.origin.fallback, true);
});

test('harvest: location sources, regional variants and deterministic rolls', () => {
    assert.deepEqual(sourcesAt(sources, ['meadow']).map(s => s.id), ['reed-patch', 'root-bed']);
    assert.deepEqual(sourcesAt(sources, ['hills']).map(s => s.id), ['ore-seam']);
    const meadow = localVariants(sources, 'reed-patch', {root: 7, ...where}).reedherb;
    const river = localVariants(sources, 'reed-patch', {root: 7, world: 'base.frontier', location: 'riverbank'}).reedherb;
    assert.equal(meadow.length, 2);
    assert.notDeepEqual(meadow.map(m => m.id), river.map(m => m.id));
    const args = {root: 7, ...where, source: 'reed-patch', at: 600};
    const a = harvest(sources, args), b = harvest(sources, roundTrip(args));
    assert.deepEqual(roundTrip(a), roundTrip(b));
    assert.ok(meadow.some(m => m.id === a.result.items[0].material.id));
    const again = harvest(sources, {...args, node: a.node});
    assert.notEqual(again.receipt.address, a.receipt.address, 'same minute, next harvest ordinal');
});

test('harvest: gates by tool, skill, hour and season, with an odds forecast', () => {
    const seam = harvest(sources, {root: 1, world: 'w', location: 'hills', source: 'ore-seam', at: 100});
    assert.deepEqual([seam.result.items.length, seam.result.reason], [0, 'nothing you can take here now']);
    assert.equal(harvest(sources, {root: 1, world: 'w', location: 'hills', source: 'ore-seam', at: 100, actor: {tools: ['pick']}}).result.items.length, 1);
    assert.equal(harvest(sources, {root: 1, ...where, source: 'root-bed', at: 100}).result.items.length, 0, 'skill 1 needed');
    const night = forecastHarvest(sources, 'reed-patch', {at: 23 * 60});
    const dawn = forecastHarvest(sources, 'reed-patch', {at: 5 * 60, actor: {tools: ['sickle']}});
    assert.deepEqual(night.yields.find(y => y.id === 'dawn-dew').blocked, ['only 4:00-8:00']);
    assert.deepEqual(dawn.yields.map(y => y.permille), [545, 272, 181]);
    assert.equal(forecastHarvest(sources, 'reed-patch', {at: 0, actor: {luck: 20}}).rare.permille, 60);
});

test('harvest: depletion, regrowth carry and pity-guaranteed rare finds', () => {
    let node, at = 0;
    for(let i = 0; i < 40 && !(node && node.stock === 0); i++) node = harvest(sources, {root: 3, ...where, source: 'reed-patch', at: at += 1, node}).node;
    assert.equal(node.stock, 0);
    const empty = harvest(sources, {root: 3, ...where, source: 'reed-patch', at: at + 1, node});
    assert.equal(empty.result.reason, 'depleted');
    assert.equal(empty.result.nextAt, empty.node.updatedAt + Math.ceil((1440 - empty.node.carry) / 6));
    assert.equal(nodeAt(sources.sources['reed-patch'], empty.node, empty.result.nextAt).stock, 1, 'nextAt is exactly when one unit regrows');
    const source = sources.sources['reed-patch'];
    const once = nodeAt(source, node, at + 1000);
    let stepped = node;
    for(let t = at + 100; t <= at + 1000; t += 100) stepped = nodeAt(source, stepped, t);
    assert.equal(stepped.stock, once.stock, 'frequent checks never lose regrowth');
    assert.throws(() => nodeAt(source, once, 0), /backwards/);
    let pityNode = {stock: 12, updatedAt: 0, harvests: 0, misses: 24};
    const forced = harvest(sources, {root: 99, ...where, source: 'reed-patch', at: 1, node: pityNode, actor: {season: 'spring'}});
    assert.equal(forced.result.items.at(-1).rare, true);
    assert.equal(forced.node.misses, 0);
});

test('idle gathering is bounded, deterministic and stops on depletion', () => {
    const args = {root: 11, ...where, source: 'reed-patch', from: 0, to: 1440 * 2, every: 30};
    const a = gatherIdle(sources, args);
    assert.deepEqual(roundTrip(a), roundTrip(gatherIdle(sources, args)));
    assert.ok(a.harvests > 0 && a.items.reduce((n, i) => n + i.qty, 0) >= 12);
    const ore = gatherIdle(sources, {root: 11, world: 'w', location: 'hills', source: 'ore-seam', from: 0, to: 1440 * 365, every: 1, actor: {tools: ['pick']}});
    assert.equal(ore.stopped, 'depleted', 'no regrowth: stops instead of spinning');
    assert.ok(ore.harvests <= MAX_IDLE_HARVESTS);
});

test('crafting owner: freeze on reveal, knowledge projection and save/reload', () => {
    const herb = herbAt(4);
    let state = createCraftState({world: 'base.frontier'});
    state = freezeMaterials(state, cat, [herb, water]);
    assert.deepEqual(Object.keys(state.materials), [herb.id], 'authored truth stays in content');
    assert.throws(() => freezeMaterials(state, cat, [{...herb, name: 'Renamed'}]), /would change/);
    const {product} = resolveBatch(law, {inputs: [{material: herb, qty: 2}, {material: water, qty: 1}], process: [{op: 'steep', level: 1}]});
    state = recordProduct(state, product);
    const hidden = projectProduct(state, cat, product.id, 'player');
    assert.deepEqual([hidden.identified, hidden.name, hidden.effects], [false, 'Unidentified herbal vial', []]);
    state = observe(state, 'player', product.id, ['effect:oral.health', 'tag:restorative'], 60);
    const seen = projectProduct(state, cat, product.id, 'player');
    assert.equal(seen.name, 'Herbal vial (health, restorative)');
    assert.equal(projectProduct(state, cat, product.id, 'npc:oren').identified, false, 'knowledge is per observer');
    state = observe(state, 'player', herb.id, ['axis:restore', 'axis:glow'], 61);
    assert.deepEqual(Object.keys(projectMaterial(state, cat, herb.id, 'player').properties), ['restore'], 'hidden axes never project');
    assert.equal(knowsAxis(state, 'player')(herb.id, 'restore'), true);
    const g = generateRecipe(law, tonicGrammar, {root: 1, scope: 's', index: 0, extra: []});
    state = freezeRecipe(state, g.value, g.witness);
    state = setSourceNode(state, 'base.frontier/meadow/reed-patch', {stock: 3, updatedAt: 10, harvests: 4, misses: 4});
    const reloaded = roundTrip(state);
    const owners = {catalogues: {[cat.ref]: cat}, laws: {[law.ref]: law}, sourceTables: {[sources.ref]: sources}};
    assert.doesNotThrow(() => validateCraftState(reloaded, owners));
    assert.throws(() => validateCraftState(reloaded, {...owners, laws: {}}), /unsupported law/);
    const forged = roundTrip(state); forged.products[product.id].outputs.oral.health = 500;
    assert.throws(() => validateCraftState(forged, owners), /disagrees/);
});

test('product registry: crafted and mixture keys classify; ordinary keys pass through', () => {
    const herb = herbAt(4);
    const {product} = resolveBatch(law, {inputs: [{material: herb, qty: 1}, {material: water, qty: 1}], process: [{op: 'steep', level: 1}]});
    const key = keyForProduct(BATCH_FAMILY, product);
    assert.deepEqual(classifyProductKey(key), {family: BATCH_FAMILY, ref: product.id});
    const crafting = recordProduct(createCraftState({world: 'w'}), product);
    assert.equal(resolveProductKey(key, {crafting}).product.id, product.id);
    assert.equal(classifyProductKey(JSON.stringify({id: 'Iron sword'})), null);
    assert.equal(classifyProductKey('not json'), null);
    assert.deepEqual(classifyProductKey(JSON.stringify({id: 'Village mixture', mixture: 'm1:x'})), {family: 'village.mixtures@1', ref: 'm1:x'});
    assert.throws(() => classifyProductKey(JSON.stringify({id: 'Herbal vial', productRef: 'x'})), /Unsupported generated/);
    assert.throws(() => resolveProductKey(key, {crafting: createCraftState({world: 'w'})}), /Missing crafted product/);
});

test('regrowth is exact for any daily rate: many short checks equal one long check', () => {
    for(const regenPerDay of [1, 6, 7, 13, 1000]) {
        const source = {capacity: 1000, regenPerDay};
        const start = {stock: 0, updatedAt: 0, harvests: 0, misses: 0};
        const once = nodeAt(source, start, 10000);
        let stepped = start;
        for(let t = 1; t <= 10000; t += 7) stepped = nodeAt(source, stepped, t);
        stepped = nodeAt(source, stepped, 10000);
        assert.equal(stepped.stock, once.stock, `rate ${regenPerDay}`);
        assert.equal(once.stock, Math.min(1000, Math.floor(10000 * regenPerDay / 1440)));
    }
});

test('a blocked rare find never spends the pity guarantee', () => {
    // Reed patch rares: a spring-only herb and Lime chalk; ban chalk by making a table with only the seasonal rare.
    const node = {stock: 12, updatedAt: 0, harvests: 0, misses: 24};
    const table = {...sources, sources: {...sources.sources, 'reed-patch': {...sources.sources['reed-patch'],
        rare: {...sources.sources['reed-patch'].rare, yields: [sources.sources['reed-patch'].rare.yields[0]]}}}};
    const blocked = harvest(table, {root: 99, ...where, source: 'reed-patch', at: 1, node});
    assert.equal(blocked.result.items.some(i => i.rare), false);
    assert.equal(blocked.node.misses, 25, 'still owed');
    const open = harvest(table, {root: 99, ...where, source: 'reed-patch', at: 2, node: blocked.node, actor: {season: 'spring'}});
    assert.equal(open.result.items.at(-1).rare, true);
    assert.equal(open.node.misses, 0);
});

test('binder grammar (second case on the same law): many seeds, no degenerate or runaway binder', () => {
    const vals = [], ids = new Set();
    let fallbacks = 0;
    for(let root = 0; root < 500; root++) {
        const extra = [0, 1, 2].map(index => generateMaterial(cat, 'riversalt', {root, scope: 'base.frontier/village', index}).value);
        const g = generateRecipe(law, binderGrammar, {root, scope: 'base.frontier', index: 0, extra});
        if(g.receipt.fallbackUsed) fallbacks++;
        ids.add(g.value.id);
        const byId = Object.fromEntries([...extra.map(m => [m.id, m]), ...Object.entries(cat.materials)]);
        const inputs = g.witness.inputs.map(w => ({...w, material: byId[w.material]}));
        assert.equal(matchRecipe(cat, g.value, inputs, {process: g.witness.process}).ok, true);
        const {product} = resolveBatch(law, {inputs, process: g.witness.process, stations: ['mortar']});
        vals.push(product.outputs.oral?.bind ?? 0);
    }
    vals.sort((a, b) => a - b);
    assert.equal(fallbacks, 0, 'salt in reach never needs the authored fallback');
    assert.equal(ids.size, 500, 'ids do not collide across seeds');
    assert.ok(vals[0] >= 1, `every witness binds something (min ${vals[0]})`);
    assert.ok(vals[499] <= 45, `dose stays under the ash ceiling 300*150/1000 (max ${vals[499]})`);
    assert.ok(vals[475] <= vals[250] * 3, `tail is not runaway (p95 ${vals[475]}, median ${vals[250]})`);
    assert.equal(generateRecipe(law, binderGrammar, {root: 1, scope: 'base.frontier', index: 0, extra: []}).receipt.fallbackUsed, true, 'no salt: named authored fallback');
});


test('source-local calendar gates ignore foreign actor seasons and root day boundaries', () => {
    const calendar = {worldId:'book.fixture',profileId:'local.cycle',profileRevision:1,minutesPerHour:10,hoursPerDay:30,seasonTags:{Bloom:'spring'}};
    const table = defineSourceTable(cat,{id:'fixture.ecology',revision:1,sources:[{id:'flowers',kind:'gather',capacity:1000,regenPerDay:7,calendar,
        variants:{reedherb:2},yields:[{family:'reedherb',season:'spring',hours:[1,2]}]}]});
    const coordinate = (at,over={}) => ({...calendar,seasonTags:undefined,instanceId:'local.one',at,minuteWithinDay:(at+15)%300,seasonId:'Bloom',...over});
    const c = at => {const {seasonTags,...v}=coordinate(at);return v;};
    const args={root:7,world:'book.fixture',location:'existing.place',source:'flowers',at:0,calendar:c(0)};
    const before=JSON.stringify(args),out=harvest(table,args);
    assert.equal(out.result.items.length,1);assert.equal(JSON.stringify(args),before);
    assert.equal(forecastHarvest(table,'flowers',{at:5,calendar:c(5)}).yields[0].permille,0,'local hour closing boundary, not root hour');
    assert.equal(forecastHarvest(table,'flowers',{at:0,calendar:{...c(0),seasonId:null},actor:{season:'spring'}}).yields[0].permille,0,'unknown local season does not inherit actor season');
    for(const patch of [{worldId:'foreign'},{profileRevision:2},{at:1},{minutesPerHour:60},{minuteWithinDay:300}])assert.throws(()=>harvest(table,{...args,calendar:{...c(0),...patch}}),/calendar/);
    assert.throws(()=>harvest(table,{...args,world:'foreign'}),/different world/);
    assert.throws(()=>harvest(table,{...args,node:out.node,calendar:{...c(0),instanceId:'local.two'}}),/instance/);
    const elsewhere=harvest(table,{...args,calendar:{...c(0),instanceId:'local.two'}});
    assert.notEqual(out.receipt.address,elsewhere.receipt.address);
    assert.notEqual(out.result.items[0].material.id,elsewhere.result.items[0].material.id,'regional families include actual instance');
    assert.deepEqual(localVariants(table,'flowers',{root:7,world:args.world,location:args.location,instanceId:'local.one'}),localVariants(table,'flowers',{root:7,world:args.world,location:args.location,instanceId:'local.one'}));
    assert.throws(()=>gatherIdle(table,{...args,from:0,to:1,every:1}),/every step/);
});

test('bound sources preserve local-day fractional growth, depletion deadlines, freeze and reload', () => {
    const calendar={worldId:'book.fixture',profileId:'local.cycle',profileRevision:1,minutesPerHour:100,hoursPerDay:30,seasonTags:{}};
    const table=defineSourceTable(cat,{id:'fixture.growth',revision:1,sources:[{id:'roots',kind:'gather',capacity:1000,regenPerDay:7,calendar,yields:[{material:'Spring water'}]}]});
    const c=at=>({worldId:calendar.worldId,profileId:calendar.profileId,profileRevision:1,minutesPerHour:100,hoursPerDay:30,instanceId:'kept',at,minuteWithinDay:(at+5)%3000,seasonId:null});
    const source=table.sources.roots,start={...nodeAt(source,null,0,c(0)),stock:0};
    const once=nodeAt(source,start,10000,c(10000));let parts=start;
    for(const at of [1,37,1000,1999,5000,10000]){parts=nodeAt(source,roundTrip(parts),at,c(at));validateSourceState({schema:1,nodes:{roots:parts}},table);}
    assert.deepEqual(parts,once);assert.deepEqual(nodeAt(source,parts,10000,c(10000)),parts,'frozen elapsed grants no regrowth');
    const empty=harvest(table,{root:1,world:'book.fixture',location:'kept.place',source:'roots',at:1,calendar:c(1),node:start});
    assert.equal(empty.result.nextAt,429);assert.equal(nodeAt(source,empty.node,429,c(429)).stock,1);
    const full=nodeAt(source,{...start,stock:999},10000,c(10000));assert.equal(full.stock,1000);assert.equal(full.carry,0);
    assert.throws(()=>validateSourceState({schema:1,nodes:{roots:{...parts,calendar:{...parts.calendar,profileRevision:2}}}},table),/calendar/);
    assert.throws(()=>nodeAt(source,start,1),/coordinate/);
});
