// Name tiers are projections of native levels. Chosen forms own only their lineage.
export const SKILL_EVOLUTION_REVISION = 1;
export const emptySkillEvolution = () => ({revision:SKILL_EVOLUTION_REVISION,choices:{}});

export function automaticSkillTiers(from,names) {
    return Object.entries(names).map(([level,name])=>({
        from,threshold:Number(level),requirements:{},automatic:true,
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

export function offerSkillEvolution(state,row,level,context) {
    if(Object.hasOwn(state.choices,row.id)||level<row.threshold||!matches(context,row.requirements))return null;
    return {
        state:{...state,choices:{...state.choices,[row.id]:{status:'waiting',level}}},
        event:{type:'skill-evolution-waiting',from:row.from,evolution:row.id},
    };
}

export function chooseSkillEvolution(state,row,id,level,context) {
    const choice=state.choices[row.id];
    if(choice?.status!=='waiting')throw Error('This skill choice is no longer waiting.');
    const target=row.targets.find(target=>target.id===id);
    if(!target)throw Error('This form is not offered.');
    if(level<row.threshold||!matches(context,row.requirements))throw Error(row.requirementText);
    return {
        state:{...state,choices:{...state.choices,[row.id]:{...choice,status:'chosen',target:id}}},
        event:{type:'skill-evolution-chosen',from:row.from,evolution:row.id,target:id},
        costs:target.costs,
    };
}

export function chosenSkillForm(state,row) {
    const choice=state.choices[row.id];
    return choice?.status==='chosen'?row.targets.find(target=>target.id===choice.target):undefined;
}

// The participating practice owns this use. Base XP and the acquired form's
// practice both settle through the existing native XP owner.
export function evolveSkillPractice(state,row,baseXP,context) {
    const target=chosenSkillForm(state,row);
    if(!target||!matches(context,target.restrictions))return {sourceXP:baseXP,extra:[]};
    const {sourceMultiplier=1,practiceXP,companion}=target.gains;
    return {
        sourceXP:target.retainSource?baseXP*sourceMultiplier:0,
        extra:[[target.id,practiceXP],...(companion?[[companion.skill,companion.xp]]:[])],
    };
}

export function readSkillEvolution(saved,rows) {
    if(saved===undefined)return emptySkillEvolution();
    const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
    if(!record(saved)||saved.revision!==SKILL_EVOLUTION_REVISION||!record(saved.choices)||
      Object.keys(saved).length!==2)throw Error('Unsupported skill evolution save revision.');
    for(const [id,choice] of Object.entries(saved.choices)){
        const row=rows.find(row=>row.id===id);
        if(!row||!record(choice)||!Number.isSafeInteger(choice.level)||choice.level<row.threshold||
          !(choice.status==='waiting'&&Object.keys(choice).length===2||
            choice.status==='chosen'&&Object.keys(choice).length===3&&row.targets.some(target=>target.id===choice.target))){
            throw Error('Invalid saved skill evolution: '+id);
        }
    }
    return structuredClone(saved);
}
