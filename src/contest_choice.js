// Optional contest choosers and policy harnesses. They use the contest ports
// and leave the contest kernel and world-specific laws untouched.
import {check, natural, object} from './basics.js';
import {beginContest, defaultChoice, entrantView, stepContest} from './contest.js';
import {quoteWorking} from './kernel_working.js';
import {checkKey} from './check_keys.js';
import {drawFraction} from './gen_kit.js';

const clone = value => structuredClone(value);
const MAX_CANDIDATES = 32;
const MAX_ROLLOUT_STEPS = 256;

function opponents(record, id) {
    const side = record.entrants[id].side;
    return Object.entries(record.entrants).filter(([, e]) => e.side !== side);
}

function legalTargets(law, record, world, id, moveId) {
    const move = law.moves[moveId];
    if (move.target === 'self' || move.kind === 'guard' || ['withdraw', 'yield', 'wait'].includes(move.kind)) return [id];
    return opponents(record, id).filter(([other, e]) => e.status === 'in' && entrantView(law, record, world, other).able)
        .map(([target]) => target);
}

function canPay(law, record, world, id, moveId) {
    const e = record.entrants[id], move = law.moves[moveId];
    if (!e.moves.includes(moveId) && !['withdraw', 'yield', 'wait'].includes(moveId)) return false;
    // Asking the kernel chooser for its current fallback is not a payment test;
    // checking declared requirements here covers ordinary moves. Bridges also
    // expose whether their own working can start through entrantView facts.
    for (const [q, amount] of Object.entries({...move.requires, ...move.costs})) {
        const have = entrantView(law, record, world, id).quantities[q];
        if (have === undefined || have < (move.requires?.[q] ?? 0) || have < (move.costs?.[q] ?? 0)) return false;
    }
    if (move.bridge) {
        const actor = entrantView(law, record, world, id), bridge = move.bridge;
        return quoteWorking(bridge.law, bridge.method, {id: 'contest.policy.quote',
            bindings: bridge.bindings(actor), facts: bridge.facts(actor), at: 0, ports: bridge.ports(actor)}).ok;
    }
    return true;
}

function scoreCandidate(law, record, world, id, choice) {
    const move = law.moves[choice.move], actor = entrantView(law, clone(record), clone(world), id);
    const target = entrantView(law, clone(record), clone(world), choice.target);
    if (move.kind === 'guard') {
        return opponents(record, id).some(([, entry]) => entry.working?.bindings.target.id === id
            && entry.working?.status === 'running') ? 8 : 0;
    }
    if (['withdraw', 'yield'].includes(move.kind)) return -1;
    if (move.bridge) return -Object.values(move.costs ?? {}).reduce((a, b) => a + b, 0);
    const subject = `${record.id}:${id}:${record.entrants[id].moveCount + 1}`;
    const draw = name => drawFraction(record.seed, checkKey({subject, method: `contest.${name}`, targetState: {target: choice.target}}));
    const result = law.resolvers[move.resolver]({actor, target, move, draw, dials: law.dials});
    let score = 0;
    for (const landed of result.landed ?? []) score += (landed.object === 'vitality' ? 10 : 3) * (landed.verb === 'add' ? -1 : 1) * landed.amount;
    if ((result.landed ?? []).some(row => row.object === 'vitality' && row.verb !== 'add'
        && row.amount >= (target.quantities.vitality ?? Infinity))) score += 100;
    for (const cost of Object.values(move.costs ?? {})) score -= cost;
    return score;
}

