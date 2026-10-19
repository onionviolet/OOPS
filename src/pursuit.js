// Evidence directs travel. Actual target position is used only for a local
// contact check, never to pick the next destination. All writes belong to the
// caller's staged simulation plan and the existing common-clock executor.
import {check as assert, natural} from './basics.js';
const id = v => typeof v === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !["__proto__","constructor","prototype"].includes(v);
const active = new Set(["investigating","moving","searching","waiting","sheltered"]);
const terminal = new Set(["lost","settled","tested","declined","withdrawn"]);
export const pursuitReservesActor = (state, actorId, except = null) => Object.entries(state.simulation?.pursuits || {}).some(([key,p]) => key !== except && active.has(p.status) && p.actorId === actorId);

export function validatePursuitDefinition(d) {
    assert(id(d.id) && natural(d.revision) && d.revision > 0 && typeof d.label === "string" && id(d.actorId) && d.targetId === "player" && d.actorId !== d.targetId && id(d.encounterCommand), "Invalid pursuit identity.");
    for(const key of ["investigationMinutes","movementSupply","searchMinutes","searchSupply","investigationSupply","leadLifetime","pollMinutes"])
        assert(natural(d[key]) && d[key] > 0, "Invalid pursuit timing or supply cost.");
    assert(natural(d.requestLifetime), "Invalid interception lifetime.");
    if(d.detection) {
        assert(["signature","authority"].includes(d.detection.mode) && id(d.detection.facultyId) && natural(d.detection.cost), "Invalid declared locator.");
        if(d.detection.mode === "signature")assert(id(d.detection.markId) && d.requestLifetime > 0, "A signature locator requires a specific mark.");
    } else assert(d.requestLifetime > 0, "Ordinary requests need a response window.");
    assert(id(d.supply) && Array.isArray(d.routes) && d.routes.length > 0 && Array.isArray(d.sanctuaries), "Invalid pursuit route policy.");
    assert(d.noticeKey == null || id(d.noticeKey), "Invalid pursuit knowledge key.");
    const seen = new Set();
    for(const r of d.routes) {
        assert(typeof r.from === "string" && typeof r.to === "string" && r.from && r.to && r.from !== r.to && natural(r.minutes) && r.minutes > 0 && !seen.has(`${r.from}:${r.to}`), "Invalid pursuit route.");
        seen.add(`${r.from}:${r.to}`);
    }
    assert(d.sanctuaries.every(v => typeof v === "string" && d.routes.some(r => r.from === v || r.to === v)), "Invalid pursuit sanctuary.");
}
export function validatePursuitEffect(e) {
    assert(id(e.pursuitId) && ["begin","conceal","close","report"].includes(e.operation), "Invalid pursuit effect.");
    if(e.operation === "close") assert(terminal.has(e.result), "Invalid pursuit closure.");
}
export function validatePursuits(records, state, registry, person, busy) {
    assert(records && typeof records === "object" && !Array.isArray(records), "Invalid pursuits.");
    for(const [key,p] of Object.entries(records)) {
        validatePursuitDefinition(p.policy); person(p.actorId); person(p.targetId);
        assert(key === p.policy.id && id(p.id) && p.actorId === p.policy.actorId && p.targetId === p.policy.targetId && natural(p.startedAt) && p.startedAt <= state.clock, "Invalid saved pursuit binding.");
        if(registry) assert(registry.pursuits.has(key), "Unsupported saved pursuit.");
        assert(active.has(p.status) || terminal.has(p.status) || p.status === "encounter", "Invalid pursuit status.");
        assert(natural(p.spent) && natural(p.searches), "Invalid pursuit accounting.");
        const lead = p.lead;
        assert(lead && typeof lead.location === "string" && typeof lead.source === "string" && lead.source && natural(lead.observedAt) && lead.observedAt <= state.clock && natural(lead.expiresAt) && lead.expiresAt === lead.observedAt + p.policy.leadLifetime, "Invalid pursuit evidence.");
        assert(p.policy.detection?.mode === "authority" || p.policy.routes.some(r => r.from === lead.location || r.to === lead.location), "Unknown pursuit lead location.");
        if(active.has(p.status)) {
            assert(natural(p.due) && p.due >= state.clock && !busy.has(p.actorId) && !state.pending.some(j => j.context.actorId === p.actorId) && !Object.values(state.actors[p.actorId].techniques).some(t => t.practice), "Overlapping pursuit participant or invalid boundary.");
            assert(state.simulation.people[p.actorId].life === "alive", "Unavailable pursuer."); busy.add(p.actorId);
        } else assert(p.due === null, "Closed pursuit still advances.");
        if(p.status === "moving") assert(p.policy.routes.some(r => r.from === state.simulation.people[p.actorId].location && r.to === p.destination), "Invalid committed pursuit movement.");
        if(p.request) assert(id(p.request.id) && typeof p.request.location === "string" && natural(p.request.at) && p.request.at <= state.clock && (p.policy.requestLifetime ? p.request.expiresAt === p.request.at + p.policy.requestLifetime : p.request.expiresAt === null), "Invalid interception request.");
        if(p.status === "waiting") assert(p.request, "Missing interception request.");
        if(p.status === "encounter") assert(state.simulation.sessions.player?.pursuitId === key && state.simulation.sessions.player.participants.includes(p.actorId), "Orphan pursuit encounter.");
        if(p.concealedAt != null) assert(natural(p.concealedAt) && p.concealedAt <= state.clock, "Invalid trail concealment.");
        if(p.closedAt != null)assert(terminal.has(p.status) && natural(p.closedAt) && p.closedAt <= state.clock, "Invalid pursuit closure time.");
        if(p.closedBy != null)assert(p.closedBy === p.targetId && terminal.has(p.status), "Invalid pursuit closing actor.");
        if(p.reportedResult != null)assert(terminal.has(p.reportedResult) && terminal.has(p.status), "Invalid disclosed pursuit result.");
    }
}

