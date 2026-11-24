export function createBookCraftControls(command) {
    const element=document.createElement('details');
    element.dataset.bookCraft='';
    const summary=document.createElement('summary');
    summary.textContent='Combine parts for glass repair';
    const form=document.createElement('div');
    element.append(summary,form);
    let view,canWrite,signature,world,steps=[],keys=new Set(),saved=null,notice='';
    let aligned=false,stockTouched=false,editorOpen=false;
    const append=(parent,tag,text)=>{
        const node=document.createElement(tag);
        if(text)node.textContent=text;
        parent.append(node);
        return node;
    };
    const button=(parent,text,action)=>{
        const node=append(parent,'button',text);
        node.type='button';
        node.onclick=action;
        return node;
    };
    function redraw() {
        form.replaceChildren();
        if(!view)return;
        const glass=view.world==='book.hp.school.world';
        summary.textContent=glass?'Repair a practice pane':'Combine parts with Nora';
        let editor=form;
        if(glass) {
            append(form,'p','Each cast uses one set of shards and one stamina. You keep the wand.');
            editor=append(form,'details');
            editor.open=editorOpen;
            append(editor,'summary','Experiment with a sequence');
            editor.ontoggle=()=>{if(editor.isConnected)editorOpen=editor.open;};
        }
        if(view.saved.length) {
            const methods=append(editor,'fieldset');
            append(methods,'legend','Saved methods');
            for(const method of view.saved) {
                const name=method.steps.map(step=>view.operations.find(op=>op.id===step.op)?.label).join(' → ');
                button(methods,name,()=>{
                    saved=method;
                    steps=method.steps.map(step=>({...step,label:view.operations.find(op=>op.id===step.op)?.label}));
                    refreshDraft();
                });
            }
        }
        const stock=append(form,'fieldset');
        const picked=()=>view.stock.filter(row=>keys.has(row.key));
        if(glass&&!stockTouched) {
            keys.clear();
            for(const role of ['consumed','catalyst']) {
                const options=view.stock.filter(row=>row.role===role);
                if(options.length===1)keys.add(options[0].key);
            }
        }
        append(stock,'legend','Carried parts');
        for(const row of view.stock) {
            const label=append(stock,'label');
            const box=append(label,'input');
            box.type='checkbox';
            box.checked=keys.has(row.key);
            append(label,'span',`${row.label} (${row.qty} carried${row.role==='catalyst'?', kept':', used'})`);
            box.onchange=()=>{
                stockTouched=true;
                aligned=false;
                if(box.checked)keys.add(row.key);
                else keys.delete(row.key);
                updateTry();
            };
            append(stock,'br');
        }
        const direct=[];
        let condition,arrange;
        if(glass) {
            condition=append(form,'p');
            condition.setAttribute('role','status');
            const actions=append(form,'div');
            actions.className='activable_buttons flex_wrap';
            for(const method of view.saved) {
                const label=view.saved.length===1?'Repair with learned method':
                    'Repair with '+method.steps.map(step=>view.operations.find(op=>op.id===step.op)?.label).join(' → ');
                direct.push(button(actions,label,()=>attempt(method.steps,method)));
            }
            arrange=button(actions,'Lay out the shards',()=>{
                aligned=!aligned;
                updateTry();
            });
            const cast=button(actions,'Cast the repair spell',()=>{
                const operations=aligned?['align','join']:['join'];
                attempt(operations.map(op=>({op,level:1})),null);
            });
            direct.push(cast);
            form.append(editor);
        }
        const sequence=append(editor,'ol');
        function revise(index,direction) {
            saved=null;
            const destination=index+direction;
            if(direction===0)steps.splice(index,1);
            else [steps[index],steps[destination]]=[steps[destination],steps[index]];
            refreshDraft();
            const row=sequence.children[Math.min(destination,steps.length-1)];
            if(!row)choices.querySelector('button')?.focus();
            else if(direction===0)row.focus();
            else {
                const move=row.querySelector(direction<0?'[data-up]':'[data-down]');
                (move.disabled?row:move).focus();
            }
        }
        function drawSequence() {
            sequence.replaceChildren();
            for(const [index,step] of steps.entries()) {
                const row=append(sequence,'li',step.label+' ');
                row.tabIndex=-1;
                const subject=`step ${index+1}, ${step.label}`;
                const up=button(row,'Move up',()=>revise(index,-1));
                up.dataset.up='';
                up.disabled=index===0;
                up.setAttribute('aria-label',`Move up: ${subject}`);
                const down=button(row,'Move down',()=>revise(index,1));
                down.dataset.down='';
                down.disabled=index===steps.length-1;
                down.setAttribute('aria-label',`Move down: ${subject}`);
                button(row,'Remove',()=>revise(index,0)).setAttribute('aria-label',`Remove ${subject}`);
            }
        }
        const choices=append(editor,'fieldset');
        append(choices,'legend','Add a step');
        const add=step=>{saved=null;steps.push(step);refreshDraft();};
        for(const op of view.operations) {
            const [min,max]=op.levels;
            for(let level=min;level<=max;level++)
                button(choices,min===max?op.label:`${op.label} (${level})`,()=>add({op:op.id,level,label:op.label}));
        }
        for(const part of view.parts)
            button(choices,part.label,()=>add({part:part.id,revision:part.revision,label:part.label}));
        function attempt(trialSteps,method) {
            const rows=picked();
            const working=method??{id:view.id,revision:1,world:view.world,law:view.law,
                slots:rows.map(({material,role},index)=>({id:'part-'+index,select:{material},role:role==='catalyst'?'catalyst':'base'})),
                steps:trialSteps.map(({label,...step})=>step)};
            try {
                const result=command({type:'craft-trial',working,learn:!method,
                    lots:rows.map(({key,role})=>({key,qty:1,role}))});
                aligned=false;
                notice=result.pending?'':result.success?(result.learned?'The fragments rejoined. You saved the method.':'The fragments rejoined.'):'The fragments stayed apart. The shard set was spent.';
            } catch(error) {
                notice=error.message;
            }
            redraw();
            if(glass)summary.focus();
        }
        const submit=button(editor,saved?'Use saved method':'Try and save if it works',()=>attempt(steps,saved));
        const blocker=append(form,'p');
        blocker.id='book-craft-reason-'+view.world;
        blocker.setAttribute('role','status');
        const updateTry=()=>{
            const rows=picked();
            const fits=rows.length===2&&new Set(rows.map(row=>row.material)).size===2;
            let reason='';
            if(!canWrite)reason='Restore saving before starting a trial.';
            else if(view.remaining!=null)reason='Finish the current trial first.';
            else if(glass&&!view.stock.some(row=>row.role==='consumed'))reason='You need a set of practice-pane shards.';
            else if(glass&&!view.stock.some(row=>row.role==='catalyst'))reason='You need a wand for this cast.';
            else if(!view.eligible)reason=view.reasons?.join(' ')||'This trial is unavailable here.';
            else if(!fits)reason=view.timed?'Choose one stone cube and one ink.':'Choose one set of shards and one wand.';
            if(glass) {
                arrange.textContent=aligned?'Leave the shards loose':'Lay out the shards';
                condition.textContent=view.stock.some(row=>row.role==='consumed')
                    ? (aligned?'Prepared for casting: edges laid together. The trial is paid when you cast.':'The shards lie loose on the bench.')
                    : 'There are no carried shards to lay out.';
                for(const control of [arrange,...direct]) {
                    control.disabled=!!reason;
                    if(reason)control.setAttribute('aria-describedby',blocker.id);
                    else control.removeAttribute('aria-describedby');
                }
            }
            const draftEmpty=!steps.length;
            if(!glass&&!reason&&draftEmpty)reason='Add a step to try with those parts.';
            blocker.textContent=reason;
            blocker.hidden=!reason;
            submit.disabled=!!reason||draftEmpty;
            if(reason)submit.setAttribute('aria-describedby',blocker.id);
            else submit.removeAttribute('aria-describedby');
        };
        function refreshDraft() {
            drawSequence();
            submit.textContent=saved?'Use saved method':'Try and save if it works';
            updateTry();
        }
        refreshDraft();
        if(view.timed)append(form,'p','Six minutes. Uses one cube, one ink and two stamina. Pay Nora three crowns for her time and two mana.');
        if(view.remaining!=null)append(form,'p',`Nora is working with you. ${view.remaining} minutes remaining.`).setAttribute('role','status');
        if(notice||view.last)append(form,'p',notice||view.last).setAttribute('role','status');
    }
    function render(next,writable) {
        if(next?.world!==world){world=next?.world;steps=[];keys=new Set();saved=null;notice='';aligned=false;stockTouched=false;editorOpen=false;}
        view=next;
        canWrite=writable;
        element.hidden=!view;
        // The sequence changes with unrelated actions. Keep the draft and focus
        // when only the host's next method ID changed.
        const token=JSON.stringify([next&&{...next,id:undefined},writable]);
        if(token===signature)return;
        signature=token;
        redraw();
    }
    return {element,render};
}
