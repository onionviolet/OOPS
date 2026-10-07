// Original frontier content. Saved history is authoritative; views never roll events.
export const GAME_YEAR = 360 * 24 * 60;
const clone = value => structuredClone(value);
const object = value => value && typeof value === "object" && !Array.isArray(value);
const key = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) && !["__proto__", "constructor", "prototype"].includes(value);
const integer = value => Number.isSafeInteger(value) && value >= 0;
const check = (value, message) => {if(!value) throw new Error(message);};
const finite = value => Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
const statuses = ["scheduled", "open", "resolved", "missed"];

export function validateChronicle(c, clock) {
    if(c === null) return;
    check(object(c) && c.schema === 1 && integer(c.enrolledAt) && c.enrolledAt <= clock && integer(c.lastClock) && c.lastClock === clock, "Invalid chronicle clock.");
    check(object(c.calendarAtEnrollment) && ["year", "month", "day", "hour", "minute", "day_count"].every(k => integer(c.calendarAtEnrollment[k])), "Invalid chronicle calendar anchor.");
    check(object(c.life) && finite(c.life.initialAge) && c.life.initialAge >= 0 && ["open", "mortal"].includes(c.life.mode) &&
        finite(c.life.lifespan) && c.life.lifespan > c.life.initialAge && (c.life.endedAt === null || integer(c.life.endedAt) && c.life.endedAt <= clock), "Invalid lifespan policy.");
    check(c.life.endedAt === null || c.life.mode === "mortal" && c.life.endedAt === lifespanDeadline(c), "Invalid old-age ending.");
    check(c.life.mode !== "mortal" || Number.isSafeInteger(lifespanDeadline(c)), "Unsupported mortal time range.");
    check(object(c.knowledge) && Object.entries(c.knowledge).every(([k,v]) => key(k) && typeof v === "boolean"), "Invalid chronicle knowledge.");
    check(object(c.relationships) && Object.keys(c.relationships).length <= 64, "Invalid relationship owners.");
    for(const [id, r] of Object.entries(c.relationships)) {
        check(key(id) && object(r) && object(r.axes) && object(r.ties) && Array.isArray(r.memories) && r.memories.length <= 32, "Invalid relationship.");
        check(Object.entries(r.axes).every(([k,v]) => key(k) && finite(v) && Math.abs(v) <= 100), "Invalid relationship dimension.");
        check(Object.entries(r.ties).every(([k,v]) => key(k) && ["boolean", "string", "number"].includes(typeof v) && (typeof v !== "number" || finite(v))), "Invalid relationship tie.");
        check(r.memories.every(m => object(m) && key(m.id) && integer(m.at) && m.at <= clock && typeof m.text === "string"), "Invalid relationship memory.");
    }
    check(object(c.elder) && c.elder.nativeRegistryId === "villageElder" && typeof c.elder.revealed === "boolean" && integer(c.elder.encounters) &&
        object(c.elder.profile) && ["strength", "agility", "control", "posture"].every(k => finite(c.elder.profile[k]) && c.elder.profile[k] > 0), "Invalid elder profile.");
    check(object(c.events) && Object.keys(c.events).length <= 16, "Invalid chronicle events.");
    for(const [id, e] of Object.entries(c.events)) {
        check(key(id) && object(e) && key(e.id) && statuses.includes(e.status) && integer(e.opensAt) && integer(e.closesAt) && e.closesAt > e.opensAt &&
            typeof e.label === "string" && typeof e.place === "string" && typeof e.missedText === "string" && typeof e.heard === "boolean", "Invalid event instance.");
        check(e.status === "scheduled" ? clock < e.opensAt : e.status === "open" ? clock >= e.opensAt && clock < e.closesAt : integer(e.settledAt) && e.settledAt <= clock, "Inconsistent event deadline.");
    }
    if(c.session !== null) {
        const s = c.session;
        check(object(s) && key(s.id) && ["spar", "assault"].includes(s.intent) && ["cue", "recovery"].includes(s.phase) && ["tracking", "sweep"].includes(s.cue) &&
            integer(s.turn) && s.turn < 16 && ["manual", "guard", "footwork"].includes(s.policy) && finite(s.heroPosture) && s.heroPosture >= 0 && finite(s.elderPosture) && s.elderPosture >= 0 &&
            typeof s.ratStep === "boolean" && typeof s.witness === "boolean" && object(s.hero) &&
            ["strength", "agility", "defense", "attackPower", "maxStamina", "staminaMultiplier", "strikeMultiplier"].every(k => finite(s.hero[k]) && s.hero[k] >= 0), "Invalid saved elder encounter.");
        check(s.hero.staminaMultiplier > 0 && s.hero.strikeMultiplier > 0, "Invalid encounter resource costs.");
        check(s.hero.blockStrength == null || finite(s.hero.blockStrength) && s.hero.blockStrength >= 0, "Invalid supported shield input.");
        check(c.life.endedAt === null, "An ended life cannot keep an active encounter.");
    }
    check(Array.isArray(c.log) && c.log.length <= 40 && c.log.every(m => object(m) && integer(m.at) && m.at <= clock && typeof m.text === "string"), "Invalid chronicle log.");
}