function close(state, p, result) {p.status=result; p.due=null; p.closedAt=state.clock;}
function charge(out, p, amount, spend) {
    if(amount === 0)return true;
    if((out.state.actors[p.actorId].resources[p.policy.supply] || 0) < amount) {close(out.state,p,"lost"); return false;}
    spend([{type:"resource",key:p.policy.supply,amount:-amount}],{actorId:p.actorId},p.id); p.spent+=amount; return true;
}
export function applyPursuitEffect(out, e, context, registry, cause, spend) {
    const state=out.state, s=state.simulation, definition=registry.simulation.pursuits.get(e.pursuitId);
    assert(definition && context.actorId === definition.targetId, "Only the target can accept or close this pursuit.");
    if(e.operation === "begin") {
        s.schema=Math.max(s.schema,2);
        assert(!s.pursuits?.[e.pursuitId] && s.people[definition.actorId]?.life === "alive", "This pursuit has already begun or its participant is unavailable.");
        const location=context.facts?.location || s.people[context.actorId].location;
        assert(location && (definition.detection?.mode === "authority" || s.people[definition.actorId].location === location) && state.actors[definition.actorId].worldId === state.actors[definition.targetId].worldId, "A pursuit needs a witnessed local lead or a declared authority.");
        const p={id:cause,policy:structuredClone(definition),actorId:definition.actorId,targetId:definition.targetId,startedAt:state.clock,status:"investigating",due:state.clock+definition.investigationMinutes,spent:0,searches:0,
            lead:{location,source:definition.detection ? "Declared locator at enrollment" : "Agreed field test: witnessed in person",observedAt:state.clock,expiresAt:state.clock+definition.leadLifetime}};
        if(definition.detection)assert(locatorActive(state,p), "The declared locator lacks its actual faculty or mark.");
        assert(charge(out,p,definition.investigationSupply,spend), "The pursuer cannot fund the investigation.");
        (s.pursuits ||= {})[e.pursuitId]=p;
    } else {
        const p=s.pursuits?.[e.pursuitId]; assert(p, "No known pursuit.");
        if(e.operation === "report") {
            assert((context.facts?.location || s.people.player.location) === "Village", "Ask for local reports in Village.");
            if(terminal.has(p.status))p.reportedResult=p.status;
            const key=p.policy.noticeKey || "pursuit.notice",previous=s.knowledge.player?.[key];
            (s.knowledge.player ||= {})[key]={stage:previous?.stage || "seen",at:state.clock,cause,value:p.status === "lost" ? `${p.policy.label}: a later report confirms the trail went cold. There is no debt or missed reward.` : terminal.has(p.status) ? `${p.policy.label} has concluded. There is no debt or missed reward.` : `${p.policy.label} is still in progress. No newer local sighting is reported.`};
            return;
        }
        assert(!terminal.has(p.status), "No ongoing pursuit.");
        if(e.operation === "conceal") {assert(active.has(p.status) && p.policy.detection?.mode !== "authority", "This authority ignores ordinary concealment. Answer or settle the summons instead."); p.concealedAt=state.clock;}
        else {close(state,p,e.result);p.closedBy=context.actorId;}
    }
}

