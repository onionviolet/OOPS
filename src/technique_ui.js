import {evaluateAction} from "./expansion_engine.js";
import {activePractice, techniqueFacts, PRACTICE_RESPONSES, UNDERSTANDING_ORIGINS, understandingOrigin} from "./techniques.js";
import {RAT_STEP} from "./technique_content.js";
import {projectDiscoveryFeature,projectTechniqueDiscovery,projectAcceptedWork} from './skill_discovery.js';

export function createTechniquePanel({registry, read, command, answer, cancel}) {
    const panel = document.createElement("details"); panel.className = "expedition_panel"; panel.id = "technique_panel";
    const node = (tag, text, className) => {
        const e = document.createElement(tag); e.textContent = text; if(className) e.className = className; return e;
    };
    const heading = node("summary", "Movement observations"); panel.append(heading);
    const body = node("div", ""); panel.append(body);
    const introduction = node("p", ""); body.append(introduction);
    const progress = node("p", "", "expedition_state"), provenance = node("p", "", "expedition_preview");
    const notice = node("p", "", "expedition_notice"); notice.setAttribute("role", "status");
    body.append(progress, provenance, notice);
    let message = "", signature;
    const cards = [];
    for(const action of registry.actions.values()) if(action.group === "technique") {
        const card = node("div", "", "expedition_card"), button = node("button", "");
        button.type = "button";
        const preview = node("p", "", "expedition_preview"), requirements = node("p", "", "expedition_requirements");
        const description=node('p','');card.append(button,description,preview,requirements);body.append(card);
        button.addEventListener("click", () => {
            const {state} = read();
            try {command(action.id, state.sequence); message = "Saved. The technique step is committed.";}
            catch(error) {message = error.message;}
            render(true);
        });
        cards.push({action, card, button, description, preview, requirements});
    }
    const exercise = node("div", "", "expedition_card"); exercise.id = "technique_exercise";
    const exerciseInfo=node('p','');exercise.append(exerciseInfo);
    const cue = node("p", "", "technique_cue"), feedback = node("p", "", "expedition_preview");
    exercise.append(cue, feedback);
    const controls = node("div", "", "technique_responses"); exercise.append(controls);
    const buttons = [];
    for(const [response, label] of Object.entries(PRACTICE_RESPONSES)) {
        const button = node("button", ""); button.type = "button"; controls.append(button); buttons.push(button);
        button.addEventListener("click", () => {
            const {state} = read(), active = activePractice(state.actors.player);
            if(!active) return;
            try {
                const result = answer(active[1].practice.id, response, state.sequence);
                message = result.correct ? "Good read. Response saved." : "That response missed the cue. Response saved; the drill still teaches.";
            } catch(error) {message = error.message;}
            render(true);
        });
    }
    const cancelButton = node("button", ""); cancelButton.type = "button";
    cancelButton.addEventListener("click", () => {
        const {state} = read(), active = activePractice(state.actors.player); if(!active) return;
        try {cancel(active[1].practice.id, state.sequence); message = "Cancelled and saved. No practice reward; fee forfeited.";}
        catch(error) {message = error.message;}
        render(true);
    });
    exercise.append(cancelButton); body.append(exercise);
    const waiting = node("p", "", "expedition_preview"), cancelTimed = node("button", "Cancel timed practice · no practice reward"); cancelTimed.type="button";
    cancelTimed.dataset.techniqueCancel="timed";
    cancelTimed.addEventListener("click", () => {
        const {state,enabled,error}=read(); if(!enabled || error) return;
        const job=state.pending.find(j=>j.context.actorId === "player" && j.actionId.startsWith("frontier.rat_step.") && j.cancellation !== "none"); if(!job) return;
        try {cancel(job.id,state.sequence); message="Timed practice cancelled. No practice reward earned.";} catch(error) {message=error.message;} render(true);
    }); body.append(waiting,cancelTimed);
    function render(force = false) {
        if(!panel.isConnected) document.getElementById("location_actions_div").append(panel);
        const {state, context, error, enabled} = read(), actor = state.actors.player;
        const nextSignature = JSON.stringify([actor.techniques, state.sequence, state.pending, context.facts, context.external, error, enabled, message]);
        if(!force && signature === nextSignature) return;
        signature = nextSignature;
        const record = actor.techniques[RAT_STEP], facts = techniqueFacts(actor, registry, context);
        const job = state.pending.find(j => j.actionId.startsWith("frontier.rat_step."));
        const active = activePractice(actor);
        const knownLead=context.facts['village.elderMet']===true;
        const discovery=projectTechniqueDiscovery({id:RAT_STEP,label:'Rat-step',record,eligible:facts[`technique.${RAT_STEP}.executable`],hint:knownLead?{known:true,id:'field-edge-notes',label:'Movement observations',text:'Watch visible movement at the field edge.'}:null});
        panel.hidden=!discovery&&!active&&!job;
        heading.textContent = record?.observed ? "Rat-step" : "Movement observations";
        introduction.textContent = record?.observed ? "Observe the pattern, understand it, practice, then make it your own. Rat-step opens a footwork approach under Routes & supplies."
            : "Watch movement at the field edge. Further notes appear after an observation.";
        progress.hidden = !record?.observed;
        progress.textContent = record?.observed ? ["Observed", record?.understood ? `Understood via ${UNDERSTANDING_ORIGINS[understandingOrigin(record)]}` : "Not understood",
            record?.owned ? "Owned" : "Not owned", `Proficiency ${record?.proficiency || 0}/12 (execute at 6)`,
            facts[`technique.${RAT_STEP}.executable`] ? "Can execute" : "Execution needs ownership, 6 proficiency and Agility 8",
            `Used ${record?.executions || 0} times`].join(" · ") : "";
        provenance.textContent = record?.observed ? `Learned from ${record.observed.enemyId} via ${record.observed.route === "native-victory" ? "ordinary combat victory" : "field observation"}. The enemy retained its technique.`
            : "The field-edge encounter below can provide an observation.";
        notice.textContent = error || message || (record?.observed ? "Active decisions are optional. Slow practice earns the same technique with game minutes." : "");
        if(!record?.observed){progress.textContent='';provenance.textContent=knownLead?'The field edge offers a movement observation. Seeing it teaches no method.':'';}
        for(const {action, card, button, description, preview, requirements} of cards) {
            const p = evaluateAction(state, registry, action.id, context);
            const disclosed=!!record?.observed||knownLead&&action.id==='frontier.rat_step.observe';
            const row=disclosed?projectDiscoveryFeature({id:record?.observed?action.id:'field-edge-observation',label:record?.observed?action.label:'Watch movement at the field edge',discovered:true,unlocked:true,eligible:p.eligible}):null;
            card.hidden=!row||!p.visible;button.textContent=row?.label||'';description.textContent=row?(record?.observed?action.description:'Three played minutes observing visible movement. This records an observation; it does not grant ownership.') :'';
            button.disabled = !enabled || !!error || !p.eligible;
            preview.textContent = `${p.duration} game min` + (p.costs.length ? " · " + p.costs.map(c => `${c.amount} ${c.label || c.key}`).join(", ") : " · no fee");
            requirements.textContent = p.reasons.join(" ");
            if(!row){preview.textContent='';requirements.textContent='';}
            if(card.hidden&&card.contains(document.activeElement))heading.focus();
        }
        exercise.hidden = !active;
        exerciseInfo.textContent=active?'Untimed practice: hold through a feint, step aside from a lunge, advance during recovery. Each choice is saved; mistakes still grant practice.':'';
        buttons.forEach((button,i)=>button.textContent=active?Object.values(PRACTICE_RESPONSES)[i]:'');cancelButton.textContent=active?'Cancel active drill · fee is forfeited':'';
        for(const button of [...buttons, cancelButton]) button.disabled = !!error || !enabled;
        if(active) {
            const p = active[1].practice;
            cue.textContent = `Decision ${p.answers.length + 1}/3: ${p.cues[p.answers.length].label}`;
            feedback.textContent = p.answers.length ? `Saved responses: ${p.answers.map(a => PRACTICE_RESPONSES[a]).join(" → ")}` : "Pattern saved. No time limit.";
        } else {cue.textContent = ""; feedback.textContent = "";}
        const accepted=job?projectAcceptedWork({accepted:true,id:job.id,label:registry.actions.get(job.actionId)?.label,remainingMinutes:Math.max(0,job.due-state.clock)}):null;
        cancelTimed.hidden=!job || job.cancellation === "none"; cancelTimed.disabled=!!error || !enabled;
        waiting.textContent = accepted ? `${accepted.label}: ${accepted.remainingMinutes} game min remaining.` :
            record?.lastPractice ? `Last ${record.lastPractice.mode} practice: +${record.lastPractice.gain} proficiency` +
                (record.lastPractice.mode === "active" ? `, ${record.lastPractice.score}/3 correct.` : ".") : "";
    }
    render();
    return {panel, render};
}
