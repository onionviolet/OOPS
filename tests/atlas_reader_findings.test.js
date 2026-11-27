import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {digestWorld, findingsMatrix, itemRef} from '../prototypes/world-atlas/reader-findings.mjs';
import {extractRecipes} from '../prototypes/world-atlas/game-recipes.mjs';
import {coverageFor} from '../prototypes/world-atlas/mechanics.mjs';
import {readKey} from '../prototypes/world-atlas/library-reading.mjs';

test('reading metadata opens collected pass files by file URL', t => {
    const dir = mkdtempSync(join(tmpdir(), 'atlas-reading-'));
    const files = ['shard_test_ch001-001.txt', 'testc001_rules.jsonl'].map(name => join(dir, name));
    t.after(() => {for (const file of files) unlinkSync(file); rmdirSync(dir);});
    writeFileSync(files[0], 'fixture chapter');
    writeFileSync(files[1], JSON.stringify({id: 'test.rule.travel', name: 'Travel by ferry'}) + '\n');
    const row = readKey({key: 'test', world: 'test', dir: pathToFileURL(dir).href});
    assert.equal(row.shards, 1);
    assert.equal(row.rows, 1);
});

const sheet = {id: 'w.item.silver-sheet', label: 'Silver sheet', kind: 'item'};
const charm = {id: 'w.item.slumber-charm', label: 'Slumber charm', kind: 'item', touchedByLead: true};
const rule = {id: 'w.rule.charm', name: 'Charm crafting', kind: 'craft', inputs: [{item: 'w.item.silver-sheet', role: 'main'}, {item: 'herb powder'}, {item: ''}],
    products: [{item: 'w.item.slumber-charm'}], costs: [{amount: 15, unit: 'soli'}], steps: [{}, {}]};

test('non-string historical identities are withheld without fabricating record ids', () => {
    const malformed = [12, {source: 'unjoined'}, ['w.person.array'], '   ', null];
    const d = digestWorld({world:'w',shards:[{prefix:'a',
        census:[sheet,...malformed.map(id=>({id,kind:'item'}))],
        people:[{id:'w.person.valid'},...malformed.map(id=>({id}))],
        places:[{id:'w.place.valid'},...malformed.map(id=>({id}))],
        rules:[rule,...malformed.map(id=>({id,kind:'spell'}))]}]});
    assert.deepEqual(d.entities.map(e=>e.id).sort(),[sheet.id,'w.person.valid','w.place.valid'].sort());
    assert.deepEqual(d.rules.map(r=>r.id),[rule.id]);
    assert.equal(d.counts.items.rows,1);
    assert.equal(d.counts.ties.rows,1);
    assert.equal(d.counts.places.rows,1);
});

test('an entity seen in three shards counts once, with three slices', () => {
    const d = digestWorld({world: 'w', shards: ['a', 'b', 'c'].map(prefix => ({prefix, census: [sheet, charm], rules: [rule]}))});
    assert.equal(d.counts.items.rows, 6);
    assert.equal(d.counts.items.distinct, 2);
    assert.equal(d.entities.find(e => e.id === sheet.id).seen, 3);
    assert.equal(d.counts.making.distinct, 1);
    assert.equal(d.rules[0].seen, 3);
});

test('rule items join to census entries; plain words without a census row stay, unmatched; empty refs drop', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [sheet, charm, {id: 'w.item.herb-powder', label: 'Herb powder', kind: 'item'}], rules: [{...rule, inputs: [...rule.inputs, {item: 'natural mineral'}]}]}]});
    const r = d.rules[0];
    assert.deepEqual(r.inputs.map(x => [x.id, x.matched]), [['w.item.silver-sheet', true], ['w.item.herb-powder', true], ['w.item~natural-mineral', false]]);
    assert.equal(r.products[0].label, 'Slumber charm');
    assert.deepEqual(itemRef('w', 'w.item.x'), {id: 'w.item.x', label: null});
});

