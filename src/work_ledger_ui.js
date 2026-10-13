import {workspaceOwns} from './workspace_layout.js';
import {createSettledTextEffects} from './settled_text_effects.js';

// The runtime supplies an actor-safe projection and owns all command settlement.
export function createWorkLedgerUI({container, read, command, cancelExternalEffects = () => {}, readSettings}) {
    if (!container || typeof read !== 'function' || typeof command !== 'function') throw new TypeError('Work ledger needs its native host, projection and command path.');
    const panel = document.createElement('details');
    panel.id = 'work_ledger_panel'; panel.className = 'work-ledger-panel'; panel.open = false;
    const summary = document.createElement('summary'); summary.textContent = 'Work ledger'; panel.append(summary);
    const body = document.createElement('div'); body.className = 'work-ledger-body'; panel.append(body);
    const notice = document.createElement('p'); notice.className = 'work-ledger-notice'; notice.setAttribute('role', 'status'); panel.append(notice);
    container.append(panel);
    let signature = '', busy = false, destroyed = false;
    const options = () => { if(readSettings)return readSettings(); const view = read(); return view?.settings || view?.state?.settings || {effects: 'reduced', sound: false, presentation: 'inline'}; };
    const effects = createSettledTextEffects({container: panel, readSettings: options});
    const cancelEffects=()=>{effects.cancel();cancelExternalEffects();};
    const element = (tag, text, parent = body) => { const node = document.createElement(tag); node.textContent = String(text); parent.append(node); return node; };
    async function submit(action, payload) {
        const current = read();
        if (busy || !current?.canWrite || !current?.available) return;
        effects.gesture(); busy = true; notice.dataset.themeState='status'; notice.setAttribute('role','status'); notice.textContent = 'Saving…'; render(true);
        try {
            const outcome = await command({action, sequence: current.state.sequence + 1, ...(payload ? {payload} : {})});
            // The host may signal a refused/failed commit without throwing.
            if (outcome?.ok === false) {notice.dataset.themeState='error';notice.setAttribute('role','alert');notice.textContent = outcome.reason || outcome.error || 'The action could not be saved.';}
            else {
                const settled = read()?.state;
                const receipt = settled?.receipts?.findLast(r => r.sequence === current.state.sequence + 1 && r.type === action);
                notice.textContent = receipt ? 'Command saved. ' + receipt.text : 'Command saved.';
            }
        } catch (error) { notice.dataset.themeState='error';notice.setAttribute('role','alert');notice.textContent = error?.message || 'The action could not be saved.'; }
        finally { busy = false; render(true); }
    }
    function render(force = false) {
        if (destroyed) return;
        const host = container.isConnected ? container : container.id ? document.getElementById(container.id) : null;
        if (host && !workspaceOwns(panel) && panel.parentElement !== host) host.append(panel);
        const view = read() || {}, state = view.state;
        panel.hidden = !view.available;
        const next = JSON.stringify({view, busy});
        if (!force && next === signature) return;
        signature = next;
        const active = document.activeElement;
        const focusKey = body.contains(active) ? active.dataset.ledgerControl : null;
        body.replaceChildren();
        if (!state) { element('p', view.reason || 'The work ledger is not available here.'); return; }
        element('p', 'Complete work, claim points, then choose a taught method or a connected assistance service.');
        const status = element('p', `Connection: ${state.connection}. Points: ${state.points}.`); status.className = 'work-ledger-status';
        if (view.reason) element('p', view.reason);
        if (!view.canWrite) element('p', 'Read-only: restore saving before changing the ledger. Saved receipts and choices remain visible.');
        const commissionBox = element('section', ''); commissionBox.setAttribute('aria-label', 'Commissions');
        element('h4', 'Commissions', commissionBox);
        for (const row of view.commissions || []) {
            const card = element('div', '', commissionBox); card.className = 'work-ledger-commission';
            element('strong', row.title, card);
            element('p', `${row.status}. ${row.requirement || ''}`, card);
            if (row.recipe) element('p', `Recipe: ${row.recipe.split('/').at(-1)}.`, card);
        }
        const benefits = element('section', ''); benefits.setAttribute('aria-label', 'Acquired functions');
        element('h4', 'Acquisition and execution', benefits);
        if (view.benefits?.precision) element('p', view.benefits.precision, benefits);
        else element('p', state.precisionKnown ? 'Precision method acquired permanently. Native crafting can use it with a valid recipe and inputs.' : 'Precision method not acquired. The shop price is 2 ledger points.', benefits);
        if (view.benefits?.assist) element('p', view.benefits.assist, benefits);
        else element('p', !state.assistUnlocked ? 'Woodworking assistance not acquired. The shop price is 2 ledger points.' : state.connection === 'connected' ? 'Woodworking assistance acquired; the connected service can assist native component work.' : 'Woodworking assistance acquired; execution is unavailable while disconnected.', benefits);
        const actions = element('div', ''); actions.className = 'work-ledger-actions';
        for (const row of view.actions || []) {
            const button = element('button', row.label, actions); button.type = 'button'; button.dataset.ledgerControl = row.action;
            button.disabled = busy || !view.canWrite || !view.available || !row.enabled;
            button.onclick = () => submit(row.action);
            if (row.reason) { button.title = row.reason; element('small', row.reason, actions); }
        }
        const presentation = element('fieldset', ''); presentation.className = 'work-ledger-presentation';
        element('legend', 'Visual effects', presentation);
        const settings = {effects: 'reduced', sound: false, presentation: 'inline', ...(view.settings || state.settings)};
        const select = (label, key, choices) => {
            const line = element('label', label + ' ', presentation);
            const control = document.createElement('select'); control.dataset.ledgerControl = key;
            for (const [value, title] of choices) { const option = element('option', title, control); option.value = value; }
            control.value = settings[key]; control.disabled = busy || !view.canWrite || !view.available;
            control.onchange = () => { cancelEffects(); submit('settings', {...settings, [key]: control.value}); };
            line.append(control);
        };
        element('p', 'Motion, sound, receipt style and original VFX definitions are saved in Customization profiles.', presentation);
        const cancel = element('button', 'Cancel active effect', presentation); cancel.type = 'button'; cancel.dataset.ledgerControl = 'cancel-effect'; cancel.onclick = cancelEffects;
        element('small', 'System reduced motion is respected. Text receipts remain when motion or sound is off. Effects never pause work.', presentation);
        const history = element('section', ''); history.className = 'work-ledger-history'; history.setAttribute('aria-label', 'Saved receipts');
        element('h4', 'Saved receipts', history);
        const receipts = state.receipts || view.receipts || [];
        if (!receipts.length) element('p', 'No saved receipts yet.', history);
        else {
            const list = element('ol', '', history);
            for (const receipt of receipts) if (typeof receipt.text === 'string') element('li', receipt.text, list);
        }
        if (focusKey) [...body.querySelectorAll('[data-ledger-control]')].find(node => node.dataset.ledgerControl === focusKey)?.focus();
    }
    render();
    return {panel, render, present: effects.present, cancel: cancelEffects, destroy() {
        destroyed = true; effects.destroy(); panel.remove();
    }};
}
