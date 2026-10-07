import {evaluateAction} from "./expansion_engine.js";
import {townScene} from "./town_content.js";

export function createTownPanel({registry, read, command, cancel}) {
    const node = (tag, text = "", className = "") => {const n = document.createElement(tag); n.textContent = text; n.className = className; return n;};
    const panel = node("details", "", "expedition_panel"); panel.id = "town_panel";
    panel.append(node("summary", "Survey office"));
    const body = node("div"), scene = node("p"), status = node("p", "", "expedition_notice"); status.setAttribute("role", "status");
    panel.append(body); body.append(scene, status); let notice = "", signature;
    const cards = new Map();
    for(const action of registry.actions.values()) {
        if(action.group !== "town") continue;
        const card = node("div", "", "expedition_card"), button = node("button", action.label), reason = node("p", "", "expedition_requirements"), timing=node("p","","expedition_preview");
        button.type = "button"; button.dataset.townAction = action.id;
        button.addEventListener("click", () => {
            const snapshot = read(); if(!snapshot.enabled || snapshot.error) return;
            try {command(action.id, snapshot.state.sequence); notice = "";}
            catch(error) {notice = error.message;} render(true);
        });
        card.append(button, node("p", action.description), timing, reason); body.append(card); cards.set(action.id, {card, button, reason, timing});
    }
    const stop = node("button", "Cancel unfinished town work"); stop.type = "button"; stop.dataset.townCancel = "work";
    stop.addEventListener("click", () => {
        const {state, enabled, error} = read(); if(!enabled || error) return;
        const job = state.pending.find(j => j.context.actorId === "player" && j.actionId.startsWith("town.")); if(!job) return;
        try {cancel(job.id, state.sequence); notice = job.cancellation === "refund" ? "Both reserved wood logs returned. Choose either contribution." : "Survey cancelled without a reward. Choose either contribution.";}
        catch(error) {notice = error.message;} render(true);
    }); body.append(stop);
    const remembered = node("details", "", "notebook_preparation"), memory = node("p");
    remembered.append(node("summary", "Last exchange"), memory); body.append(remembered);
    function render(force = false) {
        const snapshot = read(), {state, context, enabled, error} = snapshot;
        panel.hidden = snapshot.inDialogue || (!state.actors.player.facts["town.joined"] ? context.facts.location !== "Town outskirts"
            : !["Town outskirts", "Town square", "Forest road", "Village"].includes(context.facts.location));
        const host = document.getElementById("location_actions_div"); if(!panel.isConnected && host) host.append(panel);
        if(panel.hidden) return;
        const next = JSON.stringify([state, context.facts.location, context.gameplay, context.external, enabled, error, notice]);
        if(!force && next === signature) return; signature = next;
        scene.textContent = townScene(state);
        const job = state.pending.find(j => j.context.actorId === "player" && j.actionId.startsWith("town."));
        status.textContent = error || (job ? `${registry.actions.get(job.actionId).label}: ${job.due - state.clock} game minutes remaining.` : notice);
        status.hidden = !status.textContent;
        stop.hidden = !job; stop.disabled = !enabled || !!error;
        for(const [id, card] of cards) {
            const preview = evaluateAction(state, registry, id, context);
            const requirement = registry.actions.get(id).requires;
            const elsewhere = requirement.fact === "location" && requirement.value !== context.facts.location;
            card.card.hidden = !preview.visible || elsewhere; card.button.disabled = !enabled || !!error || !preview.eligible;
            card.reason.textContent = preview.reasons.join(" ");
            card.timing.textContent=preview.duration ? `${preview.duration} min${preview.contributors.length ? ` · ${preview.contributors.join("; ")}` : ""}` : "";
        }
        const last = state.history.filter(r => r.actorId === "player" && r.actionId.startsWith("town.")).at(-1);
        remembered.hidden = !last; memory.textContent = last?.label || "";
    }
    render(); return {render};
}
