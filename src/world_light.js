// FD9 world-clock light reader. Pure: turns a world's local day fraction into night/fog/visibility from a
// per-world dial, so book worlds read light the way native weather does without importing native game_time.
// Dial defaults and reasons: night is 20:00-04:00 (the native night_time window); fog is a dial per world
// (default none), thickest in the dark hours and reasoned in-world (e.g. Tingen's river and coal smoke).
import {check as requireValue} from './basics.js';
const finite = Number.isFinite;
export const NATIVE_NIGHT = Object.freeze({from: 20 / 24, to: 4 / 24});
export const NO_FOG = Object.freeze({fog: null});
// INFERRED proposal, not a sourced climate: Tingen nights carry river fog and coal smoke.
export const TINGEN_LIGHT = Object.freeze({id: 'proposal.tingen-light', night: NATIVE_NIGHT,
    fog: Object.freeze({from: 20 / 24, to: 5 / 24, reason: 'river fog and coal smoke', visibilityPenalty: 0.5})});
export function worldLight(dayFraction, profile = {night: NATIVE_NIGHT, ...NO_FOG}) {
    requireValue(finite(dayFraction) && dayFraction >= 0 && dayFraction < 1 && profile?.night, 'Invalid world light read.');
    const within = ({from, to}) => from > to ? dayFraction >= from || dayFraction < to : dayFraction >= from && dayFraction < to;
    const night = within(profile.night), foggy = !!profile.fog && within(profile.fog);
    return {night, fog: foggy ? profile.fog.reason : null, visibility: foggy ? 1 - profile.fog.visibilityPenalty : night ? 0.7 : 1};
}
