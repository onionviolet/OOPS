// One operator, one path and one effect core, with ordered direct supports.
// The host supplies custody, knowledge and world policy and owns publication.
import {check, sameStructural} from './basics.js';
import {archiveOffer, checkEffect, createNicheArchive, keepSpread} from './effect_checks.js';
import {EFFECT_OBJECTS} from './effect_grammar.js';
import {compareCodePoints} from './gen_kit.js';
import {compileGuMove} from './gu_move_roles.js';
import {searchGuMoves} from './gu_move_search.js';
import {guAbility, guRef} from './gu_working_law.js';
import {beginQuotedWorking, quoteWorking, settleWorking} from './kernel_working.js';
import {freezeValue} from './procedural_grammar.js';
import {stableId} from './simulation_ids.js';

function heldPorts({operator, held, known, ports}) {
    const ids = new Set(held);
    const kinds = new Set(known);
    return {...ports, read(ref, at) {
        if (ref.kind !== 'gu') return ports.read(ref, at);
        if (!ids.has(ref.id)) return null;
        const gu = ports.read(ref, at);
        return gu?.id === ref.id && gu.kind === 'gu' && gu.holder === operator.id && kinds.has(gu.guKind)
            ? gu : null;
    }};
}

function checkCandidate(candidate, quote, world) {
    if (!quote.ok) return {pass: false, reason: quote.reason};
    const {recipe, effect, cause, novelty} = candidate;
    const [output] = quote.effects;
    if (quote.effects.length !== 1 || output.kind !== effect) {
        return {pass: false, reason: 'goal-unmet'};
    }
    const projection = world.project(output);
    if (!projection) return {pass: false, reason: 'effect-projection-unknown'};

    // The curve is an admission dial in one named fuel. Actual debits come
    // from the Gu law; unlike fuels cannot be added to meet this price.
    const {parts, fit = 0} = projection;
    const amount = quote.costs.filter(cost => cost.quantity === world.priceQuantity &&
        cost.holder === candidate.bindings.operator.id).reduce((sum, cost) => sum + cost.amount, 0);
    const {checks, built} = checkEffect(world.fitted, {id: recipe.id, parts, amount}, world);
    const law = `${parts.verb}|${EFFECT_OBJECTS[parts.object]}`;
    const exception = world.forbid?.find(rule => rule.law === law)?.exception;
    if (exception) {
        // checkEffect can describe exceptions. This composition has no
        // filler that can settle an exception's separate cost.
        Object.assign(checks.find(row => row.id === 'allows'), {pass: false, reason: 'exception-cost-unsettled'});
    }
    if (!checks.every(row => row.pass)) return {pass: false, reason: 'effect-check-failed', checks};
    if (recipe.roles.length < 2) return {pass: false, reason: 'no-composition', checks};
    const kinds = recipe.roles.map(role => role.kind);
    if (world.canonMoves.some(move => sameStructural(move, kinds))) {
        return {pass: false, reason: 'known-composition', checks};
    }
    const [scored] = keepSpread([{id: recipe.id, parts}], world.canonParts,
        {k: 1, weights: world.weights, fit: () => fit}).kept;
    check(Number.isSafeInteger(scored.score), 'Gu archive scores must be safe integers.');
    return {pass: true, checks, entry: {id: recipe.id, parts: scored.parts, score: scored.score,
        breakdown: scored.breakdown, cause, novelty, grammar: recipe.grammar,
        sentence: freezeValue({...built, cause}), recipe, explanation: checks.find(row => row.id === 'explains').text}};
}