test('item facts and working details retain source evidence without promoting sealed rows', () => {
    const statement = {what: 'Heat the silver', minutes: 5, label: 'S', locator: 'en b1 c2 p4'};
    const base = {...rule, place: 'w.place.forge', conditions: ['A lit forge'], steps: [statement],
        results: [{what: 'The charm cracks', when: 'failure', label: 'T', locator: 'en b1 c2 p6'}]};
    const digest = digestWorld({world: 'w', shards: [{prefix: 'a', census: [sheet, charm], rules: [base], other: {rules: [
        {about: [sheet.id], what: 'It bends easily', label: 'T', locator: 'en b1 c2 p3'},
    ]}}, {prefix: 'b', rules: [{...base, steps: [statement, {...statement, what: 'Secret step', sealed: ['withhold']}]},
        {...base, id: 'w.rule.secret', sealed: ['withhold']}]}]});
    assert.deepEqual(digest.entities.find(e => e.id === sheet.id).facts, [{what: 'It bends easily', label: 'T', locator: 'en b1 c2 p3'}]);
    const [working] = digest.rules;
    assert.deepEqual(working.procedure, [{...statement, when: null}]);
    assert.deepEqual(working.conditions, ['A lit forge']);
    assert.equal(working.results[0].when, 'failure');
    assert.equal(working.place, 'w.place.forge');
    assert.doesNotMatch(JSON.stringify(digest), /Secret step|w\.rule\.secret/);
});

test('powers preserve acquisition, cost and exact scene use while withholding sealed references', () => {
    const id = 'w.spell.glow', secret = 'w.ability.secret';
    const learn = {teacher: 'w.person.guide', practice: 'Keep the light steady', label: 'T', locator: 'en b1 c2 p3'};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', rules: [{id, kind: 'spell', acquire: learn, costStated: 'not-mentioned'},
        {id: secret, kind: 'ability', sealed: ['withhold']}], scenes: [{beat: 'w.scene.try', steps: [{using: [id, secret, 'glow']}]},
        {beat: 'w.scene.withheld', sealed: ['withhold'], steps: [{using: [id]}]}]},
    {prefix: 'b', rules: [{id, kind: 'spell', limits: ['Fades in rain'], costStated: 'stated', costs: [{amount: 0, unit: 'mana', label: 'S'}]}]}]});
    const [row] = d.rules;
    assert.deepEqual(row.acquisition, [learn]);
    assert.deepEqual(row.limits, ['Fades in rain']);
    assert.equal(row.costStated, 'stated');
    assert.equal(row.costs[0].amount, 0);
    assert.deepEqual(d.scenes.map(s => s.powers), [[id]]);
    assert.doesNotMatch(JSON.stringify(d), /w\.ability\.secret|w\.scene\.withheld/);
    assert.equal(findingsMatrix([d]).worlds[0].powers, 1);
});

test('power evidence uses the exact qualified coverage id', () => {
    const id = 'lotm.ability.abyss_0.corruption', missing = 'another.ability.abyss_0.corruption';
    const evidence = coverageFor(new Set([id, missing]));
    assert.ok(evidence.get(id).some(row => row.ledger === 'lotm_powers.jsonl' && row.state));
    assert.equal(evidence.has(missing), false);
});

