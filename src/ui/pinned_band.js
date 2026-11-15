// The pinned band: what every page shows (play surface PS98, from Weibao 2026-11-15: "some info should be on every page").
// The status line (place, time, weather, the life's reserve, work, save) and the day strip already run on every page (B, F).
// The band adds two parts to the status line's own row, so no page gains or loses a row and the frame never moves (UR144):
//   Ready now, folded: its count and the first row, with the rest one press away in a popover. On Here, where the Ready now
//     panel shows in full, the folded part steps aside. On a feature page, rows from that same feature are left out (PS102):
//     Crafting's own list already says what it can make.
//   This place, folded: the place's people, services and ways out as counts, from Around you's own summary (AR3). It
//     steps aside while Around you shows; pressing it returns to Here.
// Dial: the player pins or unpins each part (status line, day strip, Ready now, Doing now, This place) from the Pin menu at
// the row's end. Default: all pinned. Kept per browser (a view preference, not part of the save). Reason: what the life
// needs next and what it is doing should not vanish when a tab opens.
import {collectReady} from '../ready_rows.js';
import {hubModel} from './ready_hub.js';
import {centerModes} from '../center_modes.js';
import {shownVerbs, unmarkedRows} from './verb_marks.js';

export const BAND_PARTS = Object.freeze([['status', 'Status line'], ['strip', 'Day strip'], ['ready', 'Ready now'], ['doing', 'Doing now'], ['place', 'This place']]);
const KEY = 'yairpg.pinned-band.v1';
// Which ready sources a centre view already lists in full (PS102). A page not named here leaves every row in.
export const PAGE_SOURCES = Object.freeze({crafting: ['crafting'], mixing: ['mixing']});

export function readPins(storage = globalThis.localStorage) {
    const pins = Object.fromEntries(BAND_PARTS.map(([id]) => [id, true]));
    try { const saved = JSON.parse(storage?.getItem(KEY) || '{}'); for (const [id] of BAND_PARTS) if (typeof saved[id] === 'boolean') pins[id] = saved[id]; } catch { /* defaults */ }
    return pins;
}
function writePins(pins, storage = globalThis.localStorage) { try { storage?.setItem(KEY, JSON.stringify(pins)); } catch { /* the band still works this session */ } }

// Pure: the folded Ready now line for a page. `page` is the open centre view's mode ('' on Here).
export function bandReady(rows, page = '') {
    const skip = new Set(PAGE_SOURCES[page] || []);
    const kept = rows.filter(r => !skip.has(r.source)), here = rows.length - kept.length;
    const model = hubModel(kept, {expanded: true});
    const first = model.shown[0] || null;
    const count = [model.counts.ready ? `${model.counts.ready} ready` : '', model.counts.near ? `${model.counts.near} close` : ''].filter(Boolean).join(' · ');
    return {empty: model.empty, head: count ? `Ready now · ${count}` : 'Ready now', first, rows: model.shown, here};
}

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

