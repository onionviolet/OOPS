// Workbench › Send to the game: placement picks made in the atlas, the candidate build that turns them into a
// cast pack, and each run's diff. The atlas never swaps the live pack; adoption needs Weibao's yes.
import {element as el} from '/canvas.mjs';

export async function pickPlace(place, district) {
    const r = await fetch('/pick', {method: 'POST', body: JSON.stringify({place, district})});
    if (!r.ok) throw Error(await r.text());
    return r.json();
}

// A small control for a place inspector: choose a district, or clear the pick.
export function pickControl(place, data, onChange) {
    const box = el('section', null, 'atlas-pick');
    box.append(el('h3', 'Place on a walk'));
    if (data.transfer?.flagged?.[place.id]) {box.append(el('p', 'Not offered: ' + data.transfer.flagged[place.id])); return box;}
    const select = el('select');
    select.append(new Option('Not placed by the atlas', ''));
    for (const d of data.transfer?.districts || []) select.append(new Option(d.label, d.id));
    fetch('/transfer').then(r => r.json()).then(t => {const cur = t.picks.find(p => p.place === place.id); if (cur) select.value = cur.district;}).catch(() => {});
    const out = el('output');
    select.onchange = async () => {
        try {const r = await pickPlace(place.id, select.value || null); out.textContent = select.value ? 'Pick saved. Build a candidate under Workbench › Send to the game.' : 'Pick cleared.'; onChange?.(r.picks);}
        catch (e) {out.textContent = e.message;}
    };
    box.append(select, out);
    return box;
}

export async function transferView({main, controls, list, button}) {
    main.replaceChildren();
    const bar = controls();
    const state = await (await fetch('/transfer')).json();
    bar.append(el('small', `${state.picks.length} pick(s) in ${state.picksFile} · candidates go to work/atlas-transfer/ · the live pack is never written here`));
    const article = el('article', null, 'sheet');
    article.append(el('h2', 'Send placements to the game'),
        el('p', 'Picks made on Lord of the Mysteries places become authored base rows. The build reruns the cast pack compiler with them, keeps every key the live pack has, and diffs the result against the live pack.'));
    if (state.picks.length) article.append(el('h3', 'Picks'), list(state.picks.map(p => `${p.label || p.place} → ${p.district}`)));
    else article.append(el('p', 'No picks yet. Open a place under Lord of the Mysteries › Places and choose a district.'));
    const out = el('output');
    const run = button(state.running ? 'A build is running…' : 'Build candidate', async () => {
        run.disabled = true;
        const r = await fetch('/transfer', {method: 'POST'});
        out.textContent = r.ok ? 'Started. This takes about three minutes; reopen this view to see the result.' : await r.text();
    });
    run.disabled = !!state.running;
    article.append(run, out);
    article.append(el('h3', 'Runs'));
    if (!state.runs.length) article.append(el('p', 'No candidate builds yet.'));
    for (const r of state.runs) {
        const sec = el('section');
        sec.append(el('strong', r.name), el('small', r.exit == null ? 'running or interrupted' : r.exit === 0 ? 'exit 0' : 'exit ' + r.exit));
        if (r.diff) sec.append(list([`Places: ${r.diff.added} added, ${r.diff.removed} removed, ${r.diff.changed} changed${r.diff.predicted != null ? ` (predicted ${r.diff.predicted})` : ''}`,
            `Lost keys: ${r.diff.lostKeys.length ? r.diff.lostKeys.join(', ') : 'none'}`]));
        if (r.error) sec.append(el('p', r.error));
        if (r.candidate) {
            const d = el('details');
            d.append(el('summary', 'Preview or adopt'), el('pre', `Preview in the atlas:\nATLAS_LOTM_CAST=${r.candidate} node prototypes/world-atlas/serve.mjs\n\nAdopt (needs Weibao's yes):\n${r.adopt || 'see README.txt in the run folder'}`));
            sec.append(d);
        }
        article.append(sec);
    }
    main.append(article);
}
