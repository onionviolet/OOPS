import {kitControl,kitRow} from './kit.js';

const node=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};

function branchDescription(target,source) {
    const {practiceXP,sourceMultiplier,companion}=target.gains;
    const gains=[`+${practiceXP} ${target.name} XP per workout minute.`];
    if(sourceMultiplier)gains.push(`+${Math.round((sourceMultiplier-1)*100)}% base ${source} XP per workout minute.`);
    if(companion)gains.push(`+${companion.xp} ${companion.skill} XP per workout minute.`);
    return gains.join(' ');
}

export function mountEvolutionChoice(parent,row){
    const details=node('details');details.dataset.skillEvolution=row.id;
    const summary=node('summary'),choices=node('div'),notice=node('p');
    notice.setAttribute('role','status');
    details.append(summary,choices,notice);
    parent.append(details);
    let signature;
    return ({choice,target,reason,choose})=>{
        const key=[choice?.status,choice?.target,reason].join('|');
        if(key===signature)return;
        signature=key;
        details.hidden=!choice;
        if(!choice)return;
        summary.textContent=target?`Chosen form: ${target.name}`:`Choose a ${row.from} form`;
        choices.replaceChildren();
        for(const form of target?[target]:row.targets){
            const retention=form.retainSource?`Keeps ordinary ${row.from}.`:`Replaces ordinary ${row.from} in this practice.`;
            const entry=kitRow({label:form.name,fact:branchDescription(form,row.from),from:`${row.practiceText} ${retention}`,
                data:{evolutionForm:form.id}});
            if(!target){
                const button=kitControl(node('button',`Choose ${form.name}`));button.type='button';
                button.disabled=Boolean(reason);
                button.onclick=()=>{
                    try{choose(form.id);notice.textContent='';summary.focus();}
                    catch(error){notice.textContent=error.message;}
                };
                entry.append(button);
            }
            choices.append(entry);
        }
        if(!target){
            choices.prepend(node('p','Choose one form. No fee. Each workout minute takes the usual time.'));
            if(reason)choices.append(node('p',reason));
        }
    };
}