test('groups retain exact institutional links and law enforcement evidence', () => {
    const guild = 'w.org.guild', institution = 'w.institution.register', secret = 'w.org.hidden';
    const law = {id: 'w.law.port', kind: 'law', enforcement: {enforcer: guild, penalty: 'A fine', detection: 'Inspect the manifest', label: 'T'},
        consequences: [{trigger: 'A missing seal', response: 'Delay the cargo', by: guild}, {trigger: 'Secret trigger', by: guild, sealed: ['withhold']}]};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [{id: guild, kind: 'org'}, {id: secret, kind: 'org', sealed: ['withhold']}],
        rules: [law, {id: institution, kind: 'institution', who: [guild]}], other: {rules: [
            {about: [guild], what: 'They check manifests', label: 'S', locator: 'en b1 c1 p2'},
            {about: [institution], what: 'It handles arrivals', label: 'T', locator: 'en b1 c1 p3'},
        ]}, scenes: [{beat: 'w.scene.port', touched: [{id: guild, status: 'present'}, {id: institution, status: 'present'}, {id: secret, status: 'present'}]}]}]});
    assert.deepEqual(d.entities[0].facts.map(f => f.what), ['They check manifests']);
    assert.deepEqual(d.rules[0].groups, [guild]);
    assert.deepEqual(d.rules[0].enforcement, [law.enforcement]);
    assert.equal(d.rules[0].consequences[0].response, 'Delay the cargo');
    assert.equal(d.rules[1].facts[0].what, 'It handles arrivals');
    assert.deepEqual(d.scenes[0].groups, [guild, institution]);
    assert.equal(findingsMatrix([d]).worlds[0].groups, 2);
    assert.doesNotMatch(JSON.stringify(d), /w\.org\.hidden|Secret trigger/);
});

test('texture rows dedupe by kind and wording; the matrix keeps counts only', () => {
    const t = {services: [{what: 'Carriage hire'}, {what: 'carriage  hire'}], news: [{what: 'Carriage hire'}]};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [], rules: [], texture: t}]});
    assert.equal(d.counts.life.rows, 3);
    assert.equal(d.counts.life.distinct, 2);
    const m = findingsMatrix([{...d, keys: ['w1'], planned: 4, extraSlices: 0}]);
    assert.equal(m.worlds[0].read, 1);
    assert.equal(m.worlds[0].entities, undefined);
});

test('place records preserve distinct local service prices and routine times', () => {
    const hall = 'w.place.hall', quay = 'w.place.quay';
    const service = {place: hall, what: 'Lodging', amount: 8, unit: 'soli', per: 'per night', priceStated: 'stated', hours: 'until dusk'};
    const slot = {place: hall, what: 'Serves dinner', days: 'Monday', from: '18:00', to: '20:00'};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [
        {id: hall, kind: 'place'}, {id: 'w.person.cook', kind: 'person'},
        {id: 'w.price.dinner', kind: 'price', amount: {value: 4, unit: 'soli', per: 'per plate'}, whereabouts: [{place: hall}]},
    ], places: [{id: hall, hours: 'opens at noon', affordances: [{what: 'Eat dinner', class: 'eat', needs: ['Coin']}]}, {id: quay}],
    people: [{id: 'w.person.cook', routine: [slot, {...slot, from: '19:00'}, slot]}],
    texture: {services: [service, {...service, place: quay}, {...service, amount: 0, priceStated: 'stated-free'}, service]}},
    {prefix: 'b', places: [{id: hall, hours: 'closes at dusk'}]}]});
    const byId = new Map(d.entities.map(e => [e.id, e]));
    assert.deepEqual(d.life.map(s => [s.at, s.amount.value, s.priceStated, s.hours]), [
        [hall, 8, 'stated', 'until dusk'], [quay, 8, 'stated', 'until dusk'], [hall, 0, 'stated-free', 'until dusk'],
    ]);
    assert.deepEqual(byId.get(hall).hourRecords.map(h => h.hours), ['opens at noon', 'closes at dusk']);
    assert.deepEqual(byId.get(hall).affordances[0].needs, ['Coin']);
    assert.deepEqual(byId.get('w.person.cook').routine.map(s => s.from), ['18:00', '19:00']);
    assert.deepEqual(byId.get('w.price.dinner').amount, {value: 4, unit: 'soli', per: 'per plate'});
    assert.equal(byId.get(quay).col, 'places', 'reader place rows work without a census match');
});

