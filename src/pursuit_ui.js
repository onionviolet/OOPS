import {previewSimulationCommand,previewSimulationResponse} from "./simulation.js";
import {pursuitView} from "./pursuit.js";
const node=(tag,text="")=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createPursuitPanel({registry,read,command}) {
    const panel=node("details");panel.id="pursuit_panel";panel.className="expedition_panel";
    panel.append(node("summary","Encounters & pursuit"));
    const notice=node("p"),encounter=node("section");panel.append(notice,encounter);
    let message="",sessionSignature="";const rows=new Map(),buttons=new Map();
    const run=c=>{try {command(c);message="Progress saved.";}catch(e){message=e.message;}render();};
    for(const d of registry.simulation.pursuits.values()) {
        if(d.id === "frontier.road_rival") continue;
        const card=node("details"),info=node("p"),actions=node("div");card.dataset.pursuitCase=d.id;
        card.append(node("summary",d.label),info,actions);panel.append(card);rows.set(d.id,{card,info,actions,definition:d});
    }
    for(const d of registry.simulation.commands.values())if(d.group === "pursuit") {
        const trackId=d.trackId || "village.trail_test",row=rows.get(trackId),b=node("button",d.label);b.type="button";b.dataset.pursuit=d.id;
        b.addEventListener("click",()=>run({type:"command",id:d.id,targetId:d.targetId,requestId:pursuitView(read().state,trackId)?.requestId}));
        b.title=d.description || "";row.actions.append(b);buttons.set(d.id,b);
    }
    function render() {
        const snapshot=read(),{state,context,enabled,error}=snapshot,s=state.simulation,session=s?.sessions.player?.pursuitId && !s.sessions.player.nativeBattle ? s.sessions.player : null;
        panel.hidden=(!state.actors.player.facts["field.member"] && !s?.pursuits) || snapshot.inDialogue || snapshot.inCombat && !session;
        notice.textContent=error || message;notice.hidden=!notice.textContent;
        for(const [id,row] of rows) {
            const view=pursuitView(state,id),start=[...registry.simulation.commands.values()].find(d=>d.group === "pursuit" && (d.trackId || "village.trail_test") === id && d.once);
            const known=s?.knowledge.player?.[row.definition.noticeKey || "pursuit.notice"];
            const scheduled=Object.values(s?.checks || {}).find(c=>registry.simulation.events.get(c.definitionId)?.effects.some(e=>e.type === "pursuit" && e.pursuitId === id));
            const text=view ? `${view.text} Last report: minute ${view.observedAt}.` : known ? `${known.value}${scheduled ? ` Opens in ${Math.max(0,scheduled.due-state.clock)} played minutes.` : ""}` : start?.description || row.definition.label;
            if(row.info.textContent !== text)row.info.textContent=text;
        }
        for(const [id,b] of buttons) {
            const d=registry.simulation.commands.get(id),view=pursuitView(state,d.trackId || "village.trail_test"),preview=s ? previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId}) : null;
            b.hidden=!preview?.visible || !!(d.once && state.actors.player.completed[id]) || !!session || !!d.pursuitId && !view?.requestId;
            if(id.endsWith("report"))b.hidden ||= view?.status === "closed";
            b.disabled=!enabled || !!error || !preview?.eligible;
            b.title=[d.description,...(preview?.reasons || [])].filter(Boolean).join(" ");
            if(b.hidden && document.activeElement === b)panel.querySelector("summary").focus();
        }
        const signature=session ? `${session.id}:${session.turn}` : "";
        if(signature !== sessionSignature) {
            sessionSignature=signature;encounter.replaceChildren();
            if(session) {
                encounter.append(node("p",session.turns[session.turn].cue));
                for(const r of session.turns[session.turn].responses) {
                    const b=node("button",r.label);b.type="button";b.dataset.pursuit=`response.${r.id}`;b.addEventListener("click",()=>run({type:"response",responseId:r.id}));encounter.append(b);
                }
                const leave=node("button","Withdraw from this nonlethal encounter");leave.type="button";leave.dataset.pursuit="withdraw";leave.addEventListener("click",()=>run({type:"withdraw"}));encounter.append(leave);
            }
        }
        for(const b of encounter.querySelectorAll("button")) {
            const choice=b.dataset.pursuit.split(".");
            const preview=choice[0] === "response" ? previewSimulationResponse(state,registry,{kind:"encounter",responseId:choice[1]},context) : {eligible:true,reasons:[]};
            b.disabled=!!error || !snapshot.canWrite || !preview.eligible;b.title=preview.reasons.join(" ");
        }
    }
    document.getElementById("location_actions_div")?.append(panel);render();return {render};
}
