// Workbench drafts page (G4) and the "Draft work" block for a codex row. Reads /drafts and /codex/<ledger>/draft; the only write
// is POST /drafts, which saves a server-built brief and never overwrites. Nothing here runs a lane, edits code or marks proof.
import {element as el} from '/canvas.mjs';

const get = async url => {const r = await fetch(url); if (!r.ok) throw Error((await r.json().catch(() => ({}))).error || r.statusText); return r.json();};
const STATUS = {open: 'open: row unchanged since the draft', 'row-changed': 'row changed since the draft: check its proof', 'row-gone': 'row no longer in the ledger'};

/** The block inside a codex row detail. */
export function draftBlock(ledger, id, go) {
    const box = el('div', null, 'codex-draft'), out = el('div');
    const preview = el('button', 'Preview draft brief'), save = el('button', 'Save draft'), copy = el('button', 'Copy brief');
    for (const b of [preview, save, copy]) b.type = 'button';
    copy.hidden = true;
    let text = '';
    preview.onclick = async () => {
        out.replaceChildren(el('p', 'Building the brief…', 'codex-missing'));
        try {const d = await get(`/codex/${ledger}/draft?id=${encodeURIComponent(id)}`); text = d.text; out.replaceChildren(el('pre', text)); copy.hidden = false;}
        catch (e) {out.replaceChildren(el('p', 'Draft failed: ' + e.message, 'codex-missing'));}
    };
    save.onclick = async () => {
        save.disabled = true;
        try {
            const r = await fetch('/drafts', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ledger, id})});
            const d = await r.json();
            const msg = r.status === 201 ? `Saved to ${d.path}. A proposal only: nothing was run.` : r.status === 409 ? `A draft for this row already exists: ${d.path}. Open it in Workbench › Drafts.` : 'Save failed: ' + (d.error || r.statusText);
            out.prepend(el('p', msg, 'codex-missing'));
            if (r.status === 201 || r.status === 409) {const link = el('button', 'Open Drafts'); link.type = 'button'; link.onclick = () => go('workbench/drafts'); out.prepend(link);}
        } catch (e) {out.prepend(el('p', 'Save failed: ' + e.message, 'codex-missing'));}
        save.disabled = false;
    };
    copy.onclick = async () => {try {await navigator.clipboard.writeText(text); copy.textContent = 'Copied';} catch {copy.textContent = 'Copy blocked: select the text';}};
    const bar = el('div', null, 'codex-tools'); bar.append(preview, save, copy);
    box.append(el('p', 'Draft the next step for this row as a brief in the owner\'s shape. Saving writes a proposal file; it runs nothing.', 'codex-missing'), bar, out);
    return box;
}

/** Workbench › Drafts: saved drafts and whether their row moved since. */
export async function draftsView({main, go}) {
    main.replaceChildren();
    const root = el('section', null, 'codex'); root.setAttribute('aria-label', 'Drafts');
    main.append(root);
    root.append(el('h2', 'Drafts'), el('p', 'Briefs saved from codex rows. "Row changed" means the ledger row moved after the draft: open the row and read its ladder before calling anything done.', 'codex-missing'));
    let list;
    try {list = (await get('/drafts')).drafts;} catch (e) {root.append(el('p', 'Drafts could not be read: ' + e.message)); return;}
    if (!list.length) {root.append(el('p', 'No drafts yet. Open a row in Codex and use Save draft.', 'codex-missing')); return;}
    const t = el('table'), head = el('tr');
    for (const h of ['Row', 'Next step', 'Status', 'State then', 'State now', 'File']) head.append(el('th', h));
    t.append(head);
    for (const d of list) {
        const tr = el('tr'), rowCell = el('td'), b = el('button', d.meta.key); b.type = 'button';
        b.onclick = () => go(`codex/${d.meta.ledger}/${encodeURIComponent(d.meta.id)}`);
        rowCell.append(b);
        tr.append(rowCell, el('td', d.meta.kind + (d.meta.gated ? ' (gated)' : '')), el('td', STATUS[d.status] || d.status), el('td', d.meta.stateAtDraft || ''), el('td', d.current?.state ?? 'gone'), el('td', d.path));
        t.append(tr);
    }
    root.append(t);
}
