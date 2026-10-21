import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {current_game_time} from './game_time.js';
import {current_location} from './runtime_state.js';
import {can_work} from './activity_time.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {node, syncList, visibleRenderer, minutesText, plural} from './reference_kit.js';

// SX4: Today. The clock, which timed activities here are open and when they open, and how many
// commitments are running. It reads the game clock, the location's own activity hours (through the
// same can_work check the start buttons use) and the expansion clock. A running commitment shows
// only its count and the time to the next one: its label names the outcome, which is decided when
// it starts and must not show before it resolves.

const pad = n => String(n).padStart(2, '0');
const hourText = h => `${pad(Math.floor(h))}:${pad(Math.round((h % 1) * 60))}`;

// Pure: minutes of the day, an hours window, and whether the game says it is open now.
export function activityHours(minuteOfDay, hours, openNow) {
    const text = `${hourText(hours.start)} to ${hourText(hours.end)}`;
    if (openNow) return {open: true, text: `Open now · hours ${text}`};
    if (hours.end > hours.start) {
        const start = hours.start * 60;
        if (minuteOfDay < start) return {open: false, text: `Closed · opens in ${minutesText(start - minuteOfDay)} · hours ${text}`};
        return {open: false, text: `Closed until tomorrow · hours ${text}`};
    }
    return {open: false, text: `Closed now · hours ${text}`};
}

// Pure: pending commitments owned by the player, from the expansion state.
export function runningCommitments(expansion) {
    if (!expansion?.pending) return {count: 0, nextIn: null};
    const mine = expansion.pending.filter(job => !job.context?.actorId || job.context.actorId === 'player');
    const due = mine.map(job => job.due - expansion.clock).filter(Number.isFinite);
    return {count: mine.length, nextIn: due.length ? Math.max(0, Math.min(...due)) : null};
}

function readToday() {
    const t = current_game_time, minute = t.hour * 60 + t.minute, rows = [];
    for (const [name, activity] of Object.entries(current_location?.activities || {})) {
        if (!activity.availability_time) continue;
        let unlocked = true; try { unlocked = activity.getAvailabilityComponent().getStatus().is_unlocked !== false; } catch { unlocked = true; }
        if (!unlocked) continue;
        const state = activityHours(minute, activity.availability_time, can_work(activity));
        rows.push({key: `act:${name}`, name: String(activity.activity_name || name), detail: state.text, open: state.open});
    }
    return {
        clock: `${t.getDayOfTheWeek()}, ${t.getSeason()}, ${t.getTimeOfDay()} · ${pad(t.hour)}:${pad(t.minute)}`,
        date: `Year ${t.year}, month ${t.month}, day ${t.day}`,
        place: current_location?.name || '',
        rows, work: runningCommitments(readPort('expansion')),
    };
}

const here = () => !!current_location;

function createTodayPanel() {
    const panel = node('section', null, {id: 'today_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'obligations';
    const clock = node('p', ''), date = node('p', ''), work = node('p', ''), heading = node('h3', 'Open here'), list = node('ul', null, {'aria-label': 'Timed activities here'});
    clock.className = 'reference-clock'; clock.setAttribute('role', 'timer'); clock.setAttribute('aria-live', 'off');
    panel.append(node('h2', 'Today'), clock, date, work, heading, list);
    const render = visibleRenderer(panel, readToday, view => {
        clock.textContent = view.clock; date.textContent = view.date;
        work.textContent = view.work.count
            ? `${plural(view.work.count, 'commitment')} running${view.work.nextIn != null ? `, the next ends in ${minutesText(view.work.nextIn)}` : ''}.`
            : 'No commitments are running.';
        heading.textContent = view.place ? `Timed activities at ${view.place}` : 'Timed activities here';
        syncList(list, view.rows.map(({key, name, detail}) => ({key, name, detail})), 'Nothing here keeps set hours.');
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'today', title: 'Today', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: here, eligible: here, emptyText: 'Begin to see the day here'});
    return panel;
}

let panel = null;
registerDomain({id: 'today', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createTodayPanel(); }]});
