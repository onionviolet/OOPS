// Editor for the one supported authored site (see authored_site.js). It edits
// a local draft; only Apply and Reset change the game, both through the caller.
import {DRAFT_FIELDS, DEFAULT_DRAFT, validateDraft, exportAuthoredFile, parseAuthoredFile} from './authored_site.js';

export function createAuthoredSiteUI({container, read, apply, reset, download, openSite}) {
    const el = (tag, parent, text, cls) => {const n = document.createElement(tag); if(text) n.textContent = text; if(cls) n.className = cls; parent?.append(n); return n;};
    const panel = el('section', null, '', 'customization-panel customization-surface'); panel.id = 'authored_site_editor';
    el('h3', panel, 'Original site');
    const scroll = el('div', panel, '', 'customization-editor customization-fields-scroll');
    el('p', scroll, 'Author one original optional site reached from the Village. It has one timed activity that uses a material and makes a product, plus a gather activity for the material. Work runs on the game clock; completion pays real coin. Apply saves it into this life.');
    const applied = el('p', scroll); applied.id = 'authored_site_applied';
    const form = el('form', scroll); form.id = 'authored_site_form'; form.noValidate = true;
    const inputs = new Map(), groups = {Site: ['siteName', 'siteDescription', 'inputName', 'inputStart', 'outputName'],
        Activity: ['activityName', 'activityDescription', 'requiredInput', 'inputCost', 'minutes', 'outputGain', 'coinPay'], Gathering: ['gatherMinutes', 'gatherAmount']};
    const sets = Object.fromEntries(Object.entries(groups).map(([legend, keys]) => {const f = el('fieldset', form); el('legend', f, legend); return [legend, f];}));
    for(const [key, kind, label, min, max] of DRAFT_FIELDS) {
        const set = sets[Object.keys(groups).find(g => groups[g].includes(key))];
        const row = el('label', set, '', 'authored-site-field' + (max > 60 ? ' authored-site-wide' : '')); row.htmlFor = 'authored_site_' + key;
        el('span', row, label);
        const input = el(kind === 'text' && max > 60 ? 'textarea' : 'input', row);
        input.id = 'authored_site_' + key; input.name = key;
        if(kind === 'int') {input.type = 'number'; input.min = String(min); input.max = String(max); input.step = '1'; input.inputMode = 'numeric';}
        else {if(input.tagName === 'INPUT') input.type = 'text'; input.maxLength = max + 20; if(input.tagName === 'TEXTAREA') input.rows = 2;}
        inputs.set(key, input);
    }
    const actions = el('div', panel, '', 'customization-actions');
    const status = el('p', panel); status.id = 'authored_site_status'; status.setAttribute('role', 'status');
    const errors = el('ul', panel); errors.id = 'authored_site_errors'; errors.setAttribute('role', 'alert'); errors.hidden = true;
    let dirty = false, busy = false, lastApplied;
    form.addEventListener('input', () => {dirty = true; refresh();});
    // No submit button lives in the form, so Enter in a single-line field applies explicitly.
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('keydown', event => {if(event.key === 'Enter' && event.target.tagName === 'INPUT') {event.preventDefault(); applyButton.click();}});

    const formDraft = () => Object.fromEntries(DRAFT_FIELDS.map(([key, kind]) => {
        const v = inputs.get(key).value; return [key, kind === 'int' ? (/^\s*-?\d+\s*$/.test(v) ? Number(v) : v) : v];
    }));
    const fill = draft => {for(const [key] of DRAFT_FIELDS) inputs.get(key).value = draft[key] ?? '';};
    const show = (message, reasons = []) => {
        status.textContent = message;
        errors.replaceChildren(...reasons.map(r => {const li = document.createElement('li'); li.textContent = r; return li;}));
        errors.hidden = !reasons.length;
    };
    const fail = error => show('Not changed.', error.reasons || [error.message]);
    const button = (id, label, handler) => {
        const b = el('button', actions, label); b.id = id; b.type = 'button';
        b.onclick = async () => {if(busy) return; busy = true; refresh(); try {await handler();} catch(error) {fail(error);} finally {busy = false; refresh();}};
        return b;
    };
    const applyButton = button('authored_site_apply', 'Apply site', async () => {
        const draft = validateDraft(formDraft());
        await apply(draft); dirty = false; fill(draft);
        show('Applied and saved. Use Go to site, then Visit from the Village.');
    });
    const openButton = button('authored_site_open', 'Go to site', () => openSite());
    button('authored_site_discard', 'Discard edits', () => {dirty = false; fill(read().applied || DEFAULT_DRAFT); show('Draft restored to the applied site.');});
    const resetButton = button('authored_site_reset', 'Reset to defaults', async () => {
        await reset(); dirty = false; fill(DEFAULT_DRAFT);
        show('Authored site removed and saved. The draft is back to the default proposal.');
    });
    button('authored_site_export', 'Export draft', () => {
        download('authored-site.json', exportAuthoredFile(formDraft()));
        show('Draft exported as authored-site.json.');
    });
    const fileLabel = el('label', actions, 'Import draft file ', 'authored-site-import');
    const file = el('input', fileLabel); file.type = 'file'; file.accept = '.json,application/json'; file.id = 'authored_site_import';
    file.onchange = async () => {
        const chosen = file.files?.[0]; if(!chosen) return;
        try {const draft = parseAuthoredFile(await chosen.text()); fill(draft); dirty = true; show('Draft imported. Review it, then Apply site.');}
        catch(error) {fail(error);}
        finally {file.value = ''; refresh();}
    };

    function refresh() {
        const view = read();
        const key = JSON.stringify(view.applied);
        if(key !== lastApplied && !dirty) fill(view.applied || DEFAULT_DRAFT);
        lastApplied = key;
        applied.textContent = (view.applied ? `Applied: ${view.applied.siteName}.` : 'No authored site is applied.') + (dirty ? ' The draft has unapplied edits.' : '') + (view.reason ? ' ' + view.reason : '');
        applyButton.disabled = busy || !view.canWrite;
        resetButton.disabled = busy || !view.canWrite || !view.applied;
        openButton.disabled = busy || !view.applied;
        for(const input of inputs.values()) input.disabled = busy;
    }
    container.append(panel); refresh();
    return {panel, refresh};
}
