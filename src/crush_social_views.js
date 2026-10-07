// Read-only joins: received conduct, your retained practical means and today's
// real action quotes. This module never reads NPC beliefs or pending outcomes.
import {CRUSH_SOCIAL_IDS as I, CRUSH_SOCIAL_ITEMS as K, crushSocialWorkPlans} from './crush_social_content.js';
import {crushSocialContext} from './crush_social_facts.js';
import {SOCIETY_IDS as S} from './feature_expansion_society.js';
import {simulationFacts, previewSimulationCommand, simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {meets} from './simulation_contracts.js';
import {workPlanView} from './feature_expansion_work_plan.js';
import {projectSimulationAftermath, projectActionAftermath, projectSimulationActionLegibility,
    projectActionLegibility, projectAcceptedWorkLegibility, playerActionDisclosure} from './action_legibility.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {partyHelperReasons} from './party_battle.js';
import {ROAD_RIVAL} from './frontier_campaign.js';
import {remainderLivelihoodWindow} from './audit_remainder_livelihood_facts.js';

const P = I.prefix, visitorId = I.visitor, known = state => state.simulation?.knowledge?.player || {};
const labels = {player: {known: true, label: 'You'}, [visitorId]: {known: true, label: 'Tamsin'},
    [PARTY_HELPER]: {known: true, label: 'Lio'}, [ROAD_RIVAL]: {known: true, label: 'Mara'}};
const sequenceOfCause = cause => Number(cause?.match(/^(?:simulation|party-result):([1-9][0-9]*)$/)?.[1]) || 0;
const receiptSequence = (state, r) => r.receiptSequence ?? sequenceOfCause(known(state)[r.id]?.cause);
const newest = state => (a, b) => (b.at || 0) - (a.at || 0) || receiptSequence(state, b) - receiptSequence(state, a);
const publicFact = (label, valueKnown = true, extra = {}) => ({known: true, valueKnown, label, ...extra});
const disclosure = (state, context, personId, termsKnown) => playerActionDisclosure({state, context,
    items: {[K.wood]: {known: true, label: 'Rough wood log'}, [K.kit]: {known: true, label: 'Prepared survey kit'}},
    people: {player: labels.player, [personId]: {...labels[personId], termsKnown}},
    locations: {Village: {known: true, label: 'Village'}, Shack: {known: true, label: 'your Shack'}},
    facts: {'crushSocial.local': publicFact('Supported Village contact'), 'crushSocial.metHelp': publicFact('Your earlier actual repair meeting'),
        'crushSocial.playerSupported': publicFact('Your living, mobile body with two usable hands'),
        'crushSocial.chosen': publicFact('An outing choice'), 'crushSocial.tamsinSupported': publicFact('Tamsin’s current ability to cooperate', false),
        'crushSocial.tamsinWilling': publicFact('Tamsin’s offered consent', false),
        [`actor.${P}.offerHeard`]: publicFact('The heard outing terms'), [`actor.${P}.reported`]: publicFact('The later actual outing report'),
        [`actor.${P}.choice`]: publicFact('Your completed outing choice', true, {values: {patient: 'patient testing', quick: 'a quicker carry'}}),
        'knowledge.promise.bracing.understood': publicFact('Your learned bracing grip'),
        'knowledge.promise.bracing.basis': publicFact('Actual practiced instruction', true, {values: {instruction: 'practiced instruction'}}),
        'faculty.promise.bracing_control.active': publicFact('Your currently usable practiced bracing'),
        strength: publicFact('Your strength'), 'actor.field.member': publicFact('Your field association membership'),
        'actor.party.met': publicFact('Your actual meeting with Lio'),
        'auditRemainder.enrolled': publicFact('Your optional local-project enrollment'),
        'remainder.livelihood.local': publicFact('Supported local Village work'),
        'remainder.livelihood.lioTerms': publicFact('Lio’s actually heard packing terms'),
        'remainder.livelihood.window4': publicFact('More than four played minutes remain before the disclosed 18:00 closing'),
        'remainder.livelihood.lio.supported': publicFact('Lio’s disclosed body, kit, consent and bench support', false),
        'remainder.livelihood.lio.unfunded': publicFact('The one packing sponsorship is still unchosen'),
        'remainder.livelihood.lio.funded': publicFact('Your actually funded packing sponsorship'),
        'remainder.livelihood.lio.unfinished': publicFact('The sponsored packing result is still unfinished', false),
        'remainder.livelihood.lio.workerFree': publicFact('Lio can currently meet to return the supplied stock', false),
        'remainder.livelihood.lio.notWithdrawn': publicFact('Your sponsorship has not been withdrawn'),
        'remainder.livelihood.lio.complete': publicFact('Lio can hand over the two actual completed kits at this meeting', false),
        'remainder.livelihood.lio.notCollected': publicFact('Your completed kits have not already been collected')}});

function projectActions(state, registry, context, ids, personId, termsKnown) {
    const d = disclosure(state, context, personId, termsKnown);
    return ids.map(commandId => projectSimulationActionLegibility({state, registry, context, commandId, disclosure: d})).filter(Boolean);
}

export function promiseReturnRecap(state, registry, context = {}) {
    context = crushSocialContext(state, context);
    const k = known(state), player = state.actors?.player;
    const records = [...projectSimulationAftermath({state, prefix: 'promise.', people: labels}),
        ...projectSimulationAftermath({state, prefix: `${P}.`, people: labels})];
    const actualReports = records.filter(r => r.id === 'promise.later' || r.id === `${P}.outing.report` ||
        ['patient', 'quick', 'declined'].some(route => r.id === `${P}.outing.${route}`) || r.id === `${P}.collaboration.result`);
    if(!actualReports.length) return {visible: false, records: [], actions: [], useful: [], job: null};
    const latest = [...actualReports].sort(newest(state))[0];
    const learned = k['promise.bracing']?.stage === 'understood' && !!player?.sources?.['promise.bracing_control'];
    const useful = [];
    if(learned) {
        const faculty = state.simulation?.faculties?.player?.['promise.bracing_control'], source = player.sources['promise.bracing_control'];
        const active = faculty?.active && faculty.awakened && !faculty.suppressed && (source.expiresAt == null || source.expiresAt > state.clock);
        useful.push({id: 'bracing', text: `Your actually learned bracing grip remains recorded. ${active ? 'It can support the known kit work when its other requirements are met.' : 'Its execution support is currently unavailable; the remembered lesson grants no replacement support.'}`});
    } else if(k['promise.bracing_report']) useful.push({id: 'description', text: 'You retain Tamsin’s bracing description. It is a recollection, so it gives no practiced control.'});
    if(k[`${P}.outing.patient`]) useful.push({id: 'wedge', text: 'Your completed patient check left its real stop wedge at the crossing. Reading this account does not return the spent log.'});
    if(k[`${P}.collaboration.result`]) useful.push({id: 'kit', text: 'The separately completed collaboration made one actual kit. Its received account remains even if you later spend the kit.'});
    const actions = projectActions(state, registry, context, [`${P}.outing_offer`, `${P}.outing_patient`, `${P}.outing_quick`,
        `${P}.report_patient`, `${P}.report_quick`, 'promise.lesson', `${P}.shared_pack_patient`, `${P}.shared_pack_quick`, 'promise.pack_brace'],
        visitorId, !!k[`${P}.outing.terms`]);
    const job = state.simulation?.jobs.find(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === 'promise');
    return {visible: true, local: context.facts.location === 'Village' && context.facts['crushSocial.local'], label: 'Returning to Tamsin',
        records: [latest], socialRecords: records.filter(r => r.id === `${P}.outing.terms` && !context.facts['crushSocial.chosen']),
        history: records.filter(r => r.id.startsWith(`${P}.`)).sort(newest(state)), useful, actions,
        job: job ? projectAcceptedWorkLegibility({job, clock: state.clock, actorId: 'player', label: job.label,
            disclosure: disclosure(state, context, visitorId, !!k[`${P}.outing.terms`]), context}) : null,
        terms: 'Retained reports are free to read. New work pays current wood, body effort, consent and played time; reading gives no kit, relationship reward or new agreement.'};
}

export function lioReturnRecap(state, registry, context = {}) {
    const k = known(state), p = state.actors?.player, met = p?.facts?.['party.met'] === true && !!k['party.lio'];
    if(!met) return {visible: false, records: [], actions: [], useful: [], comparisons: []};
    const person = state.simulation?.people?.[PARTY_HELPER];
    const local = context.facts?.location === 'Village' && p.worldId === I.world && !state.realmPrototype?.activeVisitId &&
        person?.life === 'alive' && person.location === 'Village' && state.actors?.[PARTY_HELPER]?.worldId === I.world;
    const livelihoodKnown = !!k['remainder_livelihood.lio.terms'] && state.auditRemainder?.schema === 1;
    const memories = (state.simulation?.relationships?.player?.[PARTY_HELPER]?.memories || []).filter(m =>
        m.text.startsWith('Agreed contest ') || m.text === 'Supplied a kit and time for actual rest and harness work.');
    const ownConduct = projectActionAftermath({records: memories.map((m, i) => ({id: `lio-conduct-${i}`, observerId: 'player', known: true,
        text: m.text, at: m.at, cause: m.cause, basis: {kind: 'observation', attributedTo: 'player'}})), people: labels})
        .map((r, i) => ({...r, receiptSequence: sequenceOfCause(memories[i].cause)}));
    const received = projectSimulationAftermath({state, prefix: 'remainder_livelihood.lio.report', people: labels});
    const records = [...ownConduct, ...received].sort(newest(state)).slice(0, 1);
    const actions = local ? projectActions(state, registry, context, ['party.prepare', 'party.rest',
        ...(livelihoodKnown ? ['remainder_livelihood.collect_lio', 'remainder_livelihood.withdraw_lio', 'remainder_livelihood.keep_lio'] : [])], PARTY_HELPER, true)
        .map(a => ({...a, action: a.id.startsWith('party.')
            ? {type: 'party_command', id: a.id, targetId: registry.simulation.commands.get(a.id).targetId || null}
            : {type: 'audit_remainder', id: a.id}})) : [];
    const bag = context.gameplay?.player?.inventory;
    const useful = [{id: 'ownership', text: records.length
        ? 'Your actual witnessed conduct and received results remain recorded. Earlier help neither repairs a later wound nor refills Lio’s effort.'
        : 'You retain Lio’s offered terms. A meeting or quoted plan grants no contest result, healing or packing output.'}];
    if(bag) useful.push({id: 'kits', text: `You currently carry ${bag[K.kit] || 0} Prepared survey kits. Known preparation and rest still spend their actual inputs.`});
    if(p.sources?.['frontier.rival_insight']) useful.push({id: 'insight', text: 'Your own earned road-contest insight remains acquired; it supplies none of Lio’s kit, body or guard effort.'});
    const comparisons = actions.filter(r => r.id === 'party.prepare').map(r => ({...r,
        allocation: 'You spend three played minutes and remain occupied. Lio stays free of this personal job; his other actual commitments still apply.'}));
    if(local && livelihoodKnown) {
        const id = 'remainder_livelihood.fund_lio', d = registry.simulation.commands.get(id);
        if(d) {
            const ctx = {...context, targetId: PARTY_HELPER}, preview = previewSimulationCommand(state, registry, id, ctx), terms = disclosure(state, context, PARTY_HELPER, true);
            // Keep this actually heard finite option in the comparison after
            // funding/declining. A current completed claim cannot fund it again.
            terms.reasons = [{known: true, match: 'This unique claim is already held or settled.', text: 'This one finite packing sponsorship is already chosen.'}];
            const shift = projectActionLegibility({id, label: d.label, description: d.description, discovered: true,
                preview, definition: d, facts: simulationFacts(state, ctx, registry), disclosure: terms, context: ctx});
            if(shift) comparisons.push({...shift, action: {type: 'audit_remainder', id},
                allocation: 'Funding is immediate. Once Lio actually accepts the separate shift, he spends four played minutes and two of his own stamina and reserves his owned kit. He stays occupied while you can do other work. Its two actual kits need a separate collection.'});
        }
    }
    if(local && p.facts?.['party.invited'] && k['rival.notice'] && state.simulation?.people?.[ROAD_RIVAL]) {
        const d = registry.simulation.commands.get('rival.confront');
        if(d) {
            const ctx = {...context, targetId: ROAD_RIVAL}, preview = previewSimulationCommand(state, registry, d.id, ctx);
            const disclosedReasons = [...partyHelperReasons(state, context)];
            if((context.external?.money || 0) < 1) disclosedReasons.push('The agreed assisted contest costs one native coin.');
            if((context.vitals?.player?.health || 0) <= 1) disclosedReasons.push('Recover before the contest.');
            if(preview.visible && state.simulation.people[ROAD_RIVAL].vitals?.health <= 1) disclosedReasons.push('Mara must recover before another contest.');
            if(!preview.visible) disclosedReasons.push('Meet Mara under her current agreed contest request.');
            const reasons = [...preview.reasons, ...disclosedReasons];
            const fee = {type: 'resource', native: true, actor: 'player', key: 'money', amount: -1};
            const terms = disclosure(state, context, PARTY_HELPER, true);
            terms.reasons = disclosedReasons.map(reason => ({known: true, match: reason, text: reason}));
            terms.people[ROAD_RIVAL] = {...labels[ROAD_RIVAL], termsKnown: true};
            const contest = projectActionLegibility({id: 'party.assisted_contest', label: 'Your already agreed contest with Lio', discovered: true,
                preview: {...preview, visible: true, eligible: preview.eligible && !reasons.length, reasons, duration: undefined, costs: [...preview.costs, fee]},
                definition: {...d, duration: undefined, costs: [...d.costs, fee], participants: ['player', PARTY_HELPER, ROAD_RIVAL], cancellation: 'forfeit'},
                disclosure: terms, context: ctx});
            if(contest) comparisons.push({...contest, action: {type: 'party_start'},
                allocation: 'The player, Lio and Mara are occupied while the contest runs. Duration is player driven; no guaranteed finishing time is quoted. Each player strike uses its current native stamina-efficiency cost; each guard spends Lio’s disclosed two stamina and one guard effort. Withdrawal retains wounds and spent costs.'});
        }
    }
    const window = local && livelihoodKnown ? remainderLivelihoodWindow(state, context) : null;
    const shift = local && livelihoodKnown && p.completed?.['remainder_livelihood.fund_lio'] ? state.simulation?.jobs.find(j =>
        j.actorId === PARTY_HELPER && j.commandId === 'remainder_livelihood.work_lio') : null;
    return {visible: true, local, label: records.length ? 'Returning to Lio' : 'Lio’s known uses of time', records, actions, useful, comparisons,
        schedule: window ? window.supported ? window.open ? `Disclosed 08:00–18:00 work window: ${window.remaining} played minutes remain.`
            : `Disclosed 08:00–18:00 work window is closed; opens in ${window.nextIn} played minutes.` : 'Current played-calendar support is unavailable.' : '',
        acceptedShift: shift ? `Your actually funded packing shift occupies Lio for ${Math.max(0, shift.due - state.clock)} more played minutes. Its frozen accepted terms remain separate from a new quote.` : '',
        terms: local ? 'This comparison reads only your retained conduct, Lio’s disclosed terms and current legal quotes. Reading consumes or restores nothing.'
            : 'Your retained accounts remain readable. Meet Lio again in the Village for current quotes and a new actual agreement.'};
}

export function crushSocialPresentation(state, registry, context = {}) {
    context = crushSocialContext(state, context);
    const facts = state.simulation ? simulationFacts(state, context, registry) : context.facts;
    const current = state.simulation && registry.workPlans ? workPlanView(state, registry, registry.workPlans, context) : null;
    const plan = current && crushSocialWorkPlans.some(d => d.id === current.definitionId) ? current : null;
    const plans = crushSocialWorkPlans.filter(d => registry.workPlans?.has(d.id) && meets(d.visibleWhen, facts)).map(d => {
        const reasons = [];
        if(current && !['complete', 'cancelled'].includes(current.status)) reasons.push('Finish or cancel the current itinerary first.');
        if(!meets(d.requires, facts)) reasons.push('Hear the actual origin and restore the declared local work permissions first.');
        if(context.busy || simulationOccupiesActor(state, 'player') || state.pending?.some(j => j.context.actorId === 'player') ||
            activePractice(state.actors.player) || state.simulation?.programs?.player?.status === 'running') reasons.push('Finish the current activity or routine first.');
        return {id: d.id, label: d.label, eligible: !reasons.length, reasons,
            description: d.id === I.preparation
                ? 'From Hessa’s heard terms: supply two actual logs for her two coins, witness bounded permission, then wait for Orr’s funded six-minute repair. Completed steps stay settled. This phase stops before the manual “Meet Hessa and inspect the retained repair” conversation; it accepts no lesson, apprenticeship or rights handoff.'
                : 'After your actual repair report and separately learned personal lesson, explicitly use that known method once. Travel to the Shack yourself, then spend one actual log, one stamina and four played minutes. This phase hears no report and accepts no new lesson or right.'};
    });
    const lio = lioReturnRecap(state, registry, context);
    const householdKnown = !!known(state)[`${S.prefix}.home.terms`];
    return {visible: householdKnown || !!plan || lio.visible, plans, plan, lio,
        manualReport: plan?.definitionId === I.preparation && plan.status === 'complete' && !state.actors.player.completed?.[`${S.prefix}.hear_home`]
            ? 'Preparation ended. Meet Hessa through “Meet Hessa and inspect the retained repair” in Household work & apprenticeship; her report is still your next choice.' : ''};
}

const node = (tag, text = '') => {const n = document.createElement(tag); n.textContent = text; return n;};
const actionLine = a => [a.label, a.duration?.text, ...a.costs.map(c => c.text), ...a.blockers.map(b => b.text)].filter(Boolean).join(' ');

// Root may mount this in the existing feature Notebook. All writes call the
// provided publisher callback; the Lio comparison itself is strictly read-only.
export function createCrushSocialPanel({registry, read, command}) {
    const element = node('details'), summary = node('summary', 'Finite preparation & Village return');
    element.id = 'crush_social_panel'; element.className = 'expedition_panel'; summary.tabIndex = 0;
    const status = node('p'), plans = node('div'), cursor = node('section'), cursorText = node('p'), cursorSteps = node('ol'), manual = node('p'), controls = node('div'),
        lio = node('section'), lioTitle = node('h4', 'Returning to Lio'), lioRecords = node('div'), lioUseful = node('div'), lioSchedule = node('p'), lioQuotes = node('div');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    cursor.append(cursorText, cursorSteps, manual, controls); lio.append(lioTitle, lioRecords, lioUseful, lioSchedule, lioQuotes);
    element.append(summary, status, plans, cursor, lio);
    let notice = '', current = null, sequence = null;
    const rows = new Map(), lioRows = new Map(), lioTerms = node('p'); lioQuotes.append(lioTerms);
    const remove = root => {if(root.contains(document.activeElement)) summary.focus(); root.remove();};
    const button = (label, getAction) => {const b = node('button', label); b.type = 'button';
        b.addEventListener('click', () => {try {command({...getAction(), sequence}); notice = 'Progress saved.';} catch(e) {notice = e.message;} render();}); return b;};
    const pause = button('Pause future preparation', () => ({type: 'plan_control', action: 'pause', cursorId: current.id}));
    const resume = button('Resume the next legal preparation step', () => ({type: 'plan_control', action: 'resume', cursorId: current.id}));
    const cancel = button('Cancel future preparation', () => ({type: 'plan_control', action: 'cancel', cursorId: current.id}));
    const forget = button('Remove the ended preparation phase', () => ({type: 'plan_control', action: 'forget', cursorId: current.id}));
    controls.append(pause, resume, cancel, forget);
    function render() {
        const snapshot = read(), v = crushSocialPresentation(snapshot.state, registry, snapshot.context), canWrite = snapshot.canWrite !== false && !snapshot.error;
        sequence = snapshot.state.sequence; current = v.plan; element.hidden = !v.visible;
        status.textContent = snapshot.error || notice; status.hidden = !status.textContent;
        for(const p of v.plans) {
            let row = rows.get(p.id);
            if(!row) {const root = node('section'), description = node('p'), reasons = node('p'); row = {root, description, reasons, plan: p};
                row.button = button(`Start ${p.label}`, () => ({type: 'plan_start', id: row.plan.id}));
                root.className = 'expedition_card'; root.append(row.button, description, reasons); plans.append(root); rows.set(p.id, row);}
            row.plan = p; row.button.disabled = !canWrite || !p.eligible; row.description.textContent = p.description;
            row.reasons.textContent = p.reasons.join(' '); row.reasons.hidden = !row.reasons.textContent;
        }
        for(const [id, row] of rows) if(!v.plans.some(p => p.id === id)) {remove(row.root); rows.delete(id);}
        cursor.hidden = !current;
        if(current) {cursorText.textContent = `${current.label} · ${current.status} · ${current.index}/${current.total}. ${current.reason || 'Each next step rechecks its current owner, contact and means.'}`;
            const signature = JSON.stringify(current.steps);
            if(cursorSteps.dataset.signature !== signature) {cursorSteps.replaceChildren(...current.steps.map(s => node('li', `${s.label} · ${s.status}`))); cursorSteps.dataset.signature = signature;}
            manual.textContent = v.manualReport; manual.hidden = !v.manualReport;
            pause.hidden = !current.canPause; resume.hidden = !current.canResume; cancel.hidden = !current.canCancel;
            forget.hidden = !['complete', 'cancelled'].includes(current.status) || !current.canForget;
            for(const b of [pause, resume, cancel, forget]) b.disabled = !canWrite;}
        lio.hidden = !v.lio.visible;
        if(v.lio.visible) {
            lioTitle.textContent = v.lio.label;
            lioRecords.replaceChildren(...v.lio.records.map(r => node('p', `${r.basisLabel}${r.sourceLabel ? ` · ${r.sourceLabel}` : ''}: ${r.text} ${r.timeText || ''}`)));
            lioUseful.replaceChildren(...v.lio.useful.map(r => node('p', r.text)));
            lioSchedule.textContent = [v.lio.schedule, v.lio.acceptedShift].filter(Boolean).join(' '); lioSchedule.hidden = !lioSchedule.textContent;
            const comparisons = [...v.lio.comparisons, ...v.lio.actions.filter(a => !v.lio.comparisons.some(c => c.id === a.id))];
            lioTerms.textContent = v.lio.terms;
            for(const a of comparisons) {
                let row = lioRows.get(a.id);
                if(!row) {const root = node('section'), quote = node('p'); row = {root, quote, action: a};
                    row.button = button(`Do now: ${a.label}`, () => row.action.action);
                    root.className = 'expedition_card'; root.append(row.button, quote); lioQuotes.append(root); lioRows.set(a.id, row);}
                row.action = a; row.button.textContent = `Do now: ${a.label}`;
                row.button.disabled = !canWrite || !a.control.enabled;
                row.quote.textContent = `${actionLine(a)} ${a.allocation || ''}`;
            }
            for(const [id, row] of lioRows) if(!comparisons.some(a => a.id === id)) {remove(row.root); lioRows.delete(id);}
        } else {
            for(const row of lioRows.values()) remove(row.root);
            lioRows.clear();
        }
        return v;
    }
    render(); return {element, panel: element, render};
}

export {actionLine as crushSocialActionLine};
