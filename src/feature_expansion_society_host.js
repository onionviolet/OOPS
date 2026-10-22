import {assertAgreedDutySocietyCommandAdmission,agreedDutySocietyCommandAdmission,agreedDutyFilterSocietyActions} from './agreed_duty_host.js';
import {SOCIETY_IDS, societyDefinitions, societyFacts, societyWorkPlans} from './feature_expansion_society.js';
import {enrollSimulation, commitSimulationCommand, previewSimulationCommand, cancelSimulationJob, simulationFacts,simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {assert, meets} from './simulation_contracts.js';
import {createWorkPlanRegistry, startWorkPlan, controlWorkPlan, workPlanView} from './feature_expansion_work_plan.js';

export {societyFacts};
export const createSocietyWorkPlanRegistry = registry => createWorkPlanRegistry(societyWorkPlans,registry.simulation);
export const societyContext = (state, context) => ({...context,facts:{...context.facts,...societyFacts(state,context)}});
const known = state => !!state.actors.player.facts[`${SOCIETY_IDS.prefix}.introduced`];
const planRegistry = registry => registry.workPlans || createSocietyWorkPlanRegistry(registry);

export function beginSociety(state, registry, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && !known(state), 'This household meeting is stale or already recorded.');
    context = societyContext(state,context);
    const enrolled = state.simulation ? {state,...context,acquisitions:[],unlocks:[]} : enrollSimulation(state,registry,context,expectedSequence);
    const out = commitSimulationCommand(enrolled.state,registry,{id:SOCIETY_IDS.begin},societyContext(enrolled.state,
        {...context,external:enrolled.external,gameplay:enrolled.gameplay,vitals:enrolled.vitals || context.vitals,equipment:enrolled.equipment || context.equipment}),enrolled.state.sequence);
    out.acquisitions = [...(enrolled.acquisitions || []),...(out.acquisitions || [])];
    out.unlocks = [...(enrolled.unlocks || []),...(out.unlocks || [])];
    return out;
}

export function commitSocietyAction(state, registry, command, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && context.actorId === 'player', 'This household action is stale or unbound.');
    if(command.type === 'begin') return beginSociety(state,registry,context,expectedSequence);
    assert(state.simulation && known(state), 'Meet the household work circle first.');
    context = societyContext(state,context);
    if(command.type === 'plan_start') return startWorkPlan(state,registry,planRegistry(registry),command.id,context,expectedSequence);
    if(command.type === 'plan_control') return controlWorkPlan(state,registry,command,context,expectedSequence);
    if(command.type === 'cancel_job') {
        const job = state.simulation.jobs.find(j => j.id === command.id && j.actorId === 'player');
        assert(job && registry.simulation.commands.get(job.commandId)?.group === 'feature_society', 'No accepted household job matches this cancellation.');
        return cancelSimulationJob(state,registry,job.id,context,expectedSequence);
    }
    assert(command.type === 'command', 'Unsupported household action.');
    assertAgreedDutySocietyCommandAdmission(state,command.id);
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === 'feature_society' && d.actorId === 'player' && d.id !== SOCIETY_IDS.begin, 'Unsupported household command.');
    assert(command.targetId == null || command.targetId === d.targetId, 'Choose the actual declared participant.');
    return commitSimulationCommand(state,registry,{id:d.id},societyContext(state,{...context,targetId:d.targetId || null}),expectedSequence);
}

export function societyPeopleView(state) {
    if(!known(state)) return [];
    const knownRecords = state.simulation?.knowledge.player || {}, ids = SOCIETY_IDS;
    return [[ids.household,'Hessa, household keeper',['meeting','home.']],
        [ids.craftsperson,'Orr, local joiner',['meeting','personal.','apprentice.lessonTerms']],
        [ids.apprentice,'Vale, prospective apprentice',['meeting','apprentice.']]].map(([id,name,prefixes]) => {
            const entries = Object.entries(knownRecords).filter(([key]) => prefixes.some(prefix => key.startsWith(`${ids.prefix}.${prefix}`)));
            return {id,name,location:'Last met: Village',details:entries.map(([,r]) => r.value),
                memories:entries.map(([key,r]) => ({id:key,at:r.at,text:r.value}))};
        });
}

