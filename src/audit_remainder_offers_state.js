import {sameJson as same} from './basics.js';
import {lorePracticeOwnerDeltas} from './lore_practice_facts.js';
import {auditRemainderFacts} from './audit_remainder_state.js';
// Pure current-owner projections and exact optional-record validation.
import {assert,copy,record,stableId,natural} from './simulation_contracts.js';
import {deriveSimulationSeed} from './simulation_resolution.js';
import {REMAINDER_PATHFINDER_PROFILES as profiles,REMAINDER_SUPPLY as S,REMAINDER_OFFERS_KEYS as K,REMAINDER_OFFERS_WORLD as W,remainderOffersTemplate} from './audit_remainder_offers_content.js';

const moduleRecord = state => state.auditRemainder?.modules?.offers;
const situation = state => state.simulation?.situations?.[S.situation];
const complete = (state,actor,id) => state.actors[actor]?.completed?.[id] || 0;
const keys = (value,allowed,name) => assert(record(value)&&Object.keys(value).every(k=>allowed.includes(k)),`Invalid ${name} fields.`);
const borrowed = (state,actor,key) => Object.values(state.simulation?.custody || {}).some(c=>c.holder===actor&&c.key===key);
const activeCondition = (state,actor,id) => {const c=state.simulation?.conditions?.[actor]?.[id];return !!c&&c.intensity>0&&(c.expiresAt==null||c.expiresAt>state.clock);};
const bodySupported = (state,id) => {const p=state.simulation?.people[id];return p?.life==='alive'&&state.actors[id]?.worldId===W&&(p.body?.hands||0)>=2&&p.body?.mobile!==false&&p.vitals?.health>1;};

export function remainderOffersFacts(state,context={}) {
    const s=state.simulation,r=moduleRecord(state),roster=r?.solicitation,a=context.actorId||'player',p=s?.people[a],client=s?.people[S.client],supply=situation(state);
    const enrolled=state.schema===11&&auditRemainderFacts(state)['auditRemainder.enrolled'];
    const supported=state.actors.player?.worldId===W&&!state.realmPrototype?.activeVisitId;
    const f={'auditRemainder.enrolled':enrolled,'remainder.offers.clockSupported':enrolled&&supported,
        'remainder.offers.unsolicited':!roster,'remainder.offers.rosterOpen':roster?.status==='open',
        'remainder.offers.supplyAbsent':!supply&&!client,
        'remainder.offers.handsUsable':context.facts?.['reference.workshop.handsUsable']===true,
        'remainder.offers.workerSupported':enrolled&&bodySupported(state,a)&&state.actors[a]?.facts?.['remainder.offers.willing']===true&&
            roster?.status==='selected'&&roster.choice?.candidateId===a};
    const funds=state.actors[S.client]?.resources;
    const validClient=bodySupported(state,S.client)&&client.location==='Village';
    f['remainder.offers.supplyOpen']=enrolled&&supported&&validClient&&!!supply&&['posted','accepted'].includes(supply.phase)&&state.clock<supply.deadline;
    f['remainder.offers.supplyExpired']=enrolled&&supported&&validClient&&!!supply&&['posted','accepted'].includes(supply.phase)&&state.clock>=supply.deadline;
    f['remainder.offers.supplyFunded']=validClient&&funds?.money===S.price&&funds?.kit_need===1;
    f['remainder.offers.supplyEscrow']=validClient&&funds?.supply_escrow===S.price&&funds?.kit_need===1;
    f['remainder.offers.supplyClosed']=!!supply&&['declined','expired'].includes(supply.phase);
    f['remainder.offers.detourReported']=validClient&&state.actors[S.client]?.facts?.['remainder.offers.detourDone']===true;
    for(const candidate of profiles) {
        const id=candidate.id,actor=state.actors[id],person=s?.people[id],selected=roster?.status==='selected'&&roster.choice?.candidateId===id;
        f[`remainder.offers.candidate.${candidate.profile}.selected`]=selected;
        f[`remainder.offers.candidate.${candidate.profile}.eligible`]=enrolled&&roster?.status==='open'&&
            !actor&&!person&&(candidate.profile!=='fen'||state.actors.player.facts['field.supplyDone']===true);
        f[`remainder.offers.candidate.${candidate.profile}.ready`]=selected&&bodySupported(state,id)&&person.location==='Village'&&actor.facts['remainder.offers.ready']===true&&
            (s.owners[id]?.[K.kit]||0)===1&&!borrowed(state,id,K.kit);
        f[`remainder.offers.candidate.${candidate.profile}.collectKnown`]=f[`remainder.offers.candidate.${candidate.profile}.ready`]&&
            (context.facts?.location||s?.people.player?.location)==='Village'&&state.actors.player.worldId===W;
    }
    return f;
}

