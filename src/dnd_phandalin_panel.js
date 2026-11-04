import {definePanel} from './panel_kit.js';
// Desktop-first records panel for the Phandalin test start (D&D first slice, proposal). Every button shows its cost or its reason when it cannot run.
const el = (tag, text) => { const n = document.createElement(tag); if (text != null) n.textContent = text; return n; };
export function createDndPhandalinPanel({read, quote, execute}) {
    const panel = el('section'); panel.id = 'dnd_phandalin_panel'; panel.className = 'expedition_panel';
    const body = el('div'), notice = el('p'); notice.setAttribute('role', 'status');
    panel.append(el('h2', 'Phandalin work yard (D&D test start)'),
        el('p', 'A named test start, not a finished world: a student wizard, a torn Sack and a supply run. Numbers are proposals under SRD 5.2.1.'), body, notice);
    let signature = '';
    // Success shows in the log below; the status line is for refusals only.
    const run = q => { try { execute(q); notice.textContent = ''; } catch (e) { notice.textContent = e.message; } signature = ''; render(); };
    function render() {
        if (!panel.isConnected) return;
        const v = read(), sig = JSON.stringify(v); if (sig === signature) return; signature = sig;
        body.replaceChildren();
        if (!v.started) {
            const b = el('button', 'Begin the test start'); b.type = 'button'; b.dataset.dndAction = 'start'; b.disabled = !v.start.eligible;
            b.title = v.start.eligible ? v.start.summary : v.start.reason; b.onclick = () => run(v.start); body.append(b, el('small', v.start.summary ?? v.start.reason)); return;
        }
        body.append(el('p', `Time ${v.clock} · ${v.bag}${v.cast ? ` · casting until ${v.cast.until}` : ''}${v.settled ? ' · settled' : ''}`));
        for (const a of v.actions) {
            const q = a.quote, b = el('button', a.label); b.type = 'button'; b.dataset.dndAction = a.id; b.disabled = !q.eligible;
            b.title = q.eligible ? q.summary : q.reason; b.onclick = () => run(q);
            const note = el('small', q.eligible ? q.summary : q.reason); note.dataset.dndNote = a.id;
            const row = el('div'); row.append(b, note); body.append(row);
        }
        const log = el('ol'); for (const line of v.log) log.append(el('li', line)); body.append(log);
    }
    definePanel({id: 'dnd-phandalin', title: 'Phandalin', role: 'records', node: panel, home: document.getElementById('main_content'), defaultDock: 'center',
        discovered: () => read().visible, eligible: () => read().visible});
    render(); return {render};
}
