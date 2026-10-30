import {previewSimulationCommand} from "./simulation.js";
import {bodyScene} from "./body_progression.js";
import {bodyViewModel} from "./body_figure.js";
import {harmView,harmState} from "./harm_state.js";
import {renderBodyView} from "./ui/body_view.js";

export function createBodyPanel({registry,read,command}) {
    const node=(tag,text="")=>{const n=document.createElement(tag);n.textContent=text;return n;};
    const panel=node("details");panel.id="body_panel";panel.className="expedition_panel";panel.append(node("summary","Body & recovery"));
    const scene=node("p"),status=node("p"),body=node("div");status.setAttribute("role","status");
    const figure=node("details"),figureHost=node("div");figure.className="body-figure";figure.open=true;figure.append(node("summary","Body by part"),figureHost);let drawn="";
    body.append(scene,figure,status);panel.append(body);
    let notice="";const cards=new Map();
    for(const d of registry.simulation.commands.values()) if(d.group === "body") {
        const row=node("section"),button=node("button",d.label),detail=node("p",d.description),reason=node("p");
        row.className="expedition_card";reason.className="expedition_requirements";button.type="button";button.dataset.bodyCommand=d.id;
        button.addEventListener("click",()=>{try {command(d.id === "body.begin" ? {type:"body_begin"}:{type:"command",id:d.id,targetId:d.targetId});notice="";} catch(e){notice=e.message;}render();});
        row.append(button,detail,reason);body.append(row);cards.set(d.id,{row,button,reason});
    }
    const cancel=node("button","Cancel body work");cancel.type="button";cancel.dataset.bodyCancel="work";
    cancel.addEventListener("click",()=>{try{command({type:"cancel"});notice="Work cancelled; no completion reward.";}catch(e){notice=e.message;}render();});body.append(cancel);
    function render() {
        const snapshot=read(),{state,context,enabled,error}=snapshot,s=state.simulation;
        const job=s?.jobs.find(j=>j.actorId === "player" && registry.simulation.commands.get(j.commandId)?.group === "body");
        panel.hidden=snapshot.inDialogue || !context.facts["village.elderMet"] || !["Village","Shack"].includes(context.facts.location) && !job;
        if(!panel.isConnected) document.getElementById("location_actions_div")?.append(panel);
        scene.textContent=bodyScene(state);
        status.textContent=error || notice || (job ? `${job.label} · ${Math.max(0,job.due-state.clock)} min remaining` : "");status.hidden=!status.textContent;
        for(const [id,card] of cards) {
            const d=registry.simulation.commands.get(id);
            if(!s) {card.row.hidden=id !== "body.begin";card.button.disabled=!enabled || !!error || context.facts.location !== "Village";continue;}
            const p=previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId || null});
            card.row.hidden=!p.visible || !!(d.once && state.actors.player.completed[id]);card.button.disabled=!enabled || !!error || !p.eligible;
            card.reason.textContent=p.reasons.join(" ");
        }
        // BC7/BC8 body by part; redrawn only when its model or a cure's state changes, so frequent renders stay no-op writes.
        // A cure button clicks the existing card, so costs, errors and reasons stay with the card.
        const all=[...registry.simulation.commands.values()],model=s?bodyViewModel(state,{harm:harmView({harm:harmState()}),commands:all,cureCommands:all.filter(d=>cards.has(d.id)&&!cards.get(d.id).row.hidden)}):null;figure.hidden=!model;
        const cureState=id=>{const c=cards.get(id);return c&&!c.row.hidden?{disabled:c.button.disabled,reason:c.reason.textContent}:{disabled:true,reason:"Not available yet: this treatment's conditions are not met."};};
        const key=model?JSON.stringify([model,model.parts.flatMap(p=>p.now.flatMap(c=>c.cures.map(x=>cureState(x.id))))]):"";
        if(key!==drawn){drawn=key;const focused=figureHost.contains(document.activeElement)?document.activeElement.dataset.bodyCure:null;
            renderBodyView(figureHost,model,{onCure:id=>cards.get(id)?.button.click(),cureState,idPrefix:"body_view"});if(focused)figureHost.querySelector(`[data-body-cure="${focused}"]`)?.focus();}
        cancel.hidden=!job;cancel.disabled=!!error;cancel.textContent=job?.cancellation === "refund" ? "Cancel body work · return reserved supplies" : "Cancel body work · spent stamina is lost";
    }
    render();return {render};
}
