import {definePathRow} from '../progression_path.js';

export const PATROL_RANKS = ['Apprentice', 'Dependable worker', 'Mentor'];
export const WATCHCRAFT_REHEARSALS = 5;
export const WATCHCRAFT_ROLE_SUPPLEMENT = 5;
export function roleLadder(id,world,label,stages,thresholds) {
    return definePathRow({path:{id,world,label,shape:'ladder',stages:stages.map((name,i)=>({
        id:'level'+i,label:name,grants:[],crossings:i?[{id:'practice',type:'quota',label:name,fact:'practice.level',need:i}]:[]
    }))}, tracks:{practice:{kind:'table',values:thresholds}},
    steps:Object.fromEntries(stages.slice(1).map((_,i)=>['level'+(i+1),{open:'auto'}]))});
}

export const villageRoles = {
    slots:[{}, {requires:'promoted'}],
    roles:{
        patrol:{row:roleLadder('patrol','base.frontier','Village patrol',PATROL_RANKS,[1,2]),
            activity:'promotion',track:'practice'},
        watchcraft:{row:roleLadder('watchcraft','base.frontier','Watchcraft',['Learner','Observer','Practitioner'],[1,WATCHCRAFT_REHEARSALS]),
            activity:'watchcraft-rehearsal',track:'practice'}
    },
    changes:{'join-watchcraft':{from:[],to:'watchcraft',entryPractice:'rehearsals'}}
};
