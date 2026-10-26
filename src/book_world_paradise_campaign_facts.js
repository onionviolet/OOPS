import {validateParadiseEcology} from './book_world_paradise_ecology.js';
// Pure admission facts and exact optional-state reader. Nothing initializes
// means on read, render, refresh or return; only actual commands grant effects.
import {PARADISE_IDS as P, PARADISE_LOCATIONS as L, PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {paradiseFacts} from './book_world_paradise_actions.js';
import {PARADISE_DRYING,readDryingKey,isBindableStave,validateParadiseDryingState,validDryingBindingCosts} from './book_world_paradise_drying.js';
import {PARADISE_ENVIRONMENT,validPreparationJob} from './book_world_paradise_environment_inputs.js';
import {PARADISE_CAMPAIGN_IDS as I, PARADISE_CAMPAIGN_WINDOW as W, paradiseCampaignDefinitions as D, paradiseCampaignWithdrawalEffects, paradiseCampaignPostRescueWithdrawalEffects} from './book_world_paradise_campaign_content.js';

const F=I.prefix, natural=n=>Number.isSafeInteger(n)&&n>=0, check=(v,message)=>{if(!v)throw Error(message);};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const matchesCause=(cause,state)=>{const m=/^(?:simulation|response):([1-9][0-9]*)$/.exec(cause||'');return !!m&&Number(m[1])<=state.sequence;};
export function paradiseCampaignEnrolled(state){
    const a=state.actors?.player;
    return a?.facts?.[F+'enrolled']===true&&(a.completed?.[F+'hub.begin']||0)+(a.completed?.[F+'goa.begin']||0)===1;
}
export function paradiseCampaignCondition(state,id,actor='player'){
    const c=state.simulation?.conditions?.[actor]?.[id];
    return c&&c.intensity>0&&(c.expiresAt==null||c.expiresAt>state.clock)?c:null;
}
function heldOwned(state,context,actor,key){
    const inventory=context.gameplay?.[actor]?.inventory||{},count=inventory[key]||0;
    const borrowed=Object.values(state.simulation?.custody||{}).some(c=>c.holder===actor&&(c.key===key||c.itemKey===key));
    const equipped=Object.values(context.equipment?.[actor]||{}).includes(key);
    return natural(count)&&!borrowed&&!equipped?count:0;
}
export function paradiseCampaignFacts(state,context={}){
    const oldFacts=paradiseFacts(state,context),s=state.simulation||{},a=state.actors?.player,goa=state.worlds?.[P.goa]?.facts||{};
    const enrolled=paradiseCampaignEnrolled(state),facts=a?.facts||{},actor=context.actorId||'player';
    const vitals=id=>context.vitals?.[id]||context.vitalsByActor?.[id]||s.people?.[id]?.vitals;
    const supported=oldFacts['paradise.playerSupported']===true&&state.bookWorldCampaign?.bodyPolicy==='same_native_body';
    const baseSource=a?.sources?.[P.method],baseFaculty=s.faculties?.player?.[P.method],basePower=s.powers?.player?.[P.method];
    const source=a?.sources?.[I.method],faculty=s.faculties?.player?.[I.method],power=s.powers?.player?.[I.method];
    const sourcePresent=!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&source.origin==='trained';
    const methodOwned=sourcePresent&&power?.owned===true;
    const active=methodOwned&&faculty?.awakened===true&&faculty.active===true&&!faculty.suppressed;
    const tender=[I.bruise,'book.care.load_strain','body.sore_hands','body.scraped_hands','field.care.open_cut'].some(id=>paradiseCampaignCondition(state,id));
    const ownTools=heldOwned(state,context,'player',K.kit)>=1&&heldOwned(state,context,'player',K.rope)>=1;
    const elapsed=oldFacts['paradise.goaElapsed'],h=s.people?.[P.hank],k=s.people?.[P.krieg],hank=vitals(P.hank),player=vitals('player');
    const onDuty=goa['book.goa.hank']==='on_duty'&&h?.life==='alive';
    const threat=state.actors?.[P.hank]?.facts?.[F+'endangered']===true;
    const gateScene=goa['book.goa.fire']==='burned'&&onDuty&&threat&&h?.location===L.gate&&k?.location===L.gate&&k.life==='alive'&&
        state.actors?.[P.krieg]?.facts?.[F+'gatePressure']===true;
    const attention=id=>(state.actors?.[id]?.resources?.['book.paradise.attention']||0)>0;
    const bench=facts[F+'bench']===true&&a?.completed?.[F+'hub.bench']===1&&s.sites?.[I.bench]?.owner==='player';
    const shelter=goa[F+'shelter']===true&&facts[F+'shelter']===true&&s.sites?.[I.shelter]?.owner==='player';
    const hankSheltered=goa['book.goa.hank']==='sheltered'&&h?.life==='alive';
    const outcome=goa[F+'rescueOutcome'];
    const result={
        'paradiseCampaign.supported':supported,'paradiseCampaign.enrolled':enrolled,
        'paradiseCampaign.hands':supported&&!tender,'paradiseCampaign.bench':bench,'paradiseCampaign.shelter':shelter,
        'paradiseCampaign.baseMethod':supported&&!!baseSource&&(baseSource.expiresAt==null||baseSource.expiresAt>state.clock)&&basePower?.owned===true&&
            baseFaculty?.awakened===true&&baseFaculty.active===true&&!baseFaculty.suppressed,
        'paradiseCampaign.ownTools':ownTools,'paradiseCampaign.methodOwned':methodOwned,'paradiseCampaign.methodFaculty':supported&&active,
        'paradiseCampaign.methodActive':supported&&active&&ownTools,
        'paradiseCampaign.methodResumable':supported&&methodOwned&&faculty?.awakened===true&&!faculty.suppressed,
        'paradiseCampaign.controlled':methodOwned&&power.mastery>=2,'paradiseCampaign.mastered':methodOwned&&power.mastery>=3,
        'paradiseCampaign.foundation':faculty?.development??0,
        'paradiseCampaign.practiceAvailable':methodOwned&&power.mastery<3,
        'paradiseCampaign.wrapped':!!paradiseCampaignCondition(state,I.guard),
        'paradiseCampaign.surveyed':facts[F+'gateSurvey']===true&&a?.completed?.[F+'goa.recon']===1&&s.knowledge?.player?.[F+'gate_survey']?.stage==='understood',
        'paradiseCampaign.gateInspectable':goa['book.goa.fire']==='planned'||goa['book.goa.fire']==='contained',
        'paradiseCampaign.gateOpen':['escape_route','breached'].includes(goa['book.goa.gate']),
        'paradiseCampaign.gateScenePresent':supported&&gateScene,
        'paradiseCampaign.gateKnown':facts[F+'gateKnown']===true&&a?.completed?.[F+'goa.observe_gate']===1&&!!s.knowledge?.player?.[F+'gate_notice'],
        'paradiseCampaign.rescueContact':supported&&gateScene&&oldFacts[`paradise.support.${P.hank}`]===true&&oldFacts[`paradise.support.${P.krieg}`]===true,
        'paradiseCampaign.rescueWindow':natural(elapsed)&&elapsed>=W.assembly&&elapsed<=W.deadline,
        'paradiseCampaign.rescueFinished':facts[F+'sceneClosed']===true||hankSheltered||h?.life==='dead',
        'paradiseCampaign.hankDanger':supported&&onDuty&&threat&&h?.location===L.gate&&goa['book.goa.fire']==='burned',
        'paradiseCampaign.sceneRescued':hankSheltered&&outcome==='rescued'&&state.actors?.[P.hank]?.facts?.[F+'rescued']===true,
        'paradiseCampaign.hankSheltered':supported&&hankSheltered&&oldFacts[`paradise.support.${P.hank}`]===true,
        'paradiseCampaign.hankNeedsCare':hankSheltered&&(!!paradiseCampaignCondition(state,I.smoke,P.hank)||!!paradiseCampaignCondition(state,I.bruise,P.hank)||
            Number.isFinite(hank?.health)&&hank.health<hank.max_health||Number.isFinite(hank?.stamina)&&hank.stamina<hank.max_stamina),
        'paradiseCampaign.hankWorkReady':supported&&hankSheltered&&oldFacts[`paradise.support.${P.hank}`]===true&&
            !paradiseCampaignCondition(state,I.smoke,P.hank)&&!paradiseCampaignCondition(state,I.bruise,P.hank)&&
            Number.isFinite(hank?.health)&&hank.health>3&&Number.isFinite(hank?.stamina)&&hank.stamina>=1,
        'paradiseCampaign.hankWorkSupported':supported&&hankSheltered&&oldFacts[`paradise.support.${P.hank}`]===true&&
            !paradiseCampaignCondition(state,I.smoke,P.hank)&&!paradiseCampaignCondition(state,I.bruise,P.hank)&&Number.isFinite(hank?.health)&&hank.health>3,
        'paradiseCampaign.hankAttention':attention(P.hank),
        'paradiseCampaign.canExpose':Number.isFinite(player?.health)&&player.health>4,
        'paradiseCampaign.canLift':Number.isFinite(player?.health)&&player.health>3&&Number.isFinite(hank?.health)&&hank.health>3,
        'paradiseCampaign.canHurry':Number.isFinite(player?.health)&&player.health>5&&Number.isFinite(hank?.health)&&hank.health>5,
        'paradiseCampaign.playerInjured':!!paradiseCampaignCondition(state,I.smoke)||!!paradiseCampaignCondition(state,I.bruise),
        'paradiseCampaign.oldArcClosed':goa['book.goa.arcClosed']===true,
        'paradiseCampaign.recoverableCache':goa['book.goa.fire']==='burned'&&goa['book.goa.cache']===true&&goa[F+'cacheRecovered']!==true&&
            ((a?.completed?.['book.paradise.cache_ordinary']||0)+(a?.completed?.['book.paradise.cache_braced']||0))===1,
        'paradiseCampaign.rescueAccountReady':['rescued','late'].includes(outcome)&&!!s.knowledge?.player?.[F+'scene_account']||
            ['earlier_shelter','earlier_loss','late'].includes(outcome)&&oldFacts['paradise.miaAccountReady']===true||outcome==='retreated'&&h?.life!=='alive'&&oldFacts['paradise.miaAccountReady']===true,
        'paradiseCampaign.returnedMature':supported&&a?.worldId===P.hub&&s.people?.player?.location===L.hub&&facts[F+'rescueAccount']===true&&
            shelter&&state.bookWorldCampaign?.visits?.some(v=>v.endpoint?.worldId===P.goa&&v.status==='ended'),
    };
    // Actor-specific private facts stay admission-only. A read never reports
    // the NPC purse, agenda, personal source or received knowledge to UI.
    result['paradiseCampaign.actorSupported']=oldFacts[`paradise.support.${actor}`]===true;
    result['paradiseDrying.rack']=!!s.people?.[PARADISE_DRYING.rack];
    result['paradiseDrying.dryCount']=Object.entries(context.gameplay?.player?.inventory||{}).reduce((n,[key,count])=>n+(isBindableStave(key)?count:0),0);
    return result;
}
export const paradiseCampaignContext=(state,context={})=>({...context,facts:{...context.facts,...paradiseFacts(state,context),...paradiseCampaignFacts(state,context)}});

export const PARADISE_CAMPAIGN_EFFECT_POLICY=Object.freeze({
    [I.smoke]:{duration:16,actors:['player',P.hank],stats:{perception:{multiplier:0.9},stamina_efficiency:{multiplier:0.9}}},
    [I.guard]:{duration:20,actors:['player'],stats:{}},
    [I.bruise]:{duration:18,actors:['player',P.hank],stats:{dexterity:{multiplier:0.9}}},
});
export function projectParadiseCampaignEffects(state,registry,context={},actor='player'){
    const p=state.simulation?.people?.player,b=p?.body,n=context.nativeBody||context.paradiseNative?.body,d=state.bookWorldCampaign,out={};
    const world=state.actors?.player?.worldId,visit=d?.visits?.find(v=>v.id===d.activeVisitId&&v.status==='active'&&v.actorId==='player');
    // The Hero callback intentionally binds only its actual native body. It
    // does not need the private shop/stock/purse admission frame to see injury.
    if(actor!=='player'||!paradiseCampaignEnrolled(state)||d?.bodyPolicy!=='same_native_body'||![P.hub,P.goa].includes(world)||visit?.endpoint?.worldId!==world||
        p?.life!=='alive'||p.inventory!=='native'||context.nativeAlive!==true||b?.id!=='native.player.body'||b.form!=='human'||b.ownerId!=='player'||
        b.controllerId!=='player'||b.hands<2||b.mobile!==true||n?.id!==b.id||n.form!==b.form||n.ownerId!==b.ownerId||n.controllerId!==b.controllerId||n.hands<2||n.mobile!==true)return out;
    for(const [id,policy]of Object.entries(PARADISE_CAMPAIGN_EFFECT_POLICY)){
        const c=paradiseCampaignCondition(state,id,actor),d=registry.simulation.conditions.get(id);
        if(!c||!d||!policy.actors.includes(actor))continue;
        const key='simulation:'+id;
        out[key]={id:key,name:d.label,duration:c.expiresAt-state.clock,description:d.bioDetail,
            effects:{stats:structuredClone(policy.stats),bonus_skill_levels:{},xp_multipliers:{}},
            tags:{effect:true,...(id===I.guard?{buff:true}:{debuff:true})},affected_by_travel:true};
    }
    return out;
}

// Admission gate affects only a new command quote. Frozen old jobs never call
// this gate at settlement and retain their original afterfire meaning.
export function paradiseCampaignExistingCommandGate(state,id){
    if(!paradiseCampaignEnrolled(state)||id!=='book.paradise.npc.hank_afterfire_death')return [];
    return ['The explicitly chosen extended branch uses Hank’s actual bounded gate danger and rescue outcome.'];
}

export function validateParadiseCampaignDepthState(state,registry){
    validateParadiseDryingState(state);validateParadiseEcology(state);
    const s=state.simulation,actors=['player',P.hank,P.krieg,P.mia,P.employee,P.porter],commands=new Map(D.commands.map(d=>[d.id,d]));
    const present=Object.values(state.actors||{}).some(a=>[a.facts,a.completed,a.resources,a.sources].some(v=>Object.keys(v||{}).some(k=>k.startsWith(F))))||
        Object.values(state.worlds||{}).some(w=>Object.keys(w.facts||{}).some(k=>k.startsWith(F)))||
        Object.values(s?.knowledge||{}).some(v=>Object.keys(v).some(k=>k.startsWith(F)))||Object.values(s?.conditions||{}).some(v=>Object.keys(v).some(k=>k.startsWith(F)))||
        (s?.jobs||[]).some(j=>j.commandId?.startsWith(F))||Object.keys(s?.controllers||{}).some(k=>k.startsWith(F));
    if(!present)return true;
    check(state.bookWorldCampaign?.schema===1&&[10,11].includes(state.schema)&&s&&paradiseCampaignEnrolled(state),
        'The extended source branch needs one deliberate enrollment and its original optional native/body owners.');
    const exactEffects=D.commands.flatMap(d=>d.effects||[]).concat(D.encounters.flatMap(e=>[...(e.settlement||[]),...e.turns.flatMap(t=>t.responses.flatMap(r=>r.effects||[]))]),paradiseCampaignWithdrawalEffects,paradiseCampaignPostRescueWithdrawalEffects);
    const factValues=(actor,key)=>exactEffects.filter(e=>e.type==='fact'&&e.scope==='actor'&&(e.actor||'player')===actor&&e.key===key).map(e=>e.value);
    const worldValues=key=>exactEffects.filter(e=>e.type==='world'&&e.worldId===P.goa&&e.key===key).map(e=>e.value);
    for(const [actor,a]of Object.entries(state.actors)){
        for(const [key,value]of Object.entries(a.facts||{}).filter(([k])=>k.startsWith(F)))check(actors.includes(actor)&&factValues(actor,key).includes(value),'Unsupported extended-branch exact fact/owner.');
        for(const [id,count]of Object.entries(a.completed||{}).filter(([k])=>k.startsWith(F)))check(commands.get(id)?.actorId===actor&&natural(count)&&count>0&&(!commands.get(id).once||count===1),'Invalid extended-branch completed work count/owner.');
        check(!Object.keys(a.resources||{}).some(k=>k.startsWith(F)),'The extended branch has no separate purse or refill resource.');
        for(const [id,source]of Object.entries(a.sources||{}).filter(([k])=>k.startsWith(F)))check(actor==='player'&&id===I.method&&source.origin==='trained'&&source.revision===1&&source.expiresAt==null&&matchesCause(source.receiptId,state),'This learned source needs its exact actual paid/self acquisition.');
        for(const [key,r]of Object.entries(s.knowledge?.[actor]||{}).filter(([k])=>k.startsWith(F))){
            const possible=exactEffects.filter(e=>e.type==='knowledge'&&(e.actor||'player')===actor&&e.key===key);
            check(possible.some(e=>e.stage===r.stage&&e.value===r.value&&same(e.basis,r.basis))&&natural(r.at)&&r.at<=state.clock&&matchesCause(r.cause,state),
                'Extended-branch knowledge needs an exact authored actual observation/received-instruction receipt.');
        }
        for(const [id,c]of Object.entries(s.conditions?.[actor]||{}).filter(([k])=>k.startsWith(F))){const policy=PARADISE_CAMPAIGN_EFFECT_POLICY[id];
            check(policy?.actors.includes(actor)&&c.intensity===1&&natural(c.expiresAt)&&c.expiresAt<=state.clock+policy.duration&&matchesCause(c.cause,state),
                'Extended-branch condition lost its exact body, duration or actual cause.');}
        check(!s.programs?.[actor]?.commandId?.startsWith(F),'This extended branch adds no automatic player routine.');
    }
    for(const [key,value]of Object.entries(state.worlds[P.goa].facts).filter(([k])=>k.startsWith(F)))check(worldValues(key).includes(value)||
        key===F+'rescueOutcome'&&['earlier_shelter','earlier_loss'].includes(value),'Unsupported extended-branch world consequence.');
    const player=state.actors.player,power=s.powers?.player?.[I.method];
    const learned=(player.completed[F+'hub.learn_paid']||0)+(player.completed[F+'hub.learn_self']||0);
    const rehearsals=[1,2].map(tier=>player.completed[F+'hub.foundation_'+tier]||0);
    check(rehearsals.every(n=>natural(n)&&n<=1)&&(!rehearsals[1]||rehearsals[0])&&(!rehearsals.some(Boolean)||learned===1),
        'Load-path planning needs its own ordered, once-completed rehearsals and learned line procedure.');
    check(learned<=1&&!!player.sources[I.method]===(learned===1)&&!!power===(learned===1),'Line procedure ownership requires one actual acquisition, without copied or double learning.');
    if(power){
        check(s.faculties?.player?.[I.method]?.development===rehearsals[0]+rehearsals[1],
            'Line-planning development must equal actual completed rehearsals, without duplicated foundation.');
        const instruction=s.knowledge.player?.[F+'line_instruction'];
        check(power.owned&&power.mastery>=0&&power.mastery<=4&&player.sources[I.method].receiptId===instruction?.cause,
            'This finite line mastery or source grant lost its actual paid/self instruction receipt.');
        const practice=(player.completed[F+'hub.practice']||0)+(player.completed[F+'goa.practice']||0);
        check(practice<=3&&power.mastery===practice+(player.facts[F+'lift']==='protected'?1:0),
            'Line mastery must equal actually completed personal practice and its one supported protected lift.');
    }
    for(const choices of [[F+'goa.rebuild_ordinary',F+'goa.rebuild_controlled'],D.commands.filter(d=>d.claim===F+'rescue_account').map(d=>d.id)])
        check(choices.reduce((n,id)=>n+(player.completed[id]||0),0)<=1,'An exclusive physical shelter/account cannot be completed twice under alternative IDs.');
    for(const job of (s.jobs||[]).filter(j=>j.commandId.startsWith(F))){const d=commands.get(job.commandId),participants=[d?.actorId,...(d?.participants||[]).map(id=>id==='$target'?d.targetId:id)];
        check(d&&d.duration>0&&job.revision===d.revision&&job.actorId===d.actorId&&job.targetId===(d.targetId||null)&&job.reservationReturns===1&&
            (d.id.startsWith(PARADISE_ENVIRONMENT.prefix)?validPreparationJob(job,d,state):(d.id===PARADISE_DRYING.prefix+'bind'?validDryingBindingCosts(job.costs,d):same(job.costs,d.costs))&&same(job.effects,d.effects))&&same(job.participants,[...new Set(participants)])&&job.cancellation==='refund'&&job.claim===(d.claim||null)&&
            job.siteId===(d.siteId||null)&&natural(job.due)&&job.due<=state.clock+d.duration&&same(job.completionSupport,{schema:1,requires:d.completionRequires,
                coLocated:!!d.completionCoLocated,location:d.location,failure:'refund'}),'Extended-branch reserved work differs from its exact authored body/inputs/support/refund definition.');
        if(registry)check(same(registry.simulation.commands.get(d.id),d),'The admitted extended-branch command definition changed.');
    }
    const session=s.sessions?.player;
    if(session?.commandId===F+'goa.rescue')check(session.definitionId===I.scene&&session.revision===1&&session.targetId===P.krieg&&session.lethal===false&&
        same(session.turns,D.encounters[0].turns)&&same(session.settlement,D.encounters[0].settlement)&&same(session.participants,['player',P.krieg,P.hank])&&
        session.claim===F+'gate_scene_claim'&&session.answers.every((id,index)=>D.encounters[0].turns[index].responses.some(r=>r.id===id)),
        'The bounded gate scene needs its exact frozen responses and independent physical participants.');
    for(const [id,claim]of Object.entries(s.claims||{}).filter(([id])=>id.startsWith(F))){const choices=D.commands.filter(d=>d.claim===id);
        check(choices.some(d=>claim.owner===d.actorId)&&['held','settled'].includes(claim.status)&&matchesCause(claim.cause,state)&&natural(claim.at)&&claim.at<=state.clock&&
            (claim.status==='held'?s.jobs.some(j=>j.claim===id&&j.id===claim.cause)||session?.claim===id&&session.id===claim.cause:
                choices.some(d=>state.actors[d.actorId].completed[d.id]===1)),
            'Extended-branch claims need their actual retained reservation or once completed intervention.');}
    const result=state.worlds[P.goa].facts[F+'rescueOutcome'];
    if(result==='rescued')check(state.worlds[P.goa].facts['book.goa.hank']==='sheltered'&&s.people[P.hank].life==='alive'&&state.actors[P.hank].facts[F+'rescued']===true,
        'A recorded rescue must retain Hank’s actual independent surviving body.');
    if(result==='late')check(s.people[P.hank].life==='dead'&&state.worlds[P.goa].facts['book.goa.hank']==='dead'&&state.actors[P.hank].completed[F+'npc.hank_late']===1,
        'A late outcome needs the actual committed lethal gate consequence.');
    if(result==='earlier_shelter')check(s.people[P.hank].life==='alive'&&state.worlds[P.goa].facts['book.goa.hank']==='sheltered'&&
        ['book.paradise.npc.hank_shelter_route','book.paradise.npc.hank_shelter_contained'].some(id=>state.actors[P.hank].completed[id]===1),
        'An unnecessary rescue must follow Hank’s actually completed earlier shelter.');
    if(result==='earlier_loss')check(s.people[P.hank].life==='dead'&&state.worlds[P.goa].facts['book.goa.hank']==='dead'&&state.actors[P.hank].completed['book.paradise.npc.hank_afterfire_death']===1,
        'An earlier loss retains the actually completed old consequence, never a new rescue failure.');
    return true;
}
