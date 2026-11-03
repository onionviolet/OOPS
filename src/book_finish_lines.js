// What finishing a book provides, as plain categories (a new skill, a new recipe, a
// bonus line). Names and flags of hidden rewards are never shown. `formatBonuses` is
// the caller's formatter so this leaf needs no display state.
export function bookFinishLines(stats, formatBonuses) {
    if(!stats) return [];
    const lines = [];
    if(stats.bonuses && Object.keys(stats.bonuses).length > 0) lines.push(formatBonuses(stats.bonuses));
    const skills = stats.rewards?.skills?.length, recipes = stats.rewards?.recipes?.length;
    if(skills) lines.push(skills === 1 ? 'a new skill' : 'new skills');
    if(recipes) lines.push(recipes === 1 ? 'a new recipe' : 'new recipes');
    return lines;
}
