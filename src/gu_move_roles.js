// One Gu per role, in the recipe's declared activation order. Roles match
// functions and optional path/kind constraints, independent of custody IDs.
export function bindGuMove(recipe, available) {
    return [...iterateGuMoveBindings(recipe, available)];
}

export function guMoveRoleMatches(role, {gu, ability, operator}) {
    return (role.fn === undefined || role.fn === ability.fn) &&
        (!role.path || role.path === ability.path) && (!role.kind || role.kind === gu.kind) &&
        (!role.operator || role.operator === operator) && (role.minRank === undefined || gu.rank >= role.minRank);
}

export function* iterateGuMoveBindings(recipe, available, budget) {
    const choices = recipe.roles.map(role => available.filter(stage => guMoveRoleMatches(role, stage)));
    const chosen = new Map();
    const used = new Set();

    function* visit(index) {
        if (budget && budget.visited >= budget.limit) {budget.truncated = true; return;}
        if (budget) budget.visited++;
        const role = recipe.roles[index];
        if (!role) {
            yield {roles: Object.fromEntries(chosen), stages: [...chosen.values()].filter(Boolean)};
            return;
        }
        for (const stage of choices[index]) {
            const {gu} = stage;
            if (used.has(gu.id)) continue;
            chosen.set(role.id, stage);
            used.add(gu.id);
            yield* visit(index + 1);
            used.delete(gu.id);
            if (budget?.truncated) return;
        }
        if (role.optional) {
            chosen.set(role.id, null);
            yield* visit(index + 1);
        }
        chosen.delete(role.id);
    }

    yield* visit(0);
}
