import {labelControl} from './ui/panel_sections.js';
// Local prototype adapter for HTP49 (proposal 2026-10-23). Registers the
// `rankGapObserver` save slice and a "Watch a working" panel, shown only while the
// player stands in the Goa branch. Reads the player through ui_ports; edits no
// other owner except spending stamina on the hero's own stat. main.js is not
// touched: this module is pulled in from ui_extras.js (one import line).
import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node} from './reference_kit.js';
import {PARADISE_IDS, PARADISE_KEYS} from './book_world_paradise_ids.js';
import {SUBJECTS, MEANS, defaultSlice, loadSlice, previewWatch, commitWatch, observerView, dialValues, perceive, watchCost} from './rank_gap_observer.js';

let slice = defaultSlice(), lastText = '', meansId = 'sight', panel = null, render = null, host = null, settling = false;
// Optional main.js host seam (see HTP49 report): settle({minutes, stamina}) advances the world clock
// through advanceChroniclePlan, spends native stamina through plan.native.staminaToFull, persists, and
// ticks registry domains. Without it, the fallback below edits the hero stat directly and moves only the local clock.
export function configureRankGap(h) { host = h && typeof h.settle === 'function' ? h : null; }
const DUTY_COPY = 'Goa duty copy';

const inGoa = () => readPort('expansion')?.actors?.player?.worldId === PARADISE_IDS.goa;
function watchContext() {
    const exp = readPort('expansion'), ch = readPort('character');
    const items = {};
    try { for (const [k, n] of Object.entries(ch?.getItems?.() || {})) if (k === PARADISE_KEYS.proof) items[DUTY_COPY] = n.count ?? n; } catch { /* absent inventory reads as none */ }
    const facts = {...(exp?.actors?.player?.facts || {})};
    if (slice.earned.soulWard) facts['book.paradise.soulWard'] = true;
    const stamina = ch?.getFullStats?.().stamina ?? 0;
    // Authored: the player's tier in this branch is civilian (0); credentials are means, not rank.
    return {observerTier: 0, stamina, items, facts};
}
export function watchPreview(subjectId, means = meansId) { return previewWatch(slice, watchContext(), {subjectId, meansId: means}); }
export function watch(subjectId, means = meansId) {
    const ctx = watchContext(), r = commitWatch(slice, ctx, {subjectId, meansId: means});
    if (!r.ok) { lastText = r.reasons[0] || 'You cannot watch that now.'; render?.(true); return r; }
    const before = slice, cost = r.result.stamina;
    slice = r.slice; // commitWatch already moved slice.clock by watchMinutes, once
    if (host) {
        settling = true; // the world-clock tick this settlement triggers must not add the same minutes again
        try { host.settle({minutes: dialValues().watchMinutes, stamina: cost}); }
        catch (e) { slice = before; lastText = e?.message || 'You cannot watch that now.'; render?.(true); return {ok: false, reasons: [lastText], slice}; }
        finally { settling = false; }
    } else {
        const stats = readPort('character')?.getFullStats?.();
        if (!stats || stats.stamina < cost) { slice = before; lastText = 'Too tired to hold attention.'; render?.(true); return {ok: false, reasons: [lastText], slice}; }
        stats.stamina -= cost; // fallback only: nothing here persists or settles this through the native owner
    }
    lastText = r.result.text + (r.verb === 'glimpse' ? ' (strain +' + r.result.harm + ')' : '');
    if (slice.earned.soulWard && r.verb === 'glimpse') lastText += ' Your sight has hardened; warded sight can now feel a crystal bearer.';
    render?.(true); return r;
}
// Public quote: exact cost only when the means already resolves the subject; otherwise a range, so the
// price never reveals the unresolved verb or tier. The gate inside previewWatch still uses the true cost.
export function publicQuote(subjectId, means = meansId) {
    const ctx = watchContext(), p = previewWatch(slice, ctx, {subjectId, meansId: means}), d = dialValues();
    const exact = perceive(ctx.observerTier, subjectId, means).resolved, lo = watchCost('witness', d), hi = watchCost('glimpse', d);
    return {eligible: p.eligible, reasons: p.reasons, minutes: p.minutes, stamina: exact ? p.costs.stamina : (lo === hi ? lo : `${lo} to ${hi}`)};
}

