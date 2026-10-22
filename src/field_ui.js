import {alloyEquipmentFacts} from "./alloy_equipment.js";
import {previewSimulationCommand, previewSimulationResponse, simulationOccupiesActor} from "./simulation.js";
import {fieldWorkshopView} from "./field_workshop.js";
import {createFieldWorksPanel} from './field_works_ui.js';
import {energyView} from "./energy_resources.js";
import {leverBlockers,leverTaskRecord} from './lever_lesson.js';
const node = (tag,text="",className="") => {const n=document.createElement(tag);n.textContent=text;n.className=className;return n;};
export function createFieldPanel({registry,read,command,openWorkshop,localActions}) {
    const panel=node("details","","expedition_panel");panel.id="field_panel";panel.append(node("summary","Field association & practical workshop"));
    const body=node("div"),intro=node("p"),status=node("p","","expedition_notice"),report=node("p"),energies=node("p"),events=node("div"),encounter=node("section");
    status.setAttribute("role","status");body.append(intro,status,report,energies,encounter,events);panel.append(body);
    const groups=new Map(),controls=new Map();let notice="",eventSignature="",sessionSignature="";
    const run=c=>{try{command(c);notice="Progress saved.";}catch(e){notice=e.message;}render();};
    const button=(label,id,c)=>{const b=node("button",label);b.type="button";b.dataset.fieldCommand=id;b.addEventListener("click",()=>run(c));return b;};
    for(const [id,label] of [["association","Association"],["lever","Wedged timber & lever lesson · PROPOSAL"],["methods","Methods & recovery"],["workshop","Project & production"],["road","Road aftermath"],["assessment","Assessment"]]) {
        const group=node("details","","notebook_preparation");group.append(node("summary",label));group.open=id==="association";body.append(group);groups.set(id,group);
    }
    const begin=button("Ask about a shared field workshop","field.begin",{type:"field_begin"});groups.get("association").append(begin);
    for(const d of registry.simulation.commands.values()) if(d.group === "field" && d.actorId === "player" && d.id !== "field.begin" && !d.id.startsWith('field.works.')) {
        const card=node("div","","expedition_card"),b=button(d.label,d.id,{type:"command",id:d.id,targetId:d.targetId}),reason=node("p","","expedition_requirements");
        card.append(b);if(d.description)card.append(node("p",d.description));card.append(reason);groups.get(d.uiSection || "workshop").append(card);controls.set(d.id,{card,b,reason});
    }
    const cancel=button("Cancel your field work · return reserved inputs","cancel",{type:"cancel"});body.append(cancel);
    const repeat=button("Make up to 3 focus kits · stop when inputs or energy run short","routine",{type:"program",id:"field.pack_focus",count:3});groups.get("workshop").append(repeat);
    const leverRepeat=button("Queue 3 lever jobs · stop if support or logs run short","lever_routine",{type:"program",id:"field.lp1.lever_work",count:3});groups.get("lever").append(leverRepeat);
    const leverRecord=node("p");leverRecord.dataset.leverRecord="";groups.get("lever").insertBefore(leverRecord,groups.get("lever").children[1]);
    const works=createFieldWorksPanel({registry,read,command});body.append(works.element);
    const workshopDoor=node('button','Open practical workshop','location_choices');workshopDoor.type='button';workshopDoor.dataset.fieldWorkshopDoor='';
    workshopDoor.addEventListener('click',()=>{openWorkshop?.();panel.open=true;works.element.open=true;works.element.querySelector('summary')?.focus();});
    const syncDoor=()=>{const {state,context,inDialogue}=read(),f=state.actors.player.facts;
        workshopDoor.hidden=!openWorkshop||inDialogue||!(context.facts.location==='Shack'||context.facts.location==='Village'&&f['field.works.freight'])||!f['field.facility'];
        if(!workshopDoor.isConnected)localActions?.append(workshopDoor);};
    const doorObserver=localActions?new MutationObserver(()=>{if(!workshopDoor.isConnected)syncDoor();}):null;
    doorObserver?.observe(localActions,{childList:true});
    const pause=button("Pause after the current field job","pause",{type:"pause"}),resume=button("Resume the remaining field jobs","resume",{type:"resume"});groups.get("workshop").append(pause,resume);
    function render() {
        works.render();
        syncDoor();
        const snapshot=read(),{state,context,enabled,error}=snapshot,s=state.simulation,f=state.actors.player.facts,view=fieldWorkshopView(state);
        const job=s?.jobs.find(j=>j.actorId === "player" && registry.simulation.commands.get(j.commandId)?.group === "field");
        const session=s?.sessions.player?.definitionId === "field.assessment" ? s.sessions.player : null;
        panel.hidden=snapshot.inDialogue || (!context.facts["village.craftsmanMet"] && !view.introduced) || !["Village","Shack"].includes(context.facts.location) && !job && !session;
        if(!panel.isConnected)document.getElementById("location_actions_div")?.append(panel);
        intro.textContent=view.member ? `Your ${view.entry === "craft" ? "supplied brace" : "route findings"} earned access. The workshop and its people remain part of this local campaign.` : "A small field association needs route findings or a sound brace. Joining opens optional methods and a shared workshop project.";
        begin.hidden=view.introduced;begin.disabled=!enabled || !!error || context.facts.location !== "Village" || !context.facts["village.craftsmanMet"];
        for(const [id,c] of controls) {
            const d=registry.simulation.commands.get(id);let preview;
            try{preview=s ? previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId || null}) : null;}catch(e){preview={visible:false,eligible:false,reasons:[e.message]};}
            c.card.hidden=!view.introduced || !preview?.visible || !!(d.once && state.actors.player.completed[id]) || d.location !== context.facts.location || !!(d.claim && s.claims[d.claim]);
            c.b.disabled=!enabled || !!error || !preview?.eligible;c.reason.textContent=c.b.disabled && !c.card.hidden ? preview?.reasons.join(" ") || error || "Finish your current activity first." : "";c.reason.hidden=!c.reason.textContent;
            if(id.startsWith('field.lp1.') && c.b.disabled && !c.card.hidden) {
                const reasons=[...leverBlockers(state,context,id),...(preview?.reasons || []).filter(r=>r!==d.requires?.reason)];
                c.reason.textContent=reasons.join(' ') || error || 'Finish your current activity first.';
                c.reason.hidden=false;
            }
            if(c.card.hidden && document.activeElement === c.b)groups.get(d.uiSection || "workshop").querySelector("summary").focus();
        }
        const alloy = alloyEquipmentFacts(state, context)["equipment.springsteel.equipped"];
        const driveButton = controls.get("field.pack_drive")?.b;
        if(driveButton) driveButton.textContent = `Use the workshop with drive · 1 log + 1 coin · 1 min → ${alloy ? 2 : 1} kit${alloy ? "s" : ""} · ${alloy ? 2 : 3} drive units${alloy ? " · spring grade 1 (proposal)" : ""}`;
        const ownEnergies=energyView(state);energies.hidden=!ownEnergies.length;
        energies.textContent=ownEnergies.map(e=>`${e.label}: ${e.reserve}/${e.capacity} units; strain ${e.strain}/${e.strainLimit}; output ${e.output}, control ${e.control}.`).join(" ");
        report.hidden=!view.introduced || !state.actors.player.completed["field.project_start"];
        report.textContent=`Agreed contributions: ${view.project.phases.map(p=>`${p.id}: ${p.knownComplete ? p.own ? "finished by you" : "reported complete" : "not yet reported complete"}`).join("; ")}. Road: ${view.road}${view.observedAt == null ? "." : ` (last report ${state.clock-view.observedAt} game minutes ago).`}`;
        status.textContent=error || (job ? `${job.label} · ${job.due-state.clock} min remaining` : notice);status.hidden=!status.textContent;
        cancel.hidden=!job || job.cancellation === "none" || job.commandId.startsWith('field.works.');cancel.disabled=!!error;
        cancel.textContent=job?.cancellation === "forfeit" ? "Cancel your field work · spent inputs are forfeited" : "Cancel your field work · return reserved inputs";
        leverRepeat.hidden=!s?.knowledge.player?.['field.lp1.method'];
        leverRepeat.disabled=!enabled || !!error || !s || !previewSimulationCommand(state,registry,'field.lp1.lever_work',context).eligible;
        const lesson=leverTaskRecord(state);
        leverRecord.hidden=!view.introduced;
        leverRecord.textContent=lesson.text;
        const teacherReturn=controls.get('field.lp1.return');
        if(teacherReturn && (lesson.legacy || lesson.learned)) teacherReturn.card.hidden=true;
        const program=s?.programs.player,isFieldProgram=program?.commandId.startsWith("field.")&&!program.commandId.startsWith('field.works.');
        repeat.hidden=!view.facility || !ownEnergies.some(e=>e.id === "field.focus");repeat.disabled=!enabled || !!error || !s || !previewSimulationCommand(state,registry,"field.pack_focus",context).eligible;
        if(program?.commandId==='field.lp1.lever_work') {
            status.textContent+=(status.textContent?' · ':'')+`Lever queue: ${program.remaining} jobs left; ${program.status}. ${program.reason||''}`;
            status.hidden=false;
        }
        pause.hidden=!isFieldProgram || program.status !== "running";resume.hidden=!isFieldProgram || program.status !== "paused" || !program.remaining;pause.disabled=!!error;resume.disabled=!!error || !enabled || simulationOccupiesActor(state);
        const offers=Object.values(s?.events || {}).filter(e=>e.actorId === "player" && e.status === "open" && e.discoveredBy.includes("player") && registry.simulation.events.get(e.definitionId)?.group === "field");
        const signature=JSON.stringify([offers.map(e=>[e.id,e.expiresAt,e.status]),enabled,error,state.sequence]);
        if(signature !== eventSignature) {eventSignature=signature;
            // Keep existing response controls alive across timer/resource updates.
            for(const old of [...events.children])if(!offers.some(e=>e.id === old.dataset.fieldEvent))old.remove();
            for(const e of offers) {
                let row=[...events.children].find(n=>n.dataset.fieldEvent === e.id);
                if(!row){row=node("section");row.dataset.fieldEvent=e.id;row.append(node("p"));for(const r of e.responses)row.append(button(r.label,`event.${r.id}`,{type:"event",eventId:e.id,responseId:r.id}));events.append(row);}
                row.firstChild.textContent=`${e.label} · ${Math.max(0,e.expiresAt-state.clock)} min remaining. No response means a later detour, with no debt.`;
                for(const r of e.responses){const b=row.querySelector(`[data-field-command="event.${r.id}"]`),p=previewSimulationResponse(state,registry,{kind:"event",eventId:e.id,responseId:r.id},context);b.disabled=!enabled || !!error || !p.eligible;b.title=p.reasons.join(" ");}
            }
        }
        for(const row of events.children){const e=offers.find(e=>e.id === row.dataset.fieldEvent);if(e)row.firstChild.textContent=`${e.label} · ${Math.max(0,e.expiresAt-state.clock)} min remaining. No response means a later detour, with no debt.`;}
        const ss=JSON.stringify(session ? [session.id,session.turn,error,state.sequence] : null);
        if(ss !== sessionSignature){sessionSignature=ss;encounter.replaceChildren();if(session){const turn=session.turns[session.turn];encounter.append(node("p",turn.cue));for(const r of turn.responses){const b=button(r.label,`response.${r.id}`,{type:"response",responseId:r.id}),p=previewSimulationResponse(state,registry,{kind:"encounter",responseId:r.id},context);b.disabled=!!error || !p.eligible;b.title=p.reasons.join(" ");encounter.append(b);}encounter.append(button("Withdraw · retain spent inputs","withdraw",{type:"withdraw"}));}}
        for(const [id,g] of groups)g.hidden=![...g.children].some(n=>n.tagName !== "SUMMARY" && !n.hidden);
    }
    render();return {render,destroy(){doorObserver?.disconnect();workshopDoor.remove();}};
}
