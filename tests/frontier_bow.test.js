// W11-E: the Frontier hunter's bow is reachable: items, recipes and the "Hunt the boar" tempo openers. Arrows move from the inventory to the bow's
// quiver when the hunt opens and are spent and written back once by the tempo host (tempo_fight.js finishFight).
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, tempoView} from '../src/tempo_fight.js';
import {tempoOpener} from '../src/tempo_starters.js';
import {frontierBowKeys} from '../src/stock_kinds.js';
import {BOW_ITEM, ARROW_ITEM, POISONED_ARROW_ITEM, FRONTIER_BOW_ITEM_SPECS, FRONTIER_BOW_DIALS, huntOpenerId, emptyQuiver, stringArrows, looseArrows, quiverArrows, registerFrontierBowItems, registerFrontierBowRecipes} from '../src/frontier_bow.js';
import {loadNative} from './helpers/native_loader.mjs';

const key = id => JSON.stringify({id});
const vitals = {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}};
const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
const me = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const helpers = {me, vitals: vitals.player, parts: {}, enemyProfile: () => ({stats: {...stats, attack_points: 12, crit_rate: .05}, attackPower: 4, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5})};
function fresh(inventory = {}) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    Object.assign(p.gameplay.player.inventory, inventory);
    return {p, context: fieldContext(p, 'Village', {vitals})};
}
const ctxOf = p => fieldContext(p, 'Village', {vitals});
const fight = plan => plan.state.simulation.sessions.player?.nativeBattle;
function begin(p, context, kind) {
    const opener = tempoOpener(huntOpenerId(kind));
    return beginTempoFight(p.state, registry, context, opener.spec(p.state, context, helpers));
}
// Looses until the fight ends, yielding when the quiver is empty; returns the plan.
function hunt(plan, context) {
    for(let i = 0; i < 120 && fight(plan); i++) {
        const v = tempoView(fight(plan)); if(!v.yourTurn) throw Error('not my turn');
        const use = id => v.moves.find(x => x.id === id && x.usable);
        plan = commitTempoMove(plan.state, registry, context, {moveId: use('shoot') ? 'shoot' : use('reload') ? 'reload' : 'yield'});
    }
    assert.equal(fight(plan), undefined, 'the hunt ended');
    return plan;
}
const A = frontierBowKeys('arrow'), P = frontierBowKeys('poisoned_arrow');
const onHand = (plan, keys) => (plan.state.actors.player.resources[keys.loaded] || 0) + (plan.state.actors.player.resources[keys.carried] || 0);

