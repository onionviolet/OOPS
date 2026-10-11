import {evaluateAction, inspectCapabilities} from "./expansion_engine.js";

// Rendering reads snapshots. Clicks submit IDs to the host; they never mutate state.
export function createExpeditionPanel({registry, read, command, cancel}) {
    const panel = document.createElement("details");
    panel.id = "expedition_panel";
    panel.className = "expedition_panel";
    const summary = document.createElement("summary");
    summary.textContent = "Routes & supplies";
    panel.append(summary);
    const body = document.createElement("div");
    panel.append(body);
    document.getElementById("location_actions_div").append(panel);
    const element = (tag, text, className) => {
        const node = document.createElement(tag); node.textContent = text;
        if(className) node.className = className;
        return node;
    };
    let signature;
    let notice = "";
    const status = element("p", "", "expedition_notice");
    status.setAttribute("role", "status");
    // Stable controls preserve keyboard focus while the game's timer updates.
    const cards = new Map();
    body.append(element("p", "Survey with supplies, practiced anchors, strength or learned footwork. Choose a route that fits your preparation."));
    const stateText = element("p", "", "expedition_state"); body.append(stateText, status);
    const capabilityText = element("p", "", "expedition_preview"); body.append(capabilityText);
    const preparation = element("details", "", "notebook_preparation"); preparation.append(element("summary", "Preparation details"), capabilityText); body.append(preparation);
    const cancelButton = element("button", "Cancel timed work · spent inputs are lost");
    cancelButton.type = "button";
    cancelButton.addEventListener("click", () => {
        const {state} = read();
        const job = state.pending.find(job => job.context.actorId === "player");
        try {cancel(job.id, state.sequence); notice = "Cancellation saved. Spent inputs were forfeited.";}
        catch(error) {notice = error.message;}
        render(true);
    });
    body.append(cancelButton);
    for(const action of registry.actions.values()) {
        if(["technique", "chronicle", "village", "town", "optional_pack"].includes(action.group)) continue;
        const card = element("div", "", "expedition_card");
        const button = element("button", action.label);
        button.type = "button";
        button.dataset.expeditionAction = action.id;
        const description = element("p", action.description);
        const previewText = element("p", "", "expedition_preview");
        const requirements = element("p", "", "expedition_requirements");
        button.addEventListener("click", () => {
            const snapshot = read();
            try {command(action.id, snapshot.state.sequence); notice = "Plan saved. Inputs and outcome are committed.";}
            catch(error) {notice = error.message;}
            render(true);
        });
        card.append(button, description, previewText, requirements); body.append(card);
        cards.set(action.id, {card, button, previewText, requirements});
    }
    const history = element("ol", "", "expedition_history"); body.append(history);
    function render(force = false) {
        if(!panel.isConnected) document.getElementById("location_actions_div").append(panel);
        const {state, context, error, enabled} = read();
        const nextSignature = JSON.stringify([state, context.facts, context.external, context.gameplay, error, enabled, notice]);
        if(!force && signature === nextSignature) return;
        signature = nextSignature;
        const actor = state.actors.player;
        const world = state.worlds[actor.worldId];
        const jobs = state.pending.map(job => `${registry.actions.get(job.actionId)?.label || job.actionId}: ${job.due - state.clock} min remaining`);
        const opportunities = Object.values(state.opportunities).map(o => o.status === "scheduled"
            ? `Next departure in ${o.due - state.clock} min` : o.status === "available"
                ? `Departure available for ${o.expires - state.clock} min` : o.status === "expired" ? "Departure missed; survey rewards retained" : "Departure joined");
        stateText.textContent = [`Kits: ${context.facts.kits || 0}`, `Ropes: ${context.facts.rope || 0}`,
            state.campaign.facts.anchor ? "Anchor points known" : "Anchor points unknown",
            world.facts.crossing ? `Crossing: ${world.facts.crossing}` : "Crossing unsurveyed",
            world.facts["guide.condition"] ? `Guide: ${world.facts["guide.condition"]}` : "Guide waiting", ...jobs, ...opportunities].join(" · ");
        status.textContent = error || notice || "Expeditions advance with game minutes, including travel and sleep.";
        const capabilities = inspectCapabilities(state, registry, context);
        capabilityText.textContent = "Capabilities: " + Object.values(capabilities).map(capability =>
            `${capability.label}: ${capability.value}` + (capability.contributions.length ?
                ` (${capability.contributions.map(source => `${source.label} · ${source.kind}`).join(", ")})` : " (no active source)")).join("; ");
        const cancellable = state.pending.find(job => job.context.actorId === "player" && job.cancellation === "forfeit");
        cancelButton.hidden = !cancellable;
        cancelButton.disabled = !!error;
        for(const action of registry.actions.values()) {
        if(["technique", "chronicle", "village", "town", "optional_pack"].includes(action.group)) continue;
            const preview = evaluateAction(state, registry, action.id, context);
            const {card, button, previewText, requirements} = cards.get(action.id);
            card.hidden = !preview.visible;
            button.disabled = !enabled || !!error || !preview.eligible;
            previewText.textContent = `${preview.duration} min · ` + preview.outcomes.filter(o => o.chance > 0)
                .map(o => `${o.label}: ${Math.round(o.chance * 100)}%`).join(" · ") +
                (preview.contributors.length ? ` · ${preview.contributors.join("; ")}` : "") +
                (action.id === "frontier.inspect" ? [] : preview.rolls).map(roll => ` · ${roll.label}: ` + roll.outcomes.filter(o => o.chance > 0)
                    .map(o => `${o.label} ${Math.round(o.chance * 100)}%`).join(" / ")).join("");
            requirements.textContent = preview.reasons.join(" ");
        }
        history.replaceChildren(...state.history.filter(receipt => !["technique", "chronicle", "village", "town", "optional_pack"].includes(registry.actions.get(receipt.actionId)?.group)).slice(-6).reverse().map(receipt => element("li",
            [receipt.label, ...(receipt.rolls || []).map(roll => roll.label)].join(" · "))));
    }
    render();
    return {render, panel};
}
