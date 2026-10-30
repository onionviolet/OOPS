// Crossing threshold (RPX20; WER3, WER9; proposal 2026-10-30): before an irreversible crossing, a start's
// answers sorted into what crosses with you, what stays behind, what pauses or ends, and what waits on the
// far side. Built on scene_card.js; the carry list goes between the stakes line and the choices. Holds no
// world's names: the caller supplies places, answers and hooks, so any world's start can use it.
import {renderSceneCard, sceneHeaderText} from './scene_card.js';

// view = {
//   kind, id, attrs,                          // card hooks (game-owned data-* names come from the caller)
//   lead, from, to, title, era,               // header: "Before you cross · Village → Far City · Clerk · 1349"
//   method: 'crossing'|'in_person'|...,       // in person, your own body and speech cross too
//   returnable, independent,                  // old life pauses (true) or ends (false); independent = a new life
//   stakes,                                   // optional: the host's own wording overrides the default line
//   answers: [[question, answer]],            // the WER3 answers, shown whole and once each
//   rowAttrs: question => ({...}),            // optional data-* per answer row
//   options: scene options (confirm, back)    // passed to the scene card untouched
// }
export const CARRY_GROUPS = Object.freeze([
    {id: 'crosses', label: 'Crosses with you'},
    {id: 'held', label: 'Stays behind'},
    {id: 'pauses', label: 'Pauses', ends: 'Ends here'},
    {id: 'far', label: 'Waiting on the far side'},
    {id: 'other', label: 'Also'},
]);
// Grouped by the WER3 question, never by parsing the answer text. Unknown questions land in "Also",
// so a world that adds a question never loses it.
const GROUP_OF = Object.freeze({
    'Memories': 'crosses', 'Base cheat': 'crosses', 'Money and items': 'held', 'Your old life': 'pauses',
    'Body': 'far', 'Name and papers': 'far', 'Language': 'far', 'Who notices': 'far', 'What you owe': 'far',
});
const IN_PERSON = new Set(['Body', 'Language']);

export function carryGroups(view) {
    const groups = CARRY_GROUPS.map(g => ({id: g.id, label: g.id === 'pauses' && !view.returnable ? g.ends : g.label, rows: []}));
    for (const [question, answer] of view.answers || []) {
        const id = view.independent ? 'other' : view.method === 'in_person' && IN_PERSON.has(question) ? 'crosses' : GROUP_OF[question] || 'other';
        groups.find(g => g.id === id).rows.push({question, answer});
    }
    if (view.independent) groups.find(g => g.id === 'other').label = 'How it begins';
    return groups.filter(g => g.rows.length);
}

export function thresholdScene(view) {
    const from = view.from || 'Your current life';
    const stakes = view.stakes || (view.independent ? 'A separate life begins.'
        : `Only what is listed under "Crosses with you" goes along. Your ${from} life ${view.returnable ? 'pauses where you left it and can be resumed' : 'stops here, with no way back yet'}.`);
    return {kind: view.kind || 'crossing-threshold', id: view.id, attrs: view.attrs,
        header: {lead: view.lead || (view.independent ? 'New life' : 'Before you cross'), place: view.to ? `${view.from || 'Here'} → ${view.to}` : '', title: view.title, time: view.era},
        stakes, options: view.options || []};
}

// UR37 text form: the same facts as the card, one line each.
export function thresholdText(view) {
    const scene = thresholdScene(view), lines = [sceneHeaderText(scene.header), scene.stakes];
    for (const g of carryGroups(view)) lines.push(`${g.label}:`, ...g.rows.map(r => `- ${r.question}. ${r.answer}`));
    for (const o of scene.options) lines.push(`[${o.label}]${o.blocked ? ` unavailable: ${o.blocked}` : ''}`);
    return lines.join('\n');
}

export function renderCrossingThreshold(host, view, hooks = {}) {
    const card = renderSceneCard(host, thresholdScene(view), hooks);
    const doc = host.ownerDocument || globalThis.document;
    const make = (tag, className, text) => { const n = doc.createElement(tag); if (className) n.className = className; if (text) n.textContent = text; return n; };
    const list = make('div', 'crossing-carry');
    for (const g of carryGroups(view)) {
        const section = make('section', 'crossing-carry-group');
        section.dataset.carryGroup = g.id;
        section.append(make('h3', 'crossing-carry-label', g.label));
        for (const r of g.rows) {
            const row = make('p', 'crossing-carry-row');
            row.append(make('strong', '', `${r.question}. `), r.answer);
            Object.assign(row.dataset, view.rowAttrs?.(r.question) || {});
            section.append(row);
        }
        list.append(section);
    }
    const firstOption = [...card.children].find(n => n.className === 'scene-card-option') || null;
    card.insertBefore(list, firstOption);
    return card;
}
