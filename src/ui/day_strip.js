// Day strip (UI direction F, a proposal built as an adjustable default): a thin band of today's hours at the
// top of the centre. A "now" mark, small marks where something was written to Reports today, and, ahead of
// now, what is already set to happen (work under way with its end, a plan a life exposes). Time is what this
// game spends, so an idle day reads at a glance.
//
// Pure view. It stores nothing in the save: the marks live in this sitting only (the Reports log itself starts
// each sitting empty, RPT8), and the one preference (shown or hidden) is a per-browser display setting.
// Clock: it reads the world's calendar (resolveWorldCalendar, TMR1) and never computes a day from a raw clock.
// Sources, all existing: world_calendar.js resolveWorldCalendar, the ui_ports 'expansion' and 'gameTime' readers
// (the same the Today tab reads), and the Reports stream. A world with no known calendar hides the strip; the
// place header already says "Calendar unknown here", so saying it twice would repeat one fact.
import {resolveWorldCalendar} from '../world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../world_calendar_content.js';
import {readPort} from '../ui_ports.js';
import {registerPanelSettings, getDisplaySetting, subscribeDisplaySettings} from '../display_settings.js';
import {CONTROLLED_ACTOR_ID} from '../observer_view.js';

const DEFAULT_UNITS = Object.freeze({minutesPerHour: 60, hoursPerDay: 24});
const TEXT_MAX = 90;
const clean = text => String(text ?? '').replace(/\s+/g, ' ').trim();
const clip = text => { const t = clean(text); return t.length > TEXT_MAX ? `${t.slice(0, TEXT_MAX - 1).trimEnd()}…` : t; };
const isDivider = text => /^\[ .* \]$/.test(clean(text));
const clamp01 = n => Math.min(1, Math.max(0, n));

// Plain hour words: the hour number only. A world calendar names no parts of the day in this slice, so none are invented.
export const hourWords = (minute, units = DEFAULT_UNITS) => String(Math.floor(minute / units.minutesPerHour) % units.hoursPerDay);

export function unitsOf(calendar) {
    const profile = Object.values(WORLD_CALENDAR_PROFILES).find(p => p.id === calendar?.profileId);
    const u = profile?.units;
    return u && u.minutesPerHour > 0 && u.hoursPerDay > 0 ? {minutesPerHour: u.minutesPerHour, hoursPerDay: u.hoursPerDay} : DEFAULT_UNITS;
}

// Pure model. Inputs:
//   calendar  a projectCalendar view (minuteWithinDay, dayIdentity) or null when the world has no known calendar
//   units     {minutesPerHour, hoursPerDay}
//   events    [{id, minute, text}] written today, minute = minute of the day; other days are ignored by the caller
//   work      [{id, endsIn}] work under way, endsIn = minutes left (null when no end is known)
//   plan      [{id, minute, text}] entries a life already set for later today, minute = minute of the day
// Output: {hidden, ticks, nowFraction, now, marks, ahead, summary:{earlier, ahead}}.
export function dayStripModel({calendar, units = DEFAULT_UNITS, events = [], work = [], plan = []} = {}) {
    if (!calendar || !Number.isFinite(calendar.minuteWithinDay)) return {hidden: true, reason: 'unknown-calendar', marks: [], ahead: [], ticks: [], summary: {earlier: '', ahead: ''}};
    const dayMinutes = units.minutesPerHour * units.hoursPerDay, now = calendar.minuteWithinDay, at = m => clamp01(m / dayMinutes);
    const quarter = Math.round(units.hoursPerDay / 4);
    const ticks = [1, 2, 3].map(i => ({fraction: at(i * quarter * units.minutesPerHour), label: String(i * quarter)}));
    // Past marks: one per hour, the lines of that hour folded into it (the newest names it).
    const buckets = new Map();
    for (const e of [...events].filter(e => Number.isFinite(e.minute) && e.minute >= 0 && e.minute <= now && clean(e.text)).sort((a, b) => a.minute - b.minute)) {
        const hour = Math.floor(e.minute / units.minutesPerHour), b = buckets.get(hour) ?? {hour, ids: [], texts: [], minute: e.minute};
        b.ids.push(e.id); b.texts.push(clip(e.text)); b.minute = e.minute; buckets.set(hour, b);
    }
    const marks = [...buckets.values()].map(b => ({key: `h${b.hour}`, fraction: at(b.minute), hour: b.hour, count: b.texts.length,
        ids: b.ids, openId: b.ids.at(-1), text: b.texts.at(-1), label: `${b.hour}: ${b.texts.length > 1 ? `${b.texts.at(-1)} (and ${b.texts.length - 1} more)` : b.texts.at(-1)}`}));
    // Ahead of now: work under way with its end, then planned entries. Nothing set, nothing drawn.
    const ahead = [];
    for (const w of work) {
        if (!Number.isFinite(w.endsIn)) continue;
        const end = now + Math.max(0, w.endsIn), past = end >= dayMinutes, endHour = hourWords(end % dayMinutes, units);
        ahead.push({key: `work:${w.id}`, kind: 'work', to: at(Math.min(end, dayMinutes)), toMinute: end,
            text: past ? 'Work under way, ends tomorrow' : `Work under way, ends at ${endHour}`});
    }
    for (const p of plan) {
        if (!Number.isFinite(p.minute) || p.minute <= now || p.minute >= dayMinutes || !clean(p.text)) continue;
        ahead.push({key: `plan:${p.id}`, kind: 'plan', at: at(p.minute), toMinute: p.minute, text: `${clip(p.text)} at ${hourWords(p.minute, units)}`});
    }
    ahead.sort((a, b) => a.toMinute - b.toMinute);
    return {hidden: false, ticks, nowFraction: at(now), now, marks, ahead,
        summary: {earlier: marks.length ? marks.at(-1).label : '', ahead: ahead.map(a => a.text).slice(0, 2).join(' · ')}};
}

