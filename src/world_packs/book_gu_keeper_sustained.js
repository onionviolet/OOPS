import {sustainedGuHost} from '../gu_sustained_host.js';

export const keeperRainbow = 'book.ri.keeper.rainbow_light';
export const keeperRainbowWorld = 'book.ri.keeper.world';
// Authored: the Keeper's practice flight, payment interval, reserve dose and core draw.
export const rainbowInterval = 10;
export const rainbowFlightMinutes = 16;
export const rainbowDose = 12;
export const rainbowLine = Object.freeze({
    id: keeperRainbow, world: keeperRainbowWorld, key: `${keeperRainbow}.reserve`,
    custodian: 'steward', interval: rainbowInterval, dose: rainbowDose, maxRecordLength: 512,
    effectType: 'guRainbow',
    supply: {pool: 'white-silver', family: 'primeval', rank: 3, source: 'stored'},
    core: {id: `${keeperRainbow}.loan`, kind: 'rainbow-light', rank: 3,
        ability: {fuel: 'primeval', cost: 6, path: 'light'}},
    support: {id: 'book.ri.keeper.move_trial.light_source', kind: 'light-source', rank: 1},
});
export const {quote: quoteRainbow, validate: validateKeeperRainbow, facts: keeperRainbowFacts,
    view: keeperRainbowView, isEffect: isKeeperRainbowEffect, apply: applyKeeperRainbowEffect,
    boundary: nextKeeperRainbowBoundary, advance: advanceKeeperRainbow} = sustainedGuHost(rainbowLine);