test('the hunt is visible with a bow and arrows of that kind, and only then', () => {
    const plain = tempoOpener(huntOpenerId('arrow')), poisoned = tempoOpener(huntOpenerId('poisoned_arrow'));
    assert.ok(plain && poisoned);
    let {p, context} = fresh();
    assert.equal(plain.quote(p.state, context).visible, false, 'no bow, no arrows');
    ({p, context} = fresh({[key(ARROW_ITEM)]: 5}));
    assert.equal(plain.quote(p.state, context).visible, false, 'arrows but no bow');
    ({p, context} = fresh({[key(BOW_ITEM)]: 1}));
    assert.equal(plain.quote(p.state, context).visible, false, 'a bow but no arrows');
    ({p, context} = fresh({[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 5}));
    const q = plain.quote(p.state, context);
    assert.deepEqual([q.visible, q.eligible], [true, true]); assert.match(q.reason, /5 plain arrows/);
    assert.equal(poisoned.quote(p.state, context).visible, false, 'no poisoned arrows yet');
    const other = structuredClone(p.state); other.actors.player.worldId = 'book.elsewhere';
    assert.equal(plain.quote(other, context).visible, false, 'a Frontier hunt');
    const open = structuredClone(p.state); open.simulation.sessions.player = {id: 'x'};
    assert.deepEqual([plain.quote(open, context).visible, plain.quote(open, context).eligible], [true, false]);
});

test('opening the hunt stages the move: loose arrows go to the quiver in the same plan, the live state is untouched', () => {
    const {p, context} = fresh({[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 6, [key(POISONED_ARROW_ITEM)]: 2});
    const liveState = structuredClone(p.state), liveInv = structuredClone(context.gameplay);
    const plan = begin(p, context, 'arrow');
    assert.deepEqual(p.state, liveState, 'the state handed to spec is not mutated');
    assert.deepEqual(context.gameplay, liveInv);
    assert.equal(looseArrows(plan.gameplay, 'arrow'), 0); assert.equal(plan.gameplay.player.inventory[key(BOW_ITEM)], 1, 'the bow stays in the pack');
    assert.equal(looseArrows(plan.gameplay, 'poisoned_arrow'), 2, 'the other kind is not touched');
    assert.deepEqual([plan.state.actors.player.resources[A.loaded], plan.state.actors.player.resources[A.carried]], [1, 5]);
    const b = fight(plan);
    assert.equal(b.title, 'A boar at the meadow edge'); assert.deepEqual(b.fighters['frontier.meadow.boar'].tags, ['living', 'beast']);
    assert.equal(b.fighters.player.stock.kind, 'arrow'); assert.equal(b.fighters.player.stock.loaded + b.fighters.player.stock.carried, 6);
    assert.equal(b.floor, 1);
    // The shape the opener copies from beginTempoFight: a normally begun fight has the same session keys.
    const ref = beginTempoFight(p.state, registry, context, {id: 'n', title: 'n', floor: 1, fighters: [
        {id: 'player', name: 'You', side: 'a', hp: 30, stamina: 30, profile: me, moves: ['jab']}, {id: 'f', name: 'F', side: 'b', hp: 9, stamina: 9, profile: me}]}).state.simulation.sessions.player;
    assert.deepEqual(Object.keys(plan.state.simulation.sessions.player).sort(), Object.keys(ref).sort());
});

test('arrows are spent in the hunt and written back once; plain and poisoned stay separate; reload agrees', () => {
    const {p, context} = fresh({[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 8, [key(POISONED_ARROW_ITEM)]: 3});
    let plan = begin(p, context, 'arrow');
    const opened = onHand(plan, A); assert.equal(opened, 8);
    plan = commitTempoMove(plan.state, registry, ctxOf({...p, gameplay: plan.gameplay, external: plan.external}), {moveId: 'shoot'});
    assert.equal(plan.state.actors.player.resources[A.loaded], 1, 'no write-back while the fight is open');
    plan = hunt(plan, ctxOf({...p, gameplay: plan.gameplay, external: plan.external}));
    const left = onHand(plan, A);
    assert.equal(left < opened, true, 'arrows were spent');
    assert.equal(looseArrows(plan.gameplay, 'arrow'), 0, 'none came back to the pack by themselves');
    assert.equal(looseArrows(plan.gameplay, 'poisoned_arrow'), 3); assert.equal(onHand(plan, P), 0);
    assert.ok(['won', 'withdrawn', 'yielded', 'lost'].includes(plan.state.actors.player.facts['tempo.lastResult']));
    const again = loadExpansionState(JSON.parse(JSON.stringify(plan.state)), registry);
    assert.equal(onHand({state: again}, A), left, 'saved and reloaded: the same counts, no second write');
});

test('a second hunt counts the quiver with any new loose arrows; emptying the quiver returns them to the pack', () => {
    const {p, context} = fresh({[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 2});
    p.state.actors.player.resources[A.loaded] = 1; p.state.actors.player.resources[A.carried] = 3;
    const q = tempoOpener(huntOpenerId('arrow')).quote(p.state, context);
    assert.match(q.reason, /6 plain arrows/);
    const plan = begin(p, context, 'arrow');
    assert.equal(onHand(plan, A), 6); assert.equal(looseArrows(plan.gameplay, 'arrow'), 0);
    const closed = {state: structuredClone(plan.state), gameplay: structuredClone(plan.gameplay)};
    assert.equal(emptyQuiver(closed, 'arrow'), 6);
    assert.equal(looseArrows(closed.gameplay, 'arrow'), 6); assert.equal(quiverArrows(closed.state.actors.player.resources, 'arrow'), 0);
});

test('poisoned arrows: the poisoned opener spends only that kind and the foe is tagged living', () => {
    const {p, context} = fresh({[key(BOW_ITEM)]: 1, [key(ARROW_ITEM)]: 4, [key(POISONED_ARROW_ITEM)]: 8});
    let plan = begin(p, context, 'poisoned_arrow');
    assert.equal(fight(plan).fighters.player.stock.kind, 'poisoned_arrow');
    assert.equal(looseArrows(plan.gameplay, 'arrow'), 4, 'plain arrows stay loose'); assert.equal(onHand(plan, P), 8);
    plan = hunt(plan, ctxOf({...p, gameplay: plan.gameplay, external: plan.external}));
    assert.equal(onHand(plan, P) < 8, true); assert.equal(onHand(plan, A), 0);
});

test('an untouched life writes nothing: no bow keys appear until a hunt opens', () => {
    const {p, context} = fresh();
    tempoOpener(huntOpenerId('arrow')).quote(p.state, context);
    assert.deepEqual(Object.keys(p.state.actors.player.resources).filter(k => k.includes('.bow.')), []);
    const loaded = loadExpansionState(JSON.parse(JSON.stringify(p.state)), registry);
    assert.deepEqual(loaded, p.state);
    const spare = {state: structuredClone(p.state), gameplay: structuredClone(p.gameplay)};
    assert.equal(stringArrows(spare, 'arrow'), 0); assert.deepEqual(spare.state, p.state, 'no arrows, no write');
});

test('items and recipes: registered once, inputs exist, the poisoned batch conserves its arrows and spends one toxin gland', async () => {
    const {recipes, item_templates} = await loadNative('import "./src/data/expedition_items.js"; export {recipes} from "./src/crafting_recipes.js"; export {item_templates} from "./src/items.js";', {prefix: 'w11e-bow-'});
    for(const s of FRONTIER_BOW_ITEM_SPECS) assert.ok(item_templates[s.id], `${s.id} is an item`);
    const r = recipes.woodworking.items;
    for(const id of [BOW_ITEM, ARROW_ITEM, POISONED_ARROW_ITEM]) {
        const rec = r[id]; assert.ok(rec, `${id} has a recipe`);
        assert.ok(item_templates[rec.result.result_id], 'the result is an item');
        for(const m of rec.materials) assert.ok(item_templates[m.material_id], `${m.material_id} exists`);
    }
    const dip = r[POISONED_ARROW_ITEM];
    assert.deepEqual(dip.materials.map(m => [m.material_id, m.count]), [[ARROW_ITEM, FRONTIER_BOW_DIALS.dipPerGland.value], ['Toxin gland', 1]]);
    assert.equal(dip.result.count, dip.materials[0].count, 'every dipped arrow is a plain arrow that was spent');
    assert.equal(r[ARROW_ITEM].materials.some(m => m.material_id === 'Processed rough wood'), true, 'a Frontier-bought log makes the shaft');
    assert.throws(() => registerFrontierBowItems({itemTemplates: item_templates, OtherItem: class {}}), /Duplicate/);
    assert.throws(() => registerFrontierBowRecipes({recipes, ItemRecipe: class {}}), /Duplicate/);
});
