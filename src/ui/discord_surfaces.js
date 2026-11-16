// Round 16 Discord features: the small surfaces display.js mounts (one import there, no new lines). Pure helpers over
// the owning data modules; each says which proposal it serves.
import {walkMapBlock} from './walk_map.js';
import {nativeWalkView, readWalkMove} from '../native_walk_view.js';
import {dropRateLine} from '../drop_rate_causes.js';

/** PS164: the walking map under Fast travel's destinations; null when it would show one place or none (coordinator's
 * default: only with more than one leg). `onGo(id)` is the native move. */
export function fastTravelMapBlock({hereId, distances, exits, known, label, onGo}) {
    const view = nativeWalkView({hereId, distances, exits, known, label});
    if(view.legs.length <= 1) return null;
    const byLabel = new Map(view.legs.map(l => [l.moveId, l]));
    const box = walkMapBlock({...view, moves: view.legs.map(l => ({id: l.moveId, label: l.to, eligible: true, reasons: []}))},
        {open: false, onPick: moveId => { const m = readWalkMove(moveId); if(m && byLabel.has(moveId)) onGo(m.id); }});
    box.dataset.fastTravelMap = '';
    return box;
}

/** PS166: under the Bestiary's observed drops (the character knows counts, not base chances), the one cause it can
 * see: a skill that changes what this kind of creature yields. '' when nothing changes it. */
export function bestiaryRateNote({skillName, skillFactor} = {}) {
    if(!skillName || !Number.isFinite(skillFactor) || skillFactor === 1) return '';
    return `${skillName} ${skillFactor > 1 ? 'raises' : 'lowers'} what these drop for you (×${Math.round(skillFactor * 100) / 100}).`;
}

/** PS166: the Bestiary's current-chance tooltip, naming why it differs from base. */
export function bestiaryRateTitle(base, {skillName, skillFactor} = {}) {
    return dropRateLine(base, skillName && Number.isFinite(skillFactor) ? {skill: {name: skillName, factor: skillFactor}} : {});
}
