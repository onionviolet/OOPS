// Bridge: L9 harm ladder + L10 ability records -> rep-combat `versus` model (claude/rep-combat, src/ui/combat_situation.js, COMBAT.md "Switch-over").
// Pure. The rep adapter keeps today's sources until this is imported; each function here fills one field of one `versus` row and
// returns a new object. Nothing is read from a host: the harm-rung function and the observer's read arrive as arguments.

/**
 * Threat with the harm rung the hardest shown blow reaches.
 * threat: a versus.opponents[].threat ({level, word, blow?}). health: {current, max}. rungOf: harm_state.harmRung (fraction -> rung id | null).
 * A blow that meets or passes current hp reaches 'dying' (downed, never 'dead': native defeat is not death, AD19).
 */
export function threatWithRung(threat, health, rungOf) {
    if (!threat || !Number.isFinite(threat.blow) || !Number.isFinite(health?.current) || !(health.max > 0) || typeof rungOf !== 'function') return threat;
    const left = Math.max(0, health.current - threat.blow);
    const rung = threat.blow >= health.current ? 'dying' : rungOf(Math.min(1, left / health.max));
    return {...threat, rung};
}

/** The word for a beaten opponent from a typed outcome (CBR2, CBR5). Unknown outcomes keep the plain 'Down'. */
const OUTCOME_WORDS = Object.freeze({unconscious: 'Unconscious', yielded: 'Yielded', fled: 'Fled', dead: 'Dead'});
export const outcomeWord = outcome => OUTCOME_WORDS[outcome] ?? 'Down';

/**
 * Intent chip from an opponent's readied ability. Only an observer with an appraisal read of this opponent sees it (CBR14);
 * otherwise the chip stays {known:false, word:'Intent unread'} exactly as today.
 * readied: abilityView() of the opponent's readied ability, or null. read: {source, label} marking where the knowledge came from.
 */
export function intentFromReadiedAbility(readied, read = null) {
    if (!readied || !read) return {known: false, word: 'Intent unread'};
    return {known: true, word: `Readies ${readied.label}`, source: read.source ?? 'appraisal', sourceLabel: read.label ?? null};
}

/** versus.you.abilities: what the controlled actor can do now, by label. No hooks, no hidden costs. */
export function youAbilities(views = []) {
    return views.map(v => ({id: v.id, label: v.label, ready: v.ready, refusedBy: [...v.refusedBy],
        cost: v.cost.map(c => ({what: c.what, amount: c.amount})), limit: v.limit.kind === 'none' ? null : {...v.limit}}));
}

/**
 * Apply all of it to a versus model (does not mutate).
 * ctx: {health, rungOf, outcomes: {opponentId: outcome}, readied: {opponentId: abilityView}, reads: {opponentId: {source,label}}, youViews: abilityViews()}.
 */
export function versusWithEngine(versus, ctx = {}) {
    if (!versus) return versus;
    const opponents = versus.opponents.map(o => {
        const threat = o.down ? {...o.threat, word: outcomeWord(ctx.outcomes?.[o.id])}
            : threatWithRung(o.threat, ctx.health, ctx.rungOf);
        const intent = o.down ? o.intent : intentFromReadiedAbility(ctx.readied?.[o.id], ctx.reads?.[o.id]);
        return {...o, threat, intent};
    });
    return {...versus, you: {...versus.you, abilities: youAbilities(ctx.youViews)}, opponents};
}