const view = () => {
    if (!inGoa()) return {here: false};
    const o = slice.observers.player, ctx = watchContext();
    return {here: true, means: meansId, clock: slice.clock, strain: o ? Math.round(o.strain * 100) / 100 : 0,
        closed: !!(o && o.closedUntil != null && slice.clock < o.closedUntil), ward: !!slice.earned.soulWard,
        subjects: Object.entries(SUBJECTS).map(([id, s]) => ({id, label: s.label, preview: publicQuote(id)})),
        seen: observerView(slice), lastText, availability: Object.fromEntries(Object.keys(MEANS).map(m => [m, previewWatch(slice, ctx, {subjectId: 'book.paradise.mia', meansId: m}).reasons.filter(x => /Needs/.test(x)).length === 0]))};
};

function createPanel() {
    const root = node('section', null, {id: 'rank_gap_observer_panel', class: 'reference-panel expedition_panel'});
    root.dataset.surfaceType = 'reference';
    const status = node('p', ''), select = node('select', null, {'aria-label': 'Way of watching'}), rows = node('ul', null, {'aria-label': 'Who you can watch'}),
        said = node('p', '', {role: 'status', id: 'rank_gap_said'}), seen = node('ul', null, {'aria-label': 'What you have made out'});
    for (const m of Object.values(MEANS)) select.append(node('option', m.label, {value: m.id}));
    select.onchange = () => { meansId = select.value; render(true); };
    root.append(node('h2', 'Watch a working'), node('p', `Each watch takes ${dialValues().watchMinutes} minutes and some stamina. Looking at someone far above you can hurt; what you make out depends on how you look.`), labelControl(select, 'Way of watching'), status, rows, said, seen);
    render = force => {
        // Not gated on visibility: a collapsed panel must still hold the current sightings when it is opened.
        const v = view(); if (!v.here) return;
        select.value = v.means;
        status.textContent = `Watch clock ${v.clock} min · strain ${v.strain}${v.closed ? ' · sight dazzled' : ''}${v.ward ? ' · warded sight earned' : ''}`;
        rows.replaceChildren(...v.subjects.map(s => {
            const li = node('li'), b = node('button', `Watch ${s.label}`, {type: 'button', 'data-subject': s.id});
            b.disabled = !s.preview.eligible; if (!s.preview.eligible) b.title = s.preview.reasons[0] || '';
            b.onclick = () => watch(s.id);
            li.append(b, node('span', s.preview.eligible ? ` (${s.preview.minutes} min, ${s.preview.stamina} stamina)` : ` ${s.preview.reasons[0] || ''}`)); return li;
        }));
        said.textContent = v.lastText;
        seen.replaceChildren(...v.seen.map(x => node('li', `${x.subject}: ${x.verb}${x.tier ? ` · ${x.tier}` : ' · tier not made out'}`)));
    };
    whenPortsReady(() => render(true));
    definePanel({id: 'rank_gap_observer', title: 'Watch a working', role: 'records', node: root, home: document.getElementById('main_content'),
        discovered: inGoa, eligible: inGoa, emptyText: 'Visit the Goa branch to watch workings'});
    return root;
}

const valid = s => s === undefined || (s && s.version === 1 && Number.isFinite(s.clock) && s.observers && typeof s.observers === 'object');
registerDomain({
    id: 'rankGapObserver',
    initialState: () => defaultSlice(),
    // Omitted until used, so a fresh or legacy save carries no new field.
    save: () => (slice.clock || Object.keys(slice.observers).length || Object.keys(slice.earned).length) ? structuredClone(slice) : undefined,
    validate: s => { if (!valid(s)) throw Error('Invalid rankGapObserver slice.'); },
    load: s => { slice = loadSlice(s); lastText = ''; },
    tick: minutes => { if (!settling && minutes > 0 && (Object.keys(slice.observers).length)) slice = {...slice, clock: slice.clock + minutes}; },
    refresh: () => render?.(false),
    projection: name => name === 'slice' ? structuredClone(slice) : name === 'view' ? view() : undefined,
    commands: {watch: {run: watch, preview: publicQuote}},
    panels: [() => { panel = createPanel(); }],
});
