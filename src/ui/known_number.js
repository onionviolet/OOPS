// One way to show a number the character may not know (round 14 slice 5, PS130; Weibao 2026-11-15: "unknown numbers can be
// represented as question marks"). Known: the number. Estimated: "~12" for a guess near one value, or "10–14" for a range.
// Unknown: "?". The caller says what the life knows (KNW); this module only words it, so every panel reads the same way.
// UR157: an unknown mark keeps its subject and field in `title`, so the reader can ask what is not known.

import {formatDecimal} from '../number_format.js';

const plain = (n, digits) => formatDecimal(n, digits);

/**
 * The words for a number as the life knows it.
 * @param {number|null|undefined} value  the best value the life holds (the truth only when known)
 * @param {{known?: boolean, low?: number, high?: number, digits?: number}} [how]
 *   known: true (default when a finite value is given and no range); low/high: an estimated range; known:false with a
 *   value: a guess near it.
 */
export function knownNumber(value, {known, low, high, digits = 1} = {}) {
    const finite = n => typeof n === 'number' && Number.isFinite(n);
    if (finite(low) && finite(high)) return low === high ? `~${plain(low, digits)}` : `${plain(Math.min(low, high), digits)}–${plain(Math.max(low, high), digits)}`;
    if (!finite(value)) return '?';
    return known === false ? `~${plain(value, digits)}` : plain(value, digits);
}

/** A span for the number: its words, a data-known state for styling (known, estimated, unknown) and a title naming the field. */
export function knownNumberNode(value, how = {}, {field = '', doc = globalThis.document} = {}) {
    const text = knownNumber(value, how), node = doc.createElement('span');
    node.className = 'known-number'; node.textContent = text;
    node.dataset.known = text === '?' ? 'unknown' : /^[~]|–/.test(text) ? 'estimated' : 'known';
    if (field) node.title = text === '?' ? `${field}: not known yet` : node.dataset.known === 'estimated' ? `${field}: an estimate` : field;
    return node;
}
