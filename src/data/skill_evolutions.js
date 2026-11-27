import {combinesSkills,readSkillEvolution,validateEvolutionRows} from '../skill_evolution.js';

const village={world:'base.frontier'};
const practice={...village,location:'Village',activity:'weightlifting'};
export const SKILL_EVOLUTION_WORLDS={
    'base.frontier':{primary:'EV1',mix:['EV2','EV3','EV4','EV5','specialization'],grades:['Common','Uncommon']},
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
    trainingText:'Trains: unarmored.',
    targets:[
        {id:'village.tempered-skin',name:'Tempered skin',costs:[],restrictions:village,
            description:'Works on hits that get through armor. Removes a critical’s extra damage on bare skin, or half through armor. New bleeding lasts 25% less time.',
            gains:{function:{trigger:'enemy-critical',mode:'deflect-critical',armoredShare:0.5},
                body:{trigger:'body-effect',mode:'shorten-effect',effects:['Bleeding'],share:0.75}}},
        {id:'village.breathing-skin',name:'Breathing skin',costs:[],restrictions:village,
            description:'Works on hits that get through armor. Restores 1 missing stamina on bare skin, or less through armor. New poison lasts 25% less time.',
            gains:{function:{trigger:'enemy-hit',mode:'restore-stamina',amount:1,armoredCap:0.75},
                body:{trigger:'body-effect',mode:'shorten-effect',effects:['Slight food poisoning','Dragonfly venom','Dragonfly queen venom'],share:0.75}}},
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
},{
    id:'village.counterstep',policy:'EV4',from:'Evasion',threshold:2,offerOn:'practice',
    sources:[{id:'Evasion',level:2},{id:'Combat',level:2}],
    requirements:village,requirementText:'Reach level 2 in Evasion and Combat in the Village life.',
    targets:[{id:'village.counterstep-form',name:'Counterstep',costs:[],restrictions:village,
        description:'Without a shield, recover 1 missing stamina each time you dodge an enemy attack.',
        gains:{function:{trigger:'enemy-dodged',mode:'restore-stamina',amount:1}}}],
},{
    id:'village.recovery',policy:'EV5',from:'Patience',threshold:1,offerOn:'rest',
    sources:[{id:'Patience',level:1},{id:'Breathing',level:1},{id:'Regeneration',level:1}],
    requirements:village,requirementText:'Reach level 1 in Patience, Breathing and Regeneration, then start sleeping.',
    targets:[{id:'village.quiet-recovery',name:'Quiet recovery',costs:[],restrictions:village,
        description:'While sleeping, recover up to 1 extra stamina each minute when injured or 2 at full health.',
        gains:{function:{trigger:'sleep-stamina',mode:'restore-stamina',amount:2,injuredShare:0.5}}}],
}],SKILL_EVOLUTION_WORLDS);

export function validateSkillEvolutionEnvelope(envelope) {
    const state=readSkillEvolution(envelope.skill_evolution,SKILL_EVOLUTIONS);
    const native=envelope.levels?.person?.main_character?.skill_xp;
    const xp=id=>native?.[id]??envelope.skills?.[id]?.total_xp??0;
    for(const row of SKILL_EVOLUTIONS){
        const choice=state.choices[row.id];
        if(row.policy!=='specialization'&&choice&&!(xp(row.from)>0))throw Error('Evolved skill needs its original XP lineage.');
        if(combinesSkills(row)&&choice&&row.sources.some(part=>!(xp(part.id)>0))){
            throw Error('Merged skill needs all of its original XP lineages.');
        }
        for(const target of row.targets)if(xp(target.id)>0&&(row.policy!=='specialization'||choice?.target!==target.id)){
            throw Error('Practice needs its chosen skill form and its original XP owner.');
        }
    }
    return state;
}
