export function createBookCraftControls(command) {
    const element=document.createElement('details');
    element.dataset.bookCraft='';
    const summary=document.createElement('summary');
    summary.textContent='Combine parts for glass repair';
    const form=document.createElement('div');
    element.append(summary,form);
    let view,canWrite,signature,world,steps=[],keys=new Set(),saved=null,notice='';
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
        summary.textContent=view.timed?'Combine parts with Nora':'Combine parts for glass repair';
        if(view.saved.length) {
            const methods=append(form,'fieldset');
            append(methods,'legend','Saved methods');
            for(const method of view.saved) {
                const name=method.steps.map(step=>view.operations.find(op=>op.id===step.op)?.label).join(' → ');
                button(methods,name,()=>{
                    saved=method;
                    steps=method.steps.map(step=>({...step,label:view.operations.find(op=>op.id===step.op)?.label}));
                    redraw();
                });
            }
        }
        const stock=append(form,'fieldset');
        append(stock,'legend','Carried parts');
        for(const row of view.stock) {
            const label=append(stock,'label');
            const box=append(label,'input');
            box.type='checkbox';
            box.checked=keys.has(row.key);
            append(label,'span',`${row.label} (${row.qty} carried${row.role==='catalyst'?', kept':', used'})`);
            box.onchange=()=>{
                if(box.checked)keys.add(row.key);
                else keys.delete(row.key);
                updateTry();
            };
            append(stock,'br');
        }
        const sequence=append(form,'ol');
        function revise(index,direction) {
            saved=null;
            if(direction===0)steps.splice(index,1);
            else [steps[index],steps[index+direction]]=[steps[index+direction],steps[index]];
            redraw();
        }
        for(const [index,step] of steps.entries()) {
            const row=append(sequence,'li',step.label+' ');
            button(row,'Move up',()=>revise(index,-1)).disabled=index===0;
            button(row,'Move down',()=>revise(index,1)).disabled=index===steps.length-1;
            button(row,'Remove',()=>revise(index,0));
        }
        const choices=append(form,'fieldset');
        append(choices,'legend','Add a step');
        const add=step=>{saved=null;steps.push(step);redraw();};
        for(const op of view.operations) {
            const [min,max]=op.levels;
            for(let level=min;level<=max;level++)
                button(choices,min===max?op.label:`${op.label} (${level})`,()=>add({op:op.id,level,label:op.label}));
        }
        for(const part of view.parts)
            button(choices,part.label,()=>add({part:part.id,revision:part.revision,label:part.label}));
        const picked=()=>view.stock.filter(row=>keys.has(row.key));
        const submit=button(form,saved?'Use saved method':'Try and save if it works',()=>{
            const rows=picked();
            const working=saved??{id:view.id,revision:1,world:view.world,law:view.law,
                slots:rows.map(({material,role},index)=>({id:'part-'+index,select:{material},role:role==='catalyst'?'catalyst':'base'})),
                steps:steps.map(({label,...step})=>step)};
            try {
                const result=command({type:'craft-trial',working,learn:!saved,
                    lots:rows.map(({key,role})=>({key,qty:1,role}))});
                notice=result.pending?'':result.success?(result.learned?'The fragments rejoined. You saved the method.':'The fragments rejoined.'):'The fragments stayed apart. The shard set was spent.';
            } catch(error) {
                notice=error.message;
            }
            redraw();
        });
        const updateTry=()=>{
            const rows=picked();
            const fits=rows.length===2&&new Set(rows.map(row=>row.material)).size===2;
            submit.disabled=!canWrite||!view.eligible||!steps.length||!fits;
        };
        updateTry();
        append(form,'p',view.timed?'Six minutes. Uses one cube, one ink and two stamina. Pay Nora three crowns for her time and two mana.':'A trial uses one shard set and one stamina. You keep the wand.');
        if(view.remaining!=null)append(form,'p',`Nora is working with you. ${view.remaining} minutes remaining.`).setAttribute('role','status');
        else if(!view.eligible&&view.reasons?.length)append(form,'p',view.reasons.join(' '));
        if(notice||view.last)append(form,'p',notice||view.last).setAttribute('role','status');
    }
    function render(next,writable) {
        if(next?.world!==world){world=next?.world;steps=[];keys=new Set();saved=null;notice='';}
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
