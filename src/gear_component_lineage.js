// The equipped item owns its current component keys. Each retained component
// key still resolves through the existing material lineage and stock rules.
import {planProcessedMaterial, readMaterialLineage} from './material_lineage.js';

export function readGearComponentLineage(parsed) {
    const parts = parsed.componentLineage;
    if (parts == null) return null;
    if (typeof parts !== 'object' || Array.isArray(parts) || !parsed.components || !Object.keys(parts).length) {
        throw Error('Invalid gear component history.');
    }
    for (const [slot, key] of Object.entries(parts)) {
        const part = typeof key === 'string' ? JSON.parse(key) : null;
        if (!part || !Object.hasOwn(parsed.components, slot) || part.id !== parsed.components[slot]
            || !Number.isFinite(part.quality) || part.quality <= 0 || !readMaterialLineage(key)) {
            throw Error('Gear history disagrees with its fitted component.');
        }
    }
    return parts;
}

export function retainGearComponentLineage(parsedKey, selected) {
    if (!parsedKey.components) return parsedKey;
    const parts = {};
    for (const item of selected) {
        const key = item.getInventoryKey();
        if (!readMaterialLineage(key)) continue;
        const slot = Object.keys(parsedKey.components).find(slot => parsedKey.components[slot] === item.id && !Object.hasOwn(parts, slot));
        if (slot) parts[slot] = key;
    }
    return Object.keys(parts).length ? {...parsedKey, componentLineage: parts} : parsedKey;
}

export function replaceGearComponentLineage(parsed, slot, selectedKey) {
    const parts = {...readGearComponentLineage(parsed)};
    if (readMaterialLineage(selectedKey)) parts[slot] = selectedKey;
    else delete parts[slot];
    if (Object.keys(parts).length) parsed.componentLineage = parts;
    else delete parsed.componentLineage;
}

export function recoveredGearComponent({id, quality, previous, at, world, operation, condition}) {
    if (!previous) return JSON.stringify({id, quality});
    const lineage = readMaterialLineage(previous);
    const latest = lineage.history.at(-1);
    const repeat = ['workshop.swap', 'workshop.salvage'].includes(latest.process_id);
    if (at < latest.at) throw Error('A recovered component cannot predate its last work.');
    // The first recovery retains the original full key. Subsequent events
    // refer to the immediately preceding entry in the same history and keep
    // that part's incoming grade and facts. This avoids nested JSON keys
    // growing exponentially each time the same physical part is recovered.
    const source = repeat ? JSON.stringify({id, quality: lineage.facts.quality}) : previous;
    const result = planProcessedMaterial({
        stock: {[source]: 1}, inputs: [{item_key: source, count: 1}],
        sourceFacts: repeat ? {[source]: lineage.facts} : {},
        output: {id, family: lineage.family, count: 1, quality},
        process: {id: 'workshop.' + operation, revision: repeat ? 2 : 1, at, world_id: world, parameters: {condition}}
    });
    if (!repeat) return result.item_key;
    const part = JSON.parse(result.item_key);
    part.lineage.history = [...lineage.history, ...result.lineage.history];
    if (lineage.deeds) part.lineage.deeds = lineage.deeds;
    const key = JSON.stringify(part);
    readMaterialLineage(key);
    return key;
}
