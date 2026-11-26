// Bounded reader paraphrases, never source text or private knowledge records.
import {publicLifeRow as open} from './texture-life.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const text = value => typeof value === 'string' && value.trim() && !/^(unstated|not stated|not mentioned|none stated)$/i.test(value.trim())
    ? value.trim().replace(/\s+/g, ' ').slice(0, 160) : null;
const list = value => (Array.isArray(value) ? value : [value]).map(text).filter(Boolean);
export function sourceEvidence(row) {
    const label = /^[STIU]$/.test(row?.label) ? row.label : null;
    const locator = parseLocator(row?.locator) ? row.locator.trim() : null;
    return label || locator ? [{label, locator}] : [];
}
export function appendEvidence(target, rows) {
    target.sources ||= [];
    for (const row of rows) if (!target.sources.some(s => s.label === row.label && s.locator === row.locator)) target.sources.push(row);
}
export function acquisitionDetails(row) {
    if (!open(row)) return null;
    const details = Object.fromEntries(['teacher', 'time', 'practice', 'progressSign', 'failure', 'ceiling', 'label', 'locator']
        .map(key => [key, text(row[key])]).filter(([, value]) => value));
    // Older reader digests used a scalar; preserve it without inventing a list entry.
    const prerequisites = Array.isArray(row.prerequisites) ? list(row.prerequisites) : text(row.prerequisites);
    if (prerequisites?.length) details.prerequisites = prerequisites;
    return Object.keys(details).length ? details : null;
}
export function resetDetails(row) {
    if (!open(row)) return [];
    const evidence = sourceEvidence(row)[0];
    // Require a qualified trigger before admitting reset mechanics. The contract's
    // remembers list names private knowledge holders and stays outside this record.
    const trigger = text(row.trigger);
    if (!trigger || !evidence?.label || !evidence.locator) return [];
    const details = {trigger, ...evidence};
    for (const key of ['span', 'ends']) if (text(row[key])) details[key] = text(row[key]);
    for (const key of ['resets', 'keeps']) if (list(row[key]).length) details[key] = list(row[key]);
    return [details];
}
