// UIL8 display policy. Native values and modifier categories remain the authority.
export const SECONDARY_STATS = [
    ['stamina_efficiency','Sta eff.'],['cold_tolerance','Cold Δ'],['xp_hero','Hero XP'],
    ['xp_all_skill','Skill XP'],['xp_all','Global XP'],['attack_count','Hits/atk'],
    ['block_strength','Shield'],['block_chance','Block %'],['health_regeneration_flat','HP /s'],
    ['stamina_regeneration_flat','Sta /s'],['unarmed_power','Unarmed'],
    ['health_regeneration_percent','HP %/s'],['stamina_regeneration_percent','Sta %/s'],
    ['mana_regeneration_flat','Mana /s'],['mana_regeneration_percent','Mana %/s'],
];
export const pinKey = id => `panel.shell-character.pin.${id}`;
export const isRate = id => id.includes('_regeneration_');
export function secondaryVisible(row, pinned = false) {
    if (!row || row.value == null || row.availability?.status !== 'active') return false;
    if (pinned) return true;
    // Cold's everyday home is the weather; it is still pinnable from Attributes.
    if (row.id === 'cold_tolerance') return false;
    const neutral = row.unit === '×' || ['attack_count','unarmed_power'].includes(row.id) ? 1 : 0;
    const effect = row.sources?.some(s => s.label === 'Active effects' && (s.flat != null && s.flat !== 0 || s.multiplier != null && s.multiplier !== 1));
    return row.value !== neutral || !!effect;
}
// Same inclusive comparison as the native cold-counter owner, main.js. No scale or severity model.
export const coldApplies = (temperature, tolerance, threshold) => temperature + tolerance <= threshold;
export function readTemperature(doc = document) {
    const weather = doc.getElementById('weather_div');
    if (!weather || !weather.dataset.temperatureC) return null;
    const {temperatureC, coldTolerance, coldThreshold} = weather.dataset;
    const temperature = Number(temperatureC), tolerance = Number(coldTolerance), threshold = Number(coldThreshold);
    if (![temperature,tolerance,threshold].every(Number.isFinite)) return null;
    const cold = coldApplies(temperature,tolerance,threshold);
    return {cold, temperature, tolerance, threshold,
        label: `${weather.dataset.temperatureLabel} · ${cold ? 'cold' : 'comfortable'}`,
        description: `Cold tolerance: ${tolerance} °C difference. Cold exposure applies at ${threshold - tolerance} °C or below. Existing cold effects keep their native recovery rules.`};
}
