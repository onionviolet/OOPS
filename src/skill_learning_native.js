import {registerDomain} from './domain_registry.js';
import {quoteLearning} from './skill_learning.js';
import {watchcraftLesson as lesson} from './data/skill_learning.js';

import {villageRoleView} from './village_roles.js';

let ports;
registerDomain({id:'role_stack',projection:name=>{
    if(name!=='growth'||!ports)return;
    const {career,world,place,available,patrolForm}=ports.read();
    if(world!=='base.frontier')return;
    const view=villageRoleView(career,patrolForm);
    return {id:'role-stack',name:'Village roles',summary:view.summary,waiting:view.waiting,
        actions:view.waiting?[{label:'Take the Watchcraft role',fact:view.terms,
            reason:place!=='Village'||!available?'Speak to Tessa when free in Village.':undefined,
            run:()=>ports.enroll(view.fingerprint)}]:[]};
}});
export function configureLearning(adapter){ports=adapter;}
registerDomain({id:'learning_offer',projection:name=>{
    if(name!=='growth'||!ports)return;
    const {career,known,world,place,available}=ports.read();
    if(world!=='base.frontier'||career.rank<1||known)return;
    const quote=quoteLearning(lesson,career.watchcraft.tutorMinutes,{promoted:career.rank>=1});
    return {id:'learn-watchcraft',name:'Learn Watchcraft with '+quote.teacher,
        summary:quote.practice+'. '+quote.timeLeft+' minutes remain. '+quote.terms,
        actions:[{label:'Study Watchcraft',fact:'Practice with Tessa in Village. Your current work continues until you choose the lesson.',
            reason:career.watchcraft.tutoring?'Lesson underway. Continue Village meditation.':place!=='Village'?'Speak to Tessa in Village.':!available?'Finish your current work first.':undefined,
            run:()=>ports.start()}]};
}});
