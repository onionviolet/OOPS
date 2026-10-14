import {knownPeopleView} from './people_knowledge.js';
import {getDisplaySetting, subscribeDisplaySettings} from './display_settings.js';
import {definePanel} from './panel_kit.js';
import {workspaceOwns,openWorkspaceModule} from './workspace_layout.js';
import {STEAM_ABSORPTION_GROUPS} from './steam_absorption_content.js';
import {isFeatureBattleSchema} from './feature_expansion_battle.js';
import {activePractice} from "./techniques.js";
import {createPeopleOverview} from "./people_ui.js";

const views = [["here", "Here"], ["practice", "Practice"], ["people", "People"]];
const panels = [
    ["replacement_recognition_panel","people"], ["nested_ink_panel","here"],
    ["feature_expansion_panel","here"], ["known_routes_panel","here"],
    ["crush_social_panel","people"],
    ["causal_story_panel","here"],
    ["repository_absorption_panel","here"], ["backlog_expansion_panel","here"], ["ink_narrative_panel","here"],
    ["original_frontier_panel","here"], ["pocket_realm_panel","here"], ["town_panel", "here"], ["village_panel", "here"], ["expedition_panel", "here"], ["field_panel","here"],
    ["skills_panel","practice"], ["technique_panel", "practice"], ["body_panel", "practice"], ["chronicle_panel", "people"], ["storylet_panel", "people"], ["simulation_panel", "people"], ["pursuit_panel","people"], ["frontier_campaign_panel","people"], ["party_panel","people"], ["exchange_panel","people"], ["observation_panel","people"], ["promise_panel","people"]
];
const node = (tag, text = "", className = "") => {const n = document.createElement(tag); n.textContent = text; n.className = className; return n;};

function attention(state, registry, battleRunning=false) {
    const practice = activePractice(state.actors.player);
    if(practice) return {id: practice[1].practice.id, view: "practice", panel: "technique_panel", text: "Rat-step practice is waiting for your response."};
    if(state.chronicle?.session) return {id: "elder-encounter", view: "people", panel: "chronicle_panel", text: "The elder encounter is in progress."};
    if(state.simulation?.sessions.player?.nativeBattle) return {id:state.simulation.sessions.player.id,view:isFeatureBattleSchema(state.simulation.sessions.player.nativeBattle.schema)?"here":"people",panel:isFeatureBattleSchema(state.simulation.sessions.player.nativeBattle.schema)?"feature_expansion_panel":"frontier_campaign_panel",text:battleRunning?"An agreed native contest is running.":"A saved native contest is ready to resume."};
    if(state.simulation?.sessions.player&&registry.simulation.commands.get(state.simulation.sessions.player.commandId)?.group==="skills")return {id:state.simulation.sessions.player.id,view:"practice",panel:"skills_panel",text:"An agreed control exercise is waiting for your response."};
    if(state.simulation?.sessions.player&&registry.simulation.commands.get(state.simulation.sessions.player.commandId)?.group==="original_frontier")return {id:state.simulation.sessions.player.id,view:"here",panel:"original_frontier_panel",text:"Your agreed Frontier exercise is waiting for a response."};
    if(state.simulation?.sessions.player&&registry.simulation.commands.get(state.simulation.sessions.player.commandId)?.group==="artifact_collection")return {id:state.simulation.sessions.player.id,view:"here",panel:"feature_expansion_panel",text:"Your instrument’s local projection is waiting for a response."};
    if(state.simulation?.sessions.player&&['book_mol','book_paradise_campaign'].includes(registry.simulation.commands.get(state.simulation.sessions.player.commandId)?.group))return {id:state.simulation.sessions.player.id,view:'here',panel:'feature_expansion_panel',text:'Your local encounter is waiting for a response.'};
    if(state.simulation?.sessions.player) {const field=state.simulation.sessions.player.definitionId === "field.assessment",pursuit=!!state.simulation.sessions.player.pursuitId;return {id: state.simulation.sessions.player.id, view: field ? "here" : "people", panel: field ? "field_panel" : pursuit ? "pursuit_panel" : "simulation_panel", text: "An encounter is waiting for your response."};}
    const job = state.pending.find(j => j.context.actorId === "player");
    if(job) {
        const action = registry.actions.get(job.actionId), group = action?.group;
        const view = group === "technique" ? "practice" : group === "chronicle" ? "people" : "here";
        const panel = ({technique:"technique_panel",chronicle:"chronicle_panel",town:"town_panel",village:"village_panel"})[group] || "expedition_panel";
        return {id: job.id, view, panel, text: `${action?.label || job.label} · ${Math.max(0,job.due-state.clock)} min remaining`};
    }
    const work = state.simulation?.jobs.find(j => j.actorId === "player");
    if(work){const group=registry.simulation.commands.get(work.commandId)?.group;
        if(group==='causal_story'||group==='causal_story_npc')return {id:work.id,view:'here',panel:'causal_story_panel',text:`${work.label} · ${Math.max(0,work.due-state.clock)} min remaining`};
        if(STEAM_ABSORPTION_GROUPS.includes(group))return {id:work.id,view:'here',panel:'feature_expansion_panel',text:`${work.label} · ${Math.max(0,work.due-state.clock)} min remaining`};
        if(['feature_objects','feature_society','feature_powers','feature_battle','tidemark','repositories','subtlety_relay','nested_campaign','nested_chains','nested_life','book_paradise','book_mol','book_paradise_campaign','home_furnishings','proto23','factorio_retort','reference_gameplay','nethack_fieldcraft','contextual_balm','cooling_refinement','game_absorption_assay','audit_fixture','audit_lesson','artifact_collection','remainder_livelihood','remainder_home','remainder_offers','remainder_consequences','remainder_combat_fit','remainder_combat_objectives'].includes(group))return {id:work.id,view:'here',panel:group==='repositories'?'repository_absorption_panel':'feature_expansion_panel',text:`${work.label} · ${Math.max(0,work.due-state.clock)} min remaining`};}
    if(state.actors.player.facts["original_frontier.travel.remaining"]>0)return {id:"frontier-travel",view:"here",panel:"original_frontier_panel",text:`Native journey: ${state.actors.player.facts["original_frontier.travel.remaining"]} min remain. Continue played time or cancel the remaining journey.`};
    if(work&&registry.simulation.commands.get(work.commandId)?.group?.startsWith('world_completion_'))return {id:work.id,view:'here',panel:'feature_expansion_panel',text:`${work.label} · ${Math.max(0,work.due-state.clock)} min remaining`};
    if(work) {const group=registry.simulation.commands.get(work.commandId)?.group;return {id:work.id,view:group === "original_frontier" ? "here" : group === "field" ? "here" : ["body","skills","glasshouse"].includes(group)?group==="glasshouse"?"here":"practice" : "people",panel:group==="original_frontier"?"original_frontier_panel":group==="skills"?"skills_panel":group === "field" ? "field_panel" : group === "body" ? "body_panel" : group === "pursuit" ? "pursuit_panel" : group === "rival" ? "frontier_campaign_panel" : group === "promise" ? "promise_panel" : group === "party" ? "party_panel" : group === "exchange" ? "exchange_panel" : group === "glasshouse" ? "pocket_realm_panel" : "simulation_panel",text:`${work.label} · ${Math.max(0,work.due-state.clock)} min remaining`};}
    const decision = Object.values(state.simulation?.events || {}).find(e => e.mode === "decision" && e.nonBlocking !== true && e.status === "open" && e.discoveredBy.includes("player"));
    if(decision) return {id:decision.id,view:"people",panel:"simulation_panel",text:decision.label};
    return null;
}

