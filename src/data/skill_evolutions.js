import {readSkillEvolution,validateEvolutionRows} from '../skill_evolution.js';

const village={world:'base.frontier'};
const practice={...village,location:'Village',activity:'weightlifting'};
export const SKILL_EVOLUTION_WORLDS={
    'base.frontier':{primary:'EV1',mix:['EV2','EV3','specialization'],grades:['Common','Uncommon']},
};

export const SKILL_EVOLUTIONS=validateEvolutionRows([{
    id:'village.grain-lifts',policy:'specialization',from:'Weightlifting',threshold:3,
    requirements:practice,requirementText:'Carry grain bags in the Village to choose a lifting form.',
    practiceText:'Applies only while carrying grain bags in the Village.',
    targets:[
        {id:'Grain lifting: heavy sets',name:'Heavy sets',retainSource:true,costs:[],restrictions:practice,
            gains:{practiceXP:1,sourceMultiplier:1.5}},
        {id:'Grain lifting: balanced lifts',name:'Balanced lifts',retainSource:true,costs:[],restrictions:practice,
            gains:{practiceXP:1,companion:{skill:'Equilibrium',xp:1}}},
    ],
},{
    id:'village.iron-skin-form',policy:'EV2',from:'Iron skin',threshold:30,afterThresholdXP:8,
    requirements:village,requirementText:'Practice Iron skin past level 30 in the Village life.',
    targets:[
        {id:'village.tempered-skin',name:'Tempered skin',costs:[],restrictions:{...village,unarmored:true},
            description:'While unarmored, turn an incoming critical strike into an ordinary hit.',
            gains:{function:{trigger:'enemy-critical',mode:'deflect-critical'}}},
        {id:'village.breathing-skin',name:'Breathing skin',costs:[],restrictions:{...village,unarmored:true},
            description:'While unarmored, recover 1 missing stamina each time an enemy lands a hit.',
            gains:{function:{trigger:'enemy-hit',mode:'restore-stamina',amount:1}}},
    ],
},{
    id:'village.sleeping-grade',policy:'EV3',from:'Sleeping',threshold:2,grade:'Common',
    requirements:village,requirementText:'Reach Sleeping level 2 in the Village life.',
    targets:[
        {id:'village.restorative-sleep',name:'Restorative sleep',grade:'Uncommon',costs:[],restrictions:village,
            description:'While sleeping, restore 25% more health.',
            gains:{function:{trigger:'sleep-health',mode:'scale-recovery',multiplier:1.25}}},
        {id:'village.deep-sleep',name:'Deep sleep',grade:'Uncommon',costs:[],restrictions:village,
            description:'While sleeping, restore 25% more stamina.',
            gains:{function:{trigger:'sleep-stamina',mode:'scale-recovery',multiplier:1.25}}},
    ],
}],SKILL_EVOLUTION_WORLDS);

export function validateSkillEvolutionEnvelope(envelope) {
    const state=readSkillEvolution(envelope.skill_evolution,SKILL_EVOLUTIONS);
    const native=envelope.levels?.person?.main_character?.skill_xp;
    const xp=id=>native?.[id]??envelope.skills?.[id]?.total_xp??0;
    for(const row of SKILL_EVOLUTIONS){
        const choice=state.choices[row.id];
        if(row.policy!=='specialization'&&choice&&!(xp(row.from)>0))throw Error('Evolved skill needs its original XP lineage.');
        for(const target of row.targets)if(xp(target.id)>0&&(row.policy!=='specialization'||choice?.target!==target.id)){
            throw Error('Practice needs its chosen skill form and its original XP owner.');
        }
    }
    return state;
}
