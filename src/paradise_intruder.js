// Local observer projection. It reads the same conditions and knowledge that
// the native simulation saved; no second body, relationship or clock owner.
export const SU_INTRUDER = 'book.su.lead.intruder';
export const SU_VISITOR = `${SU_INTRUDER}.visitor`;
const WORLD = 'book.su.lead.world', HOUSE = 'book.su.lead.house', ROOF = 'book.su.lead.roof.opening';
export function paradiseIntruderStatus(state) {
    if (state?.actors?.player?.worldId !== WORLD) return [];
    const person = state.simulation?.people?.[SU_VISITOR], known = state.simulation?.knowledge?.player || {};
    if (!person || !known[`${SU_INTRUDER}.presence`] || ![HOUSE, ROOF].includes(state.simulation.people.player?.location)) return [];
    const conditions = state.simulation.conditions[SU_VISITOR] || {};
    const active = name => {const c = conditions[`${SU_INTRUDER}.${name}`]; return c && (c.expiresAt == null || c.expiresAt > state.clock);};
    const name = known[`${SU_INTRUDER}.identity`] ? 'Mia' : 'The newcomer';
    const condition = [active('held') && 'restrained', active('winded') && 'winded', active('shaken') && 'shaken'].filter(Boolean);
    return [{label: name, value: `${person.location === HOUSE ? 'Inside the ruined house' : 'Away from the house'} · ${condition.length ? condition.join(', ') : 'not visibly injured or restrained'}`}];
}
