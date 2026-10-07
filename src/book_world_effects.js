// Read-only native projection of authored book-world conditions. The saved
// simulation condition remains the sole duration/cause owner.
const MOL_POLICIES = Object.freeze({
    'book.mol.smoke_exposure': {stats: {stamina_efficiency: {multiplier: 0.9}}, text: 'Smoke exposure reduces stamina efficiency while you occupy your supported Cyoria body.'},
    'book.mol.hand_burn': {stats: {dexterity: {multiplier: 0.85}}, text: 'The hand burn reduces dexterity and prevents precise device work until recovery.'},
});
export function projectBookWorldEffects(state, registry, context = {}) {
    const d = state.motherOfLearning, person = state.simulation?.people?.player;
    const body = person?.body, native = context.nativeBody;
    const visit = d?.visits?.find(v => v.id === d.activeVisitId && v.status === 'active' && v.actorId === 'player');
    if(!d || d.bodyPolicy !== 'same_native_body' || visit?.endpoint?.worldId !== state.actors?.player?.worldId ||
        person?.life !== 'alive' || person.inventory !== 'native' || context.nativeAlive !== true ||
        body?.id !== 'native.player.body' || body.form !== 'human' || body.ownerId !== 'player' || body.controllerId !== 'player' ||
        body.hands < 2 || body.mobile !== true || native?.id !== body.id || native.form !== body.form ||
        native.ownerId !== body.ownerId || native.controllerId !== body.controllerId || native.hands < 2 || native.mobile !== true) return {};
    const effects = {};
    for(const [id, policy] of Object.entries(MOL_POLICIES)) {
        const condition = state.simulation.conditions?.player?.[id], definition = registry.simulation.conditions.get(id);
        if(!definition || !condition || condition.intensity <= 0 || condition.expiresAt != null && condition.expiresAt <= state.clock) continue;
        const key = 'simulation:' + id;
        effects[key] = {id: key, name: definition.label, duration: condition.expiresAt == null ? null : condition.expiresAt - state.clock,
            description: policy.text, effects: {stats: structuredClone(policy.stats), bonus_skill_levels: {}, xp_multipliers: {}},
            tags: {effect: true, debuff: true}, affected_by_travel: true};
    }
    return effects;
}
