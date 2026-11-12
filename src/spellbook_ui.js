import {registerWorkspaceModule} from './workspace_layout.js';

export function createSpellbookPanel({read,command}) {
    const panel=document.createElement('details');
    panel.id='spellbook_panel';
    const summary=document.createElement('summary');
    summary.textContent='Spellbook';
    const body=document.createElement('div'),notice=document.createElement('p');
    notice.setAttribute('role','status');
    panel.append(summary,body,notice);
    let signature;
    const openMethods=new Set();
    const evidenceLabels={observed:'Observed',inference:'Interpretation',original:'Practice rule'};
    function render(){
        const view=read(panel.open);
        panel.hidden=!view;
        const next=JSON.stringify(view);
        if(next===signature)return;
        signature=next;
        body.replaceChildren();
        if(!view){notice.textContent='';return;}
        if(view.error){notice.textContent=view.error;return;}
        const add=(tag,text,parent=body)=>{
            const node=document.createElement(tag);
            node.textContent=text;
            parent.append(node);
            return node;
        };
        const act=(label,action,fields,disabled=false,parent=body)=>{
            const button=add('button',label,parent);
            button.type='button';
            button.disabled=disabled||!view.canWrite;
            button.onclick=()=>{
                try{command({world:view.world,action,...fields()});notice.textContent='';}
                catch(error){notice.textContent=error.message;}
                render();
            };
        };
        const pending=view.status==='pending';
        for(const method of view.methods){
            const card=add('details','');
            card.open=openMethods.has(method.id);
            card.ontoggle=()=>card.open?openMethods.add(method.id):openMethods.delete(method.id);
            add('summary',method.label,card);
            for(const part of method.expression.parts){
                add('p',[part.text,evidenceLabels[part.evidence.kind],part.evidence.text].join(' · '),card);
                if(part.analysis){
                    add('p',part.analysis.speech.text,card);
                    const details=add('details','',card);
                    add('summary','Possible roots and endings in '+part.text,details);
                    const segments=add('ul','',details);
                    for(const segment of part.analysis.morphology) add('li',segment.text+' · '+segment.evidence.text,segments);
                }
            }
            for(const evidence of method.evidence) add('p',evidenceLabels[evidence.kind]+' · '+evidence.text,card);
            const fields=method.roles.map(role=>{
                const label=add('label',role.name+' ',card);
                const select=add('select','',label);
                for(const target of role.targets) add('option',target.label,select).value=target.id;
                return [role.name,select];
            });
            act('Add '+method.label,'append',()=>({step:{method:method.id,revision:method.revision,
                bindings:Object.fromEntries(fields.map(([name,select])=>[name,select.value]))}}),pending,card);
        }
        const steps=add('ol','');
        view.draft.forEach((step,index)=>{
            const method=view.methods.find(row=>row.id===step.method&&row.revision===step.revision);
            const targets=method?.roles.map(role=>role.targets.find(target=>target.id===step.bindings[role.name])?.label).filter(Boolean);
            const item=add('li',[method?.label??step.method,...(targets??[])].join(' · ')+' ',steps);
            act('Remove step '+(index+1),'remove',()=>({index}),pending,item);
            if(index>0)act('Move step '+(index+1)+' earlier','move-earlier',()=>({index}),pending,item);
        });
        const messages={pending:'The current spell is still in progress.',ready:'This step worked. Continue when ready.',
            worked:'The working succeeded.',failed:'This step failed. Revise the draft or try again.',
            interrupted:'The spell stopped before its result could be recorded.'};
        if(view.status)add('p',messages[view.status]);
        if(view.quote){
            const {costs,duration,reasons}=view.quote;
            add('p',[...(costs.length?costs:['No payment']),duration?duration+' played min':'Immediate'].join(' · '));
            if(reasons.length)add('p',reasons.join(' '));
        }
        const noFields=()=>({});
        act('Test working','test',noFields,pending||!view.draft.length||view.status==='ready'||view.quote?.eligible===false);
        act('Cast next step','continue',noFields,view.status!=='ready'||view.quote?.eligible===false);
        act('Record working','record',noFields,view.status!=='worked');
        const written=add('ol','');
        view.records.forEach(({steps},index)=>{
            const item=add('li',steps.map(step=>view.methods.find(method=>method.id===step.method)?.label??step.method).join(' → ')+' ',written);
            act('Recall working '+(index+1),'recall',()=>({index}),pending,item);
        });
    }
    render();
    registerWorkspaceModule({id:'spellbook',title:'Spellbook',node:panel,home:'right',eligible:()=>!panel.hidden});
    setInterval(render,250);
}
