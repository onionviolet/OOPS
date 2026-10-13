// Pure cross-chapter views. Native/world truth is used for lawful support;
// player-facing accounts come only from performed or received knowledge.
import {lorePracticeFacts} from './lore_practice_facts.js';
import {worldCompletionEnrolled,worldCompletionLifeFacts} from './world_completion_life_facts.js';
import {REMAINDER_CONSEQUENCES_IDS as C} from './audit_remainder_consequences_content.js';
import {REMAINDER_HOME_IDS as H} from './audit_remainder_home_content.js';
import {worldCompletionLearningStripEvidence,worldCompletionLearningStripMatches} from './world_completion_learning_runtime.js';
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const seq=c=>/^simulation:[1-9][0-9]*$/.test(c||'');
export function worldCompletionBridgeFacts(state,context={}){
    const s=state.simulation,a=state.actors?.player,w=state.worlds?.['base.frontier']?.facts||{},known=s?.knowledge?.player||{};
    const common=worldCompletionLifeFacts(state,context),local=common['worldCompletion.local'],active=worldCompletionEnrolled(state);
    const lore=lorePracticeFacts(state,context),sample=known['lore.warning.sample'];
    // This datum belongs to the player's performed observation and measurement.
    // A learner's own position still gates their trip, bench and work separately.
    const observerLore=lorePracticeFacts(state,{...context,actorId:'player',facts:{...context.facts,location:s?.people?.player?.location}});
    const current=active&&observerLore['lore.warning.currentSample']===true&&sample?.stage==='seen'&&
        sample.basis?.attributedTo==='player'&&sample.basis.situationId==='lore.warning.rain'&&seq(sample.cause)&&natural(sample.at);
    const measurement=known['world.completion.lens.measurement'],p='world.completion.lens.';
    const measured=current&&measurement?.stage==='seen'&&measurement.basis?.sampleCause===sample.cause&&
        a.facts[p+'sampleCause']===sample.cause&&a.facts[p+'measurementCause']===measurement.cause&&a.facts[p+'measurementAt']===measurement.at&&
        a.facts[p+'measurementCommand']===measurement.basis.commandId&&(a.completed[measurement.basis.commandId]||0)>0&&
        seq(measurement.cause)&&natural(measurement.at)&&measurement.at<=state.clock;
    const drain=s?.sites?.['lore.warning.notch'],rain=s?.situations?.['lore.warning.rain'],shift=s?.situations?.['lore.work.shift'];
    const knownNotch=!!sample&&sample.basis?.situationId==='lore.warning.rain'&&sample.basis.attributedTo==='player';
    const notchRight=active&&!!rain&&drain?.owner==='player'&&drain.capacity===1;
    const outstanding=['lore.work.neriEscrow','lore.work.orrEscrow','lore.warning.relayEscrow','lore.warning.workEscrow','world.completion.learning.escrow']
        .some(key=>Object.values(state.actors||{}).some(actor=>(actor.resources?.[key]||0)>0));
    const learning='world.completion.learning.',neriDone=state.actors?.[H.resident]?.completed||{};
    const sponsorshipSettled=!(a?.completed?.[learning+'sponsor']===1)||
        ((w[learning+'response']==='withdrawn'||w[learning+'response']==='collected'||w[learning+'released']===true)&&
            (!neriDone[learning+'walk_to_bench']||neriDone[learning+'return_home']===1));
    const shiftClosed=!shift||['delivered','late','declined','withdrawn'].includes(shift.phase);
    const rainClosed=!!rain&&w['lore.warning.rainOccurred']===true;
    const crop=s?.situations?.[C.plot],cropClosed=!crop||['covered','early','neglected','expired'].includes(crop.phase);
    const rainAccount=known['lore.warning.account'];
    const accountObserved=!!rainAccount&&natural(w['lore.warning.rainAt'])&&rainAccount.at>=w['lore.warning.rainAt']&&
        rainAccount.basis?.attributedTo==='remainder.offers.ressa'&&rainAccount.basis.situationId==='lore.warning.rain';
    const roomRight=lore['lore.work.roomRight']===true&&w['lore.work.shutterRepaired']===true;
    const projected={...common,'worldCompletion.sampleCause':current?sample.cause:null,'worldCompletion.sampleAt':current?sample.at:null,
        'worldCompletion.currentSample':current,'worldCompletion.measuredSample':!!measured,'worldCompletion.measuredCause':measured?measurement.cause:null,
        'worldCompletion.roomPermission':roomRight,'worldCompletion.dryRoom':roomRight&&context.facts?.location==='Shack',
        'worldCompletion.rainActive':!!rain&&context.facts?.['weather.raining']===true,
        'worldCompletion.rainOccurred':w['lore.warning.rainOccurred']===true,'worldCompletion.rainDeadline':rain?.deadline??null,
        'worldCompletion.beforeRain':!!rain&&w['lore.warning.rainOccurred']!==true&&state.clock<rain.deadline,
        'worldCompletion.drainOpen':w['lore.warning.drainOpen']===true,'worldCompletion.notchLocation':'Village','worldCompletion.notchSiteId':'lore.warning.notch',
        'worldCompletion.notchInspected':active&&knownNotch,'worldCompletion.notchRight':notchRight,
        'worldCompletion.notchSupported':local&&notchRight&&context.facts?.location==='Village'&&lore['lore.playerHands']===true,
        'worldCompletion.localChapterClosed':active&&shiftClosed&&rainClosed&&cropClosed&&!outstanding&&sponsorshipSettled,
        'worldCompletion.accountObserved':active&&accountObserved,
        'worldCompletion.obligationsFree':common['worldCompletion.obligationsFree']&&!outstanding&&sponsorshipSettled,
        'worldCompletion.roomSiteId':H.workshop};
    const bound={...context,facts:{...context.facts,...projected}},strip=worldCompletionLearningStripEvidence(state,bound);
    const matching=!!strip&&worldCompletionLearningStripMatches(state,bound);
    return {...projected,'worldCompletion.measuredStrip':matching,'worldCompletion.measuredStripKey':matching?strip.key:null};
}
export function worldCompletionBridgeContext(state,context={}){
    return {...context,facts:{...context.facts,...worldCompletionBridgeFacts(state,context)}};
}
export function worldCompletionDrainEffects(state,context={},operation='discard'){
    const f=worldCompletionBridgeFacts(state,context);
    if(!f['worldCompletion.enrolled']||!f['worldCompletion.notchSupported']||!f['worldCompletion.notchInspected'])
        throw new Error('Change only the actually inspected and permitted local notch.');
    const open=operation==='loaded'||operation==='measured';
    if(!['discard','loaded','measured'].includes(operation))throw new Error('Unsupported local drain operation.');
    return [{type:'world',worldId:'base.frontier',key:'lore.warning.drainOpen',value:open},
        {type:'world',worldId:'base.frontier',key:'lore.warning.obstructionCause',value:open?`cleared_with_${operation}`:'discarded_actual_green_offcuts'}];
}
