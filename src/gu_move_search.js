import {abilityModifiers, guModifierApplies, resolveGuActivation} from './gu_activation.js';

// Search direct supports followed by one core. Synchronized and chained
// procedures can still call the resolver with their own ordered stages.
export function searchGuMoves({available, reserves, day, effect, maxSupports = 2, trialLimit = 200, pareto = true}) {
    if (!Number.isSafeInteger(maxSupports) || maxSupports < 0 || !Number.isSafeInteger(trialLimit) || trialLimit < 1) {
        throw Error('Move search needs valid support and trial limits.');
    }
    const cores = available.filter(stage => stage.ability.effect?.kind === effect).map(core => ({
        core,
        supports: available.filter(stage => stage.gu.id !== core.gu.id && !stage.ability.effect &&
            abilityModifiers(stage.ability).some(row => guModifierApplies(row, core.gu, core.ability))),
    }));
    const limit = Math.min(maxSupports, cores.reduce((max, {supports}) => Math.max(max, supports.length), 0));
    const options = [];
    let evaluated = 0;
    for (let count = 0; count <= limit; count++) {
        for (const {core, supports} of cores) {
            for (const group of combinations(supports, count)) {
                if (evaluated === trialLimit) return {options, evaluated, truncated: true};
                evaluated++;
                const resolved = resolveGuActivation({stages: [...group, core], reserves, day});
                if (resolved.outcome !== 'complete') continue;
                const {activations, effects, remaining} = resolved;
                const option = {core: core.gu.id, supports: group.map(stage => stage.gu.id), effects, activations, remaining};
                if (pareto) {
                    if (options.some(existing => dominates(existing, option, reserves))) continue;
                    for (let index = options.length - 1; index >= 0; index--) {
                        if (dominates(option, options[index], reserves)) options.splice(index, 1);
                    }
                }
                options.push(option);
            }
        }
    }
    return {options, evaluated, truncated: false};
}

function* combinations(rows, count, start = 0, prefix = []) {
    if (count === 0) {
        yield prefix;
        return;
    }
    for (let index = start; index <= rows.length - count; index++) {
        yield* combinations(rows, count - 1, index + 1, [...prefix, rows[index]]);
    }
}

function dominates(a, b, reserves) {
    const magnitudeA = a.effects[0].magnitude;
    const magnitudeB = b.effects[0].magnitude;
    const rangeA = a.effects[0].range ?? 0;
    const rangeB = b.effects[0].range ?? 0;
    const countA = a.effects[0].count ?? 1;
    const countB = b.effects[0].count ?? 1;
    if (magnitudeA < magnitudeB || rangeA < rangeB || countA < countB || a.supports.length > b.supports.length) return false;
    let savesFuel = false;
    for (const [operator, pools] of Object.entries(reserves)) {
        for (const fuel of Object.keys(pools)) {
            if (a.remaining[operator][fuel] < b.remaining[operator][fuel]) return false;
            if (a.remaining[operator][fuel] > b.remaining[operator][fuel]) savesFuel = true;
        }
    }
    return savesFuel || magnitudeA > magnitudeB || rangeA > rangeB || countA > countB || a.supports.length < b.supports.length;
}