export function relationshipChange(c, actorId, {axes = {}, ties = {}, text, id}, at) {
    check(key(actorId) && key(id), "Invalid relationship cause.");
    const r = c.relationships[actorId] ||= {axes: {}, ties: {}, memories: []};
    check(Object.entries(axes).every(([k,v]) => key(k) && finite(v)), "Invalid relationship change.");
    check(Object.entries(ties).every(([k,v]) => key(k) && ["boolean", "string", "number"].includes(typeof v)), "Invalid relationship tie change.");
    for(const [k,v] of Object.entries(axes)) r.axes[k] = Math.max(-100, Math.min(100, (r.axes[k] || 0) + v));
    Object.assign(r.ties, ties);
    r.memories.push({id, at, text}); r.memories = r.memories.slice(-32);
}

function note(c, text, at) {c.log.push({at, text}); c.log = c.log.slice(-40);}
function event(c, id, label, place, opensAt, lifetime, missedText) {
    if(c.events[id]) return;
    c.events[id] = {id, label, place, opensAt, closesAt: opensAt + lifetime, status: c.lastClock >= opensAt ? "open" : "scheduled", heard: false, missedText};
}

export function createChronicle(clock, calendar, mortal = false) {
    const c = {schema: 1, enrolledAt: clock, lastClock: clock, calendarAtEnrollment: clone(calendar),
        life: {initialAge: 18, lifespan: 80, mode: mortal ? "mortal" : "open", endedAt: null},
        knowledge: {}, relationships: {}, elder: {nativeRegistryId: "villageElder", revealed: false, encounters: 0,
            profile: {strength: 18, agility: 24, control: 30, posture: 80}}, session: null, events: {}, log: []};
    relationshipChange(c, "villageElder", {id: "chronicle.enrollment", axes: {trust: 0, respect: 0}, ties: {role: "acquaintance"}, text: "Met as a traveler, with no inherited favors assumed."}, clock);
    event(c, "cartographer", "Visiting cartographer's briefing", "Village", clock + 10, 30,
        "You hear that a cartographer gave a route-reading briefing in Village earlier. The visiting group has already departed.");
    event(c, "inheritance", "The elder's archive succession", "Village", clock + 60, 120,
        "You hear that the elder entrusted his old watchpost archive to another traveler in Village. The succession meeting has ended.");
    note(c, "A new chronicle begins. Local invitations have game-time deadlines; rumors can reach you later.", clock);
    return c;
}

export function ageYears(c, clock = c.lastClock) {return c.life.initialAge + (clock - c.enrolledAt) / GAME_YEAR;}
export function validateChronicleCalendar(c, clock, calendar) {
    if(!c) return;
    const minute = t => {
        check(["year", "month", "day", "hour", "minute"].every(k => integer(t[k])) && t.month >= 1 && t.month <= 12 && t.day >= 1 && t.day <= 30 && t.hour < 24 && t.minute < 60, "Invalid enrolled game calendar.");
        const total = (((t.year * 12 + t.month - 1) * 30 + t.day - 1) * 24 + t.hour) * 60 + t.minute;
        check(Number.isSafeInteger(total), "Unsupported enrolled calendar range."); return total;
    };
    check(minute(calendar) - minute(c.calendarAtEnrollment) === clock - c.enrolledAt, "Chronicle and game calendar disagree.");
}
export function lifespanDeadline(c) {return c.life.mode === "mortal" ? c.enrolledAt + Math.ceil((c.life.lifespan - c.life.initialAge) * GAME_YEAR) : Infinity;}
export function nextChronicleBoundary(c) {
    if(!c || c.life.endedAt !== null) return Infinity;
    return Math.min(lifespanDeadline(c), ...Object.values(c.events).filter(e => e.status === "open" || e.status === "scheduled")
        .map(e => e.status === "scheduled" ? e.opensAt : e.closesAt));
}

