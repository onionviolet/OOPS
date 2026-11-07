// W11-E: the Frontier hunter's bow made reachable. Items and recipes (data, registered by the item and recipe files), and two tempo openers
// ("Hunt the boar at the meadow edge", plain or poisoned arrows) registered through registerTempoOpener. Original: a boar at the meadow edge is
// not a book scene. Leaf module for fights: it imports the stock kinds and the opener registry only; the host supplies the native actor.
//
// Where arrows live (the one authority per fact, AR2): loose arrows are inventory items. A fight keeps its arrows in the stock the road duel
// already declared, the player's actor resources `world.base.frontier.bow.nocked.<kind>` and `...quiver.<kind>`. The tempo host writes the
// spent counts back to those keys exactly once, when the fight ends (tempo_fight.js finishFight). So the opener's spec stages ONE move in the
// plan it hands the host: every loose arrow of the chosen kind leaves the inventory and goes into the bow's nock and quiver, in the same
// commit that opens the fight. Arrows left over stay in the quiver; the next hunt counts them with any loose ones. Nothing here mutates the
// live state handed to quote or spec.
import {registerTempoOpener} from './tempo_starters.js';
import {STOCK_PROPERTY_DIALS, frontierBowKeys, frontierBowStock, stockKindLabel, FRONTIER_BOW} from './stock_kinds.js';

export const BOW_ITEM = "Hunter's bow", ARROW_ITEM = "Hunter's arrow", POISONED_ARROW_ITEM = "Poisoned hunter's arrow";
export const ARROW_ITEMS = Object.freeze({arrow: ARROW_ITEM, poisoned_arrow: POISONED_ARROW_ITEM});
const itemKey = id => JSON.stringify({id});
export const FRONTIER_BOW_DIALS = Object.freeze({
    boarHp: {value: 30, why: 'A boar is sturdier than the 26-health road scout and has no wits to match; the bow stock decides how many arrows drop her (downIn).'},
    boarBody: {value: Object.freeze({attack: 7, agility: 3, dexterity: 3, intuition: 6, attack_speed: .8, defense: 2, crit_rate: .05, crit_multiplier: 1.3, attack_count: 1}),
        why: 'Strong in the charge, slow to turn, easy to unsettle: a hunt where range is the player\'s edge and a closed gap is the boar\'s.'},
    boarNotice: {value: 6, why: 'A boar at the meadow edge smells the player about as well as a hunter at the tree line sees it; neither side starts with an opening.'},
    arrowsPerBatch: {value: 4, why: 'A batch makes a short quiver from one split billet and one sinew: arrows are cheap, a day\'s hunt spends a handful.'},
    dipPerGland: {value: 4, why: 'One toxin gland dips a batch of arrows; the poison is the gland, so it is a conserved input, not a free upgrade (MR5).'}
});

// ---- items (OtherItem through the shared registration pattern) ----
export const FRONTIER_BOW_ITEM_SPECS = Object.freeze([
    {id: BOW_ITEM, value: 30, description: 'A plain self bow of split rough wood, strung with sinew string. It looses one arrow at a time, so a quiver is a plan, not a volley.'},
    {id: ARROW_ITEM, value: 2, description: 'A hunter\'s arrow: a straight shaft with a flat head. Loose arrows go to the bow\'s quiver when you begin a hunt.'},
    {id: POISONED_ARROW_ITEM, value: 5, description: 'A hunter\'s arrow dipped in toxin gland. The poison works on living things over several hits; it does nothing to stone or iron.'}
]);
export function registerFrontierBowItems({itemTemplates, OtherItem}) {
    for(const s of FRONTIER_BOW_ITEM_SPECS) {
        if(itemTemplates[s.id]) throw Error(`Duplicate Frontier bow item ${s.id}.`);
        itemTemplates[s.id] = new OtherItem({id: s.id, name: s.id, value: s.value, description: s.description, tags: {expedition: true}});
    }
}
// ---- recipes: shortcuts, not gates (MR7/MR8); inputs are conserved (MR5) ----
export function registerFrontierBowRecipes({recipes, ItemRecipe}) {
    const add = (name, spec) => {
        if(recipes.woodworking.items[name]) throw Error(`Duplicate Frontier bow recipe ${name}.`);
        recipes.woodworking.items[name] = new ItemRecipe({name, recipe_type: 'material', recipe_skill: 'Woodworking', ...spec});
    };
    add(BOW_ITEM, {materials: [{material_id: 'Processed rough wood', count: 3}, {material_id: 'Sinew string', count: 1}],
        result: {result_id: BOW_ITEM, count: 1}, success_chance: [.3, 1], recipe_level: [3, 12]});
    add(ARROW_ITEM, {materials: [{material_id: 'Processed rough wood', count: 1}, {material_id: 'Sinew', count: 1}],
        result: {result_id: ARROW_ITEM, count: FRONTIER_BOW_DIALS.arrowsPerBatch.value}, success_chance: [.4, 1], recipe_level: [1, 8]});
    // Source note: a Toxin gland is the only toxin in the item set a hunter can hold (a deep beast's drop, no Frontier herb carries one), so this is gated by that input.
    add(POISONED_ARROW_ITEM, {materials: [{material_id: ARROW_ITEM, count: FRONTIER_BOW_DIALS.dipPerGland.value}, {material_id: 'Toxin gland', count: 1}],
        result: {result_id: POISONED_ARROW_ITEM, count: FRONTIER_BOW_DIALS.dipPerGland.value}, success_chance: [.5, 1], recipe_level: [4, 14]});
}

