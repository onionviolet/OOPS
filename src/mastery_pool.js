// Per-action mastery with a shared world pool (Melvor Idle shape, MEL-PROD-C05; proposal, AD32).
// Pure leaf: no DOM, no clock, no save slice. It extends the engine's existing practice-power record
// (`simulation.powers.<actor>.<power>.mastery`, written by the `power` effect's `refine` operation) with
// a pool kept as an ordinary actor resource, so the save already carries both and nothing migrates.
//
// What Melvor does: each action's mastery grows from doing it; a share of every gain also fills a pool
// for the realm, capped by how many mastery actions the realm has; pool XP can be spent into one action's
// mastery exactly; pool checkpoints switch providers on and off, so spending below one loses it while the
// learned action mastery stays.
// What we changed, and why:
// - Cap counts the actions this person has actually learned in the world, not every action that exists,
//   so a world with many rows does not make the pool unreachable (Melvor counts all realm actions).
// - Checkpoints change what the work does (AD38): they open a different command (another place, another
//   kind of work), never a percentage. A world states its own checkpoints and reasons.
// - Every number is a per-world dial with an in-world reason. A world without a row has no pool.
// - No decay and no forced weakness (AD55). Losing a pool checkpoint only follows the holder's choice to
//   spend; learned mastery never falls.
// - Gains come only from completed real work: the caller puts `gainEffects` on the completion of a
//   command, so a cancelled or refused action gives nothing.

// dial: {perRepetition, share, capPerAction, actions:[powerId], checkpoints:[{id, at, label, text}], reason}
// `at` is a share of the cap. Numbers are authored proposals pending play.
export const MASTERY_POOL_DIALS = Object.freeze({
    'book.lotm.tingen': Object.freeze({
        perRepetition: 4, share: 0.25, capPerAction: 8,
        actions: Object.freeze(['book.lotm.power.copying_hand']),
        checkpoints: Object.freeze([Object.freeze({id: 'take_home', at: 0.5, label: 'A steady desk',
            text: 'Hale lets a steady copyist take closed files home and copy them at the lodging.'})]),
        reason: 'Desk work across the records builds a general steadiness beyond any one kind of file. Pouring it into one kind of file sharpens that file and leaves the desk less settled.',
    }),
});
export const poolDial = worldId => MASTERY_POOL_DIALS[worldId] ?? null;
export const poolKey = worldId => `${worldId}.mastery.pool`;
const factBase = worldId => `mastery.${worldId}`;
export const poolFact = (worldId, name) => `${factBase(worldId)}.${name}`;
export const levelFact = (worldId, powerId) => `${factBase(worldId)}.level.${powerId}`;
export const learnedFact = (worldId, powerId) => `${factBase(worldId)}.learned.${powerId}`;
export const checkpointFact = (worldId, id) => `${factBase(worldId)}.checkpoint.${id}`;
const need = dial => dial ?? (() => { throw Error('This world has no mastery pool dial.'); })();

// Reads the actor's own records only. Writes facts into `f` (the world's fact table) and returns them.
export function masteryPoolFacts(state, f, {worldId, actorId = 'player'}) {
    const dial = poolDial(worldId);
    if(!dial) return f;
    const powers = state.simulation?.powers?.[actorId] || {};
    const pool = state.actors?.[actorId]?.resources?.[poolKey(worldId)] || 0;
    const learned = dial.actions.filter(id => powers[id]?.owned);
    const cap = learned.length * dial.capPerAction;
    for(const id of dial.actions) {
        f[learnedFact(worldId, id)] = !!powers[id]?.owned;
        f[`${learnedFact(worldId, id)}.n`] = powers[id]?.owned ? 1 : 0; // numeric twin for outcome weights
        f[levelFact(worldId, id)] = powers[id]?.owned ? powers[id].mastery : 0;
    }
    f[poolFact(worldId, 'pool')] = pool;
    f[poolFact(worldId, 'cap')] = cap;
    f[poolFact(worldId, 'room')] = Math.max(0, cap - pool);
    for(const c of dial.checkpoints) f[checkpointFact(worldId, c.id)] = cap > 0 && pool >= c.at * cap;
    return f;
}

// Effects for one completed repetition: the action's own mastery, then its share into the pool.
// The pool share is clamped to the room left (Melvor drops pool XP past the cap), through the engine's
// existing amount formula, so a full pool never refuses the work.
export function gainEffects(worldId, powerId, {actorId = 'player'} = {}) {
    const dial = need(poolDial(worldId));
    if(!dial.actions.includes(powerId)) throw Error('This action is not one of the world\'s mastery actions.');
    return [{type: 'power', actor: actorId, powerId, operation: 'refine', amount: dial.perRepetition},
        {type: 'resource', actor: actorId, key: poolKey(worldId), amount: {fact: poolFact(worldId, 'room'), max: dial.perRepetition * dial.share, min: 0}}];
}
// Spending is one exchange: exactly `amount` leaves the pool and joins one action's mastery.
// The resource cost refuses an amount the pool does not hold.
export function spendCosts(worldId, amount, {actorId = 'player'} = {}) {
    need(poolDial(worldId));
    if(!(Number.isFinite(amount) && amount > 0)) throw Error('Spend a positive amount of pooled practice.');
    return [{type: 'resource', actor: actorId, key: poolKey(worldId), amount: -amount}];
}
export function spendEffects(worldId, powerId, amount, {actorId = 'player'} = {}) {
    const dial = need(poolDial(worldId));
    if(!dial.actions.includes(powerId)) throw Error('This action is not one of the world\'s mastery actions.');
    return [{type: 'power', actor: actorId, powerId, operation: 'refine', amount}];
}
export const spendRequires = (worldId, powerId, amount) => ({all: [
    {fact: learnedFact(worldId, powerId), op: 'eq', value: true, reason: 'Learn this work first.'},
    {fact: poolFact(worldId, 'pool'), op: 'gte', value: amount, reason: `You need ${amount} pooled practice.`},
]});

// Which checkpoints a spend of `amount` would switch off (the warning the spend button shows).
export function checkpointsLost(f, worldId, amount) {
    const dial = poolDial(worldId);
    if(!dial) return [];
    const pool = f[poolFact(worldId, 'pool')] || 0, cap = f[poolFact(worldId, 'cap')] || 0;
    return dial.checkpoints.filter(c => cap > 0 && pool >= c.at * cap && pool - amount < c.at * cap);
}
// Player-facing reading: the pool, each checkpoint with its threshold and whether it holds now.
export function poolView(f, worldId) {
    const dial = poolDial(worldId);
    if(!dial) return null;
    const pool = f[poolFact(worldId, 'pool')] || 0, cap = f[poolFact(worldId, 'cap')] || 0;
    return {pool, cap, reason: dial.reason,
        checkpoints: dial.checkpoints.map(c => ({id: c.id, label: c.label, text: c.text, at: Math.ceil(c.at * cap), on: !!f[checkpointFact(worldId, c.id)]}))};
}
