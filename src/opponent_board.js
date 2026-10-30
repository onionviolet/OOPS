// R20 opponent board: the public projection shape the cards read (W4, NX22), and its display
// rules. Leaf module: no DOM, no game state, no truth reads.
//
// Shape: {source, opponents: [{id, slot, letter, name, knowledge, defeated,
//   health: {text, progress, knowledge}, cycle, facts: [{label, value, knowledge}]}],
//   encounter: {groupsLeft, clears}}
// knowledge per fact: 'known' | 'native' | 'partial' | 'unknown'. A missing knowledge field
// renders as unknown; missing knowledge never means all-known (NX22). 'native' is the inherited
// native readout (legacy disclosure until the knowledge round, R29), not AD8 knowledge.

import {opponentFacts} from './opponent_sheet.js';
import {observerView} from './observer_view.js';
import {readPort} from './ui_ports.js';

const UNKNOWN_TEXT = /^(?:\?+|unknown|unavailable)(?:\s|$)/i;
export const isUnknownText = value => value == null || !String(value).trim() || UNKNOWN_TEXT.test(String(value).trim());
const SHOWN = new Set(['known', 'native', 'partial']);

// Stable per-slot letters (A, B, … Z, AA, AB, …). The slot is the native defender index, which does
// not change while a wave lasts, so a defeated opponent keeps its letter (Part 2 A2, D1).
export function letterFor(slot) {
    let n = slot, out = '';
    do { out = String.fromCharCode(65 + n % 26) + out; n = Math.floor(n / 26) - 1; } while (n >= 0);
    return out;
}

// R22b (SU4): one hue per opponent kind, so "Wolf rat B" in Reports matches its row on the board.
// Kinds take hues in first-appearance (native slot) order within the wave; the board and the log
// both pass the side's names in slot order, so they agree. Letters still tell individuals apart,
// and names stay text, so color never carries the meaning alone (UR37).
export const KIND_HUES = 6;
export function kindHue(names, name) {
    const order = [...new Set(names)], at = order.indexOf(name);
    return at < 0 ? null : at % KIND_HUES;
}

// Adapter for the existing read() rows (readNativeCombatFocus). Same facts the native renderer
// already shows; marks them 'native'. Defeat comes from the shown health text ("0/20 hp").
export function projectNativeOpponents(rows = [], {groupsLeft = '', clears = ''} = {}) {
    return {source: 'native', encounter: {groupsLeft, clears}, opponents: rows.map((row, slot) => {
        const health = /^\s*(\d+(?:\.\d+)?)\s*\/\s*\d/.exec(row.hp || '');
        return {id: row.id, slot, letter: letterFor(slot), name: row.name, knowledge: 'native',
            defeated: !!health && Number(health[1]) === 0,
            health: {text: row.hp, progress: row.healthProgress ?? null, knowledge: health ? 'native' : 'unknown'},
            cycle: row.attackProgress ?? null,
            facts: viaSheet((row.facts || []).map(f => ({label: f.label, value: f.value, knowledge: isUnknownText(f.value) ? 'unknown' : 'native'})))};
    })};
}

// UR36: the card's rows come from the sheet projection at the fight's means, the same code a person met elsewhere reads through.
const viaSheet = facts => opponentFacts(facts, observerView(readPort('expansion') ?? {}));

export const factShown = fact => SHOWN.has(fact?.knowledge) && !isUnknownText(fact.value);
// What a cell shows: the value when its knowledge allows, an estimate marker for partial, ??? otherwise.
export function factText(fact) {
    if (!factShown(fact)) return '???';
    return fact.knowledge === 'partial' ? `~${fact.value}` : String(fact.value);
}
export function healthText(opponent) {
    if(opponent.ended) return 'Inspection ended · last observed';
    const h = opponent.health || {};
    if (opponent.defeated) return 'Defeated';
    return factShown({knowledge: h.knowledge, value: h.text}) ? (h.knowledge === 'partial' ? `~${h.text}` : h.text) : '??? hp';
}
// Bar fill only for a health value the player is allowed to see exactly.
export const healthFill = opponent => opponent.ended ? null : opponent.defeated ? 0 : ['known', 'native'].includes(opponent.health?.knowledge) && opponent.health.progress != null ? opponent.health.progress : null;

// Summary of what is known about one opponent, for labels and data attributes.
export function knowledgeOf(opponent) {
    const states = [opponent.health?.knowledge, ...(opponent.facts || []).map(f => f.knowledge)].map(k => k || 'unknown');
    if (states.every(k => k === 'unknown')) return 'unknown';
    if (states.every(k => k === 'native')) return 'native';
    if (states.every(k => k === 'known')) return 'known';
    return 'partial';
}
export const KNOWLEDGE_LABEL = {
    native: 'Native readout: the inherited combat display. Learning and appraisal are not yet modelled.',
    known: 'Known facts (fixture case).',
    partial: 'Partly known: ??? marks facts not yet learned; ~ marks an estimate.',
    unknown: 'Not yet assessed: no facts learned about this opponent.',
};

export function encounterCaption(board) {
    const n = board.opponents.length, down = board.opponents.filter(o => o.defeated).length, {groupsLeft, clears} = board.encounter || {};
    return [`${n} opponent${n === 1 ? '' : 's'} · inspect`, down ? `${down} defeated` : '',
        groupsLeft ? `${groupsLeft} group${groupsLeft === '1' ? '' : 's'} left` : '', clears || ''].filter(Boolean).join(' · ');
}

// Adapter for the engine lane's registry projection `combat-opponents` (schema 1, PP5; announced in
// the shared notes, not merged yet). When it merges, the workspace frame passes
// `opponents: fromCombatOpponentsProjection(domainRegistry.project('combat-opponents'), …)` and the
// board needs no other change (GU8). Its 'native-legacy' disclosure maps to 'native'; a fact with
// `known: false` maps to unknown. Schema 1 carries no attack cycle, so the cycle line stays hidden.
export function fromCombatOpponentsProjection(projection, {groupsLeft = '', clears = ''} = {}) {
    if (projection?.schema !== 1 || !projection.active) return {source: 'registry', encounter: {groupsLeft, clears}, opponents: []};
    const shown = projection.disclosure === 'native-legacy' ? 'native' : 'known';
    return {source: 'registry', encounter: {groupsLeft, clears}, opponents: projection.opponents.map(o => ({
        id: o.id || o.slot, slot: o.index, letter: letterFor(o.index), name: o.name, knowledge: shown, defeated: !!o.defeated,
        health: o.health ? {text: `${o.health.current}/${o.health.max} hp`, progress: Math.round(o.health.fraction * 1000) / 10, knowledge: shown} : {text: '', progress: null, knowledge: 'unknown'},
        cycle: null,
        facts: viaSheet((o.facts || []).map(f => ({label: f.label, value: f.known ? f.value : null, knowledge: f.known ? shown : 'unknown'}))),
    }))};
}
