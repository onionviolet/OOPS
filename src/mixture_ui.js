import {INGREDIENTS,getMixtureOwner,createMixtureState,resolveMixture,mixturePresentation,mixtureKey} from './mixture_state.js';
export function createMixturePanel({craftingContainer,actionContainer,read,act}){
    const launch=document.createElement('button');launch.id='village_mixing_open';launch.textContent='Mix at the Village counter';actionContainer.append(launch);
    const panel=document.createElement('section');panel.id='village_mixing_panel';panel.style.cssText='padding:12px;border:1px solid var(--border-color,#888);margin:8px;display:none;max-width:850px;';
    craftingContainer.prepend(panel);const title=document.createElement('h3');title.style.cssText='font-size:16px;margin:0 0 6px';title.textContent='Village mixing counter';panel.append(title);
    const help=document.createElement('p');help.style.cssText='margin:4px 0 8px;font-size:13px';help.textContent='Choose whole packs of water and plants, then steep or boil. The first four new types receive saved container appearances. Try a dose to learn and recognize a type.';panel.append(help);
    const rows=document.createElement('div');rows.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(230px,1fr));gap:4px';panel.append(rows);
    const amounts={};const stockLabels={};
    const notice=document.createElement('p');notice.style.cssText='margin:6px 0;font-size:13px';notice.id='mixture_notice';notice.setAttribute('role','status');
    const run=request=>{try{const result=act(request);notice.textContent=result?.message||'No change.';render();}catch(error){notice.textContent=error.message;}};
    for(const i of INGREDIENTS){const row=document.createElement('label');row.style.cssText='font-size:13px;line-height:1.35';const name=document.createElement('span');name.textContent=i.id+' ';row.append(name);
        const input=document.createElement('input');input.type='number';input.min=0;input.max=99;input.step=1;input.value=['River bellleaf','Spring water'].includes(i.id)?1:0;input.id='mixture_amount_'+i.id.replaceAll(' ','_');input.style.width='50px';input.oninput=preview;row.append(input);amounts[i.id]=input;
        const stock=document.createElement('span');stockLabels[i.id]=stock;row.append(stock);const buy=document.createElement('button');buy.type='button';buy.textContent=`Buy 1 (${i.price} coins)`;buy.style.cssText='padding:3px 6px;margin:2px 0;font-size:13px';buy.onclick=()=>run({type:'buy',id:i.id});row.append(buy);const route=document.createElement('small');route.style.cssText='display:block;font-size:11px';route.textContent=i.route.includes('Forest')?'Also gather on Forest road':'Buy at this counter';row.append(route);rows.append(row);}
    const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap';panel.append(controls);
    const process=document.createElement('select');process.id='mixture_process';for(const kind of ['steep','boil']){const option=document.createElement('option');option.value=kind;option.textContent=kind==='steep'?'Steep':'Boil';process.append(option);}process.onchange=preview;controls.append(process);
    const mix=document.createElement('button');mix.id='mixture_craft';mix.textContent='Mix one vial';mix.onclick=()=>run({type:'mix',...selection()});controls.append(mix);
    const close=document.createElement('button');close.textContent='Back to local actions';close.onclick=()=>{for(const child of craftingContainer.children)if(child!==panel)child.style.display=child.dataset.mixturePreviousDisplay??'';panel.style.display='none';craftingContainer.style.display='none';actionContainer.style.display='block';};controls.append(close);
    const prediction=document.createElement('p');prediction.id='mixture_prediction';panel.append(prediction,notice);
    const output=document.createElement('div');output.id='mixture_products';panel.append(output);
    function selection(){return {inputs:Object.fromEntries(INGREDIENTS.map(i=>[i.id,Number(amounts[i.id].value)])),process:process.value};}
    function preview(){try{const frame=read(),s=getMixtureOwner()??createMixtureState(frame.seed),p=resolveMixture(s,selection().inputs,selection().process),v=mixturePresentation(s,p);prediction.style.cssText='margin:8px 0;font-size:13px';prediction.textContent=`One vial. ${v.description}`;}catch(error){prediction.textContent=error.message;}}
    let outputSignature=null;
    function render(){const frame=read();launch.hidden=!frame.visible;mix.disabled=!frame.ready;for(const i of INGREDIENTS)stockLabels[i.id].textContent=` (${frame.inventory[JSON.stringify({id:i.id})]?.count??0} owned) `;preview();
        const s=getMixtureOwner();const signature=JSON.stringify([s?.sequence,Object.entries(frame.inventory).map(([k,v])=>[k,v.count]),frame.ready]);
        const jobNode=output.querySelector?.('#mixture_job');if(jobNode&&s?.job)jobNode.textContent=`Mixing: ${Math.max(0,s.job.due-frame.clock)} minutes remaining; ${s.job.remaining} batches queued. Ingredients are held.`;
        if(signature===outputSignature)return;outputSignature=signature;output.replaceChildren();if(!s)return;
        const job=document.createElement('p');job.id='mixture_job';job.style.cssText='margin:4px 0;font-size:13px';job.textContent=s.job?`Mixing: ${Math.max(0,s.job.due-frame.clock)} minutes remaining; ${s.job.remaining} batches queued. Ingredients are held.`:'Mixing vessel free.';output.append(job);
        if(s.job){const cancel=document.createElement('button');cancel.id='mixture_cancel';cancel.textContent='Cancel and return held ingredients';cancel.onclick=()=>run({type:'cancel'});output.append(cancel);}
        for(const p of Object.values(s.products)){const key=mixtureKey(p),n=frame.inventory[key]?.count??0,known=!!s.knowledge[p.id];if(!n&&!known)continue;const line=document.createElement('div');line.style.cssText='border-top:1px solid #888;padding:8px 0';line.dataset.mixtureProduct=key;
            const text=document.createElement('p');text.style.cssText='font-size:13px;margin:4px 0';text.textContent=`${mixturePresentation(s,p).name} (${n} owned). ${Object.entries(p.inputs).map(([id,n])=>`${n} ${id}`).join(', ')}. ${mixturePresentation(s,p).description}`;line.append(text);
            if(n){const use=document.createElement('button');use.textContent=known?'Drink one dose':'Experiment: drink one dose';use.onclick=()=>run({type:'use',key});line.append(use);}
            if(known&&!s.methods[p.id]){const learn=document.createElement('button');learn.textContent='Save observed method';learn.onclick=()=>run({type:'learn',product:p.id});line.append(learn);}
            if(s.methods[p.id]){const count=document.createElement('input');count.type='number';count.value=3;count.min=1;count.max=999;count.setAttribute('aria-label','Repeat batch count');count.style.width='55px';line.append(count);const repeat=document.createElement('button');repeat.textContent='Queue learned method';repeat.disabled=!!s.job;repeat.onclick=()=>run({type:'repeat',product:p.id,count:Number(count.value)});line.append(repeat);}
            output.append(line);}
    }
    launch.onclick=()=>{actionContainer.style.display='none';for(const child of craftingContainer.children)if(child!==panel){child.dataset.mixturePreviousDisplay=child.style.display;child.style.display='none';}craftingContainer.style.display='block';panel.style.display='block';render();};
    const interval=setInterval(()=>{const frame=read();if(frame.ready&&frame.visible&&getMixtureOwner()?.job?.due<=frame.clock)run({type:'advance'});if(panel.style.display!=='none')render();if(!launch.isConnected)actionContainer.append(launch);launch.hidden=!frame.visible;},500);
    render();return {render,destroy:()=>clearInterval(interval)};
}
