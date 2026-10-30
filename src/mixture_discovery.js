// What the player has learned from drinking mixtures, as a pure projection (UIV6: known, guessed, unknown).
// Inputs are only the observed products: their inputs, process and dose. Ingredient profiles and the hidden
// method are never read, so nothing here can leak truth the player has not earned (AD6-AD8) and no saved
// field is added. A later world or the brewing panel adds effect rows to MIXTURE_EFFECTS, not code.
import {INGREDIENTS} from './mixture_state.js';

// tiers: ascending [upper bound, word] on the dose of one vial. A plant's table word is its dose in a standard
// vial (one pack of it, one of water), so one scale serves the table and the vial card.
const STANDARD_SHARE = 0.5;
export const MIXTURE_EFFECTS = [
    {id:'health', dose:'health', label:'Health regeneration', tiers:[[0.05,'none seen'],[0.75,'faint'],[1.15,'mild'],[1.4,'steady'],[Infinity,'strong']]},
    {id:'stamina', dose:'stamina', label:'Stamina regeneration', tiers:[[0.05,'none seen'],[0.75,'faint'],[1.15,'mild'],[1.4,'steady'],[Infinity,'strong']]},
    {id:'agility', dose:'sedation', label:'Agility drag', side:true, tiers:[[0.001,'none seen'],[0.02,'slight'],[Infinity,'noticeable']]},
];
const EPS = 1e-9;
const PROCESS_WORD = {steep:'steeped', boil:'boiled'};
const tierWord = (effect, value) => effect.tiers.find(([bound]) => value < bound)?.[1] ?? effect.tiers.at(-1)[1];
const packs = inputs => Object.values(inputs).reduce((a, n) => a + n, 0);
const plantIds = new Set(INGREDIENTS.filter(i => i.role === 'plant').map(i => i.id));

/** Observed vials, oldest first by observation time. */
export function observedVials(owner) {
    return Object.entries(owner?.knowledge ?? {}).filter(([id, k]) => k?.observed && owner.products?.[id])
        .map(([id, k]) => ({id, at: k.at, product: owner.products[id]})).sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : 1))
        .map(({id, product}) => ({id, process: product.process, revision: product.revision ?? 1, law: `${product.process}@${product.revision ?? 1}`, inputs: product.inputs, dose: product.dose, plants: Object.keys(product.inputs).filter(i => plantIds.has(i)), total: packs(product.inputs)}));
}
// Strength of a plant at full share of the vial, per effect: dose * packs / plant packs, under one process.
const share = (vial, id) => vial.inputs[id] / vial.total;

function plantReadings(vials) {
    // readings[plant][process] = {strength:{effect:value}, how:'alone'|'worked out', from:vialId}
    const readings = {};
    // Revision-2 (responsive) vials follow a different law, so readings are kept per process and revision.
    const set = (plant, vial, strength, how) => { (readings[plant] ??= {}); if (!readings[plant][vial.law]) readings[plant][vial.law] = {strength, how, from: vial.id, process: vial.process, revision: vial.revision}; };
    for (const vial of vials) if (vial.plants.length === 1)
        set(vial.plants[0], vial, Object.fromEntries(MIXTURE_EFFECTS.map(e => [e.id, vial.dose[e.dose] / share(vial, vial.plants[0])])), 'alone');
    // Two vials can separate plants: subtract the plants already read under this process.
    for (let pass = 0; pass < plantIds.size; pass++) for (const vial of vials) {
        const unread = vial.plants.filter(p => !readings[p]?.[vial.law]);
        if (unread.length !== 1) continue;
        const [target] = unread, strength = {};
        for (const e of MIXTURE_EFFECTS) {
            const rest = vial.plants.filter(p => p !== target).reduce((sum, p) => sum + readings[p][vial.law].strength[e.id] * share(vial, p), 0);
            strength[e.id] = Math.max(0, (vial.dose[e.dose] - rest) / share(vial, target));
        }
        set(target, vial, strength, 'worked out');
    }
    return readings;
}

