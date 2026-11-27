import {domainRegistry, registerDomain} from './domain_registry.js';
import {energyView} from './energy_resources.js';
import {formatDuration} from './number_format.js';
import {observerView} from './observer_view.js';
import {RI_DAILY_POWERS, RI_DAY_DIALS, RI_DAY_DIETS, RI_DAY_ITEMS, RI_LEAD_DAY, RI_MOONGLOW_SALE_NOTE} from './ri_lead_day_facts.js';
import {setText} from './dom_sync.js';
import {kitElement, kitRow} from './ui/kit.js';
import {RI_MOONGLOW_SALE} from './world_packs/book_gu_lead_day.js';
import {RI_LEAF_TREATMENT, RI_LEAF_NOTE, RI_LEAF_PRICE} from './ri_leaf_treatment.js';
import {RI_HEALER_WORK, RI_HEALER_NOTE, RI_HEALER_MINUTES} from './world_packs/book_gu_lead_healer_work.js';
import {knownItemConsumers} from './known_item_consumers.js';
import {RI_GRANARY,RI_GRANARY_FOUND,RI_GRANARY_PATCHED,RI_GRANARY_PAID} from './ri_granary_work.js';

const isPower = id => id.startsWith(`${RI_DAILY_POWERS}.`);
const {jin, stones} = RI_DAY_DIALS.meatSale;
const quote = `${jin} jin for ${stones} stone · ${RI_MOONGLOW_SALE.parts} essence · ${formatDuration(RI_MOONGLOW_SALE.minutes)}`;
const patrol = RI_DAY_DIALS.patrol;
const dayId = action => `${RI_LEAD_DAY}.${action}`;

function actionControl(view, match, {label, hint, stop}) {
    const job = view.jobs?.find(row => match(row.commandId));
    if (job) return {label: job.cancellable ? stop : (label || job.label), request: {type: 'cancel', jobId: job.id},
        hint: `${formatDuration(job.remaining)} left`, enabled: view.canWrite && job.cancellable, running: true};
    const act = view.actions?.find(row => match(row.id));
    if (!act) return null;
    return {label: label || act.label, request: {type: 'action', id: act.id},
        hint: typeof hint === 'function' ? hint(act) : hint, enabled: view.canWrite && act.eligible,
        reason: act.eligible ? '' : act.reasons[0]};
}

export function dailyPowerControl(view) {
    const control = actionControl(view, isPower, {hint: quote, stop: 'Stop portioning'});
    if (control) return control;
    const option = view.extensions?.find(row => row.id === RI_DAILY_POWERS && row.eligible);
    if (option) return {label: 'Open kitchen task',
        request: {type: 'adopt-extension', id: option.id, revision: option.revision, contentHash: option.contentHash},
        hint: `Moonglow · ${quote}`, enabled: view.canWrite};
    return null;
}

const duration = act => formatDuration(act.duration);
const followUp = [
    ['report', {label: 'Report the watch'}],
    ['drive_off', {label: 'Let the watch drive the wolf off'}],
    ['rest_wound', {label: 'Bind your wound and rest', hint: duration, stop: 'Stop resting'}],
    ['hand_in_tally', {label: 'Turn in a watch tally', hint: `${RI_DAY_DIALS.tallyMerit.merit} merit`, stop:'Stop handing in the tally'}],
    ['hand_in_eye', {label: 'Turn in a wolf eye', hint: `${RI_DAY_DIALS.eyeMerit.merit} merit`}],
];
const rowKeys = ['hand', 'moonglow', ...RI_DAY_DIETS.map(diet => `feed_${diet.slot}`), 'granary-listen', 'granary-search', 'granary-patch', 'granary-collect', 'patrol', 'treatment', 'leaf', 'healer-tally', 'healer-work', 'follow-up'];

