import {kitControl,kitElement,kitRow} from './kit.js';

const node=(tag,text)=>kitElement(tag,'',text);

function branchDescription(target,source) {
    if(target.description)return target.description;
    const {practiceXP,sourceMultiplier,companion}=target.gains;
    const gains=[`+${practiceXP} ${target.name} XP per workout minute.`];
    if(sourceMultiplier)gains.push(`+${Math.round((sourceMultiplier-1)*100)}% base ${source} XP per workout minute.`);
    if(companion)gains.push(`+${companion.xp} ${companion.skill} XP per workout minute.`);
    return gains.join(' ');
}

const formName=form=>form.grade?`${form.name} · ${form.grade}`:form.name;

export function mountGrowthQueue(skillList) {
    const details=node('details'),summary=node('summary'),entries=node('div'),notice=node('p');
    details.dataset.skillGrowthQueue='';
    summary.textContent='Growth';
    notice.setAttribute('role','status');
    details.append(summary,entries,notice);
    skillList.before(details);
    const focus=()=>{details.open=true;summary.focus();};
    let signature;
    return {focus,render(choices){
        const next=JSON.stringify(choices.map(({row,reason})=>[row.id,reason]));
        if(next===signature)return;
        signature=next;
        summary.textContent=choices.length?`Growth · ${choices.length} waiting`:'Growth';
        entries.replaceChildren();
        if(!choices.length)entries.append(node('p','Keep practising to earn a growth choice.'));
        for(const {row,reason,choose} of choices){
            const section=node('section');
            section.dataset.skillGrowthChoice=row.id;
            section.append(node('h4',row.grade?`${row.from} · ${row.grade}`:row.from));
            for(const target of row.targets){
                const terms=row.policy==='specialization'?`${row.practiceText} Keeps ordinary ${row.from}.`:
                    'Replaces this skill in its row and keeps its XP and level.';
                section.append(kitRow({label:`Choose ${formName(target)}`,fact:branchDescription(target,row.from),
                    from:[terms,target.costs.length?'Requires payment.':'No fee.'].join(' '),
                    data:{evolutionForm:target.id},action:{disabled:!!reason,title:reason||formName(target),run:()=>{
                        try{choose(target.id);notice.textContent='';focus();}
                        catch(error){notice.textContent=error.message;}
                    }}}));
            }
            if(reason)section.append(node('p',reason));
            entries.append(section);
        }
    }};
}

export function mountSkillGrowth(parent,row,open) {
    const container=node('div'),button=kitControl(node('button','Open Growth')),description=node('small');
    container.dataset.skillEvolution=row.id;
    container.hidden=true;
    button.type='button';
    button.addEventListener('click',open);
    container.append(button,description);
    parent.append(container);
    return (choice,target)=>{
        container.hidden=!choice;
        button.hidden=choice?.status!=='waiting';
        description.textContent=!target?'':row.policy==='specialization'?`Specialization: ${target.name}`:
            [target.grade,target.description].filter(Boolean).join(' · ');
    };
}
