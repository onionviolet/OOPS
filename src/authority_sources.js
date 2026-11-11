// World adapters for authority.js: bounds and knownness read from owners that already exist (no save key, no write). Importing registers them.
import {registerAuthoritySource, registerKnownness, setKnownnessHalfLife, identityOf, PLAYER_IDENTITY} from './authority.js';
import './authority_sources_lotm.js';
import {authorityDials} from './world_society_sheet.js';
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
    const rows = [], f = state?.actors?.[identityOf(ctx)]?.facts || {};
    if(f['mg.plotRight'] === true) rows.push({id: 'plot-right', weight: 1, text: 'Mira holds your name on a plot right.'});
    // The market counter is the player's own sales; another identity has none of its own (F8) unless the host states them in ctx.
    if((identityOf(ctx) === PLAYER_IDENTITY || Number.isFinite(ctx?.marketSales)) && marketSales(ctx) > 0) rows.push({id: 'market-sales', weight: 1, text: 'You have sold goods at the Village market.'});
    return rows;
});
// F4 dial: a village market forgets a stranger within a season. Applies to dated rows only; today's village readers are undated, so nothing fades yet.
// The sheet may state this dial for 'village' (world_society_sheet.js `authority`); no row today, so the default stands.
const villageDial = authorityDials('village').halfLife;
setKnownnessHalfLife('village', villageDial?.days ?? 30, villageDial?.reason ?? 'A small village market has few faces and talks about the newest ones; a name from a season ago is half forgotten.');
export const WILD_SITE = HOME_SITE;

// LOTM, Tingen: the city's claim stops at the city's own places (a "Tingen ..." location); its knownness readers (wages, divination fees) are in authority_sources_lotm.js.
// A cast life's places carry their own names ("Moretti flat"): wherever the lead stands inside the Tingen world is the city's ground too.
const inTingen = (state, place) => typeof place === 'string' && (place.startsWith('Tingen') || (state?.actors?.player?.worldId === LOTM_IDS.world && place === state?.simulation?.people?.player?.location));
registerAuthoritySource(LOTM_IDS.world, (state, {place}) => inTingen(state, place)
    ? {claimant: 'tingen', label: 'the Tingen authorities', inBounds: true} : null);
