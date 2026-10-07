import {eventFeed} from "./event_feed.js";

const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
export function createEventFeed({registry, read, open}) {
    const panel = node("details"); panel.id = "world_event_feed";
    panel.setAttribute("aria-label", "Known world events"); panel.open = true;
    const summary = node("summary", "World events"), leads = node("div"), past = node("details");
    const pastSummary = node("summary", "Recent news"), history = node("ol");
    past.append(pastSummary,history); panel.append(summary,leads,past);
    const rows = new Map(); let historySignature;
    function render() {
        const snapshot = read(), {state,context} = snapshot, feed = eventFeed(state,registry,context.facts);
        const host = document.getElementById("message_box_div");
        if(panel.parentElement !== host) host.prepend(panel);
        panel.hidden = !feed.leads.length && !feed.news.length;
        const count = feed.leads.filter(e => e.available).length;
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
    }
    render(); return {render};
}
