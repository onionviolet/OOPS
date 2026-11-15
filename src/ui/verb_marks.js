// Ready now marks verbs (round 14, PS120; Weibao 2026-11-15 liked the YAIR columns mock). The actions box keeps YAIR's
// verbs in YAIR's order; a ready row whose verb is on screen puts its count on that verb ("Try to craft something · 2
// close") instead of repeating itself in a Ready now panel. Each row names its verb (src/ui/action_verbs.js; the row's own
// wins, then its source's, src/ready_rows.js); this module only counts them (AR3). A row whose verb has no row on screen
// stays in Ready now, so nothing is lost (PS129): Fang Yuan's Feed, Practise, Hand in and Patrol keep their rows until the
// frame draws those verbs.
import {collectReady} from '../ready_rows.js';

// Sources that predate row verbs. Mixing has no ACTION_VERBS id; its verb is the Village counter's own button.
const SOURCE_VERB = Object.freeze({crafting: 'craft', mixing: 'mixing'});
// Where each verb sits in the native action list (display.js create_location_choice_dropdown class names).
export const VERB_SELECTOR = Object.freeze({craft: '.choice_craft', mixing: '#village_mixing_open', talk: '.choice_dialogue', trade: '.choice_trade',
    work: '.choice_work', train: '.choice_train', gather: '.choice_gather', action: '.choice_action'});

/** The verb a ready row belongs to, or '' when neither it nor its source names one. */
export const rowVerb = row => row?.verb || SOURCE_VERB[row?.source] || '';

// Pure: the mark text for each verb with rows worth a mark. Ready first, then close; further-off rows are not marked.
export function verbMarks(rows) {
    const out = {};
    for (const verb of Object.keys(VERB_SELECTOR)) {
        const mine = rows.filter(r => rowVerb(r) === verb), ready = mine.filter(r => r.state === 'ready').length, near = mine.filter(r => r.state === 'near').length;
        const text = [ready ? `${ready} ready` : '', near ? `${near} close` : ''].filter(Boolean).join(' · ');
        if (text) out[verb] = {text, state: ready ? 'ready' : 'near'};
    }
    return out;
}

const list = () => (typeof document === 'undefined' ? null : document.getElementById('location_actions_div'));
const owner = node => !!node && !node.hidden && !node.classList.contains('none_display') && node.style.display !== 'none';
// Verbs drawn in the action list now: their rows show as the verb's mark, not as Ready now rows.
export function shownVerbs(at = list()) {
    const out = new Set();
    if (!at) return out;
    for (const [verb, selector] of Object.entries(VERB_SELECTOR)) if (owner(at.querySelector(selector))) out.add(verb);
    return out;
}
/** Pure: the rows that still belong in Ready now, given the verbs on screen. */
export const unmarkedRows = (rows, shown) => rows.filter(r => !shown.has(rowVerb(r)));

export function mountVerbMarks() {
    let signature = '';
    function render() {
        const at = list(); if (!at) return;
        let rows = []; try { rows = collectReady(); } catch { rows = []; }
        const marks = verbMarks(rows), sig = JSON.stringify(marks);
        if (sig === signature && [...at.querySelectorAll('[data-ready-mark]')].length === Object.keys(marks).length) return;
        signature = sig;
        for (const [verb, selector] of Object.entries(VERB_SELECTOR)) {
            const node = at.querySelector(selector); if (!node) continue;
            const mark = marks[verb];
            if (mark) { node.dataset.readyMark = mark.text; node.dataset.readyMarkState = mark.state; }
            else { delete node.dataset.readyMark; delete node.dataset.readyMarkState; }
        }
    }
    const timer = setInterval(render, 1000); render();
    return {render, destroy() { clearInterval(timer); }};
}
