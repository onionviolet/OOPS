import {AFFIXES} from './gear_affixes.js';
// Comparisons read the same item readers as equipment bonuses and combat. No
// recipe result creation, rolls, mutations or aggregate power score.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round = value => Math.round(value * 1000) / 1000;
const reductions = new Set(['damage_taken', 'min_damage_share']);
export function equipmentComparison(item, baseline, {quality = item?.quality, qualityRange} = {}) {
    if(!item || !baseline || item === baseline) return null;
    if(item.tags?.structuredEquipment || baseline.tags?.structuredEquipment) return {unsupported:'This equipment uses body fit, coverage, custody and condition readers. An item-only comparison cannot forecast its effective worn result.'};
    const comparable = item.equip_slot ? item.equip_slot === baseline.equip_slot : item.component_type && item.component_type === baseline.component_type;
    if(!comparable) return {unsupported: 'These objects use different equipment slots or component roles.'};
    const qualities = qualityRange?.length ? [...new Set(qualityRange)] : [quality];
    const stats = baseline.getStats?.() || {}, rows = [];
    const add = (id, kind, label, read, neutral = 0) => {
        const theirs = read(baseline) ?? neutral, values = qualities.map(q => read(item, q) ?? neutral);
        if(![theirs, ...values].every(Number.isFinite)) return;
        const deltas = values.map(v => round(v - theirs));
        rows.push({id, kind, label, baseline: round(theirs), values: values.map(round), deltas,
            favorable: deltas.every(d => reductions.has(id) ? d <= 0 : d >= 0) ? true : deltas.every(d => reductions.has(id) ? d >= 0 : d <= 0) ? false : null});
    };
    for(const [method, label] of [['getAttack','Attack'],['getDefense','Defense'],['getShieldStrength','Block']]) {
        if(item[method] && baseline[method]) add(label.toLowerCase(), 'flat', label, (i,q) => i[method](q));
    }
    if(item.component_type) {
        for(const [field,label,neutral] of [['quality','Part quality (assembly input)',0],['component_tier','Part tier (assembly input)',0],['attack_value','Part attack value',0],['attack_multiplier','Part attack factor',1],['shield_strength','Part block strength',0],['defense_value','Part defense value',0]]) {
            if(Number.isFinite(item[field]) || Number.isFinite(baseline[field]))add(field,field==='attack_multiplier'?'multiplier':'flat',label,(i,q)=>field==='quality'?(q ?? i.quality):i[field],neutral);
        }
    }
    const keys = new Set([...Object.keys(stats), ...qualities.flatMap(q => Object.keys(item.getStats?.(q) || {}))]);
    for(const id of keys) for(const kind of ['flat','multiplier']) {
        if(stats[id]?.[kind] != null || qualities.some(q => item.getStats?.(q)?.[id]?.[kind] != null)) add(id,kind,id,(i,q)=>(i.getStats?.(q)||{})[id]?.[kind],kind === 'multiplier' ? 1 : 0);
    }
    return {baselineName: baseline.getName?.() || baseline.name, baselineQuality: baseline.quality, qualities, rows};
}
export function equipmentComparisonHTML(item, baseline, options = {}) {
    const model = equipmentComparison(item, baseline, options);
    if(!model) return '';
    if(model.unsupported) return `<br><br>Comparison unavailable: ${esc(model.unsupported)}`;
    const source = i => Object.entries(i.components || {}).map(([role,id]) => `${role}: ${options.templates?.[id]?.getName?.() || id}`).join(', ');
    const context = source(item), baseContext = source(baseline);
    let html = `<br><br><b>Compared with ${esc(model.baselineName)}${Number.isFinite(model.baselineQuality) ? `, ${model.baselineQuality}% quality` : ''}</b><br>Baseline: ${esc(options.baselineRole || 'equipped item')} at inspection time. Values are item contributions; body, skill and encounter effects still apply.`;
    if(context) html += `<br>Preview parts: ${esc(context)}`;
    if(baseContext) html += `<br>Baseline parts: ${esc(baseContext)}`;
    const provenance = i => (i.affixes || []).map(a=>`${AFFIXES.find(d=>d.id===a.id)?.name || a.id}: ${a.v} (stored item modifier)`).join(', ');
    if(provenance(item))html += `<br>Inspected affixes: ${esc(provenance(item))}`;
    if(provenance(baseline))html += `<br>Baseline affixes: ${esc(provenance(baseline))}`;
    if(options.qualityRange?.length>1 && item.components)html += '<br>Preview covers the selected parts and quality range before new craft affixes. Those additional outcomes remain unresolved until the craft commits.';
    for(const row of model.rows) {
        const label = options.statNames?.[row.id] || row.label.replaceAll('_',' '), unit = row.kind === 'multiplier' ? '×' : '';
        const values = row.values.map(v => `${unit}${v}`).join(' to '), deltas = row.deltas.map(v => `${v > 0 ? '+' : ''}${v}`).join(' to ');
        // Text carries direction; no universal green/red assertion for stats with
        // world-specific tradeoffs. Reduction dimensions explicitly say lower.
        html += `<br>${esc(label)}: ${values} vs ${unit}${row.baseline} (Δ ${deltas}${reductions.has(row.id) ? '; lower reduces damage' : ''})`;
    }
    if(!model.rows.length) html += '<br>No comparable native stat reader.';
    return html;
}