/** Build a bounded scored contest chooser. Higher levels sample more candidates and take the best. */
export function createScoredChooser({level = 5, budget = 32} = {}) {
    check(natural(level) && level <= 100 && natural(budget) && budget > 0 && budget <= MAX_CANDIDATES,
        `Scored chooser budget must be 1..${MAX_CANDIDATES} candidates.`);
    const candidateLimit = Math.min(budget, 1 + level * 3);
    return (law, record, world, id) => {
        const e = record.entrants[id], baseline = defaultChoice(law, record, world, id);
        if (!baseline || baseline.move === 'withdraw' || baseline.move === 'yield' || baseline.move === 'wait') return baseline;
        const candidates = [];
        for (const move of e.moves) {
            if (!canPay(law, record, world, id, move)) continue;
            for (const target of legalTargets(law, record, world, id, move)) candidates.push({move, target});
        }
        const selected = candidates.slice(0, candidateLimit);
        if (!selected.length) return baseline;
        const scored = selected.map((choice, index) => ({choice,
            score: scoreCandidate(law, record, world, id, choice), index}));
        scored.sort((a, b) => b.score - a.score || a.index - b.index);
        const preferred = scored.find(row => row.choice.move === baseline.move && row.choice.target === baseline.target);
        const winner = level >= 5 ? (preferred && scored[0].score === preferred.score ? preferred : scored[0])
            : scored[Math.floor((scored.length - 1) / 2)];
        return {...winner.choice, why: `scored ${selected.length}/${budget} candidates`};
    };
}

function validatePolicy(policy, law, moves) {
    check(object(policy) && Array.isArray(policy.rows), 'A contest policy needs a rows array.');
    check(policy.rows.every(row => object(row) && typeof row.move === 'string' && moves.includes(row.move)
        && (row.when === undefined || object(row.when)) && (row.count === undefined || natural(row.count) && row.count > 0)
        && (row.fallback === undefined || moves.includes(row.fallback))), 'Invalid contest policy row.');
    return policy;
}

function predicateMatches(when, view, record, id) {
    if (!when) return true;
    return Object.entries(when).every(([key, expected]) => {
        if (key === 'healthAtMost') return view.fraction <= expected;
        if (key === 'healthAtLeast') return view.fraction >= expected;
        if (key === 'able') return view.able === expected;
        if (key.startsWith('quantity:')) return view.quantities[key.slice(9)] === expected;
        if (key === 'moveCountAtLeast') return record.entrants[id].moveCount >= expected;
        return false;
    });
}

/** Attach plain-JSON rows to a record so serializeContest/restoreContest retain policy state. */
export function withContestPolicy(record, entrantId, policy) {
    check(record?.entrants?.[entrantId], `Unknown contest entrant ${entrantId}.`);
    const next = clone(record);
    next.entrants[entrantId].policy = {rows: clone(policy.rows), cursor: 0, rowUses: 0};
    return next;
}

/** Read ordered policy rows through the contest chooser port. */
export function createPolicyChooser(policies) {
    check(object(policies), 'Contest policies are keyed by entrant id.');
    return (law, record, world, id) => {
        const configured = policies[id];
        if (!configured) return defaultChoice(law, record, world, id);
        const policy = validatePolicy(configured, law, record.entrants[id].moves);
        const e = record.entrants[id];
        e.policy ??= {rows: clone(policy.rows), cursor: 0, rowUses: 0, lastMoveCount: e.moveCount, fallback: false};
        const state = e.policy;
        if (state.lastMoveCount === undefined) state.lastMoveCount = e.moveCount;
        if (e.moveCount > state.lastMoveCount && !e.working) {
            state.lastMoveCount = e.moveCount;
            if (state.fallback) {state.fallback = false; delete state.fallbackMove;}
            else {
                const priorRow = state.rows[state.cursor];
                state.rowUses = (state.rowUses ?? 0) + 1;
                if (!priorRow?.count || state.rowUses >= priorRow.count) {
                    state.cursor = (state.cursor + 1) % state.rows.length;
                    state.rowUses = 0;
                }
            }
        }
        const cursor = state.cursor;
        if (state.fallback) return {move: state.fallbackMove, target: legalTargets(law, record, world, id, state.fallbackMove)[0] ?? id,
            why: 'policy fallback'};
        const view = entrantView(law, record, world, id);
        for (let offset = 0; offset < policy.rows.length; offset += 1) {
            const index = (cursor + offset) % policy.rows.length, row = policy.rows[index];
            if (!predicateMatches(row.when, view, record, id)) continue;
            let move = row.move;
            const target = legalTargets(law, record, world, id, move)[0] ?? id;
            if (!canPay(law, record, world, id, move)) {
                if (!row.fallback || !canPay(law, record, world, id, row.fallback)) continue;
                move = row.fallback;
                state.cursor = index; state.fallback = true; state.fallbackMove = move;
                return {move, target: legalTargets(law, record, world, id, move)[0] ?? id, why: 'policy fallback'};
            }
            const result = {move, target, why: 'policy row'};
            state.cursor = cursor;
            return result;
        }
        return null;
    };
}

