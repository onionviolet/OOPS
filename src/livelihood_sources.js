// World adapters for livelihoods.js: each reads existing owners only (no save key, no write). Importing this file registers them.
import {registerLivelihoodSource} from './livelihoods.js';
import {habitatFacts, HABITAT} from './habitat_care.js';
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
            obligations: NONE('The plot right was paid once; no dues recur.'), authority: {known: true, who: 'Mira'}});
    }
    if (ctx?.habitat?.owner) {
        const h = habitatFacts(ctx.habitat.owner, ctx.habitat.clock), s = h.state;
        rows.push({id: 'frontier.village.meadow_pen', kind: 'herd', label: 'Meadow pen',
            stage: !s?.animal ? 'set up' : 'running',
            detail: !s?.animal ? 'no sheep yet' : h.ready ? `${HABITAT.yield} wool ready` : 'sheep in care',
            income: null, runBy: 'self',
            obligations: NONE('Your own pen; no authority knows of it, so no rent or tax.'), authority: {known: false, who: null}});
    }
    return rows;
});
