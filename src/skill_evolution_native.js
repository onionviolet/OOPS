import {domainRegistry,registerDomain} from './domain_registry.js';
import {SKILL_EVOLUTIONS} from './data/skill_evolutions.js';
import {activeSkillForm,activeSkillFunction,chosenSkillForm,chooseSkillEvolution,combinesSkills,emptySkillEvolution,evolveSkillPractice,evolvesPath,
    mergedSkillView,offerSkillEvolution,quoteSkillEvolution,readSkillEvolution,refuseSkillEvolution,settleSkillRecovery,skillTierEvent} from './skill_evolution.js';
import {mountGrowthQueue,mountSkillGrowth} from './ui/skill_evolution.js';

const rows=new Map(SKILL_EVOLUTIONS.map(row=>[row.from,row]));
const sourceRows=new Map(SKILL_EVOLUTIONS.flatMap(row=>(row.sources??[{id:row.from}]).map(part=>[part.id,row])));
const displays=new Map();
const pathRows=SKILL_EVOLUTIONS.filter(evolvesPath);
let state=emptySkillEvolution(),ports,queue;

function readLineage(id) {
    const path=ports.path?.(id);
    if(path)return path;
    const skill=ports.skill(id);
    return {level:skill.getCurrentLvl(),xp:skill.getTotalXP()};
}

function progressContext(row,trigger) {
    if(evolvesPath(row))return {...ports.context(),trigger};
    const skill=ports.skill(row.from), xp=skill.getTotalXP(), scale=skill.xp_scaling;
    const thresholdXP=scale===1?skill.base_xp_cost*row.threshold:
        Math.round(100*skill.base_xp_cost*(1-scale**row.threshold)/(1-scale))/100;
    const lineages=row.sources&&Object.fromEntries(row.sources.map(part=>[part.id,readLineage(part.id)]));
    return {...ports.context(),xp,thresholdXP,lineages,trigger};
}

function eligibility(row,quote){
    if(!ports?.writable())return 'Restore saving before choosing a form.';
    if(!quote.eligible)return row.requirementText;
    return '';
}

function report(event,row){
    if(!event)return;
    const form=row&&chosenSkillForm(state,row);
    const subject=row?.sources?.map(part=>part.id).join(' + ')??row?.from;
    const text=event.type==='skill-tier-changed'? `Skill ${event.previous} upgraded to ${event.current}`:
        event.type==='skill-evolution-waiting'? `${subject} has a choice waiting in Growth.`:
        event.type==='skill-evolution-refused'? `Kept ${subject} as separate skills.`:
        row.policy==='specialization'? `${row.from}: chose ${form.name}.`:
            `${subject} became ${form.name}${form.grade?` (${form.grade})`:''}.`;
    ports.publish(event,text);
}

function choose(row,target){
    if(!ports.writable())throw Error('Restore saving before choosing a form.');
    const result=chooseSkillEvolution(state,row,target,readLineage(row.from).level,progressContext(row));
    if(result.costs.length)throw Error('This practice cannot settle that cost.');
    commitChoice(row,result);
}

function commitChoice(row,result) {
    ports.persist(result.state);
    state=result.state;
    report(result.event,row);
    if(evolvesPath(row))ports.repaintPath?.();
    else for(const part of row.sources??[{id:row.from}])ports.repaint(part.id);
    refresh();
}

function refuse(row) {
    if(!ports.writable())throw Error('Restore saving before declining a form.');
    commitChoice(row,refuseSkillEvolution(state,row));
}

function refresh(){
    if(!ports)return;
    const host=globalThis.document?.getElementById('skill_list');
    if(!queue&&host)queue=mountGrowthQueue(host,observePathGrowth);
    queue?.render(SKILL_EVOLUTIONS.filter(row=>state.choices[row.id]?.status==='waiting')
        .map(row=>{
            const quote=quoteSkillEvolution(state,row,readLineage(row.from).level,progressContext(row));
            return {row,quote,reason:eligibility(row,quote),choose:target=>choose(row,target),refuse:()=>refuse(row)};
        }),pathRows.map(row=>evolvedPath(row.from)).filter(Boolean),
        ['growth_points','ability_loadout','surplus_reserve','learning_offer','role_stack'].map(id=>domainRegistry.project(id,'growth')).filter(Boolean));
    for(const [id,{row,parent,render}] of displays){
        if(!parent.isConnected){displays.delete(id);continue;}
        const choice=state.choices[row.id];
        render(choice,choice&&chosenSkillForm(state,row),mergedGrowth(id));
    }
}

export function configureSkillEvolution(config){ports=config;}

export function attachSkillEvolution(skill,parent,open){
    const row=sourceRows.get(skill.skill_id);
    if(!row)return;
    displays.set(skill.skill_id,{row,parent,render:mountSkillGrowth(parent,row,open)});
    refresh();
}

export function reportNativeSkillTier(from,previous,current){
    report(skillTierEvent(from,previous,current));
}

export function observeSkillAward(skill,earned) {
    const row=sourceRows.get(skill.skill_id),choice=row&&state.choices[row.id];
    if(!earned||!row||!ports||choice&&(!combinesSkills(row)||choice.status==='refused'))return;
    const before=skill.getTotalXP();
    return () => {
        if(skill.getTotalXP()<=before)return;
        if(choice){refresh();return;}
        offer(row,'practice');
    };
}

function offer(row,trigger) {
    const next=offerSkillEvolution(state,row,readLineage(row.from).level,progressContext(row,trigger));
    if(!next)return;
    state=next.state;
    report(next.event,row);
    refresh();
}

export function observeGrowthRest() {
    if(!ports?.writable())return;
    for(const row of SKILL_EVOLUTIONS.filter(row=>row.offerOn==='rest'))offer(row,'rest');
}

export function observePathGrowth() {
    if(ports?.writable())for(const row of pathRows)offer(row,'rank');
}

export function evolvedPath(id){
    const row=rows.get(id);
    if(!ports||!row||!evolvesPath(row)||ports.context().world!==row.requirements.world)return;
    const form=chosenSkillForm(state,row);
    if(form)return {id:form.id,name:form.name,description:form.description,...readLineage(id)};
}

export function refreshGrowthQueue(){refresh();}
export function focusSkillGrowth(){refresh();queue?.focus();}
export const evolvedSkill = id => activeSkillForm(state,SKILL_EVOLUTIONS,id);
export const mergedGrowth = id => ports&&mergedSkillView(state,SKILL_EVOLUTIONS,id,readLineage);
export const settleGrowthRecovery = (id,trigger,context,missing) =>
    ports&&settleSkillRecovery(state,SKILL_EVOLUTIONS,id,trigger,{...ports.context(),...context},missing);
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
    commands:{form:evolvedSkill,use:evolvedUse,recovery:settleGrowthRecovery},
    projection:(name,id)=>name==='merged'?mergedGrowth(id):name==='path'?evolvedPath(id):undefined,
    refresh});
