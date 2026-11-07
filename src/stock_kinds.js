// FD3+ stock kinds with properties (lane W10-C, AD51). A kind is declared once as data: a label and a list of properties, each "against foes carrying this
// tag, the hits-to-down is scaled and the chance is shifted". The tempo fight reads the kind of the shooter's stock and the shooting target's tags at
// the moment of the shot, so the world supplies only odds (`vs`) and tags; it never re-spells the property. Pure leaf module: no world imports, no
// clock, no save slice. Every number is an authored dial (WPR5/AD49) with its reason; a kind with no property (ordinary) changes nothing.
export const STOCK_PROPERTY_DIALS = Object.freeze({
    silverVsUnnatural: {value: 0.5, why: 'Silver is the folk and Church answer to the unnatural: it halves the hits needed to put such a foe down, so a few rounds settle what many ordinary ones would not. Default for foes tagged unnatural; a world may tag a foe that silver does not trouble (or not tag one it should), with its own reason.'},
    silverChanceBonus: {value: 0, why: 'Silver changes what a hit does, not how well it is aimed, so the chance is unchanged.'},
    poisonVsLiving: {value: 0.75, why: 'A poisoned arrowhead adds a little over several hits (a quarter fewer hits to down a living foe); a bleeding person is not dropped faster by the first hit, so the effect is modest. Needs a living foe: a stone or a spirit takes none.'},
    frontierBowChance: {value: 0.55, why: 'A hunter\'s bow at road distance against a scout: better than a coin flip for a practised hand, well short of a sure thing. Frontier proposal, calibrated only against the 26-health road rival.'},
    frontierBowDownIn: {value: 4, why: 'An arrow takes about a quarter of a scout\'s health: four hits drop her, so a quiver is a real plan but one arrow settles nothing.'},
    frontierBowNock: {value: 1, why: 'A bow takes one arrow to the string at a time; reload is nocking, a quick move rather than a loaded chamber.'},
    frontierQuiver: {value: 1, why: 'Only the nocked arrow is ready; the rest stay in the quiver (carried).'}
});
const prop = (vs, downInFactor, chanceBonus, note) => Object.freeze({vs, downInFactor, chanceBonus, note});
export const STOCK_KINDS = Object.freeze({
    ordinary: Object.freeze({label: 'ordinary round', properties: Object.freeze([])}),
    silver: Object.freeze({label: 'silver round', properties: Object.freeze([prop('unnatural', STOCK_PROPERTY_DIALS.silverVsUnnatural.value, STOCK_PROPERTY_DIALS.silverChanceBonus.value, 'the silver bites')])}),
    arrow: Object.freeze({label: 'plain arrow', properties: Object.freeze([])}),
    poisoned_arrow: Object.freeze({label: 'poisoned arrow', properties: Object.freeze([prop('living', STOCK_PROPERTY_DIALS.poisonVsLiving.value, 0, 'the poison works')])})
});
export const stockKindLabel = kind => STOCK_KINDS[kind]?.label || String(kind);
// Pure. `odds` is the world's {chance, downIn} for this shooter and target; returns the odds the shot really uses and the notes of properties that applied.
// An unknown kind (an older save, a world not registered) has no properties and returns the odds unchanged. Every matching property applies once.
export function stockEdge(kind, tags, odds) {
    const have = Array.isArray(tags) ? tags : [], hit = (STOCK_KINDS[kind]?.properties || []).filter(p => have.includes(p.vs));
    if(!hit.length) return {chance: odds.chance, downIn: odds.downIn, notes: []};
    return {chance: Math.max(0, Math.min(1, odds.chance + hit.reduce((n, p) => n + p.chanceBonus, 0))),
        downIn: Math.max(1, hit.reduce((n, p) => n * p.downInFactor, odds.downIn)), notes: hit.map(p => p.note)};
}
// Frontier bow (second world): arrows are counted actor resources, one nocked at a time. The same fighter.stock shape the revolver uses.
export const FRONTIER_BOW = Object.freeze({prefix: 'world.base.frontier.bow.', kinds: Object.freeze(['arrow', 'poisoned_arrow'])});
export const frontierBowKeys = kind => {
    if(!FRONTIER_BOW.kinds.includes(kind)) throw Error(`Unknown arrow kind ${kind}.`);
    return Object.freeze({loaded: `${FRONTIER_BOW.prefix}nocked.${kind}`, carried: `${FRONTIER_BOW.prefix}quiver.${kind}`});
};
// Builds the player's fighter.stock from the actor's resource counts. `vs` maps foe id to the world's base odds; the default is the bow dial.
export function frontierBowStock(resources, kind, foeIds, {dials = STOCK_PROPERTY_DIALS} = {}) {
    const keys = frontierBowKeys(kind), r = resources || {}, loaded = r[keys.loaded] || 0, carried = r[keys.carried] || 0;
    return {kind, loaded, carried, capacity: dials.frontierQuiver.value, batch: dials.frontierBowNock.value, keys, start: {loaded, carried},
        vs: Object.fromEntries(foeIds.map(id => [id, {chance: dials.frontierBowChance.value, downIn: dials.frontierBowDownIn.value}]))};
}