export function advanceChronicle(c, clock) {
    if(!c) return null;
    const next = clone(c); next.lastClock = clock;
    for(const e of Object.values(next.events)) {
        if(e.status === "scheduled" && clock >= e.opensAt) e.status = "open";
        if(e.status === "open" && clock >= e.closesAt) {e.status = "missed"; e.settledAt = e.closesAt;}
    }
    if(next.life.endedAt === null && clock >= lifespanDeadline(next)) {
        next.life.endedAt = lifespanDeadline(next); next.session = null;
        note(next, "This mortal life ended from old age. Its knowledge, relationships and unresolved history remain in the saved chronicle.", next.life.endedAt);
    }
    return next;
}

export function chronicleFacts(c) {
    return {"chronicle.enrolled": !!c, "chronicle.pledged": !!c?.relationships.villageElder?.ties.archiveDuty,
        "chronicle.dutyDone": !!c?.relationships.villageElder?.ties.dutyKept,
        "chronicle.routeSignals": !!c?.knowledge.routeSignals, "chronicle.alive": !c || c.life.endedAt === null};
}

export function recordArchiveDuty(c, clock, receiptId) {
    check(c && c.life.endedAt === null && c.relationships.villageElder?.ties.archiveDuty && !c.relationships.villageElder.ties.dutyKept, "No unfulfilled archive duty.");
    relationshipChange(c, "villageElder", {id: receiptId, axes: {trust: 1}, ties: {dutyKept: true}, text: "Kept the promise to organize the archive records."}, clock);
    note(c, "Your work earns a concrete succession claim. The elder values this kept promise independently of combat prowess.", clock);
}

export function automaticResponse(c) {
    const s = c?.session;
    if(!s || s.policy === "manual") return null;
    if(s.phase === "recovery") return "strike";
    return s.policy === "footwork" && s.cue === "sweep" ? s.ratStep ? "rat-step" : "step" : "guard";
}

export function responseCost(c, action) {
    const costs = {guard: c.knowledge.guardLesson ? 3 : 4, step: 5, "rat-step": 3, strike: 6};
    check(c.session && Object.hasOwn(costs, action), "Unknown encounter response.");
    return costs[action] * c.session.hero.staminaMultiplier * (action === "strike" ? c.session.hero.strikeMultiplier : 1);
}

