import {registerDomain} from './domain_registry.js';
import {todayDigest} from './today_strip.js';
import {minutesText, plural} from './reference_kit.js';
import {sayReason} from './locked_control.js';

// COV11 / UR11: the Reports column is 500 px wide and held three lines for the first hour. Until the log
// has LOG_TAKES_OVER lines it also shows what to do next and what the day offers, then the log has the column
// to itself. It reads the Next step card and the Today reader; it owns no state and writes no report (RPT8).
export const LOG_TAKES_OVER = 8;
export const EMPTY_NOTE_UNTIL = 2;

// M2: the last lines of the log travel with the save, so a sitting opens on where the last one left off and not on
// an empty column. Plain text only, kept per world so one life never shows another's lines. A save without the
// slice loads as before (no earlier lines); nothing reads these lines but this column.
export const TAIL_LINES = 24;
export const tailOf = (lines, world) => { const kept = lines.map(l => String(l || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(-TAIL_LINES); return kept.length ? {world, lines: kept} : undefined; };
export const tailFor = (slice, world) => (slice && slice.world === world && Array.isArray(slice.lines) ? slice.lines.filter(l => typeof l === 'string').slice(-TAIL_LINES) : []);
let restored = null, showEarlier = () => {};
const worldNow = () => (typeof document === 'undefined' ? 'native' : document.documentElement.dataset.world || 'native');
// What the player read: the line as shown, without its buttons or the spoken-aloud copy.
const visibleLine = n => [...n.querySelectorAll('button')].reduce((text, b) => text.replace(b.innerText || b.textContent, ''), n.innerText ?? n.textContent);
const saveTail = () => { if (typeof document === 'undefined') return undefined; const stream = document.getElementById('message_box_div'); return stream ? tailOf([...stream.children].filter(n => !n.classList.contains('report-earlier-head')).map(visibleLine), worldNow()) : undefined; };

// Pure: the rows the card shows, or none once the log has enough lines of its own.
// UIC146: where the place header already shows the date and hour, the card keeps only the day's note.
export function dockRows({logLines, next, today, headerHasClock = false}) {
    // The next step stays here once the log fills: sending it back under the top strip pushed every panel down (UR144).
    const rows = [];
    if (next) rows.push({kind: 'next', label: 'Next step', text: next.line, hint: next.how});
    if (logLines >= LOG_TAKES_OVER) return rows;
    if (today) {
        if (!headerHasClock) rows.push({kind: 'clock', label: 'Now', text: `${today.clock}${today.place ? ` at ${today.place}` : ''}${today.note ? ` · ${today.note}` : ''}`});
        else if (today.note) rows.push({kind: 'clock', label: 'Today', text: today.note});
        if (today.open.length) rows.push({kind: 'open', label: 'Open here', text: today.open.slice(0, 4).join(', ')});
        for (const row of (today.later || []).slice(0, 4)) rows.push({kind: 'later', label: row.name, text: row.detail});
        if (today.running.count) rows.push({kind: 'running', label: 'Running', text: `${plural(today.running.count, 'commitment')}${today.running.nextIn != null ? `, the next ends in ${minutesText(today.running.nextIn)}` : ''}`});
    }
    return rows;
}

function mount() {
    const log = document.getElementById('message_log_div'), stream = document.getElementById('message_box_div');
    if (!log || !stream || document.getElementById('reports_dock')) return;
    const card = document.createElement('section');
    card.id = 'reports_dock'; card.setAttribute('aria-label', 'Right now'); card.hidden = true;
    log.insertBefore(card, stream);
    // M2: a log starts each sitting empty. Until it has a few lines of its own, one line under it says what it is for.
    const empty = document.createElement('p');
    empty.id = 'reports_empty'; empty.className = 'ui-empty-note';
    empty.textContent = 'Nothing has happened yet this sitting. What you do, find, win, lose and hear is written here as it happens, newest at the bottom.';
    log.insertBefore(empty, stream);
    showEarlier = () => {
        for (const old of stream.querySelectorAll('.report-earlier')) old.remove();
        const lines = tailFor(restored, worldNow());
        if (!lines.length) return;
        const head = document.createElement('div'); head.className = 'report-earlier report-earlier-head'; head.textContent = 'Earlier';
        stream.prepend(head, ...lines.map(text => { const line = document.createElement('div'); line.className = 'report-earlier'; line.textContent = text; return line; }));
        stream.scrollTop = stream.scrollHeight;
    };
    showEarlier();
    let signature = '';
    const render = () => {
        const nextCard = document.getElementById('next_step');
        // OPN8: the card follows the Village life; off-Village worlds show nothing until its own timer catches up.
        const village = (document.documentElement.dataset.world || 'native') === 'native';
        const next = village && nextCard && !nextCard.hidden ? {line: nextCard.querySelector('span')?.textContent || '', how: nextCard.querySelector('small')?.textContent || ''} : null;
        let today = null; try { today = todayDigest(); } catch { today = null; }
        const fresh = stream.querySelectorAll(':scope > :not(.report-earlier)').length;
        empty.hidden = stream.children.length > EMPTY_NOTE_UNTIL;
        const rows = dockRows({logLines: fresh, next, today, headerHasClock: village && !!document.querySelector('#village_scene .scene-calendar')?.offsetParent});
        // The banner under the top strip moves here while a next step exists, so the frame below it never shifts.
        if (nextCard) nextCard.style.display = rows.some(r => r.kind === 'next') ? 'none' : '';
        const key = JSON.stringify(rows);
        if (key === signature) return;
        signature = key; card.hidden = !rows.length; card.replaceChildren();
        if (!rows.length) return;
        const title = document.createElement('strong'); title.textContent = 'Right now'; card.append(title);
        for (const row of rows) {
            const line = document.createElement('p'); line.dataset.dockRow = row.kind;
            const label = document.createElement('b'); label.textContent = `${row.label}: `; line.append(label, row.text);
            if (row.hint) { const hint = document.createElement('small'); hint.textContent = row.hint; line.append(document.createElement('br'), hint); }
            card.append(line);
            if (row.kind === 'next') {
                const show = document.createElement('button'); show.type = 'button'; show.textContent = 'Show me';
                show.setAttribute('aria-label', `Show me: ${row.text}`);
                show.onclick = () => { nextCard?.querySelector('button')?.click(); const said = document.getElementById('ui_locked_reason'); if (said?.textContent) sayReason(show, said.textContent); };
                card.append(show);
            }
        }
    };
    render();
    setInterval(render, 1000);
    // AT25: a timer alone left the Now line stale after a 1440-minute step (timers are throttled in a hidden or
    // headless page). Any change to the log, or the page coming back into view, repaints at once.
    new MutationObserver(render).observe(stream, {childList: true});
    document.addEventListener('visibilitychange', render);
}

registerDomain({id: 'reports_dock', deps: [], initialState: () => null, save: saveTail, load: slice => { restored = slice || null; showEarlier(); }, panels: [() => { mount(); }]});