// Admission snapshot only, before executing the one paid-time request. A saved
// roster describes offers, not three bodies/inventories/controllers.
export function createRemainderOffersSolicitation(state,cause,sequence) {
    assert(state.auditRemainder?.schema===1&&state.schema===11&&!moduleRecord(state)?.solicitation&&stableId(cause)&&natural(sequence)&&sequence===state.sequence+1,'This finite solicitation is unavailable.');
    return {schema:1,solicitation:{schema:1,id:'remainder.offers.solicitation',cause,seed:deriveSimulationSeed(state.simulation.seed,cause),
        generationSeed:state.simulation.seed,requestedAt:state.clock,requestedSequence:sequence,readyAt:state.clock+1,status:'preparing',
        candidates:profiles.map(p=>({id:p.id,definitionId:p.id,revision:1,profile:p.profile,template:remainderOffersTemplate(p.id),wage:3,logCount:1,disposition:'offered'})),choice:null,closed:null}};
}

export function retainRemainderOffersWindow(state,from,through) {
    const supply=situation(state);
    if(state.auditRemainder?.schema===1&&supply&&['posted','accepted'].includes(supply.phase)&&
        (state.actors.player.worldId!==W||state.realmPrototype?.activeVisitId)&&supply.deadline>from)supply.deadline+=through-from;
}

