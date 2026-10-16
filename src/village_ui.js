import {evaluateAction} from "./expansion_engine.js";
import {NOTES_KEY, villageScene} from "./village_content.js";
import {routeUnderstanding} from "./everyday_life.js";
import {teacherWindow} from "./teacher_window.js";
import {setText, syncChildren} from "./dom_sync.js";

export function createVillagePanel({registry, read, command, cancel, readBook}) {
    const node = (tag, text = "", className = "") => {
        const n = document.createElement(tag); n.textContent = text; n.className = className; return n;
    };
    const panel = node("details", "", "expedition_panel village_panel"); panel.id = "village_panel";
    panel.append(node("summary", "Village notes"));
    const body = node("div"), scene = node("p"), status = node("p", "", "expedition_notice");
    status.setAttribute("role", "status"); body.append(scene, status); panel.append(body);
    const teaching = node("p", "", "expedition_preview"), chapter = node("p"), opportunities = node("p");
    teaching.dataset.teacherWindow = "lp5"; chapter.dataset.waypostPhase = "lp5";
    body.append(teaching, chapter, opportunities);
    let signature, rendered = null, notice = "";
    const reading = node("button", "Read the route booklet · 4 min"); reading.type = "button"; reading.dataset.villageRead = "notes";
    reading.addEventListener("click", () => {
        const snapshot = read();
        if(!snapshot.enabled || snapshot.error || !snapshot.context.gameplay.player.inventory[NOTES_KEY]) return;
        try {readBook(NOTES_KEY); notice = "Reading the surveyor's notes. The ordinary book progress is saved with your game.";}
        catch(error) {notice = error.message;}
        render(true);
    });
    body.append(reading);
    const inspect = node("button", "Inspect the crossing"); inspect.type = "button"; inspect.dataset.villageBridge = "inspect";
    inspect.addEventListener("click", () => {
        const {state, enabled, error} = read();
        if(!enabled || error) return;
        try {command("frontier.inspect", state.sequence); notice = "Crossing inspection saved. Your field notes and booklet will describe the same route.";}
        catch(error) {notice = error.message;}
        render(true);
    }); body.append(inspect);
    const cancelButton = node("button", "Cancel work · return reserved materials and coins"); cancelButton.type = "button";
    cancelButton.dataset.villageCancel = "work";
    cancelButton.addEventListener("click", () => {
        const {state} = read(), job = state.pending.find(j => j.context.actorId === "player" && j.actionId.startsWith("village.") && j.cancellation === "refund");
        if(!job) return;
        try {cancel(job.id, state.sequence); notice = "Work cancelled. Reserved inputs returned; no reward was earned.";}
        catch(error) {notice = error.message;}
        render(true);
    }); body.append(cancelButton);
    const cards = new Map();
    for(const action of registry.actions.values()) {
        if(action.group !== "village") continue;
        const card = node("div", "", "expedition_card"), button = node("button", action.label); button.type = "button";
        button.dataset.villageAction = action.id;
        const preview = node("p", "", "expedition_preview"), reason = node("p", "", "expedition_requirements");
        button.addEventListener("click", () => {
            const snapshot = read();
            if(!snapshot.enabled || snapshot.error) return;
            try {command(action.id, snapshot.state.sequence); notice = action.duration ? "Work saved. Time and reserved inputs survive reload." : "Interaction saved.";}
            catch(error) {notice = error.message;}
            render(true);
        });
        card.append(button, node("p", action.description), preview, reason); body.append(card);
        cards.set(action.id, {card, button, preview, reason});
    }
    const history = node("ol", "", "expedition_history"); body.append(history);
    function render(force = false) {
        if(!panel.isConnected) {
            const host = document.getElementById("location_actions_div");
            host.insertBefore(panel, host.querySelector("#expedition_panel"));
        }
        const snapshot = read(), {state, context, enabled, error} = snapshot, facts = context.facts;
        panel.hidden = !["Village", "Shack"].includes(facts.location) || !facts["village.elderMet"] || snapshot.inDialogue;
        if(panel.hidden) return;
        // States are keyed by identity, sequence and clock instead of JSON (see expedition_ui.js).
        if(rendered && rendered.state === state && rendered.sequence === state.sequence && rendered.clock === state.clock) {
            const sig = JSON.stringify([facts, context.gameplay, context.external, enabled, error, notice]);
            if(!force && signature === sig) return;
            signature = sig;
        } else {rendered = {state, sequence: state.sequence, clock: state.clock}; signature = undefined;}
        setText(scene, villageScene(state, facts));
        const teacher = teacherWindow(state, facts);
        teaching.hidden = chapter.hidden = opportunities.hidden = !facts["village.craftsmanMet"] || !state.actors.player.facts["village.discovered"];
        setText(teaching, `Proposal · ${teacher.text} Bench orders: Notebook → People → Craftsman & workshop → Commission a kit.`);
        setText(chapter, `Story phase: ${teacher.phase}. Route: ${teacher.learned.known ? "learned" : "not yet understood"}. This chapter does not change teaching hours or reset methods and rewards.`);
        setText(opportunities, teacher.preview);
        const jobs = state.pending.filter(j => j.context.actorId === "player");
        if(facts["village.notesRead"] && notice.startsWith("Reading the surveyor")) notice = "Notes understood. The dry-bank route remains learned after you put the booklet away.";
        setText(status, error || notice); status.hidden = !status.textContent;
        reading.hidden = !!facts["village.notesRead"] || !context.gameplay.player.inventory[NOTES_KEY];
        reading.disabled = !enabled || !!error || jobs.length > 0;
        const learned = routeUnderstanding(state, facts["village.notesRead"]);
        setText(reading, learned.known ? "Read the booklet too · 4 min" : "Read the route booklet · 4 min");
        reading.title = learned.known ? "Reading still trains Literacy; the route is already understood." : "";
        const inspection = evaluateAction(state, registry, "frontier.inspect", context);
        inspect.hidden = !state.actors.player.facts["village.discovered"] || !!state.campaign.facts.anchor;
        inspect.disabled = !enabled || !!error || !inspection.eligible;
        setText(inspect, `Inspect the crossing · ${inspection.duration} min`);
        cancelButton.hidden = !jobs.some(j => j.actionId.startsWith("village.") && j.cancellation === "refund"); cancelButton.disabled = !!error;
        for(const [id, card] of cards) {
            const preview = evaluateAction(state, registry, id, context);
            card.card.hidden = !preview.visible;
            card.button.disabled = !enabled || !!error || !preview.eligible;
            setText(card.preview, `${preview.duration} min` + (preview.contributors.length ? ` · ${preview.contributors.join("; ")}` : "") +
                (preview.schedule?.open ? ` · Meeting open for ${preview.schedule.remaining} more game minutes` : ""));
            setText(card.reason, preview.reasons.join(" "));
        }
        syncChildren(history, state.history.filter(r => r.actionId.startsWith("village.")).slice(-4).reverse().map(r => node("li", r.label)));
    }
    render(); return {panel, render};
}