export function societyPresentation(state, registry, context) {
    context = societyContext(state,context);
    const introduced = known(state), actions = [], s = state.simulation;
    const canBegin = !introduced && context.actorId === 'player' && context.facts.location === 'Village' &&
        context.facts['village.elderMet'] === true && context.facts['society.clockSupported'] && !context.busy;
    if(introduced) {
        const facts = simulationFacts(state,context,registry);
        for(const d of societyDefinitions.commands) {
            if(!agreedDutySocietyCommandAdmission(state,d.id).allowed)continue;
            if(d.actorId !== 'player' || d.id === SOCIETY_IDS.begin || d.once && state.actors.player.completed[d.id] || !meets(d.visibleWhen,facts)) continue;
            const p = previewSimulationCommand(state,registry,d.id,societyContext(state,{...context,targetId:d.targetId || null}));
            if(!p.visible) continue;
            // Residency and a definition are not permission to publish private
            // purse/build/AI facts. Only legal quotes and player's own reports.
            actions.push({id:d.id,label:d.label,description:d.description || '',targetId:d.targetId || null,eligible:p.eligible,
                reasons:p.eligible ? [] : p.reasons.map(reason => reason.startsWith('Requires ') ? 'The declared work, means, permission or result is not available yet.' : reason),
                duration:p.duration,cancellation:d.cancellation || 'none',costs:p.eligible ? p.costs : []});
        }
    }
    const definitions = planRegistry(registry), anyPlan = introduced ? workPlanView(state,registry,definitions,context) : null;
    const savedPlan = anyPlan && societyWorkPlans.some(d=>d.id===anyPlan.definitionId) ? anyPlan : null;
    const availablePlans = introduced ? [...definitions.values()].filter(d => societyWorkPlans.some(p=>p.id===d.id) && meets(d.visibleWhen,simulationFacts(state,context,registry))).map(d => {
        const reasons=[];
        if(anyPlan&&!['complete','cancelled'].includes(anyPlan.status))reasons.push('Finish or cancel your existing itinerary first.');
        if(!meets(d.requires,simulationFacts(state,context,registry)))reasons.push('Hear and accept this itinerary’s known origin first.');
        if(context.busy||simulationOccupiesActor(state,'player')||state.pending.some(j=>j.context.actorId==='player')||activePractice(state.actors.player)||s.programs.player?.status==='running')reasons.push('Finish your current native activity or routine first.');
        return {id:d.id,label:d.label,eligible:!reasons.length,reasons,steps:d.steps.length};
    }) : [];
    const job = s?.jobs.find(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === 'feature_society');
    const records = Object.entries(s?.knowledge.player || {}).filter(([key]) => key.startsWith(`${SOCIETY_IDS.prefix}.`)).map(([id,r]) => ({id,at:r.at,text:r.value}));
    return {introduced,canBegin,visible:introduced || canBegin,actions,records,people:societyPeopleView(state),plans:availablePlans,plan:savedPlan,
        job:job ? {id:job.id,label:job.label,remaining:Math.max(0,job.due-state.clock),cancellation:job.cancellation} : null};
}

const node = (tag, text = '') => {const element = document.createElement(tag); element.textContent = text; return element;};

