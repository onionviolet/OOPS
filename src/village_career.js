// Original proposal: one Village patrol career, using native time and wages.
import {natural} from './basics.js';
export const CAREER_RANKS = ['Apprentice', 'Dependable worker', 'Mentor'];
export const KIT_DEBT = 50;
export const WATCHCRAFT_BOOK = 'Tessa’s watchcraft notes';
export const WATCHCRAFT_READING = 6;
export const WATCHCRAFT_PRACTICE = 5;
export const WATCHCRAFT_BONUS = 10;
const emptyStudy = () => ({issued:false,practiceMinutes:0,used:false,notesIssued:false,tutorMinutes:0,tutoring:false});
const check = (ok, message) => {if(!ok) throw new Error(`Village career: ${message}.`);};
export function createVillageCareer() {
    return {schema:4,rank:0,shifts:0,completed:0,returned:0,loan:null,debt:0,lastShift:null,watchcraft:emptyStudy(),recruit:null};
}
export function validateVillageCareer(s) {
    check(s && [1,2,3,4].includes(s.schema) && Number.isInteger(s.rank) && s.rank>=0 && s.rank<3,'unsupported rank or schema');
    check([s.shifts,s.completed,s.returned,s.debt].every(natural) && s.returned<=s.completed && s.completed<=s.shifts,'invalid counts');
    check(s.loan===null || (s.loan && ['active','return_due','debt'].includes(s.loan.status) && typeof s.loan.completed==='boolean'),'invalid kit custody');
    check(s.debt===(s.loan?.status==='debt'?KIT_DEBT:0),'invalid kit debt');
    check(!s.loan || (s.shifts>0 && (s.loan.status!=='active' || !s.loan.completed)),'invalid active shift');
    check(s.lastShift===null || (s.lastShift && natural(s.lastShift.number) && s.lastShift.number>0 && s.lastShift.number<=s.shifts && typeof s.lastShift.completed==='boolean' && ['due','returned','kept','paid'].includes(s.lastShift.kit)),'invalid shift memory');
    check(s.rank===0 || (s.completed>=(s.rank===1?2:5) && s.returned>=(s.rank===1?2:5)),'unearned rank');
    if(s.schema>=2) {
        const w=s.watchcraft;
        check(w && typeof w.issued==='boolean' && natural(w.practiceMinutes) && w.practiceMinutes<=WATCHCRAFT_PRACTICE && typeof w.used==='boolean','invalid watchcraft study');
        check(!w.issued || s.rank>=1,'watchcraft needs Tessa’s promotion');
        check(!w.practiceMinutes || w.issued,'practice needs the offered method');
        check(!w.used || (w.practiceMinutes===WATCHCRAFT_PRACTICE && s.completed>0),'unearned watchcraft use');
        check(!s.loan?.watchcraft || (s.loan.status==='active' && w.practiceMinutes===WATCHCRAFT_PRACTICE),'unpracticed patrol method');
        check(!s.loan || s.loan.watchcraft==null || typeof s.loan.watchcraft==='boolean','invalid patrol method');
    }
    if(s.schema>=3) {
        const r=s.recruit;
        check(r===null || (s.rank===2 && r && r.id==='iona' && typeof r.known==='boolean' && natural(r.practiceMinutes) && r.practiceMinutes<=WATCHCRAFT_PRACTICE && typeof r.taughtBy==='string' && r.taughtBy.length<=48 && natural(r.soloPatrols) && (r.soloRemaining===null || (natural(r.soloRemaining) && r.soloRemaining>0 && r.soloRemaining<=120))), 'invalid recruit');
        if(r) {
            check(!r.known || (r.taughtBy.length>0 && s.watchcraft.practiceMinutes===WATCHCRAFT_PRACTICE),'recruit knowledge needs a practiced teacher');
            check(!r.practiceMinutes || (r.known && r.taughtBy.length>0),'recruit practice needs a remembered teacher');
            check(!(r.soloPatrols || r.soloRemaining) || r.practiceMinutes===WATCHCRAFT_PRACTICE,'solo patrol needs practiced watchcraft');
        }
        check(!s.loan?.teaching || (r && r.known && s.loan.status==='active' && s.loan.watchcraft),'teaching needs a practiced shared patrol');
        check(!s.loan || s.loan.teaching==null || typeof s.loan.teaching==='boolean','invalid teaching round');
    }
    if(s.schema===4) {
        const w=s.watchcraft,r=s.recruit;
        check(typeof w.notesIssued==='boolean' && (!w.notesIssued || w.issued),'invalid notes custody history');
        check(natural(w.tutorMinutes) && w.tutorMinutes<=WATCHCRAFT_READING && typeof w.tutoring==='boolean','invalid personal instruction');
        check(!w.tutorMinutes || w.issued,'instruction needs Tessa’s offer');
        check(!w.tutoring || (w.issued && w.tutorMinutes<WATCHCRAFT_READING),'invalid active instruction');
        if(r) {
            check(natural(r.favors) && Array.isArray(r.teachingTerms) && r.teachingTerms.length<=5 && r.teachingTerms.every(t=>TEACHING_TERMS.includes(t)),'invalid teaching terms or favors');
            check(r.favors<=1 && (!r.favors || (r.practiceMinutes===5 && r.teachingTerms.includes('favor'))),'unearned favor');
            check(['none','offered','accepted','declined'].includes(r.tuition) && (r.tuition==='none' || r.soloPatrols>0),'invalid tuition');
            check(typeof r.covering==='boolean' && (!r.covering || r.soloRemaining!==null),'invalid covered shift');
            check(!r.known || r.teachingTerms.length>0,'missing teaching memory');
        }
        if(s.loan?.teaching)check(TEACHING_TERMS.includes(s.loan.teachingTerm) && natural(s.loan.teachingMinutes) && s.loan.teachingMinutes<=120,'invalid teaching contract');
    }
    return s;
}
export function migrateVillageCareer(save) {
    // Missing optional field means no invented career, debt, promotion or kit.
    const s=structuredClone(validateVillageCareer(save.village_career ?? createVillageCareer()));
    // Additive schema-1 migration: preserve custody/history, grant no method.
    if(s.schema===1) {s.schema=2;s.watchcraft=emptyStudy();}
    if(s.schema===2) {s.schema=3;s.recruit=null;}
    if(s.schema===3) {
        s.schema=4;s.watchcraft={...s.watchcraft,notesIssued:s.watchcraft.issued,tutorMinutes:0,tutoring:false};
        if(s.recruit)s.recruit={...s.recruit,favors:0,teachingTerms:s.recruit.known?['pay']:[],covering:false,tuition:'none'};
        if(s.loan?.teaching){s.loan.teachingTerm='pay';s.loan.teachingMinutes=s.recruit.practiceMinutes;}
    }
    return validateVillageCareer(s);
}
export function beginVillageShift(state,known=false) {
    const s=migrateVillageCareer({village_career:state});check(!s.loan,'return the loaned kit or settle its debt before another shift');
    s.shifts++;s.loan={status:'active',completed:false,watchcraft:known && s.watchcraft.practiceMinutes===WATCHCRAFT_PRACTICE};return validateVillageCareer(s);
}
export function finishVillageShift(state,completed) {
    const s=migrateVillageCareer({village_career:state});check(s.loan?.status==='active','no active career shift');
    if(completed) {s.completed++;if(s.loan.watchcraft)s.watchcraft.used=true;}
    s.loan={status:'return_due',completed};s.lastShift={number:s.shifts,completed,kit:'due'};
    return validateVillageCareer(s);
}
export function resolveVillageKit(state,choice) {
    const s=migrateVillageCareer({village_career:state});check(['return_due','debt'].includes(s.loan?.status),'finish your shift before resolving the kit');
    check(['return','keep','pay'].includes(choice),'unknown kit choice');
    if(choice==='keep') {check(s.loan.status==='return_due','debt is already recorded');s.loan.status='debt';s.debt=KIT_DEBT;s.lastShift.kit='kept';}
    else {if(choice==='pay')check(s.loan.status==='debt','no debt to pay');
        if(choice==='return' && s.loan.completed)s.returned++;
        s.lastShift.kit=choice==='return'?'returned':'paid';s.loan=null;s.debt=0;}
    return validateVillageCareer(s);
}
export function villagePromotionRequirements(state) {
    const s=validateVillageCareer(state);if(s.rank===2)return [];
    const target=s.rank===0?2:5, reasons=[];
    if(s.completed<target)reasons.push(`Complete ${target} full shifts (${s.completed}/${target}).`);
    if(s.returned<target)reasons.push(`Return ${target} completed-shift kits (${s.returned}/${target}).`);
    if(s.loan)reasons.push(s.debt?`Clear the ${KIT_DEBT}-coin kit debt by returning the kit or paying.`:'Return the current loaned kit.');
    return reasons;
}
export function promoteVillageCareer(state) {
    const s=migrateVillageCareer({village_career:state});check(s.rank<2,'you already mentor the patrol');
    const unmet=villagePromotionRequirements(s);check(!unmet.length,unmet.join(' '));s.rank++;return validateVillageCareer(s);
}
export function villageColleagueMemory(state) {
    const s=validateVillageCareer(state),last=s.lastShift;
    if(!last)return 'Tessa, your patrol colleague: “I’ll lend you our lantern and baton. Walk the whole two-hour round, then bring them back.”';
    const work=last.completed?'you stayed for the whole round':'you left before the round was finished';
    const kit={due:'I’m still waiting for our lantern and baton.',returned:'You brought the kit back. I can rely on that.',kept:'You kept our kit. The 50-coin debt is in the ledger.',paid:'You paid for the missing kit. We still need people who return what they borrow.'}[last.kit];
    return `Tessa remembers shift ${last.number}: “Last time, ${work}. ${kit}”`;
}

