import {lifeExperienceView,LIFE_LESSONS} from './life_experience.js';
import {lifeRecordView} from './life_record.js';
// Read-only news from existing owners. No rolls, rewards, enrollment or save fields.
import {pursuitView} from "./pursuit.js";
export function eventFeed(state, registry, facts = {}, lifeRecord = null) {
    const leads = [], news = [], actor = state.actors.player, worldId = actor.worldId;
    const destination = (panel, control) => ({view: "people", panel, control});
    const c = worldId === "base.frontier" ? state.chronicle : null;
    const commands = {cartographer: "attend", inheritance: "inherit", debrief: "debrief", lesson: "lesson"};
    for(const e of Object.values(c?.events || {})) {
        if(e.status === "scheduled" || e.status === "open") leads.push({
            id: `chronicle:${e.id}`, label: e.label, at: e.opensAt,
            detail: `${e.place} · ${e.status === "scheduled" ? `opens in ${e.opensAt-state.clock} game minutes` : `closes in ${e.closesAt-state.clock} game minutes`}`,
            action: "View invitation", available: e.status === "open", locations:["Village"], ...destination("chronicle_panel", commands[e.id])
        });
    }
    if(Object.values(c?.events || {}).some(e => e.status === "missed" && !e.heard && state.clock >= e.closesAt + 8)) leads.push({
        id: "chronicle:reports", label: "Local reports have reached Village", at: state.clock,
        detail: "Ask what happened while you were away.", action: "Hear local reports", available: true, locations:["Village"],
        ...destination("chronicle_panel", "hear")
    });
    for(const [i,m] of (c?.log || []).entries()) news.push({id:`chronicle:news:${i}:${m.at}`, at:m.at, text:m.text});

    for(const [id,o] of Object.entries(state.opportunities)) {
        if(o.context.actorId !== "player" || o.context.worldId !== worldId) continue;
        const label=registry.opportunities.get(o.definitionId)?.label;
        if(!label) continue;
        if(o.status === "scheduled" || o.status === "available") leads.push({
            id:`opportunity:${id}`, label, at:o.due, available:o.status === "available", locations:["Village"],
            detail:`Village · ${o.status === "scheduled" ? `opens in ${o.due-state.clock} game minutes` : `closes in ${o.expires-state.clock} game minutes`}`,
            action:"View departure", view:"here", panel:"expedition_panel", control:"frontier.depart"
        });
        else if(o.status === "expired") news.push({id:`opportunity:news:${id}`,at:o.expires,
            text:`${label} has passed. Your earlier survey rewards remain.`});
    }

    // Never project the global simulation log: it can contain unobserved NPC acts.
    for(const e of Object.values(state.simulation?.events || {})) {
        if(!e.discoveredBy.includes("player") || state.actors[e.actorId]?.worldId !== worldId) continue;
        if(e.status === "open" && e.actorId === "player") leads.push({
            id:`simulation:${e.id}`, label:e.label, at:e.at,
            detail:e.expiresAt == null ? "Waiting for your response." : `${Math.max(0,e.expiresAt-state.clock)} game minutes remaining`,
            action:"View responses", available:true, locations:e.storylet ? ["Village"] : registry.simulation.events.get(e.definitionId)?.group === "field" ? ["Village"] : ["Village","Shack"],
            ...(registry.simulation.events.get(e.definitionId)?.group === "field" ? {view:"here",panel:"field_panel",control:`event.${e.responses[0]?.id}`} : e.storylet ? destination("storylet_panel", e.definitionId) : destination("simulation_panel", `event.${e.responses[0]?.id}`))
        });
        else news.push({id:`simulation:news:${e.id}`, at:e.status === "expired" ? e.expiresAt : e.at,
            text:`${e.label}${e.status === "expired" ? " · the opportunity has passed." : e.mode === "ambient" ? "" : " · resolved."}`});
    }
    const s = state.simulation;
    for(const [key,record] of Object.entries(s?.knowledge?.player || {})) if(key.startsWith('original_frontier.')) news.push({id:`frontier:news:${key}`,at:record.at,text:record.value});
    // Only received player accounts enter the feed. Actor controllers, source
    // baselines and unobserved future outcomes never become public news.
    for(const [key,record] of Object.entries(s?.knowledge?.player || {})) if(
        key.startsWith('book.paradise.') || key.startsWith('book.goa.') || key.startsWith('book.mol.')) {
        news.push({id:`book:news:${key}`,at:record.at,text:record.value});
    }
    if(state.bookWorldCampaign && ['book.paradise.hub','book.paradise.goa'].includes(worldId)) leads.push({
        id:'book:paradise-notes',label:'Your local agreements and received reports',at:state.clock,
        detail:'Review current work, preparation, consequences and your actual return terms.',
        action:'Open local Notebook',available:true,view:'here',panel:'feature_expansion_panel',control:null});
    if(state.motherOfLearning && worldId===state.motherOfLearning.instances?.[0]?.worldId) leads.push({
        id:'book:mol-notes',label:'Your Cyoria work and received findings',at:state.clock,
        detail:'Review research, device preparation, local responses and your return route.',
        action:'Open local Notebook',available:true,view:'here',panel:'feature_expansion_panel',control:null});
    if(actor.facts['original_frontier.freight.introduced']) leads.push({id:'frontier:notes',label:'Your local work and findings',at:state.clock,detail:'Review your recorded agreements, current work and known offers.',action:'Open local notes',available:true,view:'here',panel:'original_frontier_panel',control:null});
    if(s?.knowledge?.player?.["promise.claim"] && s.situations?.["promise.visitor"]?.phase.endsWith("_ready") && facts.location === "Village" && s.people.promiseVisitor.location === "Village") leads.push({
        id:"promise:meeting",label:"Tamsin has something to tell you",at:state.clock,detail:"Speak to her beside the cart in Village.",
        action:"Meet Tamsin",available:true,locations:["Village"],...destination("promise_panel",null)});

    for(const id of Object.keys(s?.pursuits || {})) {
        const pursuit=pursuitView(state,id);
        if(pursuit.status === "contact" && (pursuit.expiresAt == null || pursuit.expiresAt > state.clock))leads.push({id:pursuit.requestId,label:pursuit.label,at:pursuit.observedAt,detail:`${pursuit.requestLocation} · ${pursuit.expiresAt == null ? "awaiting your response" : `${pursuit.expiresAt-state.clock} game minutes to respond`}`,action:"View encounter",available:true,locations:[pursuit.requestLocation],...destination("pursuit_panel",pursuit.commandId)});
        news.push({id:`pursuit:news:${pursuit.id}`,at:pursuit.observedAt,text:pursuit.text});
    }
    if(facts.location === "Village" && facts["village.craftsmanMet"] && actor.facts["sim.commissioned"] && !actor.completed["village.collect"] &&
        state.actors.oldCraftsman?.worldId === worldId && state.actors.oldCraftsman.facts["work.ready"]) leads.push({
        id:"work:craftsman", label:"Your commissioned kit is ready", at:state.clock,
        detail:"The old craftsman has finished your order in Village.", action:"Collect in Notebook", available:true, locations:["Village"],
        ...destination("simulation_panel", "village.collect")
    });
    for(const [id,p] of Object.entries(s?.people || {})) {
        if(facts.location !== "Village" || p.location !== "Village" || p.createdBy !== "player" || p.life !== "alive" || state.actors[id]?.worldId !== worldId || !state.actors[id].facts["helper.ready"]) continue;
        leads.push({id:`work:${id}`, label:"Your pathfinder has returned", at:state.clock,
            detail:"Your road-check commission is ready to collect in Village.", action:"Collect in Notebook", available:true, locations:["Village"],
            ...destination("simulation_panel", `village.collect_helper:${id}`)});
    }
    for(const receipt of state.history) {
        if(receipt.actorId !== "player" || registry.actions.get(receipt.actionId)?.worldId !== worldId) continue;
        // Frozen pending outcomes remain private until a completion receipt exists.
        news.push({id:`receipt:${receipt.id}`, at:receipt.at, text:receipt.label});
    }
    const order = (a,b) => b.at-a.at || a.id.localeCompare(b.id);
    leads.sort((a,b) => Number(b.available)-Number(a.available) || a.at-b.at || a.id.localeCompare(b.id));
    const lifeView=state.chronicle ? lifeExperienceView(state.chronicle) : null;
    const life=lifeView ? [{id:'life:age',at:state.clock,text:`Age ${lifeView.age}. ${lifeView.stage==='youth' ? 'New lessons come quickly.' : lifeView.stage==='elder' ? 'There is still time to teach someone what I know.' : 'There is work to do, and time to do it.'}`},
        ...(state.chronicle.knowledge.routeSignals ? [{id:'life:roads',at:state.clock,text:'I learned to read the road.'}] : []),
        ...(state.chronicle.relationships.villageElder?.ties.dutyKept ? [{id:'life:promise',at:state.clock,text:'I kept my promise to put the old records in order.'}] : []),
        ...state.chronicle.log.filter(m=>m.life || LIFE_LESSONS.some(l=>[l.youth,l.adult,l.elder].includes(m.text))).slice(-6).reverse().map((m,i)=>({id:`life:${i}:${m.at}`,at:m.at,text:m.text})),
        ...(lifeView.epitaph?[{id:'life:grave',at:state.chronicle.life.endedAt,text:lifeView.epitaph}]:[])] : [];
    if(lifeRecord){const record=lifeRecordView(lifeRecord);life.push(...record.recent.map(m=>({id:`memory:${m.id}`,at:m.at,text:`Year ${m.year}: ${m.text}`})),...record.years.map(y=>({id:`year:${y.year}`,at:y.last,text:`Year ${y.year}: ${y.count} moments remembered. ${y.highlights.join(' ')}`})));if(record.earlier.count)life.push({id:'earlier',at:0,text:`Through year ${record.earlier.throughYear}: ${record.earlier.count} moments remembered.`});}
    const heard=Object.values(c?.events || {}).filter(e=>e.status==='missed'&&e.heard).map(e=>({id:`heard:${e.id}`,at:e.settledAt,text:e.missedText}));
    return {leads, news:news.sort(order).slice(0,8),life,heard};
}
