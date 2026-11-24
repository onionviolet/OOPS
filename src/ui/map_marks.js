// Both maps use the registry's activity types and the same icon key.
export const activityMarks = [
    {key:'rest', icon:'bed', label:'Resting'},
    {key:'trader', icon:'storefront', label:'Trader'},
    {key:'woodcutting', icon:'forest', label:'Woodcutting'},
    {key:'mining', icon:'landslide', label:'Mining'},
    {key:'herbalism', icon:'local_florist', label:'Herbalism'},
    {key:'fishing', icon:'phishing', label:'Fishing'},
    {key:'training', icon:'fitness_center', label:'Training'},
    {key:'jobs', icon:'work', label:'Jobs'},
    {key:'craft', icon:'construction', label:'Crafting'},
];
const byKey = new Map(activityMarks.map(mark => [mark.key, mark]));

export function locationMapMarks(place, {activities, trader, available = () => true}) {
    const keys = new Set();
    if (place.housing && available(place.housing)) keys.add('rest');
    if (place.npcs?.some(trader)) keys.add('trader');
    if (place.crafting && available(place.crafting)) keys.add('craft');
    for (const entry of Object.values(place.activities || {})) {
        if (!available(entry)) continue;
        const id = entry.activity_name;
        const type = activities[id]?.type;
        if (type === 'JOB') keys.add('jobs');
        else if (type === 'TRAINING') keys.add('training');
        else if (type === 'GATHERING' && byKey.has(id)) keys.add(id);
    }
    return activityMarks.filter(mark => keys.has(mark.key));
}

export function locationMapDanger(place, enemies, observed = () => true) {
    if (!place.tags.combat_zone) return null;
    const candidates = [...place.enemies_list, ...place.enemy_groups_list.flat()];
    const ranks = candidates.filter(observed).map(id => enemies[id]?.rank).filter(Number.isFinite);
    return {rank: ranks.length ? Math.max(...ranks) : null, challenge: place.is_challenge};
}

export function dangerLabel(danger) {
    return [danger.challenge ? 'Challenge' : 'Combat area',
        danger.rank == null ? '' : 'Enemy rank ' + danger.rank].filter(Boolean).join(' · ');
}