// Knowledge stays in native book progress; practice and first use stay with this career.
export function issueWatchcraft(state) {
    const s=migrateVillageCareer({village_career:state});
    check(s.rank>=1,'become a Dependable worker before asking for the notes');
    check(!s.watchcraft.notesIssued,'Tessa already gave you her notes');
    s.watchcraft.issued=true;s.watchcraft.notesIssued=true;return validateVillageCareer(s);
}
export function practiceWatchcraft(state,{known,location,activity,worldId,alive=true}) {
    const s=migrateVillageCareer({village_career:state});
    if(known && s.watchcraft.issued && location==='Village' && worldId==='base.frontier' && activity==='meditating' && alive)
        s.watchcraft.practiceMinutes=Math.min(WATCHCRAFT_PRACTICE,s.watchcraft.practiceMinutes+1);
    return validateVillageCareer(s);
}
export function watchcraftPresentation(state,known) {
    const s=migrateVillageCareer({village_career:state}),practiced=known && s.watchcraft.practiceMinutes===WATCHCRAFT_PRACTICE;
    return {known,practiced,executable:practiced && s.loan?.status==='active' && s.loan.watchcraft===true,
        nextPatrol:practiced && !s.loan,practiceMinutes:s.watchcraft.practiceMinutes};
}
export function villageShiftBonus(state,completed) {
    validateVillageCareer(state);
    return completed && state.loan?.status==='active' && state.loan.watchcraft===true ? WATCHCRAFT_BONUS : 0;
}