export function mountPinnedBand({status = () => document.getElementById('game_status'), spine = () => document.getElementById('game_spine')} = {}) {
    let pins = readPins();
    const ready = el('span', 'pinned-band__ready'); ready.dataset.statusSlot = 'band-ready'; ready.dataset.bandPart = 'ready';
    const readyHead = el('button', 'pinned-band__ready-head'); readyHead.type = 'button'; readyHead.setAttribute('aria-haspopup', 'true');
    const readyFirst = el('button', 'pinned-band__ready-first'); readyFirst.type = 'button';
    const list = el('div', 'pinned-band__list'); list.id = 'pinned_band_ready_list'; list.setAttribute('popover', ''); list.setAttribute('aria-label', 'Ready now');
    readyHead.setAttribute('popovertarget', list.id);
    ready.append(readyHead, readyFirst);
    const place = el('button', 'pinned-band__place'); place.type = 'button'; place.dataset.statusSlot = 'band-place'; place.dataset.bandPart = 'place';
    place.title = 'This place. Opens Here, with the people, services and ways out.';
    place.onclick = () => { try { centerModes().showHere(); } catch { /* Here is already open */ } };
    const pinMenu = el('details', 'pinned-band__pins'); pinMenu.dataset.statusSlot = 'band-pins';
    const pinSummary = el('summary', '', 'Pin'); pinSummary.title = 'Choose what stays on every page';
    const pinBox = el('div', 'pinned-band__pin-list'); pinMenu.append(pinSummary, pinBox);
    for (const [id, label] of BAND_PARTS) {
        const row = el('label'), box = el('input'); box.type = 'checkbox'; box.checked = pins[id]; box.dataset.pin = id;
        box.onchange = () => { pins = {...pins, [id]: box.checked}; writePins(pins); apply(); render(); };
        row.append(box, document.createTextNode(` ${label}`)); pinBox.append(row);
    }
    const act = r => { try { if (r.state === 'ready' && r.act) r.act(); else if (r.open) r.open(); else centerModes().showHere(); } catch { /* the owner's own line says what went wrong */ } };
    const rowButton = r => {
        const b = el('button', `pinned-band__row pinned-band__row--${r.state}`); b.type = 'button';
        b.append(el('span', '', r.label), el('small', '', r.state === 'near' ? r.gap || '' : r.detail || ''));
        b.onclick = () => { list.hidePopover?.(); act(r); }; return b;
    };
    function apply() {
        const s = spine(); if (!s) return;
        const off = BAND_PARTS.filter(([id]) => !pins[id]).map(([id]) => id).join(' ');
        if ((s.dataset.unpinned || '') !== off) { if (off) s.dataset.unpinned = off; else delete s.dataset.unpinned; }
    }
    let signature = '';
    function render() {
        const line = status(); if (!line) return;
        // Into the status line's own row, after the work slot and before the save state; the Pin menu closes the row.
        const save = line.querySelector('[data-status-slot="save"]');
        if (ready.parentElement !== line) line.insertBefore(ready, save);
        if (place.parentElement !== line) line.insertBefore(place, save);
        if (pinMenu.parentElement !== line) line.append(pinMenu);
        if (list.parentElement !== document.body) document.body.append(list);
        apply();
        const root = document.getElementById('main_content'), page = root?.dataset.centerTask || '';
        // Ready now: steps aside where its full panel shows (Here).
        const panelShows = !!document.getElementById('ready_hub')?.checkVisibility?.();
        let model = {empty: true, rows: [], head: '', first: null, here: 0};
        // PS120: on Here, rows already marked on their verb are not repeated in the band.
        try { const shown = page ? new Set() : shownVerbs(); model = bandReady(unmarkedRows(collectReady(), shown), page); } catch { /* a source mid-load shows nothing */ }
        ready.hidden = !pins.ready || panelShows || model.empty;
        const sig = JSON.stringify([model.head, model.rows.map(r => [r.key, r.label, r.state, r.gap, r.detail])]);
        if (!ready.hidden && sig !== signature && !list.matches?.(':popover-open')) {
            signature = sig;
            readyHead.textContent = model.head;
            readyHead.title = `${model.head}. Shows the list.${model.here ? ` ${model.here} more are on this page.` : ''}`;
            readyFirst.textContent = model.first ? (model.first.state === 'near' && model.first.gap ? `${model.first.label} (${model.first.gap})` : model.first.label) : '';
            readyFirst.hidden = !model.first;
            readyFirst.title = model.first ? (model.first.state === 'ready' && model.first.act ? `${model.first.label}. Does it now.` : `${model.first.label}. Opens where it is done.`) : '';
            readyFirst.onclick = () => model.first && act(model.first);
            list.replaceChildren(el('p', 'pinned-band__list-head', model.head), ...model.rows.map(rowButton));
        }
        // This place: steps aside while Around you shows.
        const around = document.querySelector('.nearby-context-view');
        const name = around?.dataset.place || '', summary = around?.dataset.placeSummary || '';
        // With nothing to count, the status line's place name already says it all.
        place.hidden = !pins.place || !!around?.checkVisibility?.() || !summary;
        const words = `This place: ${summary}`;
        if (!place.hidden && place.textContent !== words) place.textContent = words;
    }
    // Escape closes the popover only; it must not also reach the centre view's Back (Esc) under it.
    list.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); list.hidePopover?.(); readyHead.focus(); } });
    readyHead.addEventListener('keydown', e => { if (e.key === 'Escape' && list.matches?.(':popover-open')) { e.stopPropagation(); list.hidePopover?.(); } });
    // The popover opens under its button.
    list.addEventListener('toggle', e => {
        if (e.newState !== 'open') return;
        const r = readyHead.getBoundingClientRect();
        list.style.setProperty('--band-top', `${Math.round(r.bottom)}px`); list.style.setProperty('--band-left', `${Math.round(r.left)}px`);
    });
    const timer = setInterval(render, 1000);
    document.addEventListener('workspace-presentation-change', () => setTimeout(render));
    render();
    return {render, destroy() { clearInterval(timer); ready.remove(); place.remove(); pinMenu.remove(); list.remove(); }};
}