/** Does a vial's dose equal what the plants alone predict? Only vials whose plants were all read from other vials count. */
function carrierVerdict(id, vials, readings) {
    let tested = false;
    for (const vial of vials) {
        if (!vial.inputs[id] || !vial.plants.length) continue;
        const read = vial.plants.map(p => readings[p]?.[vial.law]);
        if (read.some(r => !r || r.from === vial.id)) continue;
        tested = true;
        for (const e of MIXTURE_EFFECTS) {
            const predicted = vial.plants.reduce((sum, p, i) => sum + read[i].strength[e.id] * share(vial, p), 0);
            if (Math.abs(predicted - vial.dose[e.dose]) > 1e-6) return 'adds';
        }
    }
    return tested ? 'nothing' : 'untested';
}

/**
 * Ingredient by effect table. cell: {state:'known'|'guessed'|'unknown', word, text, readings[]}.
 * Returns {effects, rows, process, suggestion, text}; every state also has words (UR37).
 */
export function projectMixtureDiscovery(owner) {
    const vials = observedVials(owner), readings = plantReadings(vials);
    const rows = INGREDIENTS.map(ing => {
        const seen = vials.filter(v => v.inputs[ing.id]);
        const unknownCells = text => MIXTURE_EFFECTS.map(e => ({effect:e.id, state:'unknown', word:'?', text}));
        if (ing.role === 'plant') {
            const byProcess = readings[ing.id] ?? {};
            if (Object.keys(byProcess).length) return {id:ing.id, role:ing.role, state:'known', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => {
                const parts = Object.values(byProcess).map(r => ({process:r.process, revision:r.revision, value:r.strength[e.id] * STANDARD_SHARE, word:tierWord(e, r.strength[e.id] * STANDARD_SHARE), how:r.how}));
                const label = x => `${PROCESS_WORD[x.process]}${x.revision === 2 ? ', responsive' : ''}`;
                // Steep and boil readings of one law side by side, with the ratio so the process lesson shows.
                const steep = parts.find(x => x.process === 'steep' && x.revision === 1), boil = parts.find(x => x.process === 'boil' && x.revision === 1);
                const ratio = steep && boil && steep.value > 0.05 && boil.value > 0.05 ? boil.value / steep.value : null;
                const same = parts.length > 1 && parts.every(x => x.word === parts[0].word) && (ratio === null || Math.abs(ratio - 1) <= 0.1);
                const ratioText = ratio !== null && Math.abs(ratio - 1) > 0.1 ? ` (boiling ≈${ratio.toFixed(1)}× steeping)` : '';
                const word = same ? `${parts[0].word}, same either way` : parts.map(x => `${x.word} (${label(x)})`).join(' · ') + ratioText;
                return {effect:e.id, state:'known', word, ratio, readings:parts, text: parts.map(x => `${x.word} ${label(x)}${x.how === 'worked out' ? ' (worked out from two vials)' : ''}`).join('; ') + ratioText};
            })};
            if (seen.length) return {id:ing.id, role:ing.role, state:'guessed', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => {
                const hits = seen.filter(v => v.dose[e.dose] >= (e.tiers[0][0]));
                return {effect:e.id, state:'guessed', word:'≈', text: hits.length ? `Something in vials with it gave a ${tierWord(e, Math.max(...hits.map(v => v.dose[e.dose])))} dose, but another plant was in the vial too` : 'No effect appeared in vials with it, but another plant was in the vial too'};
            })};
            return {id:ing.id, role:ing.role, state:'unknown', seen:0, cells: unknownCells('Not yet drunk in any vial')};
        }
        if (ing.base) return {id:ing.id, role:ing.role, state:seen.length ? 'guessed' : 'unknown', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => ({effect:e.id, state:seen.length ? 'guessed' : 'unknown', word:seen.length ? '≈' : '?', text:'In every vial, so no vial can show it alone; assumed to only dilute'}))};
        const verdict = carrierVerdict(ing.id, vials, readings);
        if (verdict === 'nothing') return {id:ing.id, role:ing.role, state:'known', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => ({effect:e.id, state:'known', word:'none seen', text:'adds nothing, only dilutes'}))};
        if (verdict === 'adds') return {id:ing.id, role:ing.role, state:'guessed', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => ({effect:e.id, state:'guessed', word:'≈', text:'changes something the plants alone do not explain'}))};
        if (seen.length) return {id:ing.id, role:ing.role, state:'guessed', seen:seen.length, cells: MIXTURE_EFFECTS.map(e => ({effect:e.id, state:'guessed', word:'≈', text:'In a vial you drank, but no vial yet separates what it does'}))};
        return {id:ing.id, role:ing.role, state:'unknown', seen:0, cells: unknownCells('Not yet drunk in any vial')};
    });
    const process = ['steep', 'boil'].map(kind => ({process:kind, vials: vials.filter(v => v.process === kind).length}));
    const suggestion = nextTry(rows, readings, vials);
    const out = {effects: MIXTURE_EFFECTS.map(e => ({id:e.id, label:e.label, side:!!e.side})), rows, process, suggestion};
    out.text = discoveryText(out);
    return out;
}

