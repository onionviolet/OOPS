import {registerDomain} from './domain_registry.js';
import {SKILL_EVOLUTIONS} from './data/skill_evolutions.js';
import {activeSkillForm,activeSkillFunction,chosenSkillForm,chooseSkillEvolution,emptySkillEvolution,evolveSkillPractice,
    offerSkillEvolution,readSkillEvolution,skillEvolutionEligible,skillTierEvent} from './skill_evolution.js';
import {mountGrowthQueue,mountSkillGrowth} from './ui/skill_evolution.js';

const rows=new Map(SKILL_EVOLUTIONS.map(row=>[row.from,row]));
const displays=new Map();
let state=emptySkillEvolution(),ports,queue;

function progressContext(row) {
    const skill=ports.skill(row.from), xp=skill.getTotalXP(), scale=skill.xp_scaling;
    const thresholdXP=scale===1?skill.base_xp_cost*row.threshold:
        Math.round(100*skill.base_xp_cost*(1-scale**row.threshold)/(1-scale))/100;
    return {...ports.context(),xp,thresholdXP};
}

function eligibility(row){
    if(!ports?.writable())return 'Restore saving before choosing a form.';
    if(!skillEvolutionEligible(row,ports.skill(row.from).getCurrentLvl(),progressContext(row)))return row.requirementText;
    return '';
}

function report(event,row){
    if(!event)return;
    const form=row&&chosenSkillForm(state,row);
    const text=event.type==='skill-tier-changed'? `Skill ${event.previous} upgraded to ${event.current}`:
        event.type==='skill-evolution-waiting'? `${row.from} has a choice waiting in Growth.`:
        row.policy==='specialization'? `${row.from}: chose ${form.name}.`:
            `${row.from} became ${form.name}${form.grade?` (${form.grade})`:''}.`;
    ports.publish(event,text);
}

function choose(row,target){
    const reason=eligibility(row);
    if(reason)throw Error(reason);
    const result=chooseSkillEvolution(state,row,target,ports.skill(row.from).getCurrentLvl(),progressContext(row));
    if(result.costs.length)throw Error('This practice cannot settle that cost.');
    ports.persist(result.state);
    state=result.state;
    report(result.event,row);
    ports.repaint(row.from);
    refresh();
}

function refresh(){
    if(!ports)return;
    const host=globalThis.document?.getElementById('skill_list');
    if(!queue&&host)queue=mountGrowthQueue(host);
    queue?.render(SKILL_EVOLUTIONS.filter(row=>state.choices[row.id]?.status==='waiting')
        .map(row=>({row,reason:eligibility(row),choose:target=>choose(row,target)})));
    for(const [row,{parent,render}] of displays){
        if(!parent.isConnected){displays.delete(row);continue;}
        const choice=state.choices[row.id];
        render(choice,choice&&chosenSkillForm(state,row));
    }
}

export function configureSkillEvolution(config){ports=config;}

export function attachSkillEvolution(skill,parent,open){
    const row=rows.get(skill.skill_id);
    if(!row)return;
    displays.set(row,{parent,render:mountSkillGrowth(parent,row,open)});
    refresh();
}

export function reportNativeSkillTier(from,previous,current){
    report(skillTierEvent(from,previous,current));
}

export function observeSkillAward(skill,earned) {
    const row=rows.get(skill.skill_id);
    if(!earned||!row||!ports||state.choices[row.id])return;
    const before=skill.getTotalXP();
    return () => {
        if(skill.getTotalXP()<=before)return;
        const next=offerSkillEvolution(state,row,skill.getCurrentLvl(),progressContext(row));
        if(!next)return;
        state=next.state;
        report(next.event,row);
        refresh();
    };
}

export function focusSkillGrowth(){refresh();queue?.focus();}
export const evolvedSkill = id => activeSkillForm(state,SKILL_EVOLUTIONS,id);
export function evolvedUse(id,trigger,context={}) {
    return ports&&activeSkillFunction(state,SKILL_EVOLUTIONS,id,trigger,{...ports.context(),...context});
}

export function earnActivitySkillXP(activity,definition,award){
    const gains=activity.gained_skills?Object.entries(activity.gained_skills):
        (definition.base_skills_names||[]).map((skill,index)=>[skill,activity.skill_xp_per_tick[index]]);
    const context=ports.context();
    for(const [id,amount] of gains){
        const row=rows.get(id);
        if(!row){award(id,amount);continue;}
        const practice=evolveSkillPractice(state,row,amount,context);
        if(practice.sourceXP!==0)award(id,practice.sourceXP);
        for(const [skill,xp] of practice.extra)award(skill,xp,{use_bonus:false,cap_gained_xp:false,should_info:false});
    }
}

registerDomain({id:'skill_evolution',initialState:emptySkillEvolution,
    load:saved=>{state=readSkillEvolution(saved,SKILL_EVOLUTIONS);},
    save:()=>Object.keys(state.choices).length?structuredClone(state):undefined,
    commands:{form:evolvedSkill,use:evolvedUse},
    refresh});
