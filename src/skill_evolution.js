// Name tiers are projections of native levels. Chosen forms own only their lineage.
export const SKILL_EVOLUTION_REVISION = 4;
export const emptySkillEvolution = () => ({revision:SKILL_EVOLUTION_REVISION,choices:{}});

export function automaticSkillTiers(from,names) {
    return Object.entries(names).map(([level,name])=>({
        from,policy:'EV1',threshold:Number(level),requirements:{},automatic:true,
        targets:[{id:from,name,gains:{name},costs:[],restrictions:{},retainSource:true}],
    })).sort((a,b)=>a.threshold-b.threshold);
}

export function skillTierName(tiers,level) {
    if(tiers.length===1)return tiers[0].targets[0].name;
    return tiers.findLast(row=>level>=row.threshold)?.targets[0].name;
}

export function skillTierEvent(from,previous,current) {
    if(previous!==current)return {type:'skill-tier-changed',from,previous,current};
}

const matches = (context,requirements) =>
    Object.entries(requirements).every(([key,value])=>context[key]===value);

export const combinesSkills = row => row.policy==='EV4'||row.policy==='EV5';
export const evolvesPath = row => row.policy==='EV6';
const replacesSkill = row => row.policy==='EV2'||row.policy==='EV3'||combinesSkills(row)||evolvesPath(row);
const sources = row => row.sources ?? [{id:row.from,level:row.threshold}];

export function skillEvolutionEligible(row,level,context) {
    return level>=row.threshold&&(row.afterThresholdXP===undefined||context.xp>=context.thresholdXP+row.afterThresholdXP)&&
        matches(context,row.requirements)&&(!combinesSkills(row)||sources(row).every(part=>context.lineages?.[part.id]?.level>=part.level));
}

export function validateEvolutionRows(rows,worlds) {
    const ids = new Set();
    for(const row of rows){
        const world=worlds[row.requirements.world];
        const count=new Set(row.targets.map(target=>target.id)).size;
        const shape=world&&(world.primary===row.policy||world.mix.includes(row.policy))&&count===row.targets.length&&count>0;
        const transforms=row.targets.every(target=>target.id!==row.from&&!target.retainSource&&target.gains.function);
        const grades=row.policy!=='EV3'||world?.grades?.includes(row.grade)&&row.targets.every(target=>
            world.grades.indexOf(target.grade)>world.grades.indexOf(row.grade));
        const parts=sources(row), group=!combinesSkills(row)||
            (row.policy==='EV4'?parts.length===2:parts.length>=3)&&parts[0].id===row.from&&parts[0].level===row.threshold&&
            new Set(parts.map(part=>part.id)).size===parts.length&&parts.every(part=>part.id&&Number.isSafeInteger(part.level)&&part.level>0)&&
            row.targets.every(target=>!parts.some(part=>part.id===target.id))&&['practice','rest'].includes(row.offerOn);
        if(ids.has(row.id)||!shape||!grades||!group||replacesSkill(row)&&!transforms||row.policy==='EV2'&&(count<2||count>3)||
            evolvesPath(row)&&!row.carryText){
            throw Error('Invalid skill evolution row: '+row.id);
        }
        ids.add(row.id);
    }
    return rows;
}

export function offerSkillEvolution(state,row,level,context) {
    if(Object.hasOwn(state.choices,row.id)||!skillEvolutionEligible(row,level,context)||
        (row.offerOn&&row.offerOn!==context.trigger))return null;
    return {
        state:{...state,choices:{...state.choices,[row.id]:{status:'waiting',level}}},
        event:{type:'skill-evolution-waiting',from:row.from,evolution:row.id},
    };
}

// Quote from current facts. Settlement rechecks these same facts before a choice
// is written. No stamp, elapsed duration or UI state is part of either operation.
export function quoteSkillEvolution(state,row,level,context) {
    const eligible=state.choices[row.id]?.status==='waiting'&&skillEvolutionEligible(row,level,context);
    const lineages=combinesSkills(row)?sources(row).map(({id})=>({id,...context.lineages?.[id]})):[];
    return {eligible,lineages,targets:row.targets};
}

export function chooseSkillEvolution(state,row,id,level,context) {
    const choice=state.choices[row.id];
    if(choice?.status!=='waiting')throw Error('This skill choice is no longer waiting.');
    const quote=quoteSkillEvolution(state,row,level,context);
    const target=quote.targets.find(target=>target.id===id);
    if(!target)throw Error('This form is not offered.');
    if(!quote.eligible)throw Error(row.requirementText);
    return {
        state:{...state,choices:{...state.choices,[row.id]:{...choice,status:'chosen',target:id}}},
        event:{type:'skill-evolution-chosen',from:row.from,evolution:row.id,target:id,
            ...(combinesSkills(row)?{lineages:quote.lineages}:{})},
        costs:target.costs,
    };
}

