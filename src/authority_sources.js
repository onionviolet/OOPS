// World adapters for authority.js: bounds and knownness read from owners that already exist (no save key, no write). Importing registers them.
import {registerAuthoritySource, registerKnownness} from './authority.js';
import {loot_sold_count} from './market_saturation.js';
import {HOME_PLACES, HOME_SITE} from './home_content.js';
import {LOTM_IDS} from './book_world_lotm_ids.js';

// Base Frontier. The Village (and the homes inside it) is the village's ground; the wild willow stand and everything outside is claimed by no one,
// though the village may hear of it. The village learns of you through your own acts: a plot right Mira wrote down, goods sold at its market.
const VILLAGE = new Set(['Village', 'Shack', ...['cottage', 'rental', 'family'].map(id => HOME_PLACES[id].location)]);
registerAuthoritySource('base.frontier', (state, {place}) => VILLAGE.has(place)
    ? {claimant: 'village', label: 'the village', inBounds: true}
    : {claimant: null, near: 'village', nearLabel: 'the village'});
// Items sold in the Village market region (loot_sold_count is the market owner's saved counter: region, group, tier, sold). `ctx.marketSales` overrides it for hosts that know better.
const soldIn = o => !o || typeof o !== 'object' ? 0 : Object.entries(o).reduce((n, [k, v]) => n + (k === 'sold' && Number.isFinite(v) ? v : soldIn(v)), 0);
const marketSales = ctx => Number.isFinite(ctx?.marketSales) ? ctx.marketSales : soldIn(loot_sold_count?.Village);
registerKnownness('village', (state, ctx) => {
    const rows = [], f = state?.actors?.player?.facts || {};
    if(f['mg.plotRight'] === true) rows.push({id: 'plot-right', weight: 1, text: 'Mira holds your name on a plot right.'});
    if(marketSales(ctx) > 0) rows.push({id: 'market-sales', weight: 1, text: 'You have sold goods at the Village market.'});
    return rows;
});
export const WILD_SITE = HOME_SITE;

// LOTM, Tingen: the city's claim stops at the city's own places (a "Tingen ..." location); nothing registered reads the player's knownness yet.
registerAuthoritySource(LOTM_IDS.world, (state, {place}) => typeof place === 'string' && place.startsWith('Tingen')
    ? {claimant: 'tingen', label: 'the Tingen authorities', inBounds: true} : null);
