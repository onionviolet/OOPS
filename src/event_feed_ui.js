import {definePanel} from './panel_kit.js';
import {eventFeed} from "./event_feed.js";
import {reportAttention,reportProjection} from "./host.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createEventFeed({registry, read, open}) {
    const panel = node("details"); panel.id = "world_event_feed";
    panel.setAttribute("aria-label", "Known world events"); panel.open = true;
    const summary = node("summary", "World events"), leads = node("div"), past = node("details");
    const pastSummary = node("summary", "Recent news"), history = node("ol");
    past.append(pastSummary,history); panel.append(summary,leads,past);
    const lifePanel=node('details'),heardPanel=node('details'),lifeHistory=node('ol'),heardHistory=node('ol');
    lifeHistory.style.maxHeight='16rem';lifeHistory.style.overflowY='auto';
    lifePanel.id='life_event_view'; heardPanel.id='heard_event_view';
    lifePanel.append(node('summary','Life'),lifeHistory);heardPanel.append(node('summary','Heard'),heardHistory);panel.append(lifePanel,heardPanel);
    const rows = new Map(); let historySignature,lifeSignature,heardSignature;
    function render() {
        const snapshot = read(), {state,context} = snapshot, feed = eventFeed(state,registry,context.facts,snapshot.lifeRecord);
        panel.hidden = !feed.leads.length && !feed.news.length && !feed.life.length && !feed.heard.length;
        const count = feed.leads.filter(e => e.available).length;
        reportAttention(count, feed.leads.find(e => e.available)?.label || "");
        reportProjection("events", () => ({leads: feed.leads.map(e => ({label: e.label, detail: e.detail, available: e.available})), news: feed.news.map(m => m.text)}));
        summary.textContent = `World events${count ? ` · ${count} available` : ""}`;
        for(const e of feed.leads) {
            let row = rows.get(e.id);
            if(!row) {
                const card=node("section"), label=node("strong"), detail=node("p"), button=node("button");
                card.dataset.worldEvent=e.id; button.type="button";
                card.append(label,detail,button); leads.append(card);
                row={card,label,detail,button,event:e}; rows.set(e.id,row);
                button.addEventListener("click", () => open(row.event));
            }
            row.event=e; row.label.textContent=e.label; row.detail.textContent=e.detail;
            const away=e.locations && !e.locations.includes(context.facts.location);
            const unknownPerson=e.panel === "simulation_panel" && document.getElementById(e.panel)?.hidden;
            row.button.textContent=away ? `Return to ${e.locations[0]}` : unknownPerson && !snapshot.inDialogue ? "Meet the craftsman in Village" : e.action;
            row.button.disabled=away || unknownPerson || !!snapshot.inDialogue || !!snapshot.inCombat;
            row.button.title=away ? `Meet the people involved at ${e.locations[0]}.` : snapshot.inDialogue ? "Finish your conversation first." : snapshot.inCombat ? "Finish combat first." : unknownPerson ? "Meet the craftsman before using his workshop controls." : "Open the existing Notebook controls.";
        }
        for(const [id,row] of rows) if(!feed.leads.some(e => e.id === id)) {row.card.remove(); rows.delete(id);}
        // Keep current buttons mounted while countdowns tick, preserving focus.
        feed.leads.forEach((e,i) => {const card=rows.get(e.id).card; if(leads.children[i] !== card) leads.insertBefore(card,leads.children[i] || null);});
        const signature=JSON.stringify(feed.news);
        if(signature !== historySignature) {historySignature=signature; history.replaceChildren(...feed.news.map(m => node("li",m.text)));}
        past.hidden=!feed.news.length;
        const ls=JSON.stringify(feed.life),hs=JSON.stringify(feed.heard);
        if(ls!==lifeSignature){lifeSignature=ls;lifeHistory.replaceChildren(...feed.life.map(m=>node('li',m.text)));}
        if(hs!==heardSignature){heardSignature=hs;heardHistory.replaceChildren(...feed.heard.map(m=>node('li',m.text)));}
        lifePanel.hidden=!feed.life.length;heardPanel.hidden=!feed.heard.length;
    }
    definePanel({id:'world-events',title:'World events',role:'records',node:panel,home:document.getElementById('main_content'),defaultDock:'center',after:'records',discovered:()=>!panel.hidden,eligible:()=>!panel.hidden});
    render(); return {render};
}