test('people retain multiple directional ties, exact routine evidence and scene times', () => {
    const person = 'w.person.guide', other = 'w.person.herbalist', place = 'w.place.market';
    const tie = {with: other, kind: 'teacher', attitude: 'patient', since: 'early spring', label: 'S', locator: 'en b1 c1 p3'};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', people: [{id: person,
        routine: [{what: 'Guides travelers', place, from: '09:00', to: '12:00', locator: 'en b1 c1 p4'}],
        relations: [tie, {...tie, kind: 'customer'}, tie, {...tie, kind: 'secret ally', sealed: ['conceal']}]}],
    rules: [{id: 'w.ability.guide', kind: 'ability', who: [person]}],
    other: {people: [{what: 'Works as a guide.', about: [person], label: 'T', locator: 'en b1 c1 p3'}]},
    scenes: [{beat: 'w.scene.meeting', place, present: [person], timeOfDay: {value: 'noon'}, evidence: [{locator: 'en b1 c1 p5'}]},
        {beat: 'w.scene.secret', place, present: [person], timeOfDay: {value: 'midnight'}, sealed: ['conceal']}]}]});
    const e = d.entities.find(r => r.id === person);
    assert.equal(e.col, 'people');
    assert.deepEqual(e.facts.map(f => f.what), ['Works as a guide.']);
    assert.deepEqual(e.relations, [tie, {...tie, kind: 'customer'}]);
    assert.deepEqual(d.rules[0].people, [person]);
    assert.deepEqual(d.scenes.map(s => s.time), ['noon']);
    assert.doesNotMatch(JSON.stringify(d), /secret ally|w\.scene\.secret|midnight/);
});

test('scene time granularity stays explicit without guessing unknown times or changing zero-minute actions',()=>{
    const scenes=[
        {beat:'w.scene.band',timeOfDay:{value:'After lunch',precision:'band'},steps:[{verb:'Wait',time:{minutes:0}}]},
        {beat:'w.scene.minute',timeOfDay:{value:'00:00',precision:'minute'}},
        {beat:'w.scene.unknown',timeOfDay:{value:'Unstated within this chapter',precision:'band'}},
        {beat:'w.scene.legacy',timeOfDay:{value:'Dawn'}},
        {beat:'w.scene.invalid',timeOfDay:{value:'Noon',precision:'PRIVATE UNSUPPORTED VALUE'}},
        {beat:'w.scene.sealed',timeOfDay:{value:'PRIVATE MIDNIGHT',precision:'minute'},sealed:['secret']},
    ];
    const digest=digestWorld({world:'w',shards:[{prefix:'a',scenes}]}),byId=new Map(digest.scenes.map(row=>[row.id,row]));
    assert.equal(byId.get('w.scene.band').timePrecision,'band');
    assert.equal(byId.get('w.scene.band').detail.actions[0].minutes,0);
    assert.equal(byId.get('w.scene.minute').time,'00:00');
    assert.equal(byId.get('w.scene.minute').timePrecision,'minute');
    for(const id of ['unknown','legacy','invalid'])assert.equal(byId.get('w.scene.'+id).timePrecision,undefined);
    assert.equal(byId.get('w.scene.unknown').time,'Unstated within this chapter');
    assert.doesNotMatch(JSON.stringify(digest),/PRIVATE/);
});

test('reader scenes sort by locator, dedupe by beat and omit sealed details even when a duplicate was unsealed', () => {
    const later = {beat: 'w.later', place: 'w.place.harbor', evidence: [{locator: 'en b2 c1 p4'}, {locator: 'en b2 c1 p7'}], steps: [{}],
        present: ['w.person.test'], pov: 'w.person.test', touched: [{kind: 'item', id: 'w.item.test', status: 'present'}]};
    const earlier = {beat: 'w.earlier', evidence: [{locator: 'zh 第12章 p5'}], options: [{}], outcomes: [{value: 'private prose'}]};
    const hidden = {beat: 'w.hidden', place: 'w.place.secret', evidence: [{locator: 'en b1 c5 p7'}], present: ['w.person.hidden']};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', scenes: [later, earlier, hidden]},
        {prefix: 'b', scenes: [later, {...hidden, sealed: ['withhold']}]}]});
    assert.deepEqual(d.counts.scenes, {rows: 5, distinct: 3});
    assert.deepEqual(d.scenes, [
        {id: 'w.earlier', place: null, locator: 'zh 第12章 p5', locators: ['zh 第12章 p5'], shards: ['a'], refs: [], people: [], steps: 0, options: 1, outcomes: 1},
        {id: 'w.later', place: 'w.place.harbor', locator: 'en b2 c1 p4', locators: ['en b2 c1 p4', 'en b2 c1 p7'],
            shards: ['a', 'b'], refs: ['w.item.test'], people: ['w.person.test'], steps: 1, options: 0, outcomes: 0},
    ]);
    assert.equal(d.sealedScenes, 1);
    assert.equal(findingsMatrix([d]).worlds[0].sceneIndex, 3);
    assert.doesNotMatch(JSON.stringify(d), /w\.hidden|w\.person\.hidden|w\.place\.secret|private prose/);
});