// One junior uses the same known/practiced distinction, on the common played clock.
export const RECRUIT_NAME='Iona';
export const TEACHING_COST=10;
export const TEACHING_TERMS=['paid','pay','time','favor','free'];
export const COVER_PAYMENT=50;
export const SOLO_PAYMENT=10;
export function assignVillageRecruit(state) {
    const s=migrateVillageCareer({village_career:state});
    check(s.rank===2,'become a Mentor first');check(!s.recruit,'Iona is already assigned');
    s.recruit={id:'iona',known:false,practiceMinutes:0,taughtBy:'',soloPatrols:0,soloRemaining:null,favors:0,teachingTerms:[],covering:false,tuition:'none'};return validateVillageCareer(s);
}
export function beginVillageTeaching(state,known,teacher,term='paid') {
    const s=migrateVillageCareer({village_career:state});
    check(s.recruit && s.recruit.practiceMinutes<WATCHCRAFT_PRACTICE,'assign an untrained recruit first');
    check(known && s.loan?.status==='active' && s.loan.watchcraft,'teach on a new practiced Watchcraft patrol with the loaned kit');
    check(!s.loan.teaching,'already teaching on this round');
    check(typeof teacher==='string' && teacher.length>0 && teacher.length<=48,'teacher name');
    check(TEACHING_TERMS.includes(term),'unknown teaching terms');
    s.loan.teaching=true;s.loan.teachingTerm=term;s.loan.teachingMinutes=0;s.recruit.known=true;s.recruit.taughtBy=teacher;s.recruit.teachingTerms.push(term);return validateVillageCareer(s);
}
export function beginRecruitSolo(state,cover=false) {
    const s=migrateVillageCareer({village_career:state}),r=s.recruit;
    check(r && r.practiceMinutes===WATCHCRAFT_PRACTICE,'Iona must practice Watchcraft first');
    check(r.soloRemaining===null,'Iona is already on a solo patrol');
    if(cover){check(r.favors>0,'Iona owes no favor');r.favors--;}
    r.covering=cover;r.soloRemaining=120;return validateVillageCareer(s);
}
export function advanceVillageMentor(state,{inVillage,alive,patrolling}) {
    const s=migrateVillageCareer({village_career:state}),r=s.recruit;
    if(r && inVillage && alive) {
        if(patrolling && s.loan?.teaching) {
            s.loan.teachingMinutes=Math.min(120,s.loan.teachingMinutes+1);
            const before=r.practiceMinutes;r.practiceMinutes=Math.min(WATCHCRAFT_PRACTICE,before+1);
            if(before<5 && r.practiceMinutes===5 && s.loan.teachingTerm==='favor')r.favors++;
        }
        if(r.soloRemaining!==null) {r.soloRemaining--;if(r.soloRemaining===0){r.soloRemaining=null;r.soloPatrols++;r.covering=false;if(r.soloPatrols===1)r.tuition='offered';}}
    }
    return validateVillageCareer(s);
}
export function villageTeachingCost(state,completed) {
    return completed && state.loan?.teaching ? (state.loan.teachingTerm==='time'?60:state.loan.teachingTerm==='pay'||!state.loan.teachingTerm?TEACHING_COST:0) : 0;
}
export function villageTeachingStipend(state,completed) {return completed && state.loan?.teachingTerm==='paid'?10:0;}
export function resolveIonaTuition(state,choice) {
    const s=migrateVillageCareer({village_career:state});check(s.recruit?.tuition==='offered','no tuition offered');
    check(['accepted','declined'].includes(choice),'unknown tuition choice');s.recruit.tuition=choice;return validateVillageCareer(s);
}
export function villageTeachingBusy(state) {
    return !!state.loan?.teaching && (state.recruit.practiceMinutes<5 || (state.loan.teachingTerm==='time' && state.loan.teachingMinutes<120));
}
export function beginTessaInstruction(state) {
    const s=migrateVillageCareer({village_career:state});check(s.rank>=1,'become a Dependable worker first');
    check(!s.watchcraft.tutoring && s.watchcraft.tutorMinutes<6,'instruction already started or completed');
    s.watchcraft.issued=true;s.watchcraft.tutoring=true;return validateVillageCareer(s);
}
export function advanceTessaInstruction(state,{inVillage,alive,meditating}) {
    const s=migrateVillageCareer({village_career:state});
    if(s.watchcraft.tutoring && inVillage && alive && meditating){s.watchcraft.tutorMinutes++;if(s.watchcraft.tutorMinutes===6)s.watchcraft.tutoring=false;}
    return validateVillageCareer(s);
}
export function recruitMemory(state) {
    const r=state.recruit;if(!r)return 'Tessa can assign you one junior recruit.';
    const terms={paid:'Tessa paid you for training me as part of your Mentor job.',pay:'You taught on your shift; the post paid less because you patrolled less.',time:'You gave a whole unpaid shift to my lesson.',favor:'I promised to cover a shift for you.',free:'You taught me freely. Thank you.'}[r.teachingTerms?.at(-1)] || '';
    const history=r.teachingTerms?.length?` Teaching choices: ${r.teachingTerms.map(t=>({paid:'paid mentor',pay:'taught on your shift',time:'time',favor:'favor',free:'free'})[t]).join(', ')}. ${terms} Favors owed: ${r.favors}. Tuition: ${r.tuition==='accepted'?'accepted 5 coins from my first solo stipend':r.tuition==='declined'?'declined my tuition offer':r.tuition==='offered'?'I offer you 5 coins from my first solo stipend':'not offered yet'}.`:'';
    return (r.soloPatrols?`Iona: “${r.taughtBy} taught me Watchcraft. I completed ${r.soloPatrols} solo patrol${r.soloPatrols===1?'':'s'} for Tessa.”`:
        r.known?`Iona: “${r.taughtBy} showed me calm sector scanning. I have practiced ${r.practiceMinutes}/5 minutes.”`:'Iona: “Tessa assigned me to your patrol. Will you teach me Watchcraft?”')+history;
}