export function validateRemainderOffers(state,registry) {
    const r=moduleRecord(state),s=state.simulation,supply=situation(state),enrolled=state.auditRemainder?.schema===1&&state.schema===11;
    const relevantActorIds=[S.client,...profiles.map(p=>p.id)];
    if(!enrolled) {
        assert(!r&&!supply&&!relevantActorIds.some(id=>state.actors[id]||s?.people[id])&&!s?.jobs.some(j=>j.commandId.startsWith('remainder_offers.'))&&
            !Object.keys(s?.claims||{}).some(k=>k.startsWith('remainder.offers.'))&&!Object.keys(s?.knowledge?.player||{}).some(k=>k.startsWith('remainder.offers.'))&&
            !Object.values(state.actors).some(a=>Object.keys(a.facts||{}).some(k=>k.startsWith('remainder.offers.'))),'Remainder offers require explicit optional enrollment.');
        return;
    }
    const playerFacts=state.actors.player.facts;
    assert(Object.keys(playerFacts).filter(k=>k.startsWith('remainder.offers.')).every(k=>profiles.some(p=>k===`remainder.offers.route.${p.profile}`)),'Unsupported offer facts on the player.');
    assert(Object.keys(s.claims).filter(k=>k.startsWith('remainder.offers.')).every(k=>['remainder.offers.solicitation','remainder.offers.selection','remainder.offers.supply_occurrence','remainder.offers.supply_acceptance'].includes(k)),'Unsupported local offer claim.');
    for(const p of profiles)if(playerFacts[`remainder.offers.route.${p.profile}`]!=null)assert(playerFacts[`remainder.offers.route.${p.profile}`]===true&&complete(state,'player',`remainder_offers.collect_${p.profile}`)===1,'A useful route needs its actual collected report.');
    if(r) {
        keys(r,['schema','solicitation'],'offer module');assert(r.schema===1&&r.solicitation,'Invalid optional offer module.');
        const o=r.solicitation;
        keys(o,['schema','id','cause','seed','generationSeed','requestedAt','requestedSequence','readyAt','status','candidates','choice','closed'],'solicitation');
        assert(o.schema===1&&o.id==='remainder.offers.solicitation'&&/^simulation:[1-9][0-9]*$/.test(o.cause)&&
            o.cause===`simulation:${o.requestedSequence}`&&natural(o.requestedSequence)&&o.requestedSequence<=state.sequence&&
            natural(o.requestedAt)&&o.requestedAt<=state.clock&&o.readyAt===o.requestedAt+1&&
            natural(o.generationSeed)&&o.generationSeed>0&&o.generationSeed<=0xffffffff&&o.seed===deriveSimulationSeed(o.generationSeed,o.cause)&&
            ['preparing','open','selected','declined','cancelled'].includes(o.status),'Invalid frozen solicitation cause, time or disposition.');
        assert(Array.isArray(o.candidates)&&o.candidates.length===3&&new Set(o.candidates.map(c=>c.id)).size===3,'Exactly three distinct retained offers are required.');
        for(const [i,c] of o.candidates.entries()) {
            const p=profiles[i];keys(c,['id','definitionId','revision','profile','template','wage','logCount','disposition'],'pathfinder offer');
            assert(c.id===p.id&&c.definitionId===p.id&&c.profile===p.profile&&c.revision===1&&c.wage===3&&c.logCount===1&&same(c.template,remainderOffersTemplate(p.id))&&
                ['offered','selected','declined'].includes(c.disposition)&&(!registry||registry.simulation.people.get(c.definitionId)?.revision===1),'Unsupported candidate identity, means or frozen template.');
            const selected=o.choice?.candidateId===c.id;
            assert(c.disposition===(o.status==='selected'?(selected?'selected':'declined'):['declined','cancelled'].includes(o.status)?'declined':'offered'),'Candidate disposition conflicts with the sole decision.');
            if(!selected)assert(!state.actors[c.id]&&!s.people[c.id]&&!s.owners[c.id]&&!Object.values(s.controllers).some(t=>t.actorId===c.id),'Unselected offers cannot have actual ticking bodies, stock or duties.');
            else {
                const person=s.people[c.id],actor=state.actors[c.id];
                assert(person&&actor&&person.createdBy==='player'&&person.definitionId===c.id&&person.definitionRevision===c.revision&&person.inventory==='simulation'&&actor.worldId===W&&
                    natural(person.body?.hands)&&person.body.hands<=c.template.body.hands&&typeof person.body.mobile==='boolean'&&person.vitals.max_health===c.template.vitals.max_health&&person.vitals.max_stamina===c.template.vitals.max_stamina&&
                    person.bornAt===o.choice.at&&actor.facts['remainder.offers.funded']===true,'Selected candidate lacks its actual frozen owned body and contract.');
                const funded=s.knowledge[c.id]?.['remainder.offers.funding'];
                assert(funded?.cause===o.choice.cause&&funded.at===o.choice.at&&complete(state,'player',`remainder_offers.hire_${c.profile}`)===1,'Actual funding must share the selected-person cause.');
                assert(Object.keys(actor.resources).every(k=>['focus','money',...(c.profile==='fen'?['pack_method']:[])].includes(k))&&actor.resources.focus>=0&&actor.resources.focus<=c.template.resources.focus&&
                    (c.profile!=='fen'||actor.resources.pack_method>=0&&actor.resources.pack_method<=1)&&
                    Object.keys(actor.facts).every(k=>['funded','willing','routeDone','ready'].includes(k.slice('remainder.offers.'.length))&&k.startsWith('remainder.offers.')),
                    'A pathfinder may use only its declared finite personal means and duty facts.');
                assert(s.controllers[`${c.id}:remainder.offers.controller.${c.profile}`]?.actorId===c.id&&
                    s.controllers[`${c.id}:remainder.offers.controller.${c.profile}`]?.definitionId===`remainder.offers.controller.${c.profile}`,
                    'The selected pathfinder needs its actual independent command controller.');
                const collected=complete(state,'player',`remainder_offers.collect_${c.profile}`)===1;
                assert(actor.resources.money===3&&person.life===(collected?'departed':'alive'),'Contract wage or terminal worker disposition is not conserved.');
                const route=complete(state,c.id,`remainder_offers.route_${c.profile}`),packed=complete(state,c.id,`remainder_offers.pack_${c.profile}`);
                assert(route<=1&&packed<=1&&(!packed||route===1)&&(!collected||packed===1),'Funded output requires the selected actor’s actual route and packing.');
                const held=s.jobs.find(j=>j.actorId===c.id&&j.commandId===`remainder_offers.pack_${c.profile}`);
                assert((s.owners[c.id]?.[K.log]||0)===(packed||held?0:1)&&
                    (s.owners[c.id]?.[K.kit]||0)===(packed&&!collected?1:0),'The one supplied log and one returned kit must remain with their actual owners.');
                if(held)assert(held.costs.some(e=>e.type==='item'&&e.key===K.log&&e.amount===-1)&&held.reservationReturns===1,'Packing needs the real one-log reservation.');
                assert((actor.facts['remainder.offers.routeDone']===true)===(route===1)&&(actor.facts['remainder.offers.ready']===true)===(packed===1)&&
                    (state.actors.player.facts[`remainder.offers.route.${c.profile}`]===true)===collected,'A route report or collection cannot precede actual funded output.');
            }
        }
        const requestJob=s.jobs.find(j=>j.id===o.cause&&j.commandId==='remainder_offers.solicit');
        if(o.status==='preparing')assert(requestJob&&requestJob.due===o.readyAt&&!o.choice&&!o.closed,'Preparing offers require the exact pending paid-time request.');
        else if(o.status==='cancelled')assert(!requestJob&&!complete(state,'player','remainder_offers.solicit')&&o.closed&&!o.choice,'Cancelled solicitation has no replacement or completed request.');
        else assert(!requestJob&&complete(state,'player','remainder_offers.solicit')===1&&s.knowledge.player?.['remainder.offers.solicitation']?.cause===o.cause,'Published offers require the actual one-minute completion.');
        if(o.choice) {
            keys(o.choice,['candidateId','cause','at','sequence'],'offer choice');
            assert(o.status==='selected'&&profiles.some(p=>p.id===o.choice.candidateId)&&o.choice.cause===`simulation:${o.choice.sequence}`&&natural(o.choice.sequence)&&o.choice.sequence>o.requestedSequence&&o.choice.sequence<=state.sequence&&
                natural(o.choice.at)&&o.choice.at>=o.readyAt&&o.choice.at<=state.clock&&s.claims['remainder.offers.selection']?.cause===o.choice.cause,'Invalid sole funded selection receipt.');
        } else assert(o.status!=='selected','Selected roster needs the actual sole selection.');
        if(o.closed) {
            keys(o.closed,['cause','at','sequence'],'closed offer roster');
            assert(['declined','cancelled'].includes(o.status)&&stableId(o.closed.cause)&&natural(o.closed.at)&&o.closed.at<=state.clock&&natural(o.closed.sequence)&&o.closed.sequence<=state.sequence,'Invalid closed roster boundary.');
            if(o.status==='declined')assert(complete(state,'player','remainder_offers.decline_all')===1&&s.knowledge.player?.['remainder.offers.declined']?.cause===o.closed.cause&&s.claims['remainder.offers.selection']?.cause===o.closed.cause,'Declined offers need their actual free decline receipt.');
        } else assert(!['declined','cancelled'].includes(o.status),'Closed roster needs its retained boundary.');
    } else assert(!profiles.some(p=>state.actors[p.id]||s.people[p.id])&&!s.claims['remainder.offers.solicitation']&&!s.claims['remainder.offers.selection'],'A pathfinder contract needs the retained solicitation.');
    if(supply) {
        const extra=lorePracticeOwnerDeltas(state)[S.client];
        const d=registry?.simulation.situations.get(S.situation),p=s.people[S.client],a=state.actors[S.client];
        assert(supply.definitionId===S.situation&&supply.revision===1&&supply.participants.length===2&&supply.participants[0]==='player'&&supply.participants[1]===S.client&&
            same(supply.privateTruth,{clientId:S.client,itemKey:K.kit,count:1,price:S.price,purseSource:S.purseSource,needSource:S.needSource})&&
            (!d||d.revision===1)&&p?.definitionId===S.client&&p.createdBy==='player'&&p.bornAt===supply.openedAt&&a?.worldId===W&&
            complete(state,'player','remainder_offers.hear_supply')===1&&s.claims['remainder.offers.supply_occurrence']?.cause===supply.cause&&
            s.knowledge.player?.['remainder.offers.supply.report']?.cause===supply.cause,'The request needs its actual once-funded client, owned need and observed creation.');
        assert(Object.keys(a.resources).every(k=>['money','kit_need','detour_effort','supply_escrow',...Object.keys(extra.resources)].includes(k))&&
            Object.keys(a.facts).every(k=>k==='remainder.offers.detourDone')&&s.controllers[`${S.client}:remainder.offers.controller.ressa`]?.actorId===S.client,
            'The supply client needs its real independent owner, purse and finite detour means.');
        const accepted=supply.receipts.some(t=>t.to==='accepted'),delivered=supply.phase==='delivered',escrow=supply.phase==='accepted'?S.price:0;
        assert(a.resources.money===(delivered||escrow?0:S.price)&&(a.resources.supply_escrow||0)===escrow&&a.resources.kit_need===(delivered?0:1)&&
            (s.owners[S.client]?.[K.kit]||0)===(delivered?1:0)+extra.kit,'The finite purse, reserved funds, need and transferred kit are not conserved.');
        assert(accepted===!!s.claims['remainder.offers.supply_acceptance']&&accepted===(complete(state,'player','remainder_offers.accept_supply')===1)&&
            delivered===(complete(state,'player','remainder_offers.deliver_supply')===1),'Supply phases need their actual acceptance and once delivery.');
        if(delivered)assert(supply.receipts.at(-1).at<supply.deadline&&s.knowledge.player?.['remainder.offers.supply.delivered']?.cause===supply.receipts.at(-1).cause,'Payment needs actual before-deadline kit delivery.');
        if(supply.phase==='expired')assert(supply.receipts.at(-1).at>=supply.deadline&&complete(state,S.client,`remainder_offers.expire_supply_${accepted?'accepted':'posted'}`)===1,'Expiry needs Ressa’s actual supported deadline response.');
        const detour=complete(state,S.client,'remainder_offers.detour'),detourJob=s.jobs.some(j=>j.actorId===S.client&&j.commandId==='remainder_offers.detour');
        assert(detour<=1&&a.resources.detour_effort===(detour||detourJob?0:1)&&(a.facts['remainder.offers.detourDone']===true)===(detour===1)&&
            (!s.knowledge.player?.['remainder.offers.supply.aftermath']||detour===1),'A later detour account needs the actual finite paid detour, with no new funds.');
    } else assert(!state.actors[S.client]&&!s.people[S.client]&&!s.claims['remainder.offers.supply_occurrence'],'No client, purse or need may precede the explicit report.');
}