test('scene details preserve source choices and outcomes without linking withheld beats', () => {
    const start = {beat: 'w.scene.start', evidence: [{locator: 'en b1 c1 p2'}]};
    const hidden = {beat: 'w.scene.hidden', steps: [{verb: 'Hidden event'}]};
    const detail = {beat: 'w.scene.detail', place: 'w.place.quay', date: {value: 'first snowfall', label: 'I'},
        steps: [{verb: 'Ask about the ferry', actor: 'w.person.guide', label: 'S', time: {minutes: 0}, locator: 'en b1 c1 p5'},
            {verb: 'Hidden step', sealed: ['withhold']}],
        choices: [{taken: 'Wait at the dock', options: ['Take the ferry'], label: 'S'}],
        options: [{action: 'Take the ferry', taken: false, needs: ['A fare'], label: 'T'}],
        outcomes: [{fact: 'ferry.departure', value: 'Departs at sunset', class: 'changed'}],
        deps: [{id: start.beat, kind: 'after'}, {id: hidden.beat, kind: 'needs'}, {id: 'w.scene.unknown', kind: 'after'}]};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', scenes: [start, hidden, detail]},
        {prefix: 'b', scenes: [{...hidden, sealed: ['withhold']}]}]});
    const record = d.scenes.find(r => r.id === detail.beat).detail;
    assert.equal(record.actions[0].minutes, 0);
    assert.equal(record.options[0].taken, false);
    assert.deepEqual(record.choices[0].alternatives, ['Take the ferry']);
    assert.equal(record.outcomes[0].value, 'Departs at sunset');
    assert.deepEqual(record.related, [{id: start.beat, kind: 'after'}]);
    assert.doesNotMatch(JSON.stringify(d), /Hidden event|Hidden step|scene\.hidden|scene\.unknown/);
});

test('creatures join sourced facts, sightings, rules and scene references by stable ID', () => {
    const creature = 'w.creature.fox', other = 'w.creature.moth';
    const encounter = {place: 'w.place.woods', status: 'inferred', locator: 'en b1 c1 p3'};
    const fact = {what: 'Hunts at dusk', label: 'S', locator: 'en b1 c1 p4'};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [{id: creature, kind: 'creature', whereabouts: [encounter, encounter]}],
        rules: [{id: 'w.ability.burrow', kind: 'ability', who: [creature]}], other: {rules: [
            {...fact, about: [creature]}, {...fact, about: [other]}, {...fact, about: [creature], label: 'I', what: 'speculation'},
            {...fact, about: [creature], sealed: ['withheld'], what: 'secret fact'},
        ]}, scenes: [{beat: 'w.scene.hunt', touched: [{kind: 'creature', id: creature, status: 'present'}, {kind: 'creature', id: other, status: 'missing'}]}]},
    {prefix: 'b', census: [{id: other, kind: 'creature'}]}]});
    assert.deepEqual(d.entities.find(e => e.id === creature).sightings, [encounter]);
    assert.deepEqual(d.entities.find(e => e.id === creature).facts, [fact]);
    assert.deepEqual(d.entities.find(e => e.id === other).facts, [fact]);
    assert.deepEqual(d.rules[0].creatures, [creature]);
    assert.deepEqual(d.scenes[0].refs, [creature]);
    assert.doesNotMatch(JSON.stringify(d), /secret fact/);
});