export function nextPursuitBoundary(state) {return Math.min(...Object.values(state.simulation?.pursuits || {}).filter(p=>active.has(p.status)).map(p=>p.due));}
function firstStep(policy, from, to) {
    const queue=[{location:from,first:null}],seen=new Set([from]);
    for(let i=0;i<queue.length;i++) for(const r of policy.routes.filter(r=>r.from === queue[i].location).sort((a,b)=>a.to.localeCompare(b.to))) {
        if(seen.has(r.to))continue;
        const first=queue[i].first || r; if(r.to === to)return first;
        seen.add(r.to);queue.push({location:r.to,first});
    }
    return null;
}
function scheduleSearch(out,p,spend) {
    if(!charge(out,p,p.policy.searchSupply,spend))return;
    p.status="searching";p.searches++;p.due=out.state.clock+p.policy.searchMinutes;
}
function followLead(out,p,spend) {
    const state=out.state,location=state.simulation.people[p.actorId].location;
    if(location === p.lead.location) {scheduleSearch(out,p,spend);return;}
    const route=firstStep(p.policy,location,p.lead.location);
    if(!route) {close(state,p,"lost");return;}
    if(!charge(out,p,p.policy.movementSupply,spend))return;
    p.status="moving";p.destination=route.to;p.due=state.clock+route.minutes;
}
export function pursuitContact(state,p,context) {
    const s=state.simulation;
    return s.people[p.actorId]?.life === "alive" && s.people[p.targetId]?.life === "alive" && state.actors[p.actorId].worldId === state.actors[p.targetId].worldId &&
        !!context.facts?.location && s.people[p.actorId].location === context.facts.location;
}
function facultyActive(state,actorId,sourceId) {
    const source=state.actors[actorId]?.sources[sourceId],f=state.simulation.faculties[actorId]?.[sourceId];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && !!f?.awakened && f.active && !f.suppressed;
}
function locatorActive(state,p) {
    const d=p.policy.detection;
    return facultyActive(state,p.actorId,d.facultyId) && (d.mode !== "signature" || facultyActive(state,p.targetId,d.markId));
}
function locate(out,p,context,spend) {
    const state=out.state,d=p.policy.detection,location=context.facts?.location;
    if(!d || !location || !locatorActive(state,p))return false;
    if(d.mode === "signature" && (p.concealedAt != null && p.concealedAt >= p.lead.observedAt || !p.policy.routes.some(r=>r.from === location || r.to === location)))return false;
    if(p.lead.location === location && p.lead.expiresAt > state.clock && (d.mode === "signature" || state.simulation.people[p.actorId].location === location))return true;
    if(!charge(out,p,d.cost,spend))return false;
    p.lead={location,source:d.mode === "authority" ? "Declared heavenly writ: target located in this realm" : "Sensed the agreed ink mark",observedAt:state.clock,expiresAt:state.clock+p.policy.leadLifetime};
    if(d.mode === "authority")state.simulation.people[p.actorId].location=location;
    return true;
}
export function advancePursuits(out,contexts,spend,notify) {
    const state=out.state,s=state.simulation;let work=0;
    for(const p of Object.values(s.pursuits || {}).sort((a,b)=>a.id.localeCompare(b.id))) {
        if(!active.has(p.status))continue;
        if(s.people[p.actorId].life !== "alive" || s.people[p.targetId].life !== "alive" || state.actors[p.actorId].worldId !== state.actors[p.targetId].worldId) {close(state,p,"lost");continue;}
        if(p.due > state.clock)continue;
        work++;
        // A paid leg already underway finishes at its frozen destination even
        // when a newer witnessed lead arrives. Replanning happens at arrival.
        if(p.status === "moving") {s.people[p.actorId].location=p.destination;delete p.destination;}
        const context=contexts[p.targetId] || {};
        if(p.policy.detection)locate(out,p,context,spend);
        if(!active.has(p.status))continue;
        if(p.lead.expiresAt <= state.clock || p.policy.detection?.mode !== "authority" && p.concealedAt != null && p.concealedAt >= p.lead.observedAt) {close(state,p,"lost");continue;}
        const contact=pursuitContact(state,p,context);
        if(p.status === "waiting") {
            if(p.request.expiresAt != null && p.request.expiresAt <= state.clock)close(state,p,"declined");
            else if(!contact) {delete p.request;followLead(out,p,spend);}
            else {p.request.location=context.facts.location;p.due=state.clock+p.policy.pollMinutes;}
        } else if(p.status === "sheltered") {
            if(!contact)followLead(out,p,spend);
            else p.due=state.clock+p.policy.pollMinutes;
        } else if(p.status === "searching") {
            if(contact && p.policy.sanctuaries.includes(context.facts.location)) {
                p.status="sheltered";p.due=state.clock+p.policy.pollMinutes;
                notify(p,p.policy.shelterText || "The apprentice stops outside the Shack. Your private shelter is off limits for this test.");
            } else if(contact) {
                p.status="waiting";p.request={id:`interception:${++state.sequence}`,at:state.clock,expiresAt:p.policy.requestLifetime ? state.clock+p.policy.requestLifetime : null,location:context.facts.location};p.due=state.clock+p.policy.pollMinutes;
                notify(p,p.policy.contactText || "Neri found your trail and asks for a nonlethal footwork test. Finish your current activity before responding.");
            } else if(s.people[p.actorId].location !== p.lead.location)followLead(out,p,spend);
            else close(state,p,"lost");
        } else followLead(out,p,spend);
    }
    return work;
}