// Work the player started: the expansion state's pending and simulation jobs (the Today tab's reader). The words stay
// neutral because a job's label can name an outcome that is decided later (today_strip.js SX4).
export function workFromExpansion(expansion) {
    if (!expansion) return [];
    const mine = job => !job.context?.actorId || job.context.actorId === CONTROLLED_ACTOR_ID;
    const jobs = [...(expansion.pending || []).filter(mine), ...(expansion.simulation?.jobs || []).filter(j => j.actorId === CONTROLLED_ACTOR_ID)];
    return jobs.map((job, i) => ({id: String(job.id ?? i), endsIn: Number.isFinite(job.due - expansion.clock) ? job.due - expansion.clock : null}));
}

registerPanelSettings({id: 'day-strip', title: 'Day strip', settings: [
    {key: 'visible', label: 'Day strip (proposal)', options: [['on', 'Shown'], ['off', 'Hidden']], default: 'on',
        description: 'A thin band of today\'s hours above the place: what was reported today, and what is already set for later. Never stored in the game.'}]});
const shown = () => getDisplaySetting('panel.day-strip.visible') !== 'off';

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// What a Reports line says: its full original wording, without the Open button, voice line or border.
const lineText = node => {
    const original = node.querySelector(':scope > .log-original');
    if (original) return clean(original.textContent);
    return clean([...node.childNodes].filter(c => c.nodeType === 3 || (c.nodeType === 1 && !c.matches('button, .report-voice, .message_border, .log-compact, small'))).map(c => c.textContent).join(' '));
};