test('game recipes: item, component variants and equipment become workings', () => {
    const src = `
    smelting_recipes.items["Iron ingot"] = new ItemRecipe({name: "Iron ingot", materials: [{material_id: "Iron ore", count: 5}], result: {result_id: "Iron ingot", count: 1}, recipe_skill: "Smelting"});
    forging_recipes.components["Short blade"] = new ComponentRecipe({name: "Short blade", materials: [
        {material_id: "Iron ingot", count: 2, result_id: "Iron short blade"}, {material_id: "Steel ingot", count: 2, result_id: "Steel short blade"}], recipe_skill: "Forging"});
    crafting_recipes.equipment["Dagger"] = new EquipmentRecipe({name: "Dagger", components: ["short blade", "short handle"], item_type: "Weapon"});`;
    const {recipes, notes} = extractRecipes(src);
    assert.deepEqual(notes, []);
    assert.deepEqual(recipes.map(r => r.name), ['Iron ingot', 'Iron short blade', 'Steel short blade', 'Dagger']);
    assert.deepEqual(recipes[0].inputs.map(x => [x.id, x.qty]), [['game.iron-ore', 5]]);
    assert.deepEqual(recipes[1].products.map(x => x.id), ['game.iron-short-blade', 'game.short-blade']);
    assert.deepEqual(recipes[3].inputs.map(x => x.id), ['game.short-blade', 'game.short-handle']);
});

test('people, places, other rows and fills fold onto entities; agent fill joins the census and is marked', () => {
    const klein = {id: 'w.person.klein', label: 'Klein', kind: 'person'}, port = {id: 'w.place.port', label: 'Port', kind: 'place'};
    const shard = prefix => ({prefix, census: [sheet, charm, klein, port], rules: [{...rule, products: []}],
        people: [{id: klein.id, routine: [{what: 'writes letters', place: port.id}], relations: [{with: 'w.person.azik', kind: 'mentor'}], knows: [{fact: 'x'}]}],
        places: [{id: port.id, hours: 'dawn to dusk', affordances: [{class: 'travel', what: 'buy a ticket'}]}],
        other: {rules: [{what: 'Copper whistle lacks an id', about: [sheet.id]}], texture: [{what: 'copper whistle lacks an id'}]},
        fills: [{id: 'w.fill.sun', kind: 'person', what: 'Sun seat unnamed', layer: 'invented'}]});
    const d = digestWorld({world: 'w', shards: [shard('a'), shard('b')], makingFill: [{id: rule.id, products: [{item: 'w.item.slumber-charm', confidence: 'stated'}], outcome: null}]});
    const k = d.entities.find(e => e.id === klein.id), p = d.entities.find(e => e.id === port.id);
    assert.equal(k.routine.length, 1);
    assert.equal(k.relations[0].kind, 'mentor');
    assert.equal(k.knows, 2);
    assert.equal(p.hours, 'dawn to dusk');
    assert.equal(p.affordances.length, 1);
    assert.equal(d.counts.notes.distinct, 1, 'other rows dedupe by wording across passes and shards');
    assert.equal(d.entities.find(e => e.id === sheet.id).notes, 1);
    assert.equal(d.counts.fills.distinct, 1);
    const made = d.rules[0].products[0];
    assert.deepEqual([made.id, made.matched, made.fill], ['w.item.slumber-charm', true, 'stated']);
});

test('game making: a playable citation beats a recorded one; no citation is absent', async () => {
    const {ruleState} = await import('../prototypes/world-atlas/game-making.mjs');
    assert.equal(ruleState(undefined), 'absent');
    assert.equal(ruleState([{playable: false}]), 'recorded');
    assert.equal(ruleState([{playable:false,bound:true}]),'bound');
    assert.equal(ruleState([{playable: false}, {playable: true}]), 'playable');
});