export function riDayControls(view) {
    const uses=riTallyChoices(view),shown=new Set(uses.choices.map(row=>row.id));
    const get = (key, options) => actionControl(view, id => id === dayId(key), options);
    const next = followUp.map(([id, options]) => get(id, options)).filter(Boolean);
    const leaf = op => actionControl(view, id => id === `${RI_LEAF_TREATMENT}.${op}`, {
        hint: op === 'buy' ? `${RI_LEAF_PRICE} stones · keeps until used` : '1 leaf · closes the patrol wound',
    });
    const adopt = view.extensions?.find(row => row.id === RI_LEAF_TREATMENT && row.eligible);
    const healer = view.extensions?.find(row => row.id === RI_HEALER_WORK && row.eligible);
    const granary=view.extensions?.find(row=>row.id===RI_GRANARY&&row.eligible);
    const store=(op,hint)=>actionControl(view,id=>id===`${RI_GRANARY}.${op}`,{hint,stop:'Stop feed-store work'});
    return {
        'granary-listen':store('listen','1 part · 5 min · interruption keeps the cost')||(granary?{label:'Ask about the feed-store repair',hint:'Listen with Ear Grass or inspect by hand; a hide patch earns twenty petals.',enabled:view.canWrite,
            request:{type:'adopt-extension',id:granary.id,revision:granary.revision,contentHash:granary.contentHash}}:null),
        'granary-search':store('search','45 min · no essence'),
        'granary-patch':store('patch','1 wolf hide · 20 min · forfeits its sale'),
        'granary-collect':store('collect','20 petals · elder must be here'),
        hand: get('sell_meat', {label: 'Sell wolf meat by hand', stop: 'Stop cutting', hint: act => `${jin} jin for ${stones} stone · ${duration(act)}`}),
        moonglow: dailyPowerControl(view),
        treatment: leaf('treat') || (adopt ? {label: 'Ask about a healing leaf', enabled: view.canWrite, hint: 'Keep your stones, or pay to return to the wall sooner.',
            request: {type: 'adopt-extension', id: adopt.id, revision: adopt.revision, contentHash: adopt.contentHash}} : null),
        leaf: leaf('buy'),
        'healer-tally': shown.has(`${RI_HEALER_WORK}.tally`)?null:actionControl(view, id => id === `${RI_HEALER_WORK}.tally`, {hint: '1 watch tally · gives up 10 merit'}) ||
            (healer ? {label: 'Ask the healer about work and watch tallies', enabled: view.canWrite, hint: 'Keep your stones by trading a tally or working for a leaf.',
                request: {type: 'adopt-extension', id: healer.id, revision: healer.revision, contentHash: healer.contentHash}} : null),
        'healer-work': actionControl(view, id => id === `${RI_HEALER_WORK}.sort`, {hint: `${formatDuration(RI_HEALER_MINUTES)} · 1 leaf · keeps stones and tallies`, stop: 'Stop sorting herbs'}),
        ...Object.fromEntries(RI_DAY_DIETS.map(diet => [`feed_${diet.slot}`, get(`feed_${diet.slot}`, {
            label: `Feed the ${diet.label}`, hint: `${diet.perMeal} ${diet.foodLabel}`,
        })])),
        patrol: get('patrol', {label: 'Walk the wolf-tide patrol', stop: 'Stop patrolling', hint: `${formatDuration(patrol.minutes)} · up to ${patrol.parts} essence`}),
        'follow-up': next.find(row => row.running) || next.find(row => row.enabled&&!shown.has(row.request.id)),
    };
}
export const riTallyChoices=view=>knownItemConsumers(view,JSON.stringify({id:RI_DAY_ITEMS.tally}));

export function recentDayNotes(state) {
    const observer = observerView(state);
    const read = key => observer.knows(key);
    const latest = keys => keys.map(read).filter(note => note && typeof note.value === 'string').sort((a, b) => b.at - a.at)[0];
    return [latest([RI_MOONGLOW_SALE_NOTE, dayId('sold')]), latest(RI_DAY_DIETS.map(diet => diet.fed)),
        latest([dayId('patrol'), RI_LEAF_NOTE, RI_HEALER_NOTE,RI_GRANARY_PAID,RI_GRANARY_PATCHED,RI_GRANARY_FOUND]), read(dayId('merit'))].filter(Boolean).sort((a, b) => b.at - a.at);
}