const mark = {known:'known', guessed:'guessed', unknown:'unknown'};
export function discoveryText(d) {
    const lines = ['Effects you have observed, by ingredient:'];
    for (const row of d.rows) lines.push(`${row.id} (${mark[row.state]}): ${row.cells.map((c, i) => `${d.effects[i].label} ${c.state === 'known' ? c.text.replace(/ \(worked out from two vials\)/g, '') : c.state}`).join('; ')}.`);
    lines.push('Words give the dose in a standard vial: one pack of the plant, one of water.');
    lines.push(`Vials drunk: ${d.process.map(p => `${p.vials} ${PROCESS_WORD[p.process]}`).join(', ')}.`);
    lines.push(`Next try: ${d.suggestion.text}`);
    return lines.join('\n');
}

function nextTry(rows, readings, vials) {
    const plants = rows.filter(r => r.role === 'plant'), water = 'Spring water';
    const alone = (plant, process = 'steep') => ({inputs:{[plant]:1, [water]:1}, process});
    if (!vials.length) return {kind:'first', text:`Mix ${plants[0].id} with Spring water and drink one dose. That shows what the plant does on its own.`, prefill:alone(plants[0].id)};
    const unknown = plants.find(r => r.state === 'unknown');
    if (unknown) return {kind:'isolate', text:`You have not seen ${unknown.id} yet. Mix it with Spring water alone (no other plant), then drink one dose.`, prefill:alone(unknown.id)};
    const mixed = plants.find(r => r.state === 'guessed');
    if (mixed) return {kind:'separate', text:`${mixed.id} has only been in a vial with another plant. Mix it with Spring water alone to see which effect is its own.`, prefill:alone(mixed.id)};
    for (const r of plants) {
        const have = [...new Set(Object.values(readings[r.id] ?? {}).filter(x => x.revision === 1).map(x => x.process))];
        if (have.length === 1) { const other = have[0] === 'steep' ? 'boil' : 'steep';
            return {kind:'process', text:`You know ${r.id} ${PROCESS_WORD[have[0]]}. ${other === 'boil' ? 'Boil' : 'Steep'} the same vial: the process changes how much of each effect reaches you.`, prefill:alone(r.id, other)}; }
    }
    const salt = rows.find(r => r.role === 'carrier' && !INGREDIENTS.find(i => i.id === r.id).base && r.state !== 'known');
    if (salt) return {kind:'carrier', text:`Add ${salt.id} to a plant mix you already know, then compare the dose with the one before.`, prefill:{inputs:{[plants[0].id]:1, [water]:1, [salt.id]:1}, process:Object.values(readings[plants[0].id])[0].process}};
    return {kind:'blend', text:'Every ingredient here is known. Blend both plants and read the result against what you expect from each.', prefill:{inputs:{[plants[0].id]:1, [plants[1]?.id ?? plants[0].id]:1, [water]:1}, process:'steep'}};
}

/** Potency and side effects of one vial in words: the quality band the player sees on a vial card. */
export function describeVial(product) {
    const bands = MIXTURE_EFFECTS.map(e => ({e, v:product.dose[e.dose], word:tierWord(e, product.dose[e.dose])}));
    const main = bands.filter(b => !b.e.side).sort((a, b) => b.v - a.v)[0];
    const side = bands.filter(b => b.e.side && b.v >= b.e.tiers[0][0]);
    return {potency: main.v < main.e.tiers[0][0] ? 'inert' : `${main.word} ${main.e.label.toLowerCase()}`, side: side.map(b => `${b.word} ${b.e.label.toLowerCase()}`), minutes: product.dose.duration};
}
