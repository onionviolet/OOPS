import {createPosition,trackLevel} from './progression_path.js';
import {advanceRoles, readRoleStack, quoteRoleChange, settleRoleChange} from './role_stack.js';
import {villageRoles as policy,WATCHCRAFT_ROLE_SUPPLEMENT} from './data/role_stacks.js';

export function readVillageRoles(career) {
    if (career.roles !== undefined) {
        const stack=readRoleStack(policy,career.roles);
        for (const record of stack.positions) {
            const track=policy.roles[record.path].row.tracks.practice;
            if(record.position!==trackLevel(track,record.tracks.practice))throw Error('Role level disagrees with earned practice.');
        }
        return stack;
    }
    return advanceRoles(policy,readRoleStack(policy,createPosition(policy.roles.patrol.row)), 'promotion',career.rank);
}
export function growVillageRole(career,activity,gain) {
    return advanceRoles(policy,readVillageRoles(career),activity,gain);
}
const roleFacts = career => ({promoted:career.rank>=1,rehearsals:career.watchcraft.practiceMinutes});
export function enrollWatchcraft(career,fingerprint) {
    const roles = settleRoleChange(policy,readVillageRoles(career),'join-watchcraft',roleFacts(career),fingerprint);
    return {...career,roles};
}
export function villageRoleView(career, patrolForm) {
    const roles = readVillageRoles(career);
    const tracks = roles.positions.map(record=>{
        const path = policy.roles[record.path].row.path;
        const form=record.path==='patrol'?patrolForm:null;
        return {id:form?.id??path.id,name:form?.name??path.label,level:record.position+1,stage:path.stages[record.position].label};
    });
    const waiting = career.rank>=1 && tracks.length===1;
    const quote=waiting?quoteRoleChange(policy,roles,'join-watchcraft',roleFacts(career)):null;
    const entry=quote?.effects[0].after.positions.find(p=>p.path==='watchcraft');
    return {tracks,waiting,summary:tracks.map(t=>t.name+' level '+t.level+' ('+t.stage+')').join(' · '),
        terms:entry?'Keep your patrol rank. Enter Watchcraft at level '+(entry.position+1)+' with '+entry.tracks.practice+' rehearsed minutes. Advance with Village meditation. At five rehearsed minutes, a completed Watchcraft patrol pays '+WATCHCRAFT_ROLE_SUPPLEMENT+' extra coins. No fee.':'',
        fingerprint:quote?.fingerprint};
}