function mountDailyPowers(ports) {
    const panel = kitElement('section', 'daily-powers');
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Fang Yuan’s day');
    const title = kitElement('strong', 'daily-powers__title', 'Fang Yuan’s day');
    const amount = kitElement('span', 'daily-powers__amount');
    const reserve = kitElement('div', 'daily-powers__reserve');
    reserve.append(kitElement('span', '', 'Primeval essence'), amount);
    const meter = kitElement('meter', 'daily-powers__meter');
    meter.setAttribute('aria-label', 'Primeval essence');
    const result = kitElement('div', 'daily-powers__result');
    const latest = kitElement('p', 'daily-powers__latest');
    latest.setAttribute('role', 'status');
    const history = kitElement('details');
    const earlier = [kitElement('p'), kitElement('p'), kitElement('p')];
    history.append(kitElement('summary', '', 'Earlier results'), ...earlier);
    result.append(latest, history);
    const errorLine = kitElement('small', 'daily-powers__reason');
    errorLine.setAttribute('role', 'alert');
    const itemChoices=kitElement('section'),itemTitle=kitElement('strong'),itemRows=new Map();
    itemChoices.dataset.knownItemChoices='';itemChoices.append(itemTitle);
    const kitchen = kitElement('section', 'daily-powers__kitchen');
    kitchen.append(kitElement('h3', '', 'Village kitchens'));
    panel.append(title, reserve, meter, itemChoices, kitchen);

    let controls = {}, error = '';
    const rows = rowKeys.map(key => {
        const row = kitRow({className: 'daily-powers__row', label: '', action: {}, data: {dayAction: key}});
        const [button, hint, reason] = row.children;
        hint.id = `ri-day-${key}-quote`;
        reason.id = `ri-day-${key}-reason`;
        button.setAttribute('aria-describedby', `${hint.id} ${reason.id}`);
        button.addEventListener('click', () => {
            const control = controls[key];
            if (!control?.enabled) return;
            error = '';
            try { ports.command(control.request); } catch (e) { error = e.message; }
            render();
        });
        const kitchenRow = key === 'hand' || key === 'moonglow';
        (kitchenRow ? kitchen : panel).append(row);
        return {key, row, button, hint, reason, kitchenRow};
    });
    panel.append(errorLine, result);

    function render() {
        const state = ports.state();
        const hero = document.getElementById('basic_character_info_div');
        const inFight = state?.simulation?.sessions?.player?.nativeBattle;
        const here = state?.simulation?.people?.player?.location === 'book.ri.lead.academy';
        if (!hero || state?.actors?.player?.worldId !== 'book.ri.lead.world' || !here || (inFight && !inFight.result)) {
            panel.hidden = true;
            return;
        }
        const view = ports.read();
        controls = riDayControls(view);
        kitchen.hidden = !controls.hand && !controls.moonglow;
        const tally=riTallyChoices(view);
        const sea = energyView(state, 'player').find(row => row.id === 'book.ri.lead.primeval');
        panel.hidden = !(sea && Object.values(controls).some(Boolean));
        if (panel.hidden) return;
        if (panel.parentNode !== hero) hero.append(panel);
        setText(amount, `${sea.reserve}/${sea.capacity}`);
        if (meter.max !== sea.capacity) meter.max = sea.capacity;
        if (meter.value !== sea.reserve) meter.value = sea.reserve;
        itemChoices.hidden=!tally.choices.length;
        setText(itemTitle,`Watch tally · ${tally.held} held`);
        const ids=new Set(tally.choices.map(choice=>choice.id));
        for(const [id,row] of itemRows)if(!ids.has(id)){row.remove();itemRows.delete(id);}
        for(const choice of tally.choices){
            let row=itemRows.get(choice.id);
            if(!row){row=kitRow({className:'daily-powers__row',label:'',action:{}});itemRows.set(choice.id,row);itemChoices.append(row);
                row.children[0].dataset.knownItemConsumer=choice.id;
                row.children[1].id=`ri-item-use-${choice.id}-quote`;row.children[2].id=`ri-item-use-${choice.id}-reason`;
                row.children[0].setAttribute('aria-describedby',`${row.children[1].id} ${row.children[2].id}`);
                row.children[0].addEventListener('click',()=>{const current=riTallyChoices(ports.read()).choices.find(a=>a.id===choice.id);if(!current?.eligible||!ports.read().canWrite)return;
                    error='';try{ports.command({type:'action',id:current.id});}catch(e){error=e.message;}render();});}
            const [button,hint,reason]=row.children;
            setText(button,choice.label);button.disabled=!view.canWrite||!choice.eligible;
            setText(hint,[...(choice.costs||[]),formatDuration(choice.duration||0)].join(' · '));
            setText(reason,choice.eligible?(view.canWrite?'':view.pauseReason||'Saving is unavailable.'):choice.reasons?.[0]||'');reason.hidden=!reason.textContent;
        }
        for (const {key, row, button, hint, reason, kitchenRow} of rows) {
            const control = controls[key];
            row.hidden = !control;
            if (!control) continue;
            if (kitchenRow) row.dataset.kitState = control.running ? 'running' : control.enabled ? 'ready' : 'blocked';
            setText(button, control.label);
            button.disabled = !control.enabled;
            setText(hint, control.hint || '');
            setText(reason, !control.enabled ? control.reason || view.pauseReason || (!view.canWrite ? 'Saving is unavailable.' : '') : '');
            hint.hidden = !hint.textContent;
            reason.hidden = !reason.textContent;
        }
        const notes = recentDayNotes(state);
        result.hidden = notes.length === 0;
        history.hidden = notes.length < 2;
        setText(latest, notes[0]?.value || '');
        earlier.forEach((line, index) => {
            const note = notes[index + 1];
            setText(line, note?.value || '');
            line.hidden = !note;
        });
        setText(errorLine, error);
        errorLine.hidden = !error;
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
