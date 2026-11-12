// Bounded search over candidate workings for one actor (PR3, PM3, PR6;
// docs/KERNEL_WORKING_CONTRACT.md KW32-KW34). "Say what you want, get
// candidates": the caller supplies candidate workings (from a move search, a
// grammar, a recipe book), and each is quoted from what the actor knows,
// under a budget of trials and settled steps per settlement. The player and
// every NPC call the same search and pay the same budget. Imports only the
// kernel.
import {check, natural, object} from './basics.js';
import {quoteForActor} from './kernel_working.js';

export const DEFAULT_SEARCH_BUDGET = Object.freeze({trials: 64, steps: 512});

// KW32. budget: {trials, steps}. A trial is one quoted candidate; steps count
// the steps those quotes settled in forecast. Steps stand in for a time
// budget: wall-clock time would make a reload search differently (PR1), so
// the cost of a search is counted in the work it does. Both are dials per
// actor (a genius searches deeper).
// KW33. Candidates are tried in the given order and the search stops before a
// trial that the budget no longer covers, so the same inputs give the same
// options, the same rejections and the same `truncated`.
// KW34. keep(quote) is the actor's goal ("cross the river"); options are
// eligible quotes that meet it, rejected keeps each reason (PM4, failures
// teach). limit caps how many options to keep.
export function searchForActor({actor, candidates, known, believedAuthority, knowsMethod, knownFacts = {}, at,
    budget = DEFAULT_SEARCH_BUDGET, keep = () => true, limit = Infinity}) {
    check(Array.isArray(candidates) && candidates.every(row => object(row?.law) && object(row?.method) && object(row?.bindings)),
        'Each candidate needs a law, a method and bindings.');
    check(object(budget) && natural(budget.trials) && natural(budget.steps), 'A search budget is whole trials and steps.');
    check(typeof keep === 'function' && (limit === Infinity || natural(limit)), 'Invalid search goal or limit.');
    const options = [];
    const rejected = [];
    let visited = 0;
    let steps = 0;
    let truncated = false;
    for (const [index, candidate] of candidates.entries()) {
        if (options.length >= limit) break;
        const size = candidate.method.steps.length;
        if (visited + 1 > budget.trials || steps + size > budget.steps) { truncated = true; break; }
        visited += 1;
        const id = candidate.id ?? `${actor}.search.${index}`;
        const quote = quoteForActor(candidate.law, candidate.method, {id, actor, bindings: candidate.bindings, known,
            believedAuthority, knowsMethod, knownFacts: candidate.knownFacts ?? knownFacts, at});
        steps += size;
        if (quote.eligible && keep(quote)) options.push({candidate: index, id, quote});
        else rejected.push({candidate: index, id, reasons: quote.eligible ? [{step: null, role: null, cause: 'goal', reason: 'goal-unmet'}]
            : quote.reasons});
    }
    return {actor, options, rejected, visited, steps, truncated};
}