// Native travel supplies only a directly witnessed route intention. Unsupported
// routes and departures made elsewhere disclose no destination to the pursuer.
export function recordPursuitDeparture(state,from,to) {
    const next=structuredClone(state);let changed=false;
    for(const p of Object.values(next.simulation?.pursuits || {})) {
        if(!active.has(p.status) || p.concealedAt != null && p.concealedAt >= p.lead.observedAt || next.simulation.people[p.actorId].location !== from ||
            next.actors[p.actorId].worldId !== next.actors.player.worldId || !p.policy.routes.some(r=>r.from === from && r.to === to))continue;
        p.lead={location:to,source:`Witnessed departure toward ${to}`,observedAt:next.clock,expiresAt:next.clock+p.policy.leadLifetime};changed=true;
    }
    if(changed)next.sequence++;
    return {state:next,changed};
}

// This projection uses only the player's observations, never private travel,
// remaining supplies, a failed search or the pursuer's current coordinates.
export function pursuitView(state,definitionId="village.trail_test") {
    const p=state.simulation?.pursuits?.[definitionId];
    if(!p)return null;
    const known=state.simulation.knowledge.player?.[p.policy.noticeKey || "pursuit.notice"];
    const terminalText={settled:`You settled ${p.policy.label} peacefully.`,tested:`You completed ${p.policy.label}.`,withdrawn:`You withdrew from ${p.policy.label}.`};
    if(p.reportedResult)terminalText[p.reportedResult]=known?.value;
    if(p.status === "declined" && p.closedBy === "player")terminalText.declined=`You called off ${p.policy.label}.`;
    return {id:p.id,definitionId,label:p.policy.label,commandId:p.policy.encounterCommand,requestId:p.request?.id,status:p.status === "encounter" ? "encounter" : terminalText[p.status] ? "closed" : p.status === "waiting" && p.request ? "contact" : "following",
        text:terminalText[p.status] || known?.value || `${p.policy.label} began from its declared lead.`,
        observedAt:known?.at ?? p.startedAt,requestLocation:p.request?.location,expiresAt:p.request?.expiresAt};
}
