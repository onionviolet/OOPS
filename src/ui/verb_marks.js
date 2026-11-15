// Ready now marks verbs (round 14, PS120; Weibao 2026-11-15 liked the YAIR columns mock). The actions box keeps YAIR's
// verbs in YAIR's order; a feature whose ready rows belong to one verb puts its count on that verb ("Try to craft
// something · 2 close") instead of repeating the rows in a Ready now panel. The rows still come from each owner through
// the ready registry (AR3); this module only counts them. A source with no verb on screen keeps its rows in the Ready
// now panel, so nothing is lost (PS129): Fang Yuan's day keeps its list until its acts become verbs (feature-ui, PS120).
import {collectReady} from '../ready_rows.js';

// Which verb a ready source belongs to. Selectors find the verb in the native action list.
export const VERB_FOR_SOURCE = Object.freeze({crafting: '.choice_craft', mixing: '#village_mixing_open'});

// Pure: the mark text for each source with rows worth a mark. Ready first, then close; further-off rows are not marked.
export function verbMarks(rows) {
    const out = {};
    for (const source of Object.keys(VERB_FOR_SOURCE)) {
        const mine = rows.filter(r => r.source === source), ready = mine.filter(r => r.state === 'ready').length, near = mine.filter(r => r.state === 'near').length;
        const text = [ready ? `${ready} ready` : '', near ? `${near} close` : ''].filter(Boolean).join(' · ');
        if (text) out[source] = {text, state: ready ? 'ready' : 'near'};
    }
    return out;
}

const list = () => document.getElementById('location_actions_div');
const owner = hidden => node => !!node && !node.hidden && !node.classList.contains('none_display') && node.style.display !== 'none' && !hidden(node);
// Sources whose verb is in the action list now: their rows show as the verb's mark, not as Ready now rows.
export function markedSources({hidden = () => false} = {}) {
    const at = list(), shown = owner(hidden), out = new Set();
    if (!at) return out;
    for (const [source, selector] of Object.entries(VERB_FOR_SOURCE)) if (shown(at.querySelector(selector))) out.add(source);
    return out;
}

export function mountVerbMarks() {
    let signature = '';
    function render() {
        const at = list(); if (!at) return;
        let rows = []; try { rows = collectReady(); } catch { rows = []; }
        const marks = verbMarks(rows), sig = JSON.stringify(marks);
        if (sig === signature && [...at.querySelectorAll('[data-ready-mark]')].length === Object.keys(marks).length) return;
        signature = sig;
        for (const [source, selector] of Object.entries(VERB_FOR_SOURCE)) {
            const verb = at.querySelector(selector); if (!verb) continue;
            const mark = marks[source];
            if (mark) { verb.dataset.readyMark = mark.text; verb.dataset.readyMarkState = mark.state; }
            else { delete verb.dataset.readyMark; delete verb.dataset.readyMarkState; }
        }
    }
    const timer = setInterval(render, 1000); render();
    return {render, destroy() { clearInterval(timer); }};
}