// A fight takes the centre when the opponent view is up (the opponent view replaces Around you) or the timed fight card is up; then the strip is hidden, not covered.
const fightHasCentre = () => !!document.querySelector('#current_focus > .combat-focus-view, [data-fight-mode="tempo"]');
// The place view itself: the strip is its first child, above the place name, so it comes and goes with the view.
const placeDock = () => document.getElementById('village_scene');
export function mountDayStrip({host = placeDock(), stream = document.getElementById('message_box_div'), yieldsTo = fightHasCentre, calendar = () => resolveWorldCalendar(readPort('expansion'), readPort('gameTime'))} = {}) {
    if (!host || host.querySelector(':scope > #day_strip')) return null;
    const root = el('section'); root.id = 'day_strip'; root.className = 'day-strip'; root.hidden = true; root.dataset.surfaceType = 'timeline';
    root.setAttribute('aria-label', 'Today\'s hours');
    const track = el('div', 'day-strip-track'), past = el('i', 'day-strip-past'), nowMark = el('i', 'day-strip-now');
    nowMark.setAttribute('aria-hidden', 'true'); past.setAttribute('aria-hidden', 'true');
    const ticks = el('div', 'day-strip-ticks'), marks = el('div', 'day-strip-marks'), ahead = el('div', 'day-strip-ahead');
    ticks.setAttribute('aria-hidden', 'true'); ahead.setAttribute('aria-hidden', 'true');
    track.append(past, ahead, ticks, nowMark, marks);
    const legend = el('p', 'day-strip-legend'), earlier = el('span', 'day-strip-earlier'), later = el('span', 'day-strip-later');
    legend.append(earlier, later);
    root.append(track, legend);
    host.prepend(root);

    // Today's Reports lines with the hour they arrived. This sitting only; nothing is saved. A line arrives when the game
    // publishes it, so a long step stamps its lines at the step's end.
    let dayId = null, seq = 0, records = [];
    const nodes = new Map();
    const noteLine = (node, view) => {
        if (!view || node.nodeType !== 1 || !node.classList.contains('message_common') || node.classList.contains('report-earlier')) return;
        if (node.dataset.logLabel === 'Combat') return;
        const text = lineText(node);
        if (!text || isDivider(text)) return;
        const id = `r${++seq}`; nodes.set(id, new WeakRef(node));
        records.push({id, minute: view.minuteWithinDay, text});
    };
    let observer = null;
    if (stream && typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(list => { let view = null; try { view = calendar(); } catch { view = null; } sync(view); for (const m of list) for (const n of m.addedNodes) noteLine(n, view); render(); });
        observer.observe(stream, {childList: true});
    }
    const sync = view => { const id = view?.dayIdentity ?? null; if (id !== dayId) { dayId = id; records = []; nodes.clear(); } };

    let markKey = '', aheadKey = '', visible = null;
    const open = id => {
        const node = nodes.get(id)?.deref();
        if (!node?.isConnected) { legend.dataset.said = 'gone'; earlier.textContent = 'That line has scrolled out of Reports.'; return; }
        node.scrollIntoView({block: 'nearest'});
        node.classList.add('day-strip-found');
        setTimeout(() => node.classList.remove('day-strip-found'), 1800);
    };
    function render() {
        let view = null; try { view = calendar(); } catch { view = null; }
        sync(view);
        const model = dayStripModel({calendar: view, units: unitsOf(view), events: records, work: workFromExpansion(readPort('expansion')), plan: []});
        const hide = model.hidden || !shown() || !!yieldsTo();
        if (hide !== visible) { visible = hide; root.hidden = hide; }
        if (hide) return;
        root.style.setProperty('--day-now', `${model.nowFraction * 100}%`);
        const mk = JSON.stringify(model.marks.map(m => [m.key, m.fraction, m.count, m.text]));
        if (mk !== markKey) {
            markKey = mk;
            marks.replaceChildren(...model.marks.map(m => {
                const b = el('button', 'day-strip-mark', m.count > 1 ? String(m.count) : ''); b.type = 'button';
                b.style.setProperty('--day-at', `${m.fraction * 100}%`); b.title = m.label; b.setAttribute('aria-label', m.label);
                b.onclick = () => open(m.openId); return b;
            }));
            ticks.replaceChildren(...model.ticks.map(t => { const s = el('span', 'day-strip-tick', t.label); s.style.setProperty('--day-at', `${t.fraction * 100}%`); return s; }));
        }
        const ak = JSON.stringify(model.ahead.map(a => [a.key, a.to ?? a.at, a.text]));
        if (ak !== aheadKey) {
            aheadKey = ak;
            ahead.replaceChildren(...model.ahead.map(a => {
                const s = el('i', `day-strip-${a.kind}`); s.title = a.text;
                if (a.kind === 'work') s.style.setProperty('--day-to', `${a.to * 100}%`); else s.style.setProperty('--day-at', `${a.at * 100}%`);
                return s;
            }));
        }
        if (legend.dataset.said !== 'gone' || model.summary.earlier) {
            earlier.textContent = model.summary.earlier ? `Today: ${model.summary.earlier}` : '';
            delete legend.dataset.said;
        }
        later.textContent = model.summary.ahead ? `Ahead: ${model.summary.ahead}` : '';
        root.dataset.empty = !model.marks.length && !model.ahead.length ? 'true' : 'false';
    }
    const timer = setInterval(render, 1000);
    const stop = subscribeDisplaySettings(render);
    document.addEventListener('visibilitychange', render);
    render();
    return {node: root, render, dispose() { clearInterval(timer); stop(); observer?.disconnect(); document.removeEventListener('visibilitychange', render); root.remove(); }};
}
