import {HOME_PLACES as P,HOME_BUILDINGS as B,HOME_SITE,HOME_CAMPS,PACKED_TENT,homeKey as k} from './home_content.js';
import {progressKey,permitKey,BUILDER} from './home_work_content.js';
const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export const newHomeCondition=clock=>({integrity:100,wetness:0,rainMinutes:0,lastClock:clock});
export const conditionOf=h=>h?.condition||{integrity:100,wetness:0,rainMinutes:0};
export const homeSupportsRest=h=>conditionOf(h).integrity>20;
export const projectProgress=(project,c)=>c.resources?.[progressKey(project.home,project.kind)]||0;
export const projectLocation=project=>project.kind==='build'?HOME_SITE:P[project.home].location;
export function validateHomeBuilding(s,c) {
    for(const h of [...Object.values(s.properties),...(s.portable?[s.portable]:[])]) {
        if(h.condition){const q=h.condition;check(natural(q.integrity)&&q.integrity<=100&&natural(q.wetness)&&q.wetness<=1000&&natural(q.rainMinutes)&&q.rainMinutes<1920&&natural(q.lastClock)&&q.lastClock<=c.clock,'invalid structural condition');}
        check(h.weatherproof===undefined||typeof h.weatherproof==='boolean','invalid weatherproofing');
        if(h.id==='tent')check(HOME_CAMPS.includes(h.anchor),'portable shelter needs its actual permitted camp');
    }
    if(s.portable)check(s.portable.id==='tent'&&!s.properties.tent&&Object.keys(s.portable.stock).length===0&&Object.keys(s.portable.fixtures).length===0,'packed shelter must retain one empty structure');
    for(const [id,p]of Object.entries(s.projects||{})) {
        check(P[id]&&!P[id].legacy&&p.home===id&&['build','repair','weatherproof'].includes(p.kind)&&natural(p.required)&&p.required>0&&p.required<=120&&natural(p.at)&&p.at<=c.clock&&p.materials&&typeof p.materials==='object','invalid building project');
        check((p.kind==='build'?B[id]&&!s.properties[id]:!!s.properties[id])&&Object.entries(p.materials).every(([key,n])=>typeof JSON.parse(key).id==='string'&&natural(n)&&n>0),'project custody or site changed');
    }
}
export function advanceHomeCondition(h,c) {
    if(P[h.id].legacy)return;
    h.condition ||= newHomeCondition(c.clock);
    const q=h.condition,start=q.lastClock;
    if(c.clock<=start)return;
    // Native played-calendar intervals supply rain. Roof exposure is local data.
    const exposure={nest:4,burrow:8,shelter:1,tent:2}[h.id]||0;
    for(let at=start;at<c.clock;){const n=Math.min(c.clock-at,60-(at%60)),rain=c.weatherAt?.(at)?.raining===true;
        if(rain&&(exposure||q.integrity<80)){
            q.wetness=Math.min(1000,q.wetness+n*(h.weatherproof?1:2));
            if(exposure){const threshold=120*exposure*(h.weatherproof?2:1);q.rainMinutes+=n;const wear=Math.floor(q.rainMinutes/threshold);q.integrity=Math.max(0,q.integrity-wear);q.rainMinutes%=threshold;}
        }else q.wetness=Math.max(0,q.wetness-n);
        at+=n;
    }
    q.lastClock=c.clock;
}
export function settleHomeBuilding(s,c,makeHome,emit=()=>{}) {
    for(const h of Object.values(s.properties))advanceHomeCondition(h,c);
    for(const [id,p]of Object.entries(s.projects||{}))if(projectProgress(p,c)>=p.required) {
        let h=s.properties[id];
        if(p.kind==='build'){h=makeHome(id,c.clock);h.fixtures={};h.construction={at:c.clock,site:HOME_SITE};if(id==='tent')h.anchor=HOME_SITE;s.properties[id]=h;s.primary=id;}
        else if(p.kind==='repair'){h.condition ||= newHomeCondition(c.clock);h.condition.integrity=100;h.condition.rainMinutes=0;}
        else h.weatherproof=true;
        emit([{type:'resource',actor:'player',key:progressKey(id,p.kind),amount:-projectProgress(p,c)},{type:'fact',scope:'actor',actor:'player',key:permitKey(id,p.kind),value:false}]);
        delete s.projects[id];s.revision++;
        s.ledger.push({at:c.clock,text:`${P[id].name}: ${p.kind} work completed. Materials became the actual structure.`});s.ledger=s.ledger.slice(-40);
    }
    for(const h of Object.values(s.properties))for(const [prefix,field]of [['repair','integrity'],['dry','wetness']]){
        const key=`home.${prefix}.${h.id}`,value=c.resources?.[key]||0;if(!value)continue;
        h.condition ||= newHomeCondition(c.clock);h.condition[field]=prefix==='repair'?Math.min(100,h.condition[field]+value):Math.max(0,h.condition[field]-value*10);
        emit([{type:'resource',actor:'player',key,amount:-value}]);
    }
}
const repairMaterials=id=>id==='burrow'?{}:id==='nest'?{[k('Home fallen twigs')]:1,[k('Home dry grass')]:2}:{[k('Home fallen poles')]:1,[k('Home dry grass')]:2};
export function planHomeBuilding(s,r,c,out,t) {
    const {spend,receive,owner,local,means,site}=t,h=r.home?s.properties[r.home]:t.h;
    const owned=()=>{owner(false);check(c.body.hands>=1||c.body.beak===true||c.body.paws>=2,'use fitting manipulators for this repair');};
    switch(r.type) {
    case 'build':case 'repair':case 'weatherproof': {
        const kind=r.type,id=r.home;check(P[id]&&!P[id].legacy,'choose a supported local structure');
        if(kind==='build'){site();check(B[id]&&!s.properties[id]&&!(id==='tent'&&s.portable),'this actual structure is already held');means(B[id].form);}
        else {owned();check(kind==='repair'?conditionOf(h).integrity<100:!h.weatherproof,'this work is not currently needed');}
        s.projects ||= {};check(!s.projects[id],'resume or cancel the existing project at this structure');
        const materials=kind==='build'?Object.fromEntries(Object.entries(B[id].costs).map(([id,n])=>[k(id),n])):repairMaterials(id);
        for(const [key,n]of Object.entries(materials))spend(key,n);
        const progress=progressKey(id,kind),prior=c.resources?.[progress]||0;
        if(prior)out.simEffects.push({type:'resource',actor:'player',key:progress,amount:-prior});
        out.simEffects.push({type:'fact',scope:'actor',actor:'player',key:permitKey(id,kind),value:true});
        s.projects[id]={home:id,kind,at:c.clock,required:kind==='build'?B[id].minutes:15,materials};s.beginning=false;
        out.message=`Materials reserved at the actual site for ${kind}. Contribute five minutes at a time; completed contributions survive pauses, travel and reload. No housing is granted before completion.`;return true;
    }
    case 'work': {
        const p=s.projects?.[r.home];check(p&&c.location===projectLocation(p),'return to the unfinished work site');
        if(p.kind==='build')means(B[p.home].form);else owned();
        const rain=c.weatherAt?.(c.clock)?.raining===true&&p.kind==='build';
        if(r.shared)check(c.body.form==='human'&&c.people?.[BUILDER]?.location===c.location,'meet the willing builder at this site');
        out.job={id:`${progressKey(p.home,p.kind)}.${r.shared?(rain?'shared_rain':'shared'):(rain?'rain':'solo')}`};
        out.message=`Accepted one ${r.shared?'shared':'individual'} contribution. ${rain?'Rain slows exposed work to ten played minutes.':'Five played minutes of work.'} Pause through Homes before leaving; completed contributions remain.`;return true;
    }
    case 'cancel_work': {const job=c.jobs?.find(j=>j.id===r.job&&j.commandId.startsWith('home.work.')&&j.actorId==='player');check(job,'the accepted home contribution changed');out.job={cancel:job.id};out.message='Current contribution paused. Its exact unearned wage reservation returns; previous completed work remains at the site.';return true;}
    case 'cancel_project': {
        const p=s.projects?.[r.home];check(p&&c.location===projectLocation(p),'return to the actual unfinished structure');check(!c.jobs?.some(j=>j.commandId.startsWith(progressKey(p.home,p.kind)+'.')),'pause the current contribution before abandoning the structure');
        const n=projectProgress(p,c);for(const [key,amount]of Object.entries(p.materials)){const usable=Math.floor(amount*(1-Math.min(1,n/p.required)));if(usable)receive(key,usable);}
        if(n)out.simEffects.push({type:'resource',actor:'player',key:progressKey(p.home,p.kind),amount:-n});out.simEffects.push({type:'fact',scope:'actor',actor:'player',key:permitKey(p.home,p.kind),value:false});delete s.projects[p.home];out.message='Abandoned unfinished work. Unworked material returned; material already fitted or trimmed is left as unusable remnants. No completed home was created.';return true;
    }
    case 'dry_grass': {check((c.inventory[k('Home damp grass')]||0)>0,'carry damp grass to dry');check(!c.weatherAt?.(c.clock)?.raining||!!t.h&&conditionOf(t.h).integrity>=40,'dry grass under a sound roof or during dry weather');spend(k('Home damp grass'),1);receive(k('Home dry grass'));out.minutes=10;out.message='Dried one damp grass bundle over ten played minutes.';return true;}
    case 'pack_home': {
        owned();check(h.id==='tent'&&!s.projects?.tent,'finish or abandon shelter work before packing');check(Object.keys(h.stock).length===0&&Object.keys(h.fixtures).length===0&&!h.household?.animal,'collect goods, pack fixtures and relocate companions before moving the shelter');
        s.portable=h;delete s.properties.tent;if(s.primary==='tent')s.primary=Object.keys(s.properties)[0]||null;receive(k(PACKED_TENT));out.location=h.anchor;out.minutes=5;out.message='Packed the actual shelter. Its condition remains with your kit; goods were collected separately. Carry it to a permitted camp before pitching.';return true;
    }
    case 'pitch_home': {check(c.world==='base.frontier'&&HOME_CAMPS.includes(c.location)&&c.body.hands>=1,'pitch with a usable hand at the willow clearing or Village guest camp');check(s.portable&&!s.properties.tent,'carry your retained packed shelter');spend(k(PACKED_TENT),1);const tent=s.portable;delete s.portable;tent.anchor=c.location;tent.condition.lastClock=c.clock;s.properties.tent=tent;s.primary='tent';out.minutes=5;out.message='Pitched your carried shelter at this permitted camp. Its actual condition and ownership are retained.';return true;}
    default:return false;
    }
}
