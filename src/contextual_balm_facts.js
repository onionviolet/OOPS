// Pure read of the actual supported native body, existing body condition,
// carried item, custody/equipment and current native effect frame.
import {CONTEXTUAL_BALM_IDS as I, CONTEXTUAL_BALM_DEFINITIONS as D} from './contextual_balm_content.js';

const natural = n => Number.isSafeInteger(n) && n >= 0;
const active = (state,id) => {
    const c=state.simulation?.conditions?.player?.[id];
    return !!c && c.intensity>0 && (c.expiresAt==null || c.expiresAt>state.clock);
};
const itemKey = JSON.stringify({id:I.itemId});

export function contextualBalmAvailableCount(state,context={}) {
    const p=state.simulation?.people?.player;
    const stock=context.gameplay?.player?.inventory;
    const count=stock?.[itemKey];
    if(p?.inventory!=='native' || !natural(count)) return 0;
    if(Object.values(state.simulation?.custody||{}).some(c=>c.holder==='player'&&c.key===itemKey) ||
        Object.values(context.equipment?.player||{}).includes(itemKey) ||
        Object.values(state.simulation?.equipment?.player||{}).includes(itemKey)) return 0;
    return count;
}

export function contextualBalmFacts(state,context={}) {
    const p=state.simulation?.people?.player, b=p?.body?.id&&p?.body?.form?p.body:context.nativeBody;
    const location=context.facts?.location;
    const currentEffectFrame=context.nativeCareFrame;
    const body=!!b && context.nativeAlive===true && String(b.form).toLowerCase()==='human' &&
        b.id==='native.player.body' && b.ownerId==='player' && b.controllerId==='player' &&
        b.hands>=2 && b.mobile===true && p?.life==='alive' && p?.inventory==='native';
    const effectElapsed=currentEffectFrame && natural(currentEffectFrame.clock) && currentEffectFrame.clock<=state.clock
        ? state.clock-currentEffectFrame.clock : 0;
    const scraped=active(state,'body.scraped_hands');
    const effectDuration=currentEffectFrame?.effects?.[I.effectId]?.duration;
    const balmCount=contextualBalmAvailableCount(state,context);
    return {
        'contextualBalm.supportedBody':body,
        'contextualBalm.safePlace':state.actors?.player?.worldId===I.location && ['Village','Shack'].includes(location) && currentEffectFrame?.battleRunning===false,
        'contextualBalm.scraped':scraped,
        'contextualBalm.sore':active(state,'body.sore_hands'),
        'contextualBalm.balmAvailableCount':balmCount,
        'contextualBalm.hasBalm':balmCount>=1,
        'contextualBalm.currentWeakBalmDuration':Number.isFinite(effectDuration)?Math.max(0,effectDuration-effectElapsed):0,
        'contextualBalm.lastTreatment':state.simulation?.knowledge?.player?.[I.receipt]||null,
    };
}

export function contextualBalmContext(state,context={}) {
    return {...context,facts:{...context.facts,...contextualBalmFacts(state,context)}};
}

