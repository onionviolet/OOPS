// World adapters for livelihoods.js: each reads existing owners only (no save key, no write). Importing this file registers them.
import {registerLivelihoodSource, authorityFields} from './livelihoods.js';
import './authority_sources.js';
import {domainRegistry} from './domain_registry.js';
import {HOME_PLACES, HOME_SITE} from './home_content.js';
import {habitatFacts, HABITAT} from './habitat_care.js';
import {hireOf} from './hired_hands.js';
import {PLOT_JOB, HAND_CROPS} from './hired_hands_plot.js';
const WORLD = 'base.frontier';
const NONE = (why) => ({kind: 'none', pointer: null, why});
// Frontier / Village. Courtyard plot (MG06 facts on the player actor) and, when the host passes it, the meadow pen (ctx.habitat = {owner, clock}).
registerLivelihoodSource('base.frontier', (state, ctx) => {
    const rows = [], f = state?.actors?.player?.facts || {};
    if (f['mg.plotRight'] === true) {
        const cs = f['mg.cropStage'], crop = f['mg.cropType'] || 'crop';
        const growing = cs === 'planted' || cs === 'tended', ready = cs === 'ready';
        rows.push({id: 'frontier.village.courtyard_plot', kind: 'farm', label: 'Village courtyard plot',
            stage: growing || ready ? 'running' : 'set up',
            detail: ready ? `${crop} ready to harvest` : growing ? `${crop} growing` : 'bed empty',
            income: null, runBy: 'self',
            // MG06 is a one-time 4-coin right from Mira. Nothing recurring exists to point at (E-G2); say so.
            obligations: NONE('The plot right was paid once; no dues recur.'), ...authorityFields(state, {world: WORLD, place: 'Village', registered: true, holder: 'Mira', ctx})});
    }
    // OB7/OB12: a hired hand tends the plot. Stage automated, runBy hire; income is the owner's own estimate (hired_hands_plot), wage terms point at the hire.
    const hand = f['mg.plotRight'] === true ? hireOf(PLOT_JOB) : null;
    if (hand?.status === 'active' && HAND_CROPS[hand.crop]) {
        const row = rows.find(r => r.id === 'frontier.village.courtyard_plot'), c = HAND_CROPS[hand.crop];
        const n = Math.floor(7 * 1440 / Math.max(1440, Math.round(c.days * 1440 * hand.pace))) * c.yield;
        Object.assign(row, {stage: 'automated', runBy: 'hire', detail: `${hand.name} tends ${c.word} for you`,
            income: {amount: n, unit: c.word, per: 'week', text: `up to about ${n} ${c.word}`},
            obligations: {kind: 'wage-terms', pointer: `hired_hands:${PLOT_JOB}`, why: `${hand.name} is paid ${hand.wage} coins a week ahead; if the purse cannot cover it the arrangement ends.`}});
    }
    if (ctx?.habitat?.owner) {
        const penAuthority = authorityFields(state, {world: WORLD, place: HABITAT.location, ctx});
        const h = habitatFacts(ctx.habitat.owner, ctx.habitat.clock), s = h.state;
        rows.push({id: 'frontier.village.meadow_pen', kind: 'herd', label: 'Meadow pen',
            stage: !s?.animal ? 'set up' : 'running',
            detail: !s?.animal ? 'no sheep yet' : h.ready ? 'a fleece ready' : 'sheep in care',
            income: null, runBy: 'self',
            obligations: NONE(penAuthority.authority.known ? 'Your own pen; the village knows of it but asks nothing recurring.' : 'Your own pen; no authority knows of it, so no rent or tax.'), ...penAuthority});
    }
    // A shelter, burrow, nest or tent in the open ground. Where no one claims the place it owes nothing, and the price is the other side of that (no
    // protection, market or credit). Reads the homes projection unless the host passes ctx.homes.
    let homes = ctx?.homes;
    if(!homes) { try { homes = domainRegistry.project('homes')?.homes; } catch { homes = null; } }
    for(const h of Array.isArray(homes) ? homes : []) {
        const place = h.id === 'tent' ? h.anchor : HOME_PLACES[h.id] && ['shelter', 'burrow', 'nest'].includes(h.id) ? HOME_SITE : null;
        if(!place || !h.access) continue;
        const a = authorityFields(state, {world: WORLD, place, ctx});
        rows.push({id: `frontier.homestead.${h.id}`, kind: 'homestead', label: h.name || HOME_PLACES[h.id].name, stage: 'set up', detail: a.claim.short,
            income: null, runBy: 'self', obligations: NONE(a.authority.who ? 'Your own shelter; the village asks nothing recurring of it.' : 'No one claims this land, so no rent or tax; nor does anyone protect it.'), ...a});
    }
    return rows;
});
