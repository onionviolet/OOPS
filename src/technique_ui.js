import {evaluateAction} from "./expansion_engine.js";
import {activePractice, techniqueFacts, PRACTICE_RESPONSES} from "./techniques.js";
import {RAT_STEP} from "./technique_content.js";

export function createTechniquePanel({registry, read, command, answer, cancel}) {
    const panel = document.createElement("details"); panel.className = "expedition_panel"; panel.id = "technique_panel";
    const node = (tag, text, className) => {
        const e = document.createElement(tag); e.textContent = text; if(className) e.className = className; return e;
    };
    panel.append(node("summary", "Technique notebook · Rat-step"));
    const body = node("div", ""); panel.append(body);
    body.append(node("p", "Observe an enemy, understand the pattern, practice it, then internalize it. Rat-step opens a crossing approach in the Field journal. Original prototype; lore and balance are provisional."));
    const progress = node("p", "", "expedition_state"), provenance = node("p", "", "expedition_preview");
    const notice = node("p", "", "expedition_notice"); notice.setAttribute("role", "status");
    body.append(progress, provenance, notice);
    let message = "", signature;
    const cards = [];
    for(const action of registry.actions.values()) if(action.group === "technique") {
        const card = node("div", "", "expedition_card"), button = node("button", action.label);
        button.type = "button";
        const preview = node("p", "", "expedition_preview"), requirements = node("p", "", "expedition_requirements");
        card.append(button, node("p", action.description), preview, requirements); body.append(card);
        button.addEventListener("click", () => {
            const {state} = read();
            try {command(action.id, state.sequence); message = "Saved. The technique step is committed.";}
            catch(error) {message = error.message;}
            render(true);
        });
        cards.push({action, card, button, preview, requirements});
    }
    const exercise = node("div", "", "expedition_card"); exercise.id = "technique_exercise";
    exercise.append(node("p", "Untimed practice: hold through a feint, step aside from a lunge, advance during recovery. You can take your time. Each choice is saved; mistakes still grant practice."));
    const cue = node("p", "", "technique_cue"), feedback = node("p", "", "expedition_preview");
    exercise.append(cue, feedback);
    const controls = node("div", "", "technique_responses"); exercise.append(controls);
    const buttons = [];
    for(const [response, label] of Object.entries(PRACTICE_RESPONSES)) {
        const button = node("button", label); button.type = "button"; controls.append(button); buttons.push(button);
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
    const cancelButton = node("button", "Cancel active drill · fee is forfeited"); cancelButton.type = "button";
    cancelButton.addEventListener("click", () => {
        const {state} = read(), active = activePractice(state.actors.player); if(!active) return;
        try {cancel(active[1].practice.id, state.sequence); message = "Cancelled and saved. No practice reward; fee forfeited.";}
        catch(error) {message = error.message;}
        render(true);
    });
    exercise.append(cancelButton); body.append(exercise);
    const waiting = node("p", "", "expedition_preview"); body.append(waiting);
    function render(force = false) {
        if(!panel.isConnected) document.getElementById("location_actions_div").append(panel);
        const {state, context, error, enabled} = read(), actor = state.actors.player;
        const nextSignature = JSON.stringify([actor.techniques, state.sequence, state.pending, context.facts, context.external, error, enabled, message]);
        if(!force && signature === nextSignature) return;
        signature = nextSignature;
        const record = actor.techniques[RAT_STEP], facts = techniqueFacts(actor, registry, context);
        progress.textContent = [record?.observed ? "Observed" : "Not observed", record?.understood ? "Understood" : "Not understood",
            record?.owned ? "Owned" : "Not owned", `Proficiency ${record?.proficiency || 0}/12 (execute at 6)`,
            facts[`technique.${RAT_STEP}.executable`] ? "Can execute" : "Execution needs ownership, 6 proficiency and Agility 8",
            `Used ${record?.executions || 0} times`].join(" · ");
        provenance.textContent = record?.observed ? `Learned from ${record.observed.enemyId} via ${record.observed.route === "native-victory" ? "ordinary combat victory" : "field observation"}. The enemy retained its technique.`
            : "Evidence can come from the field-edge encounter below or defeating a Starving wolf rat in native combat.";
        notice.textContent = error || message || "Active decisions are optional. Slow practice earns the same technique with game minutes.";
        for(const {action, card, button, preview, requirements} of cards) {
            const p = evaluateAction(state, registry, action.id, context);
            card.hidden = !p.visible; button.disabled = !enabled || !!error || !p.eligible;
            preview.textContent = `${p.duration} game min` + (p.costs.length ? " · " + p.costs.map(c => `${c.amount} ${c.label || c.key}`).join(", ") : " · no fee");
            requirements.textContent = p.reasons.join(" ");
        }
        const active = activePractice(actor);
        exercise.hidden = !active;
        for(const button of [...buttons, cancelButton]) button.disabled = !!error || !enabled;
        if(active) {
            const p = active[1].practice;
            cue.textContent = `Decision ${p.answers.length + 1}/3: ${p.cues[p.answers.length].label}`;
            feedback.textContent = p.answers.length ? `Saved responses: ${p.answers.map(a => PRACTICE_RESPONSES[a]).join(" → ")}` : "Pattern saved. No time limit.";
        }
        const job = state.pending.find(j => j.actionId.startsWith("frontier.rat_step."));
        waiting.textContent = job ? `${registry.actions.get(job.actionId).label}: ${job.due - state.clock} game min remaining.` + (job.cancellation !== "none" ? " Cancel timed work from the Field journal." : "") :
            record?.lastPractice ? `Last ${record.lastPractice.mode} practice: +${record.lastPractice.gain} proficiency` +
                (record.lastPractice.mode === "active" ? `, ${record.lastPractice.score}/3 correct.` : ".") : "";
    }
    render();
    return {panel, render};
}
