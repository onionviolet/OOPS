// Presentation only. Read retained truth without resolving, reserving or drawing.
import {INGREDIENTS,mixturePresentation} from './mixture_state.js';
import {projectKnownActionRequirements} from './action_legibility.js';
import {blockedIngredients} from './mixture_native.js';
// Free stock excludes keys the native disposition owner holds elsewhere (K2).
const stock=(frame,id)=>blockedIngredients(frame.expansion)[id]?0:frame.inventory?.[JSON.stringify({id})]?.count??0;
const amounts=inputs=>Object.entries(inputs??{}).map(([id,n])=>`${n} ${id}`).join(', ');
export function mixtureFailureText(message) {
    const shortage=INGREDIENTS.find(i=>message===`Shortage: ${i.id}.`);
    if(shortage)return `Not enough ${shortage.id}. Review current stock.`;
    const held=INGREDIENTS.find(i=>message===`Held elsewhere: ${i.id}.`);
    if(held)return `${held.id} is borrowed or committed elsewhere. Return or release it first.`;
    return ({
        'Mix quote changed. Review the current quote.':'Quote changed. Review the current quote before mixing.',
        'One mixing vessel is already occupied.':'The mixing vessel is busy. Cancel or finish its batch first.',
        'Choose a learned method and 1–999 batches.':'Save an observed method and choose 1–999 batches.',
        'Observe a dose before saving a method.':'Drink a dose to observe it before saving the method.',
        'Law revision changed. Mix and observe the current method before repeating.':'This method has changed. Mix and observe the current method before repeating.',
        'Not enough coins.':'Not enough coins for this purchase.',
        'Use water and at least one plant ingredient.':'Choose Spring water and at least one plant ingredient.',
        'Use whole ingredient packs from 0 to 99.':'Choose whole packs from 0 to 99.',
        'Choose steep or boil.':'Choose steep or boil.',
        'Unsupported mixing method.':'Choose an available mixing method.',
    })[message]??"Can't mix right now";
}
export function projectMixtureFeedback({frame,owner,quote,queue,requirements}) {
    const product=quote?.product,inputs=product?.inputs??{};
    const materials=(selected,n=1,held={})=>Object.entries(selected??{}).map(([id,each])=>{
        const owned=stock(frame,id)+(held[id]??0),needed=each*n,missing=Math.max(0,needed-owned);
        return {id,each,needed,owned,after:owned-needed,missing,buyCoins:missing*(INGREDIENTS.find(i=>i.id===id)?.price??0)};
    });
    const describe=rows=>rows.map(r=>`${r.needed} ${r.id} (${r.owned} free, ${r.after<0?`short ${-r.after}`:`${r.after} left`})`).join('; ');
    const missing=selected=>materials(selected).filter(r=>r.missing).map(r=>`Next batch needs ${r.needed} ${r.id}; you have ${r.owned} (missing ${r.missing}).`).join(' ');
    const knownRequirements=projectKnownActionRequirements(requirements?.rule,requirements?.facts,requirements?.disclosure);
    const unmet=knownRequirements.filter(r=>r.met===false).map(r=>r.text).join(' ');
    const mixBlocker=quote?.error?mixtureFailureText(quote.error):!product?"Can't mix right now":!frame.ready?"Can't mix right now":missing(inputs)||unmet;
    const qp=owner?.products?.[queue?.product],count=queue?.count??3;
    let queueBlocker=!frame.ready?"Can't mix right now":owner?.job?'The mixing vessel is busy. Cancel or finish its batch first.':!qp||!owner?.methods?.[qp.id]?'Save an observed method before queuing.':!Number.isSafeInteger(count)||count<1||count>999?'Choose 1–999 batches.':queue?.error?mixtureFailureText(queue.error):missing(qp.inputs)||unmet;
    const rows=materials(inputs),cost=rows.reduce((n,r)=>n+r.buyCoins,0);
    const queueRows=qp&&Number.isSafeInteger(count)&&count>=1&&count<=999?materials(qp.inputs,count,owner?.job?.product===qp.id?owner.job.held:{}):[];
    const queueCost=queueRows.reduce((n,r)=>n+r.buyCoins,0);
    const holds={materials:rows,buyCoins:cost,queueMaterials:queueRows,queueBuyCoins:queueCost,
        text:product?`Vial: ${describe(rows)}. Buy missing: ${cost} coins; purse ${frame.money}. No mixing fee.`:'Next vial: unavailable until the selection is valid.'};
    if(queueRows.length)holds.text+=` Queue ${count} totals: ${queueRows.map(r=>`${r.needed} ${r.id} (${r.after<0?`short ${-r.after}`:`${r.after} left`})`).join('; ')}. Buy missing: ${queueCost} coins. One batch held at a time.${owner?.job?.product===qp.id?' Totals include held.':''}`;
    const job=owner?.job,left=job?Math.max(0,job.due-frame.clock):0;
    const work={minutesLeft:job?left:null,batches:job?.remaining??0,minutesPerBatch:3,totalMinutes:job?left+3*(job.remaining-1):0,
        text:job?`${left} game minutes left; ${job.remaining} batches incl. current; 3 minutes/batch; ${left+3*(job.remaining-1)} minutes total if supplied. Held: ${amounts(job.held)}.`:
            `${Object.keys(owner?.methods??{}).length?'Queue finished or stopped.':'No queued work.'} 3 game minutes/batch; mix one vial is immediate.${qp?` Current reason: ${queueBlocker||'Next batch can start now.'}`:''}`};
    // Acquisition records are first-type appearance receipts, not completion history.
    // Never present the last such receipt as the latest completed batch.
    const receipt=Object.values(owner?.acquisitions??{}).reduce((last,r)=>!last||r.sequence>last.sequence?r:last,null);
    const retained=receipt&&owner.products?.[receipt.product];
    const lastResult={product:null,consumed:null,at:null,text:'Latest finished mix: unavailable. Consumed inputs and completion time: unavailable.'};
    const done=owner?.lastCompletion,made=done&&owner.products?.[done.product];
    if(made){
        const after={single:'Single vial; no queue involved.','next reserved':'Next queued batch reserved from current stock.','queue finished':'Queue finished.',
            'repeat stopped':`Queue stopped: ${done.stopReason?mixtureFailureText(done.stopReason):'review the current reason.'}`}[done.outcome];
        Object.assign(lastResult,{product:made.id,consumed:structuredClone(done.consumed),at:done.at,kind:done.kind,outcome:done.outcome,
            text:`Latest finished mix: ${mixturePresentation(owner,made).name}${Number.isSafeInteger(frame.clock)?`, ${Math.max(0,frame.clock-done.at)} game min ago`:''}. Consumed: ${amounts(done.consumed)}. Made: 1 vial. ${after}`});
    }else if(retained&&receipt.sequence===owner.sequence){lastResult.product=retained.id;lastResult.at=receipt.at;lastResult.text=`Latest finished mix: ${mixturePresentation(owner,retained).name} at game minute ${receipt.at}. Consumed inputs: unavailable.`;}
    return {holds,blocker:{mix:mixBlocker||null,queue:queueBlocker||null,requirements:knownRequirements,
        text:`Mix: ${mixBlocker||'Ready.'} Queue: ${queueBlocker||'Ready.'}`},work,lastResult};
}
