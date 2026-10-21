import {definePanel} from './panel_kit.js';
import {VERB_LABEL} from './tool_profiles.js';
import {createWorkStatusView} from './work_status_view.js';
import {createMeterBar} from './meter_bar.js';
const node = (tag, text) => { const n = document.createElement(tag); if (text != null) n.textContent = text; return n; };
const pct = value => `${Math.round(value * 100)}%`;
export function lampFuelMeterSpec(lamp) {
    if(!lamp?.held)return null;
    return {id:'lamp-fuel',label:'Lamp fuel · minutes remaining',kind:'pool',value:lamp.oil,max:lamp.baseline,
        note:`This lamp carries at most one flask load of ${lamp.baseline} minutes. Fuel burns while lit and carried.`,
        ...(lamp.rate?{rate:lamp.rate}:{})};
}
export const toolsPanelDiscovered = (rows,lamp) => rows.length>0||!!lamp?.held;
export function repairWorkPresentation(job,{location,idle,repairBlocked}) {
    if(!job)return null;
    const pausedReason=location!==job.location?`away from the ${job.location} bench`:!idle?'busy with another activity':repairBlocked||'';
    return {pausedReason,line:pausedReason
        ? `Repair paused (${pausedReason}): ${Math.ceil(job.minutesLeft)} of ${job.total} minutes remain.`
        : `Repairing ${job.name}: ${Math.ceil(job.minutesLeft)} of ${job.total} minutes left at the ${job.location} bench. Time passes while you stay here and do nothing else.`};
}
// Place service in the workspace (UR1): your tools, their verb numbers and condition, and hand
// repair (quote, then commit). Coin repair stays in the Equipment durability panel.
export function createToolsPanel({read, quote, execute, cancel, discovered}) {
    const panel = node('section'); panel.id = 'tools_panel'; panel.className = 'expedition_panel'; panel.dataset.surfaceType = 'place-service';
    const intro = node('p'), lampSection=node('div'), lampFuel=createMeterBar(), job = node('div'), work = createWorkStatusView(), list = node('div'), detail = node('div'), notice = node('p');
    lampSection.className='tools-lamp-status';
    notice.setAttribute('role', 'status'); detail.dataset.toolsQuote = '';
    panel.append(node('h2', 'Tools'), intro, lampSection, job, work.node, list, notice);
    let selected = null, signature = '';const previousConditions=new Map(), conditionBars=new Map();
    function render() {
        const view = read(), q = selected ? quote({kind: 'hand', key: selected}) : null;
        const next = JSON.stringify([view, q, notice.textContent]); if (next === signature) return; signature = next;
        intro.textContent = view.enabled ? 'Work wears your tools a little each completed gathering round. A broken tool stops work; you can improvise at worse rates or repair it here by hand.'
            : 'Tool wear follows Equipment durability, which is off. Rates below are your tools as they are today.';
        const fuelSpec=lampFuelMeterSpec(view.lamp);lampSection.replaceChildren();lampSection.hidden=!fuelSpec;
        if(fuelSpec){lampFuel.update(fuelSpec);const charges=node('span','▣'.repeat(Math.min(12,view.lamp.packFlasks))+(view.lamp.packFlasks>12?` +${view.lamp.packFlasks-12}`:''));charges.className='lamp-flask-charges';charges.setAttribute('aria-label',`${view.lamp.packFlasks} loose oil flasks, one full refill per flask`);charges.title='Each square is one actual carried oil flask, separate from fuel already in the lamp.';lampSection.append(node('p',`${view.lamp.name}: ${view.lamp.lit?'lit':'out'}${view.lamp.shining?' and shining':''}. ${view.lamp.packFlasks} loose ${view.lamp.oilName} flask${view.lamp.packFlasks===1?'':'s'} in your pack.`),charges,lampFuel.node);}
        job.replaceChildren();
        if (view.job) {
            const j = view.job;
            const state=repairWorkPresentation(j,view),line = node('p',state.line);
            work.update({subject:`repair:${j.key}`,label:`Repairing ${j.name}`,total:j.total,remaining:j.minutesLeft,unit:'minutes',completionText:'Repair completed',stage:{index:1,count:1,label:'hand repair'},...(state.pausedReason?{pausedReason:state.pausedReason}:{})});
            const stop = node('button', j.spent.length ? 'Cancel repair · return materials' : 'Cancel repair'); stop.type = 'button'; stop.dataset.toolsCancel = ''; stop.title = j.spent.length ? `Cancels this repair and returns ${j.spent.map(m => `${m.count} ${m.id}`).join(', ')}.` : 'Cancels this repair. Nothing was spent.';
            stop.onclick = () => { try { cancel(); notice.textContent = 'Repair cancelled.'; } catch (e) { notice.textContent = e.message; } render(); };
            job.append(line, stop);
        } else work.update(null);
        list.replaceChildren();
        for(const key of previousConditions.keys())if(!view.rows.some(r=>r.key===key)){previousConditions.delete(key);conditionBars.delete(key);}
        for (const row of view.rows) {
            const line = node('div'); line.dataset.panelRow = ''; line.dataset.toolRow = row.key; line.className = 'tools-row';
            const p = row.profile, state = row.condition <= 0 && view.enabled ? 'broken' : row.equipped ? 'equipped' : 'carried';
            const cond = view.enabled && row.bound ? ` · condition ${Math.round(row.condition)}/${Math.round(row.max)}` : '';
            if(view.enabled&&row.bound){let bar=conditionBars.get(row.key);if(!bar){bar=createMeterBar();conditionBars.set(row.key,bar);}const previous=previousConditions.get(row.key),change=previous&&(previous.value!==row.condition||previous.max!==row.max)?{subject:row.key,previous:previous.value,previousMax:previous.max,current:row.condition,lifetime:'observation of this copy'}:previous?.change||null;bar.update({id:`tool-condition:${row.key}`,subject:row.key,label:`${row.name} condition`,kind:'pool',value:row.condition,max:row.max,note:'Condition belongs to this carried tool copy. Hand repair changes it only when the repair finishes.',...(change?{change}:{})});line.append(bar.node);previousConditions.set(row.key,{value:row.condition,max:row.max,change});}
            const bonus = p.levels ? `+${p.levels} ${Object.keys(p.bonus).join('/')} levels` : 'no skill bonus';
            const summary = node('p', `${row.name} (${state}) · ${VERB_LABEL[p.verb]} ${bonus} · precision ${p.precision} · hardness ${p.hardness}${cond}`);
            summary.title = `Improvised fallback: ${p.improvised.means}, ${pct(p.improvised.speed)} speed, ${pct(p.improvised.yield)} find chance. Hand repair: ${p.repair.skill} ${p.repair.level}+, ${p.repair.station.tag} station, ${p.repair.materials.map(m => `${m.count} ${m.id}`).join(', ')}. Short inputs still work, with a worse result.`;
            const ask = node('button', 'Repair by hand…'); ask.type = 'button'; ask.dataset.toolsQuoteFor = row.key;
            ask.disabled = !view.enabled || !row.bound || row.condition >= row.max || !!view.job;
            ask.title = view.job ? 'Finish or cancel the current repair first.' : !view.enabled ? 'Turn on Equipment durability in Settings to track tool wear.' : !row.bound ? 'Equip this tool once with durability on so it has its own condition.' : row.condition >= row.max ? 'This tool is at its best condition.' : 'See what a hand repair needs. Quoting uses nothing.';
            ask.onclick = () => { selected = row.key; notice.textContent = ''; render(); detail.scrollIntoView?.({block: 'nearest'}); };
            line.append(summary, ask); list.append(line);
            // The quote opens under its tool so it stays in view without scrolling.
            if (row.key === selected) line.append(detail);
        }
        if (!view.rows.length) list.append(node('p', 'You carry no tools.'));
        detail.replaceChildren();
        if (q && !detail.isConnected) list.append(detail);
        if (q) {
            detail.append(node('h3', `Hand repair quote: ${q.name ?? 'tool'}`));
            if (q.inputs.length) {
                const needs = node('ul'); needs.dataset.toolsInputs = '';
                for (const i of q.inputs) { const li = node('li', `${i.met ? 'Met' : 'Short'}: ${i.label}`); li.dataset.met = String(i.met); needs.append(li); }
                detail.append(needs,
                    node('p', `Expected: ${pct(q.chance)} success, proposed restoration about ${Math.round(q.restore)} (condition ${Math.round(q.condition)}/${Math.round(q.max)}) over ${q.minutes} minutes.`),
                    node('p', q.failure),
                    node('p', q.inputs.every(i => i.met) ? 'Quoting uses nothing.' : 'Short inputs lower the result; you can still try. Quoting uses nothing.'));
            }
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
    render(); return {render,reset(){previousConditions.clear();conditionBars.clear();selected=null;signature='';}};
}
