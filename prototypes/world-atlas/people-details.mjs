// Bounded summaries from the PEOPLE reader schema, never raw source or knowledge prose.
import {publicLifeRow as open} from './texture-life.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const list = value => Array.isArray(value) ? value : [];
const text = (value, max = 160) => {
    if (typeof value !== 'string' || /^(?:unstated|not stated|not mentioned|none stated)$/i.test(value.trim())) return null;
    const clean = value.replace(/\s+/g, ' ').trim();
    return clean ? clean.length > max ? clean.slice(0, max - 1) + '…' : clean : null;
};
const evidence = row => ({label: ['S', 'T', 'I', 'U'].includes(row?.label) ? row.label : null,
    locator: parseLocator(row?.locator) ? row.locator.trim() : null});
export function mergePersonReaderDetails(target, row, {blockedIds = new Set()} = {}) {
    target.wants ||= []; target.reacts ||= [];
    if (!open(row)) return target;
    const add = (key, value) => {if (!target[key].some(prior => JSON.stringify(prior) === JSON.stringify(value))) target[key].push(value);};
    // Wants are strings in schema 1/1.4, so their evidence comes from their enclosing person row.
    for (const want of list(row.wants)) if (text(want)) add('wants', {what: text(want), ...evidence(row)});
    for (const reaction of list(row.reacts)) {
        if (!open(reaction) || blockedIds.has(reaction.by)) continue;
        const to = text(reaction.to), response = text(reaction.response);
        if (!to && !response) continue;
        add('reacts', {to, response, by: text(reaction.by), class: text(reaction.class, 40), responseClass: text(reaction.responseClass, 40), ...evidence(reaction)});
    }
    return target;
}
