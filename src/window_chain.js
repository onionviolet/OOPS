// Shared builder for story-window chains (LAYM1 in the long-term atlas; AR9 structural).
// A window is an ordered chain of once-only acts that unlock one after another under
// an admission fact and a readiness rule. Lead windows used to restate these helpers
// and the act() builder in every module. This leaf module holds them once.
//
// Content identity: the structured runtime hashes JSON.stringify(raw), so key order
// is part of a window's identity. act() emits keys in the order the existing windows
// use, so a window moved onto this builder keeps its content hash and earned saves.
// Change that order only as a recorded behavior change, never in a structural move.
//
// World-neutral: nothing here names a world. A world passes its id prefix and energy
// pool to windowKit(), then its place, readiness rule and refusal text to chain().

export const all = (...rules) => ({all: rules});
export const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
export const gte = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
export const itemKey = itemId => JSON.stringify({id: itemId});

/**
 * "The character can act at all" for a life that holds a claim and an active faculty
 * in one place: alive, native-ready, in their own mobile body, claim held and owned,
 * faculty active, standing at `place`. Rule order is part of the window hash.
 */
export const heldBodyReady = ({claim, faculty, place, actor = 'player'}) => all(
    eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', actor), eq('body.controllerId', actor), eq('body.mobile'),
    eq(`claim.${claim}.held`), eq(`claim.${claim}.owner`, actor),
    eq(`faculty.${faculty}.active`), eq('actor.location', place));

/**
 * Helpers for one window. They need only the window's id prefix and, for energy
 * helpers, its pool, so a window can use them at top level before its readiness
 * and admission rules exist.
 * @param {object} o
 * @param {string} o.prefix        window id; local names become `${prefix}.${name}`
 * @param {string} [o.energyId]    pool used by spend/recover/reserve and act parts
 * @param {(value:number)=>string} [o.reserveReason] refusal text for a reserve check
 * @param {string} [o.actor]
 */
export function windowKit({prefix, energyId, reserveReason, actor = 'player'}) {
    if (!prefix) throw Error('windowKit needs a prefix.');
    const local = name => `${prefix}.${name}`;
    const needEnergy = () => { if (!energyId) throw Error(`${prefix}: this window declared no energy pool.`); };
    const reserve = value => {
        needEnergy();
        return {fact: `energy.${energyId}.reserve`, op: 'gte', value, ...(reserveReason ? {reason: reserveReason(value)} : {})};
    };
    const spend = output => { needEnergy(); return {type: 'energy', actor, energyId, operation: 'use', output, control: 1}; };
    return Object.freeze({
        local,
        done: name => eq(`completed.${local(name)}`),
        field: (name, value) => eq(`actor.${local(name)}`, value),
        set: (name, value) => ({type: 'fact', actor, scope: 'actor', key: local(name), value}),
        event: (name, value) => ({type: 'fact', actor, scope: 'world', key: local(name), value}),
        note: (name, value) => ({type: 'knowledge', actor, key: local(name), stage: 'understood', value}),
        status: (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)}),
        stock: (itemId, value = 1, reason) => gte(`item.${itemKey(itemId)}`, value, reason),
        item: (itemId, amount) => ({type: 'item', actor, key: itemKey(itemId), amount}),
        vital: (key, amount) => ({type: 'vital', actor, key, amount}),
        spend,
        recover: amount => { needEnergy(); return {type: 'energy', actor, energyId, operation: 'recover', amount}; },
        reserve,
        /**
         * The window definition around its commands, in the key order the structured
         * runtime hashes. `items` is emitted only when given.
         * @param {object} w {base:{id,revision,contentHash}, label, description, requires,
         *   reason, items?, status, commands}
         */
        window({base, label, description, requires, reason, items, status, commands}) {
            if (!base?.contentHash || !label || !description || !requires || !reason || !commands?.length)
                throw Error(`${prefix}: a window needs base, label, description, requires, reason and commands.`);
            return {
                schema: 1, id: prefix, revision: 1, base: {id: base.id, revision: base.revision, contentHash: base.contentHash},
                label, description, requires, reason, ...(items === undefined ? {} : {items}),
                ...(status === undefined ? {} : {status}), commands
            };
        },
        /**
         * The chain's act builder, once the window's rules exist.
         * @param {object} c
         * @param {string} c.worldId
         * @param {string} c.location      default place for every act
         * @param {object} c.admitted      rule true once the window's extension is admitted
         * @param {object} c.ready         rule for "the character can act at all"
         * @param {string} c.defaultReason refusal text when an act names none
         * @param {boolean} [c.flatRequires] older windows spread the act's support rule into
         *   `requires` instead of wrapping it; keep that shape when moving one (hash identity)
         */
        chain({worldId, location, admitted, ready, defaultReason, flatRequires = false}) {
            if (!worldId || !location || !admitted || !ready || !defaultReason)
                throw Error(`${prefix}: a chain needs worldId, location, admitted, ready and defaultReason.`);
            /**
             * One step. `previous` is the rule that the earlier step is done.
             * needs: held for the whole act; atStart: checked when it starts;
             * parts: energy reserved at start and spent; repeat: not once-only.
             */
            return function act(name, label, duration, previous, description, effects,
                {needs = [], atStart = [], costs = [], parts = 0, repeat = false, reason, ...extra} = {}) {
                const visibleWhen = all(admitted, previous);
                const support = all(ready, visibleWhen, ...needs);
                return {
                    id: local(name), revision: 1, label, description, group: 'structured_local', worldId,
                    actorId: actor, location, audience: ['$actor'], once: !repeat, duration, visibleWhen,
                    requires: {...(flatRequires && !atStart.length && !parts ? support : all(support, ...atStart, ...(parts ? [reserve(parts)] : []))),
                        reason: reason || defaultReason},
                    completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
                    cancellation: 'refund', reservationReturns: 1, costs: parts ? [...costs, spend(parts)] : costs, effects,
                    ...extra
                };
            };
        }
    });
}
