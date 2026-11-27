import {registerDomain} from './domain_registry.js';
import {SKILL_EVOLUTIONS} from './data/skill_evolutions.js';
import {chosenSkillForm,chooseSkillEvolution,emptySkillEvolution,evolveSkillPractice,offerSkillEvolution,readSkillEvolution,skillTierEvent} from './skill_evolution.js';
import {mountEvolutionChoice} from './ui/skill_evolution.js';

const rows=new Map(SKILL_EVOLUTIONS.map(row=>[row.from,row]));
const displays=new Map();
let state=emptySkillEvolution(),ports;

function eligibility(row,context){
    if(!ports?.writable())return 'Restore saving before choosing a form.';
    if(Object.entries(row.requirements).some(([key,value])=>context[key]!==value))return row.requirementText;
    return '';
}

function report(event,row){
    if(!event)return;
    const text=event.type==='skill-tier-changed'? `Skill ${event.previous} upgraded to ${event.current}`:
        event.type==='skill-evolution-waiting'? `${row.from} has a choice waiting in Skills.`:
            `${row.from}: chose ${chosenSkillForm(state,row).name}.`;
    ports.publish(event,text);
}

function choose(row,target){
    const context=ports.context();
    const reason=eligibility(row,context);
    if(reason)throw Error(reason);
    const result=chooseSkillEvolution(state,row,target,ports.level(row.from),context);
    if(result.costs.length)throw Error('This practice cannot settle that cost.');
    ports.persist(result.state);
    state=result.state;
    report(result.event,row);
    refresh();
}

function refresh(){
    if(!ports||!displays.size)return;
    const context=ports.context();
    for(const [row,{parent,render}] of displays){
        if(!parent.isConnected){displays.delete(row);continue;}
        const choice=context.world===row.requirements.world?state.choices[row.id]:null;
        render({choice,target:choice&&chosenSkillForm(state,row),reason:choice&&eligibility(row,context),
            choose:target=>choose(row,target)});
    }
}

export function configureSkillEvolution(config){ports=config;}

export function attachSkillEvolution(skill,parent){
    const row=rows.get(skill.skill_id);
    if(!row)return;
    displays.set(row,{parent,render:mountEvolutionChoice(parent,row)});
    refresh();
}

export function reportNativeSkillTier(from,previous,current){
    report(skillTierEvent(from,previous,current));
}

export function earnActivitySkillXP(activity,definition,award){
    const gains=activity.gained_skills?Object.entries(activity.gained_skills):
        (definition.base_skills_names||[]).map((skill,index)=>[skill,activity.skill_xp_per_tick[index]]);
    const context=ports.context();
    for(const [id,amount] of gains){
        const row=rows.get(id);
        if(!row){award(id,amount);continue;}
        const before=ports.xp(id),practice=evolveSkillPractice(state,row,amount,context);
        if(practice.sourceXP!==0)award(id,practice.sourceXP);
        for(const [skill,xp] of practice.extra)award(skill,xp,{use_bonus:false,cap_gained_xp:false,should_info:false});
        if(ports.xp(id)<=before)continue;
        const next=offerSkillEvolution(state,row,ports.level(id),context);
        if(!next)continue;
        state=next.state;
        report(next.event,row);
    }
    refresh();
}

registerDomain({id:'skill_evolution',initialState:emptySkillEvolution,
    load:saved=>{state=readSkillEvolution(saved,SKILL_EVOLUTIONS);},
    save:()=>Object.keys(state.choices).length?structuredClone(state):undefined,
    refresh});
