import {readSkillEvolution} from '../skill_evolution.js';

const practice={world:'base.frontier',location:'Village',activity:'weightlifting'};
export const SKILL_EVOLUTIONS=[{
    id:'village.grain-lifts',from:'Weightlifting',threshold:3,
    requirements:practice,requirementText:'Carry grain bags in the Village to choose a lifting form.',
    practiceText:'Applies only while carrying grain bags in the Village.',
    targets:[
        {id:'Grain lifting: heavy sets',name:'Heavy sets',retainSource:true,costs:[],restrictions:practice,
            gains:{practiceXP:1,sourceMultiplier:1.5}},
        {id:'Grain lifting: balanced lifts',name:'Balanced lifts',retainSource:true,costs:[],restrictions:practice,
            gains:{practiceXP:1,companion:{skill:'Equilibrium',xp:1}}},
    ],
}];

export function validateSkillEvolutionEnvelope(envelope) {
    const state=readSkillEvolution(envelope.skill_evolution,SKILL_EVOLUTIONS);
    const native=envelope.levels?.person?.main_character?.skill_xp;
    for(const row of SKILL_EVOLUTIONS)for(const target of row.targets){
        const xp=native?.[target.id]??envelope.skills?.[target.id]?.total_xp??0;
        if(xp>0&&state.choices[row.id]?.target!==target.id)throw Error('Practice needs its chosen skill form.');
    }
    return state;
}
