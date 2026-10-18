import {definePanel} from './panel_kit.js';
import {VERB_LABEL} from './tool_profiles.js';
const node = (tag, text) => { const n = document.createElement(tag); if (text != null) n.textContent = text; return n; };
const pct = value => `${Math.round(value * 100)}%`;
// Place service in the workspace (UR1): your tools, their verb numbers and condition, and hand
// repair (quote, then commit). Coin repair stays in the Equipment durability panel.
export function createToolsPanel({read, quote, execute, cancel, discovered}) {
    const panel = node('section'); panel.id = 'tools_panel'; panel.className = 'expedition_panel'; panel.dataset.surfaceType = 'place-service';
    const intro = node('p'), job = node('div'), list = node('div'), detail = node('div'), notice = node('p');
    notice.setAttribute('role', 'status'); detail.dataset.toolsQuote = '';
    panel.append(node('h2', 'Tools'), intro, job, list, notice);
    let selected = null, signature = '';
    function render() {
        const view = read(), q = selected ? quote(selected) : null;
        const next = JSON.stringify([view, q, notice.textContent]); if (next === signature) return; signature = next;
        intro.textContent = view.enabled ? 'Work wears your tools a little each completed gathering round. A broken tool stops work; you can improvise at worse rates or repair it here by hand.'
            : 'Tool wear follows Equipment durability, which is off. Rates below are your tools as they are today.';
        job.replaceChildren();
        if (view.job) {
            const j = view.job, line = node('p', `Repairing ${j.name}: ${Math.ceil(j.minutesLeft)} of ${j.total} minutes left at the ${j.location} bench. Time passes while you stay here and do nothing else.`);
            const stop = node('button', 'Cancel repair'); stop.type = 'button'; stop.dataset.toolsCancel = ''; stop.title = `Returns the ${j.material}.`;
            stop.onclick = () => { try { cancel(); notice.textContent = 'Repair cancelled.'; } catch (e) { notice.textContent = e.message; } render(); };
            job.append(line, stop);
        }
        list.replaceChildren();
        for (const row of view.rows) {
            const line = node('div'); line.dataset.panelRow = ''; line.dataset.toolRow = row.key; line.className = 'tools-row';
            const p = row.profile, state = row.condition <= 0 && view.enabled ? 'broken' : row.equipped ? 'equipped' : 'carried';
            const cond = view.enabled && row.bound ? ` · condition ${Math.round(row.condition)}/${Math.round(row.max)}` : '';
            const bonus = p.levels ? `+${p.levels} ${Object.keys(p.bonus).join('/')} levels` : 'no skill bonus';
            const summary = node('p', `${row.name} (${state}) · ${VERB_LABEL[p.verb]} ${bonus} · precision ${p.precision} · hardness ${p.hardness}${cond}`);
            summary.title = `Improvised fallback: ${p.improvised.means}, ${pct(p.improvised.speed)} speed, ${pct(p.improvised.yield)} find chance. Repair: ${p.repair.skill} at a ${p.repair.station} station with ${p.repair.material}.`;
            const ask = node('button', 'Repair by hand…'); ask.type = 'button'; ask.dataset.toolsQuoteFor = row.key;
            ask.disabled = !view.enabled || !row.bound || row.condition >= row.max || !!view.job;
            ask.title = view.job ? 'Finish or cancel the current repair first.' : !view.enabled ? 'Turn on Equipment durability in Settings to track tool wear.' : !row.bound ? 'Equip this tool once with durability on so it has its own condition.' : row.condition >= row.max ? 'This tool is at its best condition.' : 'See what a hand repair needs. Quoting uses nothing.';
            ask.onclick = () => { selected = row.key; notice.textContent = ''; render(); detail.scrollIntoView?.({block: 'nearest'}); };
            line.append(summary, ask); list.append(line);
            // The quote opens under its tool so it stays in view on a 1366×768 screen.
            if (row.key === selected) line.append(detail);
        }
        if (!view.rows.length) list.append(node('p', 'You carry no tools.'));
        detail.replaceChildren();
        if (q && !detail.isConnected) list.append(detail);
        if (q) {
            detail.append(node('h3', `Hand repair quote: ${q.name ?? 'tool'}`));
            if (q.name) for (const text of [
                `Condition ${Math.round(q.condition)}/${Math.round(q.max)}; restores about ${Math.round(q.restore)} on success.`,
                `${q.skill} level ${q.level} · ${pct(q.chance)} success · ${q.minutes} minutes.`,
                `Station: ${q.station} tier ${q.stationTier} here. Material: ${q.need} ${q.material} (you have ${q.have}).`,
                q.failure, 'Quoting uses nothing.']) detail.append(node('p', text));
            const go = node('button', 'Start repair'), close = node('button', 'Close quote');
            go.type = close.type = 'button'; go.dataset.toolsExecute = ''; go.disabled = !q.eligible; go.title = q.reason;
            go.onclick = () => { try { execute(q); notice.textContent = 'Repair started.'; selected = null; } catch (e) { notice.textContent = e.message; } render(); };
            close.onclick = () => { selected = null; render(); };
            if (!q.eligible) detail.append(node('p', q.reason));
            detail.append(go, close);
        }
    }
    definePanel({id: 'tools', title: 'Tools', role: 'actions', node: panel, home: document.getElementById('main_content'),
        discovered, eligible: () => true, unavailableReason: () => 'Carry a tool to see it here'});
    render(); return {render};
}