// A bounded original control encounter, using native hero inputs. No HP/death/loot callbacks.
export function commandChronicle(state, command, context, expectedSequence = state.sequence) {
    check(expectedSequence === state.sequence, "This chronicle command is stale.");
    check(context.location === "Village" || ["respond", "withdraw", "policy"].includes(command.type), "Return to Village for this interaction.");
    const next = clone(state), c = next.chronicle, at = next.clock, effects = [];
    let moneyDelta = 0, staminaSpent = 0, minutes = 0;
    if(command.type === "enroll") {
        check(!c && ["open", "mortal"].includes(command.mode), "Choose a chronicle once.");
        next.chronicle = createChronicle(at, context.calendar, command.mode === "mortal");
    } else {
        check(c && c.life.endedAt === null, "This chronicle is absent or its life has ended.");
        if(c.session) check(["respond", "withdraw", "policy"].includes(command.type), "Finish or withdraw from the elder encounter first.");
        const r = c.relationships.villageElder;
        const resolve = id => {const e = c.events[id]; check(e?.status === "open", "This opportunity is not currently open."); e.status = "resolved"; e.settledAt = at; return e;};
        if(command.type === "inspect") {
            check(!c.knowledge.elderClue, "This clue is already recorded.");
            c.knowledge.elderClue = true; note(c, "The elder carries his weight with unusual balance. His actual strength remains unknown.", at);
        } else if(command.type === "hear") {
            const missed = Object.values(c.events).filter(e => e.status === "missed" && !e.heard && at >= e.closesAt + 8);
            check(missed.length, "No new report has reached Village yet.");
            for(const e of missed) {e.heard = true; c.knowledge[`heard.${e.id}`] = true; note(c, e.missedText, at);}
        } else if(command.type === "attend") {
            resolve("cartographer"); c.knowledge.routeSignals = true;
            note(c, "The cartographer explains route signals. This retained understanding supplies one route-preparation contribution to your ordinary surveys.", at);
        } else if(command.type === "pledge") {
            check(!r.ties.archiveDuty && !r.ties.grievance, "This promise is already made or an assault remains unsettled.");
            relationshipChange(c, "villageElder", {id: `pledge:${next.sequence + 1}`, ties: {archiveDuty: true}, text: "Promised to organize archive records before the succession meeting."}, at);
            note(c, "Archive duty accepted. Complete the five-minute task through the normal action controls; succession closes at its announced deadline.", at);
        } else if(command.type === "inherit") {
            check(r.ties.dutyKept && !r.ties.grievance, "Keep the archive promise and settle any personal assault grievance first.");
            resolve("inheritance"); r.ties.successor = true;
            effects.push({type: "item", key: context.manualKey, amount: 1});
            note(c, "The elder names you the archive's successor and entrusts his Old combat manual to you.", at);
        } else if(command.type === "debrief") {
            check(!r.ties.grievance, "The elder will not debrief an unresolved assault."); resolve("debrief");
            c.knowledge.controlPattern = true;
            event(c, "lesson", "A private guard lesson", "Village", at + 5, 40, "You hear that the elder held his private guard lesson in Village earlier. You can still retain what you observed during the encounter.");
            note(c, "His wrist control punishes a committed approach. Tracking calls for a guard; a broad sweep leaves a movement opening. A lesson invitation follows in five minutes.", at);
        } else if(command.type === "lesson") {
            check((r.axes.trust || 0) >= 1 && !r.ties.grievance && c.knowledge.controlPattern, "This lesson requires established trust, relevant evidence and no unresolved assault.");
            resolve("lesson"); c.knowledge.guardLesson = true;
            note(c, "The practice makes your guards more economical. Future guards in these control challenges cost one less stamina before your usual efficiency modifiers.", at);
        } else if(command.type === "settle") {
            check(r.ties.grievance && context.money >= 3, "Settlement requires an unresolved grievance and three coins."); moneyDelta = -3;
            relationshipChange(c, "villageElder", {id: `settlement:${next.sequence + 1}`, axes: {trust: 1}, ties: {grievance: false}, text: "Made the declared three-coin restitution. The case closes; the attack remains remembered."}, at);
            note(c, "The elder accepts this settlement. His optional challenges reopen; restitution does not erase the deed or grant a lesson.", at);
        } else if(command.type === "start") {
            check(["spar", "assault"].includes(command.intent) && !c.session, "Choose an agreed challenge or hostile attack.");
            check(command.intent === "assault" || !r.ties.grievance, "Settle the previous assault before asking for another agreed challenge.");
            check(context.hero && context.stamina >= 3, "Rest before starting a control encounter.");
            next.rng ^= next.rng << 13; next.rng ^= next.rng >>> 17; next.rng ^= next.rng << 5; next.rng >>>= 0; next.rng ||= 1;
            c.session = {id: `elder:${next.sequence + 1}`, intent: command.intent, phase: "cue", cue: next.rng % 2 ? "tracking" : "sweep",
                turn: 0, policy: "manual", heroPosture: 0, elderPosture: 0, hero: clone(context.hero), ratStep: !!context.ratStep, witness: !!context.witness};
            note(c, command.intent === "spar" ? "An agreed control challenge begins. Force a concession or withdraw; no lethal stakes." : "You initiate a hostile attack. The elder attempts nonlethal restraint; public witnesses can report this assault.", at);
        } else if(command.type === "policy") {
            check(c.session && ["manual", "guard", "footwork"].includes(command.policy), "Unknown prepared encounter policy."); c.session.policy = command.policy;
        } else if(command.type === "withdraw") {
            check(c.session, "No encounter to withdraw from."); finishEncounter(c, "withdrawn", at, effects);
        } else if(command.type === "respond") {
            const s = c.session; check(s && ["guard", "step", "rat-step", "strike"].includes(command.action), "Unknown encounter response.");
            check(context.hero.maxStamina === s.hero.maxStamina, "Your loadout changed. Withdraw before preparing another attempt.");
            check(command.action !== "rat-step" || s.ratStep, "Rat-step needs its existing ownership, proficiency and Agility requirements.");
            staminaSpent = responseCost(c, command.action);
            check(context.stamina >= staminaSpent, "Not enough stamina. Withdraw or choose an affordable response."); minutes = 1;
            if(s.phase === "recovery") {
                check(command.action === "strike", "The opening calls for a separately paid counterattack, or withdrawal.");
                s.elderPosture += Math.max(1, s.hero.attackPower / 4 + s.hero.strength - c.elder.profile.strength / 3);
                s.phase = "cue"; s.cue = s.cue === "tracking" ? "sweep" : "tracking";
                note(c, "Your counter tests the elder's posture; the next approach has a different cue.", at);
            } else if(command.action === "guard") {
                s.heroPosture += Math.max(2, 8 - s.hero.defense / 4 - (s.hero.blockStrength || 0) / 20); s.phase = "recovery";
                note(c, "You guard the intercept and expose a recovery opening. Guarding costs stamina and control pressure.", at);
            } else if(command.action === "step" || command.action === "rat-step") {
                const needed = s.cue === "sweep" ? 8 : c.elder.profile.agility;
                if(s.hero.agility >= needed) {s.phase = "recovery"; note(c, command.action === "rat-step" ? "Earned Rat-step makes this ordinary movement more economical. A counterattack still needs its own action." : "You move clear and expose the recovery opening.", at);}
                else {s.heroPosture += 15; note(c, "His tracking hand follows your movement. Your posture suffers; guarding remains a supported alternative.", at);}
            } else if(s.hero.strength + s.hero.agility > c.elder.profile.agility * 2) {
                s.elderPosture += s.hero.attackPower / 4 + s.hero.strength; s.phase = "recovery";
                note(c, "Your developed approach overwhelms the intercept. The elder has to give ground.", at);
            } else {
                s.heroPosture += 20; note(c, c.elder.revealed ? "He repeats the interception. The same committed approach costs you more control pressure." : "He catches your committed wrist without spilling his tea. ‘We usually start with hello.’", at);
            }
            c.elder.revealed = true; c.knowledge.elderControlObserved = true; s.turn++;
            if(command.action === "rat-step") next.actors.player.techniques[context.ratStepId].executions++;
            if(s.elderPosture >= c.elder.profile.posture) finishEncounter(c, "concession", at, effects);
            else if(s.heroPosture >= c.elder.profile.control) finishEncounter(c, "restrained", at, effects);
            else if(s.turn >= 16) finishEncounter(c, "draw", at, effects);
        } else throw new Error("Unknown chronicle command.");
    }
    next.sequence++;
    return {state: next, effects, moneyDelta, staminaSpent, minutes};
}

