import {previewSimulationCommand} from "./simulation.js";
import {promiseView, promiseId, visitorId} from "./promise_content.js";
import {createTemperamentPort} from './person_temperament.js';
import {domainRegistry} from './domain_registry.js';
import {reactionLine, silenceLine, recalledPhrase} from './person_memory_effects.js';
import {witnessView} from './crowd_memory.js';
import {standingView, standingLines} from './person_standing.js';
import {generatePersonName} from './name_grammar.js';
import {crushSocialContext} from './crush_social_facts.js';
import {promiseReturnRecap, crushSocialActionLine} from './crush_social_views.js';
const node=(tag,text="",className="")=>{const n=document.createElement(tag);n.textContent=text;n.className=className;return n;};

export function createPromisePanel({registry,read,command}) {
    const panel=node("details","","expedition_panel");panel.id="promise_panel";
    panel.append(node("summary","A wary traveler"));
    const intro=node("p"),standing=node("p","","promise_standing"),crowd=node("p","","promise_crowd"),quiet=node("p","","promise_quiet"),records=node("div"),status=node("p","","expedition_status"),recap=node('section','','expedition_card'),
        recapTitle=node('h4','Returning to Tamsin'),recapRecords=node('div'),recapUseful=node('div'),recapQuotes=node('div'),recapTerms=node('p'),
        socialHistory=node('details'),socialHistoryRecords=node('div');
    socialHistory.append(node('summary','Your remembered cart checks'),socialHistoryRecords);
    recap.append(recapTitle,recapRecords,recapUseful,recapQuotes,recapTerms);
    status.setAttribute("role","status");quiet.id='promise_quiet_note';standing.id='promise_standing_note';crowd.id='promise_crowd_note';panel.append(intro,standing,crowd,quiet,recap,records,socialHistory,status);
    let notice="",signature="";
    const controls=new Map();
    const run=c=>{try{
        command({...c,sequence:read().state.sequence});
        notice=c.type === "cancel" ? "Work cancelled. Each participant’s reserved inputs were returned; elapsed time stays spent."
            : read().state.simulation?.jobs.some(j=>j.actorId === "player") ? "" : "Your response is recorded below.";
    }catch(e){notice=e.message;}render();};
    const begin=node("button","Speak to the wary traveler");begin.type="button";begin.dataset.promiseCommand="promise.begin";
    begin.addEventListener("click",()=>run({type:"promise_begin"}));panel.append(begin);
    for(const d of registry.simulation.commands.values()) if(d.group === "promise" && d.actorId === "player" && d.id !== "promise.begin") {
        const row=node("div","","expedition_card"),b=node("button",d.label),reason=node("p","","expedition_requirements");
        b.type="button";b.dataset.promiseCommand=d.id;b.addEventListener("click",()=>run({type:"command",id:d.id,targetId:d.targetId || null}));
        row.append(b);if(d.description)row.append(node("p",d.description));row.append(reason);panel.append(row);controls.set(d.id,{row,b,reason});
    }
    const cancel=node("button","Cancel accepted work · return each participant’s reserved inputs");cancel.type="button";cancel.dataset.promiseCommand="cancel";
    cancel.addEventListener("click",()=>run({type:"cancel"}));panel.append(cancel);
    function render() {
        const focused=document.activeElement;
        const snapshot=read(),{state,enabled,error}=snapshot,context=crushSocialContext(state,snapshot.context),s=state.simulation,view=promiseView(state);
        const returnView=promiseReturnRecap(state,registry,context);
        const job=s?.jobs.find(j=>j.actorId === "player" && registry.simulation.commands.get(j.commandId)?.group === "promise");
        panel.hidden=!!snapshot.inDialogue || !!snapshot.inCombat || !view.introduced && !context.facts["village.elderMet"] || context.facts.location !== "Village" && !job;
        if(!panel.isConnected)document.getElementById("location_actions_div")?.append(panel);
        begin.hidden=view.introduced;begin.disabled=!enabled || !!error || context.facts.location !== "Village";
        if(begin.hidden && focused === begin)panel.querySelector("summary").focus();
        const situation=s?.situations?.[promiseId];
        intro.textContent=!view.introduced ? "A traveler beside a damaged cart watches you, then checks a folded slip." : !state.actors.player.completed["promise.investigate"] && !state.actors.player.completed["promise.help"] && !state.actors.player.completed["promise.decline"] && situation.phase === "introduced"
            ? "Tamsin will wait "+Math.max(0,situation.deadline-state.clock)+" more played minutes before arranging her own repair. Silence makes no agreement."
            : "Tamsin stays beside the cart. Speak again when she has news, or ask about her bracing method.";
        // P3c: what the craftsman will do with a confidence, and how Tamsin treats you if it got out. Derived each render, never saved.
        const people=s?.people||{},day=Number.isSafeInteger(context.facts.calendarMinute)?Math.floor(context.facts.calendarMinute/1440):null,memory=domainRegistry.command('memory','read')?.();
        standing.textContent="";
        if(day!==null && memory && s && people.oldCraftsman?.life==='alive' && memory.holders.oldCraftsman) {
            const port=createTemperamentPort(id=>registry.simulation.people.get(people[id]?.definitionId||id));
            standing.textContent=standingLines(standingView({memory,holder:"oldCraftsman",subject:"player",day,temperamentOf:port})).join(" ");
        }
        standing.hidden=!standing.textContent;
        crowd.textContent="";
        if(day!==null && memory && s) {
            const port=createTemperamentPort(id=>registry.simulation.people.get(people[id]?.definitionId||id));
            const v=witnessView({memory,place:"Village",subject:"player",day,root:s.seed,nameOf:(seed,id)=>generatePersonName({seed,key:id}).name,
                lineOf:holder=>reactionLine({memory,holder,subject:"player",day,root:s.seed,temperamentOf:port})||recalledPhrase({memory,holder,subject:"player",day})});
            crowd.textContent=[v.group&&`Villagers who saw you: ${v.group.count} watched.`,...v.witnesses.map(w=>`${w.name} (${w.role}) remembers you.${w.line?" "+w.line:""}`)].filter(Boolean).join(" ");
        }
        crowd.hidden=!crowd.textContent;
        quiet.textContent="";
        if(view.introduced && day!==null && memory && people.oldCraftsman?.life==='alive' && people[visitorId]?.life==='alive'){
            const port=createTemperamentPort(id=>registry.simulation.people.get(people[id]?.definitionId||id)),baselineOf=(h,o)=>s.relationships?.[h]?.[o]?.axes||{};
            const hold=silenceLine({memory,holder:'oldCraftsman',subject:'player',listener:visitorId,day,root:s.seed,baselineOf,temperamentOf:port});
            const manner=reactionLine({memory,holder:visitorId,subject:'player',day,root:s.seed,baseline:s.relationships?.[visitorId]?.player?.axes,temperamentOf:port});
            quiet.textContent=[hold&&"The craftsman, asked to keep the interruption quiet. "+hold,manner&&"Tamsin: "+manner].filter(Boolean).join(" ");
        }
        quiet.hidden=!quiet.textContent;
        const next=JSON.stringify(view.details);
        if(next !== signature){signature=next;records.replaceChildren(...view.details.map(k=>node("p",(k.basis?.kind === "recollection" ? "Attributed recollection: " : k.basis?.kind === "instruction" ? "Learned method: " : "Observed or reported: ")+k.text)));}
        recap.hidden=!returnView.visible;
        if(returnView.visible) {
            recapRecords.replaceChildren(...[...returnView.records,...returnView.socialRecords.filter(r=>!returnView.records.some(last=>last.id===r.id))].map(r=>
                node('p',`${r.basisLabel}${r.sourceLabel ? ' · '+r.sourceLabel : ''}: ${r.text} ${r.timeText || ''}`)));
            recapUseful.replaceChildren(...returnView.useful.map(r=>node('p',r.text)));
            recapQuotes.replaceChildren(...returnView.actions.map(a=>node('p',crushSocialActionLine(a))));
            if(returnView.job)recapQuotes.prepend(node('p',`${returnView.job.label}: ${returnView.job.remainingText} ${returnView.job.costs.map(c=>c.text).join(' ')} ${returnView.job.cancellation.text}`));
            recapTerms.textContent=returnView.terms;
        }
        socialHistory.hidden=!returnView.history?.length;
        if(!socialHistory.hidden)socialHistoryRecords.replaceChildren(...returnView.history.map(r=>
            node('p',`${r.basisLabel}${r.sourceLabel ? ' · '+r.sourceLabel : ''}: ${r.text} ${r.timeText || ''}`)));
        for(const [id,c] of controls) {
            const d=registry.simulation.commands.get(id);let preview;
            try{preview=s ? previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId || null}) : null;}catch(e){preview={visible:false,reasons:[e.message]};}
            c.row.hidden=!view.introduced || !preview?.visible || !!(d.once && state.actors.player.completed[id]) || context.facts.location !== "Village";
            c.b.disabled=!enabled || !!error || !preview?.eligible;
            const social=id.startsWith('crush_social.');
            const disclosed=returnView.actions.find(a=>a.id===id);
            c.reason.textContent=c.row.hidden || !c.b.disabled ? "" : error || (social ? disclosed?.blockers.map(b=>b.text).join(' ') || 'Restore the agreed participant, actual means and supported local contact before this shared work.' : preview?.reasons.join(" ")) || "Finish your current activity first.";c.reason.hidden=!c.reason.textContent;
            if(c.row.hidden && focused === c.b)panel.querySelector("summary").focus();
        }
        status.textContent=error || (job ? job.label+" · "+Math.max(0,job.due-state.clock)+" min remaining. Reserved inputs remain spent." : notice);status.hidden=!status.textContent;
        cancel.hidden=!job || job.cancellation === "none";cancel.disabled=!!error || !snapshot.canWrite;
        if(cancel.hidden && focused === cancel)panel.querySelector("summary").focus();
    }
    render();return {render};
}
