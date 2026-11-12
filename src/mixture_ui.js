let currentPanel;
export function openMixtureCounter(){return currentPanel?.open()??false;}
import {centerModes} from './center_modes.js';
import {projectMixtureFeedback,mixtureFailureText} from './mixture_feedback.js';
import {projectMixtureDestinations,MIXTURE_DESTINATIONS} from './mixture_destinations.js';
import {quoteMixtureAction} from './mixture_native.js';
import {RESPONSIVE_METHOD} from './mixture_rules.js';
import {projectMixtureDiscovery,describeSelectedPlantReadings,describeVial} from './mixture_discovery.js';
import {INGREDIENTS,getMixtureOwner,createMixtureState,mixturePresentation,mixtureKey} from './mixture_state.js';
export function createMixturePanel({craftingContainer,actionContainer,read,act}){
    const launch=document.createElement('button');launch.id='village_mixing_open';launch.textContent='Mix at the Village counter';actionContainer.append(launch);
    const panel=document.createElement('section');panel.id='village_mixing_panel';
    craftingContainer.before(panel);
    // Round 8 (PF4, PF11, PF15): the centre header names the counter; the panel opens on one narrator line.
    const help=document.createElement('p');help.className='mixture-intro';help.textContent='Bundles of plants and a jug of spring water. I wonder what I could make here.';panel.append(help);
    const learned=document.createElement('section');learned.id='mixture_discovery';learned.className='mixture-discovery';
    const rows=document.createElement('div');rows.className='mixture-ingredients';panel.append(rows);
    const amounts={};const stockLabels={};
    const notice=document.createElement('p');notice.id='mixture_notice';notice.setAttribute('role','status');
    let lastFailure=null,lastQueueFailure=null,lastSafeNotice='',queueChoice=null;
    const queueCounts=new Map();
    const run=request=>{try{const result=act(request);lastFailure=null;lastQueueFailure=null;if(request.type==='repeat')queueCounts.delete(request.product);const completion=getMixtureOwner()?.lastCompletion;
        notice.textContent=request.type==='advance'&&completion?.outcome==='repeat stopped'?`Batch completed. Repeat stopped. ${mixtureFailureText(completion.stopReason)}`:result?.message||'No change.';
        lastSafeNotice=notice.textContent;render();}catch(error){lastFailure=request.type==='mix'?error.message:null;lastQueueFailure=request.type==='repeat'?error.message:null;const message=mixtureFailureText(error.message);notice.textContent=message+(message==="Can't mix right now"&&lastSafeNotice?` · Last notice: ${lastSafeNotice}`:'');updateFeedback();}};
    for(const i of INGREDIENTS){const row=document.createElement('label');row.className='mixture-ingredient';const name=document.createElement('span');name.textContent=i.id+' ';row.append(name);
        const input=document.createElement('input');input.type='number';input.min=0;input.max=99;input.step=1;input.value=['River bellleaf','Spring water'].includes(i.id)?1:0;input.id='mixture_amount_'+i.id.replaceAll(' ','_');input.style.width='50px';input.oninput=()=>{lastFailure=null;preview();};row.append(input);amounts[i.id]=input;
        const stock=document.createElement('span');stock.className='mixture-have';stockLabels[i.id]=stock;row.append(stock);const buy=document.createElement('button');buy.type='button';buy.className='mixture-buy';buy.textContent=`Buy · ${i.price} coins`;buy.setAttribute('aria-label',`Buy one pack of ${i.id} for ${i.price} coins`);buy.onclick=()=>run({type:'buy',id:i.id});row.append(buy);name.title=i.route;rows.append(row);}
    const controls=document.createElement('div');controls.className='mixture-controls';panel.append(controls);
    const methods=document.createElement('details');methods.className='mixture-details';
    const methodSummary=document.createElement('summary');
    const method=document.createElement('select');method.id='mixture_method';method.setAttribute('aria-label','Mixing method');
    for(const [value,label]of [['ordinary@1','Ordinary method'],[RESPONSIVE_METHOD,'Responsive method']]){const option=document.createElement('option');option.value=value;option.textContent=label;method.append(option);}
    method.value='ordinary@1';method.onchange=()=>{lastFailure=null;preview();};methods.append(methodSummary,method);controls.append(methods);
    const process=document.createElement('select');process.id='mixture_process';for(const kind of ['steep','boil']){const option=document.createElement('option');option.value=kind;option.textContent=kind==='steep'?'Steep':'Boil';process.append(option);}process.onchange=()=>{lastFailure=null;preview();};controls.append(process);
    const mix=document.createElement('button');mix.id='mixture_craft';mix.textContent='Mix one vial · instant';mix.onclick=()=>run({type:'mix',...selection(),quote:currentQuote});controls.append(mix);

    const status=document.createElement('p');status.id='mixture_status';status.className='mixture-status';panel.append(status,notice);
    const prediction=document.createElement('p');prediction.id='mixture_prediction';
    const ingredientEvidence=document.createElement('p');ingredientEvidence.id='mixture_ingredient_evidence';ingredientEvidence.hidden=true;
    panel.append(prediction,ingredientEvidence);
    const feedbackFold=document.createElement('details');feedbackFold.className='mixture-details';const feedbackSummary=document.createElement('summary');feedbackSummary.textContent='Stock, cost and last result';feedbackFold.append(feedbackSummary);
    const feedback=document.createElement('div');feedback.id='mixture_feedback';
    const workControls=document.createElement('div');let workCard=null;
    const feedbackNodes={};for(const [id,label]of [['holds','Holds and cost'],['blocker','Current blocker'],['work','Current work'],['lastResult','Last result']]){const card=document.createElement('div');card.className='mixture-feedback-row';const heading=document.createElement('strong');heading.textContent=label;const body=document.createElement('div');body.id='mixture_feedback_'+id;card.append(heading,body);if(id==='work'){card.append(workControls);card.hidden=true;workCard=card;panel.append(card);}else feedback.append(card);feedbackNodes[id]=body;}feedbackFold.append(feedback);panel.append(feedbackFold);
    // K2: the same owned stock quoted into both real products, each with its own admission token.
    // The two cards are further cells of the existing two-column feedback grid, so they sit side by side.
    const compareStock=document.createElement('p');compareStock.id='mixture_destinations_stock';feedbackNodes.holds.parentElement.append(compareStock);
    const destinationCards=Object.fromEntries(MIXTURE_DESTINATIONS.map(process=>{const card=document.createElement('div');card.className='mixture-feedback-row';card.dataset.mixtureDestination=process;card.hidden=true;feedback.append(card);return [process,card];}));
    function renderDestinations(){const frame=read(),s=getMixtureOwner()??createMixtureState(frame.seed),{method,inputs}=selection();let data;try{data=projectMixtureDestinations({frame,owner:s,request:{method,inputs}});}catch(error){compareStock.textContent=mixtureFailureText(error.message);for(const c of Object.values(destinationCards))c.hidden=true;delete feedback.dataset.destinations;return;}
        const signature=JSON.stringify([data,frame.ready]);if(signature===feedback.dataset.destinations)return;feedback.dataset.destinations=signature;compareStock.textContent=data.text;
        for(const d of data.destinations){const card=destinationCards[d.process];card.hidden=false;
            const head=document.createElement('strong');head.textContent=`${d.process==='steep'?'Steep':'Boil'} → ${d.name}`;const body=document.createElement('div');
            body.textContent=d.uses?`Uses ${d.uses.map(u=>`${u.need} ${u.id} (${u.free} free → ${u.after<0?`short ${u.short}`:`${u.after} left`})`).join('; ')}. Free stock makes ${d.vials} vial${d.vials===1?'':'s'}. ${d.description}`:d.error;
            const go=document.createElement('button');go.type='button';go.textContent=`Mix one vial: ${d.process} · instant`;go.disabled=!frame.ready||!d.token||!!d.error;go.title=d.error||'Commits only if this quote is still current.';
            go.onclick=()=>run({type:'mix',method,inputs,process:d.process,quote:d.token});card.replaceChildren(head,body,go);}}
    const output=document.createElement('div');output.id='mixture_products';panel.append(learned,output);
    let currentQuote;
    let discovery, discoveryOwner;
    function discoveryFor(owner){
        if(!discovery||discoveryOwner!==owner){discovery=projectMixtureDiscovery(owner);discoveryOwner=owner;}
        return discovery;
    }
    function selection(){return {method:method.value,inputs:Object.fromEntries(INGREDIENTS.map(i=>[i.id,Number(amounts[i.id].value)])),process:process.value};}
    function queueSelection(s){if(s?.job)return {product:s.job.product,count:s.job.remaining};const product=queueChoice&&s?.methods?.[queueChoice]?queueChoice:Object.keys(s?.methods??{}).at(-1);return {product,count:queueCounts.get(product)??3};}
    function updateFeedback(q){const frame=read(),s=getMixtureOwner();if(!q){try{q=quoteMixtureAction({...frame,owner:s,request:selection()});}catch(error){q={error:error.message};}}
        const queue={...queueSelection(s),...(lastQueueFailure?{error:lastQueueFailure}:{})},p=s?.products?.[queue.product];
        if(p?.revision===2){try{const current=quoteMixtureAction({...frame,owner:s,request:{inputs:p.inputs,process:p.process,method:RESPONSIVE_METHOD}});if(current.product.id!==p.id)queue.error='Law revision changed. Mix and observe the current method before repeating.';}catch(error){queue.error=error.message;}}
        const data=projectMixtureFeedback({frame,owner:s,quote:lastFailure?{...q,error:lastFailure}:q,queue});
        for(const [id,node]of Object.entries(feedbackNodes))node.textContent=data[id].text;
        // The work card shows only while a batch runs; otherwise the plain status line says what Mix needs.
        if(workCard)workCard.hidden=!s?.job;
        const short=(data.holds.materials||[]).filter(r=>r.missing);
        const unavailable=lastFailure||q.error||!frame.ready;
        const shortage=short.length?`Missing ${short.map(r=>`${r.missing} ${r.id}`).join(' and ')}${data.holds.buyCoins?`; buying ${short.length===1?'it':'them'} costs ${data.holds.buyCoins} coins`:''}.`:'';
        const message=unavailable?data.blocker.mix:shortage||data.blocker.mix;
        if(status.textContent!==(message??''))status.textContent=message??'';
    }
    function preview(){
        const methodLabel=method.value===RESPONSIVE_METHOD?'Responsive method':'Ordinary method';
        if(methodSummary.textContent!==methodLabel)methodSummary.textContent=methodLabel;
        const frame=read(),owner=getMixtureOwner(),request=selection();
        let q, description='', evidence='';
        try {
            q=quoteMixtureAction({...frame,owner,request});
            description=mixturePresentation(owner,q.product).description;
            if(!owner?.knowledge?.[q.product.id]?.observed){
                const revision=request.method===RESPONSIVE_METHOD?2:1;
                evidence=describeSelectedPlantReadings(discoveryFor(owner),{...request,revision});
            }
        } catch(error){q={error:error.message};}
        currentQuote=q.token??null;
        if(prediction.textContent!==description)prediction.textContent=description;
        if(ingredientEvidence.textContent!==evidence)ingredientEvidence.textContent=evidence;
        ingredientEvidence.hidden=!evidence;
        updateFeedback(q);renderDestinations();
    }
    // What each drunk vial taught, as an ingredient by effect table plus the next sensible try (derived, nothing saved).
    let discoverySignature;
    function renderDiscovery(s){
        const d=discoveryFor(s),last=s?.products?.[s.lastObservation];
        const signature=JSON.stringify([d,last?.id]);
        if(signature===discoverySignature)return;
        discoverySignature=signature;
        const table=document.createElement('table');table.className='mixture-discovery-table';
        const tried=d.rows.filter(row=>row.cells.some(c=>c.state!=='unknown')),untried=d.rows.filter(row=>!tried.includes(row));
        const head=document.createElement('tr'),corner=document.createElement('th');corner.textContent='Ingredient';head.append(corner);
        for(const e of d.effects){const th=document.createElement('th');th.textContent=e.label;head.append(th);}table.append(head);
        for(const row of tried){const tr=document.createElement('tr');tr.dataset.ingredient=row.id;tr.dataset.state=row.state;const name=document.createElement('th');name.textContent=row.id;tr.append(name);
            for(const c of row.cells){
                const td=document.createElement('td');td.dataset.state=c.state;td.className='mixture-cell mixture-cell--'+c.state;
                const clue=document.createElement('details'),summary=document.createElement('summary'),note=document.createElement('small');
                const effect=d.effects.find(e=>e.id===c.effect).label;
                const label=c.state==='unknown'?'?':c.state==='guessed'?(c.word==='≈'?'Source unclear':`${c.word}?`):c.word;
                summary.textContent=label;
                summary.setAttribute('aria-label',`${row.id}, ${effect}: ${label==='?'?'not known yet':label}`);
                note.textContent=c.text;clue.append(summary,note);td.append(clue);tr.append(td);
            }
            table.append(tr);}
        const title=document.createElement('strong');title.textContent=tried.length?'What you know':'Nothing tasted yet.';table.title='Each word is the dose in a standard vial: one pack of the plant, one of water.';
        const untriedLine=document.createElement('p');untriedLine.className='mixture-untried';untriedLine.textContent=untried.length?`Untried: ${untried.map(r=>r.id).join(', ')}.`:'';untriedLine.hidden=!untried.length;
        const tryHelp=document.createElement('details');tryHelp.className='mixture-details';
        const trySummary=document.createElement('summary');trySummary.textContent='Worth a try';
        const next=document.createElement('p');next.id='mixture_next_try';next.textContent=d.suggestion.text;
        const set=document.createElement('button');set.id='mixture_next_set';set.type='button';set.textContent='Set up this try';
        set.onclick=()=>{for(const i of INGREDIENTS)amounts[i.id].value=d.suggestion.prefill.inputs[i.id]??0;process.value=d.suggestion.prefill.process;method.value=d.suggestion.prefill.method??'ordinary@1';lastFailure=null;render();};
        tryHelp.append(trySummary,next,set);
        const parts=[title,...(tried.length?[table]:[]),untriedLine,tryHelp];
        if(last&&s.knowledge[last.id]?.observed){
            const vial=describeVial(last),line=document.createElement('p');
            line.id='mixture_last_vial';
            const benefits=vial.benefits.length?vial.benefits.join(' and '):'no clear benefit';
            const side=vial.side.length?`, with ${vial.side.join(', ')}`:'';
            line.textContent=`Last vial you drank: ${benefits}${side}, ${vial.minutes} minutes.`;
            parts.unshift(line);
        }
        learned.replaceChildren();learned.append(...parts);learned.dataset.text=d.text;}
    let outputSignature=null, renderedOwner;
    function render(){const frame=read();launch.hidden=!frame.visible;mix.disabled=!frame.ready;for(const i of INGREDIENTS)stockLabels[i.id].textContent=`have ${frame.inventory[JSON.stringify({id:i.id})]?.count??0}`;preview();
        const s=getMixtureOwner();const signature=JSON.stringify([s?.sequence,Object.entries(frame.inventory).map(([k,v])=>[k,v.count]),frame.ready]);
        if(s===renderedOwner&&signature===outputSignature)return;renderedOwner=s;outputSignature=signature;renderDiscovery(s);output.replaceChildren();workControls.replaceChildren();if(!s)return;
        if(s.job){const cancel=document.createElement('button');cancel.id='mixture_cancel';cancel.textContent='Cancel and return held ingredients';cancel.onclick=()=>run({type:'cancel'});workControls.append(cancel);}
        for(const p of Object.values(s.products).reverse()){const key=mixtureKey(p),n=frame.inventory[key]?.count??0,known=!!s.knowledge[p.id];if(!n&&!known)continue;const line=document.createElement('div');line.dataset.mixtureProduct=key;
            const text=document.createElement('p');text.textContent=`${p.revision===2?'Responsive method · ':''}${mixturePresentation(s,p).name} (${n} owned). ${Object.entries(p.inputs).map(([id,n])=>`${n} ${id}`).join(', ')}. ${mixturePresentation(s,p).description}`;line.append(text);
            if(n){const use=document.createElement('button');use.textContent=known?'Drink one dose':'Experiment: drink one dose';use.onclick=()=>run({type:'use',key});line.append(use);}
            if(known&&!s.methods[p.id]){const learn=document.createElement('button');learn.textContent='Save observed method';learn.onclick=()=>run({type:'learn',product:p.id});line.append(learn);}
            if(s.methods[p.id]){const count=document.createElement('input');count.type='number';count.value=queueCounts.get(p.id)??3;count.min=1;count.max=999;count.setAttribute('aria-label','Repeat batch count');count.style.width='55px';count.oninput=()=>{lastQueueFailure=null;queueChoice=p.id;queueCounts.set(p.id,Number(count.value));updateFeedback();};line.append(count);const repeat=document.createElement('button');repeat.textContent='Queue learned method';repeat.disabled=!!s.job;repeat.onclick=()=>{queueChoice=p.id;run({type:'repeat',product:p.id,count:Number(count.value)});};line.append(repeat);}
            output.append(line);}
    }
    const open=()=>{if(!read().visible)return false;centerModes().open('mixing');render();return true;};
    currentPanel={open};launch.onclick=open;
    const interval=setInterval(()=>{const frame=read();if(!frame.visible&&centerModes().mode==='mixing')centerModes().close('mixing');if(frame.ready&&frame.visible&&getMixtureOwner()?.job?.due<=frame.clock)run({type:'advance'});if(panel.style.display!=='none')render();if(!launch.isConnected)actionContainer.append(launch);launch.hidden=!frame.visible;},500);
    render();return {render,destroy:()=>clearInterval(interval)};
}