function finishEncounter(c, outcome, at, effects) {
    const s = c.session; c.elder.encounters++;
    const r = c.relationships.villageElder, firstCourtesy = s.turn > 0 && !r.ties.respectfulChallenge, firstWin = outcome === "concession" && !r.ties.firstConcession;
    relationshipChange(c, "villageElder", {id: s.id, axes: s.intent === "spar" ? {trust: firstCourtesy ? 1 : 0, respect: firstWin ? 2 : firstCourtesy ? 1 : 0} : {trust: -3, fear: outcome === "concession" ? 1 : 0},
        ties: s.intent === "assault" ? {grievance: true} : {...(firstCourtesy ? {respectfulChallenge: true} : {}), ...(firstWin ? {firstConcession: true} : {})}, text: `${s.intent === "spar" ? "Agreed challenge" : "Unprovoked attack"}: ${outcome}.`}, at);
    if(s.intent === "assault" && s.witness) effects.push({type: "reputation", region: "Village", amount: -2});
    if(s.intent === "spar" && !c.events.debrief && c.elder.revealed) event(c, "debrief", "The elder's encounter debrief", "Village", at, 90, "You hear that the elder discussed his control method with the village guard earlier. Your own observation remains recorded.");
    note(c, `Encounter ended: ${outcome}. ${s.intent === "assault" ? "The elder remembers the assault; optional settlement is available." : "The elder remembers the agreed challenge."}`, at);
    c.session = null;
}

export const archiveDutyAction = {id: "chronicle.archive_duty", worldId: "base.frontier", revision: 1, group: "chronicle", label: "Keep your archive-duty promise",
    description: "Organize the elder's records for five game minutes. Costs one coin and fulfills a concrete succession obligation; no universal favorability or combat requirement.",
    duration: 5, repeatable: false, completionScope: "actor", cancellation: "refund", costs: [{scope: "external", key: "money", amount: 1, label: "coin"}],
    requires: {all: [{fact: "location", op: "eq", value: "Village"}, {fact: "chronicle.pledged", op: "eq", value: true}, {fact: "chronicle.dutyDone", op: "eq", value: false}, {fact: "chronicle.alive", op: "eq", value: true}]},
    outcomes: [{id: "kept", label: "Archive promise fulfilled", chance: 1, effects: [{type: "chronicle", operation: "archive-duty"}]}]};
