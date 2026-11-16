// PS166 (round 16, proposal; Discord F23, F31, F34, DU40): a drop rate shown with its causes, so a change in loot reads
// as a reason the character can see, never as concealed suppression. Pure: the caller passes the factors the combat
// code already multiplies (src/models/combat.js loot roll, src/enemies.js get_droprate_modifier) and gets the parts in
// words plus the per-target versus per-fight comparison F34 asks for.
//
// Default: each factor other than 1 is one part with its cause; the fight-size factor is shown both per target and
// for the whole fight. Dial: a caller leaves a factor out when the character cannot know it (an unseen accessory
// effect), and the line then says only what is known. Reason: the payoff (which item) stays hidden by the Bestiary's
// own name rule; the rate and why it moved are the character's own observations.

const times = f => `×${Math.round(f * 100) / 100}`;
const pct = p => `${Math.round(p * 10000) / 100}%`;

/** The combat code's own fight-size factor per target: 1 / n^(2/3). */
export const perTargetFactor = targets => 1 / Math.max(1, targets) ** 0.6667;

/**
 * base: the listed chance (0-1). factors: {skill?: {name, factor}, gear?: factor, targets?: n, place?: factor}.
 * Returns {base, current, parts: [{cause, factor, text}], fight: null|{targets, perTarget, perFight, text}}.
 */
export function explainDropRate(base, {skill, gear, targets = 1, place} = {}) {
    const parts = [];
    if(skill && skill.factor !== 1) parts.push({cause: 'skill', factor: skill.factor, text: `${times(skill.factor)} from ${skill.name}`});
    if(Number.isFinite(gear) && gear !== 1) parts.push({cause: 'gear', factor: gear, text: `${times(gear)} from what you wear`});
    if(Number.isFinite(place) && place !== 1) parts.push({cause: 'place', factor: place, text: `${times(place)} from this place`});
    const each = perTargetFactor(targets);
    if(targets > 1) parts.push({cause: 'targets', factor: each, text: `${times(each)} each when fighting ${targets} at once`});
    const current = Math.min(1, parts.reduce((p, x) => p * x.factor, base));
    const fight = targets > 1 ? {targets, perTarget: each, perFight: each * targets,
        text: `Against ${targets} at once each drops less (${times(each)}), but the fight as a whole yields ${times(each * targets)} one kill's loot.`} : null;
    return {base, current, parts, fight};
}

/** One tooltip line: "12% now (base 10%): ×1.2 from Butchering." */
export function dropRateLine(base, factors) {
    const r = explainDropRate(base, factors);
    if(!r.parts.length) return `${pct(r.base)}, unchanged.`;
    return `${pct(r.current)} now (base ${pct(r.base)}): ${r.parts.map(p => p.text).join(', ')}.${r.fight ? ` ${r.fight.text}` : ''}`;
}
