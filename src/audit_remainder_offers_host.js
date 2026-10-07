import {assert} from './simulation_contracts.js';
import {commitSimulationCommand} from './simulation.js';
import {projectFeatureCommands,featureWorkControls,featureRecordedKnowledge} from './feature_expansion_host.js';
import {REMAINDER_OFFERS_GROUP,REMAINDER_PATHFINDER_PROFILES,REMAINDER_SUPPLY} from './audit_remainder_offers_content.js';
import {remainderOffersFacts,validateRemainderOffers,createRemainderOffersSolicitation,advanceRemainderOffers,frozenRemainderOffersRegistry} from './audit_remainder_offers_state.js';

export function remainderOffersContext(state,context={}) {
    return {...context,facts:{...context.facts,...remainderOffersFacts(state,context)}};
}

export function commitRemainderOffersCommand(state,registry,command,context,expectedSequence=state.sequence) {
    const d=registry.simulation.commands.get(command.id),roster=state.auditRemainder?.modules?.offers?.solicitation,supply=state.simulation?.situations?.[REMAINDER_SUPPLY.situation];
    assert(state.auditRemainder?.schema===1&&state.schema===11&&context.actorId==='player'&&d?.actorId==='player'&&d.group===REMAINDER_OFFERS_GROUP,'Choose an explicitly enrolled local offer action.');
    assert(Object.keys(command).every(k=>['type','id','targetId','rosterCause','occurrenceCause'].includes(k))&&(!command.targetId||command.targetId===d.targetId),'The local offer request has unsupported options or another participant.');
    if(command.id.startsWith('remainder_offers.hire_')||command.id==='remainder_offers.decline_all')assert(roster&&command.rosterCause===roster.cause,'This retained roster changed.');
    if(d.targetId===REMAINDER_SUPPLY.client)assert(supply&&command.occurrenceCause===supply.cause,'This local supply occurrence changed.');
    const actual=frozenRemainderOffersRegistry(state,registry),current=remainderOffersContext(state,{...context,targetId:d.targetId||null});
    const snapshot=command.id==='remainder_offers.solicit'?createRemainderOffersSolicitation(state,`simulation:${state.sequence+1}`,state.sequence+1):null;
    const out=commitSimulationCommand(state,actual,{id:d.id},current,expectedSequence);
    if(snapshot)out.state.auditRemainder.modules.offers=snapshot;
    advanceRemainderOffers(state,out,actual);
    validateRemainderOffers(out.state,actual);
    return out;
}

export function remainderOffersPresentation(state,registry,context={}) {
    if(state.auditRemainder?.schema!==1)return {visible:false,sections:[]};
    const current=remainderOffersContext(state,context),actual=frozenRemainderOffersRegistry(state,registry),o=state.auditRemainder.modules?.offers?.solicitation;
    const supply=state.simulation?.situations?.[REMAINDER_SUPPLY.situation];
    const actions=projectFeatureCommands(state,actual,current,{groups:[REMAINDER_OFFERS_GROUP],commandType:'audit_remainder'}).map(a=>({...a,command:{...a.command,
        ...(a.id.startsWith('remainder_offers.hire_')||a.id==='remainder_offers.decline_all'?{rosterCause:o?.cause}:{}),
        ...(a.command.targetId===REMAINDER_SUPPLY.client?{occurrenceCause:supply?.cause}:{})}}));
    const work=featureWorkControls(state,actual,[REMAINDER_OFFERS_GROUP],current);
    const rosterActions=actions.filter(a=>!a.id.includes('supply')&&!a.id.endsWith('.hear_supply'));
    const supplyActions=actions.filter(a=>a.id.includes('supply'));
    const records=featureRecordedKnowledge(state,['remainder.offers.']);
    const rosterRecords=[];
    if(o) {
        rosterRecords.push({id:o.id,text:`One retained solicitation: ${o.status}. Created at played minute ${o.requestedAt}; no refresh or replacement roster.`});
        if(o.status==='open'||o.status==='selected')for(const [i,c] of o.candidates.entries()) {
            const p=REMAINDER_PATHFINDER_PROFILES[i];
            rosterRecords.push({id:c.id,text:`${p.label}: ${c.disposition}. Offered means: ${p.focus} focus, ${p.stamina} stamina and two usable hands. Three coins and one actual log fund the commission. ${p.terms} ${p.useful}`});
        }
        if(o.status==='selected')rosterRecords.push({id:'remainder.offers.contract',text:'The chosen pathfinder has the agreed final supplied contract. Their route and packing spend their own finite effort. Meet the returned person in Village to inspect and collect the actual result.'});
    }
    const supplyRecords=records.filter(r=>r.id.startsWith('remainder.offers.supply'));
    if(supply) {
        const observedTerminal=!!state.simulation.knowledge.player?.['remainder.offers.supply.delivered']||!!state.simulation.knowledge.player?.['remainder.offers.supply.declined']||!!state.simulation.knowledge.player?.['remainder.offers.supply.aftermath'];
        const status=['posted','accepted'].includes(supply.phase)?supply.phase:observedTerminal?supply.phase:'deadline passed; ask Ressa for the later account';
        supplyRecords.unshift({id:REMAINDER_SUPPLY.situation,text:`Known request: one Prepared survey kit for four reserved Ressa coins · ${status}. Local deadline: played minute ${supply.deadline}; ${Math.max(0,supply.deadline-state.clock)} supported minutes remain. Unsupported realm absence retains this window; closed-browser time advances nothing.`});
    }
    const sections=[];
    if(rosterActions.length||o||work.work)sections.push({id:'remainder.offers.pathfinders',label:'Three finite pathfinder offers',description:'Compare one saved roster, choose one actual funded person or decline all. Their work and later paid route uses differ.',
        ...work,actions:[...rosterActions,...work.actions],records:[...rosterRecords,...records.filter(r=>!r.id.startsWith('remainder.offers.supply'))]});
    if(supplyActions.length||supply)sections.push({id:'remainder.offers.supply',label:'Ressa’s funded local supply request',description:'One owned need and one declared four-coin purse. Delivery transfers one real kit; unused escrow returns to its payer. A later account requires meeting the actual client.',actions:supplyActions,records:supplyRecords});
    return {visible:sections.length>0,sections};
}