export function validateContextualBalmState(state,registry) {
    const actors=state.actors||{},s=state.simulation;
    if(!s) return;
    const own=actors.player, ownFacts=own?.facts||{}, ownDone=own?.completed||{};
    const allNamespaced=(record,prefix)=>Object.keys(record||{}).filter(k=>k.startsWith(prefix));
    const ownFactsUsed=allNamespaced(ownFacts,I.prefix), ownDoneUsed=allNamespaced(ownDone,I.prefix);
    const ownKnowledge=s.knowledge?.player||{}, ownKnowledgeUsed=allNamespaced(ownKnowledge,I.prefix);
    const jobs=(s.jobs||[]).filter(j=>String(j.commandId||'').startsWith(I.prefix));
    const foreignFacts=Object.entries(actors).filter(([id])=>id!=='player').some(([,a])=>
        allNamespaced(a?.facts,I.prefix).length||allNamespaced(a?.completed,I.prefix).length);
    const foreignKnowledge=Object.entries(s.knowledge||{}).filter(([id])=>id!=='player').some(([,r])=>allNamespaced(r,I.prefix).length);
    const copiedConditions=Object.entries(s.conditions||{}).some(([,r])=>allNamespaced(r,I.prefix).length);
    const copiedRoutines=Object.values(s.programs||{}).some(p=>String(p?.commandId||'').startsWith(I.prefix));
    const copiedSessions=Object.values(s.sessions||{}).some(session=>String(session?.commandId||'').startsWith(I.prefix));
    const copiedPeople=Object.values(s.people||{}).some(person=>allNamespaced(person?.facts,I.prefix).length||allNamespaced(person?.completed,I.prefix).length);
    const used=ownFactsUsed.length||ownDoneUsed.length||ownKnowledgeUsed.length||jobs.length||foreignFacts||foreignKnowledge||copiedConditions||copiedRoutines||copiedSessions||copiedPeople;
    if(!used) return;
    if(foreignFacts||foreignKnowledge||copiedConditions||copiedRoutines||copiedSessions||copiedPeople) throw new Error('Contextual balm records belong only to the current player.');
    if(ownFactsUsed.some(k=>k!==I.version)||ownDoneUsed.some(k=>k!==I.dress)||ownKnowledgeUsed.some(k=>k!==I.receipt))
        throw new Error('Unknown contextual balm record.');
    const version=ownFacts[I.version],completed=ownDone[I.dress]||0,receipt=ownKnowledge[I.receipt];
    if(jobs.length>1) throw new Error('Only one current contextual balm job is supported.');
    const def=D.commands[0];
    if(registry&&JSON.stringify(registry.simulation?.commands?.get(I.dress))!==JSON.stringify(def))
        throw new Error('Unsupported current contextual Healing balm definition.');
    if(def&&(def.revision!==1||def.group!==I.group||def.duration!==1||def.actorId!=='player'||def.cancellation!=='refund'||def.reservationReturns!==1||JSON.stringify(def.costs)!==JSON.stringify([{type:'item',key:itemKey,amount:-1}]))) throw new Error('Unsupported contextual Healing balm definition.');
    for(const j of jobs) {
        const match=/^simulation:([1-9][0-9]*)$/.exec(j.id||''),seq=match?Number(match[1]):0;
        const location=j.completionSupport?.location;
        if(j.commandId!==I.dress||j.actorId!=='player'||j.targetId!=null||j.revision!==1||!natural(j.sequence)||seq!==j.sequence||seq>state.sequence||
            !natural(j.due)||j.due<=state.clock||j.due>state.clock+1||j.cancellation!=='refund'||j.reservationReturns!==1||
            j.claim!=null||j.siteId!=null||JSON.stringify(j.participants)!==JSON.stringify(['player'])||
            !['Village','Shack'].includes(location)||j.completionSupport?.schema!==1||j.completionSupport?.coLocated!==false||
            j.completionSupport?.failure!=='refund'||!def||JSON.stringify(j.completionSupport.requires)!==JSON.stringify(def.completionRequires)||
            JSON.stringify(j.costs)!==JSON.stringify(def.costs)||JSON.stringify(j.effects)!==JSON.stringify(def.effects))
            throw new Error('Invalid reserved Healing balm job.');
    }
    if(completed===0&&version==null&&!receipt&&jobs.length===1) return;
    const recMatch=/^simulation:([1-9][0-9]*)$/.exec(receipt?.cause||''),receiptSequence=recMatch?Number(recMatch[1]):0;
    const expectedValue=def?.effects?.find(e=>e.type==='knowledge'&&e.key===I.receipt)?.value;
    if(version!==1||!natural(completed)||completed<1||!receipt||receipt.stage!=='understood'||receipt.value!==expectedValue||
        Object.keys(receipt).sort().join(',')!=='at,cause,stage,value'||!natural(receipt.at)||receipt.at===0||receipt.at>state.clock||
        !receiptSequence||receiptSequence>state.sequence)
        throw new Error('Invalid contextual Healing balm receipt.');
}
