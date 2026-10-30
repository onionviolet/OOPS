import {castSettledPeople,currentCastBeatLedger} from './book_world_lotm_cast_host.js';
import {agreedDutyPeopleView} from './agreed_duty_host.js';
import {molDefinitions} from './book_world_mol_content.js';
import {worldCompletionPeopleView} from './world_completion_people.js';
import {remainderConsequencesPeopleView} from './audit_remainder_consequences_host.js';
import {paradiseDefinitions} from './book_world_paradise_content.js';
// Project witnessed content, never an NPC's hidden state. Registry membership
// and simulation enrollment alone do not introduce a person to the player.
import {relayPeopleView} from './feature_expansion_subtlety_host.js';
import {nestedChainPeopleView} from './feature_expansion_nested_chains_host.js';
import {nestedDefinitions,NESTED_IDS} from './feature_expansion_nested_content.js';

// Received accounts retain their observation basis. Never inspect the subject's
// live body, powers, purse or inventory to fill an unobserved person book.
const personAccounts=received=>received.map(([id,r])=>({id,text:r.value,at:r.at,
    basis:r.basis?.kind==='observation'?'Observed':r.basis?.kind==='instruction'?'Told to you':'Received account'}));

export function knownPeopleView(state, facts = {}) {
    const player = state.actors.player, simulation = state.simulation;
    const knowledge = simulation?.knowledge.player || {}, rows = [];
    const add = (id, name, location, details = [], memories = []) => rows.push({id, name, location, details, memories});
    const chronicle = state.chronicle, elder = chronicle?.relationships.villageElder;
    if(facts["village.elderMet"] || elder?.memories.length) {
        const details = [], ties = elder?.ties || {};
        if(chronicle?.knowledge.elderClue) details.push("You noticed signs of practiced movement when inspecting the elder.");
        if(chronicle?.elder.revealed) details.push("You have witnessed his practiced control in an encounter.");
        if(ties.grievance) details.push("Your assault remains unresolved.");
        if(ties.dutyKept) details.push("You kept your archive promise.");
        else if(ties.archiveDuty) details.push("Your archive promise is still pending.");
        if(ties.successor) details.push("He entrusted you with the archive.");
        add("villageElder", "Village elder", "Last known: Village", details,
            (elder?.memories || []).map(m => ({id:m.id, at:m.at, text:m.text})).reverse());
    }
    // His private axes, conditions, possessions, jobs and memories are excluded.
    if(facts["village.craftsmanMet"] || knowledge["craftsman.preferences"] || player.facts["sim.commissioned"]) {
        const details = [], memories = [];
        if(knowledge["craftsman.preferences"]) details.push(knowledge["craftsman.preferences"].value);
        for(const [key,record] of Object.entries(knowledge)) if(key.startsWith("body.feedback.")) {
            memories.push({id:record.cause,at:record.at,text:record.value});
        }
        if(player.facts["sim.commissioned"]) memories.push({id:"commission", text:"You supplied the agreed wood and payment for a kit."});
        if(Object.hasOwn(player.completed, "village.collect")) memories.push({id:"collection", text:"You collected the finished commissioned kit."});
        if(Object.hasOwn(player.completed, "village.working_habits")) memories.push({id:"preferences", text:"You asked how he prefers to work."});
        if(Object.hasOwn(player.completed, "village.interrupt_work")) memories.push({id:"interruption", text:"You interrupted him while he was counting fittings. He asked for quiet."});
        const knownTraits=Object.entries(knowledge).filter(([key])=>key.startsWith('person.oldCraftsman.trait.')).map(([,record])=>record.value);
        if(knownTraits.length) details.push(`Seen in his conduct: ${knownTraits.join(', ')}.`);
        add("oldCraftsman", "Old craftsman", "Last known: Village", details, memories);
        rows[rows.length-1].knownTraits=knownTraits;
    }
    if(player.facts["town.briefed"]) {
        add("town.surveyClerk", "Survey clerk", "Last known: survey office, Town square",
            [player.facts["town.settled"] ? "The clerk accepted your contribution and paid the agreed fee." : "You agreed to provide a road check or timber for markers."], []);
    }
    if(knowledge["pursuit.notice"])add("routeApprentice","Neri, route apprentice","Last reported: agreed Village field test",[knowledge["pursuit.notice"].value],[]);
    for(const [key,p] of Object.entries(simulation?.pursuits || {}))if(p.policy.noticeKey && knowledge[p.policy.noticeKey])add(p.actorId,p.policy.label,"Last reported: agreed encounter",[knowledge[p.policy.noticeKey].value],[]);
    // Hiring introduces the participant. Their independent journey is not a
    // report to the player. The supported collection's handover is witnessed.
    let helperNumber = 0;
    for(const [id, person] of Object.entries(simulation?.people || {})) {
        if(person.createdBy !== "player" || person.definitionId !== "village.route_helper") continue;
        const handedOver = simulation.relationships[id]?.player?.memories.find(m => m.text === "Handed over the completed kit.");
        add(id, `Hired pathfinder ${++helperNumber}`, handedOver ? "Last known: Village" : "Agreed assignment: nearby road",
            [handedOver ? "Commission delivered; the pathfinder left to find other work." : "Agreed to check the nearby road and bring back a usable kit."],
            handedOver ? [{id:handedOver.cause, at:handedOver.at, text:handedOver.text}] : []);
    }
    if(knowledge["promise.claim"]) add("promiseVisitor", "Tamsin, mill traveler", "Last met: Village",
        Object.entries(knowledge).filter(([k]) => k.startsWith("promise.")).map(([,k]) => k.value), []);
    if(knowledge["party.lio"])add("partyPartner","Lio, association porter","Last met: Village",[knowledge["party.lio"].value],
        (simulation.relationships.player?.partyPartner?.memories||[]).map(m=>({id:m.cause,at:m.at,text:m.text})));
    if(knowledge["exchange.meeting"])add("exchangeClerk","Iona, visiting parcel clerk","Last met: Village",
        Object.entries(knowledge).filter(([k])=>k.startsWith("exchange.")).map(([,r])=>r.value),
        (simulation.relationships.player?.exchangeClerk?.memories||[]).map(m=>({id:m.cause,at:m.at,text:m.text})));
    if(knowledge["observation.opening"])add("observation.ilex",knowledge["observation.name"]?"Ilex":"Visitor beyond the inner glass","Last viewed: Village's paired instrument",
        Object.entries(knowledge).filter(([k])=>k.startsWith("observation.")).map(([,r])=>r.value),[]);
    if(knowledge['glasshouse.main.glasshouse.meeting'])add('glasshouse.main.caretaker','Joss, Glasshouse caretaker','Last met: Folded Glasshouse',Object.entries(knowledge).filter(([k])=>k.startsWith('glasshouse.main.glasshouse.')&&!k.endsWith('.lead')).map(([,r])=>r.value),[]);
    const frontierContacts=[
        ['freight.introduced','mira','Mira, parcel dispatcher','Village',['freight.opening','freight.decision','freight.return']],
        ['freight.townMet','wen','Wen, depot receiver','Town square',['freight.later','freight.method','charter.terms']],
        ['control.forestMet','nea','Nea, road observer','Forest road',['control.forest']],
        ['control.caveMet','iver','Iver, entrance observer','Nearby cave',['control.cave']],
        ['material.met','iven','Iven, stock examiner','Village',['material.question','material.report','material.request']],
        ['buyer.met','halden','Halden, contract buyer','Village',['buyer.terms','institution.']],
        ['successor.met','jun','Jun, willing resident learner','Village',['successor.']]
    ];
    for(const [flag,id,name,place,keys] of frontierContacts) if(player.facts[`original_frontier.${flag}`]) {
        const records=Object.entries(knowledge).filter(([key])=>keys.some(prefix=>key.startsWith(`original_frontier.${prefix}`)));
        add(`original_frontier.${id}`,name,`Last met: ${place}`,records.map(([,r])=>r.value),
            records.map(([key,r])=>({id:key,at:r.at,text:r.value})));
    }
    const append=row=>{const existing=rows.find(p=>p.id===row.id);if(existing){existing.details=[...new Set([...existing.details,...row.details])];existing.memories.push(...(row.memories||[]));}else rows.push(row);};
    for(const row of remainderConsequencesPeopleView(state))append(row);
    for(const row of worldCompletionPeopleView(state))append(row);
    for(const row of agreedDutyPeopleView(state))append(row);
    for(const row of relayPeopleView(state))append({...row,memories:row.memories||[]});
    const registry={simulation:{people:new Map(nestedDefinitions.people.map(p=>[p.id,p]))}};
    for(const row of nestedChainPeopleView(state,registry))append(row);
    const introductions={
        [NESTED_IDS.employee]:['nested.hub.life'],[NESTED_IDS.issuer]:['nested.hub.life'],[NESTED_IDS.trainer]:['nested.method.fragment','nested.method.supported','nested.refit'],
        [NESTED_IDS.keeper]:['nested.saltworks.inspection'],[NESTED_IDS.foreman]:['nested.saltworks.inspection'],
        [NESTED_IDS.registrar]:['nested.archive.inspection'],[NESTED_IDS.claimant]:['nested.archive.inspection'],[NESTED_IDS.witness]:['nested.archive.preserved']};
    for(const p of nestedDefinitions.people){const received=Object.entries(knowledge).filter(([key])=>introductions[p.id]?.includes(key));if(received.length)append({id:p.id,name:p.label,location:'Known from a received local account',details:received.map(([,r])=>r.value),memories:received.map(([id,r])=>({id,at:r.at,text:r.value}))});}
    for(const [name,id] of [['lin',NESTED_IDS.employee],['brin',NESTED_IDS.foreman],['ivo',NESTED_IDS.witness]]){
        const received=Object.entries(knowledge).filter(([key])=>key.startsWith(`nested.life.${name}.`));
        if(received.length)append({id,name:nestedDefinitions.people.find(p=>p.id===id).label,location:'Known from your local meeting and received account',details:received.map(([,r])=>r.value),memories:received.map(([id,r])=>({id,at:r.at,text:r.value}))});
    }
    for(const person of paradiseDefinitions.people){
        const received=Object.entries(knowledge).filter(([key,r])=>(key.startsWith('book.paradise.')||key.startsWith('book.goa.'))&&r.basis?.attributedTo===person.id);
        if(received.length)append({id:person.id,name:person.label,location:'Known from your received local meeting or attributed report',details:received.map(([,r])=>r.value),accounts:personAccounts(received),memories:received.map(([id,r])=>({id,at:r.at,text:r.value}))});
    }
    for(const person of molDefinitions.people){
        const received=Object.entries(knowledge).filter(([key,r])=>key.startsWith('book.mol.')&&r.basis?.attributedTo===person.id);
        if(received.length)append({id:person.id,name:person.label,location:'Known from your received Cyoria meeting or attributed report',details:received.map(([,r])=>r.value),accounts:personAccounts(received),memories:received.map(([id,r])=>({id,at:r.at,text:r.value}))});
    }
    for(const row of castSettledPeople(state,currentCastBeatLedger()))append(row);
    return rows;
}
