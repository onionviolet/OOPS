import {LIFE_LESSONS,lifeExperienceView,lifeGrave} from './life_experience.js';
import {ageYears, lifespanDeadline, responseCost} from "./chronicle.js";
import {Game_Time, format_time} from "./game_time.js";
import {knownPeopleView} from "./people_knowledge.js";

export function createChroniclePanel({read, command, duty, cancelDuty, exportSave, reset, beginHeir, heirPreview}) {
    const node = (tag, text = "") => {const n = document.createElement(tag); n.textContent = text; return n;};
    const panel = node("details"); panel.id = "chronicle_panel"; panel.className = "expedition_panel chronicle_panel";
    panel.append(node("summary", "Elder & chronicle"));
    const body = node("div"); panel.append(body);
    const status = node("p"); status.setAttribute("role", "status"); body.append(status);
    const life = node("p"), relation = node("p"), encounter = node("p"), controls = node("div"), events = node("div"), history = node("ol");
    const inheritance = node("p"); inheritance.id = "chronicle_inheritance";
    body.append(life, inheritance, relation, encounter, controls, events, history);
    let notice = "", signature, focusEnded = false;
    const buttons = new Map();
    const add = (id, label, action) => {
        const b = node("button", label); b.type = "button"; b.dataset.chronicle = id;
        b.addEventListener("click", () => {try {action(); notice = "Saved.";} catch(e) {notice = e.message;} render(true);});
        controls.append(b); buttons.set(id, b); return b;
    };
    add("begin-open", "Begin chronicle · age 18, no old-age ending", () => command({type: "enroll", mode: "open"}));
    add("begin-mortal", "Begin mortal chronicle · age 18, life ends at 80", () => command({type: "enroll", mode: "mortal"}));
    add("inspect", "Inspect the elder", () => command({type: "inspect"}));
    add("spar", "Request a control challenge", () => command({type: "start", intent: "spar"}));
    add("attack", "Attack the elder · hostile confrontation", () => command({type: "start", intent: "assault"}));
    add("guard", "Guard", () => command({type: "respond", action: "guard"}));
    add("step", "Ordinary sidestep", () => command({type: "respond", action: "step"}));
    add("rat-step", "Use earned Rat-step", () => command({type: "respond", action: "rat-step"}));
    add("strike", "Strike / counterattack", () => command({type: "respond", action: "strike"}));
    add("withdraw", "Withdraw / concede", () => command({type: "withdraw"}));
    add("manual", "Untimed manual responses", () => command({type: "policy", policy: "manual"}));
    add("auto-guard", "Idle plan: guard, then counter", () => command({type: "policy", policy: "guard"}));
    add("auto-footwork", "Idle plan: move on sweeps, guard tracking, then counter", () => command({type: "policy", policy: "footwork"}));
    add("hear", "Hear local reports", () => command({type: "hear"}));
    add("attend", "Attend the cartographer briefing", () => command({type: "attend"}));
    add("pledge", "Accept archive duty · a concrete promise", () => command({type: "pledge"}));
    add("duty", "Keep archive promise · 5 min, 1 coin", duty);
    add("cancel-duty", "Cancel archive work · reserved coin refunded", cancelDuty);
    add("inherit", "Claim the archive succession", () => command({type: "inherit"}));
    add("debrief", "Discuss the observed counter", () => command({type: "debrief"}));
    add("lesson", "Attend the private guard lesson", () => command({type: "lesson"}));
    add("settle", "Settle the assault grievance · 3 coins", () => command({type: "settle"}));

    for(const lesson of LIFE_LESSONS) {
        add(`reflect.${lesson.id}`, `Write down ${lesson.label}`, () => command({type:'reflect',lesson:lesson.id}));
        add(`teach.${lesson.id}`, `Teach your apprentice ${lesson.label} · 5 minutes`, () => command({type:'teach',lesson:lesson.id}));
        add(`study.${lesson.id}`, `Study the old papers: ${lesson.label} · 5 minutes`, () => command({type:'study',lesson:lesson.id}));
    }
    const end = node("section"); end.id = "chronicle_life_end"; end.hidden = true;
    end.setAttribute("role", "dialog"); end.setAttribute("aria-modal", "true"); end.setAttribute("aria-label", "Mortal life ended");
    const endHeading = node("h2", "This life has ended");
    const legacyHelp=node("p");
    end.append(endHeading, node("p", "Old age ended this mortal life. Game time and activities have stopped. Your possessions, learned knowledge and chronicle are still saved."),
        legacyHelp);
    const exportButton = node("button", "Export this saved life"); exportButton.addEventListener("click", exportSave);
    const resetButton = node("button", "Start a new game · resets all progress"); resetButton.addEventListener("click", reset);
    const graveText=node('p'),bequestText=node('ul'),heirButton=node('button','Begin an heir · they receive what this life left behind');bequestText.id='chronicle_heir_leftovers';
    heirButton.dataset.life='begin-heir';heirButton.type='button';
    const heirNotice=node('p');heirNotice.setAttribute('role','status');
    heirButton.addEventListener('click',()=>{try {beginHeir();}catch(e){heirNotice.textContent=e.message;}});
    end.append(graveText,bequestText,heirNotice,exportButton,heirButton,resetButton); document.body.append(end);
    const moment = (c, at) => {const t = new Game_Time(c.calendarAtEnrollment); t.goUp(at - c.enrolledAt); return t.toString();};

    function render(force = false) {
        if(!panel.isConnected) document.getElementById("location_actions_div").append(panel);
        const {state, context, enabled, error, occupied, dutyJob, canWrite, pauseReason} = read(), c = state.chronicle;
        const sig = JSON.stringify([c, context.location, context.stamina, context.ratStep, enabled, occupied, dutyJob, error, pauseReason, notice]);
        if(!force && sig === signature) return; signature = sig;
        status.textContent = error || pauseReason || notice || "Only played game time advances your age.";
        if(!c) {
            life.textContent = "Enrollment starts a new adult age record now; old saves are not retroactively aged. Mortal mode ends the life at 80 game years and pauses play. Choose once; ordinary combat defeat still means fainting.";
            relation.textContent = enabled ? "You have met the elder. Invitations and age tracking begin when you enroll." : "Meet the Village elder, finish current work and return to Village to enroll."; encounter.textContent = "";
        } else {
            const remaining = Math.max(0, lifespanDeadline(c) - state.clock);
            life.textContent = `Age ${ageYears(c).toFixed(3)} · ${format_time({time:{minutes:state.clock-c.enrolledAt}}) || "0m"} elapsed · ` +
                (c.life.mode === "open" ? "No old-age ending in this life" : `Mortal lifespan ${c.life.lifespan} years · ${(remaining / (360 * 24 * 60)).toFixed(3)} years remaining`);
            relation.textContent = knownPeopleView(state, {"village.elderMet":true}).find(p => p.id === "villageElder").details.join(" ");
            const s = c.session;
            encounter.textContent = s ? `${s.intent === "spar" ? "Agreed challenge" : "Hostile attack; elder attempts restraint"} · turn ${s.turn + 1}/16 · stamina ${context.stamina.toFixed(1)} · your control pressure ${s.heroPosture.toFixed(1)}/${c.elder.profile.control} · elder pressure ${s.elderPosture.toFixed(1)}/${c.elder.profile.posture} · ` +
                (s.phase === "recovery" ? "Recovery opening: a separate counterattack or withdrawal." : s.cue === "tracking" ? "His hand tracks the committed approach. Movement may be followed; guard is available." : "A broad sweep leaves a movement opening; reaction and stamina still matter.") +
                (s.policy === "manual" ? " Time waits for your response; each exchange spends one game minute." : ` Prepared policy: ${s.policy}.`) : "";
        }
        for(const [id,b] of buttons) {b.hidden = true; b.disabled = !!error || !canWrite;}
        const show = (id, disabled = false) => {const b = buttons.get(id); b.hidden = false; b.disabled ||= disabled;};
        const h = c?.life.experience?.inheritance, from = c?.life.experience?.inheritedFrom;
        const n = (k, word) => `${k} ${word}${k === 1 ? "" : "s"}`;
        inheritance.textContent = h ? `Generation ${c.life.experience.generation}. ${h.recipient === "apprentice" ? "Apprentice" : "Next of kin"} of ${from.name}. Received ${n(h.money, "coin")}, ${n(h.belongings, "belonging")}, ${n(h.chest, "stored good")}${h.home ? ", the Shack" : ""}; ${n(h.papers.length, "written paper")}; ${n(h.obligations.length, "open obligation")}.`
            : from ? `Generation ${c.life.experience.generation}. Heir of ${from.name}, begun under the earlier one-lesson rule.` : "";
        if(!c) {show("begin-open", !enabled); show("begin-mortal", !enabled);}
        else if(c.life.endedAt === null) {
            const r = c.relationships.villageElder, s = c.session, available = enabled && !occupied;
            if(s) {
                for(const id of ["guard", "step", "rat-step", "strike", "withdraw", "manual", "auto-guard", "auto-footwork"]) show(id);
                for(const id of ["guard", "step", "rat-step"]) buttons.get(id).disabled ||= s.phase !== "cue";
                buttons.get("rat-step").disabled ||= !s.ratStep;
                for(const id of ["guard","step","rat-step","strike"]) {
                    const cost = responseCost(c,id);
                    buttons.get(id).textContent = `${({guard:"Guard",step:"Ordinary sidestep","rat-step":"Earned Rat-step",strike:"Strike / counter"})[id]} · ${cost.toFixed(1)} stamina`;
                    buttons.get(id).disabled ||= context.stamina < cost;
                }
            } else {
                const living=lifeExperienceView(c);
                for(const id of c.life.experience?.inheritance?.papers || []) if(!c.knowledge[id]) show(`study.${id}`, !available);
                for(const lesson of living.lessons) {
                    if(!c.life.experience?.reflected.includes(lesson.id)) show(`reflect.${lesson.id}`, !available);
                    if(living.teaching && !c.life.experience?.taught.includes(lesson.id)) show(`teach.${lesson.id}`, !available);
                }
                if(!c.knowledge.elderClue) show("inspect", !available);
                show("spar", !available || !!r.ties.grievance); show("attack", !available);
                if(Object.values(c.events).some(e => e.status === "missed" && !e.heard && state.clock >= e.closesAt + 8)) show("hear", !available);
                if(c.events.cartographer.status === "open") show("attend", !available);
                if(!r.ties.archiveDuty) show("pledge", !available || !!r.ties.grievance);
                if(r.ties.archiveDuty && !r.ties.dutyKept) show("duty", !available);
                if(dutyJob) show("cancel-duty");
                if(c.events.inheritance.status === "open") show("inherit", !available || !r.ties.dutyKept || !!r.ties.grievance);
                if(c.events.debrief?.status === "open") show("debrief", !available || !!r.ties.grievance);
                if(c.events.lesson?.status === "open") show("lesson", !available || (r.axes.trust || 0) < 1 || !!r.ties.grievance);
                if(r.ties.grievance) show("settle", !available || context.money < 3);
            }
        }
        events.replaceChildren(...(c ? Object.values(c.events).map(e => node("p", `${e.label} · ${e.place} · ${e.status === "missed" && !e.heard ? "window closed; aftermath not yet heard" : e.status} · ` +
            (e.status === "scheduled" ? `opens ${moment(c,e.opensAt)}; closes ${moment(c,e.closesAt)}` : e.status === "open" ? `closes ${moment(c,e.closesAt)} (${e.closesAt - state.clock} game minutes)` : e.status === "resolved" ? `resolved ${moment(c,e.settledAt)}` : `window ended ${moment(c,e.closesAt)}`))) : []));
        history.replaceChildren(...(c ? c.log.slice(-8).reverse().map(m => node("li", m.text)) : []));
        const ended = !!c && c.life.endedAt !== null;
        end.hidden = !ended; document.getElementById("main_content").inert = ended;
        heirButton.hidden=!beginHeir;
        legacyHelp.textContent=beginHeir ? 'An heir begins with their own body, skills and starting things. They also receive what this life actually left behind:' : 'What this life left behind waits for someone to claim it. Export these memories to keep the whole life.';
        if(ended){const grave=lifeGrave(c,context.heroName);graveText.textContent=`A quiet grave. ${grave.epitaph}`;
            let lines;try{lines=heirPreview?heirPreview():[];}catch(e){lines=[e.message];}
            bequestText.replaceChildren(...lines.map(t=>node('li',t)));}
        if(ended) endHeading.textContent = `${context.heroName || "Your character"}’s life ended at ${lifeExperienceView(c).age}`;
        if(ended && !focusEnded) {focusEnded = true; exportButton.focus();}
    }
    render(); return {panel, render};
}