// Native Notebook factory. Render is a read-only projection with stable keyed
// controls; the host callback publishes every action and cursor together.
export function createSocietyPanel({registry, read, command}) {
    const element = node('details'), summary = node('summary','Household work & apprenticeship');
    element.id = 'feature_society_panel'; element.className = 'expedition_panel'; summary.tabIndex = 0;
    const status = node('p'), intro = node('p','Paid local work, willing lessons and separate rights. Future steps reserve nothing.'),
        work = node('section'), itinerary = node('section'), itineraryText = node('p'), itineraryReason = node('p'), steps = node('ol'),
        controls = node('div'), actions = node('div'), plans = node('div'), records = node('details'), recordList = node('ul');
    status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
    records.append(node('summary','Your dated household reports'),recordList);
    itinerary.append(itineraryText,itineraryReason,steps,controls);
    element.append(summary,intro,status,work,itinerary,plans,actions,records);
    let sequence = null, notice = '', current = null, job = null, canWrite = true;
    const actionRows = new Map(), planRows = new Map(), recordRows = new Map();
    const remove = entry => {if(entry.contains(document.activeElement)) {element.open = true; summary.focus();} entry.remove();};
    const button = (label, action) => {
        const control = node('button',label); control.type = 'button';
        control.addEventListener('click',() => {try {command({...action(),sequence}); notice = 'Progress saved.';} catch(error) {notice = error.message || String(error);} render();});
        return control;
    };
    const begin = button('Meet the household work circle',() => ({type:'begin'})); element.insertBefore(begin,work);
    const workText = node('p'), cancelJob = button('Cancel accepted work and return its reservation',() => ({type:'cancel_job',id:job.id}));
    work.append(workText,cancelJob);
    const pause = button('Pause future steps',() => ({type:'plan_control',action:'pause',cursorId:current.id})),
        resume = button('Resume from the next legal step',() => ({type:'plan_control',action:'resume',cursorId:current.id})),
        cancelPlan = button('Cancel future steps',() => ({type:'plan_control',action:'cancel',cursorId:current.id})),
        forget = button('Remove ended itinerary',() => ({type:'plan_control',action:'forget',cursorId:current.id}));
    controls.append(pause,resume,cancelPlan,forget);
    function render() {
        const snapshot = read(), v = societyPresentation(snapshot.state,registry,snapshot.context);
        sequence = snapshot.state.sequence; current = v.plan; job = v.job; canWrite = snapshot.canWrite !== false;
        element.hidden = !v.visible; begin.hidden = !v.canBegin; begin.disabled = !canWrite;
        status.textContent = notice || snapshot.error || ''; status.hidden = !status.textContent;
        work.hidden = !job;
        if(job) {workText.textContent = `${job.label} · ${job.remaining} min. Only this job has reserved inputs.`; cancelJob.hidden = job.cancellation === 'none'; cancelJob.disabled = !canWrite;}
        itinerary.hidden = !current;
        if(current) {
            itineraryText.textContent = `${current.label} · ${current.status} · ${Math.min(current.index+1,current.total)}/${current.total}`;
            itineraryReason.textContent = `${current.reason || 'Each next step rechecks actual people, permission, stock and location.'} ${current.lastResult.text}`;
            const signature = JSON.stringify(current.steps);
            if(steps.dataset.signature !== signature) {steps.replaceChildren(...current.steps.map(step => node('li',`${step.label} · ${step.status}`))); steps.dataset.signature = signature;}
            pause.hidden = !current.canPause; resume.hidden = !current.canResume; cancelPlan.hidden = !current.canCancel;
            forget.hidden = !['complete','cancelled'].includes(current.status) || !current.canForget;
            for(const b of [pause,resume,cancelPlan,forget]) b.disabled = !canWrite;
        }
        for(const action of v.actions) {
            let row = actionRows.get(action.id);
            if(!row) {const root = node('section'), description = node('p'), reasons = node('p'); row = {root,description,reasons,action};
                row.button = button(action.label,() => ({type:'command',id:row.action.id,targetId:row.action.targetId}));
                root.className = 'expedition_card'; root.append(row.button,description,reasons); actions.append(root); actionRows.set(action.id,row);}
            row.action = action; row.button.textContent = action.label; row.button.disabled = !canWrite || !action.eligible;
            row.description.textContent = action.description || `${action.duration} played min. ${action.cancellation === 'refund' ? 'Cancellation returns reserved inputs.' : 'Only the stated immediate exchange is accepted.'}`;
            row.reasons.textContent = action.reasons.join(' '); row.reasons.hidden = action.eligible;
        }
        for(const [id,row] of actionRows) if(!v.actions.some(a => a.id === id)) {remove(row.root); actionRows.delete(id);}
        for(const p of v.plans) {
            let row = planRows.get(p.id);
            if(!row) {row = {plan:p}; row.button = button(`Start ${p.label}`,() => ({type:'plan_start',id:row.plan.id})); plans.append(row.button); planRows.set(p.id,row);}
            row.plan = p; row.button.disabled = !canWrite || !p.eligible;
        }
        for(const [id,row] of planRows) if(!v.plans.some(p => p.id === id)) {remove(row.button); planRows.delete(id);}
        for(const r of v.records) {let row = recordRows.get(r.id); if(!row) {row = node('li'); recordRows.set(r.id,row); recordList.append(row);} row.textContent = `Minute ${r.at}: ${r.text}`;}
        for(const [id,row] of recordRows) if(!v.records.some(r => r.id === id)) {remove(row); recordRows.delete(id);}
        records.hidden = !v.records.length;
        return v;
    }
    return {element,panel:element,render};
}