// ---- arrows and the quiver (pure helpers over plain objects) ----
const inventoryOf = gameplay => gameplay?.player?.inventory || {};
export const hasBow = gameplay => (inventoryOf(gameplay)[itemKey(BOW_ITEM)] || 0) > 0;
export const looseArrows = (gameplay, kind) => inventoryOf(gameplay)[itemKey(ARROW_ITEMS[kind])] || 0;
export function quiverArrows(resources, kind) { const k = frontierBowKeys(kind), r = resources || {}; return (r[k.loaded] || 0) + (r[k.carried] || 0); }
export const arrowsOnHand = (state, gameplay, kind) => looseArrows(gameplay, kind) + quiverArrows(state.actors?.player?.resources, kind);
// Moves every loose arrow of `kind` into the bow (one nocked, the rest in the quiver) on a plan the caller owns. Returns how many moved.
export function stringArrows(plan, kind) {
    const keys = frontierBowKeys(kind), inv = inventoryOf(plan.gameplay), key = itemKey(ARROW_ITEMS[kind]), n = inv[key] || 0;
    const res = plan.state.actors.player.resources ||= {}, total = (res[keys.loaded] || 0) + (res[keys.carried] || 0) + n;
    if(n > 0) { delete inv[key]; }
    if(total > 0) { res[keys.loaded] = 1; if(total > 1) res[keys.carried] = total - 1; else delete res[keys.carried]; }
    return n;
}
// The reverse, for a player who wants the quiver back in the pack (not called by any panel yet). Moves the quiver and nocked arrows to the inventory.
export function emptyQuiver(plan, kind) {
    const keys = frontierBowKeys(kind), res = plan.state.actors.player.resources || {}, n = (res[keys.loaded] || 0) + (res[keys.carried] || 0);
    if(!n) return 0;
    delete res[keys.loaded]; delete res[keys.carried];
    const inv = ((plan.gameplay.player ||= {}).inventory ||= {}); inv[itemKey(ARROW_ITEMS[kind])] = (inv[itemKey(ARROW_ITEMS[kind])] || 0) + n;
    return n;
}

// ---- the hunt ----
export const BOAR = Object.freeze({id: 'frontier.meadow.boar', name: 'A boar at the meadow edge', tags: Object.freeze(['living', 'beast'])});
const PLAYER_MOVES = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield', 'shoot', 'reload'];
const inFrontier = state => state.actors?.player?.worldId === 'base.frontier';
export const huntOpenerId = kind => `frontier.hunt.${kind}`;
function huntQuote(kind) {
    return (state, context) => {
        if(!inFrontier(state) || !hasBow(context?.gameplay)) return {visible: false};
        const n = arrowsOnHand(state, context.gameplay, kind);
        if(n < 1) return {visible: false};
        if(state.simulation?.sessions?.player) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
        return {visible: true, eligible: true, reason: `${n} ${stockKindLabel(kind)}${n === 1 ? '' : 's'} for the quiver.`};
    };
}
export function huntSpec(kind) {
    return (state, context, helpers) => {
        const {me, vitals, parts, enemyProfile} = helpers;
        if(state.simulation?.sessions && Object.keys(state.simulation.sessions).length) throw Error('Another encounter is already open.');
        if(!hasBow(context.gameplay) || arrowsOnHand(state, context.gameplay, kind) < 1) throw Error('A hunt needs the bow and arrows of that kind.');
        // The staged plan: a private copy of the world with the arrows already moved. The session object has the shape tempo_fight.js builds for a
        // non-adopted fight (tests/frontier_bow.test.js pins it); the host's begin only needs it to exist.
        const adopt = {state: structuredClone(state), external: structuredClone(context.external), gameplay: structuredClone(context.gameplay), vitals: structuredClone(context.vitals), acquisitions: [], unlocks: []};
        stringArrows(adopt, kind);
        adopt.state.simulation.sessions.player = {id: `tempo:${adopt.state.sequence + 1}`, definitionId: 'tempo.fight', revision: 1, targetId: null, commandId: 'tempo.fight', claim: null,
            turns: [{responses: []}], turn: 0, lethal: false, settlement: [], answers: [], partyIds: [], participants: ['player'], nativeBattle: null};
        const stock = frontierBowStock(adopt.state.actors.player.resources, kind, [BOAR.id]);
        const hp = FRONTIER_BOW_DIALS.boarHp.value;
        return {adopt, id: `frontier-hunt-${kind}`, title: 'A boar at the meadow edge', floor: 1, conditions: {light: 'day', place: 'Meadow edge'},
            fighters: [
                {id: 'player', name: 'You', side: 'a', speed: 100, parts, hp: vitals.health, maxHp: vitals.max_health, stamina: vitals.stamina, maxStamina: vitals.max_stamina,
                    profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5, moves: PLAYER_MOVES, stock},
                {id: BOAR.id, name: BOAR.name, side: 'b', speed: 100, hp, maxHp: hp, stamina: 12, maxStamina: 12, tags: [...BOAR.tags],
                    profile: enemyProfile({...FRONTIER_BOW_DIALS.boarBody.value, health: hp, max_stamina: 12}, BOAR.name, BOAR.id),
                    perception: FRONTIER_BOW_DIALS.boarNotice.value, stealth: FRONTIER_BOW_DIALS.boarNotice.value, goals: {survive: .5, aim: .5}}]};
    };
}
for(const kind of FRONTIER_BOW.kinds) {
    registerTempoOpener({id: huntOpenerId(kind), label: kind === 'arrow' ? 'Hunt the boar at the meadow edge' : 'Hunt the boar with poisoned arrows',
        text: `Your loose ${stockKindLabel(kind)}s go to the bow's quiver and the rest of the hunt spends them; what is left stays in the quiver. You are driven off at worst, not killed.`,
        quote: huntQuote(kind), spec: huntSpec(kind)});
}
