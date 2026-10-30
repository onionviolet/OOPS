import {registerDomain} from './domain_registry.js';
import {todayDigest} from './today_strip.js';
import {minutesText, plural} from './reference_kit.js';

// COV11 / UR11: the Reports column is 500 px wide and held three lines for the first hour. Until the log
// has LOG_TAKES_OVER lines it also shows what to do next and what the day offers, then the log has the column
// to itself. It reads the Next step card and the Today reader; it owns no state and writes no report (RPT8).
export const LOG_TAKES_OVER = 8;

// Pure: the rows the card shows, or none once the log has enough lines of its own.
export function dockRows({logLines, next, today}) {
    if (logLines >= LOG_TAKES_OVER) return [];
    const rows = [];
    if (next) rows.push({kind: 'next', label: 'Next step', text: next.line, hint: next.how});
    if (today) {
        rows.push({kind: 'clock', label: 'Now', text: `${today.clock}${today.place ? ` at ${today.place}` : ''}`});
        if (today.open.length) rows.push({kind: 'open', label: 'Open here', text: today.open.slice(0, 4).join(', ')});
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
    let signature = '';
    const render = () => {
        const nextCard = document.getElementById('next_step');
        const next = nextCard && !nextCard.hidden ? {line: nextCard.querySelector('span')?.textContent || '', how: nextCard.querySelector('small')?.textContent || ''} : null;
        let today = null; try { today = todayDigest(); } catch { today = null; }
        const rows = dockRows({logLines: stream.children.length, next, today});
        // The banner under the top strip moves here while the dock shows; it returns when the log takes over.
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
                show.onclick = () => nextCard?.querySelector('button')?.click();
                card.append(show);
            }
        }
    };
    render();
    setInterval(render, 1000);
}

registerDomain({id: 'reports_dock', deps: [], initialState: () => null, panels: [() => { mount(); }]});