export function refuseSkillEvolution(state,row) {
    if(!combinesSkills(row)||state.choices[row.id]?.status!=='waiting')throw Error('This skill choice is no longer waiting.');
    return {state:{...state,choices:{...state.choices,[row.id]:{...state.choices[row.id],status:'refused'}}},
        event:{type:'skill-evolution-refused',from:row.from,evolution:row.id}};
}

export function chosenSkillForm(state,row) {
    const choice=state.choices[row.id];
    return choice?.status==='chosen'?row.targets.find(target=>target.id===choice.target):undefined;
}

// A native XP slot is the lineage. Exactly one active identity occupies it.
export function activeSkillForm(state,rows,lineage) {
    for(const row of rows){
        if(!replacesSkill(row)||!sources(row).some(part=>part.id===lineage))continue;
        const form=chosenSkillForm(state,row);
        if(form)return form;
    }
}

// One observer-safe identity for each active group. The original XP objects
// still feed their existing practice, caps and bonuses under the new identity.
export function mergedSkillView(state,rows,lineage,readLineage) {
    for(const row of rows){
        if(!combinesSkills(row)||!sources(row).some(part=>part.id===lineage))continue;
        const form=chosenSkillForm(state,row);
        if(form)return {id:form.id,name:form.name,primary:row.from===lineage,description:form.description,
            lineages:sources(row).map(({id})=>({id,...readLineage(id)}))};
    }
}

export function activeSkillFunction(state,rows,lineage,trigger,context) {
    const form=activeSkillForm(state,rows,lineage);
    if(!form||!matches(context,form.restrictions))return;
    const ability=trigger==='body-effect'?form.gains.body:form.gains.function;
    if(ability?.trigger===trigger)return {...ability,name:form.name};
}

// A qualifying event keeps its ordinary settlement. Redirect only the
// critical surplus or scale the recovery by the part that reached the body.
export function settleSkinCritical(ability,damage,ordinary,armored) {
    if(ability?.mode!=='deflect-critical'||damage<=ordinary)return {damage,saved:0};
    const result=armored?Math.round(10*(damage-(damage-ordinary)*ability.armoredShare))/10:ordinary;
    return {damage:result,saved:Math.round((damage-result)*10)/10};
}

export function settleSkinStamina(ability,{damage,raw,armored,missing}) {
    if(ability?.mode!=='restore-stamina'||!(damage>0)||!(missing>0))return 0;
    const share=armored?Math.min(ability.armoredCap,damage/Math.max(damage,raw)):1;
    return Math.min(missing,Math.max(0.01,Math.round(ability.amount*share*100)/100));
}

export function settleSkinBodyEffect(ability,effect,minutes) {
    if(ability?.mode!=='shorten-effect'||!ability.effects.includes(effect)||!(minutes>0))return minutes;
    return Math.max(1,Math.ceil(minutes*ability.share));
}

export function settleSkillRecovery(state,rows,lineage,trigger,context,missing) {
    const action=activeSkillFunction(state,rows,lineage,trigger,context);
    if(action?.mode!=='restore-stamina'||!(missing>0))return null;
    const share=context.healthy===false?(action.injuredShare??1):1;
    return {name:action.name,stamina:Math.min(action.amount*share,missing)};
}

// The participating practice owns this use. Base XP and the acquired form's
// practice both settle through the existing native XP owner.
export function evolveSkillPractice(state,row,baseXP,context) {
    const target=chosenSkillForm(state,row);
    if(!target||replacesSkill(row)||!matches(context,target.restrictions))return {sourceXP:baseXP,extra:[]};
    const {sourceMultiplier=1,practiceXP,companion}=target.gains;
    return {
        sourceXP:target.retainSource?baseXP*sourceMultiplier:0,
        extra:[[target.id,practiceXP],...(companion?[[companion.skill,companion.xp]]:[])],
    };
}

export function readSkillEvolution(saved,rows) {
    if(saved===undefined)return emptySkillEvolution();
    const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
    if(!record(saved)||![1,2,3,SKILL_EVOLUTION_REVISION].includes(saved.revision)||!record(saved.choices)||
      Object.keys(saved).length!==2)throw Error('Unsupported skill evolution save revision.');
    for(const [id,choice] of Object.entries(saved.choices)){
        const row=rows.find(row=>row.id===id);
        if(!row||saved.revision===1&&replacesSkill(row)||saved.revision<3&&combinesSkills(row)||saved.revision<4&&evolvesPath(row)||
          !record(choice)||!Number.isSafeInteger(choice.level)||choice.level<row.threshold||
          !((choice.status==='waiting'||combinesSkills(row)&&choice.status==='refused')&&Object.keys(choice).length===2||
            choice.status==='chosen'&&Object.keys(choice).length===3&&row.targets.some(target=>target.id===choice.target))){
            throw Error('Invalid saved skill evolution: '+id);
        }
    }
    return {revision:SKILL_EVOLUTION_REVISION,choices:structuredClone(saved.choices)};
}