/** Advance the saved policy cursor after a move, retaining a failed row when fallback was used. */
export function advancePolicy(record, entrantId, {fallback = false} = {}) {
    const next = clone(record), state = next.entrants[entrantId]?.policy;
    if (!state || fallback) return next;
    const row = state.rows[state.cursor];
    state.rowUses = (state.rowUses ?? 0) + 1;
    if (!row?.count || state.rowUses >= row.count) {state.cursor = (state.cursor + 1) % state.rows.length; state.rowUses = 0;}
    return next;
}

/** Run named policies on identical seeds; report outcome counts and per-side resource deltas. */
export function compareContestPolicies(law, spec, rules, world, namedPolicies, {seeds = [spec.seed], maxSteps = MAX_ROLLOUT_STEPS} = {}) {
    check(Array.isArray(seeds) && seeds.length > 0 && natural(maxSteps) && maxSteps > 0 && maxSteps <= MAX_ROLLOUT_STEPS,
        `Policy spread budget must be 1..${MAX_ROLLOUT_STEPS} steps.`);
    const result = {};
    for (const [name, policies] of Object.entries(namedPolicies)) {
        const outcomes = {}, spent = {}, changed = {}, samples = [];
        for (const seed of seeds) {
            let record = beginContest(law, {...spec, seed}, world);
            for (const [id, policy] of Object.entries(policies)) record = withContestPolicy(record, id, policy);
            let currentWorld = clone(world), steps = 0;
            const chooser = createPolicyChooser(policies);
            while (!record.result && steps < maxSteps) {
                const state = stepContest(law, record, rules, currentWorld, {choose: chooser});
                record = state.record; currentWorld = state.world; steps += 1;
            }
            check(record.result, `Policy spread exceeded its ${maxSteps}-step budget.`);
            for (const [id, outcome] of Object.entries(record.result.outcomes)) {
                const row = outcomes[outcome] ??= {};
                const side = record.entrants[id].side;
                row[side] = (row[side] ?? 0) + 1;
            }
            const sideCosts = {};
            for (const line of record.log) {
                if (!line.actor || !line.move || line.move === 'none') continue;
                const e = record.entrants[line.actor], bucket = sideCosts[e.side] ??= {};
                const move = law.moves[line.move];
                for (const [q, amount] of Object.entries(move?.costs ?? {})) bucket[q] = (bucket[q] ?? 0) + amount;
                for (const [q, amount] of Object.entries(line.spent ?? {})) bucket[q] = (bucket[q] ?? 0) + amount;
            }
            const initialRecord = beginContest(law, {...spec, seed}, world);
            for (const [id, e] of Object.entries(record.entrants)) {
                const bucket = changed[e.side] ??= {};
                const initial = entrantView(law, initialRecord, world, id).quantities;
                const final = currentWorld.holders[e.body]?.quantities ?? {};
                for (const [q, amount] of Object.entries(initial)) {
                    if (final[q] !== undefined && final[q] !== amount) bucket[q] = (bucket[q] ?? 0) + final[q] - amount;
                }
            }
            for (const [side, rows] of Object.entries(sideCosts)) {
                const dest = spent[side] ??= {};
                for (const [q, amount] of Object.entries(rows)) dest[q] = (dest[q] ?? 0) + amount;
            }
            samples.push({seed, result: record.result});
        }
        result[name] = {outcomes, spent, changed, samples};
    }
    return result;
}
