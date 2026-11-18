import {rehearsedFoeObservation} from './rehearsed_foe.js';
import {formatDuration} from "./number_format.js";
import {powerSheet,storedKit,takingWhy,takingIntake} from "./power_taking.js";
import {previewSimulationCommand} from "./simulation.js";
import {pursuitView} from "./pursuit.js";
import {previewFieldRenewal,previewRivalRematch,RIVAL_PURSUIT} from "./frontier_campaign.js";
const node=(tag,text="")=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createFrontierCampaignPanel({registry,read,command}) {
    const panel=node("details");panel.id="frontier_campaign_panel";panel.className="expedition_panel";
    panel.append(node("summary","Road rivalry & field legacy"));
    const notice=node("p"),report=node("p"),actions=node("div"),battle=node("section"),legacy=node("details"),taking=node("section");
    taking.id="power_taking_panel";
    legacy.append(node("summary","Field apprenticeship renewal"));
    panel.append(notice,report,actions,battle,taking,legacy);notice.setAttribute("role","status");
    let message="",preview=null;const controls=new Map();
    const run=c=>{try{command(c);message="Progress saved.";}catch(e){message=e.message;}render();};
    const button=(label,id,handler)=>{const b=node("button",label);b.type="button";b.dataset.campaign=id;b.addEventListener("click",handler);return b;};
    for(const d of registry.simulation.commands.values()) if(d.group === "rival") {
        const b=button(d.label,d.id,()=>run({type:d.id === "rival.rematch" ? "rematch" : "command",id:d.id,targetId:d.targetId,requestId:pursuitView(read().state,RIVAL_PURSUIT)?.requestId}));
        actions.append(b);controls.set(d.id,b);
    }
    const battleText=node("p"),slots=node("div"),attackers=node("div"),defenders=node("div");
    attackers.id="campaign_attacker_box";defenders.id="campaign_defender_box";slots.append(attackers,defenders);
    const resume=button("Start / resume the native duel","resume",()=>run({type:"battle_resume"})),leave=button("Withdraw · keep injuries and spent stamina","withdraw",()=>run({type:"battle_withdraw"}));
    battle.append(battleText,slots,resume,leave);
    const terms=node("p"),review=button("Review the field renewal","renewal_review",()=>{try{preview=previewFieldRenewal(read().state,registry,read().context);message="Review the losses and retained progress below.";}catch(e){message=e.message;}render();}),
        confirm=button("Confirm field renewal","renewal_confirm",()=>{if(preview)run({type:"renewal",sequence:preview.sequence});preview=null;render();}),
        cancel=button("Keep current training","renewal_cancel",()=>{preview=null;render();});
    legacy.append(terms,review,confirm,cancel);
    // PT1: your powers with their terms, what Mara is known to hold, her intake rule, and why the last attempt resolved as it did.
    function renderTaking(state) {
        const sim=state.simulation;taking.replaceChildren();taking.hidden=true;
        if(!sim?.powers?.roadRival)return;
        const mine=powerSheet(state,registry,"player"),kit=storedKit(state,registry,"roadRival","player"),why=takingWhy(state,"roadRival"),intake=takingIntake(state,"roadRival");
        if(!mine.length&&!kit.length&&!why)return;
        taking.hidden=false;taking.append(node("h4","Powers and what was taken"));
        const list=node("ul");list.id="power_sheet";
        for(const r of mine)list.append(node("li",`${r.label}${r.owned?"":" (not with you now)"}${r.note.length?` · ${r.note.join("; ")}`:""}`));
        taking.append(list);
        if(kit.length){const k=node("ul");k.id="power_kit";for(const e of kit)k.append(node("li",`Mara's kit: ${e.label} from ${e.from==="player"?"you":e.from} · ${e.mode} · ${e.terms}${e.left===null?"":`, ${formatDuration(e.left)} left`} · ${e.status}`));taking.append(k);}
        if(intake)taking.append(node("p",`Her intake: ${intake.mode==="copy"?"copies":"absorbs"} ${intake.takes}, needing ${intake.needs}; keeps up to ${intake.capacity}; terms ${intake.terms}.`));
        if(why){const w=node("p",`Why: ${why}`);w.id="power_taking_why";taking.append(w);}
    }
    function render() {
        const snapshot=read(),{state,context,error}=snapshot,f=state.actors.player.facts,session=state.simulation?.sessions.player;
        const managed=session?.nativeBattle?.schema===1?session.nativeBattle:null,p=pursuitView(state,RIVAL_PURSUIT),canWrite=snapshot.canWrite;
        panel.hidden=!f["field.member"] || snapshot.inDialogue || snapshot.inCombat && !managed;
        notice.textContent=error || message;notice.hidden=!notice.textContent;
        report.textContent=p ? `${p.text} ${f["rival.lastResult"] ? `Last duel: ${f["rival.lastResult"]}.` : ""}` : "An association route has drawn another scout's interest. An optional meeting begins this local rivalry.";
        const observed=rehearsedFoeObservation(state);if(observed)report.textContent+=' '+observed;
        for(const [id,b] of controls) {
            const d=registry.simulation.commands.get(id);let view;
            try{view=state.simulation ? id === "rival.rematch" ? previewRivalRematch(state,registry,context) : previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId || null}) : null;}catch(e){view={visible:false,reasons:[e.message]};}
            b.hidden=!view?.visible || !!managed || !!(d.once && state.actors.player.completed[id]);
            b.disabled=!canWrite || !!error || !view?.eligible;
            if(id === "rival.confront" && (context.vitals?.player?.health <= 1 || state.simulation?.people.roadRival?.vitals.health <= 1)) b.disabled=true;
            b.title=[d.description,...(view?.reasons || [])].filter(Boolean).join(" ");
        }
        battle.hidden=!managed;battleText.textContent=managed ? `${managed.last} Saved strikes: ${managed.actions}. The shared world clock pauses during this agreed duel.` : "";
        resume.textContent=managed?.schema===2?"Start / resume the guarded contest":"Start / resume the native duel";
        resume.disabled=!canWrite || !!error || snapshot.battleRunning;leave.disabled=!canWrite || !!error;
        renderTaking(state);
        legacy.hidden=!f["field.facility"];
        terms.textContent=f["field.renewed"] ? "Field legacy earned. Native adventure, workshop, recipes and people remain. This prototype has one renewal." : preview ? `Lose: ${preview.lost.join(". ")}. Keep: ${preview.retained.join("; ")}. Gain: ${preview.reward}.` : "A renewal requires a dry rack, a delivered supply commission, a resolved rivalry and Load-bearing Step mastery 2. Review exact losses before choosing.";
        confirm.hidden=!preview;cancel.hidden=!preview;review.hidden=!!preview || !!f["field.renewed"];
        review.disabled=!canWrite || !!error || !!managed;confirm.disabled=!canWrite || !!error;
        // Clock/sequence drift invalidates the visible terms without accepting them.
        if(preview && preview.sequence !== state.sequence){preview=null;confirm.hidden=true;cancel.hidden=true;review.hidden=false;terms.textContent="Progress changed. Review the renewal again.";}
    }
    document.getElementById("location_actions_div")?.append(panel);render();return {render};
}
