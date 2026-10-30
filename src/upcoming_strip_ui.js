// SUI7, TC12 (2026-10-30): the upcoming strip. A short list of words in the time region (under the place view's calendar line),
// soonest first: "text · when". World-neutral (AD46): a world registers a source that returns the bridge's rows
// ({id, kind, text, when}); this file knows no world, kind or id. No source, or no rows, and the strip is hidden
// with no placeholder (a world without curfews or gatherings shows nothing). Words, not a circle (UR79).
import {registerDomain} from './domain_registry.js';

const sources = [];
export function registerUpcomingSource(fn) { sources.push(fn); return () => { const i = sources.indexOf(fn); if (i >= 0) sources.splice(i, 1); }; }

// Pure: the rows every source gives, soonest first by the bridge's own order, at most `limit`, each once.
export function stripChips(read = sources, limit = 3) {
    const rows = [], seen = new Set();
    for (const source of read) {
        let got; try { got = source(); } catch { got = null; }
        for (const r of Array.isArray(got) ? got : []) {
            if (!r || typeof r.text !== 'string' || !r.text || typeof r.when !== 'string' || seen.has(r.id)) continue;
            seen.add(r.id);
            rows.push({id: String(r.id), kind: String(r.kind || ''), text: r.text, when: r.when, startsIn: Number.isFinite(r.startsIn) ? r.startsIn : 0});
        }
    }
    return rows.sort((a, b) => a.startsIn - b.startsIn).slice(0, limit);
}

let root = null, list = null, signature = '';
// The strip owns its node; the place view (the time region the player sees, under the calendar line) mounts it (UR8).
export function upcomingStripNode() {
    if (root) return root;
    root = document.createElement('section'); root.id = 'upcoming_strip'; root.hidden = true;
    root.dataset.surfaceType = 'obligations';
    root.setAttribute('aria-label', 'Coming up');
    const heading = document.createElement('strong'); heading.textContent = 'Coming up';
    list = document.createElement('ul');
    root.append(heading, list);
    return root;
}
export function renderUpcomingStrip() {
    if (!root) return;
    const chips = stripChips();
    const next = JSON.stringify(chips.map(c => [c.id, c.text, c.when]));
    if (next === signature) return;
    signature = next;
    root.hidden = !chips.length;
    list.replaceChildren(...chips.map(c => {
        const li = document.createElement('li'); li.dataset.upcoming = c.id;
        const when = document.createElement('span'); when.className = 'upcoming-when'; when.textContent = c.when;
        li.append(c.text, ' · ', when);
        return li;
    }));
}
registerDomain({id: 'upcoming-strip', deps: [], initialState: () => null, refresh: renderUpcomingStrip, panels: [() => renderUpcomingStrip()]});
