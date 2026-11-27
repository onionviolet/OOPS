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
const mastery=lineages=>lineages.map(({id,level,xp})=>
    `${id} ${level} (${xp.toLocaleString('en-US',{maximumFractionDigits:2})} XP)`).join(' · ');

export function mountGrowthQueue(skillList) {
    const details=node('details'),summary=node('summary'),entries=node('div'),notice=node('p');
    details.dataset.skillGrowthQueue='';
    summary.textContent='Growth';
    notice.setAttribute('role','status');
    details.append(summary,entries,notice);
    skillList.before(details);
    const focus=()=>{details.open=true;summary.focus();};
    const previews=new Map();
    let signature;
    return {focus,render(choices){
        const next=JSON.stringify(choices.map(({row,reason})=>[row.id,reason]));
        if(next===signature){
            for(const {row,quote} of choices)if(previews.has(row.id))previews.get(row.id).textContent=mastery(quote.lineages);
            return;
        }
        signature=next;
        summary.textContent=choices.length?`Growth · ${choices.length} waiting`:'Growth';
        entries.replaceChildren();
        previews.clear();
        if(!choices.length)entries.append(node('p','Keep practising to earn a growth choice.'));
        for(const {row,quote,reason,choose,refuse} of choices){
            const section=node('section');
            const grouped=quote.lineages.length>0;
            section.dataset.skillGrowthChoice=row.id;
            section.append(node('h4',grouped?quote.lineages.map(part=>part.id).join(' + '):row.grade?`${row.from} · ${row.grade}`:row.from));
            if(grouped){
                const preview=node('p',mastery(quote.lineages));
                previews.set(row.id,preview);
                section.append(preview);
            }
            for(const target of row.targets){
                const terms=grouped?'Removes the separate skill rows. Keeps each source’s exact XP, level, practice and bonuses in the new skill. This choice is permanent.':
                    row.policy==='specialization'?`${row.practiceText} Keeps ordinary ${row.from}.`:
                    'Replaces this skill in its row and keeps its XP and level.';
                section.append(kitRow({label:`Choose ${formName(target)}`,fact:[row.trainingText,branchDescription(target,row.from)].filter(Boolean).join(' '),
                    from:[terms,target.costs.length?'Requires payment.':'No fee.'].join(' '),
                    data:{evolutionForm:target.id},action:{disabled:!!reason,title:reason||formName(target),run:()=>{
                        try{choose(target.id);notice.textContent='';focus();}
                        catch(error){notice.textContent=error.message;}
                    }}}));
            }
            if(grouped){
                section.append(kitRow({label:'Decide later',fact:'The offer stays in Growth and practice continues.',
                    action:{run:()=>{details.open=false;summary.focus();}}}));
                section.append(kitRow({label:'Keep separate skills',fact:'Permanently decline this offer.',
                    action:{run:()=>{try{refuse();notice.textContent='';focus();}catch(error){notice.textContent=error.message;}}}}));
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
    return (choice,target,merged)=>{
        parent.hidden=!!merged&&!merged.primary;
        if(merged?.primary)parent.dataset.evolvedSkill=merged.id;
        else delete parent.dataset.evolvedSkill;
        container.hidden=!choice||choice.status==='refused';
        button.hidden=choice?.status!=='waiting';
        const text=merged?`${merged.description} ${mastery(merged.lineages)}`:!target?'':row.policy==='specialization'?`Specialization: ${target.name}`:
            [target.grade,row.trainingText,target.description].filter(Boolean).join(' · ');
        if(description.textContent!==text)description.textContent=text;
    };
}