test('recharge capability and its verified receipt apply to the exact Slumber upkeep binding', async () => {
    const {gameMaking,citesMakingCapability,ruleState}=await import('../prototypes/world-atlas/game-making.mjs');
    const recharge='lotm.craft.charm-recharge';
    assert.equal(citesMakingCapability({id:'lotm.craft.slumber-charm',cites:[recharge]},recharge),false);
    assert.equal(citesMakingCapability({id:'lotm.craft.soothing-charm',cites:[recharge]},recharge),false);
    assert.equal(citesMakingCapability({id:'lotm.craft.slumber-charm',cites:['lotm.craft.charm-making']},'lotm.craft.charm-making'),true);
    const links=gameMaking().worlds.lotm.byRule[recharge]||[];
    assert.deepEqual(links.map(link=>link.row),['lotm.craft.slumber-charm-upkeep']);
    assert.equal(links[0].bound,true);assert.equal(links[0].playable,true);
    assert.equal(links[0].scope,'Slumber charms only');
    assert.equal(links[0].verification.state,'agent-verified, not human-reviewed');
    const {readFileSync}=await import('node:fs');
    const proof=JSON.parse(readFileSync(new URL('../'+links[0].verification.proof,import.meta.url),'utf8'));
    assert.equal(links[0].verification.bundleSha256,proof.bundleHash);
    assert.match(proof.route,/synthetic aged Slumber workshop/);
    assert.equal(proof.keptAfter,'save/reload/Export/literal Import');
    assert.equal(ruleState(links),'playable');
});

test('LOTM charm candidates reflect the live craft bindings and the separate dream consumer', async () => {
    const {gameMaking} = await import('../prototypes/world-atlas/game-making.mjs');
    const {defineActs, LOTM_ACT_ROWS} = await import('../src/book_world_lotm_acts_host.js');
    const {byRule, candidates, slumber} = gameMaking().worlds.lotm;
    const {commands, unbound} = defineActs();
    const rowCommands = id => commands.filter(c => c.lotmAct.rowId === id).length;
    assert.deepEqual((byRule[candidates.readerId] ?? []).map(link => link.row),
        LOTM_ACT_ROWS.filter(row => row.sourceIds?.includes(candidates.readerId)).map(row => row.id),
        'the proposed match leaves the actual citations intact');
    assert.deepEqual(candidates.cards.map(c => c.id.slice('lotm.craft.'.length)), ['slumber-charm', 'soothing-charm', 'dream-charm']);
    for (const card of candidates.cards) {
        assert.equal(card.commands, rowCommands(card.id));
        assert.deepEqual(card.reasons, unbound.find(r => r.id === card.id)?.reasons ?? []);
        assert.ok(card.locators.length);
    }
    const dream = candidates.cards.find(c => c.id === 'lotm.craft.dream-charm');
    assert.equal(dream.consumer.id, 'lotm.rite.dream-entry');
    assert.equal(dream.consumer.commands, rowCommands(dream.consumer.id));
    assert.deepEqual([slumber.game.make, slumber.game.use], [rowCommands('lotm.craft.slumber-charm') > 0, rowCommands('lotm.craft.slumber-charm-use') > 0]);
});

test('an evidence letter in a census label is not a name; a later real label replaces it', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [{id: 'w.item.moon-flower', label: 'S', kind: 'item'}]}, {prefix: 'b', census: [{id: 'w.item.moon-flower', label: 'Moon flower', kind: 'item'}]},
        {prefix: 'c', census: [{id: 'w.item.gold-mint', label: 'T', kind: 'item'}]}]});
    assert.equal(d.entities.find(e => e.id === 'w.item.moon-flower').label, 'Moon flower');
    assert.equal(d.entities.find(e => e.id === 'w.item.gold-mint').label, 'Gold mint');
    assert.ok(!('fallback' in d.entities[0]) || d.entities[0].fallback === undefined);
});
