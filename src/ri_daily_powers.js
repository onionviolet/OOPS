import {domainRegistry, registerDomain} from './domain_registry.js';
import {energyView} from './energy_resources.js';
import {formatDuration} from './number_format.js';
import {observerView} from './observer_view.js';
import {RI_DAILY_POWERS, RI_DAY_DIALS, RI_MOONGLOW_SALE_NOTE} from './ri_lead_day_facts.js';
import {setText} from './dom_sync.js';
import {kitElement} from './ui/kit.js';
import {RI_MOONGLOW_SALE} from './world_packs/book_gu_lead_day.js';

const isPower = id => id.startsWith(`${RI_DAILY_POWERS}.`);
const {jin, stones} = RI_DAY_DIALS.meatSale;
const quote = `${jin} jin for ${stones} stone · ${RI_MOONGLOW_SALE.parts} essence · ${formatDuration(RI_MOONGLOW_SALE.minutes)}`;

export function dailyPowerControl(view) {
    const job = view.jobs?.find(row => isPower(row.commandId));
    if (job) return {label: 'Stop portioning', request: {type: 'cancel', jobId: job.id},
        hint: `${formatDuration(job.remaining)} left`, enabled: view.canWrite && job.cancellable};
    const act = view.actions?.find(row => isPower(row.id));
    if (act) return {label: act.label, request: {type: 'action', id: act.id}, hint: quote,
        enabled: view.canWrite && act.eligible, reason: act.reasons[0]};
    const option = view.extensions?.find(row => row.id === RI_DAILY_POWERS && row.eligible);
    if (option) return {label: 'Open kitchen task',
        request: {type: 'adopt-extension', id: option.id, revision: option.revision, contentHash: option.contentHash},
        hint: 'Portion wolf meat with Moonglow', enabled: view.canWrite};
    return null;
}

function mountDailyPowers(ports) {
    const panel = kitElement('section', 'daily-powers');
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Powers');
    const title = kitElement('strong', 'daily-powers__title', 'Powers');
    const amount = kitElement('span', 'daily-powers__amount');
    const reserve = kitElement('div', 'daily-powers__reserve');
    reserve.append(kitElement('span', '', 'Primeval essence'), amount);
    const meter = kitElement('meter', 'daily-powers__meter');
    meter.setAttribute('aria-label', 'Primeval essence');
    const action = kitElement('button', 'daily-powers__action');
    action.type = 'button';
    action.setAttribute('aria-describedby', 'daily-powers-hint daily-powers-reason');
    const hint = kitElement('small', 'daily-powers__hint');
    hint.id = 'daily-powers-hint';
    const reason = kitElement('small', 'daily-powers__reason');
    reason.id = 'daily-powers-reason';
    const result = kitElement('p', 'daily-powers__result');
    result.setAttribute('role', 'status');
    panel.append(title, reserve, meter, action, hint, reason, result);

    let request, error;
    action.addEventListener('click', () => {
        if (!request || action.disabled) return;
        error = '';
        try { ports.command(request); } catch (e) { error = e.message; }
        render();
    });

    function render() {
        const state = ports.state();
        const hero = document.getElementById('basic_character_info_div');
        const inFight = state?.simulation?.sessions?.player?.nativeBattle;
        const here = state?.simulation?.people?.player?.location === 'book.ri.lead.academy';
        if (!hero || state?.actors?.player?.worldId !== 'book.ri.lead.world' || !here || (inFight && !inFight.result)) {
            panel.hidden = true;
            return;
        }
        const control = dailyPowerControl(ports.read());
        const sea = energyView(state, 'player').find(row => row.id === 'book.ri.lead.primeval');
        panel.hidden = !(sea && control);
        if (panel.hidden) return;
        if (panel.parentNode !== hero) hero.append(panel);
        request = control.request;
        setText(amount, `${sea.reserve}/${sea.capacity}`);
        if (meter.max !== sea.capacity) meter.max = sea.capacity;
        if (meter.value !== sea.reserve) meter.value = sea.reserve;
        setText(action, control.label);
        action.disabled = !control.enabled;
        setText(hint, control.hint);
        setText(reason, control.enabled ? '' : control.reason || 'Saving is unavailable.');
        reason.hidden = !reason.textContent;
        setText(result, error || observerView(state).knows(RI_MOONGLOW_SALE_NOTE)?.value || '');
        result.hidden = !result.textContent;
    }
    return {render};
}

export function registerRiDailyPowers(ports) {
    if (!ports || domainRegistry.list().some(domain => domain.id === 'ri_daily_powers')) return;
    let panel;
    registerDomain({id: 'ri_daily_powers', refresh: () => panel?.render(), panels: [() => {
        panel = mountDailyPowers(ports);
        panel.render();
    }]});
}