export function createAdventureNotebook({registry, read}) {
    const root = node("section", "", "adventure_notebook"); root.id = "adventure_notebook";
    const heading = node("div", "Notes, practice & people", "notebook_heading"), tabs = node("div", "", "notebook_tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Notebook sections");
    const status = node("p", "", "notebook_status"); status.setAttribute("role", "status");
    root.append(heading, tabs, status);
    const buttons = new Map(), sections = new Map(), wrappers = new Map();
    let selected = "here", lastLocation, lastAttention = null;
    for(const [id,label] of views) {
        const button = node("button",label), section = node("div", "", "notebook_view");
        button.type = "button"; button.id = `notebook_tab_${id}`; button.dataset.notebookView = id;
        button.setAttribute("role","tab"); button.setAttribute("aria-controls",`notebook_view_${id}`);
        section.id = `notebook_view_${id}`; section.setAttribute("role","tabpanel"); section.setAttribute("aria-labelledby",button.id);
        button.addEventListener("click",() => {selected=id; render();});
        button.addEventListener("keydown", event => {
            if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
            event.preventDefault(); const available = [...buttons.values()].filter(b => !b.disabled && !b.hidden);
            const index = available.indexOf(button), next = event.key === "Home" ? 0 : event.key === "End" ? available.length-1
                : (index+(event.key === "ArrowRight" ? 1 : -1)+available.length)%available.length;
            available[next].click(); available[next].focus();
        });
        tabs.append(button); root.append(section); buttons.set(id,button); sections.set(id,section);
    }
    const people = createPeopleOverview(); sections.get("people").append(people.panel);
    for(const [id,view] of panels) {const wrap=node("div"); wrap.dataset.notebookPanel=id; sections.get(view).append(wrap); wrappers.set(id,wrap);}

    function render() {
        const snapshot = read(), {state,context,error} = snapshot, actor = state.actors.player, location = context.facts.location;
        const knownPeople = people.render(state, context.facts);
        // Sort only witnessed rows, using existing memory times. Untimed ties keep source order.
        const peopleRows = knownPeopleView(state, context.facts).map((row, order) => ({...row, order,
            recent: Math.max(0, ...row.memories.map(m => Number(m.at) || 0))}));
        peopleRows.sort((a, b) => getDisplaySetting('panel.known-people.sort') === 'name'
            ? (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.order - b.order)
            : b.recent - a.recent || a.order - b.order);
        const cards = new Map([...people.panel.querySelectorAll('[data-known-person]')].map(card => [card.dataset.knownPerson, card]));
        for (const [index, row] of peopleRows.entries()) {
            const card = cards.get(row.id); if (!card) continue;
            card.dataset.panelRow = ''; card.dataset.sortName = row.name;
            const list = card.parentNode;
            if (list.children[index] !== card) list.insertBefore(card, list.children[index] || null);
        }
        const active = attention(state,registry,snapshot.inCombat), familiar = knownPeople || state.chronicle || state.simulation || Object.keys(actor.techniques).length || actor.facts["town.joined"] || active;
        root.hidden = !familiar;
        const host = document.getElementById("notebook_box_div"), control = document.getElementById("journal_show_notebook");
        if(!workspaceOwns(root) && root.parentElement !== host && host) host.append(root);
        if(control) control.hidden = !familiar;
        for(const [id] of panels) {
            const panel = document.getElementById(id), wrap=wrappers.get(id);
            wrap.hidden=!!state.realmPrototype?.activeVisitId&&id!=="pocket_realm_panel"&&id!=="known_routes_panel";
            if(panel && !workspaceOwns(panel) && panel.parentElement !== wrap) wrap.append(panel);
        }
        wrappers.get("expedition_panel").hidden = location !== "Village" && active?.panel !== "expedition_panel";
        wrappers.get("chronicle_panel").hidden = location !== "Village" && active?.panel !== "chronicle_panel";
        wrappers.get("technique_panel").hidden = location !== "Village" && !Object.keys(actor.techniques).length && active?.panel !== "technique_panel";
        for(const [id] of panels) if((snapshot.inDialogue || snapshot.inCombat) && !active) wrappers.get(id).hidden = true;
        if(location !== lastLocation && !active && selected !== "people") selected="here";
        if(active && active.id !== lastAttention) {
            selected=active.view; const panel=document.getElementById(active.panel); if(panel) panel.open=true;
            // A newly waiting response must remain reachable after moving away
            // from the location menu. User tab choices then survive later ticks.
            control?.click();
            openWorkspaceModule('notebook');
        }
        lastLocation=location; lastAttention=active?.id || null;
        for(const [id,button] of buttons) {
            const available = id === "people" && knownPeople || [...sections.get(id).children].some(wrap => !wrap.hidden && wrap.querySelector(".expedition_panel:not([hidden])"));
            button.disabled = !available; button.hidden = !available;
            button.title = "";
        }
        if(buttons.get(selected).disabled) selected=[...buttons].find(([,b]) => !b.disabled)?.[0] || "here";
        root.hidden ||= [...buttons.values()].every(button => button.disabled);
        const empty = document.getElementById("notebook_empty");
        if(empty) {empty.hidden = !familiar || !root.hidden; empty.textContent = snapshot.inDialogue ? "Finish your conversation to use these notes." : snapshot.inCombat ? "Finish combat to use these notes." : "No local notes are available here.";}
        for(const [id,button] of buttons) {const isSelected=id===selected; button.setAttribute("aria-selected",String(isSelected)); button.tabIndex=isSelected ? 0 : -1; sections.get(id).hidden=!isSelected;}
        const message = error || active?.text || ""; if(status.textContent !== message) status.textContent=message; status.hidden=!message;
    }
    function open(view = selected) {openWorkspaceModule('notebook');render(); if(buttons.has(view) && !buttons.get(view).disabled) {selected=view; render();} document.getElementById("journal_show_notebook")?.click();}
    render();
    // Discovered: the notebook once its journal control shows (familiar, from saved state); people and routes once they have had content (sticky per session).
    definePanel({id:'notebook',role:'records',unavailableReason:()=> 'No local notes are available here',title:'Notes, practice & people',node:root,home:'right',eligible:()=>!root.hidden,discovered:()=>{const c=document.getElementById('journal_show_notebook');return c?!c.hidden:!root.hidden;}});
    definePanel({id:'known-people',role:'records',settings:[{key:'sort',label:'Sort people',description:'Order known people by their most recent recorded memory or by name.',options:[['recent','Most recent'],['name','Name']],default:'recent'}],unavailableReason:()=> 'No known people to show here',title:'People you know',node:people.panel,home:'right',eligible:()=>!people.panel.hidden,discovered:()=>!people.panel.hidden});
    const routes=document.getElementById('known_routes_panel');if(routes)definePanel({id:'known-routes',role:'records',unavailableReason:()=> 'No learned routes to show here',title:'Known routes',node:routes,home:'right',eligible:()=>!routes.hidden,discovered:()=>!routes.hidden});
    const unsubscribe = subscribeDisplaySettings(() => render());
    return {render, open, destroy() { unsubscribe(); }};
}