// The request ID addresses this deterministic enumeration. held lists specimen
// IDs, known lists understood catalogue kinds. world supplies a fitted effect
// grammar, checkEffect policy, priceQuantity, canonParts, ordered canonMoves,
// and project(effect) -> {parts, fit?}. Only understood, held Gu enter search.
export function generateGuMoves({id, path, effect, cause, novelty, world, maxSupports = 2, trialLimit = 200, ...context}) {
    check(stableId(id) && typeof cause?.kind === 'string' && cause.kind &&
        typeof cause.id === 'string' && cause.id, 'Gu generation needs an address and cause.');
    check(stableId(path) && stableId(effect), 'Gu generation needs a path and target effect.');
    check(novelty?.level === 3 && typeof novelty.cause === 'string' && novelty.cause,
        'Gu composition needs a level-three novelty dial and cause.');
    const {held, operator, facts, at} = context;
    const ports = heldPorts(context);
    const available = [];
    for (const id of [...new Set(held)].sort(compareCodePoints)) {
        if (!stableId(id)) continue;
        const bound = ports.read(guRef(id), at);
        if (!bound) continue;
        const {guKind, ...gu} = bound;
        const ability = guAbility(guKind);
        if (ability && (!ability.effect || ability.path === path)) {
            available.push({gu: {...gu, kind: guKind}, ability, operator: operator.id});
        }
    }
    const byId = new Map(available.map(stage => [stage.gu.id, stage.gu]));
    const reserves = {[operator.id]: {}, ...facts.reserves};
    const {options, evaluated, truncated} = searchGuMoves({available, reserves, day: facts.day ?? at, effect,
        maxSupports, trialLimit, pareto: false});
    let quoted = 0;
    const results = options.map(({core, supports}, index) => {
        const sequence = [...supports, core];
        const roles = sequence.map((gu, slot) => ({id: `cast.${slot}`, type: 'gu', kind: byId.get(gu).kind}));
        const recipe = {id: `${id}.move.${index}`, grammar: world.fitted.ref, ordered: true, roles};
        const bindings = {operator: {kind: 'operator', id: operator.id},
            ...Object.fromEntries(roles.map((role, slot) => [role.id, guRef(sequence[slot])]))};
        const candidate = {recipe, bindings, effect, cause: {kind: cause.kind, id: cause.id},
            novelty: {level: novelty.level, cause: novelty.cause}};
        const compiled = compileGuMove(recipe, {bindings, ports, at});
        if (!compiled.ok) return {...candidate, pass: false, reason: 'compile-refused', requirements: compiled.requirements};
        const quote = quoteWorking(compiled.law, compiled.method, {id: recipe.id, bindings: compiled.bindings, facts, at, ports});
        quoted++;
        const result = checkCandidate(candidate, quote, world);
        return {...candidate, ...result, preview: {effects: quote.effects, costs: quote.costs, fingerprint: quote.fingerprint}};
    });
    const reason = options.length ? null : truncated ? 'search-budget' : evaluated ? 'no-funded-binding' : 'no-known-held-core';
    return {results, reason, budget: {trialLimit, evaluated, quoted, truncated}};
}

// Settle a chosen preview on current K inputs. The returned record and effects
// belong to the host, including any partial costs on an interrupted working.
export function settleGeneratedGuMove(candidate, {world, archive = createNicheArchive(), ...context}) {
    const {facts, at, operator} = context;
    if (!candidate.pass) return {ok: false, reason: candidate.reason, archive};
    if (candidate.bindings.operator.id !== operator.id || candidate.recipe.grammar !== world.fitted.ref) {
        return {ok: false, reason: 'preview-context-changed', archive};
    }
    const ports = heldPorts(context);
    const {recipe, bindings} = candidate;
    const compiled = compileGuMove(recipe, {bindings, ports, at});
    if (!compiled.ok) return {ok: false, reason: 'compile-refused', requirements: compiled.requirements, archive};
    const {law, method} = compiled;
    const start = beginQuotedWorking(law, method, {id: recipe.id, bindings: compiled.bindings, facts, at, ports,
        fingerprint: candidate.preview.fingerprint});
    if (start.stale) return {ok: false, reason: 'stale-quote', archive};
    const verified = checkCandidate(candidate, start.quote, world);
    if (!verified.pass) return {ok: false, reason: verified.reason, checks: verified.checks, archive};

    const {record, effects} = settleWorking(law, start.record, {now: start.quote.endsAt, ports});
    const costs = record.receipts.flatMap(row => row.truth.costs ?? []);
    const settled = {record, effects, costs};
    if (record.status !== 'complete') return {ok: false, reason: record.receipts.at(-1).reason, ...settled, archive};
    const paid = {...facts.reserves?.[operator.id]};
    for (const {quantity, holder, amount} of costs) {
        const fuel = quantity.slice('essence.'.length);
        if (holder !== operator.id || !quantity.startsWith('essence.') || !Object.hasOwn(paid, fuel)) {
            return {ok: false, reason: 'unmatched-cost', ...settled, archive};
        }
        paid[fuel] -= amount;
    }
    if (!sameStructural(costs, start.quote.costs) ||
        !sameStructural(paid, record.facts.reserves[operator.id]) ||
        !sameStructural(effects.map(row => row.effect), start.quote.effects)) {
        return {ok: false, reason: 'settlement-mismatch', ...settled, archive};
    }
    const offer = archiveOffer(archive, {...verified.entry, effects: start.quote.effects, costs, law: law.ref});
    return {ok: true, ...settled, archive: offer.archive, archiveReceipt: offer.receipt};
}
