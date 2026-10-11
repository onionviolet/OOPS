import {STEAM_ABSORPTION_GROUPS} from './steam_absorption_content.js';
import {previewSimulationCommand, inspectSimulationEvents} from "./simulation.js";
import {everydayScene} from "./everyday_life.js";
import {knownPeopleView} from "./people_knowledge.js";
const node = (tag, text) => {const n = document.createElement(tag); if(text) n.textContent = text; return n;};
export function createSimulationPanel({registry, read, command}) {
    const panel = node("details"); panel.id = "simulation_panel"; panel.className = "expedition_panel";
    panel.append(node("summary", "Craftsman & workshop")); const body = node("div"), description = node("p"), status = node("p"), buttons = node("div"), events = node("div"), history = node("ol");
    const encounter = node("section"), people = node("section"); body.append(encounter); people.append(node("h4", "Local commissions"));
    const personal = node("p"); personal.id = "workshop_personal_detail";
    const conversation = node("details"), conversations = node("div"); conversation.id = "workshop_conversation";
    conversation.open = true; conversation.append(node("summary", "Conversation & rest"), conversations);
    panel.append(body); body.append(description, personal, status, conversation, buttons, people, events, history); let notice = "", eventSignature = "", encounterSignature = "", wasIrritated = false;
    const run = c => {try {command(c); const disclosure=registry.simulation.commands.get(c.id)?.effects.find(e=>e.type === "knowledge" && !e.actor && e.key.startsWith("body.feedback."));
        notice=disclosure ? read().state.simulation.knowledge.player[disclosure.key].value : "Progress saved.";} catch(e) {notice = e.message;} render();};
    const button = (label, id, c) => {const b = node("button", label); b.type = "button"; b.dataset.simulation = id; b.addEventListener("click", () => run(c)); return b;};
    const enroll = button("Follow local people and work", "enroll", {type: "enroll"}); buttons.append(enroll);
    const controls = new Map();
    for(const d of registry.simulation.commands.values()) if(d.actorId === "player" && !d.targetDefinitionId && !STEAM_ABSORPTION_GROUPS.includes(d.group) && !["game_absorption_assay","contextual_balm","cooling_refinement","home_furnishings","proto23","factorio_retort","book_mol","book_mol_npc","book_paradise","book_paradise_npc","book_paradise_campaign","book_paradise_campaign_npc","status_care","field_care","book_care","book_care_npc","lore_work","lore_warning","body","field","pursuit","exchange","observation","glasshouse","skills","original_frontier","feature_objects","feature_society","feature_powers","feature_battle","tidemark","repositories","ink","backlog","artifact_collection","causal_story","causal_story_npc","audit_remainder","remainder_livelihood","remainder_home","remainder_offers","remainder_consequences","remainder_combat_fit","remainder_combat_objectives"].includes(d.group)) {
        const b = button(d.label, d.id, {type: "command", id: d.id, targetId: d.targetId});
        (d.group === "social" ? conversations : buttons).append(b); controls.set(d.id, b);
    }
    const routine = button("Pack 3 kits automatically · reserve each kit's inputs when work starts", "routine", {type: "program", id: "village.measured_pack", count: 3}); buttons.append(routine);
    const pause = button("Pause automatic packing after the current kit", "pause", {type: "pause"}); buttons.append(pause);
    const resume = button("Resume the remaining packing target", "resume", {type: "resume"}); buttons.append(resume);
    const cancel = button("Cancel your current work · refund reserved inputs", "cancel", {type: "cancel"}); buttons.append(cancel);
    const participantRows = new Map();
    function render() {
        const snapshot = read(), {state, context, enabled, error} = snapshot, s = state.simulation;
        const records = knownPeopleView(state, context.facts);
        panel.hidden = !["Village", "Shack"].includes(context.facts.location) || !records.some(r => r.id === "oldCraftsman") || snapshot.inDialogue;
        enroll.hidden = !!s; enroll.disabled = !enabled || !!error;
        description.textContent = s ? "His supplies, work and agreements are remembered between visits." : "Follow the craftsman's work and local changes. This begins now, with no invented past history or closed-browser losses.";
        personal.textContent = s ? everydayScene(state, context.facts) : ""; personal.hidden = !personal.textContent;
        for(const [id,b] of controls) {
            if(!s) {b.hidden = true; continue;}
            const d = registry.simulation.commands.get(id), ctx = {...context, targetId: d.targetId || null};
            const p = previewSimulationCommand(state, registry, id, ctx); b.hidden = !p.visible || !!(d.once && state.actors.player.completed[id]) || !!(d.claim && s.claims[d.claim]) || d.group === "social" && d.location !== context.facts.location;
            b.disabled = !enabled || !!error || !p.eligible; b.title = p.reasons.join(" ");
            if(b.hidden && document.activeElement === b) (d.group === "social" ? conversation : panel).querySelector("summary").focus();
        }
        conversation.hidden = !s || ![...controls].some(([id,b]) => registry.simulation.commands.get(id).group === "social" && !b.hidden);
        if(context.facts["village.craftsmanIrritated"] && !wasIrritated) conversation.open = true;
        wasIrritated = !!context.facts["village.craftsmanIrritated"];
        routine.hidden = !s; routine.disabled = !s || !enabled || !!error || !previewSimulationCommand(state, registry, "village.measured_pack", context).eligible;
        pause.hidden = s?.programs.player?.status !== "running"; pause.disabled = !!error;
        resume.hidden = s?.programs.player?.status !== "paused" || !s?.programs.player?.remaining; resume.disabled = !!error || !enabled;
        // These hosts own their exact scene/descriptor cancellation controls.
        const job = s?.jobs.find(j => j.actorId === "player" && !STEAM_ABSORPTION_GROUPS.includes(registry.simulation.commands.get(j.commandId)?.group) && !["game_absorption_assay","contextual_balm","cooling_refinement","home_furnishings","proto23","factorio_retort","book_mol","book_mol_npc","book_paradise","book_paradise_npc","book_paradise_campaign","book_paradise_campaign_npc","status_care","field_care","book_care","book_care_npc","lore_work","lore_warning","artifact_collection","causal_story","causal_story_npc","audit_remainder","remainder_livelihood","remainder_home","remainder_offers","remainder_consequences","remainder_combat_fit","remainder_combat_objectives"].includes(registry.simulation.commands.get(j.commandId)?.group)); cancel.hidden = !job || job.cancellation === "none"; cancel.disabled = !!error;
        const work = s?.jobs.filter(j => j.actorId === "player" || j.actorId === "oldCraftsman").map(j => `${j.actorId === "player" ? "You" : "Old craftsman"}: ${j.label}, ${j.due - state.clock} game minutes left.`).join(" ") || "No reserved workshop work.";
        const practice = state.actors.player.resources.practice || 0;
        status.textContent = error || `${notice ? notice + " " : ""}${work} Completed packing practice: ${practice}.`;
        const localPeople = Object.entries(s?.people || {}).filter(([id,p]) => p.createdBy === "player" && !["original_frontier.","artifact_collection.","causal.story.","remainder_","remainder."].some(prefix=>p.definitionId?.startsWith(prefix)) && state.actors[id].worldId === state.actors.player.worldId);
        people.hidden = !localPeople.length;
        for(const [index,[id,p]] of localPeople.entries()) {
            let row = participantRows.get(id);
            if(!row) {
                const section = node("section"), text = node("p"), actions = [];
                section.dataset.simulationPerson = id; section.append(text);
                for(const d of registry.simulation.commands.values()) if(d.actorId === "player" && d.targetDefinitionId === p.definitionId) {
                    const b = button(d.label, `${d.id}:${id}`, {type:"command",id:d.id,targetId:id}); section.append(b); actions.push([d,b]);
                }
                people.append(section); row = {section,text,actions}; participantRows.set(id,row);
            }
            const label = registry.simulation.people.get(p.definitionId)?.label || "Local helper";
            const record = records.find(r => r.id === id);
            row.text.textContent = `${label} ${index+1}: ${p.life === "alive" && p.location === context.facts.location ? "Here at your location." : record?.details.join(" ") || "Away on the agreed road check."}`;
            for(const [d,b] of row.actions) {
                const preview = previewSimulationCommand(state,registry,d.id,{...context,targetId:id});
                b.hidden = p.life !== "alive" || p.location !== context.facts.location;
                b.disabled = !enabled || !!error || !preview.eligible; b.title = preview.reasons.join(" ");
            }
        }
        for(const [id,row] of participantRows) if(!s?.people[id]) {row.section.remove(); participantRows.delete(id);}
        const currentEvents = inspectSimulationEvents(state).filter(e => e.actorId === "player" && e.status === "open" && registry.simulation.events.get(e.definitionId)?.group !== "field");
        const signature = JSON.stringify([currentEvents, error, enabled]);
        if(signature !== eventSignature) {eventSignature = signature; events.replaceChildren();
        for(const e of currentEvents) {
            const row = node("section"); row.append(node("p", `${e.label}${e.expiresAt ? ` · ${e.expiresAt - state.clock} min remaining` : ""}`));
            for(const r of e.responses) {const b = button(r.label, `event.${r.id}`, {type: "event", eventId: e.id, responseId: r.id}); b.disabled = !!error || !enabled; row.append(b);} events.append(row);
        }}
        const session = s?.sessions.player?.nativeBattle || s?.sessions.player?.definitionId === "field.assessment" || s?.sessions.player?.pursuitId || ["original_frontier","artifact_collection","causal_story","causal_story_npc"].includes(registry.simulation.commands.get(s?.sessions.player?.commandId)?.group) ? null : s?.sessions.player, sessionSignature = JSON.stringify([session,error]);
        if(sessionSignature !== encounterSignature) {
            encounterSignature = sessionSignature; encounter.replaceChildren();
            if(session) {
                const turn = session.turns[session.turn]; encounter.append(node("p", `${turn.cue} · response ${session.turn+1}/${session.turns.length}`));
                for(const r of turn.responses) {const b = button(r.label || r.id,`response.${r.id}`,{type:"response",responseId:r.id}); b.disabled=!!error; encounter.append(b);}
                encounter.append(button("Withdraw · retain spent inputs", "withdraw", {type:"withdraw"}));
            }
        }
        const texts = (s?.log || []).filter(e => !e.audience || e.audience.includes("player")).slice(-5).reverse().map(e => node("li", e.text));
        if(history.textContent !== texts.map(n => n.textContent).join("")) history.replaceChildren(...texts);
        if(!panel.isConnected) document.getElementById("location_actions_div")?.append(panel);
    }
    render(); return {render};
}
