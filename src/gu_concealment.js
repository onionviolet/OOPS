import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {detectGuApproach} from './gu_senses.js';

export function resolveGuCloak({gu, clock, reserve}) {
    const ability = guCatalogue[gu.kind]?.ability?.value;
    if (!ability?.maskedSurfaces) throw Error('This Gu cannot cloak those surfaces.');
    const result = resolveGuActivation({stages: [{gu: {...gu, fedThrough: clock}, operator: 'player', ability,
        supply: {pool: 'essence', family: 'primeval', rank: 1, source: 'aperture'}}],
    reserves: {player: {essence: reserve}}, day: clock});
    const mask = result.effects.find(effect => effect.kind === 'visual-concealment');
    if (!mask) throw Error('The concealment Gu did not respond.');
    return {surfaces: ability.maskedSurfaces, magnitude: mask.magnitude};
}

export function observeGuCloak({senses, cloak, screens = [], surfaces = ['body', 'clothing']}) {
    const sight = senses.sight;
    const exposed = sight ? surfaces.filter(surface => detectGuApproach({senses: {sight}, screens,
        concealment: cloak?.surfaces.includes(surface) ? [{channel: 'sight', magnitude: cloak.magnitude}] : []})) : [];
    if (exposed.length) return {channel: 'sight', surfaces: exposed};
    const other = Object.fromEntries(Object.entries(senses).filter(([channel]) => channel !== 'sight'));
    const channel = detectGuApproach({senses: other, screens});
    return channel ? {channel, surfaces: []} : null;
}
