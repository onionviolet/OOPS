// LOTM, Tingen knownness readers for authority.js (OB9, F1/F3/F4/F8 of LARGER_FOUNDATIONS). Read-only and derived: wages through positions@1, paid
// divination sessions through the client facts. Nothing is written and no save key exists. Imported by authority_sources.js, which registers the claim.
import {registerKnownness, setKnownnessHalfLife, identityOf, PLAYER_IDENTITY} from './authority.js';
import {authorityDials} from './world_society_sheet.js';
import {positionsOf} from './positions.js';
import {BE_CLIENT_PREFIX} from './book_world_lotm_be_clients.js';

const AUTHORITY = 'tingen', DAY = 24 * 60;
// F4 and F3 dials. Defaults here; the Tingen society sheet row (world_society_sheet.js `authority`) overrides each dial it states validly, with its reason beside it.
// Half-life default and reason: Tingen is a big city; its offices keep books, but a single name among hundreds of thousands fades in a couple of months.
export const TINGEN_HALF_LIFE_DAYS = 60;
const HALF_LIFE_REASON = 'A city office keeps ledgers, but one clerk or one fortune-teller among a crowd is remembered for weeks, not years.';
// Post publicity default (by how public the post is): a clerk is on the city's books and seen at the office (2); a hired guard is known to one
// employer and the watch on that stretch of river (1); a probationer's Beyonder post is secret by design (0). A post not listed has not been
// judged public yet, so it adds nothing until someone sets its number. Exceptions need an in-world reason (a hermit's trade, 0, is simply not listed).
export const POST_PUBLICITY = Object.freeze({clerk: 2, 'night watchman': 1, probationer: 0});
let postPublicity = POST_PUBLICITY;
// Reads the sheet (or a given list of sheets) and sets this authority's dials; a world with no sheet entry gets exactly the defaults. Runs at import.
export function applyAuthorityDials(sheets) {
    const d = authorityDials(AUTHORITY, sheets);
    setKnownnessHalfLife(AUTHORITY, d.halfLife?.days ?? TINGEN_HALF_LIFE_DAYS, d.halfLife?.reason ?? HALF_LIFE_REASON);
    postPublicity = Object.freeze({...POST_PUBLICITY, ...d.postPublicity});
}
applyAuthorityDials();
// Divination: each paid session is a face the client may repeat to the neighbours (weight 1 each, capped by the sum rule of knownness itself).
export const DIVINATION_WEIGHT = 1;
const nowMinute = (state, ctx) => Number.isFinite(ctx?.now) ? ctx.now : state?.clock;
const dayOf = minute => Number.isFinite(minute) ? Math.floor(minute / DAY) : undefined;

registerKnownness(AUTHORITY, (state, ctx) => {
    if(identityOf(ctx) !== PLAYER_IDENTITY) return []; // positions@1 rows are the player's own
    const now = nowMinute(state, ctx), rows = [];
    for(const p of positionsOf(state)) {
        const weight = postPublicity[p.rank] ?? 0;
        if(!(weight > 0)) continue;
        // A held post is known as of today; an ended one fades from the day it ended.
        const at = p.ended ? dayOf(p.ended.at) : dayOf(now);
        rows.push({id: `wage:${p.id}`, weight, at, text: `You draw wages as ${p.role.toLowerCase()} for ${p.institution}.`});
    }
    return rows;
});
registerKnownness(AUTHORITY, (state, ctx) => {
    const id = identityOf(ctx), pf = state?.actors?.[id]?.facts || {}, known = state?.simulation?.knowledge?.[id] || {}, rows = [];
    for(const [k, v] of Object.entries(pf)) {
        const m = k.startsWith(BE_CLIENT_PREFIX) ? k.slice(BE_CLIENT_PREFIX.length) : '';
        if(!/^[a-z0-9_]+$/.test(m) || v !== 'paid') continue;
        rows.push({id: `divination:${m}`, weight: DIVINATION_WEIGHT, at: dayOf(known[`${BE_CLIENT_PREFIX}${m}.session`]?.at), text: 'People have paid you for a divination.'});
    }
    return rows;
});