// Root runs this only on staged commands/cancellation/time publications. It
// records executed work; it never chooses an NPC action or creates stock.
export function advanceRemainderOffers(before,out,registry) {
    const state=out.state,r=moduleRecord(state),o=r?.solicitation;
    if(!o)return;
    const chosen=profiles.find(p=>complete(state,'player',`remainder_offers.hire_${p.profile}`)>complete(before,'player',`remainder_offers.hire_${p.profile}`));
    if(o.status==='preparing'&&!state.simulation.jobs.some(j=>j.id===o.cause)) {
        if(complete(state,'player','remainder_offers.solicit'))o.status='open';
        else {o.status='cancelled';o.closed={cause:`cancel:${state.sequence}`,at:state.clock,sequence:state.sequence};for(const c of o.candidates)c.disposition='declined';}
    }
    if(chosen&&o.status==='open') {
        assert(o.status==='open'&&!o.choice,'Only one retained candidate may be commissioned.');
        const evidence=state.simulation.knowledge[chosen.id]['remainder.offers.funding'];
        o.status='selected';o.choice={candidateId:chosen.id,cause:evidence.cause,at:evidence.at,sequence:Number(evidence.cause.slice('simulation:'.length))};
        for(const c of o.candidates)c.disposition=c.id===chosen.id?'selected':'declined';
    }
    if(o.status==='open'&&complete(state,'player','remainder_offers.decline_all')>complete(before,'player','remainder_offers.decline_all')) {
        assert(o.status==='open'&&!o.choice,'The retained roster is already closed.');o.status='declined';
        const evidence=state.simulation.knowledge.player['remainder.offers.declined'];
        o.closed={cause:evidence.cause,at:evidence.at,sequence:Number(evidence.cause.slice('simulation:'.length))};for(const c of o.candidates)c.disposition='declined';
    }
}

export function frozenRemainderOffersRegistry(state,registry) {
    const roster=moduleRecord(state)?.solicitation;if(!roster)return registry;
    const commands=new Map(registry.simulation.commands);
    for(const candidate of roster.candidates) {
        const id=`remainder_offers.hire_${candidate.profile}`,d=commands.get(id);if(!d)continue;
        const definition=copy(d);
        definition.effects=definition.effects.map(e=>e.type==='spawn'?{...e,personId:candidate.id,template:copy(candidate.template)}:e);
        commands.set(id,definition);
    }
    return {...registry,simulation:{...registry.simulation,commands}};
}
