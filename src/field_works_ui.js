import {createFieldExtensionControls} from './field_works_extension_ui.js';
import {simulationOccupiesActor} from './simulation.js';
import {previewFieldWorksCommand as previewSimulationCommand,fieldWorksMessage} from './field_works_projection.js';
import {WORKS as I,WORKS_KEYS as K,WORKS_STEPS,fieldSequenceId} from './field_works_content.js';
import {fieldWorksView} from './field_works_facts.js';
const node=(tag,text='',className='')=>{const n=document.createElement(tag);n.textContent=text;n.className=className;return n;};
const sections=[['start','Setup'],['materials','Clay, heat & useful stock'],['composition','Recorded techniques'],['machines','Drive & receiving trays'],['discovery','Material observations'],['garden','Garden & reservoir'],['helpers','Workshop wisp'],['supply','Fitter requests & deliveries'],['logistics','Handcart depot & scheduled deliveries'],['drying','Exposed drying rack'],['freight','Shack–Village freight & worker rota']];

export function createFieldWorksPanel({registry,read,command}) {
    const panel=node('details','','notebook_preparation');panel.dataset.fieldWorks='';panel.append(node('summary','Practical works'));
    const summary=node('p'),notice=node('p','','expedition_notice'),resources=node('p'),workNote=node('p'),workers=node('div'),groups=new Map(),controls=[];
    resources.dataset.worksResources='';workNote.dataset.worksNote='';
    notice.setAttribute('role','status');panel.append(summary,notice,resources,workers,workNote);
    let message='';
    const run=c=>{try{command(c);message='Work saved.';}catch(e){message=fieldWorksMessage(e.message);}render();};
    const button=(text,id,c)=>{const b=node('button',text);b.type='button';b.dataset.worksCommand=id;b.addEventListener('click',()=>run(c));return b;};
    for(const [id,label]of sections){const g=node('details','','notebook_preparation');g.append(node('summary',label));g.open=id==='start';groups.set(id,g);panel.append(g);}
    for(const d of registry.simulation.commands.values())if(d.id.startsWith(I.prefix)&&d.actorId==='player'&&!d.worksComposition&&!d.worksFreightOrder){
        const card=node('div','','expedition_card'),b=button(d.label,d.id,{type:'command',id:d.id}),reason=node('p','','expedition_requirements');
        card.append(b);if(d.description)card.append(node('p',d.description));card.append(reason);groups.get(d.worksSection).append(card);controls.push({d,card,b,reason});
    }
    const observation=node('p');observation.dataset.worksObservation='';groups.get('discovery').append(observation);
    const composer=node('div','','expedition_card'),selects=[];
    for(let i=0;i<3;i++){
        const label=node('label',`Operation ${i+1} `),select=node('select');select.dataset.worksStep=String(i);
        if(i){const o=node('option','Finish here');o.value='';select.append(o);}
        for(const step of WORKS_STEPS){const o=node('option',step);o.value=step;select.append(o);}
        select.value=WORKS_STEPS[i];select.addEventListener('change',()=>render());label.append(select);composer.append(label);selects.push(select);
    }
    const heatLabel=node('label','Heat '),heat=node('select');heat.dataset.worksStrength='';
    for(const [id,text]of [['gentle','Gentle warming'],['strong','Hot firing']]){const o=node('option',text);o.value=id;heat.append(o);}heat.value='strong';heat.addEventListener('change',()=>render());heatLabel.append(heat);composer.append(heatLabel);
    const inputLabel=node('label','Workpiece '),input=node('select');input.dataset.worksInput='';
    for(const [id,text]of [['clay','Raw clay'],['wet','Wet vessels'],['dry','Dry vessels']]){const o=node('option',text);o.value=id;input.append(o);}input.addEventListener('change',()=>render());inputLabel.append(input);composer.append(inputLabel);
    const batchLabel=node('label','Batch '),batch=node('select');batch.dataset.worksBatch='';
    for(const count of [1,3]){const o=node('option',String(count));o.value=String(count);batch.append(o);}batch.addEventListener('change',()=>render());batchLabel.append(batch);composer.append(batchLabel);
    const compositionQuote=node('p'),compositionReason=node('p','','expedition_requirements');
    const selection=()=>{const steps=[];for(const s of selects){if(!s.value)break;steps.push(s.value);}return fieldSequenceId(steps,heat.value,input.value,Number(batch.value));};
    // The selected command is resolved at click time, not captured at render.
    const applySelected=node('button','Apply this technique'),queue=node('button','Queue up to 3 applications');
    applySelected.type=queue.type='button';applySelected.dataset.worksCommand='apply_sequence';queue.dataset.worksCommand='queue_sequence';
    applySelected.addEventListener('click',()=>run({type:'command',id:selection()}));queue.addEventListener('click',()=>run({type:'program',id:selection(),count:3}));
    composer.append(compositionQuote,applySelected,queue,compositionReason);groups.get('composition').append(composer);
    const routine=node('p'),pause=button('Pause after the current application','pause',{type:'pause'}),resume=button('Resume the remaining applications','resume',{type:'resume'}),cancel=button('Cancel your preparation · return its reserved inputs','cancel',{type:'cancel'});
    panel.append(routine,pause,resume,cancel);
    const growQueue=button('Queue up to 3 ember-bed feedings','queue_garden',{type:'program',id:I.prefix+'grow_ember',count:3});groups.get('garden').append(growQueue);
    const depot=node('p');depot.dataset.worksDepot='';groups.get('logistics').children[0].after(depot);
    const extension=createFieldExtensionControls({groups,registry,read,run,K,refresh:()=>render()});
    const inventory=(context,key)=>context.gameplay?.player?.inventory?.[key]||0;
    function render(){
        const snapshot=read(),{state,context,enabled,error}=snapshot,f=state.actors.player.facts,view=fieldWorksView(state,context),s=state.simulation;
        panel.hidden=!f['field.facility']||!['Shack','Village'].includes(context.facts?.location)||snapshot.inDialogue;
        summary.textContent=view?'Local clay, material trials, a supplied garden, powered work and contracted helpers share your existing workshop.':'Extend your assembled field workshop with practical clay work and supplied production.';
        extension.render(state,context,view,snapshot);
        message=error||message;notice.textContent=message;notice.hidden=!message;
        resources.hidden=!view;resources.textContent=view?`Reservoir: ${view.mana}/${view.capacity} energy; ${view.space} free receiving units. ${view.drive?`Drive: ${view.drive.free}/${view.drive.capacity} load free; ${view.drive.connected?'connected':'disconnected'}. `:''}Garden care: ${view.gardenCare}/3 feedings. Held trays: ${inventory(context,K.empty)} empty. Charcoal: ${inventory(context,K.coal)}. Clay: ${inventory(context,K.clay)}; wet ${inventory(context,K.wet)}, dry ${inventory(context,K.dry)}, fired ${inventory(context,K.fired)}. Staves: ${inventory(context,K.stave)}; spare parts ${inventory(context,K.parts)}.`:'';
        workers.replaceChildren();for(const w of [view?.spirit,view?.artisan].filter(Boolean)){const row=node('p',`${w.role==='spirit'?'Workshop wisp':'Contract fitter'}: ${w.status}${w.role==='artisan'?` Unearned wages ${w.wages}; earned wages ${w.earned}.`:''}`);row.dataset.worksWorker=w.role;workers.append(row);}
        depot.hidden=!view?.courier;depot.textContent=view?.courier?`Handcart: ${view.courier.status} Funded trips ${view.courier.orders}; unearned wages ${view.courier.wages}; earned ${view.courier.earned}. Depot: ${['log','coal','empty','stave','parts'].map(k=>`${JSON.parse(K[k]).id} ${view.courier.inventory[K[k]]||0}`).join('; ')}.`:'';
        workNote.hidden=!view?.lastWork;workNote.textContent=view?.lastWork?`Last work note: ${view.lastWork}`:'';
        const job=s?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith(I.prefix));
        for(const c of controls){
            let p;try{p=s?previewSimulationCommand(state,registry,c.d.id,context):null;}catch(e){p={visible:false,eligible:false,reasons:[e.message]};}
            c.card.hidden=!!(c.d.location&&c.d.location!==context.facts.location)||!p?.visible||!!(c.d.once&&state.actors.player.completed[c.d.id]);
            // Receiver/recall controls are useful only for actual held goods.
            if(/freight_(store|take)_/.test(c.d.id))c.card.hidden||=!c.d.id.endsWith('_'+extension.stockKey());
            if(c.d.id.startsWith(I.prefix+'collect_')){const kind=c.d.id.slice((I.prefix+'collect_').length);if(['staves','fittings','kits'].includes(kind))c.card.hidden||=!inventory(context,K[kind]);else c.card.hidden||=!s?.owners[kind==='spirit'?I.spirit:I.artisan]?.[kind==='spirit'?K.staves:K.kits];}
            if(c.d.id.startsWith(I.prefix+'recall_')){const [,role,k]=c.d.id.slice(I.prefix.length).split('_');c.card.hidden||=!s?.owners[role==='spirit'?I.spirit:role==='courier'?I.courier:I.artisan]?.[K[k]];}
            c.b.disabled=!enabled||!!error||!p?.eligible;c.reason.textContent=!c.card.hidden&&c.b.disabled?(p?.reasons.join(' ')||error||'Finish your current activity first.'):'';c.reason.hidden=!c.reason.textContent;
        }
        observation.textContent=view?.mineral||'';observation.hidden=!view;
        composer.hidden=f[I.prefix+'composition']!==true||context.facts.location!=='Shack';
        for(let i=1;i<selects.length;i++)selects[i].disabled=selects.slice(0,i).some(s=>!s.value);
        if(!composer.hidden){const p=previewSimulationCommand(state,registry,selection(),context);compositionQuote.textContent=p.label;applySelected.disabled=queue.disabled=!enabled||!!error||!p.eligible;compositionReason.textContent=p.eligible?'Each application reserves its selected workpieces and energy. The queue stops on actual shortage.':p.reasons.join(' ');}
        growQueue.hidden=f[I.prefix+'garden']!==true;growQueue.disabled=!enabled||!!error||!s||!previewSimulationCommand(state,registry,I.prefix+'grow_ember',context).eligible;
        const program=s?.programs.player,isOwn=program?.commandId.startsWith(I.prefix);
        routine.hidden=!job&&!isOwn;routine.textContent=[job?`${job.label}: ${Math.max(0,job.due-state.clock)} min remaining.`:'',isOwn?`Queue ${program.status}; ${program.remaining} applications left. ${program.reason||''}`:''].filter(Boolean).join(' ');
        pause.hidden=!isOwn||program.status!=='running';resume.hidden=!isOwn||program.status!=='paused'||!program.remaining;pause.disabled=!!error;resume.disabled=!enabled||!!error||simulationOccupiesActor(state);
        cancel.hidden=!job;cancel.disabled=!!error;
        for(const g of groups.values())g.hidden=![...g.children].some(n=>n.tagName!=='SUMMARY'&&!n.hidden);
    }
    render();return {element:panel,render};
}
